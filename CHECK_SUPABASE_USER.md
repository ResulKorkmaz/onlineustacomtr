# 🔍 Supabase Kullanıcı Kontrolü

## Email: rslkrkmz@gmail.com

### Manuel Kontrol Adımları:

---

## 1️⃣ Auth Users Kontrolü

**Link:**
```
https://supabase.com/dashboard/project/zqvdnujpbbrwhnsylgmq/auth/users
```

**Ne Bakılacak:**
- ✅ `rslkrkmz@gmail.com` adresli kullanıcı var mı?
- ✅ Email confirmed mi? (yeşil işaret)
- ✅ Last Sign In tarihi var mı?

---

## 2️⃣ Profiles Tablosu Kontrolü

**Link:**
```
https://supabase.com/dashboard/project/zqvdnujpbbrwhnsylgmq/editor
```

**SQL Query Çalıştır:**

1. Sol menüden **"SQL Editor"** aç
2. Şu sorguyu çalıştır:

```sql
SELECT 
  id,
  email,
  role,
  provider_kind,
  full_name,
  company_name,
  phone,
  city,
  created_at,
  is_verified
FROM profiles
WHERE email = 'rslkrkmz@gmail.com';
```

**Beklenen Sonuç (eğer şahıs hizmet veren kaydı varsa):**
```
role: provider
provider_kind: individual
full_name: [İsim]
```

---

## 3️⃣ Alternatif: Tüm Provider'ları Listele

```sql
SELECT 
  email,
  role,
  provider_kind,
  full_name,
  created_at
FROM profiles
WHERE role = 'provider'
ORDER BY created_at DESC
LIMIT 10;
```

Bu sorgu son 10 hizmet veren kaydını gösterir.

---

## 🔧 Eğer Kayıt Yoksa

### Senin için manuel kayıt oluşturayım mı?

Eğer `rslkrkmz@gmail.com` ile kayıt yoksa:

1. **Localhost'ta yeni kayıt yap:**
   ```
   http://localhost:3000/register
   ```
   - Email: `rslkrkmz@gmail.com`
   - Tip: **Şahıs**
   - Bilgileri doldur

2. **Veya SQL ile manuel ekle:**
   ```sql
   -- Önce auth.users'a ekle (Supabase Dashboard'dan)
   -- Sonra profiles'a ekle
   ```

---

## 📋 Sonuç

Supabase Dashboard'dan kontrol et ve bana bildir:

- ❓ `rslkrkmz@gmail.com` kullanıcısı **var mı**?
- ❓ Profiles tablosunda **kayıt var mı**?
- ❓ Email **confirmed mu**?

Sonuçlara göre çözüm üretelim! 🚀



