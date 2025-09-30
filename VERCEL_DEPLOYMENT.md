# 🚀 Vercel + Supabase Entegrasyonu

## 📋 Ön Hazırlık

Local environment dosyası oluşturuldu: `.env.local` ✅

## 🔗 Vercel Deployment Adımları

### 1. Vercel CLI Kurulumu (Eğer yoksa)

```bash
npm i -g vercel
```

### 2. Vercel'e Login

```bash
vercel login
```

### 3. Proje Deployment

```bash
# İlk deployment
vercel

# Production deployment
vercel --prod
```

### 4. Environment Variables Ekleme (Önemli!)

Vercel Dashboard'da veya CLI ile environment variable'ları ekleyin:

#### Yöntem 1: Vercel CLI ile (Otomatik)

```bash
# Production için
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Değer: https://ffozpqvbvjkhgipznrzm.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Değer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmb3pwcXZidmpraGdpcHpucnptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU4MjU3NjEsImV4cCI6MjA1MTQwMTc2MX0.sb_publishable_m-NYuQPcghxM5wD1F6U9hA_Q43B9Iag

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Değer: sb_secret_0bgbKhUbju91hOZ-HioD4Q_LJGwklWt

vercel env add NEXT_PUBLIC_APP_URL production
# Değer: https://your-domain.vercel.app (deployment sonrası alacağınız URL)
```

#### Yöntem 2: Vercel Dashboard'da (Manuel)

1. **https://vercel.com/dashboard** adresine gidin
2. Projenizi seçin
3. **Settings** > **Environment Variables** sekmesine gidin
4. Her bir değişkeni ekleyin:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://ffozpqvbvjkhgipznrzm.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_0bgbKhUbju91hOZ-HioD4Q_LJGwklWt` | Production |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production |

5. **Save** butonuna tıklayın

### 5. Supabase Redirect URLs Güncelleme

Supabase Dashboard'da:

1. **https://supabase.com/dashboard** → Projenizi seçin
2. **Authentication** > **URL Configuration**
3. **Site URL** ekleyin:
   ```
   https://your-domain.vercel.app
   ```
4. **Redirect URLs** ekleyin:
   ```
   https://your-domain.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

### 6. Yeniden Deploy

Environment variable'lar eklendikten sonra:

```bash
vercel --prod
```

## ✅ Kontrol Listesi

- [ ] `.env.local` dosyası oluşturuldu
- [ ] Vercel'e login yapıldı
- [ ] İlk deployment yapıldı
- [ ] Environment variables eklendi
- [ ] Supabase'de redirect URLs güncellendi
- [ ] Production deployment yapıldı
- [ ] Site çalışıyor ve Supabase'e bağlanıyor

## 🧪 Test

Deployment sonrası:

1. `https://your-domain.vercel.app` adresine gidin
2. `/register` sayfasına gidin
3. Kayıt olmayı deneyin
4. Login/logout işlemlerini test edin

## 🔧 Sorun Giderme

### Hata: "Supabase client not initialized"

**Çözüm:** Environment variables'ı kontrol edin ve yeniden deploy edin.

### Hata: "Invalid redirect URL"

**Çözüm:** Supabase Dashboard'da redirect URL'leri güncelleyin.

### Hata: "Authentication failed"

**Çözüm:** 
- Anon key'in doğru olduğundan emin olun
- Supabase RLS policy'lerini kontrol edin

## 📝 Notlar

- `.env.local` dosyası Git'e commit edilmemelidir (`.gitignore` içinde)
- Production ve Development için ayrı environment'lar kullanabilirsiniz
- Service Role Key'i sadece server-side işlemler için kullanın
- Vercel otomatik olarak her push'ta yeniden deploy eder

## 🔗 Faydalı Linkler

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)

