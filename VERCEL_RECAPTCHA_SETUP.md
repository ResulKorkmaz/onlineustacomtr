# VERCEL'DE RECAPTCHA AYARLARI

## 🐛 SORUN:
Production'da (canlıda) Google reCAPTCHA key'leri tanımlı değil.

## ✅ ÇÖZÜM:

### 1️⃣ VERCEL DASHBOARD'A GİT:
```
https://vercel.com/dashboard
```

### 2️⃣ PROJENİ SEÇ:
- onlineusta.com.tr projesine tıkla

### 3️⃣ SETTINGS → ENVIRONMENT VARIABLES:
- Üst menüden "Settings" sekmesi
- Sol menüden "Environment Variables"

### 4️⃣ ŞU 2 KEY'İ EKLE:

#### Key 1:
```
Name: NEXT_PUBLIC_RECAPTCHA_SITE_KEY
Value: (Google reCAPTCHA Admin Console'dan aldığın Site Key)
Environment: Production ✅
```

#### Key 2:
```
Name: RECAPTCHA_SECRET_KEY
Value: (Google reCAPTCHA Admin Console'dan aldığın Secret Key)
Environment: Production ✅
```

### 5️⃣ GOOGLE RECAPTCHA KEY'LERİ AL:
```
https://www.google.com/recaptcha/admin
```

1. Site listesinden "onlineusta.com.tr" projesini seç
2. "Site Key" ve "Secret Key" değerlerini kopyala
3. Vercel'e yapıştır

### 6️⃣ REDEPLOY ET:
- Vercel'de "Deployments" sekmesi
- En son deployment'ın yanındaki "..." menüsü
- "Redeploy" butonuna tıkla
- ✅ Environment variables ile yeniden deploy olacak

---

## 🎯 ALTERNATIF: RECAPTCHA'YI GEÇİCİ OLARAK KAPAMA

Eğer reCAPTCHA key'leri almak zaman alıyorsa, geçici olarak kapatabilirsin:

### customer/register sayfasında:
```typescript
// executeRecaptcha'yı optional yap
const token = executeRecaptcha ? await executeRecaptcha("register") : "test-token";
```

Ama bu güvenli değil! Bot koruması olmaz.

---

## 📝 KEY'LER NEREDE?

### Localhost'ta (.env.local):
```env
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...
RECAPTCHA_SECRET_KEY=6Lc...
```

### Production'da (Vercel):
```
Environment Variables → Add New
```

---

## ✅ DOĞRULAMA:

Key'leri ekledikten sonra:
1. Vercel'de redeploy et
2. https://www.onlineusta.com.tr/customer/register adresine git
3. Console'da hata olmamalı ✅
4. Kayıt çalışmalı ✅

