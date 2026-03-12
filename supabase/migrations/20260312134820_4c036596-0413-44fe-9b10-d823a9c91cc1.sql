
-- Multiplayer rooms table
CREATE TABLE public.multiplayer_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  host_id uuid NOT NULL,
  category_id text,
  category_name text,
  category_icon text,
  difficulty text DEFAULT 'medium',
  custom_topic text,
  status text DEFAULT 'waiting',
  questions jsonb DEFAULT '[]'::jsonb,
  current_question_index integer DEFAULT -1,
  question_started_at timestamptz,
  max_players integer DEFAULT 4,
  is_matchmaking boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.multiplayer_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rooms" ON public.multiplayer_rooms
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can create rooms" ON public.multiplayer_rooms
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Host can update room" ON public.multiplayer_rooms
  FOR UPDATE TO authenticated USING (auth.uid() = host_id);

CREATE POLICY "Host can delete room" ON public.multiplayer_rooms
  FOR DELETE TO authenticated USING (auth.uid() = host_id);

-- Multiplayer players table
CREATE TABLE public.multiplayer_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES public.multiplayer_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid NOT NULL,
  username text NOT NULL DEFAULT '',
  avatar_url text,
  score integer DEFAULT 0,
  current_answer integer,
  answers jsonb DEFAULT '[]'::jsonb,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

ALTER TABLE public.multiplayer_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read players" ON public.multiplayer_players
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can join" ON public.multiplayer_players
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Players update own record" ON public.multiplayer_players
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Players can leave" ON public.multiplayer_players
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.multiplayer_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.multiplayer_players;
