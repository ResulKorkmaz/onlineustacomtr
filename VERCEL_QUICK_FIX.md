# 🚀 Vercel Otomatik Deploy - Hızlı Çözüm

**Durum**: GitHub'a push yapıldı ama Vercel otomatik deploy etmiyor.

---

## ⚡ EN HIZLI ÇÖZÜM (2 Dakika)

### Seçenek 1: Manuel Trigger (Önerilen)

```bash
# Terminal'de şunu çalıştırın:
vercel login

# Login olduktan sonra:
vercel --prod
```

Bu komut projeyi hemen deploy eder ve sorunun kaynağını da gösterir.

---

### Seçenek 2: Vercel Dashboard'dan

1. https://vercel.com/dashboard adresine gidin
2. **onlineusta.com.tr** projesini bulun
3. Sağ üstten **Redeploy** butonuna tıklayın
4. "Use existing Build Cache" seçeneğini KAPATIN
5. **Redeploy** tıklayın

---

## 🔍 ASIL SORUN: GitHub Entegrasyonu

Otomatik deploy çalışmıyorsa **%90 ihtimalle** GitHub entegrasyonu sorunludur.

### Adım 1: Entegrasyon Kontrolü

1. https://vercel.com/dashboard → Projenizi açın
2. **Settings** (⚙️) → **Git** sekmesine gidin
3. Şunları kontrol edin:

```
✓ Connected to: GitHub
✓ Repository: ResulKorkmaz/OnlineUsta.com.tr
✓ Production Branch: main
```

**Eğer "Not Connected" yazıyorsa**:
- **Connect Git Repository** butonuna tıklayın
- GitHub'ı seçin ve authorize edin
- Repository'yi seçin: `ResulKorkmaz/OnlineUsta.com.tr`

### Adım 2: Auto-Deploy Ayarları

Aynı **Settings → Git** sayfasında:

```
✓ Automatically deploy commits pushed to Production Branch: ON
✓ Ignored Build Step: OFF (ya da None)
✓ Deploy Previews: ON (pull request'ler için)
```

### Adım 3: Environment Variables

**Settings** → **Environment Variables**

Şu değişkenler **mutlaka** olmalı:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://zqvdnujpbbrwhnsylgmq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[supabase-anon-key]
```

**Önemli**: Her environment için (Production, Preview, Development) ayrı ayrı ekleyin!

---

## 🧪 Test: Deploy Trigger

GitHub entegrasyonunu test edin:

```bash
# Küçük bir değişiklik yapın
echo "# Deploy test - $(date)" >> VERCEL_DEBUG.md

# Commit ve push
git add VERCEL_DEBUG.md
git commit -m "test: vercel auto-deploy trigger"
git push origin main
```

**Beklenen Sonuç**: 30 saniye içinde Vercel'de yeni deployment başlamalı.

Vercel Dashboard → **Deployments** sekmesini açık tutun ve izleyin.

---

## ❌ Yaygın Sorunlar ve Çözümleri

### Sorun 1: "Build Failed"

**Neden**: Environment variables eksik

**Çözüm**:
```bash
# Settings → Environment Variables
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Sorun 2: "Deployment Skipped"

**Neden**: Ignored Build Step aktif

**Çözüm**:
- Settings → Git → Ignored Build Step → None

### Sorun 3: "No GitHub Integration"

**Neden**: GitHub App authorize edilmemiş

**Çözüm**:
1. https://github.com/settings/installations
2. Vercel'i bulun
3. **Configure** → Repository access
4. `ResulKorkmaz/OnlineUsta.com.tr` ekleyin

### Sorun 4: "Branch Not Found"

**Neden**: Production branch yanlış ayarlanmış

**Çözüm**:
- Settings → Git → Production Branch → `main` (master değil!)

---

## 🔄 Tam Reset (Eğer hiçbir şey çalışmazsa)

### 1. GitHub Entegrasyonunu Kaldır

```
Settings → Git → Disconnect
```

### 2. Yeniden Bağla

```
Settings → Git → Connect Git Repository
→ GitHub seçin
→ ResulKorkmaz/OnlineUsta.com.tr seçin
→ main branch seçin
```

### 3. Environment Variables'ı Ekle

```
Settings → Environment Variables
→ Tüm required değişkenleri ekleyin
```

### 4. Deployment Trigger

```bash
git commit --allow-empty -m "chore: trigger vercel deploy"
git push origin main
```

---

## 📊 Deployment Log Analizi

Eğer deploy başladı ama failed olduysa:

1. **Deployments** → Failed deployment'a tıklayın
2. **Build Logs** sekmesine gidin
3. Hata mesajını inceleyin

**Yaygın Hatalar**:

```bash
# Error: Environment variable not found
→ Çözüm: Settings → Environment Variables ekleyin

# Error: Module not found
→ Çözüm: npm install düzgün çalışmıyor, dependencies kontrol edin

# Error: Build timeout
→ Çözüm: vercel.json'da buildCommand'ı kontrol edin
```

---

## ✅ Başarı Kontrolü

Deploy başarılı olduğunda:

1. **Deployments** sekmesinde "Ready" durumu görülür
2. Visit butonuna tıklayın
3. Site açılıyorsa ✅ Başarılı!

**Production URL**: https://onlineusta-com-tr.vercel.app (veya custom domain)

---

## 🎯 ÖNERİLEN AKSIYON PLANI

1. **Hemen Şimdi**: `vercel --prod` ile manuel deploy
2. **5 Dakika**: Vercel Settings → Git entegrasyonunu kontrol et
3. **10 Dakika**: Environment variables ekle
4. **Test**: Git push yapıp otomatik deploy'u test et

---

**Hazırlayan**: AI Assistant  
**Tarih**: 2025-10-02  
**Proje**: onlineusta.com.tr

