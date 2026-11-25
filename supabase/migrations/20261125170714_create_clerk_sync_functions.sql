-- USER upsert
create function public.sync_user_upsert(
  p_id          text,
  p_event_at    timestamptz,
  p_email       text default null,
  p_first_name  text default null,
  p_last_name   text default null,
  p_image_url   text default null
)
returns void
language plpgsql
set search_path = ''
as $$
begin
  insert into public.users as u (id, email, first_name, last_name, image_url, last_event_at)
  values (p_id, p_email, p_first_name, p_last_name, p_image_url, p_event_at)
  on conflict (id) do update
    set email         = excluded.email,
        first_name    = excluded.first_name,
        last_name     = excluded.last_name,
        image_url     = excluded.image_url,
        last_event_at = excluded.last_event_at
    where u.deleted_at is null                      -- tombstones are permanent
      and u.last_event_at <= excluded.last_event_at; -- ignore stale events
end;
$$;

-- USER delete: tombstone, scrub personal data, end their memberships (one transaction)
create function public.sync_user_delete(p_id text, p_event_at timestamptz)
returns void
language plpgsql
set search_path = ''
as $$
begin
  insert into public.users as u (id, last_event_at, deleted_at)
  values (p_id, p_event_at, p_event_at)
  on conflict (id) do update
    set email = null, first_name = null, last_name = null, image_url = null,
        deleted_at    = excluded.deleted_at,
        last_event_at = greatest(u.last_event_at, excluded.last_event_at)
    where u.deleted_at is null;

  update public.organization_memberships
     set deleted_at    = p_event_at,
         last_event_at = greatest(last_event_at, p_event_at)
   where user_id = p_id and deleted_at is null;
end;
$$;

-- ORGANIZATION upsert
create function public.sync_organization_upsert(
  p_id        text,
  p_event_at  timestamptz,
  p_name      text,
  p_slug      text default null,
  p_image_url text default null
)
returns void
language plpgsql
set search_path = ''
as $$
begin
  insert into public.organizations as o (id, name, slug, image_url, last_event_at)
  values (p_id, p_name, p_slug, p_image_url, p_event_at)
  on conflict (id) do update
    set name          = excluded.name,
        slug          = excluded.slug,
        image_url     = excluded.image_url,
        last_event_at = excluded.last_event_at
    where o.deleted_at is null
      and o.last_event_at <= excluded.last_event_at;
end;
$$;

-- ORGANIZATION delete: tombstone it and end all its memberships
create function public.sync_organization_delete(p_id text, p_event_at timestamptz)
returns void
language plpgsql
set search_path = ''
as $$
begin
  insert into public.organizations as o (id, last_event_at, deleted_at)
  values (p_id, p_event_at, p_event_at)
  on conflict (id) do update
    set deleted_at    = excluded.deleted_at,
        last_event_at = greatest(o.last_event_at, excluded.last_event_at)
    where o.deleted_at is null;

  update public.organization_memberships
     set deleted_at    = p_event_at,
         last_event_at = greatest(last_event_at, p_event_at)
   where organization_id = p_id and deleted_at is null;
end;
$$;

-- MEMBERSHIP upsert: stub missing parents, skip tombstoned parents, then upsert
create function public.sync_membership_upsert(
  p_id              text,
  p_organization_id text,
  p_user_id         text,
  p_role            text,
  p_event_at        timestamptz
)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_epoch constant timestamptz := '1970-01-01 00:00:00+00';
begin
  insert into public.organizations (id, last_event_at)
  values (p_organization_id, v_epoch) on conflict (id) do nothing;

  insert into public.users (id, last_event_at)
  values (p_user_id, v_epoch) on conflict (id) do nothing;

  -- A late event must not attach someone to a deleted org or deleted user
  if exists (select 1 from public.organizations where id = p_organization_id and deleted_at is not null)
     or exists (select 1 from public.users where id = p_user_id and deleted_at is not null) then
    return;
  end if;

  insert into public.organization_memberships as m
    (id, organization_id, user_id, role, last_event_at)
  values (p_id, p_organization_id, p_user_id, p_role, p_event_at)
  on conflict (id) do update
    set role          = excluded.role,
        last_event_at = excluded.last_event_at
    where m.deleted_at is null
      and m.last_event_at <= excluded.last_event_at;
end;
$$;

-- MEMBERSHIP delete: terminal, so no timestamp comparison
create function public.sync_membership_delete(
  p_id              text,
  p_organization_id text,
  p_user_id         text,
  p_role            text,
  p_event_at        timestamptz
)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_epoch constant timestamptz := '1970-01-01 00:00:00+00';
begin
  insert into public.organizations (id, last_event_at)
  values (p_organization_id, v_epoch) on conflict (id) do nothing;

  insert into public.users (id, last_event_at)
  values (p_user_id, v_epoch) on conflict (id) do nothing;

  insert into public.organization_memberships as m
    (id, organization_id, user_id, role, last_event_at, deleted_at)
  values (p_id, p_organization_id, p_user_id, p_role, p_event_at, p_event_at)
  on conflict (id) do update
    set deleted_at    = excluded.deleted_at,
        last_event_at = greatest(m.last_event_at, excluded.last_event_at)
    where m.deleted_at is null;
end;
$$;

-- LOCK DOWN: only the secret-key role may execute these
revoke execute on function public.sync_user_upsert(text, timestamptz, text, text, text, text)
  from public, anon, authenticated;
revoke execute on function public.sync_user_delete(text, timestamptz)
  from public, anon, authenticated;
revoke execute on function public.sync_organization_upsert(text, timestamptz, text, text, text)
  from public, anon, authenticated;
revoke execute on function public.sync_organization_delete(text, timestamptz)
  from public, anon, authenticated;
revoke execute on function public.sync_membership_upsert(text, text, text, text, timestamptz)
  from public, anon, authenticated;
revoke execute on function public.sync_membership_delete(text, text, text, text, timestamptz)
  from public, anon, authenticated;

grant execute on function public.sync_user_upsert(text, timestamptz, text, text, text, text) to service_role;
grant execute on function public.sync_user_delete(text, timestamptz) to service_role;
grant execute on function public.sync_organization_upsert(text, timestamptz, text, text, text) to service_role;
grant execute on function public.sync_organization_delete(text, timestamptz) to service_role;
grant execute on function public.sync_membership_upsert(text, text, text, text, timestamptz) to service_role;
grant execute on function public.sync_membership_delete(text, text, text, text, timestamptz) to service_role;