HADES STOCK PRO V13 - Vercel NOT_FOUND 수정 완료판

이 ZIP은 Vercel에 바로 올리기 쉽도록 frontend 폴더 내부 파일을 루트로 재구성한 버전입니다.

Vercel 설정값:
- Framework Preset: Vite
- Build Command: npm run build
- Output Directory: dist
- Root Directory: 비워두기 또는 ./
- Install Command: npm install

수정 내용:
1. vercel.json 포함
   모든 경로를 index.html로 보내 React/Vite SPA 새로고침 NOT_FOUND 오류를 방지합니다.
2. vite.config.js 추가
   Vite React 빌드 구성을 명확히 했습니다.
3. package.json 배포 스크립트 정리
   npm run build 명령으로 dist 폴더가 생성되도록 유지했습니다.
4. frontend 내부 파일을 ZIP 루트로 이동
   Vercel 업로드 시 Root Directory 설정 실수를 줄였습니다.

중요:
- 백엔드가 아직 외부 배포되지 않았으면 화면은 데모/샘플 데이터로 보일 수 있습니다.
- 실제 API 연결은 Vercel 환경변수 VITE_API_BASE_URL에 Render/Railway 등에 배포한 백엔드 주소를 입력해야 합니다.
