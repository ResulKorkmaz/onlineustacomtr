# ⚡ Hızlı Database Kurulumu

## 🚨 Hata: "relation public.profiles does not exist"

Bu hata, database tablolarının henüz oluşturulmadığını gösterir.

## ✅ Çözüm - 2 Yöntem

### Yöntem 1: Dosyadan Direkt Upload (En Kolay)

1. **https://supabase.com/dashboard** → Projenize gidin
2. Sol menüden **SQL Editor** sekmesine tıklayın
3. Sağ üstten **+ New query** butonuna tıklayın
4. Sol üstteki **Import SQL** butonuna tıklayın
5. Bilgisayarınızdan bu dosyayı seçin:
   ```
   supabase/migrations/0001_initial_schema.sql
   ```
6. **RUN** butonuna tıklayın

### Yöntem 2: Manuel Copy-Paste

1. Bilgisayarınızda bu dosyayı açın:
   ```
   /Users/resulkorkmaz/Downloads/web/onlineusta.com.tr/supabase/migrations/0001_initial_schema.sql
   ```

2. Dosyanın **TÜM İÇERİĞİNİ** kopyalayın (Cmd+A → Cmd+C)

3. **https://supabase.com/dashboard** → SQL Editor'da **+ New query**

4. Kopyaladığınız SQL'i yapıştırın (Cmd+V)

5. **RUN** butonuna tıklayın

6. İşlem tamamlanınca (10-15 saniye sürebilir) "Success" mesajı görmelisiniz ✅

## 📋 Sıra ile Ne Olacak?

1. ✅ Tablolar oluşturulacak (profiles, jobs, bids, notifications, vb.)
2. ✅ RLS Policy'ler kurulacak
3. ✅ Trigger'lar eklenecek
4. ✅ Index'ler oluşturulacak

## 🧪 Kurulumu Kontrol Edin

SQL çalıştıktan sonra:

1. Sol menüden **Table Editor** sekmesine gidin
2. Şu tabloları görmeli siniz:
   - ✅ profiles
   - ✅ categories
   - ✅ jobs
   - ✅ bids
   - ✅ notifications
   - ✅ reviews
   - ✅ service_areas

## 🔄 Sonraki Adım

Tablolar oluşturulduktan sonra, daha önce verdiğim **RLS Policy düzeltme SQL'ini** çalıştırın:

```sql
-- RLS Policy'leri düzelt
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);
```

## ✅ Tamamdır!

Artık kayıt sistemi çalışmalı! 🎉

Test için: `http://localhost:3000/register`

