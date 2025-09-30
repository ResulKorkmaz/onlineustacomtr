# 🔐 Supabase Kurulum Kılavuzu

## ✅ Tamamlanan Adımlar

### 1. Supabase CLI Kurulumu
```bash
✅ Supabase CLI v2.47.2 kuruldu
```

### 2. Proje Oluşturma
```bash
✅ Proje Adı: OnlineUsta-Production
✅ Project ID: zqvdnujpbbrwhnsylgmq
✅ Region: US East (North Virginia)
✅ URL: https://zqvdnujpbbrwhnsylgmq.supabase.co
```

### 3. Database Migration
```bash
✅ Migration dosyası başarıyla yüklendi
✅ Tablolar oluşturuldu: profiles, jobs, bids, notifications
✅ RLS policies aktif
✅ Triggers kuruldu (günlük limitler)
```

---

## 🔑 Gerekli API Keys

### Supabase Dashboard'dan Alınması Gerekenler:

1. **Supabase Dashboard'a gidin:**
   ```
   https://supabase.com/dashboard/project/zqvdnujpbbrwhnsylgmq/settings/api
   ```

2. **Project API Keys** bölümünden şunları kopyalayın:
   - `anon` `public` key

3. **`.env.local` dosyasını güncelleyin:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://zqvdnujpbbrwhnsylgmq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<BURAYA_ANON_KEY_YAPIŞTIRIN>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

---

## 📊 Database Schema

### Tablolar:
- ✅ `profiles` - Kullanıcı profilleri (customer/provider)
- ✅ `jobs` - İş ilanları
- ✅ `bids` - Teklifler
- ✅ `notifications` - Bildirimler

### Özellikler:
- ✅ Row Level Security (RLS) aktif
- ✅ Günlük limit trigger'ları
  - Provider: Max 3 teklif/gün
  - Customer: Max 1 ilan/gün, min 7 gün aralık
- ✅ Teklif sayacı otomatik güncelleme
- ✅ Timestamp otomasyonu

---

## 🚀 Vercel Deploy için Environment Variables

Vercel Dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zqvdnujpbbrwhnsylgmq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
```

---

## ✅ Bağlantı Testi

Local'de test etmek için:

```bash
# 1. ANON_KEY'i .env.local'e ekleyin
# 2. Dev server'ı başlatın
npm run dev

# 3. Tarayıcıda açın
http://localhost:3000
```

---

## 📝 Notlar

- ✅ Supabase projesi oluşturuldu
- ✅ Database migration tamamlandı
- ⚠️ ANON_KEY manuel olarak dashboard'dan alınmalı
- ⚠️ Vercel'e deploy etmeden önce environment variables eklenmelidir

---

## 🔗 Linkler

- **Supabase Dashboard:** https://supabase.com/dashboard/project/zqvdnujpbbrwhnsylgmq
- **API Settings:** https://supabase.com/dashboard/project/zqvdnujpbbrwhnsylgmq/settings/api
- **Database:** https://supabase.com/dashboard/project/zqvdnujpbbrwhnsylgmq/editor
- **Auth:** https://supabase.com/dashboard/project/zqvdnujpbbrwhnsylgmq/auth/users

---

## 🎯 Sonraki Adımlar

1. ✅ Supabase CLI kuruldu
2. ✅ Proje oluşturuldu
3. ✅ Database migration yapıldı
4. ⏳ ANON_KEY dashboard'dan alınmalı
5. ⏳ .env.local güncellenmeli
6. ⏳ Local test
7. ⏳ Vercel deploy

