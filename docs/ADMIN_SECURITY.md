# Admin Güvenlik Dokümantasyonu

## 🔐 Süper Admin Kurulumu

### Güvenli Yöntem 1: Supabase Dashboard (Önerilen)

**Adım 1: Supabase Dashboard'dan Kullanıcı Oluştur**
```
1. Supabase Dashboard → Authentication → Users
2. "Add User" butonu
3. Email: admin@onlineusta.com.tr
4. Password: [Güçlü bir şifre oluştur, en az 12 karakter]
5. Auto Confirm User: ✅ (email onayı atla)
6. "Create User"
```

**Adım 2: SQL Editor'den Super Admin Yap**
```sql
SELECT public.create_first_super_admin('admin@onlineusta.com.tr');
```

✅ **Avantajları:**
- Email doğrulaması gerekmez
- Bot kayıt riski yok
- Güçlü şifre kontrolü
- Admin panelden yönetilir

---

### Güvenli Yöntem 2: SQL ile Direkt Oluşturma

⚠️ **DİKKAT:** Bu yöntem Supabase'in auth şemasına direkt erişim gerektirir.

```sql
-- 1. Auth kullanıcısı oluştur (Supabase Admin API gerekir)
-- Bu işlem Supabase Dashboard veya Management API'den yapılmalı

-- 2. Profile oluştur
INSERT INTO public.profiles (id, email, full_name, role, phone)
VALUES (
  '[SUPABASE_USER_ID]',
  'admin@onlineusta.com.tr',
  'Sistem Yöneticisi',
  'customer',
  '+90 XXX XXX XX XX'
);

-- 3. Super admin yap
UPDATE public.profiles
SET 
  admin_role = 'super_admin',
  is_super_admin = TRUE
WHERE email = 'admin@onlineusta.com.tr';
```

---

## 🛡️ Admin Login Güvenliği

### Mevcut Durum

❌ **Eksikler:**
- Rate limiting yok
- Brute force koruması yok
- reCAPTCHA yok (normal login'de var)
- IP blacklist yok
- 2FA yok

✅ **Mevcut Korumalar:**
- IP adresi logging (admin_logs)
- User agent logging
- Session management (Supabase Auth)
- Database-level trigger'lar

---

## 🚨 Güvenlik Önlemleri (Önerilenler)

### 1. Rate Limiting (Kritik!)

**Sorunu:** Saldırgan dakikada yüzlerce login denemesi yapabilir.

**Çözüm:** 
- Supabase Edge Functions ile rate limiting
- Redis veya Upstash Rate Limit
- IP bazlı: 5 başarısız deneme → 15 dakika ban

### 2. reCAPTCHA Admin Login'e Ekle

**Şu anda:** Sadece kayıt sayfalarında var, admin login'de yok.

**Yapılması gereken:**
```tsx
// src/app/login/page.tsx
{redirect === "admin" && (
  // reCAPTCHA token al ve doğrula
)}
```

### 3. IP Whitelist (Opsiyonel)

Super Admin'e sadece belirli IP'lerden erişim:
```sql
-- Supabase Edge Function'da kontrol
SELECT is_super_admin 
FROM profiles 
WHERE id = auth.uid()
AND (
  ip_whitelist IS NULL 
  OR current_setting('request.headers')::json->>'cf-connecting-ip' = ANY(ip_whitelist)
);
```

### 4. 2FA (Two-Factor Authentication)

Supabase'in native 2FA desteği:
```typescript
await supabase.auth.mfa.enroll({
  factorType: 'totp'
});
```

### 5. Session Timeout

Admin oturumları daha kısa:
```typescript
// 30 dakika inaktivite sonrası logout
const ADMIN_SESSION_TIMEOUT = 30 * 60 * 1000;
```

---

## 📊 Güvenlik İzleme

### Admin Logs Analizi

```sql
-- Son 24 saatte başarısız login denemeleri
SELECT 
  ip_address,
  COUNT(*) as attempt_count,
  MAX(created_at) as last_attempt
FROM admin_logs
WHERE 
  action = 'login_failed'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY ip_address
HAVING COUNT(*) > 5
ORDER BY attempt_count DESC;
```

### Şüpheli Aktivite

```sql
-- Farklı IP'lerden aynı anda giriş
SELECT 
  admin_id,
  COUNT(DISTINCT ip_address) as ip_count,
  array_agg(DISTINCT ip_address) as ips
FROM admin_logs
WHERE 
  action = 'login'
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY admin_id
HAVING COUNT(DISTINCT ip_address) > 2;
```

---

## ⚡ Hızlı Güvenlik Checklist

- [ ] Süper admin email değiştir (kişisel değil, kurumsal)
- [ ] Güçlü şifre (min 16 karakter, özel karakter)
- [ ] Email doğrulaması aktif
- [ ] reCAPTCHA admin login'e ekle
- [ ] Rate limiting implementasyonu
- [ ] Admin logs düzenli kontrol
- [ ] Session timeout ayarla
- [ ] 2FA aktive et
- [ ] IP whitelist (opsiyonel)
- [ ] Backup admin hesabı oluştur

---

## 🎯 Öncelik Sırası

### Kritik (Hemen Yapılmalı)
1. ✅ Süper admin oluştur (güvenli yöntemle)
2. ⚠️ Rate limiting ekle
3. ⚠️ reCAPTCHA admin login'e ekle

### Önemli (1 Hafta İçinde)
4. Admin logs monitoring sistemi
5. Session timeout implementasyonu
6. Failed login tracking

### İyi Olur (1 Ay İçinde)
7. 2FA desteği
8. IP whitelist
9. Email alerts (şüpheli aktivite)

---

## 🔗 İlgili Dosyalar

- Migration: `supabase/migrations/0006_add_admin_system.sql`
- Admin Layout: `src/app/admin/layout.tsx`
- Login Page: `src/app/login/page.tsx`
- Permissions: `src/lib/admin/permissions.ts`
- API Check: `src/app/api/admin/check/route.ts`

---

**Son Güncelleme:** 2025-10-02
**Güvenlik Seviyesi:** 🟡 ORTA (Geliştirme Gerekli)

