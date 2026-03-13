-- Add positions tracking to jobs table
ALTER TABLE public.jobs 
ADD COLUMN positions_available INTEGER NOT NULL DEFAULT 1,
ADD COLUMN positions_filled INTEGER NOT NULL DEFAULT 0;

-- Create job_applications table to track who applied to which job
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Enable RLS on job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can view applications
CREATE POLICY "Anyone can view job applications"
ON public.job_applications
FOR SELECT
USING (true);

-- Authenticated users can create applications
CREATE POLICY "Authenticated users can apply to jobs"
ON public.job_applications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own applications
CREATE POLICY "Users can withdraw their applications"
ON public.job_applications
FOR DELETE
USING (auth.uid() = user_id);

-- Function to increment positions_filled when someone applies
CREATE OR REPLACE FUNCTION public.increment_positions_filled()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.jobs
  SET positions_filled = positions_filled + 1
  WHERE id = NEW.job_id;
  RETURN NEW;
END;
$$;

-- Function to decrement positions_filled when someone withdraws
CREATE OR REPLACE FUNCTION public.decrement_positions_filled()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.jobs
  SET positions_filled = positions_filled - 1
  WHERE id = OLD.job_id;
  RETURN OLD;
END;
$$;

-- Trigger to increment when application is created
CREATE TRIGGER on_job_application_created
  AFTER INSERT ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_positions_filled();

-- Trigger to decrement when application is deleted
CREATE TRIGGER on_job_application_deleted
  AFTER DELETE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_positions_filled();