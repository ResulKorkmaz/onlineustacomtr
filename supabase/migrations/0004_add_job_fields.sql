-- ==============================================================================
-- İlan tablosuna eksik alanları ekle
-- ==============================================================================

-- Category text alanı ekle (basit kategori adı için)
alter table public.jobs add column if not exists category text;

-- İş tarihi ve saati
alter table public.jobs add column if not exists job_date date;
alter table public.jobs add column if not exists job_time time;

-- Sadece fiyat araştırması flag'i
alter table public.jobs add column if not exists only_price_research boolean default false;

-- Index ekle
create index if not exists idx_jobs_category_text on public.jobs(category) where status = 'open';
create index if not exists idx_jobs_date on public.jobs(job_date) where status = 'open';

-- Yorum ekle
comment on column public.jobs.category is 'Hizmet kategorisi (text olarak)';
comment on column public.jobs.job_date is 'İşin yapılması istenen tarih';
comment on column public.jobs.job_time is 'İşin yapılması istenen saat';
comment on column public.jobs.only_price_research is 'Sadece fiyat araştırması yapılıyor mu?';

