# Rate Limiting Dokümantasyonu

## 📋 Genel Bakış

OnlineUsta platformu güvenlik ve kötüye kullanımı önlemek için çeşli seviyede rate limiting (hız sınırlama) mekanizmaları kullanır.

---

## 🔐 Rate Limiting Katmanları

### 1. **Supabase Auth Rate Limiting** (Otomatik)

Supabase, authentication endpoint'lerine otomatik rate limit uygular:

```
Email başına limitler:
- Kayıt (signUp): 4-5 deneme / saat
- Giriş (signIn): 5-10 deneme / saat  
- Password Reset: 3-5 deneme / saat
- Email Confirmation: 5 deneme / saat

IP başına limitler:
- Genel auth istekleri: 30-50 istek / saat
- Project bazlı: Supabase dashboard'dan ayarlanabilir
```

**Hata Mesajı:**
```
"Email rate limit exceeded"
veya
"Too many requests"
```

### 2. **Database Trigger Rate Limiting** (Custom)

Veritabanı seviyesinde iş kuralları için limit'ler:

```sql
-- Hizmet Veren (Provider)
- Günlük teklif limiti: 3 adet (check_daily_bid_limit trigger)
- Teklif düzenleme: 7 gün içinde max 3 kez

-- Müşteri (Customer)  
- Günlük ilan limiti: 1 adet (check_job_creation_rules trigger)
- İlan aralığı: Son ilandan en az 7 gün sonra
```

**Hata Mesajları:**
```
"Günlük teklif limitine ulaştınız (3 adet)"
"Bugün zaten bir ilan yayınladınız"
"Yeni ilan oluşturmak için son ilandan itibaren en az 7 gün beklemelisiniz"
```

### 3. **API Route Rate Limiting** (Planlı - Şu anda yok)

**TODO**: Upstash Redis ile API endpoint rate limiting eklenecek:

```typescript
// Planlanıyor
/api/register-profile → 10 istek / dakika / IP
/api/verify-recaptcha → 20 istek / dakika / IP
/api/check-user → 30 istek / dakika / IP
```

---

## 🚨 Rate Limit Hataları ve Çözümler

### "Email rate limit exceeded" Hatası

#### **Neden Oluşur?**
1. Aynı email ile çok fazla kayıt/giriş denemesi
2. Test sırasında tekrarlı denemeler
3. Kullanıcı şifresini unutup sürekli yeniden kayıt deniyor
4. Bot/otomatik kayıt girişimleri (reCAPTCHA bu senaryoyu azaltır)

#### **Çözümler**

**Kullanıcı İçin:**
```
✓ Bekleme süresi: 1-2 saat
✓ Farklı email adresi kullan (geçici)
✓ Zaten kayıtlıysan "Giriş Yap" kullan
✓ Browser cache temizle
```

**Geliştirici İçin:**
```bash
# 1. Supabase Dashboard'dan kontrol
Supabase Dashboard → Authentication → Rate Limits
- Mevcut limitleri gör
- Gerekirse artır (dikkatli!)

# 2. Rate limit loglarını incele
Supabase Dashboard → Logs → Auth Logs
- Hangi email'den çok istek gelmiş?
- IP bazlı pattern var mı?

# 3. Test için temporary email kullan
https://temp-mail.org/
https://10minutemail.com/

# 4. Supabase CLI ile rate limit sıfırlama (yok - sadece bekleme)
```

---

## 💡 Best Practices

### Geliştirme Ortamında

```typescript
// 1. Console.log ile debug yapma
console.log("[Auth] Rate limit hatası:", error.message);

// 2. Retry mekanizması ekleme (dikkatli!)
// NOT: Auth rate limit için RETRY YAPMA!
// Profil oluşturma için retry OK (current implementation)

// 3. Test için farklı email pattern kullan
test+1@example.com
test+2@example.com
// Gmail: . (nokta) ile de çalışır
test.user@gmail.com = testuser@gmail.com
```

### Production Ortamında

```typescript
// 1. Kullanıcı dostu mesajlar (✓ YAPILDI)
if (error.message.toLowerCase().includes("rate limit")) {
  setError("Çok fazla deneme yaptınız. Lütfen 1-2 saat sonra tekrar deneyin.");
}

// 2. reCAPTCHA kullan (✓ MEVCUT)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=xxx
RECAPTCHA_SECRET_KEY=xxx

// 3. Frontend validation (✓ MEVCUT)  
- Email format kontrolü
- Şifre güçlülük kontrolü
- Kullanıcı var mı kontrolü (500ms debounce)

// 4. Monitoring ekle (TODO)
- Sentry: Rate limit hatalarını logla
- Vercel Analytics: Hata rate'i izle
```

