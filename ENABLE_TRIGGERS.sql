-- ==============================================================================
-- TRİGGER'LARI AKTİF ET VE BID_COUNT'U DÜZELT
-- ==============================================================================

-- 1. Tüm bid_count'ları manuel düzelt (trigger olmadan)
UPDATE jobs
SET bid_count = (
  SELECT COUNT(*) 
  FROM bids 
  WHERE job_id = jobs.id
);

-- 2. Eski trigger'ları sil
DROP TRIGGER IF EXISTS trg_increment_bid_count ON public.bids;
DROP TRIGGER IF EXISTS trg_decrement_bid_count ON public.bids;

-- 3. Fonksiyonları kontrol et (varsa kullan, yoksa oluştur)
CREATE OR REPLACE FUNCTION public.increment_bid_count()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.jobs 
  SET bid_count = bid_count + 1 
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_bid_count()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.jobs 
  SET bid_count = GREATEST(bid_count - 1, 0) 
  WHERE id = OLD.job_id;
  RETURN OLD;
END;
$$;

-- 4. Trigger'ları YENİDEN OLUŞTUR (bu sefer enabled olacak)
CREATE TRIGGER trg_increment_bid_count 
  AFTER INSERT ON public.bids
  FOR EACH ROW 
  EXECUTE FUNCTION public.increment_bid_count();

CREATE TRIGGER trg_decrement_bid_count 
  AFTER DELETE ON public.bids
  FOR EACH ROW 
  EXECUTE FUNCTION public.decrement_bid_count();

-- 5. KONTROL: Trigger'lar aktif mi?
SELECT 
  tgname as trigger_name,
  CASE 
    WHEN tgenabled = 'O' THEN 'ENABLED ✅'
    WHEN tgenabled = 'D' THEN 'DISABLED ❌'
    ELSE tgenabled::text
  END as status
FROM pg_trigger 
WHERE tgname IN ('trg_increment_bid_count', 'trg_decrement_bid_count');

-- 6. KONTROL: Bid count'lar doğru mu?
SELECT 
  j.id,
  j.title,
  j.bid_count as "görünen",
  (SELECT COUNT(*) FROM bids WHERE job_id = j.id) as "gerçek"
FROM jobs j
ORDER BY j.created_at DESC
LIMIT 10;

-- Eğer her şey doğruysa, son satır boş dönmeli:
SELECT 
  j.id,
  j.title,
  j.bid_count,
  (SELECT COUNT(*) FROM bids WHERE job_id = j.id) as actual
FROM jobs j
WHERE j.bid_count != (SELECT COUNT(*) FROM bids WHERE job_id = j.id);

