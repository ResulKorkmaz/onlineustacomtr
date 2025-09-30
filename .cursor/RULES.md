# RULES.md – OnlineUsta Proje Kuralları

Bu dosya, sistemin işleyiş kurallarını, kullanıcı sınırlarını ve teknik prensipleri içerir.  
Amaç: Tüm ekip aynı çerçevede çalışsın, proje dışına çıkılmasın.

---

## 1. Kullanıcı Roller ve Kayıt

- **Müşteri (customer)**
  - Günlük **en fazla 1 ilan** yayınlayabilir.
  - İkinci ilan için **son ilandan itibaren ≥7 gün** geçmelidir.
  - Kendi ilanlarına gelen tüm tekliflerin içeriğini görebilir.

- **Hizmet Veren (provider)**
  - İki tip: **Şahıs (individual)** veya **Şirket (company)**.
  - Günlük **en fazla 3 teklif** verebilir.
  - Yalnızca **kendi tekliflerini** görebilir.
  - İlanlardaki **toplam teklif sayısını** görebilir, içeriklerini göremez.

---

## 2. İlan Kuralları

- İlan oluştururken başlık, açıklama, şehir ve ilçe zorunlu alanlardır.
- Bütçe aralığı isteğe bağlıdır.
- İlan durumu: `open | closed | awarded | cancelled`.
- İlan yayına alındığında, aynı şehirdeki hizmet verenlere bildirim gönderilir.

---

## 3. Teklif Kuralları

- Teklif, yalnızca **aktif (open)** ilanlara yapılabilir.
- Bir hizmet veren, aynı ilana **birden fazla teklif veremez** (unique constraint).
- Teklif silinirse, ilan üzerindeki `bid_count` bir azaltılır.

---

## 4. Bildirim Kuralları

- Yeni ilan → aynı şehirdeki hizmet verenlere bildirim.
- Yeni teklif → ilan sahibine bildirim.
- Teklif durumu değişirse (kabul/red) → hizmet verene bildirim.
- Bildirimler hem **veritabanında (notifications tablosu)** tutulur hem de e-posta/push olarak gönderilir.

---

## 5. Profil Kuralları

- Kullanıcı kendi profilini görüntüleyip düzenleyebilir.
- Hizmet verenler hizmet alanı (şehir/ilçe) eklemek zorundadır.
- Şirket tipi sağlayıcılar şirket adı ve vergi numarası girmelidir.
- Telefon numarası gizleme/gösterme tercihi kullanıcıya aittir.

---

## 6. CMS ve Dinamik Alanlar

- Hero başlığı, alt metinleri, SSS ve KVKK gibi içerikler **MDX dosyaları** üzerinden yönetilir.
- Kategoriler ve şehir listesi veritabanından gelir.
- Limit değerleri (örn. günlük teklif sayısı) `.env` veya `settings` tablosu üzerinden güncellenebilir.

---

## 7. Güvenlik Kuralları

- Tüm erişim **Supabase RLS politikaları** ile korunur.
- Kullanıcı yalnızca kendi verilerini görebilir/güncelleyebilir.
- Kritik kontroller (ilan sıklığı, teklif limiti) **DB tetikleyicilerinde** zorunlu kılınır.
- UI yalnızca kullanıcı deneyimini kolaylaştırır, güvenlik için tek başına yeterli değildir.

---

## 8. UI ve Tasarım Kuralları

- Ana renk: **#0EA5E9 (Sky-500)**  
- Yardımcı renk: **#0EA66C (Yeşil)**  
- Vurgu rengi: **#F59E0B**  
- Arka plan: **#F8FAFC**  
- Tipografi: açık, net, Türkçe etiketler.
- Tasarım prensibi: minimal, kart tabanlı, responsive.

---

## 9. Navigasyon ve Sayfa Yapısı

- Üst menü: Logo, Kategoriler, Şehirler, İlan Oluştur, Giriş/Profil.
- Ana sayfa: Hero, arama kutusu, kategori grid, ilan listesi.
- Dashboard: Profil, İlanlar, Teklifler, Bildirimler.
- Footer: Hakkımızda, KVKK, İletişim, Sosyal linkler.

---

## 10. Teknik Kurallar

- Kod dili: **TypeScript** (strict).
- Framework: **Next.js (App Router)**.
- UI: **Tailwind CSS** utility-first.
- Veritabanı: **Supabase (Postgres)**.
- İçerik: **MDX + Contentlayer**.
- Bildirim: **Supabase Edge Function** + e-posta sağlayıcı (Resend/Postmark).
- Commit mesajları: **Conventional Commits** formatında.
- ESLint + Prettier ile kod formatı zorunlu.

---

## 11. Geliştirme Kuralları

- Yeni özellik → önce **dokümantasyon güncellemesi**, sonra kod.
- Tüm migration’lar `/supabase/migrations` altında tutulur.
- `docs/` klasörü dışına çıkılmaz, proje notları buraya yazılır.
- Test: birim testleri (Vitest/Jest), ileride e2e (Playwright).
- Performans: Lighthouse puanı ≥ 90.

---

## 12. Gelecek Özellikler (opsiyonel)

- Yorum ve puanlama sistemi.
- Ödeme altyapısı (Stripe/Paddle).
- Dosya yükleme (önce/sonra görselleri).
- Gerçek zamanlı bildirimler (Supabase Realtime).
- Çok dil desteği (i18n).

---
