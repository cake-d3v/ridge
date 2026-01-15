-- Create profile_badges table to track which badges users have earned
CREATE TABLE public.profile_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profile_id, badge_type)
);

-- Enable RLS
ALTER TABLE public.profile_badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view badges on public profiles
CREATE POLICY "Badges on public profiles are viewable"
  ON public.profile_badges
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = profile_badges.profile_id
      AND (profiles.is_public = true OR profiles.user_id = auth.uid())
    )
  );

-- Users can manage their own badges (for system to insert)
CREATE POLICY "System can insert badges"
  ON public.profile_badges
  FOR INSERT
  WITH CHECK (true);

-- Add show_badges column to profiles for toggle
ALTER TABLE public.profiles ADD COLUMN show_badges BOOLEAN DEFAULT true;