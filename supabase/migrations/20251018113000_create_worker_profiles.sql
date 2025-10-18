-- Create worker_profiles table
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

-- Enable Row Level Security
ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for worker profile access
CREATE POLICY "Anyone can view worker profiles" 
ON public.worker_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create their own worker profile" 
ON public.worker_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own worker profile" 
ON public.worker_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own worker profile" 
ON public.worker_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_worker_profiles_updated_at
BEFORE UPDATE ON public.worker_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_worker_profiles_user_id ON public.worker_profiles(user_id);
CREATE INDEX idx_worker_profiles_trade ON public.worker_profiles(trade);
CREATE INDEX idx_worker_profiles_location ON public.worker_profiles(location);
CREATE INDEX idx_worker_profiles_rating ON public.worker_profiles(rating DESC);
