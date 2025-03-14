-- Create knowledge_items table
CREATE TABLE IF NOT EXISTS knowledge_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_tags table
CREATE TABLE IF NOT EXISTS knowledge_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  knowledge_id UUID NOT NULL REFERENCES knowledge_items(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_connections table for linking knowledge items
CREATE TABLE IF NOT EXISTS knowledge_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID NOT NULL REFERENCES knowledge_items(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES knowledge_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_id, target_id)
);

-- Enable RLS on knowledge tables
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for knowledge_items
CREATE POLICY "Users can view their own knowledge items" 
  ON knowledge_items FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own knowledge items" 
  ON knowledge_items FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own knowledge items" 
  ON knowledge_items FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own knowledge items" 
  ON knowledge_items FOR DELETE 
  USING (user_id = auth.uid());

-- Create policies for knowledge_tags
CREATE POLICY "Users can view tags for their knowledge items" 
  ON knowledge_tags FOR SELECT 
  USING ((SELECT user_id FROM knowledge_items WHERE id = knowledge_tags.knowledge_id) = auth.uid());

CREATE POLICY "Users can insert tags for their knowledge items" 
  ON knowledge_tags FOR INSERT 
  WITH CHECK ((SELECT user_id FROM knowledge_items WHERE id = knowledge_tags.knowledge_id) = auth.uid());

CREATE POLICY "Users can delete tags for their knowledge items" 
  ON knowledge_tags FOR DELETE 
  USING ((SELECT user_id FROM knowledge_items WHERE id = knowledge_tags.knowledge_id) = auth.uid());

-- Create policies for knowledge_connections
CREATE POLICY "Users can view connections for their knowledge items" 
  ON knowledge_connections FOR SELECT 
  USING ((SELECT user_id FROM knowledge_items WHERE id = knowledge_connections.source_id) = auth.uid());

CREATE POLICY "Users can insert connections for their knowledge items" 
  ON knowledge_connections FOR INSERT 
  WITH CHECK ((SELECT user_id FROM knowledge_items WHERE id = knowledge_connections.source_id) = auth.uid());

CREATE POLICY "Users can delete connections for their knowledge items" 
  ON knowledge_connections FOR DELETE 
  USING ((SELECT user_id FROM knowledge_items WHERE id = knowledge_connections.source_id) = auth.uid());

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE knowledge_items;
ALTER PUBLICATION supabase_realtime ADD TABLE knowledge_tags;
ALTER PUBLICATION supabase_realtime ADD TABLE knowledge_connections;
