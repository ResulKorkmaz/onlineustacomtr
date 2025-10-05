# VERCEL WEBHOOK SORUNU - KESİN ÇÖZÜM

## 🐛 SORUN:
GitHub'a push yapılıyor ama Vercel otomatik deploy olmuyor!

---

## ✅ ÇÖZÜM 1: GITHUB ACTIONS (OTOMATIK)

### Artık Her Push'ta Otomatik Deploy Olacak!

**Ne Yaptım:**
- `.github/workflows/vercel-deploy.yml` dosyası oluşturuldu
- Her `main` branch'e push'ta otomatik Vercel deploy tetiklenir

**Aktif Etmek İçin:**

### 1️⃣ GitHub Secrets Ekle:

#### A. VERCEL_TOKEN Al:
```
1. https://vercel.com/account/tokens
2. "Create Token" butonuna tıkla
3. Name: "GitHub Actions Deploy"
4. Scope: "Full Account"
5. "Create" butonuna tıkla
6. Token'ı kopyala (bir daha göremezsin!)
```

#### B. ORG_ID ve PROJECT_ID Al:
```
1. Vercel Dashboard → Settings
2. Aşağı kaydır
3. "Project ID" kopyala
4. "Team ID" (ORG_ID) kopyala
```

#### C. GitHub Secrets Ekle:
```
1. GitHub Repo: https://github.com/ResulKorkmaz/OnlineUsta.com.tr
2. Settings → Secrets and variables → Actions
3. "New repository secret" butonuna tıkla

Secret 1:
Name: VERCEL_TOKEN
Value: (vercel token'ı yapıştır)

Secret 2:
Name: ORG_ID
Value: (team/org id)

Secret 3:
Name: PROJECT_ID
Value: (project id)
```

### 2️⃣ Test Et:
```bash
# Bir değişiklik yap ve push et
git add .
git commit -m "test: Vercel auto deploy"
git push origin main

# GitHub'da kontrol et:
# Actions sekmesi → "Vercel Production Deployment" çalışmalı
```

---

## ✅ ÇÖZÜM 2: WEBHOOK'U MANUEL DÜZELT

### A. Vercel'de Git Integration'ı Yeniden Bağla:

```
1. Vercel Dashboard → Settings → Git
2. "Disconnect" butonuna tıkla (varsa)
3. "Connect Git Repository" butonuna tıkla
4. GitHub'ı seç
5. onlineusta.com.tr repo'sunu seç
6. "Install" onayı ver
```

### B. GitHub'da Webhook'u Kontrol Et:

```
1. GitHub Repo → Settings → Webhooks
2. Vercel webhook'unu bul (https://vercel.com/...)
3. "Recent Deliveries" sekmesi
4. Başarısız olanları bul
5. "Redeliver" butonuna tıkla
```

---

## ✅ ÇÖZÜM 3: FORCE TRIGGER (ACİL)

### Vercel CLI ile Manuel Deploy:

```bash
# Vercel CLI kur (yoksa)
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Bu her seferinde çalışır, ama manuel
```

---

## 🎯 HANGİSİNİ SEÇMELİYİM?

| Çözüm | Otomatik? | Zorluk | Önerilen |
|-------|-----------|--------|----------|
| **GitHub Actions** | ✅ Evet | Orta | ⭐⭐⭐ EN İYİ |
| **Webhook Düzelt** | ✅ Evet | Kolay | ⭐⭐ İYİ |
| **Vercel CLI** | ❌ Manuel | Çok Kolay | ⭐ Geçici |

---

## 📝 BENİM ÖNERİM:

### 1️⃣ ŞİMDİ: GitHub Actions Setup Yap (10 dakika)
- Bir kere ayarla, sonsuza kadar otomatik
- Her push'ta otomatik deploy
- Webhook sorunları bitsin

### 2️⃣ SONRA: Webhook'u da düzelt (opsiyonel)
- Double guarantee
- Vercel native integration

---

## 🧪 TEST:

### GitHub Actions çalışıyor mu?

```
1. https://github.com/ResulKorkmaz/OnlineUsta.com.tr/actions
2. "Vercel Production Deployment" workflow'unu gör
3. Yeşil tick ✅ olmalı
4. Deployment logs kontrol et
```

---

## ⚡ HIZLI BAŞLANGIÇ:

```bash
# 1. Bu commit'i push et
git add .github/workflows/vercel-deploy.yml
git commit -m "feat: GitHub Actions Vercel auto deploy"
git push origin main

# 2. GitHub Secrets ekle (yukarıdaki adımlar)
# 3. Tekrar push et
# 4. ✅ Otomatik deploy başlayacak!
```

