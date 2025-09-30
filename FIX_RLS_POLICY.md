# 🔧 RLS Policy Hatası Çözümü

## Hata
```
new row violates row-level security policy for table "profiles"
```

## Çözüm

### Yöntem 1: Supabase CLI ile (Önerilen)

```bash
# Migration'ı çalıştır
supabase migration up
```

### Yöntem 2: Supabase Dashboard ile

1. [Supabase Dashboard](https://supabase.com/dashboard) → Projenize girin
2. **SQL Editor** sekmesine gidin
3. Aşağıdaki SQL'i çalıştırın:

```sql
-- Mevcut policy'leri sil
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Yeni policy'leri oluştur
-- 1. Herkes profilleri görebilir
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

-- 4. Otomatik profil oluşturma
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, phone)
  VALUES (
    NEW.id,
    'customer',
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
```

4. **RUN** butonuna tıklayın

## Ne Değişti?

✅ Kullanıcılar artık kendi profillerini oluşturabilir  
✅ Kullanıcılar kendi profillerini güncelleyebilir  
✅ Herkes tüm profilleri görüntüleyebilir (hizmet veren araması için)  
✅ Yeni kullanıcı kaydolduğunda otomatik profil oluşturulur  

## Test

1. Çıkış yapın (eğer giriş yaptıysanız)
2. `/register` sayfasına gidin
3. Formu doldurup kayıt olun
4. Hata almamalısınız ✅

## Sorun Devam Ederse

Supabase Dashboard'da:
1. **Authentication** > **Policies** 
2. `profiles` tablosunu kontrol edin
3. Yukarıdaki 3 policy'nin mevcut olduğundan emin olun

