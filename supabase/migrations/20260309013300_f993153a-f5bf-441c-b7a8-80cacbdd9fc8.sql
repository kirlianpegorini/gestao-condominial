CREATE TYPE inspection_status AS ENUM ('in_progress', 'completed');
CREATE TYPE item_status AS ENUM ('pending', 'ok', 'problem');

CREATE TABLE inspections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    condo_name TEXT NOT NULL,
    inspector_name TEXT NOT NULL,
    date DATE NOT NULL,
    status inspection_status NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE inspection_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    location TEXT NOT NULL,
    item_name TEXT NOT NULL,
    status item_status NOT NULL DEFAULT 'pending',
    problem_description TEXT,
    photo_path TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access for inspections" ON inspections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public access for inspection items" ON inspection_items FOR ALL USING (true) WITH CHECK (true);

INSERT INTO storage.buckets (id, name, public) VALUES ('inspection-photos', 'inspection-photos', true);

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'inspection-photos');
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'inspection-photos');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'inspection-photos');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'inspection-photos');