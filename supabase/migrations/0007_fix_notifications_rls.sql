-- ==============================================================================
-- Notifications RLS Policy Düzeltmesi
-- Trigger'lar otomatik bildirim oluşturabilsin
-- ==============================================================================

-- Mevcut policy'leri kontrol et
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;

-- 1. Sistem/Trigger'lar bildirim ekleyebilsin
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Alternatif: Sadece authenticated kullanıcılar ekleyebilsin
-- CREATE POLICY "Authenticated users can insert notifications"
--   ON public.notifications FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');

-- ==============================================================================
-- Notlar:
-- - Trigger'lar (notify_customer_of_new_bid, notify_providers_of_new_job) 
--   otomatik bildirim oluşturur
-- - WITH CHECK (true) tüm insert işlemlerine izin verir
-- - Güvenlik için sadece trigger'lardan gelenlere izin verilebilir
-- ==============================================================================

