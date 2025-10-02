# Google reCAPTCHA v3 Kurulum Rehberi

Bu proje robot kayıtlarını önlemek için Google reCAPTCHA v3 kullanmaktadır.

## 🔑 reCAPTCHA Key'lerini Alma

### 1. Google reCAPTCHA Admin Console'a Git

https://www.google.com/recaptcha/admin/create

### 2. Yeni Site Oluştur

- **Label:** `OnlineUsta.com.tr` (veya istediğiniz bir isim)
- **reCAPTCHA type:** **reCAPTCHA v3** seçin ⚠️ ÖNEMLI
- **Domains:** 
  - `localhost` (development için)
  - `onlineusta.com.tr` (production için)
  - `vercel.app` (Vercel deployment için)

### 3. Key'leri Kopyala

"Submit" butonuna tıkladıktan sonra size iki key verilecek:

- ✅ **Site Key** (Public - Frontend'de kullanılır)
- 🔐 **Secret Key** (Private - Backend'de kullanılır)

### 4. `.env.local` Dosyasına Ekle

`.env.local` dosyanızı açın ve şu satırları ekleyin:

```bash
# Google reCAPTCHA v3 (Robot Koruma)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LcYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

⚠️ **NOT:** Yukarıdaki key'leri kendi key'lerinizle değiştirin!

### 5. Development Server'ı Yeniden Başlat

```bash
npm run dev
```

## ✅ Test Etme

1. **Müşteri Kaydı:** http://localhost:3000/customer/register
2. **Hizmet Veren Kaydı:** http://localhost:3000/provider/register

Kayıt formunu doldurup submit ettiğinizde:
- ✅ Normal kullanıcı → Kayıt başarılı
- ❌ Bot → "Güvenlik doğrulaması başarısız" hatası

## 🔍 Nasıl Çalışır?

### Frontend (Kullanıcı Görmez)
```tsx
// Kayıt butonuna tıklandığında
const token = await executeRecaptcha("customer_register");
// Token backend'e gönderilir
```

### Backend (Token Doğrulama)
```ts
// API Route: /api/verify-recaptcha
// Token Google'a gönderilir
// Skor 0.0 - 1.0 arası döner
// 0.5'in üstü → Güvenilir kullanıcı ✅
// 0.5'in altı → Bot olabilir ❌
```

## 📊 reCAPTCHA Skorları

- **0.9 - 1.0:** Kesinlikle insan
- **0.7 - 0.9:** Muhtemelen insan
- **0.5 - 0.7:** Şüpheli aktivite
- **0.0 - 0.5:** Bot olabilir

Proje `0.5` threshold kullanmaktadır. İsterseniz `/src/app/api/verify-recaptcha/route.ts` dosyasından değiştirebilirsiniz:

```ts
if (data.success && data.score >= 0.5) { // Bu değeri değiştirin
```

## 🎯 Sonuç

✅ Robot kayıtları engellenecek  
✅ Kullanıcı deneyimi etkilenmeyecek (görünmez)  
✅ Güvenlik artacak  

## 🚨 Sorun Giderme

### "reCAPTCHA yüklenemedi" hatası

1. `.env.local` dosyasında `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` tanımlı mı?
2. Server'ı yeniden başlattınız mı?
3. Browser console'da hata var mı?

### "Güvenlik doğrulaması başarısız" hatası

1. `.env.local` dosyasında `RECAPTCHA_SECRET_KEY` tanımlı mı?
2. Key'ler doğru mu? (Site Key ≠ Secret Key)
3. Domain'ler reCAPTCHA admin'de tanımlı mı?

## 📚 Daha Fazla Bilgi

- [Google reCAPTCHA v3 Docs](https://developers.google.com/recaptcha/docs/v3)
- [react-google-recaptcha-v3](https://www.npmjs.com/package/react-google-recaptcha-v3)

