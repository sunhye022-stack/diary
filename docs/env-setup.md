# 환경 변수 설정

Supabase를 사용하려면 `.env.local` 파일에 다음 환경 변수를 설정해야 합니다.

## 1. .env.local 파일 생성

**프로젝트 루트** (package.json과 같은 폴더)에 `.env.local` 파일을 만들고 아래 내용을 추가하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=https://프로젝트ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_실제키값
```

또는 Supabase 새 형식 (Publishable key):

```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_실제키값
```

**주의사항:**
- 변수명은 정확히 `NEXT_PUBLIC_SUPABASE_ANON_KEY` (대소문자 구분)
- `=` 앞뒤에 공백 없이 작성
- **한 줄에** 작성 (줄바꿈 없이)
- 값에 특수문자가 있으면 따옴표로 감싸기: `NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_xxx"`

## 2. Supabase 값 확인 방법

1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings** → **API** 메뉴 이동
4. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`에 입력
5. **Project API keys** → **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`에 입력

## 3. 적용

환경 변수 변경 후 개발 서버를 **재시작**하세요.

```bash
# Ctrl+C로 서버 종료 후
npm run dev
```
