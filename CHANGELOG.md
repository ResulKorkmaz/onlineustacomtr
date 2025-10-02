# Changelog

Tüm önemli değişiklikler bu dosyada belgelenecektir.

Format [Keep a Changelog](https://keepachangelog.com/tr/1.0.0/) standardına uygundur.

## [0.2.0] - 2025-10-02

### Eklenenler
- ✅ **Güvenlik Headers**: HSTS, X-Frame-Options, CSP, X-XSS-Protection eklendi
- ✅ **Loading States**: Global ve dashboard loading bileşenleri
- ✅ **Error Boundaries**: Global error handling bileşeni
- ✅ **SEO Metadata**: Homepage için OpenGraph ve meta tags
- ✅ **Database Scripts**: Type generation script eklendi (`npm run db:types`)
- ✅ **Pagination Constants**: Magic number'lar constants'a taşındı
- ✅ **.gitignore**: Supabase ve environment dosyaları eklendi

### Değiştirilenler
- ✅ **API Auth**: register-profile endpoint'ine auth ve validation eklendi
- ✅ **Error Messages**: Kullanıcı dostu hata mesajları
- ✅ **Middleware**: Gelişmiş error logging ve handling
- ✅ **Homepage Query**: N+1 problemi çözüldü, join'ler eklendi
- ✅ **Revalidation**: Homepage (60s) ve Dashboard (30s) cache stratejisi
- ✅ **Type Safety**: `any` type'lar kaldırıldı

### Düzeltilmeler
- ✅ **env.example**: SUPABASE_SERVICE_ROLE_KEY eksikliği giderildi
- ✅ **next.config.ts**: Boş config dolduruldu
- ✅ **Image Optimization**: Supabase storage için pattern eklendi

### Güvenlik
- ✅ API route'larda user.id validation
- ✅ CSRF koruması için auth kontrolü
- ✅ Security headers (11 header eklendi)
- ✅ Error message sanitization

---

## [0.1.0] - 2025-09-XX

### Eklenenler
- Initial release
- Next.js 15 + App Router
- Supabase auth & database
- RLS policies
- Database triggers
- Basic UI components
- Job listing & creation
- User dashboard

