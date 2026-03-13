DROP POLICY IF EXISTS "Allow public access for inspections" ON inspections;
DROP POLICY IF EXISTS "Allow public access for inspection items" ON inspection_items;

CREATE POLICY "Allow public select for inspections" ON inspections FOR SELECT USING (true);
CREATE POLICY "Allow anon insert for inspections" ON inspections FOR INSERT WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');
CREATE POLICY "Allow anon update for inspections" ON inspections FOR UPDATE USING (auth.role() = 'anon' OR auth.role() = 'authenticated');
CREATE POLICY "Allow anon delete for inspections" ON inspections FOR DELETE USING (auth.role() = 'anon' OR auth.role() = 'authenticated');

CREATE POLICY "Allow public select for inspection items" ON inspection_items FOR SELECT USING (true);
CREATE POLICY "Allow anon insert for inspection items" ON inspection_items FOR INSERT WITH CHECK (auth.role() = 'anon' OR auth.role() = 'authenticated');
CREATE POLICY "Allow anon update for inspection items" ON inspection_items FOR UPDATE USING (auth.role() = 'anon' OR auth.role() = 'authenticated');
CREATE POLICY "Allow anon delete for inspection items" ON inspection_items FOR DELETE USING (auth.role() = 'anon' OR auth.role() = 'authenticated');