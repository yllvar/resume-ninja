-- Enable Row Level Security on all tables

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- Resumes RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "resumes_select_own" ON public.resumes 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "resumes_insert_own" ON public.resumes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "resumes_update_own" ON public.resumes 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "resumes_delete_own" ON public.resumes 
  FOR DELETE USING (auth.uid() = user_id);

-- Analyses RLS
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analyses_select_own" ON public.analyses 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "analyses_insert_own" ON public.analyses 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "analyses_delete_own" ON public.analyses 
  FOR DELETE USING (auth.uid() = user_id);

-- Usage logs RLS (users can only see their own logs)
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usage_logs_select_own" ON public.usage_logs 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "usage_logs_insert_own" ON public.usage_logs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