---

## 📊 Rate Limit İzleme

### Supabase Dashboard

```
1. Projects → onlineusta → Authentication
2. "Rate Limits" tab'ına git
3. Metrics:
   - Total auth requests / saat
   - Failed auth attempts
   - Rate limited requests
```

### Vercel Analytics (TODO)

```javascript
// pages/_app.tsx veya layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔧 Kod İyileştirmeleri (✓ YAPILDI)

### 1. Customer Register (`src/app/customer/register/page.tsx`)

```typescript
// Önce
if (authError) throw authError; // ❌ Ham hata

// Sonra (✓ YAPILDI)
if (authError) {
  if (authError.message.toLowerCase().includes("rate limit")) {
    throw new Error(
      "Çok fazla kayıt denemesi yaptınız. Lütfen 1-2 saat sonra tekrar deneyin. " +
      "Bu güvenlik önlemi kötüye kullanımı engellemek içindir."
    );
  } else if (authError.message.toLowerCase().includes("already registered")) {
    throw new Error("Bu e-posta adresi zaten kayıtlı...");
  } else {
    throw new Error(authError.message || "Kayıt sırasında bir hata oluştu");
  }
}
```

### 2. Provider Register (`src/app/provider/register/page.tsx`)

```typescript
// Aynı iyileştirme ✓ YAPILDI
```

### 3. Login (`src/app/login/page.tsx`)

```typescript
// Aynı iyileştirme ✓ YAPILDI
if (error.message.toLowerCase().includes("rate limit")) {
  setError("Çok fazla giriş denemesi yaptınız...");
}
```

---

## 📈 Gelecek İyileştirmeler

### P1 - Yüksek Öncelik

- [ ] **Upstash Redis Rate Limiting**: API route'lara IP bazlı limit
- [ ] **Sentry Integration**: Rate limit hatalarını otomatik logla
- [ ] **Admin Dashboard**: Rate limit metrics göster

### P2 - Orta Öncelik

- [ ] **Exponential Backoff**: Client'ta akıllı retry mekanizması
- [ ] **Rate Limit Headers**: Response'a X-RateLimit-* header'ları ekle
- [ ] **User Feedback**: "X saniye sonra tekrar deneyin" countdown

### P3 - Düşük Öncelik  

- [ ] **Whitelist System**: Güvenilir IP'lere yüksek limit
- [ ] **Premium Users**: Ücretli kullanıcılara daha yüksek limit
- [ ] **Analytics Dashboard**: Grafik ve istatistikler

---

## 🆘 Acil Durum Çözümleri

### Production'da Rate Limit Krizi

```bash
# 1. Supabase Dashboard
- Authentication → Settings → Rate Limits
- Temporarily increase limits (2x)
- Monitor for 1 hour

# 2. DDoS Attack şüphesi
- Vercel Dashboard → Firewall
- Block suspicious IPs
- Enable Vercel Attack Challenge Mode

# 3. Legitimate traffic surge
- Scale Supabase plan temporarily
- Optimize client-side validation
- Add caching where possible

# 4. Communication
- Status page: "Yoğunluk nedeniyle geçici yavaşlama"
- Email users: "Lütfen X saati bekleyin"
```

---

## 📚 Kaynaklar

- [Supabase Auth Rate Limits](https://supabase.com/docs/guides/auth/rate-limits)
- [Vercel Edge Config (Rate Limiting)](https://vercel.com/docs/storage/edge-config)
- [Upstash Redis Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)
- [OWASP Rate Limiting Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#rate-limiting)

---

## 📝 Değişiklik Geçmişi

| Tarih | Değişiklik | Durum |
|-------|-----------|-------|
| 2025-10-05 | Rate limit error handling eklendi (customer, provider, login) | ✅ Tamamlandı |
| 2025-10-05 | Dokümantasyon oluşturuldu | ✅ Tamamlandı |
| 2025-10-XX | Upstash Redis rate limiting | ⏳ Planlı |
| 2025-10-XX | Sentry integration | ⏳ Planlı |

---

**Son Güncelleme**: 5 Ekim 2025  
**Durum**: ✅ Production Ready (Temel koruma mevcut)

