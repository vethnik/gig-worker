-- Add latitude and longitude columns to jobs table for map integration
ALTER TABLE public.jobs 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8);

-- Add index for location-based queries
CREATE INDEX idx_jobs_location ON public.jobs (latitude, longitude);

-- Add comment for documentation
COMMENT ON COLUMN public.jobs.latitude IS 'Latitude coordinate for job location (-90 to 90)';
COMMENT ON COLUMN public.jobs.longitude IS 'Longitude coordinate for job location (-180 to 180)';
