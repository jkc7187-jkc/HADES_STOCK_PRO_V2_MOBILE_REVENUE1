import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Lock, TrendingUp, User, CreditCard, Server, LogOut, KeyRound, RefreshCw, Smartphone, Crown, AlertTriangle, ShieldCheck, PlayCircle, Database } from 'lucide-react';
import './styles.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const IS_DEMO_MODE = !API_BASE;

function api(path, options={}, token='') {
  if (IS_DEMO_MODE) return Promise.reject(new Error('데모 모드: 백엔드 주소가 설정되지 않았습니다.'))
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {'Content-Type':'application/json', ...(token ? {Authorization:`Bearer ${token}`} : {}), ...(options.headers || {})}
  }).then(async r => {
    const data = await r.json().catch(()=>({}));
    if (!r.ok) throw new Error(data.detail || 'API 연결 오류');
    return data;
  });
}

const fallbackStocks = [
  { code:'005930', name:'삼성전자', market:'KOSPI', score:91, price:'78,400', change:'+1.8%', reason:'무료 공개 샘플 · 실제 추천은 로그인 후 확인', minTier:'FREE', locked:false },
  { code:'000660', name:'SK하이닉스', market:'KOSPI', score:88, price:'184,200', change:'+2.1%', reason:'무료 공개 샘플 · 실제 추천은 로그인 후 확인', minTier:'FREE', locked:false },
  { code:'042700', name:'한미반도체', market:'KOSPI', score:null, price:'잠금', change:'VIP', reason:'VIP 회원 전용 분석입니다.', minTier:'VIP', locked:true },
];

function Badge({children, tone='default'}) { return <span className={`badge ${tone}`}>{children}</span> }

function Landing({onStart}) {
  return <section className="landing">
    <div className="hero-text">
      <Badge tone="gold">CUSTOMER ACCESS READY</Badge>
      <h1>HADES STOCK PRO</h1>
      <p>한국주식 실전 추천, 등급별 잠금, 관리자 스캔 구조를 갖춘 고객 접속용 배포판입니다.</p>
      <button className="full-btn" onClick={onStart}><Smartphone size={18}/> 고객 화면 시작</button>
    </div>
    <div className="phone-card">
      <div className="phone-top"></div>
      <h3>오늘의 추천 TOP</h3>
      <div className="mini-stock">삼성전자 <strong>91</strong></div>
      <div className="mini-stock">SK하이닉스 <strong>88</strong></div>
      <div className="mini-stock locked">VIP 종목 <Lock size={14}/></div>
    </div>
  </section>
}

function LoginBox({auth, setAuth, setError}) {
  const [email, setEmail] = useState('free@hades.pro');
  const [password, setPassword] = useState('hades123');

  async function login() {
    try {
      const data = await api('/api/auth/login', {method:'POST', body:JSON.stringify({email, password})});
      setAuth(data);
      localStorage.setItem('hades_customer_auth', JSON.stringify(data));
      setError('');
    } catch(e) {
      setError(e.message + ' / 백엔드 서버 주소를 확인하세요.');
    }
  }

  if (auth?.user) return <div className="panel">
    <div className="panel-title"><User/><span>로그인 상태</span></div>
    <p><strong>{auth.user.email}</strong></p>
    <Badge tone={auth.user.tier === 'VIP' || auth.user.tier === 'ADMIN' ? 'gold' : 'blue'}>{auth.user.tier}</Badge>
    <button className="full-btn ghost" onClick={() => {localStorage.removeItem('hades_customer_auth'); setAuth(null);}}><LogOut size={16}/> 로그아웃</button>
  </div>

  return <div className="panel">
    <div className="panel-title"><KeyRound/><span>고객 로그인</span></div>
    <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="이메일"/>
    <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="비밀번호"/>
    <button className="full-btn" onClick={login}>로그인</button>
    <p className="hint">백엔드 배포 전에는 데모 화면만 표시될 수 있습니다.</p>
  </div>
}

function BillingBox({auth, setAuth, setError}) {
  async function upgrade(tier) {
    if (!auth?.user) return;
    try {
      const data = await api('/api/billing/mock-upgrade', {method:'POST', body:JSON.stringify({email:auth.user.email, tier})}, auth.token);
      const refreshed = {...auth, user:{...auth.user, tier:data.tier}};
      setAuth(refreshed);
      localStorage.setItem('hades_customer_auth', JSON.stringify(refreshed));
      setError('');
    } catch(e) { setError(e.message); }
  }
  return <div className="panel">
    <div className="panel-title"><CreditCard/><span>회원 등급</span></div>
    {['FREE','PRO','VIP'].map(t => <button key={t} onClick={()=>upgrade(t)} disabled={!auth || auth.user.tier === 'ADMIN'} className={auth?.user?.tier===t?'price active':'price'}>
      <strong>{t}</strong><span>{t==='FREE'?'0':t==='PRO'?'29,000':'99,000'}원/월</span>
    </button>)}
  </div>
}

