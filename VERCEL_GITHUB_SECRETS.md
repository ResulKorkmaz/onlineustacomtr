# ✅ Vercel Otomatik Deploy - GitHub Secrets Kurulumu

## 🎯 SORUN ÇÖZÜLMEDİ! Şu bilgileri GitHub'a ekle:

### 📋 Secret Bilgileri
```
VERCEL_TOKEN: Z13DocA0yaW8YrHlwRgLAc4I
ORG_ID: team_vr2AcCrf0kBvWuKfDcdOhc7j
PROJECT_ID: prj_s9OJybV8cSr4upQPGaBg5vIwJlJQ
```

---

## 🔧 Manuel Ekleme (2 dakika)

### Adım 1: GitHub'a git
https://github.com/ResulKorkmaz/OnlineUsta.com.tr/settings/secrets/actions

### Adım 2: "New repository secret" butonuna tıkla

### Adım 3: 3 secret ekle:

**1. VERCEL_TOKEN**
- Name: `VERCEL_TOKEN`
- Secret: `Z13DocA0yaW8YrHlwRgLAc4I`
- [Add secret]

**2. ORG_ID**
- Name: `ORG_ID`
- Secret: `team_vr2AcCrf0kBvWuKfDcdOhc7j`
- [Add secret]

**3. PROJECT_ID**
- Name: `PROJECT_ID`
- Secret: `prj_s9OJybV8cSr4upQPGaBg5vIwJlJQ`
- [Add secret]

---

## ✅ Test Et

Secrets eklendikten sonra:
1. Herhangi bir dosya değiştir
2. `git add -A && git commit -m "test" && git push`
3. GitHub Actions çalışacak → Vercel deploy olacak!

**Kontrol:**
- https://github.com/ResulKorkmaz/OnlineUsta.com.tr/actions
- https://vercel.com/resul-korkmazs-projects/onlineusta.com.tr/deployments

---

## 🚀 ALTERNATİF: Webhook Yöntemi

Eğer GitHub Actions'ı kullanmak istemezsen:

### Vercel'de webhook kontrol et:
1. https://vercel.com/resul-korkmazs-projects/onlineusta.com.tr/settings/git-integration
2. "Reconnect" → GitHub'ı yeniden bağla
3. "Enable automatic deployments from Git"

---

## 📊 Şu An Durum

✅ GitHub Actions workflow hazır (`.github/workflows/vercel-deploy.yml`)
⏳ Secrets bekleniyor (yukarıdaki 3 değer)
✅ Vercel token geçerli
✅ Proje bilgileri doğru

**Secrets eklenince → Her push'ta otomatik Vercel deploy! 🎉**

