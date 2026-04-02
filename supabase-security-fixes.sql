-- Güvenlik yamaları (mevcut projede SQL Editor'da çalıştır)
-- 1) handle_new_user: search_path + idempotent insert
-- 2) profiles: kullanıcılar plan/email/qr_count/created_at/id değiştiremez (service_role / postgres hariç)

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_profile_user_updates()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF session_user IN ('postgres', 'supabase_admin') OR auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Cannot change profile id';
  END IF;
  IF NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Cannot change email';
  END IF;
  IF NEW.plan IS DISTINCT FROM OLD.plan THEN
    RAISE EXCEPTION 'Cannot change plan';
  END IF;
  IF NEW.qr_count IS DISTINCT FROM OLD.qr_count THEN
    RAISE EXCEPTION 'Cannot change qr_count';
  END IF;
  IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Cannot change created_at';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profile_restrict_user_updates ON public.profiles;
CREATE TRIGGER profile_restrict_user_updates
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_user_updates();
