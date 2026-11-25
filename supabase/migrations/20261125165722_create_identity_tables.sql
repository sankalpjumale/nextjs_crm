-- USERS: global (a person can belong to many organizations)
create table public.users (
  id            text primary key,          -- Clerk user id (user_...)
  email         text,
  first_name    text,
  last_name     text,
  image_url     text,
  last_event_at timestamptz not null,      -- Clerk event clock; epoch means "stub, real event not received yet"
  deleted_at    timestamptz,               -- tombstone
  created_at    timestamptz not null default now()
);
alter table public.users enable row level security;

-- ORGANIZATIONS: the tenant itself, so its id is the tenant key
create table public.organizations (
  id            text primary key,          -- Clerk org id (org_...)
  name          text not null default '',  -- '' means not received yet (stub)
  slug          text,
  image_url     text,
  last_event_at timestamptz not null,
  deleted_at    timestamptz,
  created_at    timestamptz not null default now()
);
alter table public.organizations enable row level security;

-- MEMBERSHIPS: which user belongs to which organization
create table public.organization_memberships (
  id              text primary key,        -- Clerk membership id (orgmem_...)
  organization_id text not null references public.organizations (id),
  user_id         text not null references public.users (id),
  role            text not null,           -- stored as Clerk sends it; normalized in Version 39
  last_event_at   timestamptz not null,
  deleted_at      timestamptz,
  created_at      timestamptz not null default now()
);
alter table public.organization_memberships enable row level security;

-- One ACTIVE membership per (organization, user)
create unique index organization_memberships_active_org_user_key
  on public.organization_memberships (organization_id, user_id)
  where deleted_at is null;

-- Supports the users policy lookup and "which orgs is this user in"
create index organization_memberships_user_org_idx
  on public.organization_memberships (user_id, organization_id);

-- RLS: read-only for members of the ACTIVE organization (from the verified token)
create policy "organizations: read own active organization"
  on public.organizations for select to authenticated
  using (id = (select public.requesting_org_id()) and deleted_at is null);

create policy "memberships: read memberships of active organization"
  on public.organization_memberships for select to authenticated
  using (organization_id = (select public.requesting_org_id()));

create policy "users: read self or users linked to active organization"
  on public.users for select to authenticated
  using (
    id = (select public.requesting_user_id())
    or exists (
      select 1
      from public.organization_memberships m
      where m.user_id = users.id
        and m.organization_id = (select public.requesting_org_id())
    )
  );

-- GRANTS: privileges are a separate lock from RLS
revoke all on table public.users, public.organizations, public.organization_memberships
  from anon, authenticated;

grant select on table public.users, public.organizations, public.organization_memberships
  to authenticated;

grant select, insert, update, delete
  on table public.users, public.organizations, public.organization_memberships
  to service_role;