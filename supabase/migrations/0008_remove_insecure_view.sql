-- ==============================================================================
-- Remove Insecure View: jobs_with_details
-- Security issue: SECURITY DEFINER bypasses RLS
-- ==============================================================================

-- 1. Drop the view (it's not used in the application)
DROP VIEW IF EXISTS public.jobs_with_details;

-- 2. Comment
COMMENT ON SCHEMA public IS 'OnlineUsta - Removed insecure SECURITY DEFINER view';

-- ==============================================================================
-- EXPLANATION
-- ==============================================================================

-- Why remove?
-- 1. SECURITY DEFINER bypasses RLS policies
-- 2. Exposes sensitive data (customer phone numbers)
-- 3. Not used in application code (we use joins directly)

-- Alternative:
-- Application code already does proper joins with RLS:
-- 
-- const { data: jobs } = await supabase
--   .from("jobs")
--   .select(`
--     *,
--     customer:profiles!customer_id(full_name, company_name, avatar_url),
--     category:categories(name, slug, icon_name)
--   `)
--
-- This respects RLS policies properly.

-- ==============================================================================

