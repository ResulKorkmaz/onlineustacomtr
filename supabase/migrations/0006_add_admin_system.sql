-- Admin System Migration
-- Super Admin, Admin, Editor rolleri için database yapısı

-- 1. Profiles tablosuna admin alanları ekle
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS admin_role TEXT CHECK (admin_role IN ('super_admin', 'admin', 'editor')),
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_by_admin UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- 2. Admin activity log tablosu
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'ban', 'approve'
  target_type TEXT NOT NULL, -- 'user', 'job', 'bid', 'admin'
  target_id TEXT NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Index'ler
CREATE INDEX IF NOT EXISTS idx_profiles_admin_role ON public.profiles(admin_role) WHERE admin_role IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_is_super_admin ON public.profiles(is_super_admin) WHERE is_super_admin = TRUE;
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON public.admin_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- 4. RLS Policies - Admin Logs (sadece adminler görebilir)
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Admin'ler kendi loglarını görebilir
CREATE POLICY "Admins can view their own logs"
ON public.admin_logs
FOR SELECT
TO authenticated
USING (
  admin_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND admin_role IN ('super_admin', 'admin')
  )
);

-- Admin'ler log oluşturabilir
CREATE POLICY "Admins can create logs"
ON public.admin_logs
FOR INSERT
TO authenticated
WITH CHECK (
  admin_id = auth.uid()
  AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND admin_role IS NOT NULL
  )
);

-- 5. Function: Super Admin kontrol
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id
    AND is_super_admin = TRUE
  );
END;
$$;

-- 6. Function: Admin rolü kontrol
CREATE OR REPLACE FUNCTION public.has_admin_role(user_id UUID, required_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT admin_role INTO user_role
  FROM public.profiles
  WHERE id = user_id;
  
  IF user_role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Super admin her şeye erişebilir
  IF user_role = 'super_admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Role hierarchy: super_admin > admin > editor
  IF required_role = 'editor' THEN
    RETURN user_role IN ('super_admin', 'admin', 'editor');
  ELSIF required_role = 'admin' THEN
    RETURN user_role IN ('super_admin', 'admin');
  ELSIF required_role = 'super_admin' THEN
    RETURN user_role = 'super_admin';
  END IF;
  
  RETURN FALSE;
END;
$$;

-- 7. İlk Super Admin oluşturma için yardımcı function
-- Not: Bu function'ı manuel olarak çalıştırıp ilk super admin'i oluşturmalısın
CREATE OR REPLACE FUNCTION public.create_first_super_admin(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Email'e göre user bul
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'User not found with email: %', user_email;
  END IF;
  
  -- Super admin yap
  UPDATE public.profiles
  SET 
    admin_role = 'super_admin',
    is_super_admin = TRUE,
    updated_at = NOW()
  WHERE id = user_id;
  
  RAISE NOTICE 'Super admin created successfully for: %', user_email;
END;
$$;

-- 8. Trigger: Super admin silinmeyi engelle
CREATE OR REPLACE FUNCTION public.prevent_super_admin_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.is_super_admin = TRUE THEN
    RAISE EXCEPTION 'Super admin cannot be deleted';
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER prevent_super_admin_deletion_trigger
BEFORE DELETE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_super_admin_deletion();

-- 9. Trigger: Super admin role değişikliğini engelle
CREATE OR REPLACE FUNCTION public.prevent_super_admin_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Eğer eski super admin ise ve role değiştiriliyorsa
  IF OLD.is_super_admin = TRUE AND NEW.is_super_admin = FALSE THEN
    RAISE EXCEPTION 'Super admin role cannot be removed';
  END IF;
  
  -- Eğer eski super admin ise ve admin_role değiştiriliyorsa
  IF OLD.is_super_admin = TRUE AND NEW.admin_role != 'super_admin' THEN
    RAISE EXCEPTION 'Super admin role cannot be changed';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_super_admin_role_change_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_super_admin_role_change();

-- 10. Comment'ler
COMMENT ON COLUMN public.profiles.admin_role IS 'Admin role: super_admin, admin, or editor';
COMMENT ON COLUMN public.profiles.is_super_admin IS 'Super admin flag - cannot be deleted or role changed';
COMMENT ON COLUMN public.profiles.created_by_admin IS 'ID of admin who created this admin user';
COMMENT ON COLUMN public.profiles.admin_notes IS 'Internal notes about this user (visible only to admins)';
COMMENT ON COLUMN public.profiles.last_login_at IS 'Last login timestamp';

COMMENT ON TABLE public.admin_logs IS 'Admin activity logging for audit trail';
COMMENT ON COLUMN public.admin_logs.action IS 'Action performed: create, update, delete, ban, approve, etc.';
COMMENT ON COLUMN public.admin_logs.target_type IS 'Type of target: user, job, bid, admin';
COMMENT ON COLUMN public.admin_logs.target_id IS 'ID of the target entity';
COMMENT ON COLUMN public.admin_logs.details IS 'Additional details about the action (JSON)';

