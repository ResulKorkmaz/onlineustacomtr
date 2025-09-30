# 🔑 Doğru Supabase Key'leri Alma

## ❌ Sorun
"Failed to fetch" hatası - Yanlış API key'leri kullanılıyor!

## ✅ Çözüm - Doğru Key'leri Alın

### 1. Supabase Settings'e Gidin

1. **https://supabase.com/dashboard** → Projenize gidin
2. Sol alttaki **⚙️ Settings** (Ayarlar) ikonuna tıklayın
3. **API** sekmesine tıklayın

### 2. Doğru Key'leri Kopyalayın

Şu 2 key'i göreceksiniz:

#### A) Project URL
```
https://ffozpqvbvjkhgipznrzm.supabase.co
```
✅ Bu doğru

#### B) anon / public key (İkinci key - uzun JWT token)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```
⚠️ Bu **"anon public"** yazısının altındaki **uzun JWT token**
❌ `sb_publishable_m-...` ile başlayan publishable key DEĞİL!

#### C) service_role key (Üçüncü key - gizli)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```
⚠️ Bu **"service_role"** yazısının altındaki **uzun JWT token**
❌ `sb_secret_...` ile başlayan secret key DEĞİL!

### 3. .env.local Dosyasını Güncelleyin

Terminal'de bu komutu çalıştırın:

```bash
cd /Users/resulkorkmaz/Downloads/web/onlineusta.com.tr
nano .env.local
```

Dosyayı şu şekilde düzenleyin:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ffozpqvbvjkhgipznrzm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=BURAYA_ANON_PUBLIC_KEY_YAPIŞTIRIN
SUPABASE_SERVICE_ROLE_KEY=BURAYA_SERVICE_ROLE_KEY_YAPIŞTIRIN
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Kaydet: `Ctrl+O` → `Enter` → `Ctrl+X`

### 4. Development Server'ı Yeniden Başlatın

```bash
# Mevcut server'ı durdurun (Ctrl+C)
# Sonra yeniden başlatın
npm run dev
```

### 5. Tekrar Deneyin

```
http://localhost:3000/register
```

Artık çalışmalı! ✅

---

## 📸 Ekran Görüntüsü Rehberi

Supabase Dashboard > Settings > API sayfasında:

```
┌─────────────────────────────────────────┐
│ Project URL                              │
│ https://ffozpqvbvjkhgipznrzm.supabase.co│ ← Bu
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ anon public                              │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ ← Bu (uzun JWT)
│ [Show] butonu                            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ service_role                             │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ ← Bu (uzun JWT)
│ [Show] butonu                            │
└─────────────────────────────────────────┘
```

## ⚠️ DİKKAT

- ✅ JWT token'lar `eyJ...` ile başlar
- ❌ `sb_publishable_...` YANLIŞ
- ❌ `sb_secret_...` YANLIŞ

Bu publishable/secret key'ler Supabase CLI için, web uygulaması için JWT token'lar gerekli!

