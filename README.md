# OnlineUsta - İhtiyacınız Olan Ustayı Bulun

<div align="center">

![OnlineUsta](https://via.placeholder.com/800x200/0EA5E9/ffffff?text=OnlineUsta)

**Modern, güvenli ve kullanıcı dostu usta-müşteri buluşma platformu**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-green)](https://supabase.com/)

</div>

## 🚀 Özellikler

- ✅ **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS
- ✅ **Güvenli Backend**: Supabase (PostgreSQL + RLS)
- ✅ **Akıllı Limitler**: DB trigger'larla günlük/haftalık kurallar
- ✅ **Real-time Bildirimler**: Anlık bilgilendirme sistemi
- ✅ **Rol Tabanlı**: Müşteri ve Hizmet Veren rolleri
- ✅ **Responsive Design**: Mobil-first yaklaşım
- ✅ **SEO Optimized**: Server-side rendering
- ✅ **Production Ready**: Docker, CI/CD hazır

## 📋 İçindekiler

- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Mimari](#mimari)
- [Dokümantasyon](#dokümantasyon)
- [Katkıda Bulunma](#katkıda-bulunma)

## 🛠️ Kurulum

### Gereksinimler

- Node.js 18+
- npm veya yarn
- Supabase hesabı

### Adımlar

1. **Repo'yu klonlayın**
\`\`\`bash
git clone https://github.com/yourorg/onlineusta.git
cd onlineusta
\`\`\`

2. **Bağımlılıkları yükleyin**
\`\`\`bash
npm install
\`\`\`

3. **Environment değişkenlerini ayarlayın**
\`\`\`bash
cp env.example .env.local
# .env.local dosyasını düzenleyin
\`\`\`

4. **Supabase migration'ı çalıştırın**
- Supabase Dashboard → SQL Editor
- \`supabase/migrations/0001_initial_schema.sql\` içeriğini çalıştırın

5. **Geliştirme sunucusunu başlatın**
\`\`\`bash
npm run dev
\`\`\`

http://localhost:3000 adresinden erişebilirsiniz.

## 🎯 Kullanım

### Müşteri Olarak

1. Kayıt olun / Giriş yapın
2. Onboarding'de "Müşteri" rolünü seçin
3. İlan oluşturun (İlan Oluştur butonu)
4. Gelen teklifleri inceleyin
5. En uygun teklifi seçin

### Hizmet Veren Olarak

1. Kayıt olun / Giriş yapın
2. Onboarding'de "Hizmet Veren" rolünü seçin
3. Şahıs veya Şirket seçimi yapın
4. İlanları inceleyin
5. Teklif gönderin (günde max 3)

## 🏗️ Mimari

\`\`\`
Frontend (Next.js 14)
    ↕
Supabase Auth + Postgres + RLS
    ↕
Edge Functions (Bildirimler)
\`\`\`

Detaylı mimari için: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## 📚 Dokümantasyon

| Dosya | Açıklama |
|-------|----------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Sistem mimarisi |
| [DATABASE.md](docs/DATABASE.md) | Veritabanı şeması |
| [RLS.md](docs/RLS.md) | Row Level Security politikaları |
| [API.md](docs/API.md) | API referansı |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment |

[Tüm dokümanlar için docs/ klasörüne bakın](docs/)

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Detaylar için [CONTRIBUTING.md](docs/CONTRIBUTING.md)

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

- Next.js ve Vercel ekibine
- Supabase ekibine
- Tüm açık kaynak katkıcılarına

---

<div align="center">
Made with ❤️ in Turkey
</div>

---

## 🚀 Production Deploy

**Live URL:** Coming soon...

### Environment Variables (Configured):
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY

### Database:
- ✅ Supabase Project: zqvdnujpbbrwhnsylgmq
- ✅ Region: US East (North Virginia)
- ✅ Tables: profiles, jobs, bids, notifications
- ✅ RLS Policies: Active
- ✅ Triggers: Active (Daily limits)

---
