-- ============================================
-- RLS Policy Düzeltmeleri - YENİ PROJE İÇİN
-- ============================================

-- Mevcut policy'leri temizle
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can do everything" ON public.profiles;

-- 1. Profil Görüntüleme: Herkes tüm profilleri görebilir
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles 
  FOR SELECT
  USING (true);

-- 2. Profil Oluşturma: Kullanıcı kendi profilini oluşturabilir
CREATE POLICY "Users can insert own profile"
  ON public.profiles 
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Profil Güncelleme: Kullanıcı kendi profilini güncelleyebilir
CREATE POLICY "Users can update own profile"
  ON public.profiles 
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Admin yetkisi
CREATE POLICY "Admins can do everything"
  ON public.profiles 
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- Otomatik Profil Oluşturma Trigger
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    role, 
    full_name, 
    phone,
    email_notifications,
    push_notifications
  )
  VALUES (
    NEW.id,
    'customer',
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    true,
    true
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Permissions
-- ============================================

GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- ============================================
-- Test
-- ============================================

SELECT 'RLS Policies başarıyla kuruldu! ✅' as status;

