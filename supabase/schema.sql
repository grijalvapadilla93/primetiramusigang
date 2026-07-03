-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  accent TEXT NOT NULL CHECK (accent IN ('pablo', 'julio')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habits master list
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  unit TEXT,
  target_value REAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User habit subscriptions (which habits each user follows)
CREATE TABLE user_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, habit_id)
);

-- Daily habit logs
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  value REAL,
  note TEXT,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, habit_id, date)
);

-- Streak tracking (denormalized for performance)
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_log_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, habit_id)
);

-- Team streak
CREATE TABLE team_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_log_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Savings goals
CREATE TABLE savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  month TEXT NOT NULL,
  year INT NOT NULL,
  target_amount REAL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Monthly savings records
CREATE TABLE savings_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES savings_goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount REAL DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(goal_id, user_id, date)
);

-- Goals / objectives
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  progress REAL DEFAULT 0,
  target REAL DEFAULT 100,
  color TEXT DEFAULT 'bg-primary',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Profiles are readable by authenticated users
CREATE POLICY "profiles_read" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Habits are readable by all authenticated users
CREATE POLICY "habits_read" ON habits FOR SELECT TO authenticated USING (true);

-- User habits: users can manage their own subscriptions
CREATE POLICY "user_habits_read" ON user_habits FOR SELECT TO authenticated USING (true);
CREATE POLICY "user_habits_manage" ON user_habits FOR ALL TO authenticated USING (user_id = auth.uid());

-- Logs: users manage their own logs
CREATE POLICY "logs_read" ON habit_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "logs_manage" ON habit_logs FOR ALL TO authenticated USING (user_id = auth.uid());

-- Streaks readable by all
CREATE POLICY "streaks_read" ON streaks FOR SELECT TO authenticated USING (true);

-- Team streaks readable by all
CREATE POLICY "team_streaks_read" ON team_streaks FOR SELECT TO authenticated USING (true);

-- Savings: readable by all, manageable by self
CREATE POLICY "savings_read" ON savings_goals FOR SELECT TO authenticated USING (true);
CREATE POLICY "savings_records_read" ON savings_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "savings_records_manage" ON savings_records FOR ALL TO authenticated USING (user_id = auth.uid());

-- Goals: users manage their own
CREATE POLICY "goals_read" ON goals FOR SELECT TO authenticated USING (true);
CREATE POLICY "goals_manage" ON goals FOR ALL TO authenticated USING (user_id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, accent)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), COALESCE(NEW.raw_user_meta_data->>'accent', 'pablo'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
