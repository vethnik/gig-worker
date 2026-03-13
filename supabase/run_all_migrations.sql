-- ============================================================
-- MIGRATION 1: Create jobs table
-- ============================================================
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  wage TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view jobs" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own jobs" ON public.jobs FOR DELETE USING (auth.uid() = user_id);
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- MIGRATION 2: Positions + job applications
-- ============================================================
ALTER TABLE public.jobs
  ADD COLUMN positions_available INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN positions_filled INTEGER NOT NULL DEFAULT 0;

CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, user_id)
);
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own applications" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can apply to jobs" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can withdraw their applications" ON public.job_applications FOR DELETE USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.increment_positions_filled()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN UPDATE public.jobs SET positions_filled = positions_filled + 1 WHERE id = NEW.job_id; RETURN NEW; END;
$$;
CREATE OR REPLACE FUNCTION public.decrement_positions_filled()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN UPDATE public.jobs SET positions_filled = positions_filled - 1 WHERE id = OLD.job_id; RETURN OLD; END;
$$;
CREATE TRIGGER on_job_application_created
  AFTER INSERT ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.increment_positions_filled();
CREATE TRIGGER on_job_application_deleted
  AFTER DELETE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.decrement_positions_filled();

-- ============================================================
-- MIGRATION 3: Saved jobs
-- ============================================================
CREATE TABLE public.saved_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own saved jobs" ON public.saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can save jobs" ON public.saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsave jobs" ON public.saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- MIGRATION 4: Profiles table
-- ============================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  location TEXT,
  phone TEXT,
  skills TEXT[],
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- MIGRATION 5: Job coordinates
-- ============================================================
ALTER TABLE public.jobs
  ADD COLUMN latitude DECIMAL(10, 8),
  ADD COLUMN longitude DECIMAL(11, 8);
CREATE INDEX idx_jobs_location ON public.jobs (latitude, longitude);

-- ============================================================
-- MIGRATION 6: Worker profiles
-- ============================================================
CREATE TABLE public.worker_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trade TEXT NOT NULL,
  location TEXT NOT NULL,
  years_experience INTEGER NOT NULL DEFAULT 0,
  bio TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  hourly_rate TEXT NOT NULL,
  availability TEXT NOT NULL DEFAULT 'Available',
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  certifications TEXT[] DEFAULT '{}',
  previous_work TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{"English"}',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view worker profiles" ON public.worker_profiles FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create their own worker profile" ON public.worker_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own worker profile" ON public.worker_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own worker profile" ON public.worker_profiles FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER update_worker_profiles_updated_at
  BEFORE UPDATE ON public.worker_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_worker_profiles_user_id ON public.worker_profiles(user_id);
CREATE INDEX idx_worker_profiles_trade ON public.worker_profiles(trade);
CREATE INDEX idx_worker_profiles_location ON public.worker_profiles(location);
CREATE INDEX idx_worker_profiles_rating ON public.worker_profiles(rating DESC);
