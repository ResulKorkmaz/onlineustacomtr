# 📧 Email Confirmation Sorunu - Çözüm

## Sorun
Kayıt olduktan sonra login sayfasına yönlendiriliyor çünkü Supabase email confirmation bekliyor ve session başlamıyor.

## Çözüm 1: Email Confirmation'ı Kapat (Geliştirme İçin)

### Supabase Dashboard'da:

1. **https://supabase.com/dashboard** → slhjmeeghsdwvigxfhln projesi
2. **Authentication** > **Providers** > **Email**
3. **"Confirm email"** ayarını **KAPATIN** (OFF)
4. **Save** butonuna tıklayın

Bu sayede kayıt olduktan sonra direkt session başlar ve profil sayfasına gider.

## Çözüm 2: Kod ile Handle Et (Production İçin)

Email confirmation açık kalacaksa, register sayfasında bilgilendirme göster:

```typescript
if (authData.user && !authData.session) {
  // Email confirmation bekleniyor
  router.push("/email-confirmation?email=" + formData.email);
}
```

## Önerilen: Geliştirme Aşamasında

**Email confirmation'ı KAPATIN** - böylece test daha kolay olur.

Production'da açarsınız ve email confirmation sayfası eklersiniz.

