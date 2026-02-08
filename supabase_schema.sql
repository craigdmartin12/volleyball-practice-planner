-- Create custom types
DO $$ BEGIN
    CREATE TYPE drill_difficulty AS ENUM ('Beginner', 'Intermediate', 'Advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drills table
CREATE TABLE IF NOT EXISTS drills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 5,
    difficulty drill_difficulty NOT NULL DEFAULT 'Intermediate',
    tags TEXT[] DEFAULT '{}',
    diagram_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practices table
CREATE TABLE IF NOT EXISTS practices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    practice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice Items (Join table for drills in practices)
CREATE TABLE IF NOT EXISTS practice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
    drill_id UUID REFERENCES drills(id) ON DELETE CASCADE NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
    CREATE POLICY "Users can only access their own drills" ON drills
        FOR ALL USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can only access their own practices" ON practices
        FOR ALL USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can only access items of their own practices" ON practice_items
        FOR ALL USING (
            EXISTS (
                SELECT 1 FROM practices 
                WHERE practices.id = practice_items.practice_id 
                AND practices.user_id = auth.uid()
            )
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
