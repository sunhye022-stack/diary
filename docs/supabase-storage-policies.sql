-- ============================================
-- Supabase Storage 버킷 접근 권한 설정
-- 'diary-images'를 실제 버킷 이름으로 변경 후 실행
-- ============================================

-- 기존 정책 제거 (재실행 시)
DROP POLICY IF EXISTS "Allow public read on diary-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload on diary-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on diary-images" ON storage.objects;

-- 읽기: 누구나 읽을 수 있음
CREATE POLICY "Allow public read on diary-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'diary-images');

-- 업로드: 누구나 업로드할 수 있음
CREATE POLICY "Allow public upload on diary-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'diary-images');

-- 삭제: 누구나 삭제할 수 있음
CREATE POLICY "Allow public delete on diary-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'diary-images');
