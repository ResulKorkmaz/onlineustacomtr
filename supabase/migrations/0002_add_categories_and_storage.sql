-- ==============================================================================
-- Kategori ve Belge Depolama İçin Ek Yapılar
-- ==============================================================================

-- Provider kategorileri için tablo
create table if not exists public.provider_categories (
  id bigserial primary key,
  provider_id uuid not null references public.profiles(id) on delete cascade,
  category_slug text not null,
  category_name text not null,
  created_at timestamptz default now()
);

-- Index'ler
create index if not exists idx_provider_categories_provider 
  on public.provider_categories(provider_id);

create index if not exists idx_provider_categories_slug 
  on public.provider_categories(category_slug);

-- RLS Policies
alter table public.provider_categories enable row level security;

-- Herkes provider kategorilerini görebilir
create policy "Provider categories are viewable by everyone"
  on public.provider_categories for select
  using (true);

-- Provider'lar kendi kategorilerini ekleyebilir/güncelleyebilir/silebilir
create policy "Providers can manage their own categories"
  on public.provider_categories for all
  using (auth.uid() = provider_id)
  with check (auth.uid() = provider_id);

-- ==============================================================================
-- Storage Buckets
-- ==============================================================================

-- Belge yükleme için storage bucket (SQL ile bucket oluşturulamaz, UI'dan yapılmalı)
-- Supabase Dashboard > Storage > Create Bucket:
-- - Name: documents
-- - Public: false (private)
-- - File size limit: 5MB
-- - Allowed MIME types: application/pdf, image/jpeg, image/png

-- Storage policies (bucket oluşturulduktan sonra)
-- Not: Bu policy'ler Supabase Dashboard'dan manuel olarak eklenmelidir:

-- 1. Upload policy:
-- CREATE POLICY "Users can upload documents"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 2. Download policy (sadece kendi belgelerini):
-- CREATE POLICY "Users can download own documents"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Admin download policy:
-- CREATE POLICY "Admins can view all documents"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'documents' AND 
--        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- ==============================================================================
-- Helper Functions
-- ==============================================================================

-- Provider kategorilerini getir
create or replace function public.get_provider_categories(provider_uuid uuid)
returns table (
  category_slug text,
  category_name text
) 
language sql
security definer
as $$
  select category_slug, category_name
  from public.provider_categories
  where provider_id = provider_uuid;
$$;

-- Kategori ekle/güncelle
create or replace function public.upsert_provider_categories(
  provider_uuid uuid,
  categories jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  -- Önce mevcut kategorileri sil
  delete from public.provider_categories
  where provider_id = provider_uuid;
  
  -- Yeni kategorileri ekle
  insert into public.provider_categories (provider_id, category_slug, category_name)
  select 
    provider_uuid,
    value->>'slug',
    value->>'name'
  from jsonb_array_elements(categories);
end;
$$;

-- Grant permissions
grant execute on function public.get_provider_categories to authenticated;
grant execute on function public.upsert_provider_categories to authenticated;

-- ==============================================================================
-- Comments
-- ==============================================================================

comment on table public.provider_categories is 'Provider kullanıcılarının hizmet kategorileri';
comment on function public.get_provider_categories is 'Bir provider için kategorileri getirir';
comment on function public.upsert_provider_categories is 'Provider kategorilerini günceller';

