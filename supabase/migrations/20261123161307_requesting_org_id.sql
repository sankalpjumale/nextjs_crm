-- Returns the Clerk organization id of the ACTIVE organization in the
-- caller's session token, or NULL when there is none.
--   Session token v2 stores it at  o.id
--   Session token v1 stores it at  org_id
-- NULL means "no tenant", and RLS policies comparing against NULL match nothing
-- (fail closed).
create or replace function public.requesting_org_id()
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(
    nullif(auth.jwt() -> 'o' ->> 'id', ''),
    nullif(auth.jwt() ->> 'org_id', '')
  )
$$;

-- Least privilege: only signed-in users' policies need to call this.
revoke execute on function public.requesting_org_id() from public, anon;
grant execute on function public.requesting_org_id() to authenticated;