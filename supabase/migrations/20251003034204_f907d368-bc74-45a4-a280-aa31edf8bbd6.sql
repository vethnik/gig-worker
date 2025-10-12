-- Update RLS policy to only show users their own applications
DROP POLICY IF EXISTS "Anyone can view job applications" ON public.job_applications;

CREATE POLICY "Users can view their own applications"
ON public.job_applications
FOR SELECT
USING (auth.uid() = user_id);