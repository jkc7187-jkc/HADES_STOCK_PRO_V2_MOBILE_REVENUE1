HADES STOCK PRO V3 실전 돈버는 완성판 사용방법
생성일: 2026-04-28

1. 목적
- 한국주식 추천 모바일 웹앱/PWA 배포판
- FREE / PRO / VIP 회원 등급 구조 포함
- 결제 연결 전 데모 매출 카운터 포함
- 실제 백엔드 API 연결 준비 완료
- Vercel 배포 가능 구조

2. 바로 실행
Windows 기준:
1) 압축 해제
2) 폴더 안에서 명령 프롬프트 실행
3) npm install
4) npm run dev
5) 브라우저에서 http://localhost:5173 접속

3. 데모 계정
- free@hades.pro : FREE 등급
- pro@hades.pro : PRO 등급
- vip@hades.pro : VIP 등급
- admin@hades.pro : 관리자 화면 테스트
비밀번호는 아무 값이나 가능하지만 기본 예시는 hades123 입니다.

4. Vercel 배포
1) GitHub 새 저장소 생성
2) 압축 해제된 파일 전체 업로드
3) Vercel → Add New → Project
4) GitHub 저장소 선택
5) Framework: Vite
6) Build Command: npm run build
7) Output Directory: dist
8) Deploy

5. 실서비스 전환 순서
1) 먼저 Vercel에 프론트 배포
2) 카카오톡/오픈채팅/SNS로 무료 사용자 유입
3) PRO/VIP 결제 링크 준비
4) 백엔드 API 서버 연결
5) 실제 한국주식 데이터/추천 로직 연결
6) 면책 고지와 이용약관을 정식 적용

6. 백엔드 연결 위치
.env 파일 또는 Vercel Environment Variables에 입력:
VITE_API_BASE_URL=https://배포한-백엔드주소

필요 API 예시:
POST /api/auth/login
GET /api/stocks/recommendations
POST /api/admin/run-scan
GET /api/admin/users
POST /api/alerts/send

7. 주의
이 파일은 투자 참고용 서비스 UI/운영 구조입니다.
실제 매수·매도 권유, 투자자문, 수익 보장 표현은 피해야 합니다.
