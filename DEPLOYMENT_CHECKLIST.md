# Production Deployment Checklist

Son kontrol listesi - Production'a deploy etmeden önce.

## ✅ Environment Variables

- [ ] `.env.local` dosyası oluşturuldu
- [ ] `NEXT_PUBLIC_SUPABASE_URL` doğru
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` doğru
- [ ] `SUPABASE_SERVICE_ROLE_KEY` eklendi (GİZLİ!)
- [ ] `NEXT_PUBLIC_APP_URL` production URL'e ayarlandı
- [ ] `RESEND_API_KEY` (email için) eklendi

## ✅ Supabase Setup

- [ ] Production database oluşturuldu
- [ ] Migration'lar çalıştırıldı
- [ ] RLS policies aktif
- [ ] Trigger'lar çalışıyor
- [ ] Categories seed data eklendi
- [ ] Settings tablosu dolduruldu
- [ ] Storage bucket oluşturuldu (profil fotoğrafları için)

## ✅ Güvenlik

- [ ] Service role key güvenli saklanıyor (Vercel secrets)
- [ ] Environment variables encrypted
- [ ] CORS ayarları yapıldı
- [ ] Security headers aktif (next.config.ts)
- [ ] RLS policies test edildi
- [ ] API rate limiting düşünüldü (opsiyonel: Upstash)

## ✅ Performance

- [ ] `npm run build` başarılı
- [ ] Image optimization test edildi
- [ ] Revalidation stratejileri uygun
- [ ] Database indexler oluşturuldu
- [ ] Lighthouse score kontrol edildi (>90)

## ✅ Monitoring

- [ ] Vercel Analytics aktif (opsiyonel)
- [ ] Sentry entegrasyonu (opsiyonel)
- [ ] Supabase database logs açık
- [ ] Error reporting test edildi

## ✅ Functionality

- [ ] Kayıt olma çalışıyor
- [ ] Login/Logout çalışıyor
- [ ] Onboarding flow test edildi
- [ ] İlan oluşturma çalışıyor
- [ ] Günlük limit trigger'ları çalışıyor
- [ ] Teklif verme çalışıyor
- [ ] Bildirimler oluşuyor
- [ ] Email confirmation çalışıyor (Supabase)

## ✅ SEO & Social

- [ ] Meta tags kontrol edildi
- [ ] OpenGraph tags test edildi
- [ ] Favicon eklendi
- [ ] robots.txt oluşturuldu
- [ ] sitemap.xml oluşturuldu

## ✅ Legal

- [ ] KVKK metni eklendi
- [ ] Gizlilik Politikası eklendi
- [ ] Kullanıcı Sözleşmesi eklendi
- [ ] İletişim bilgileri güncel

## ✅ Testing

- [ ] Tüm sayfalar yükleniyor
- [ ] Mobile responsive kontrol edildi
- [ ] Farklı tarayıcılarda test edildi
- [ ] Error states test edildi
- [ ] Loading states test edildi

---

## Deployment Commands

```bash
# 1. Dependencies yükle
npm install

# 2. Build test et
npm run build

# 3. Lint kontrol
npm run lint

# 4. Database types generate et
npm run db:types

# 5. Vercel'e deploy
vercel --prod
```

---

## Post-Deployment

- [ ] Production URL test edildi
- [ ] Database connection çalışıyor
- [ ] Auth flow test edildi
- [ ] Error monitoring aktif
- [ ] SSL certificate aktif
- [ ] DNS ayarları yapıldı

---

**Son güncelleme**: 2025-10-02

