# Supabase Rate Limit Kontrolü ve Ayarları

## 🔍 Production'da Rate Limit Sorunu

**Durum**: Kullanıcı kayıt yaparken rate limit'e takılıyor  
**Hata**: "Çok fazla kayıt denemesi yaptınız..."

---

## ✅ Yapılacaklar

### 1. Supabase Dashboard'a Git

```
https://supabase.com/dashboard/project/zqvdnujpbbrwhnsylgmq
```

### 2. Rate Limits Kontrol Et

```
Menü: Authentication → Rate Limits

Kontrol Et:
□ Email rate limits (per hour)
□ IP rate limits (per hour)
□ Current usage/limits
```

### 3. Rate Limit İstatistiklerini Gör

```
Authentication → Logs

Filtrele:
- "rate_limit_exceeded" eventleri
- Son 24 saat
- Hangi email'ler etkilenmiş?
```

---

## 🛠️ Geçici Çözüm (Acil Durum)

Eğer çok fazla legitimate user etkileniyorsa:

### Opsiyon 1: Rate Limit Artır

```
Supabase Dashboard → Authentication → Rate Limits → Settings

Email Rate Limit:
[Mevcut] 4-5 deneme/saat
[Yeni]    10 deneme/saat  (geçici olarak artır)

⚠️ DİKKAT: Güvenlik riski! Sadece acil durumda
```

### Opsiyon 2: Specific Email Whitelist

```
SQL Editor'da çalıştır:

-- Belirli emailler için rate limit bypass (dikkatli!)
-- NOT: Bu özellik Supabase'de built-in değil
-- Manuel olarak auth metadata eklenebilir
```

---

## 📊 Rate Limit Metrics

### Normal Kullanım

```
✅ Email başına: 4-5 kayıt/saat
✅ IP başına: 30-50 istek/saat
✅ Kabul edilebilir: %95 başarı oranı
```

### Anormal Kullanım (Alarm)

```
❌ Aynı IP'den 100+ istek/saat
❌ Bot pattern (aynı interval)
❌ Başarı oranı <%50
```

---

## 🔧 Kod İyileştirmeleri (TODO)

### İyileştirme 1: Retry Mekanizması Optimize Et

**Sorun**: Rate limit varken 10 saniye gereksiz bekliyor

```typescript
// src/app/customer/register/page.tsx

// ❌ ŞİMDİ: Rate limit olsa bile 5×2=10 saniye retry
for (let attempt = 1; attempt <= 5; attempt++) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  // ...
}

// ✅ OLACAK: Rate limit varsa direkt fail
if (authError.message.includes("rate limit")) {
  throw new Error("..."); // Retry yapma!
}
```

### İyileştirme 2: Loading State Detaylandır

```typescript
// Kullanıcıya ne olduğunu göster
setLoading(true);
setLoadingMessage("Kullanıcı kaydı yapılıyor...");

// Auth başarılı
setLoadingMessage("Profil oluşturuluyor... (1/5)");

// Retry
setLoadingMessage("Profil oluşturuluyor... (2/5)");
```

---

## 🎯 Kısa Vadeli Çözüm (Şimdi)

### Kullanıcı için:

```
1. Farklı email kullan → Hızlı çözüm
2. 1-2 saat bekle → Kesin çözüm
3. Support'a yaz → Manuel onay
```

### Admin için:

```
1. Supabase Dashboard kontrol et
2. Rate limit istatistiklerini incele
3. Gerekirse geçici olarak artır (10/saat)
```

---

## 📝 Notlar

### Rate Limit Neden Var?

```
✅ Bot saldırılarını önler
✅ Spam kayıtları engeller
✅ Database yükünü azaltır
✅ Maliyeti kontrol eder
```

### Production Best Practices

```
1. Rate limit metrics izle
2. Alert kur (%80 threshold)
3. Whitelist sistemi düşün (verified users)
4. Progressive rate limiting (first-time vs repeat users)
```

---

**Son Güncelleme**: 2025-10-05  
**Durum**: Rate limit çalışıyor, kullanıcı dostu mesajlar aktif ✅

