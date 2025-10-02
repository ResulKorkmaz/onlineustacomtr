-- ==============================================================================
-- Teklif düzenleme sayısı alanı ekle
-- ==============================================================================

-- edit_count alanı ekle
ALTER TABLE public.bids ADD COLUMN IF NOT EXISTS edit_count integer DEFAULT 0 NOT NULL;

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_bids_edit_count ON public.bids(edit_count);

-- Yorum ekle
COMMENT ON COLUMN public.bids.edit_count IS 'Teklifin kaç kez düzenlendiği (maksimum 3)';

