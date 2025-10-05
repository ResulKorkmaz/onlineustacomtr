# VERCEL MANUEL DEPLOY

## 🐛 SORUN:
GitHub'a push yapılıyor ama Vercel otomatik deploy olmuyor.
Son deployment: 11 saat önce
Son commit: Az önce (f4bdbd8)

## ✅ HIZLI ÇÖZÜM - MANUEL REDEPLOY:

### 1️⃣ Vercel Dashboard'a Git:
```
https://vercel.com/dashboard
```

### 2️⃣ Projeyi Seç:
- "onlineusta.com.tr" projesine tıkla

### 3️⃣ Deployments Sekmesi:
- Üst menüden "Deployments"

### 4️⃣ En Son Deployment'ı Bul:
- En üstteki deployment'a tıkla

### 5️⃣ Redeploy Butonuna Tıkla:
- Sağ üstte 3 nokta (...) menüsü
- "Redeploy" seçeneğine tıkla
- ✅ "Use existing Build Cache" checkbox'unu **KALDIR**
- "Redeploy" butonuna tıkla

### 6️⃣ Bekle:
- 2-3 dakika deployment tamamlanacak
- ✅ Yeşil tick işareti görünecek

---

## 🔧 UZUN VADELİ ÇÖZÜM - WEBHOOK'U DÜZELTMELİYİZ:

### Vercel'de Git Integration Kontrolü:

1. **Settings → Git**
2. **GitHub** bölümünü kontrol et
3. Eğer "Reconnect" butonu varsa → Tıkla
4. GitHub yetkilendirmesini yenile

### GitHub'da Webhook Kontrolü:

1. GitHub repo: `https://github.com/ResulKorkmaz/OnlineUsta.com.tr`
2. **Settings → Webhooks**
3. Vercel webhook'u bul
4. "Recent Deliveries" kontrol et
5. Başarısız olan varsa → "Redeliver" butonuna tıkla

---

## ⚡ HIZLI TEST:

### Deployment Sonrası:
```bash
# 1. Canlıda test et
https://www.onlineusta.com.tr/customer/register

# 2. Console aç (F12)
# 3. Kayıt formunu doldur
# 4. "Kayıt Ol" butonuna tıkla

# 5. Console'da göreceksin:
⚠️ reCAPTCHA key'leri Vercel'de tanımlı değil.

# Bu normal! Key ekleyince kaybolacak.
# Ama kayıt artık ÇALIŞACAK ✅
```

---

## 🎯 ŞİMDİ NE YAPILACAK:

### 1. MANUEL REDEPLOY YAP (Yukarıdaki adımlar)
### 2. 2-3 DAKİKA BEKLE
### 3. CANLIDA TEST ET
### 4. ÇALIŞIYORSA ✅ TAMAM
### 5. SONRA RECAPTCHA KEY'LERİNİ EKLE (VERCEL_RECAPTCHA_SETUP.md)

---

## 📝 NOT:
Vercel webhook sorunu tekrarlanırsa:
- Her push'tan sonra manuel redeploy gerekebilir
- Veya Git integration'ı reconnect et

