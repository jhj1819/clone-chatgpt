# AI 채팅 애플리케이션

## 프로젝트 목표
Chat GPT와 유사한 채팅 AI Application을 구현하여 사용자와 AI 간의 자연스러운 대화를 가능하게 하는 웹 애플리케이션 개발

## 기술 스택
### 프론트엔드
- Next.js 14 (App Router)
- TypeScript
- UI 라이브러리
    - TailwindCSS : https://tailwindcss.com/  
    - shadcn/ui : https://ui.shadcn.com/
        - 다크모드 지원
        - 반응형 디자인
        - 접근성 고려

### AI/백엔드
- AI SDK : https://sdk.vercel.ai/docs/introduction
    - OpenAI API 연동
    - 스트리밍 응답 처리
    - 대화 기록 관리

## 주요 기능
1. 채팅 인터페이스
   - 메시지 입력 및 전송
   - 대화 내역 표시
   - 로딩 상태 표시
   - 에러 처리

2. AI 응답
   - 실시간 스트리밍 응답
   - 마크다운 형식 지원
   - 코드 하이라이팅

3. 사용자 경험
   - 다크/라이트 모드 전환
   - 반응형 레이아웃
   - 모바일 최적화

## 구현 단계
1. 프로젝트 초기 설정
   - Next.js 프로젝트 생성
     ```bash
     npx create-next-app@latest --typescript --tailwind --app
     ```
   - TypeScript 설정
     - `tsconfig.json` 설정
     - 타입 정의 파일 생성
   - TailwindCSS 및 shadcn/ui 설치
     ```bash
     npm install @radix-ui/react-icons
     npx shadcn-ui@latest init
     ```
   - 환경 변수 설정
     - `.env.local` 파일 생성
     - OpenAI API 키 설정

2. 백엔드 API 구현
   - AI SDK 설정
     ```typescript
     // app/api/chat/route.ts
     import { OpenAIStream, StreamingTextResponse } from 'ai'
     import OpenAI from 'openai'
     ```
   - 채팅 API 엔드포인트 구현
     - POST /api/chat 엔드포인트 생성
     - 요청/응답 타입 정의
     - 메시지 히스토리 관리
   - 스트리밍 응답 처리
     - OpenAIStream 설정
     - StreamingTextResponse 구현
   - 에러 핸들링
     - API 에러 처리
     - 사용자 친화적 에러 메시지

3. 프론트엔드 구현
   - 레이아웃 구성
     - `app/layout.tsx` 설정
     - 메타데이터 설정
     - 전역 스타일 적용
   - 채팅 인터페이스 컴포넌트
     - 메시지 목록 컴포넌트
     - 메시지 버블 디자인
     - 스크롤 자동 이동
   - 메시지 입력 폼
     - 텍스트 입력 필드
     - 전송 버튼
     - 엔터키 전송 지원
   - 대화 내역 표시
     - 메시지 타입 구분 (사용자/AI)
     - 타임스탬프 표시
     - 메시지 상태 표시
   - 다크모드 구현
     - 테마 컨텍스트 설정
     - 테마 전환 버튼
     - 시스템 테마 감지

4. API 연동
   - 프론트엔드-백엔드 통신
     ```typescript
     // app/hooks/useChat.ts
     import { useChat } from 'ai/react'
     ```
   - 상태 관리
     - 메시지 상태 관리
     - 로딩 상태 관리
     - 에러 상태 관리
   - 에러 처리
     - 네트워크 에러 처리
     - API 에러 처리
     - 사용자 피드백

5. 배포
   - Vercel 배포
     - GitHub 연동
     - 자동 배포 설정
     - 환경 변수 설정
   - 성능 최적화
     - 이미지 최적화
     - 코드 스플리팅
     - 캐싱 전략

## 개발 환경 설정
```bash
# 프로젝트 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 환경 변수
```env
OPENAI_API_KEY=your_api_key_here
```

## 라이선스
MIT

