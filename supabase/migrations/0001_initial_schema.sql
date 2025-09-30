-- ==============================================================================
-- OnlineUsta - Complete Database Schema
-- Production-Ready Migration with RLS, Triggers, Functions
-- ==============================================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==============================================================================
-- ENUMS & TYPES
-- ==============================================================================

create type public.user_role as enum ('customer', 'provider');
create type public.provider_kind as enum ('individual', 'company');
create type public.job_status as enum ('open', 'closed', 'awarded', 'cancelled');
create type public.bid_status as enum ('pending', 'accepted', 'rejected', 'withdrawn');
create type public.notification_type as enum (
  'new_job_in_city',
  'new_bid_on_job',
  'bid_accepted',
  'bid_rejected',
  'job_awarded',
  'job_cancelled',
  'system_announcement'
);

-- ==============================================================================
-- TABLES
-- ==============================================================================

-- ----------------------
-- Profiles (Kullanıcı Profilleri)
-- ----------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'customer',
  provider_kind public.provider_kind,
  
  -- Genel bilgiler
  full_name text,
  company_name text,
  tax_id text,
  phone text,
  avatar_url text,
  bio text,
  
  -- İletişim ve adres
  city text,
  district text,
  address text,
  
  -- Ayarlar
  email_notifications boolean not null default true,
  push_notifications boolean not null default true,
  phone_visible boolean not null default false,
  
  -- İstatistikler
  completed_jobs_count int not null default 0,
  average_rating numeric(3,2),
  total_reviews_count int not null default 0,
  
  -- Admin
  is_admin boolean not null default false,
  is_active boolean not null default true,
  is_verified boolean not null default false,
  
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz
);

-- ----------------------
-- Categories (Kategoriler)
-- ----------------------
create table if not exists public.categories (
  id bigserial primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  icon_name text,
  parent_id bigint references public.categories(id) on delete set null,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------
-- Service Areas (Hizmet Bölgeleri)
-- ----------------------
create table if not exists public.service_areas (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  city text not null,
  district text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id, city, district)
);

-- ----------------------
-- Jobs (İlanlar)
-- ----------------------
create table if not exists public.jobs (
  id bigserial primary key,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  
  -- İlan detayları
  title text not null,
  description text not null,
  category_id bigint references public.categories(id) on delete set null,
  
  -- Lokasyon
  city text not null,
  district text,
  address_detail text,
  
  -- Bütçe
  budget_min numeric(10,2),
  budget_max numeric(10,2),
  budget_currency text not null default 'TRY',
  
  -- Durum ve istatistikler
  status public.job_status not null default 'open',
  bid_count int not null default 0,
  view_count int not null default 0,
  
  -- Tarihler
  expires_at timestamptz,
  awarded_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Arama için
  search_vector tsvector
);

-- ----------------------
-- Bids (Teklifler)
-- ----------------------
create table if not exists public.bids (
  id bigserial primary key,
  job_id bigint not null references public.jobs(id) on delete cascade,
  provider_id uuid not null references public.profiles(id) on delete cascade,
  
  -- Teklif detayları
  amount numeric(10,2) not null,
  currency text not null default 'TRY',
  message text not null,
  
  -- Durum
  status public.bid_status not null default 'pending',
  
  -- Teklif süresi (gün)
  delivery_days int,
  
  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  responded_at timestamptz,
  
  unique(job_id, provider_id)
);

