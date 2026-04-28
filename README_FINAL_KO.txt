HADES STOCK PRO FINAL MOBILE - 20260428

분석 결과
- Vite + React 프론트엔드 단독 구조입니다.
- Vercel 배포 필수 파일(package.json, vite.config.js, vercel.json)은 포함되어 있습니다.
- 기존 실행오류 핵심 원인은 백엔드 API 주소가 http://127.0.0.1:8000 로 되어 있어 Vercel/휴대폰에서 접속 불가한 점입니다.
- 백엔드 미배포 상태에서는 DEMO 모드/샘플 추천종목으로 동작합니다.

수정 내용
- PWA 모바일 앱 구조 추가: manifest.webmanifest, icon.svg, sw.js
- API 주소 미설정 시 DEMO 모드로 안전 동작
- HADES STOCK PRO 브랜드명 통일
- Vercel SPA 새로고침 NOT_FOUND 방지 설정 유지

Vercel 설정
- Framework Preset: Vite
- Build Command: npm run build
- Output Directory: dist
- Install Command: npm install
- Root Directory: 비워두기 또는 ./

환경변수
- 프론트만 배포: 환경변수 없어도 DEMO 모드 가능
- 실전 백엔드 연결: VITE_API_BASE_URL=https://배포한-백엔드주소

로컬 실행
1) Node.js 설치
2) run_frontend.bat 더블클릭
3) 또는 npm install 후 npm run dev

수익형 다음 단계
- 백엔드 API 배포
- 회원 DB/추천종목 DB/결제 DB 연결
- Toss Payments 또는 Stripe 결제 연동
- FREE/PRO/VIP 등급별 공개 범위 확정
- 매일 오전 7시 추천종목 자동 생성 배치 연결

투자 유의문구
본 앱은 투자 참고용 정보 제공 도구이며 매수·매도 권유 또는 수익 보장을 의미하지 않습니다.
