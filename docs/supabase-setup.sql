-- ============================================
-- 데이브러리(Daybrary) Supabase 초기 설정 SQL
-- Supabase SQL Editor에서 실행
-- ============================================

-- --------------------------------------------
-- 1. diary 테이블 생성
-- --------------------------------------------
CREATE TABLE IF NOT EXISTS public.diary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}',
  emotion TEXT,
  weather TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  diary_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- created_at, updated_at, diary_date 인덱스 (조회 최적화)
CREATE INDEX IF NOT EXISTS idx_diary_created_at ON public.diary (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diary_diary_date ON public.diary (diary_date DESC);
CREATE INDEX IF NOT EXISTS idx_diary_updated_at ON public.diary (updated_at DESC);

-- 제목 검색용 인덱스 (ILIKE 패턴 검색 지원)
CREATE INDEX IF NOT EXISTS idx_diary_title ON public.diary (lower(title));

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_diary_updated_at ON public.diary;
CREATE TRIGGER trigger_diary_updated_at
  BEFORE UPDATE ON public.diary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- --------------------------------------------
-- 2. RLS(Row Level Security) 설정
-- --------------------------------------------
ALTER TABLE public.diary ENABLE ROW LEVEL SECURITY;

-- 개인용 프로젝트: 모든 사용자에게 읽기/쓰기 허용
DROP POLICY IF EXISTS "Allow all read access on diary" ON public.diary;
DROP POLICY IF EXISTS "Allow all insert access on diary" ON public.diary;
DROP POLICY IF EXISTS "Allow all update access on diary" ON public.diary;
DROP POLICY IF EXISTS "Allow all delete access on diary" ON public.diary;

CREATE POLICY "Allow all read access on diary"
  ON public.diary FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert access on diary"
  ON public.diary FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update access on diary"
  ON public.diary FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all delete access on diary"
  ON public.diary FOR DELETE
  USING (true);

-- --------------------------------------------
-- 3. Storage 버킷 생성 (이미지 저장)
-- --------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'diary-images',
  'diary-images',
  true,
  5242880,  -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- --------------------------------------------
-- 4. Storage RLS 정책
-- --------------------------------------------
DROP POLICY IF EXISTS "Allow public read access on diary-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert access on diary-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update access on diary-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete access on diary-images" ON storage.objects;

-- 읽기: 모든 사용자 허용
CREATE POLICY "Allow public read access on diary-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'diary-images');

-- 쓰기: 모든 사용자 허용
CREATE POLICY "Allow public insert access on diary-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'diary-images');

-- 수정: 모든 사용자 허용
CREATE POLICY "Allow public update access on diary-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'diary-images')
  WITH CHECK (bucket_id = 'diary-images');

-- 삭제: 모든 사용자 허용
CREATE POLICY "Allow public delete access on diary-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'diary-images');
