-- SPORTLY · esquema Supabase (PREPARADO, NO CONECTADO a la app todavía).
-- Ejecutar en el SQL editor de un proyecto Supabase. Revisar antes de producción.
create extension if not exists btree_gist;

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null, avatar_url text,
  sports text[] default '{}', level text, zone text,
  created_at timestamptz default now()
);
create table monitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users, public_name text not null, bio text,
  sports text[] not null, specialties text[] default '{}', city text, location text,
  languages text[] default '{}', from_price numeric(8,2),
  verification_status text not null default 'unverified' check (verification_status in ('unverified','pending','verified')),
  is_demo boolean not null default false, created_at timestamptz default now()
);
create table videos (
  id uuid primary key default gen_random_uuid(),
  monitor_id uuid not null references monitors on delete cascade,
  url text, caption text, sport text, status text not null default 'draft' check (status in ('draft','published','hidden')),
  published_at timestamptz, is_demo boolean not null default false
);
create table services (
  id uuid primary key default gen_random_uuid(),
  monitor_id uuid not null references monitors on delete cascade,
  name text not null, description text, duration_min int not null check (duration_min > 0),
  price numeric(8,2) not null check (price >= 0), modality text not null, level text,
  status text not null default 'active'
);
create table availability (
  id uuid primary key default gen_random_uuid(),
  monitor_id uuid not null references monitors on delete cascade,
  weekday int not null check (weekday between 1 and 7), start_time time not null, end_time time not null
);
create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users, monitor_id uuid not null references monitors,
  service_id uuid not null references services,
  starts_at timestamptz not null, ends_at timestamptz not null,
  price numeric(8,2) not null,
  status text not null default 'confirmed' check (status in ('pending','confirmed','completed','cancelled')),
  payment_ref text, created_at timestamptz default now(), cancelled_at timestamptz,
  -- La BD impide solapes del mismo monitor: garantía real contra dobles reservas.
  constraint no_overlap exclude using gist (monitor_id with =, tstzrange(starts_at, ends_at) with &&)
    where (status in ('pending','confirmed','completed'))
);
create table reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid unique references bookings, user_id uuid not null references auth.users,
  monitor_id uuid not null references monitors, rating int not null check (rating between 1 and 5),
  comment text, created_at timestamptz default now()
);
create table favorites (
  user_id uuid references auth.users on delete cascade, monitor_id uuid references monitors on delete cascade,
  created_at timestamptz default now(), primary key (user_id, monitor_id)
);
create index on bookings (monitor_id, starts_at); create index on bookings (user_id);
create index on videos (monitor_id); create index on reviews (monitor_id);

-- Row Level Security
alter table profiles enable row level security; alter table monitors enable row level security;
alter table videos enable row level security; alter table services enable row level security;
alter table availability enable row level security; alter table bookings enable row level security;
alter table reviews enable row level security; alter table favorites enable row level security;

create policy "perfil propio" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "monitores públicos" on monitors for select using (true);
create policy "monitor edita lo suyo" on monitors for update using (auth.uid() = user_id);
create policy "vídeos publicados" on videos for select using (status = 'published');
create policy "servicios públicos" on services for select using (status = 'active');
create policy "disponibilidad pública" on availability for select using (true);
create policy "reservas propias (lectura)" on bookings for select using (auth.uid() = user_id);
-- Sin policy de INSERT/UPDATE en bookings: sólo se escribe con las funciones de abajo.
create policy "reseñas públicas" on reviews for select using (true);
create policy "reseña propia" on reviews for insert with check (
  auth.uid() = user_id and exists (select 1 from bookings b where b.id = booking_id and b.user_id = auth.uid() and b.status = 'completed'));
create policy "favoritos propios" on favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Creación segura de reservas (la validación ocurre en el servidor)
create or replace function create_booking(p_service uuid, p_starts timestamptz)
returns bookings language plpgsql security definer set search_path = public as $$
declare s services; b bookings;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select * into s from services where id = p_service and status = 'active';
  if not found then raise exception 'invalid_service'; end if;
  if p_starts < now() + interval '2 hours' then raise exception 'too_soon'; end if;
  -- TODO: comprobar que p_starts cae dentro de `availability` del monitor.
  insert into bookings (user_id, monitor_id, service_id, starts_at, ends_at, price)
  values (auth.uid(), s.monitor_id, s.id, p_starts, p_starts + make_interval(mins => s.duration_min), s.price)
  returning * into b;  -- si solapa, la restricción no_overlap lanza error
  return b;
end $$;

create or replace function cancel_booking(p_id uuid)
returns bookings language plpgsql security definer set search_path = public as $$
declare b bookings;
begin
  update bookings set status = 'cancelled', cancelled_at = now()
   where id = p_id and user_id = auth.uid() and status in ('pending','confirmed')
     and starts_at >= now() + interval '24 hours' returning * into b;
  if not found then raise exception 'not_cancellable'; end if;
  return b;
end $$;