-- ----------------------
-- Notifications (Bildirimler)
-- ----------------------
create table if not exists public.notifications (
  id bigserial primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  message text not null,
  payload jsonb,
  link_url text,
  is_read boolean not null default false,
  is_sent_email boolean not null default false,
  is_sent_push boolean not null default false,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

-- ----------------------
-- Reviews (Değerlendirmeler) - İleride aktif olacak
-- ----------------------
create table if not exists public.reviews (
  id bigserial primary key,
  job_id bigint not null references public.jobs(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewed_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(job_id, reviewer_id, reviewed_id)
);

-- ----------------------
-- Settings (Sistem Ayarları)
-- ----------------------
create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================

-- Profiles
create index idx_profiles_role on public.profiles(role) where is_active = true;
create index idx_profiles_city on public.profiles(city) where is_active = true;

-- Service Areas
create index idx_service_areas_user on public.service_areas(user_id);
create index idx_service_areas_city on public.service_areas(city, district) where is_active = true;

-- Jobs
create index idx_jobs_customer on public.jobs(customer_id, created_at desc);
create index idx_jobs_status on public.jobs(status, created_at desc);
create index idx_jobs_city on public.jobs(city, district, status);
create index idx_jobs_category on public.jobs(category_id, status);
create index idx_jobs_search on public.jobs using gin(search_vector);

-- Bids
create index idx_bids_job on public.bids(job_id, created_at desc);
create index idx_bids_provider on public.bids(provider_id, created_at desc);
create index idx_bids_status on public.bids(status);

-- Notifications
create index idx_notifications_user on public.notifications(user_id, created_at desc);
create index idx_notifications_unread on public.notifications(user_id, is_read) where is_read = false;

-- ==============================================================================
-- FUNCTIONS
-- ==============================================================================

-- Updated at trigger function
create or replace function public.update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Search vector update
create or replace function public.jobs_search_vector_update()
returns trigger language plpgsql as $$
begin
  new.search_vector := 
    setweight(to_tsvector('turkish', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('turkish', coalesce(new.description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(new.city, '')), 'C');
  return new;
end;
$$;

-- Günlük teklif limiti kontrolü
create or replace function public.check_daily_bid_limit()
returns trigger language plpgsql as $$
declare
  daily_count int;
  limit_value int := 3; -- .env'den alınacak
begin
  select count(*) into daily_count
  from public.bids
  where provider_id = new.provider_id
    and (created_at at time zone 'Europe/Istanbul')::date = 
        (now() at time zone 'Europe/Istanbul')::date;
  
  if daily_count >= limit_value then
    raise exception 'Günlük teklif limitine ulaştınız (% adet). Yarın tekrar deneyiniz.', limit_value;
  end if;
  
  return new;
end;
$$;

-- Günlük ilan limiti ve 7 gün kuralı
create or replace function public.check_job_creation_rules()
returns trigger language plpgsql as $$
declare
  daily_count int;
  last_job_date timestamptz;
  days_diff numeric;
begin
  -- Günlük 1 ilan kontrolü
  select count(*) into daily_count
  from public.jobs
  where customer_id = new.customer_id
    and (created_at at time zone 'Europe/Istanbul')::date = 
        (now() at time zone 'Europe/Istanbul')::date;
  
  if daily_count >= 1 then
    raise exception 'Bugün zaten bir ilan yayınladınız. Günlük ilan limiti: 1';
  end if;
  
  -- 7 gün kuralı
  select max(created_at) into last_job_date
  from public.jobs
  where customer_id = new.customer_id;
  
  if last_job_date is not null then
    days_diff := extract(epoch from (now() - last_job_date)) / 86400;
    if days_diff < 7 then
      raise exception 'Yeni ilan oluşturmak için son ilandan itibaren en az 7 gün beklemelisiniz. Kalan: % gün', 
        ceil(7 - days_diff);
    end if;
  end if;
  
  return new;
end;
$$;

-- Teklif sayacı artırma
create or replace function public.increment_bid_count()
returns trigger language plpgsql as $$
begin
  update public.jobs 
  set bid_count = bid_count + 1 
  where id = new.job_id;
  return new;
end;
$$;

-- Teklif sayacı azaltma
create or replace function public.decrement_bid_count()
returns trigger language plpgsql as $$
begin
  update public.jobs 
  set bid_count = greatest(bid_count - 1, 0) 
  where id = old.job_id;
  return old;
end;
$$;

-- Yeni ilan bildirim fonksiyonu
create or replace function public.notify_providers_of_new_job()
returns trigger language plpgsql as $$
begin
  -- Aynı şehirde hizmet veren provider'lara bildirim gönder
  insert into public.notifications (user_id, type, title, message, payload, link_url)
  select 
    distinct sa.user_id,
    'new_job_in_city'::public.notification_type,
    'Bölgenizde yeni ilan!',
    format('%s - %s, %s', new.title, new.city, coalesce(new.district, '')),
    jsonb_build_object(
      'job_id', new.id,
      'city', new.city,
      'district', new.district,
      'budget_min', new.budget_min,
      'budget_max', new.budget_max
    ),
    format('/jobs/%s', new.id)
  from public.service_areas sa
  join public.profiles p on p.id = sa.user_id
  where sa.city = new.city
    and (sa.district is null or sa.district = new.district or new.district is null)
    and sa.is_active = true
    and p.role = 'provider'
    and p.is_active = true
    and p.push_notifications = true;
  
  return new;
end;
$$;

-- Yeni teklif bildirim fonksiyonu
create or replace function public.notify_customer_of_new_bid()
returns trigger language plpgsql as $$
declare
  job_record record;
  provider_name text;
begin
  -- İlan bilgilerini al
  select j.*, p.full_name, p.company_name
  into job_record
  from public.jobs j
  join public.profiles p on p.id = new.provider_id
  where j.id = new.job_id;
  
  provider_name := coalesce(job_record.company_name, job_record.full_name, 'Bir hizmet veren');
  
  -- Müşteriye bildirim gönder
  insert into public.notifications (user_id, type, title, message, payload, link_url)
  values (
    job_record.customer_id,
    'new_bid_on_job'::public.notification_type,
    'İlanınıza yeni teklif geldi!',
    format('%s ilanınıza %s TL teklif verdi', provider_name, new.amount),
    jsonb_build_object(
      'job_id', new.job_id,
      'bid_id', new.id,
      'amount', new.amount,
      'provider_id', new.provider_id
    ),
    format('/jobs/%s', new.job_id)
  );
  
  return new;
end;
$$;

-- ==============================================================================
-- TRIGGERS
-- ==============================================================================

-- Updated at triggers
create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.update_updated_at_column();

create trigger trg_jobs_updated_at before update on public.jobs
for each row execute function public.update_updated_at_column();

create trigger trg_bids_updated_at before update on public.bids
for each row execute function public.update_updated_at_column();

-- Search vector trigger
create trigger trg_jobs_search_vector before insert or update on public.jobs
for each row execute function public.jobs_search_vector_update();

-- Business rules triggers
create trigger trg_check_daily_bid_limit before insert on public.bids
for each row execute function public.check_daily_bid_limit();

create trigger trg_check_job_creation before insert on public.jobs
for each row execute function public.check_job_creation_rules();

-- Counter triggers
create trigger trg_increment_bid_count after insert on public.bids
for each row execute function public.increment_bid_count();

create trigger trg_decrement_bid_count after delete on public.bids
for each row execute function public.decrement_bid_count();

-- Notification triggers
create trigger trg_notify_new_job after insert on public.jobs
for each row execute function public.notify_providers_of_new_job();

create trigger trg_notify_new_bid after insert on public.bids
for each row execute function public.notify_customer_of_new_bid();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.service_areas enable row level security;
alter table public.jobs enable row level security;
alter table public.bids enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.settings enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can view active provider profiles"
  on public.profiles for select
  using (role = 'provider' and is_active = true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Categories policies (public read)
create policy "Anyone can view active categories"
  on public.categories for select
  using (is_active = true);

-- Service areas policies
create policy "Providers can manage own service areas"
  on public.service_areas for all
  using (user_id = auth.uid());

create policy "Anyone can view active service areas"
  on public.service_areas for select
  using (is_active = true);

-- Jobs policies
create policy "Anyone can view open jobs"
  on public.jobs for select
  using (status = 'open' or customer_id = auth.uid());

create policy "Customers can create jobs"
  on public.jobs for insert
  with check (
    customer_id = auth.uid() and 
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'customer'
    )
  );

create policy "Job owners can update their jobs"
  on public.jobs for update
  using (customer_id = auth.uid());

create policy "Job owners can delete their jobs"
  on public.jobs for delete
  using (customer_id = auth.uid());

-- Bids policies
create policy "Providers can view own bids"
  on public.bids for select
  using (provider_id = auth.uid());

create policy "Job owners can view all bids on their jobs"
  on public.bids for select
  using (
    exists (
      select 1 from public.jobs 
      where id = bids.job_id and customer_id = auth.uid()
    )
  );

create policy "Providers can create bids"
  on public.bids for insert
  with check (
    provider_id = auth.uid() and
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'provider'
    )
  );

create policy "Providers can update own bids"
  on public.bids for update
  using (provider_id = auth.uid());

-- Notifications policies
create policy "Users can view own notifications"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "Users can update own notifications"
  on public.notifications for update
  using (user_id = auth.uid());

-- Reviews policies (future)
create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Job participants can create reviews"
  on public.reviews for insert
  with check (reviewer_id = auth.uid());

-- Settings policies (admin only)
create policy "Admins can manage settings"
  on public.settings for all
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and is_admin = true
    )
  );

-- ==============================================================================
-- SEED DATA
-- ==============================================================================

-- Varsayılan kategoriler
insert into public.categories (name, slug, description, icon_name, display_order) values
('Elektrik', 'elektrik', 'Elektrik tesisatı, arıza, tadilat', 'Zap', 1),
('Tesisat', 'tesisat', 'Su, doğalgaz, ısıtma tesisatı', 'Wrench', 2),
('Boya Badana', 'boya-badana', 'İç ve dış boya işleri', 'Paintbrush', 3),
('Tamir', 'tamir', 'Ev eşyası ve cihaz tamiri', 'Settings', 4),
('Nakliyat', 'nakliyat', 'Ev ve ofis taşıma', 'Truck', 5),
('Temizlik', 'temizlik', 'Ev, ofis, inşaat temizliği', 'Sparkles', 6),
('Bahçe Düzenlemesi', 'bahce-duzenleme', 'Peyzaj, çim, budama', 'Trees', 7),
('Cam Balkon', 'cam-balkon', 'Cam balkon montajı ve tamiri', 'Home', 8),
('Klima', 'klima', 'Klima montaj, bakım, tamir', 'Wind', 9),
('Beyaz Eşya', 'beyaz-esya', 'Beyaz eşya kurulum ve tamir', 'Package', 10)
on conflict (slug) do nothing;

-- Sistem ayarları
insert into public.settings (key, value, description) values
('max_daily_bids_per_provider', '3', 'Hizmet verenin günlük maksimum teklif sayısı'),
('max_daily_jobs_per_customer', '1', 'Müşterinin günlük maksimum ilan sayısı'),
('min_days_between_jobs', '7', 'İlanlar arası minimum gün sayısı'),
('job_expiry_days', '30', 'İlan geçerlilik süresi (gün)')
on conflict (key) do nothing;

-- ==============================================================================
-- VIEWS (Opsiyonel - raporlama için)
-- ==============================================================================

create or replace view public.jobs_with_details as
select 
  j.*,
  p.full_name as customer_name,
  p.company_name as customer_company,
  p.phone as customer_phone,
  c.name as category_name,
  c.slug as category_slug
from public.jobs j
left join public.profiles p on p.id = j.customer_id
left join public.categories c on c.id = j.category_id;

-- ==============================================================================
-- COMPLETED
-- ==============================================================================

-- Migration tamamlandı
comment on schema public is 'OnlineUsta database schema v1.0.0';
