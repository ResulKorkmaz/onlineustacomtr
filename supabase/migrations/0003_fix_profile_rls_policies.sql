-- ==============================================================================
-- Profile RLS Policy Düzeltmeleri
-- Kullanıcılar kendi profillerini oluşturabilsin ve güncelleyebilsin
-- ==============================================================================

-- Önce mevcut policy'leri kontrol edelim ve gerekirse silelim
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 1. Herkes profilleri görebilir (public view)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- 2. Kullanıcılar kendi profillerini oluşturabilir
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Kullanıcılar kendi profillerini güncelleyebilir
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Admin'ler tüm profilleri görebilir ve düzenleyebilir
CREATE POLICY "Admins can do everything"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ==============================================================================
-- Trigger: Yeni kullanıcı kaydolduğunda otomatik profil oluştur
-- ==============================================================================

-- Önce varsa sil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Yeni kullanıcı için otomatik profil oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (
    NEW.id,
    'customer', -- Varsayılan olarak customer
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı oluştur
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- Grant Permissions
-- ==============================================================================

GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- ==============================================================================
-- Comments
-- ==============================================================================

COMMENT ON POLICY "Profiles are viewable by everyone" ON public.profiles 
  IS 'Tüm kullanıcılar profilleri görüntüleyebilir';

COMMENT ON POLICY "Users can insert own profile" ON public.profiles 
  IS 'Kullanıcılar kendi profillerini oluşturabilir';

COMMENT ON POLICY "Users can update own profile" ON public.profiles 
  IS 'Kullanıcılar kendi profillerini güncelleyebilir';

COMMENT ON FUNCTION public.handle_new_user() 
  IS 'Yeni kullanıcı kaydolduğunda otomatik profil oluşturur';

