--readiness probe used by GET /api/health/ready.
--function (not a table) because we have no tables yet, and calling it
--is a real round trip: app -> PostgREST -> Postgres -> back.

create or replace function public.db_health()
returns timestamptz
language sql
stable
security invoker
set search_path = ''
as $$
  select now();
$$;

--be explicit about who may call it instead of relying on default privileges.
revoke all on function public.db_health() from public;
grant execute on function public.db_health() to anon, authenticated;