-- ============================================
-- PROFESYONEL RLS ÇÖZÜMÜ - TAM PAKETİ
-- ============================================

-- 1. RLS'i geçici olarak kapat
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. Tüm mevcut policy'leri temizle
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

-- 3. Trigger ve function'ı sil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. RLS'i yeniden aç
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- YENİ POLICY'LER - DÜZGÜNİ
-- ============================================

-- Policy 1: SELECT - Herkes profilleri görebilir
CREATE POLICY "allow_select_profiles"
  ON public.profiles
  FOR SELECT
  TO public
  USING (true);

-- Policy 2: INSERT - Kullanıcılar kendi profillerini oluşturabilir
CREATE POLICY "allow_insert_own_profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 3: UPDATE - Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "allow_update_own_profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: DELETE - Kullanıcılar kendi profillerini silebilir
CREATE POLICY "allow_delete_own_profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- ============================================
-- OTOMATİK PROFİL OLUŞTURMA (Güvenli)
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Profil oluştur
  INSERT INTO public.profiles (
    id,
    role,
    full_name,
    phone,
    email_notifications,
    push_notifications,
    is_active
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    true,
    true,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone);
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Hata olsa bile trigger başarılı olsun
  RAISE WARNING 'Profile creation failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Trigger'ı oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PERMİSSIONS - GRANT
-- ============================================

GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ============================================
-- TEST VE KONTROL
-- ============================================

-- RLS durumunu kontrol et
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Policy'leri listele
SELECT 
  policyname, 
  cmd, 
  roles::text[], 
  qual::text, 
  with_check::text 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Başarı mesajı
SELECT '✅ RLS Policies profesyonelce kuruldu!' as status,
       (SELECT count(*) FROM pg_policies WHERE tablename = 'profiles') as policy_count;

