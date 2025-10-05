-- Teklif sayısını kontrol et
-- Bu SQL'i Supabase SQL Editor'de çalıştır

-- 1. Her ilanın bid_count değeri
SELECT 
  id, 
  title, 
  bid_count,
  (SELECT COUNT(*) FROM bids WHERE job_id = jobs.id) as actual_bid_count
FROM jobs
ORDER BY created_at DESC
LIMIT 10;

-- 2. Eğer bid_count yanlışsa, düzelt
UPDATE jobs
SET bid_count = (SELECT COUNT(*) FROM bids WHERE job_id = jobs.id);

-- 3. Trigger kontrol
-- Trigger'ın aktif olup olmadığını kontrol et
SELECT * FROM pg_trigger WHERE tgname = 'trg_increment_bid_count';

