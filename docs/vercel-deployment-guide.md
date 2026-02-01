# Vercel + GitHub 배포 가이드

## 1. 사전 점검 체크리스트

### ✅ 빌드 테스트 결과
- **상태**: 성공 (2025-02-01 기준)
- **빌드 명령어**: `npm run build`
- **라우트**: `/`, `/new`, `/diary/[id]`, `/diary/[id]/edit`

### 1.1 환경 변수 (.env.local)
| 변수명 | 설명 | Vercel 설정 필수 |
|--------|------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ 예 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Supabase Publishable Key | ✅ 예 |

**주의**: `.env.local`은 `.gitignore`에 포함되어 GitHub에 올라가지 않습니다. Vercel 대시보드에서 별도 설정해야 합니다.

### 1.2 Supabase CORS 설정
Vercel 배포 도메인에서 Supabase API 호출이 가능하도록 Supabase 대시보드에서 확인하세요.

1. [Supabase 대시보드](https://supabase.com/dashboard) → 프로젝트 선택
2. **Settings** → **API** → **CORS**
3. Vercel 배포 URL 추가 (예: `https://your-project.vercel.app`)

### 1.3 Supabase Storage 정책
이미지 업로드가 배포 환경에서 동작하려면 Storage RLS 정책이 올바르게 설정되어 있어야 합니다. `docs/supabase-storage-policies.sql` 참고.

### 1.4 프로젝트 구조 확인
- `package.json`의 `build` 스크립트: `next build` ✅
- Node.js 버전: Vercel 기본값(18.x) 사용 가능

---

## 2. 배포 과정

### Step 1: GitHub 저장소 준비
1. 프로젝트를 GitHub에 푸시
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/cursor-diary.git
   git push -u origin main
   ```

2. `.gitignore` 확인: `.env*`, `node_modules`, `.next` 등이 제외되어 있는지 확인

### Step 2: Vercel 프로젝트 생성
1. [vercel.com](https://vercel.com) 로그인
2. **Add New** → **Project**
3. **Import Git Repository**에서 GitHub 저장소 선택
4. **Import** 클릭

### Step 3: 환경 변수 설정
1. 프로젝트 설정 화면에서 **Environment Variables** 섹션으로 이동
2. 다음 변수 추가:

   | Name | Value | Environment |
   |------|-------|--------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | `sb_publishable_xxx` | Production, Preview, Development |

3. **Save** 클릭

### Step 4: 배포 실행
1. **Deploy** 버튼 클릭
2. 빌드 및 배포 완료 대기 (약 1~2분)

### Step 5: 지속적 배포 (CI/CD)
- `main` 브랜치에 푸시할 때마다 **Production** 자동 배포
- 다른 브랜치 푸시 시 **Preview** 배포 (별도 URL 생성)

---

## 3. 배포 후 확인 사항

1. **홈페이지**: `/` 접속 시 일기 목록 표시
2. **새 일기 작성**: `/new`에서 작성 및 저장
3. **이미지 업로드**: 에디터 내 드래그앤드롭/붙여넣기 동작 확인
4. **Supabase 연결**: 일기 CRUD, Storage 업로드 정상 동작 확인

---

## 4. 트러블슈팅

### 빌드 실패 시
- Vercel 빌드 로그에서 에러 메시지 확인
- 로컬에서 `npm run build` 재실행하여 동일 에러 재현
- 환경 변수 누락 여부 확인

### 런타임 에러 (CORS, 403 등)
- Supabase CORS에 Vercel URL 추가
- Supabase RLS/Storage 정책 재확인

### 환경 변수 미적용
- Vercel에서 변수 저장 후 **Redeploy** 필요
- `NEXT_PUBLIC_` 접두사 변수는 빌드 시점에 주입됨
