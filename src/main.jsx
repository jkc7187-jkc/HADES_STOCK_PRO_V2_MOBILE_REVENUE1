import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AlertTriangle, BarChart3, Bell, CheckCircle2, Crown, Database, KeyRound, Lock, LogOut, PlayCircle, RefreshCw, Rocket, ShieldCheck, Smartphone, TrendingUp, User, WalletCards, Zap, Settings, LineChart, Users, CreditCard } from 'lucide-react';
import './styles.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const DEMO = !API_BASE;
const order = {FREE:1, PRO:2, VIP:3};

async function api(path, options={}, token='') {
  if (DEMO) throw new Error('DEMO_MODE');
  const r = await fetch(`${API_BASE}${path}`, { ...options, headers:{'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{})} });
  const data = await r.json().catch(()=>({}));
  if (!r.ok) throw new Error(data.detail || 'API 오류');
  return data;
}

const stocks = [
 {code:'000660',name:'SK하이닉스',market:'KOSPI',score:96,tier:'FREE',style:'AI/HBM 대장',theme:'반도체',entry:'눌림목',target:'+8~15%',stop:'-5%',reason:'AI 메모리와 HBM 대표 모멘텀. V3 무료 공개 샘플 종목.'},
 {code:'267260',name:'HD현대일렉트릭',market:'KOSPI',score:94,tier:'FREE',style:'전력기기 성장',theme:'전력인프라',entry:'추세추종',target:'+7~13%',stop:'-5%',reason:'변압기·전력망 수요 장기 성장. 안정적 스윙 후보.'},
 {code:'042700',name:'한미반도체',market:'KOSPI',score:91,tier:'PRO',style:'공격 스윙',theme:'HBM 장비',entry:'돌파확인',target:'+10~18%',stop:'-6%',reason:'HBM 장비 고탄력 후보. 변동성 관리 필수.'},
 {code:'010120',name:'LS ELECTRIC',market:'KOSPI',score:89,tier:'PRO',style:'전력망 수혜',theme:'스마트그리드',entry:'분할매수',target:'+6~12%',stop:'-5%',reason:'전력망·자동화 성장 테마.'},
 {code:'034020',name:'두산에너빌리티',market:'KOSPI',score:86,tier:'VIP',style:'이벤트형',theme:'원전/발전',entry:'뉴스확인',target:'+12~20%',stop:'-7%',reason:'원전·발전 정책 뉴스와 수주 모멘텀에 민감.'},
 {code:'005380',name:'현대차',market:'KOSPI',score:84,tier:'VIP',style:'밸류 안정형',theme:'자동차',entry:'조정매수',target:'+5~10%',stop:'-4%',reason:'실적·주주환원 기반 방어형 포트폴리오 후보.'}
];

const plans = [
 {id:'FREE',price:'0원',title:'무료 유입',features:['오늘 공개 2종목','광고/오픈채팅 유입','면책 고지 자동 노출']},
 {id:'PRO',price:'29,000원/월',title:'핵심 수익 플랜',features:['TOP10 전체 열람','목표가·손절가','단타/스윙 분리']},
 {id:'VIP',price:'99,000원/월',title:'고단가 플랜',features:['VIP 집중 후보','알림/리포트','포트폴리오 전략']}
];

function Badge({children,tone=''} ){return <span className={`badge ${tone}`}>{children}</span>}
function setStore(k,v){localStorage.setItem(k,JSON.stringify(v))}
function getStore(k,d=null){try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}}

function Login({auth,setAuth}){
 const [email,setEmail]=useState('free@hades.pro'); const [pw,setPw]=useState('hades123');
 async function login(){
  try{ const data=await api('/api/auth/login',{method:'POST',body:JSON.stringify({email,password:pw})}); setAuth(data); setStore('hades_v3_auth',data); }
  catch{ const tier=email.includes('vip')?'VIP':email.includes('pro')?'PRO':'FREE'; const data={token:'demo-token',user:{email,tier,is_admin:email.includes('admin')}}; setAuth(data); setStore('hades_v3_auth',data); }
 }
 if(auth?.user) return <div className="panel"><div className="panel-title"><User/><span>고객 상태</span></div><p><b>{auth.user.email}</b></p><Badge tone="gold">{auth.user.tier}</Badge><button className="btn ghost" onClick={()=>{localStorage.removeItem('hades_v3_auth');setAuth(null)}}><LogOut size={16}/>로그아웃</button></div>
 return <div className="panel"><div className="panel-title"><KeyRound/><span>데모 로그인</span></div><input value={email} onChange={e=>setEmail(e.target.value)} /><input type="password" value={pw} onChange={e=>setPw(e.target.value)} /><button className="btn" onClick={login}>로그인</button><p className="hint">pro@hades.pro / vip@hades.pro / admin@hades.pro 로 등급 테스트</p></div>
}
function Revenue({auth,setAuth}){
 const [paid,setPaid]=useState(getStore('hades_v3_paid',0));
 function upgrade(id){ if(!auth?.user) return; const next={...auth,user:{...auth.user,tier:id}}; setAuth(next); setStore('hades_v3_auth',next); setPaid(paid+(id==='PRO'?29000:id==='VIP'?99000:0)); setStore('hades_v3_paid',paid+(id==='PRO'?29000:id==='VIP'?99000:0)); }
 return <div className="panel"><div className="panel-title"><CreditCard/><span>수익화 테스트</span></div><div className="money">₩{paid.toLocaleString()}</div><p className="hint">실결제 전환 전 데모 매출 카운터</p>{plans.map(p=><button className="price" key={p.id} onClick={()=>upgrade(p.id)} disabled={!auth}><b>{p.id}</b><span>{p.price}</span></button>)}</div>
}
function Stock({s,tier,i}){ const locked=order[tier]<order[s.tier]; return <div className={`stock ${locked?'locked':''}`}><div className="stock-top"><div><span className="rank">#{i+1} · {s.tier} · {s.style}</span><h3>{s.name}</h3><p>{s.code} · {s.market} · {s.theme}</p></div><div className="score">{locked?<Lock/>:s.score}</div></div><div className="grid3"><div><small>진입</small><b>{locked?'잠금':s.entry}</b></div><div><small>목표</small><b>{locked?'잠금':s.target}</b></div><div><small>손절</small><b>{locked?'잠금':s.stop}</b></div></div><p>{locked?`${s.tier} 회원 전용 분석입니다.`:s.reason}</p><Badge tone={locked?'':'blue'}>{locked?'유료 전환 필요':'열람 가능'}</Badge></div> }
function Admin({auth}){ if(!auth?.user?.is_admin) return null; return <section className="admin"><div className="panel"><div className="panel-title"><ShieldCheck/><span>관리자 센터</span></div><div className="admin-grid"><button className="btn"><PlayCircle/>오늘 스캔 실행</button><button className="btn ghost"><Users/>회원 관리</button><button className="btn ghost"><Bell/>알림 발송</button><button className="btn ghost"><Settings/>설정</button></div><p className="hint">실제 백엔드 연결 시 /api/admin/* 엔드포인트로 연결됩니다.</p></div></section> }

function App(){
 const [auth,setAuth]=useState(()=>getStore('hades_v3_auth',null)); const [items,setItems]=useState(stocks); const tier=auth?.user?.tier||'FREE';
 const visible=useMemo(()=>items.filter(x=>order[tier]>=order[x.tier]).length,[items,tier]);
 async function refresh(){ try{ const data=await api('/api/stocks/recommendations',{},auth?.token); setItems(data.items||stocks)}catch{setItems(stocks)} }
 useEffect(()=>{refresh()},[tier]);
 return <main><section className="hero"><div className="topbar"><div className="brand"><div className="logo">H</div><div><h1>HADES STOCK PRO V3</h1><p>실전 수익화 완성판 · 모바일 PWA · 결제/회원/API 준비</p></div></div><Badge tone="gold">{DEMO?'DEMO PROFIT READY':'API CONNECTED'}</Badge></div><div className="status"><Database size={16}/> API: {API_BASE||'미연결'} · 현재는 안전한 데모 데이터로 동작</div><div className="hero-grid"><div className="panel main"><div className="panel-title"><TrendingUp/><span>오늘의 황금주 대시보드</span></div><div className="big">{visible}</div><p>{tier} 등급에서 열람 가능한 추천종목 수</p><button className="btn" onClick={refresh}><RefreshCw/>새로고침</button></div><Login auth={auth} setAuth={setAuth}/><Revenue auth={auth} setAuth={setAuth}/><div className="panel"><div className="panel-title"><Rocket/><span>출시 상태</span></div><p>무료 유입 → PRO 전환 → VIP 업셀 구조가 포함되었습니다.</p><Badge tone="blue">Vercel 배포 가능</Badge></div></div></section><section className="kpis"><div><Zap/><b>TOP6</b><span>추천 후보</span></div><div><WalletCards/><b>3등급</b><span>FREE/PRO/VIP</span></div><div><Smartphone/><b>PWA</b><span>휴대폰 설치</span></div><div><LineChart/><b>API</b><span>실시간 연결부</span></div></section><section className="stocks">{items.map((s,i)=><Stock key={s.code} s={s} tier={tier} i={i}/>)}</section><section className="pricing">{plans.map(p=><div className="plan" key={p.id}><Crown/><h3>{p.id}</h3><p className="plan-price">{p.price}</p><b>{p.title}</b>{p.features.map(f=><p key={f}>✓ {f}</p>)}</div>)}</section><Admin auth={auth}/><section className="roadmap"><div className="panel-title"><CheckCircle2/><span>실전 운영 순서</span></div><ol><li>GitHub 업로드 후 Vercel 배포</li><li>무료 고객에게 링크 공개</li><li>카카오톡/오픈채팅으로 유입</li><li>PRO/VIP 결제 링크 연결</li><li>백엔드 API와 실시간 추천 데이터 연결</li></ol></section><section className="disclaimer"><AlertTriangle/><p>본 서비스는 투자 참고용 정보 제공 도구입니다. 매수·매도 권유, 투자자문, 수익 보장을 의미하지 않으며 모든 투자 판단과 책임은 이용자 본인에게 있습니다.</p></section><footer>© HADES STOCK PRO V3 · PROFIT READY</footer></main>
}

createRoot(document.getElementById('root')).render(<App/>);
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
