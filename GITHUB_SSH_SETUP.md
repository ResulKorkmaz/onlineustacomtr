# GitHub SSH Key Kurulum Kılavuzu

**Tarih**: 2025-10-02  
**Hesap**: ResulKorkmaz  
**Proje**: onlineusta.com.tr

---

## 🔑 SSH Public Key

**Key Type**: ed25519  
**Email**: rslkrkmz@gmail.com

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKy6DqJlcfyKk7+6gS8qohZxhGM59Tu7cz7RvNiZvXVF rslkrkmz@gmail.com
```

---

## 📋 GitHub'a SSH Key Ekleme Adımları

### 1. GitHub SSH Settings

**Link**: [https://github.com/settings/keys](https://github.com/settings/keys)

### 2. New SSH Key

**"New SSH key"** butonuna tıklayın

### 3. Form Bilgileri

```
Title: OnlineUsta Project
Key type: Authentication Key
Key: [Yukarıdaki SSH key'i buraya yapıştırın]
```

### 4. Add SSH Key

**"Add SSH key"** butonuna tıklayın

### 5. Şifre Onayı

GitHub şifrenizi girin

---

## ✅ Test

SSH key'in çalışıp çalışmadığını test edin:

```bash
ssh -T git@github.com
```

**Beklenen Çıktı**:
```
Hi ResulKorkmaz! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 🚀 Repository Oluşturma (Sonraki Adım)

SSH key eklendikten sonra:

### 1. Yeni Repository Oluştur

**Link**: [https://github.com/new](https://github.com/new)

```
Repository name: OnlineUsta.com.tr
Description: İhtiyacınız Olan Ustayı Bulun - Hizmet Platformu
Visibility: Public
```

**ÖNEMLİ**: Initialize seçeneklerini (README, .gitignore, license) BOŞLUK BIRAKIN!

### 2. Git Remote Güncelle

```bash
cd /Users/resulkorkmaz/Downloads/web/onlineusta.com.tr
git remote set-url origin git@github.com:ResulKorkmaz/OnlineUsta.com.tr.git
```

### 3. Kodları Push Et

```bash
git push -u origin main --force
```

---

## 📊 Mevcut Durum

**Lokal Git**:
- ✅ Repository: Hazır
- ✅ Commits: 3 adet (fed0771, 472a580, 8e2f4d1)
- ✅ Branch: main

**GitHub**:
- ❌ Repository: Henüz yok (oluşturulacak)
- ⏳ SSH Key: Ekleniyor

**Sonraki**:
- 🔄 Repository oluştur
- 🔄 Push et
- 🔄 Vercel'e bağla

---

## 🔧 SSH Key Fingerprint

**Kaydedildi**: `.github-ssh-key`

```
SHA256:Z3S+k7UgzW0P5dHN7825Fz6Ay8VlMxzHuCejtOsePNw
```

---

## ⚠️ Önemli Notlar

1. **Public Key**: Sadece public key paylaşıldı (güvenli)
2. **Private Key**: ASLA paylaşılmaz (güvende)
3. **Multiple Keys**: Birden fazla SSH key var, doğru olanı seçildi
4. **Config**: SSH config dosyası kontrol edildi

---

**Hazırlayan**: AI Assistant  
**Durum**: SSH key hazır, GitHub'a eklenmeyi bekliyor

