-- ==============================================================================
-- BID COUNT TRİGGER SORUNU ÇÖZÜMÜ
-- ==============================================================================

-- 1. Önce mevcut durumu kontrol et
SELECT 
  j.id,
  j.title,
  j.bid_count as "görünen_teklif_sayısı",
  (SELECT COUNT(*) FROM bids WHERE job_id = j.id) as "gerçek_teklif_sayısı"
FROM jobs j
ORDER BY j.created_at DESC
LIMIT 10;

-- 2. Trigger'ları kontrol et
SELECT 
  tgname as trigger_name,
  tgenabled as enabled
FROM pg_trigger 
WHERE tgname IN ('trg_increment_bid_count', 'trg_decrement_bid_count');

-- 3. Tüm bid_count'ları düzelt
UPDATE jobs
SET bid_count = (
  SELECT COUNT(*) 
  FROM bids 
  WHERE job_id = jobs.id
);

-- 4. Eğer trigger yoksa veya disabled ise, yeniden oluştur
DROP TRIGGER IF EXISTS trg_increment_bid_count ON public.bids;
DROP TRIGGER IF EXISTS trg_decrement_bid_count ON public.bids;

-- Trigger'ları yeniden oluştur
CREATE TRIGGER trg_increment_bid_count 
AFTER INSERT ON public.bids
FOR EACH ROW 
EXECUTE FUNCTION public.increment_bid_count();

CREATE TRIGGER trg_decrement_bid_count 
AFTER DELETE ON public.bids
FOR EACH ROW 
EXECUTE FUNCTION public.decrement_bid_count();

-- 5. Kontrol: Tekrar bid_count'u kontrol et
SELECT 
  j.id,
  j.title,
  j.bid_count,
  (SELECT COUNT(*) FROM bids WHERE job_id = j.id) as actual_count
FROM jobs j
WHERE j.bid_count != (SELECT COUNT(*) FROM bids WHERE job_id = j.id)
LIMIT 10;

-- Eğer yukarıdaki sorgu sonuç dönerse, bid_count yanlış demektir
-- Sonuç boş dönerse, her şey doğru demektir ✅