function StockCard({s, idx}) {
  return <div className={`stock-card ${s.locked ? 'locked' : ''}`}>
    <div className="stock-head">
      <div><div className="rank">#{idx+1} · {s.minTier}</div><h3>{s.name}</h3><p>{s.code} · {s.market}</p></div>
      <div className="score">{s.locked ? <Lock size={18}/> : s.score}</div>
    </div>
    <div className="stock-grid">
      <div><span>현재가</span><strong>{s.price}</strong></div>
      <div><span>등락</span><strong>{s.change}</strong></div>
      <div><span>권한</span><strong>{s.minTier}</strong></div>
    </div>
    <p className="reason">{s.reason}</p>
  </div>
}

function AdminPanel({auth, setError, onScanDone}) {
  const [scanning, setScanning] = useState(false);
  async function runScan() {
    try {
      setScanning(true);
      const res = await api('/api/scheduler/run-scan', {method:'POST', body:JSON.stringify({limit_kospi:120, limit_kosdaq:80, max_results:30, use_dart:true})}, auth.token);
      await onScanDone();
      alert(`스캔 완료: ${res.count}개 저장`);
    } catch(e) { setError(e.message); }
    finally { setScanning(false); }
  }
  if (!auth?.user?.is_admin) return null;
  return <section className="admin"><div className="panel">
    <div className="panel-title"><ShieldCheck/><span>관리자 운영</span></div>
    <button className="full-btn scan" onClick={runScan} disabled={scanning}><PlayCircle size={16}/> {scanning ? '스캔 실행 중...' : '실전 스캔 실행'}</button>
  </div></section>
}

function App() {
  const [started, setStarted] = useState(false);
  const [auth, setAuth] = useState(() => { try { return JSON.parse(localStorage.getItem('hades_customer_auth') || 'null'); } catch { return null; } });
  const [stocks, setStocks] = useState(fallbackStocks);
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('확인 전');

  async function checkApi() {
    try { const data = await api('/'); setApiStatus(`${data.app} ${data.version} 연결됨`); }
    catch { setApiStatus('백엔드 미연결 / 데모 표시 중'); }
  }
  async function loadStocks() {
    if (!auth?.token) { setStocks(fallbackStocks); return; }
    try { const data = await api('/api/stocks/recommendations', {}, auth.token); setStocks(data.items); setError(''); }
    catch(e) { setError(e.message); setStocks(fallbackStocks); }
  }
  useEffect(()=>{checkApi();},[]);
  useEffect(()=>{loadStocks();},[auth?.token, auth?.user?.tier]);

  return <main>
    {!started && <Landing onStart={()=>setStarted(true)}/>}
    {started && <>
      <section className="hero">
        <div className="topbar">
          <div className="brand"><div className="logo">H</div><div><h1>HADES STOCK PRO</h1><p>고객 접속용 배포판 · 모바일 최적화 · Vercel Ready</p></div></div>
          <Badge tone="gold">CUSTOMER DEPLOY</Badge>
        </div>
        <div className="status"><Server size={16}/> API: {API_BASE || 'DEMO'} · {apiStatus}</div>
        {error && <div className="error"><AlertTriangle size={16}/>{error}</div>}
        <div className="hero-grid">
          <div className="panel main-panel">
            <div className="panel-title"><TrendingUp/><span>고객 추천 화면</span></div>
            <div className="big-score">{auth?.user?.tier || 'DEMO'}</div>
            <p>FREE/PRO/VIP 등급별로 추천종목 공개 범위가 달라집니다.</p>
            <button className="full-btn" onClick={loadStocks}><RefreshCw size={16}/> 추천종목 새로고침</button>
          </div>
          <LoginBox auth={auth} setAuth={setAuth} setError={setError}/>
          <BillingBox auth={auth} setAuth={setAuth} setError={setError}/>
          <div className="panel"><div className="panel-title"><Database/><span>운영 상태</span></div><p>프론트: Vercel 배포 가능</p><p>백엔드: 외부 서버 연결 필요</p></div>
        </div>
      </section>
      <section className="stocks">{stocks.map((s,i)=><StockCard s={s} idx={i} key={`${s.code}-${i}`}/>)}</section>
      <AdminPanel auth={auth} setError={setError} onScanDone={loadStocks}/>
      <section className="disclaimer"><Crown size={18}/><p>본 서비스는 투자 참고용 정보 제공 도구이며, 매수·매도 권유 또는 수익 보장을 의미하지 않습니다. 모든 투자 판단과 책임은 이용자 본인에게 있습니다.</p></section>
    </>}
    <footer>© HADES STOCK PRO</footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App/>);

if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {})); }
