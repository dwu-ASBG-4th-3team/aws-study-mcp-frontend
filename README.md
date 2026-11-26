# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
# 📚 AWS CLF 학습 Q&A 노트 · 프론트엔드

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=20232A)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

AWS Certified Cloud Practitioner(CLF) 학습자가 AI와 나눈 질문·답변을 다시 찾아보고, 이해도 피드백을 바탕으로 다음 복습 영역을 확인하는 웹 대시보드입니다. 원격 MCP로 저장된 학습 기록과 분석 결과를 Spring Boot 백엔드의 REST API에서 가져옵니다.

## 🖥️ 주요 화면

| 화면 | 제공 예정 기능 | 단계 |
| --- | --- | --- |
| 학습 기록 | 내 질문·답변, 출처, 검증 상태, 이해도 피드백 확인 | G1 |
| 유사 질문 검색 | 이전에 학습한 관련 Q&A 확인 | G1 |
| 학습 대시보드 | CLF 영역별 질문 수, 반복 질문, 이해도 피드백 및 복습 우선순위 확인 | G2 |

## 🛠️ 기술 스택

| 기술 | 역할 |
| --- | --- |
| React · TypeScript | 화면 구성과 API 응답 타입 정의 |
| Vite | 로컬 개발 서버 및 정적 파일 빌드 |
| Amazon S3 · CloudFront | 정적 웹 파일 배포 및 전달 |
| Amazon Cognito | 백엔드에서 사용자별 API 요청을 검증하는 데 사용하는 인증 서비스 |

## 📂 디렉터리 구조 예시

화면과 API 코드를 학습 기록·검색·대시보드 기능별로 모은 예시입니다. 각 기능은 `api/client.ts`를 통해 백엔드 REST API를 호출합니다.

```text
.
├── public/                       # 빌드 시 그대로 제공하는 정적 파일
├── src/
│   ├── assets/                   # 코드에서 가져오는 아이콘·이미지
│   ├── app/
│   │   └── App.tsx               # 앱 레이아웃과 화면 연결
│   ├── api/
│   │   └── client.ts             # 공통 HTTP 요청과 오류 처리
│   ├── components/
│   │   ├── Layout.tsx            # 헤더와 탐색 영역
│   │   └── RequestState.tsx      # 로딩·빈 결과·오류 표시
│   ├── features/
│   │   ├── auth/                 # 로그인 상태와 API 인증 연동
│   │   ├── records/
│   │   │   ├── RecordsPage.tsx    # 내 학습 기록 목록
│   │   │   ├── RecordCard.tsx     # 질문·답변·출처·피드백 표시
│   │   │   ├── recordsApi.ts      # 기록 조회 API
│   │   │   └── types.ts          # 학습 기록과 피드백 타입
│   │   ├── search/
│   │   │   ├── SearchPage.tsx     # 검색 입력과 유사 질문 결과
│   │   │   └── searchApi.ts       # 유사 질문 검색 API
│   │   └── dashboard/
│   │       ├── DashboardPage.tsx # 개인 학습 통계 화면
│   │       ├── DomainSummary.tsx  # CLF 영역별 집계와 복습 순위
│   │       └── analyticsApi.ts    # 개인 학습 통계 조회 API
│   ├── styles/
│   │   └── global.css            # 공통 스타일
│   └── main.tsx                  # React 앱 진입점
├── index.html                    # Vite HTML 진입점
├── package.json                  # 의존성과 실행 스크립트
├── tsconfig.json                 # TypeScript 설정
├── vite.config.ts                # Vite 빌드 및 개발 프록시 설정
└── README.md
```

## 🚀 로컬 실행 예시

Node.js와 npm이 설치된 환경에서 **프론트엔드 저장소 루트**를 열고 실행합니다.

```sh
npm install
npm run dev
```

Vite가 터미널에 출력한 주소를 브라우저에서 엽니다. API를 연동할 때는 별도 백엔드 저장소에서 Spring Boot 서버를 실행하고, 실제 Vite 프록시 또는 API 주소 설정을 확인합니다.

```sh
npm run build
```

### CloudFront 배포

기존 CloudFront 배포의 기본 동작은 S3 정적 파일을 제공하고, `/mcp`와 `/api/*`는 각각 VPC Origin으로 전달하도록 설정합니다.

1. CloudFront에서 `clfqa-dev-alb`를 VPC Origin으로 생성합니다. 리전은 서울(`ap-northeast-2`), ALB ARN은 `arn:aws:elasticloadbalancing:ap-northeast-2:202111353453:loadbalancer/app/clfqa-dev-alb/6fa1ea8fe10baf06`입니다. 오리진 연결은 `HTTP only`, 포트는 `80`을 사용합니다.
2. 기존 배포에 VPC Origin을 추가한 뒤 두 경로에 아래 설정을 적용합니다. 오리진 경로(Origin path)는 비워 둡니다.

| 항목 | 값 |
| --- | --- |
| 경로 패턴 | `/mcp`, `/api/*` |
| 허용 메서드 | GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE |
| 캐시 정책 | `CachingDisabled` |
| 오리진 요청 정책 | `AllViewerExceptHostHeader` |

3. VPC Origin 생성 후 서울 리전의 ALB VPC에서 `CloudFront-VPCOrigins-Service-SG`의 `sg-…` ID를 확인해 ALB 담당자에게 전달합니다. ALB 인바운드 변경은 담당자가 진행합니다.
4. ECS가 준비되면 CloudFront 주소의 `/api/health`로 연결을 확인합니다. 그전에는 백엔드 경로에서 `503`이 나올 수 있습니다.

설정 화면의 MCP 주소는 기본적으로 현재 사이트 주소에 `/mcp`를 붙여 표시합니다. 별도 MCP 주소가 필요한 로컬 환경에서는 `VITE_MCP_URL`을 지정할 수 있습니다.

## 👥 담당

| 팀원 | 담당 업무 |
| --- | --- |
| 안정현 | 대시보드, 기록·검색 화면, REST API 연동 및 S3·CloudFront 배포 |

> 디렉터리와 실행 명령은 Vite·npm 기준 예시입니다. Node.js 버전, 패키지 매니저, API 환경 변수 이름은 실제 저장소 설정에 맞춰 업데이트합니다.
