# Vercel Otomatik Deploy Sorun Giderme

**Proje**: onlineusta.com.tr  
**Repository**: ResulKorkmaz/OnlineUsta.com.tr  
**Son Commit**: 472a580 (feat: production-ready iyileştirmeler)

---

## ✅ Mevcut Durum Kontrolü

### Git & GitHub
- [x] Git repository: Aktif
- [x] GitHub remote: https://github.com/ResulKorkmaz/OnlineUsta.com.tr.git
- [x] Son commit push edildi: 472a580
- [x] Branch: main

### Vercel Konfigürasyonu
- [x] Vercel projesi: prj_s9OJybV8cSr4upQPGaBg5vIwJlJQ
- [x] vercel.json: deploymentEnabled = true
- [x] .vercel klasörü: Mevcut

---

## 🔍 Olası Sorunlar ve Çözümler

### 1. GitHub Entegrasyonu (EN YAGIN SORUN)

**Sorun**: Vercel'de GitHub App entegrasyonu devre dışı veya eksik olabilir.

**Çözüm**:
1. https://vercel.com/dashboard adresine gidin
2. Projenizi bulun: `onlineusta.com.tr`
3. **Settings** → **Git** bölümüne gidin
4. **GitHub Integration** kontrol edin:
   - ✅ "Connected to GitHub" yazıyor mu?
   - ✅ Repository doğru mu? (ResulKorkmaz/OnlineUsta.com.tr)
   - ✅ Branch: main seçili mi?

**Eğer bağlantı yoksa**:
- **Settings** → **Git** → **Connect Git Repository**
- GitHub'ı seçin ve authorize edin
- Repository'yi seçin

---

### 2. Production Branch Ayarı

**Sorun**: Vercel yanlış branch'i dinliyor olabilir.

**Çözüm**:
1. **Settings** → **Git** → **Production Branch**
2. Branch adı: `main` olmalı (master değil!)
3. Save edin

---

### 3. Deploy Hooks Devre Dışı

**Sorun**: Auto-deploy toggle kapalı olabilir.

**Çözüm**:
1. **Settings** → **Git**
2. Şu ayarları kontrol edin:
   - ✅ "Automatically deploy commits pushed to Production Branch" - AÇIK
   - ✅ "Deploy Previews" - AÇIK (opsiyonel ama önerilen)

---

### 4. Environment Variables Eksik

**Sorun**: Build sırasında env variables eksik olduğu için build fail olabilir.

**Çözüm**:
1. **Settings** → **Environment Variables**
2. Şu değişkenleri ekleyin:

```bash
# Zorunlu
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Opsiyonel (admin işlemleri için)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email servisi (varsa)
RESEND_API_KEY=re_your_key
```

**Ortam**: Production, Preview ve Development için ayrı ayrı ekleyin.

---

### 5. Build Command Hatası

**Sorun**: vercel.json'daki build command hatalı olabilir.

**Çözüm**: vercel.json doğru görünüyor ama kontrol edin:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

---

### 6. .vercelignore Kontrolü

**Sorun**: Önemli dosyalar ignore edilmiş olabilir.

**Çözüm**: .vercelignore'u kontrol edin, aşağıdakiler dışında bir şey ignore edilmemeli:

```
node_modules
.next
.env*.local
.vercel
```

---

## 🚀 Hızlı Manuel Deploy

Eğer otomatik deploy çalışmıyorsa, manuel deploy yapın:

```bash
# Vercel CLI yükleyin (yoksa)
npm i -g vercel

# Login olun
vercel login

# Deploy edin
vercel --prod
```

Bu komut çalışırsa, otomatik deploy sorununuz GitHub entegrasyonunda demektir.

---

## 📊 Deployment Log Kontrolü

1. https://vercel.com/dashboard
2. Projenizi açın
3. **Deployments** sekmesine gidin
4. **Failed** veya **Canceled** deployment varsa tıklayın
5. **Build Logs**'u inceleyin

**Yaygın Hatalar**:
- `NEXT_PUBLIC_SUPABASE_URL is not defined`
- `Module not found`
- `Build failed`
- `GitHub authentication required`

---

## ✅ Test: Manuel Trigger

GitHub entegrasyonu çalışıp çalışmadığını test edin:

1. Küçük bir değişiklik yapın:
```bash
echo "# Test deploy" >> README.md
git add README.md
git commit -m "test: Vercel deploy trigger"
git push origin main
```

2. Vercel dashboard'da **Deployments** bölümünü izleyin
3. 30 saniye içinde yeni deployment başlamalı

**Başlamazsa**: GitHub entegrasyonu sorunu var demektir.

---

## 🔧 Tam Reset (Son Çare)

Eğer hiçbir şey işe yaramazsa:

1. Vercel'de projeyi silin
2. Yeniden import edin:
   - https://vercel.com/new
   - Import Git Repository
   - ResulKorkmaz/OnlineUsta.com.tr seçin
   - Environment variables ekleyin
   - Deploy

---

## 📞 Destek

Eğer sorun devam ederse:
- Vercel Dashboard → Project → Settings → Support
- Veya: https://vercel.com/help

---

**Son Güncelleme**: 2025-10-02

