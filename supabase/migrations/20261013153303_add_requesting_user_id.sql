-- Returns the Clerk user id of the caller, taken from the verified token's
-- "sub" claim. NULL when the request is anonymous.
-- Policies and columns like created_by will use this one function instead of
-- repeating raw JWT parsing everywhere.

create or replace function public.requesting_user_id()
returns text
language sql
stable
security invoker
set search_path = ''
as $$
  select nullif(auth.jwt() ->> 'sub', '');
$$;

revoke all on function public.requesting_user_id() from public;
grant execute on function public.requesting_user_id() to anon, authenticated;