import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowDownRight, ArrowRight, BarChart3, Boxes, BrainCircuit, Check,
  ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Clock3, Code2, Command,
  Copy, Cpu, DatabaseZap, Download, Expand, Eye, Focus, Gauge, GitBranch,
  Grid2X2, Layers3, Maximize2, Menu, Minus, Network, Pause, Play, Plus,
  Radio, RefreshCcw, RotateCcw, Search, Settings2, Share2, ShieldCheck,
  SlidersHorizontal, Sparkles, Square, TerminalSquare, WandSparkles, Waves,
  X, Zap
} from 'lucide-react';
import './styles.css';
import './technical.css';

const PRESETS = {
  Nano: { layers: 6, hidden: 256, heads: 4, context: 1024, vocab: 32000 },
  Base: { layers: 12, hidden: 768, heads: 12, context: 4096, vocab: 50000 },
  Pro: { layers: 24, hidden: 1024, heads: 16, context: 8192, vocab: 64000 },
};
const TENSORS = ['Wq', 'Wk', 'Wv', 'Wo', 'FFN ↑', 'FFN ↓', 'Embedding'];
const NAV = [
  { id: 'overview', label: 'Genel Bakış', icon: Grid2X2 },
  { id: 'transformer', label: 'Transformer Studio', icon: Cpu },
  { id: 'model-lab', label: 'Model Lab', icon: BarChart3 },
  { id: 'architecture', label: 'Mimari Haritası', icon: Network },
  { id: 'weights', label: 'Ağırlık Uzayı', icon: Layers3 },
  { id: 'attention', label: 'Attention', icon: Focus },
  { id: 'training', label: 'Eğitim Simülatörü', icon: Activity },
  { id: 'inference', label: 'Inference Lab', icon: TerminalSquare },
];
const initialText = '[BOS] model layer attention matrix output [EOS]';
const fmt = n => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);
const seedRand = n => { const v = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return v - Math.floor(v); };
const bound = (n, a, b) => Math.max(a, Math.min(b, n));
const signed = n => (n >= 0 ? '+' : '') + n.toFixed(4);
const paramCount = c => (12 * c.layers * c.hidden * c.hidden + c.vocab * c.hidden + 4 * c.layers * c.hidden);
const formatParams = n => n >= 1e9 ? (n / 1e9).toFixed(2) + 'B' : (n / 1e6).toFixed(1) + 'M';
const PRECISION_BYTES = { FP32: 4, FP16: 2, INT8: 1, INT4: .5 };
const sizeMB = (n, precision = 'FP16') => (n * PRECISION_BYTES[precision] / 1e9).toFixed(2) + ' GB';
const quantizeWeight = (value, precision) => {
  if (precision === 'FP32') return value;
  if (precision === 'FP16') return Math.round(value * 2048) / 2048;
  const max = precision === 'INT8' ? 127 : 7;
  return Math.round(value * max) / max;
};
const makeWeight = (i, j, layer, tensor, step) => {
  const basis = seedRand(i * 31 + j * 79 + layer * 137 + tensor * 191) * 2 - 1;
  const update = Math.sin(step * .043 + i * .7 - j * .38 + tensor) * Math.min(.28, step * .00048);
  return bound(basis * .64 + update, -1, 1);
};
const effectiveStep = (step, batch = 32, optimizer = 'AdamW') => step * ({AdamW:1,SGD:.68,RMSprop:.88,Adagrad:.78}[optimizer] ?? 1) * Math.pow(32 / batch, .16);
const lossAt = (step, lr, batch = 32, optimizer = 'AdamW') => { const s = effectiveStep(step,batch,optimizer); return Math.max(.48, 3.88 * Math.exp(-s * (.00205 + lr * 8)) + .55 + .07 * Math.sin(s * .085) * Math.exp(-s * .002)); };
const accAt = (step, batch = 32, optimizer = 'AdamW') => { const s = effectiveStep(step,batch,optimizer); return Math.min(97.4, 18 + 77 * (1 - Math.exp(-s * .00315)) + .75 * Math.sin(s * .05)); };

function IconBadge({ children, tone = 'lime' }) { return <span className={'icon-badge ' + tone}>{children}</span>; }
function SectionHeading({ eyebrow, title, sub, action }) {
  return <div className="section-heading"><div><span className="section-eyebrow">{eyebrow}</span><h2>{title}</h2>{sub && <p>{sub}</p>}</div>{action}</div>;
}
function LabeledRange({ label, value, min, max, step = 1, onChange, display, small = false }) {
  return <label className={'range-field ' + (small ? 'small' : '')}><span><span>{label}</span><b>{display ?? value}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} /><span className="range-ends"><small>{min}</small><small>{max}</small></span></label>;
}
function MiniSpark({ values, color = '#80AAE4', fill = false }) {
  const w = 126, h = 38, min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const points = values.map((v, i) => `${i / (values.length - 1) * w},${h - 3 - (v - min) / span * (h - 9)}`).join(' ');
  return <svg viewBox={`0 0 ${w} ${h}`} className="mini-spark" preserveAspectRatio="none">{fill && <polygon points={`0,${h} ${points} ${w},${h}`} fill={color} opacity=".08" />}<polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>;
}
function NetworkGraph({ layer, tensor, step, active, onSelect }) {
  const columns = [7, 9, 9, 9, 7]; const width = 710, height = 270;
  const points = columns.map((count, c) => Array.from({ length: count }, (_, i) => ({ x: 49 + c * 153, y: 27 + (i + .5) * (216 / count) })));
  const edges = [];
  for (let c = 0; c < points.length - 1; c++) {
    points[c].forEach((a, i) => points[c + 1].forEach((b, j) => {
      const val = makeWeight(i, j, layer + c, tensor, step);
      if ((i + j + c) % 3 !== 0) edges.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, val, key: `${c}-${i}-${j}` });
    }));
  }
  return <div className="network-graphic"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Etkileşimli sinir ağı bağlantı grafiği">
    <defs><linearGradient id="linkGradient"><stop stopColor="#80AAE4" /><stop offset="1" stopColor="#8AB8D8" /></linearGradient></defs>
    {edges.map(e => <line key={e.key} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={e.val > 0 ? '#80AAE4' : '#D6B38C'} strokeOpacity={active ? .09 + Math.abs(e.val) * .26 : .07 + Math.abs(e.val) * .2} strokeWidth={Math.abs(e.val) > .4 ? 1 : .6} className={active ? 'network-edge animated' : 'network-edge'} />)}
    {points.map((col, ci) => col.map((p, i) => <g key={`${ci}-${i}`} onClick={() => onSelect({ column: ci, neuron: i })} className="neuron-node"><circle cx={p.x} cy={p.y} r={ci === 0 || ci === 4 ? 4 : 4.6} fill="#111B28" stroke={ci === 0 ? '#80AAE4' : ci === 4 ? '#D6B38C' : '#617C96'} strokeWidth="1.3" /><circle cx={p.x} cy={p.y} r="1.5" fill={ci === 0 ? '#8AB8D8' : ci === 4 ? '#D6B38C' : '#94A4B8'} opacity=".8" /></g>))}
  </svg><div className="network-labels"><span>INPUT</span><span>EMBEDDING</span><span>TRANSFORMER</span><span>PROJECTION</span><span>OUTPUT</span></div></div>;
}
function ChartPanel({ step, lr, batch, optimizer, history }) {
  const w = 600, h = 178, p = { left: 31, top: 11, right: 8, bottom: 22 };
  const data = history.length > 1 ? history : Array.from({ length: 70 }, (_, i) => ({ step: i * 9, loss: lossAt(i * 9, lr, batch, optimizer), acc: accAt(i * 9, batch, optimizer) }));
  const cap = Math.max(660, data[data.length - 1].step);
  const x = s => p.left + s / cap * (w - p.left - p.right);
  const yl = v => p.top + (4.2 - v) / 4.2 * (h - p.top - p.bottom);
  const ya = v => p.top + (100 - v) / 100 * (h - p.top - p.bottom);
  const lossLine = data.map((d, i) => `${i ? 'L' : 'M'}${x(d.step).toFixed(1)},${yl(d.loss).toFixed(1)}`).join(' ');
  const accLine = data.map((d, i) => `${i ? 'L' : 'M'}${x(d.step).toFixed(1)},${ya(d.acc).toFixed(1)}`).join(' ');
  return <div className="chart-wrap"><svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
    <defs><linearGradient id="lossFill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#80AAE4" stopOpacity=".16"/><stop offset="1" stopColor="#80AAE4" stopOpacity="0"/></linearGradient></defs>
    {[0,1,2,3,4].map(i => <g key={i}><line x1={p.left} x2={w-p.right} y1={p.top+i*(h-p.top-p.bottom)/4} y2={p.top+i*(h-p.top-p.bottom)/4} stroke="#25303e" strokeDasharray="3 5" /><text x="1" y={p.top+i*(h-p.top-p.bottom)/4+4} fill="#596879" fontSize="10">{(4-i).toFixed(0)}.0</text></g>)}
    <path d={`${lossLine} L${x(data[data.length-1].step)},${h-p.bottom} L${p.left},${h-p.bottom} Z`} fill="url(#lossFill)" />
    <path d={lossLine} fill="none" stroke="#80AAE4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d={accLine} fill="none" stroke="#D6B38C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    {[0,1,2,3,4].map(i => <text key={i} x={p.left+i*(w-p.left-p.right)/4} y={h-4} fill="#596879" fontSize="10" textAnchor={i === 0 ? 'start' : i === 4 ? 'end' : 'middle'}>{Math.round(i*cap/4)}</text>)}
  </svg></div>;
}

function EmbeddedStudio({ id, title, src, contentSelector, eyebrow }) {
  const frame = useRef(null);
  const [height, setHeight] = useState(1480);
  useEffect(() => {
    const node = frame.current;
    let observer;
    const syncHeight = () => {
      try {
        const doc = node?.contentDocument;
        const content = doc?.querySelector(contentSelector);
        if (!content) return;
        setHeight(Math.max(850, Math.ceil(content.getBoundingClientRect().height) + 20));
        observer?.disconnect();
        observer = new ResizeObserver(() => {
          const next = Math.max(850, Math.ceil(content.getBoundingClientRect().height) + 20);
          setHeight(old => Math.abs(old - next) > 3 ? next : old);
        });
        observer.observe(content);
      } catch { /* Keep a usable fixed-height viewport if embedding is restricted. */ }
    };
    node?.addEventListener('load', syncHeight);
    if (node?.contentDocument?.readyState === 'complete') syncHeight();
    return () => { node?.removeEventListener('load', syncHeight); observer?.disconnect(); };
  }, []);
  return <section className="studio-container" id={id}>
    <div className="studio-title-row"><div><span className="section-eyebrow">{eyebrow}</span><h1>{title.split(' ')[0]} <em>{title.split(' ').slice(1).join(' ')}</em></h1></div><span className="studio-badge"><span/> LOCAL ENGINE · NO API</span></div>
    <iframe ref={frame} title={`FILINTA AI ${title}`} src={src} className="studio-frame" style={{height}} sandbox="allow-scripts allow-same-origin allow-downloads"/>
  </section>;
}

function App() {
  const [preset, setPreset] = useState('Base');
  const [config, setConfig] = useState({ ...PRESETS.Base });
  const [precision, setPrecision] = useState('FP16');
  const [selectedLayer, setLayer] = useState(4);
  const [selectedTensor, setTensor] = useState(0);
  const [weightMode, setWeightMode] = useState('Signed');
  const [matrixSize, setMatrixSize] = useState(16);
  const [selectedCell, setCell] = useState({ i: 7, j: 9 });
  const [hoverCell, setHoverCell] = useState(null);
  const [step, setStep] = useState(128);
  const [isTraining, setTraining] = useState(false);
  const [lr, setLr] = useState(.0003);
  const [batch, setBatch] = useState(32);
  const [optimizer, setOptimizer] = useState('AdamW');
  const [history, setHistory] = useState(() => Array.from({ length: 50 }, (_, i) => ({ step: i * 128 / 49, loss: lossAt(i * 128 / 49, .0003), acc: accAt(i * 128 / 49) })));
  const [tokensText, setTokensText] = useState(initialText);
  const [attnHead, setAttnHead] = useState(2);
  const [queryToken, setQueryToken] = useState(2);
  const [prompt, setPrompt] = useState('');
  const [generated, setGenerated] = useState('');
  const [generating, setGenerating] = useState(false);
  const [temp, setTemp] = useState(.7);
  const [topK, setTopK] = useState(40);
  const [topP, setTopP] = useState(.9);
  const [maxTokens, setMaxTokens] = useState(64);
  const [notice, setNotice] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [neuron, setNeuron] = useState(null);
  const [activeNav, setActiveNav] = useState('overview');
  const generationInterval = useRef(null);
  const [clock, setClock] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setClock(new Date()), 30000); return () => clearInterval(id); }, []);
  useEffect(() => {
    if (!isTraining) return;
    const id = setInterval(() => setStep(prev => {
      const next = prev + 8;
      setHistory(old => [...old, { step: next, loss: lossAt(next, lr, batch, optimizer), acc: accAt(next, batch, optimizer) }].slice(-90));
      return next;
    }), 420);
    return () => clearInterval(id);
  }, [isTraining, lr, batch, optimizer]);
  useEffect(() => () => clearInterval(generationInterval.current), []);
  useEffect(() => { if (notice) { const t = setTimeout(() => setNotice(''), 3500); return () => clearTimeout(t); } }, [notice]);
  const changePreset = name => { setPreset(name); setConfig({ ...PRESETS[name] }); setLayer(Math.min(selectedLayer, PRESETS[name].layers - 1)); setAttnHead(Math.min(attnHead, PRESETS[name].heads - 1)); setNotice(`${name} mimarisi yüklendi`); };
  const updateConfig = (key, value) => { setConfig(c => ({ ...c, [key]: value })); setPreset('Custom'); if (key === 'layers') setLayer(v => Math.min(v, value - 1)); if (key === 'heads') setAttnHead(v => Math.min(v, value - 1)); };
  const resetTraining = () => { setTraining(false); setStep(0); setHistory([{ step: 0, loss: lossAt(0, lr, batch, optimizer), acc: accAt(0, batch, optimizer) }]); setNotice('Eğitim simülasyonu sıfırlandı'); };
  const advance = () => { setStep(s => { const n = s + 8; setHistory(old => [...old, { step: n, loss: lossAt(n, lr, batch, optimizer), acc: accAt(n, batch, optimizer) }].slice(-90)); return n; }); };
  const weights = useMemo(() => Array.from({ length: matrixSize }, (_, i) => Array.from({ length: matrixSize }, (_, j) => quantizeWeight(makeWeight(i, j, selectedLayer, selectedTensor, step), precision))), [matrixSize, selectedLayer, selectedTensor, step, precision]);
  const flat = weights.flat();
  const mean = flat.reduce((a, b) => a + b, 0) / flat.length;
  const std = Math.sqrt(flat.reduce((a, b) => a + (b - mean) ** 2, 0) / flat.length);
  const sparsity = flat.filter(v => Math.abs(v) < .08).length / flat.length * 100;
  const activeValue = weights[selectedCell.i % matrixSize][selectedCell.j % matrixSize];
  const histogram = useMemo(() => Array.from({ length: 24 }, (_, i) => flat.filter(v => Math.floor((v + 1) / 2 * 24) === i).length), [flat]);
  const tokens = useMemo(() => { const t = tokensText.trim().split(/\s+/).filter(Boolean).slice(0, 12); return t.length ? t : ['FILINTA']; }, [tokensText]);
  const attention = useMemo(() => tokens.map((_, i) => tokens.map((_, j) => {
    const n = seedRand((i + 1) * 18 + (j + 1) * 71 + attnHead * 117 + selectedLayer * 9);
    return (n * n + (i === j ? .36 : 0) + (j < i ? .12 : .02));
  }).map((v, i, arr) => v / arr.reduce((a, b) => a + b, 0))), [tokens, attnHead, selectedLayer]);
  const selectNav = id => { setActiveNav(id); setSidebarOpen(false); if (id === 'transformer' || id === 'model-lab') window.scrollTo({ top: 0, behavior: 'smooth' }); else requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })); };
  const copyConfig = async () => { await navigator.clipboard?.writeText(JSON.stringify({ model: 'FILINTA AI', architecture: 'decoder-only-transformer', preset, precision, ...config, training: { step, lr, batch, optimizer } }, null, 2)); setNotice('JSON kopyalandı'); };
  const downloadData = () => { const payload = { label: 'SYNTHETIC WEIGHTS — LOCAL ONLY', config, precision, preset, layer: selectedLayer, tensor: TENSORS[selectedTensor], step, optimizer, weights: weights.map(row => row.map(x => +x.toFixed(5))) }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `filinta-weights-L${selectedLayer + 1}-${TENSORS[selectedTensor].replace(/[^a-z]/gi,'')}.json`; a.click(); URL.revokeObjectURL(url); setNotice('Tensor JSON indirildi'); };
  const makeInference = () => {
    if (!prompt.trim() || generating) return;
    clearInterval(generationInterval.current); setGenerated(''); setGenerating(true);
    const bank = ['FILINTA', 'AI', 'bir', 'Transformer', 'mimarisi', 'üzerinde', 'token', 'temsillerini', 'işleyerek', 'bağlam', 'ilişkilerini', 'öğrenir.', 'Attention', 'katmanları', 'bilgiyi', 'ağırlık', 'matrisleri', 'ile', 'dönüştürür.', 'Her', 'adımda', 'olasılıklar', 'hesaplanır', 've', 'sonraki', 'token', 'seçilir.', 'Bu', 'yerel', 'simülasyonda', 'parametreler', 'görselleştirilir.'];
    const pool = bank.slice(0, Math.max(1, Math.round(bank.length * topP)));
    const picks = Array.from({ length: Math.min(maxTokens, 60) }, (_, i) => pool[Math.floor(seedRand(i * 17 + prompt.length * 9 + Math.round(temp * 100)) * Math.min(topK, pool.length))]);
    const ordered = ['FILINTA AI,', 'girdi dizisini', 'embedding katmanından geçirir.', 'Self-attention', 'bağlamı analiz eder;', 'ağırlık matrisleri', 'öğrenilen ilişkileri taşır.'];
    const chosen = temp < .25 ? ordered : [...ordered, ...picks];
    let index = 0;
    generationInterval.current = setInterval(() => {
      setGenerated(s => s + (s ? ' ' : '') + chosen[index]); index++;
      if (index >= Math.min(chosen.length, maxTokens)) { clearInterval(generationInterval.current); setGenerating(false); }
    }, 100);
  };
  const stopInference = () => { clearInterval(generationInterval.current); setGenerating(false); };
  const colorWeight = v => weightMode === 'Magnitude' ? `rgba(128,170,228,${.11 + Math.abs(v) * .82})` : v >= 0 ? `rgba(128,170,228,${.09 + v * .86})` : `rgba(214,179,140,${.09 + Math.abs(v) * .86})`;
  const histMax = Math.max(1, ...histogram);
  const latestLoss = lossAt(step, lr, batch, optimizer), latestAcc = accAt(step, batch, optimizer);
  const modelParameters = paramCount(config);
  const kvBytes = 2 * config.layers * config.hidden * config.context * PRECISION_BYTES[precision];
  const flopsPerToken = 2 * modelParameters / 1e9;
  const activationMB = config.layers * config.hidden * 4 * PRECISION_BYTES[precision] / 1e6;
  const stepProgress = Math.min(100, step / 1500 * 100);
  const gradientBars = Array.from({ length: Math.min(config.layers, 24) }, (_, i) => .22 + .72 * seedRand(i * 9 + step * .01) * Math.exp(-i * .025));

  return <div className="app-shell">
    <aside className={'sidebar ' + (sidebarOpen ? 'open' : '')}>
      <div className="brand"><div className="brand-mark"><span className="brand-mark-line a"/><span className="brand-mark-line b"/><span className="brand-mark-line c"/></div><div><strong>FILINTA<span>AI</span></strong></div><button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Kapat"><X size={18}/></button></div>
      <div className="workspace-box"><div className="workspace-icon"><BrainCircuit size={20}/></div><div><b>Weight Architecture</b></div><ChevronDown size={14}/></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{NAV.map(item => <button key={item.id} className={'nav-item ' + (activeNav === item.id ? 'active' : '')} onClick={() => selectNav(item.id)}><item.icon size={17} strokeWidth={1.8}/><span>{item.label}</span>{activeNav === item.id && <span className="nav-current"/>}</button>)}</nav>
      <div className="side-divider"/><div className="nav-label">SİSTEM</div>
      {!['transformer','model-lab'].includes(activeNav) && <><button className="nav-item secondary" onClick={() => setSettingsOpen(true)}><Settings2 size={17}/>Model Ayarları</button><button className="nav-item secondary" onClick={copyConfig}><Code2 size={17}/>JSON Konfigürasyon</button></>}
      <div className="sidebar-spacer"/>
      <div className="backend-card"><div className="backend-line"><span className="offline-dot"/><span>LOCAL RUNTIME</span><span className="offline-pill">NO API</span></div></div>
      <div className="side-profile"><div className="avatar">F</div><div><b>FILINTA Systems</b></div><span className="profile-dots">···</span></div>
    </aside>

    <main className="main-area" id="overview">
      <header className="topbar"><div className="top-left"><button className="mobile-menu" onClick={() => setSidebarOpen(true)}><Menu size={20}/></button><span className="breadcrumb">FILINTA AI</span><ChevronRight size={14}/><strong>{activeNav === 'transformer' ? 'Transformer Studio' : activeNav === 'model-lab' ? 'Model Lab' : 'Weight Architecture'}</strong><span className="top-tag">v1.3</span></div><div className="top-actions"><span className="top-time"><Clock3 size={14}/>{clock.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}</span><span className="header-status"><span/>SYNTHETIC · OFFLINE</span>{!['transformer','model-lab'].includes(activeNav) && <button className="top-icon-btn" onClick={() => setSettingsOpen(true)} title="Ayarlar"><Settings2 size={18}/></button>}<div className="top-avatar">F</div></div></header>
      <div className="main-content">
        {activeNav === 'transformer'
          ? <EmbeddedStudio id="transformer" title="Transformer Studio" src="/transformer-studio.html" contentSelector=".shell" eyebrow="TRANSFORMER / COMPUTE CORE"/>
          : activeNav === 'model-lab'
          ? <EmbeddedStudio id="model-lab" title="Model Lab" src="/model-lab.html" contentSelector=".app" eyebrow="MODEL / RUNTIME PROFILER"/>
          : <>
        <section className="intro"><div><div className="eyebrow"><span className="pulse-dot"/> FILINTA / TRANSFORMER CORE <span className="eyebrow-line"/></div><h1>Weight <em>Architecture</em></h1></div><div className="intro-actions"><div className="select-wrap"><span className="select-label">MODEL</span><select value={preset} onChange={e => changePreset(e.target.value)}><option disabled value="Custom">Custom</option>{Object.keys(PRESETS).map(p => <option key={p}>{p}</option>)}</select><ChevronDown size={14}/></div><button className="btn btn-ghost" onClick={downloadData}><Download size={16}/> Export</button><button className={'btn btn-primary ' + (isTraining ? 'running' : '')} onClick={() => setTraining(v => !v)}>{isTraining ? <Pause size={15} fill="currentColor"/> : <Play size={15} fill="currentColor"/>}{isTraining ? 'Pause' : 'Run'}</button></div></section>

        <section className="kpi-grid" aria-label="Model metrikleri">
          <div className="kpi-card"><div className="kpi-top"><span>PARAMETERS</span><Boxes size={17}/></div><div className="kpi-body"><strong>{formatParams(modelParameters)}</strong><MiniSpark color="#80AAE4" values={[19,24,21,29,32,37,41,40,44,49,54,58]}/></div><div className="kpi-bottom"><span className="tiny-chip green">{precision}</span><span>{sizeMB(modelParameters,precision)}</span></div></div>
          <div className="kpi-card"><div className="kpi-top"><span>TRANSFORMER BLOK</span><Layers3 size={17}/></div><div className="kpi-body"><strong>{String(config.layers).padStart(2,'0')}<small> layers</small></strong><span className="kpi-ornament"><i/><i/><i/><i/><i/></span></div><div className="kpi-bottom"><span className="tiny-chip violet">{config.heads} HEADS</span><span>{config.hidden} hidden dim</span></div></div>
          <div className="kpi-card"><div className="kpi-top"><span>CROSS-ENTROPY LOSS</span><Waves size={17}/></div><div className="kpi-body"><strong>{latestLoss.toFixed(3)}</strong><MiniSpark color="#8AB8D8" values={Array.from({length:18},(_,i)=>lossAt(Math.max(0,step-170+i*10),lr,batch,optimizer))}/></div><div className="kpi-bottom"><span className="tiny-chip green">↓ {Math.max(0,100-(latestLoss/3.88*100)).toFixed(1)}%</span><span>STEP {fmt(step)}</span></div></div>
          <div className="kpi-card"><div className="kpi-top"><span>TOP-1 ACCURACY</span><Gauge size={17}/></div><div className="kpi-body"><strong>{latestAcc.toFixed(1)}<small>%</small></strong><div className="kpi-bar"><span style={{width:`${latestAcc}%`}}/></div></div><div className="kpi-bottom"><span className="tiny-chip violet">OPT · {optimizer}</span><span>BATCH {batch}</span></div></div>
        </section>

        <div className="content-grid hero-grid" id="architecture">
          <section className="panel architecture-panel"><div className="panel-head"><div><div className="panel-kicker"><Network size={14}/> NEURAL TOPOLOGY</div><h3>Transformer Graph</h3></div><div className="panel-actions"><span className="live-indicator"><span className={isTraining ? 'live-blink' : ''}/> {isTraining ? 'RUNNING' : 'IDLE'}</span><button className="icon-button" title="Ayarlar" onClick={() => setSettingsOpen(true)}><SlidersHorizontal size={16}/></button></div></div>
            <div className="architecture-stats"><div><span>ARCH</span><strong>Decoder-only</strong></div><div><span>DIM</span><strong>{config.hidden}d</strong></div><div><span>CONTEXT</span><strong>{(config.context/1024).toFixed(0)}K</strong></div><div><span>DTYPE</span><strong>{precision}</strong></div></div>
            <NetworkGraph layer={selectedLayer} tensor={selectedTensor} step={step} active={isTraining} onSelect={setNeuron}/>
            <div className="layer-strip-header"><span>BLOCK INDEX <small>({config.layers})</small></span><span>L{String(selectedLayer+1).padStart(2,'0')} <ArrowRight size={13}/></span></div>
            <div className="layer-strip">{Array.from({length:config.layers},(_,i)=><button key={i} onClick={()=>setLayer(i)} title={`Layer ${i+1}`} className={'layer-tile ' + (i===selectedLayer?'selected':'')}><span>{String(i+1).padStart(2,'0')}</span><i style={{height:`${17+seedRand(i*7+1)*55}%`}}/></button>)}</div>
            <div className="architecture-footer"><div><span className="legend-dot lime"/> FFN</div><div><span className="legend-dot violet"/> MHA</div><div><span className="legend-dot grey"/> RMS Norm</div><span className="right-label">L{String(selectedLayer+1).padStart(2,'0')} / L{config.layers}</span></div>
          </section>

          <section className="panel dynamics-panel" id="training"><div className="panel-head"><div><div className="panel-kicker"><Activity size={14}/> TRAINING TELEMETRY</div><h3>Loss / Accuracy</h3></div><button className="icon-button" onClick={resetTraining} title="Sıfırla"><RotateCcw size={16}/></button></div>
            <div className="training-values"><div><span>LOSS</span><strong>{latestLoss.toFixed(4)}</strong></div><div><span>ACCURACY</span><strong className="violet-text">{latestAcc.toFixed(1)}%</strong></div></div>
            <div className="chart-legend"><span><i className="lime-bg"/> Training Loss</span><span><i className="violet-bg"/> Accuracy</span><span className="chart-axis">EPOCH STEPS →</span></div><ChartPanel step={step} lr={lr} batch={batch} optimizer={optimizer} history={history}/>
            <div className="training-progress"><div><span>TRAINING PROGRESS</span><b>{fmt(step)} / 1,500</b></div><div className="progress-rail"><div style={{width:`${stepProgress}%`}}/></div></div>
            <div className="training-controls"><button className="btn-control main" onClick={()=>setTraining(v=>!v)}>{isTraining?<Pause size={15}/>:<Play size={15} fill="currentColor"/>}{isTraining?'Durdur':'Başlat'}</button><button className="btn-control" onClick={advance} title="Bir adım ilerle"><ChevronRight size={17}/><span>Step +8</span></button><button className="btn-control square" onClick={resetTraining} title="Reset"><RefreshCcw size={16}/></button></div>
          </section>
        </div>

        <section className="compute-strip" aria-label="Hesaplama profili">
          <div className="compute-strip-title"><Cpu size={17}/><span>COMPUTE</span><b>PROFILE</b></div>
          <div className="compute-metric"><span>MODEL STORAGE</span><strong>{sizeMB(modelParameters,precision)}</strong><small>{precision}</small></div>
          <div className="compute-metric"><span>KV CACHE / CONTEXT</span><strong>{kvBytes >= 1e9 ? (kvBytes/1e9).toFixed(2)+' GB' : (kvBytes/1e6).toFixed(1)+' MB'}</strong><small>{fmt(config.context)} tokens</small></div>
          <div className="compute-metric"><span>FLOPs / TOKEN</span><strong>{flopsPerToken.toFixed(2)}G</strong><small>estimate</small></div>
          <div className="compute-metric"><span>HEAD DIM</span><strong>{(config.hidden/config.heads).toFixed(1)}</strong><small>{config.heads} heads</small></div>
          <div className="compute-metric"><span>ACTIVATION / STEP</span><strong>{activationMB.toFixed(2)} MB</strong><small>estimate</small></div>
        </section>

        <div className="section-gap"/>
        <SectionHeading eyebrow="02 / PARAMETER SPACE" title="Weight Matrix"/>
        <div className="content-grid weight-grid" id="weights">
          <section className="panel heatmap-panel"><div className="panel-head responsive"><div><div className="panel-kicker"><Grid2X2 size={14}/> TENSOR VIEW</div><h3>Weight Heatmap <span className="headline-muted">/ L{String(selectedLayer+1).padStart(2,'0')}</span></h3></div><div className="heatmap-actions"><div className="segment-control"><button className={weightMode==='Signed'?'on':''} onClick={()=>setWeightMode('Signed')}>Signed</button><button className={weightMode==='Magnitude'?'on':''} onClick={()=>setWeightMode('Magnitude')}>Magnitude</button></div><div className="select-small"><select value={matrixSize} onChange={e=>{setMatrixSize(+e.target.value);setCell({i:0,j:0});}}><option value={12}>12 × 12</option><option value={16}>16 × 16</option><option value={20}>20 × 20</option><option value={24}>24 × 24</option></select><ChevronDown size={13}/></div></div></div>
            <div className="tensor-tabs">{TENSORS.map((t,i)=><button key={t} className={i===selectedTensor?'selected':''} onClick={()=>setTensor(i)}>{t}</button>)}</div>
            <div className="matrix-layout"><div className="matrix-y">{Array.from({length:matrixSize},(_,i)=><span key={i}>{i%4===0?String(i).padStart(2,'0'):''}</span>)}</div><div className="matrix-main"><div className="matrix-grid" style={{gridTemplateColumns:`repeat(${matrixSize}, 1fr)`}}>{weights.map((row,i)=>row.map((val,j)=><button key={`${i}-${j}`} title={`[${i}, ${j}] ${signed(val)}`} className={'matrix-cell ' + (selectedCell.i===i&&selectedCell.j===j?'active':'')} style={{backgroundColor:colorWeight(val)}} onMouseEnter={()=>setHoverCell({i,j,val})} onMouseLeave={()=>setHoverCell(null)} onClick={()=>setCell({i,j})} aria-label={`Ağırlık ${i},${j}: ${val.toFixed(4)}`}/>))}</div><div className="matrix-x" style={{gridTemplateColumns:`repeat(${matrixSize},1fr)`}}>{Array.from({length:matrixSize},(_,i)=><span key={i}>{i%4===0?String(i).padStart(2,'0'):''}</span>)}</div></div><div className="matrix-colorbar"><div className={'color-ramp '+(weightMode==='Magnitude'?'magnitude':'')}/><span>+1.0</span><span>0.0</span><span>−1.0</span></div></div>
            <div className="heatmap-bottom"><span><span className="legend-dot lime"/> W+</span><span><span className="legend-dot violet"/> W−</span><span className="mono align-right">[{config.hidden} × {config.hidden}] · {precision}</span></div>
          </section>
          <section className="panel inspector-panel"><div className="panel-head"><div><div className="panel-kicker"><Focus size={14}/> TENSOR INSPECTOR</div><h3>Distribution & Statistics</h3></div><span className="inspector-chip">L{selectedLayer+1} · {TENSORS[selectedTensor]}</span></div>
            <div className="selected-weight"><div className="selected-top"><span>W[i,j]</span><span className="mono">[{(hoverCell??selectedCell).i}, {(hoverCell??selectedCell).j}]</span></div><div className="selected-value">{signed(hoverCell?.val ?? activeValue)}</div><div className="selected-sub"><span className="value-change"><ArrowRight size={13}/> ∆ {signed(Math.sin(step*.02+selectedCell.i)*.0018)}</span><span>{precision}</span></div></div>
            <div className="stat-quad"><div><span>MEAN (μ)</span><b>{mean.toFixed(4)}</b></div><div><span>STD (σ)</span><b>{std.toFixed(4)}</b></div><div><span>SPARSITY</span><b>{sparsity.toFixed(1)}%</b></div><div><span>L2 NORM</span><b>{Math.sqrt(flat.reduce((a,v)=>a+v*v,0)).toFixed(2)}</b></div></div>
            <div className="distribution-header"><span>WEIGHT HISTOGRAM</span><span className="mono">n = {flat.length}</span></div><div className="histogram">{histogram.map((h,i)=><div key={i} style={{height:`${Math.max(3,h/histMax*100)}%`,background:i<12?'#D6B38C':'#80AAE4'}} title={`${h} weights`}/>)}</div><div className="histogram-labels"><span>−1.0</span><span>0</span><span>+1.0</span></div>
            <div className="inspector-footer"><button onClick={downloadData}><Download size={15}/> Tensor JSON</button><button onClick={()=>{setTensor((selectedTensor+1)%TENSORS.length);setCell({i:0,j:0})}}><RefreshCcw size={15}/> Next Tensor</button></div>
          </section>
        </div>

        <div className="section-gap"/>
        <SectionHeading eyebrow="03 / ATTENTION" title="Attention Matrix"/>
        <div className="content-grid attention-grid" id="attention">
          <section className="panel attention-panel"><div className="panel-head"><div><div className="panel-kicker"><Focus size={14}/> SELF-ATTENTION MATRIX</div><h3>Token Attention <span className="headline-muted">/ Softmax(QKᵀ)</span></h3></div><span className="inspector-chip">HEAD {String(attnHead+1).padStart(2,'0')}</span></div>
            <div className="token-input-wrap"><span>INPUT TOKENS</span><input value={tokensText} onChange={e=>{setTokensText(e.target.value);setQueryToken(0)}} maxLength={110} aria-label="Attention giriş metni"/><span className="token-length">{tokens.length} / 12</span></div>
            <div className="attention-map-wrap"><div className="attention-row-labels">{tokens.map((t,i)=><button key={i} className={queryToken===i?'active':''} onClick={()=>setQueryToken(i)} title={t}>{t.slice(0,8)}</button>)}</div><div className="attention-right"><div className="attention-grid-cells" style={{gridTemplateColumns:`repeat(${tokens.length},1fr)`}}>{attention.map((row,i)=>row.map((val,j)=><button key={`${i}-${j}`} className={queryToken===i?'focus-row':''} style={{background:`rgba(128,170,228,${.07 + Math.min(1,val*3)*.83})`,borderColor:queryToken===i?'rgba(138,184,216,.4)':'transparent'}} onClick={()=>setQueryToken(i)} title={`${tokens[i]} → ${tokens[j]}: ${(val*100).toFixed(1)}%`}>{tokens.length<=7?(val*100).toFixed(0):''}</button>))}</div><div className="attention-col-labels">{tokens.map((t,i)=><span key={i} title={t}>{t.slice(0,5)}</span>)}</div></div></div>
          </section>
          <section className="panel head-panel"><div className="panel-head"><div><div className="panel-kicker"><BrainCircuit size={14}/> MULTI-HEAD ATTENTION</div><h3>Head Inspector</h3></div><span className="counter-badge">{attnHead+1} / {config.heads}</span></div>
            <div className="head-grid">{Array.from({length:config.heads},(_,i)=><button key={i} onClick={()=>setAttnHead(i)} className={attnHead===i?'active':''}><span>H{String(i+1).padStart(2,'0')}</span><span className="head-bars">{Array.from({length:5},(_,j)=><i key={j} style={{height:`${18+seedRand(i*13+j*5+1)*82}%`}}/>)}</span></button>)}</div>
            <div className="head-detail"><div className="head-detail-top"><span>QUERY TOKEN</span><b>{tokens[Math.min(queryToken,tokens.length-1)]}</b></div><div className="attention-bars">{tokens.map((token,j)=><div key={j}><span title={token}>{token}</span><div className="att-bar-bg"><div style={{width:`${attention[Math.min(queryToken,tokens.length-1)][j]*100*1.75}%`}}/></div><b>{Math.round(attention[Math.min(queryToken,tokens.length-1)][j]*100)}%</b></div>)}</div></div>
          </section>
        </div>

        <div className="section-gap"/>
        <SectionHeading eyebrow="04 / OPTIMIZATION" title="Optimizer & Gradients"/>
        <section className="panel optimizer-panel"><div className="optimization-settings"><div className="opt-heading"><div className="panel-kicker"><SlidersHorizontal size={14}/> HYPERPARAMETERS</div><h3>Optimizer Config</h3></div><div className="opt-inputs"><LabeledRange label="Learning Rate" value={lr} min={.0001} max={.003} step={.0001} display={lr.toFixed(4)} onChange={setLr}/><LabeledRange label="Batch Size" value={batch} min={8} max={128} step={8} onChange={setBatch}/><label className="optimizer-select"><span>OPTIMIZER</span><select value={optimizer} onChange={e=>setOptimizer(e.target.value)}><option>AdamW</option><option>SGD</option><option>RMSprop</option><option>Adagrad</option></select></label></div></div><div className="gradient-area"><div className="gradient-heading"><div><div className="panel-kicker"><Waves size={14}/> GRADIENT FLOW</div><h3>Layer Gradients</h3></div><span className="mono">∇W · L1—L{config.layers}</span></div><div className="gradient-bars">{gradientBars.map((n,i)=><div key={i} title={`Layer ${i+1}: ${n.toFixed(3)}`}><span style={{height:`${n*100}%`}}/></div>)}</div><div className="gradient-legend"><span>INPUT LAYERS</span><span>OUTPUT LAYERS</span></div></div></section>

        <div className="section-gap"/>
        <SectionHeading eyebrow="05 / DECODING" title="Inference Console" action={<span className="no-api-tag"><Radio size={14}/> SYNTHETIC</span>}/>
        <div className="content-grid inference-grid" id="inference"><section className="panel console-panel"><div className="console-head"><div><TerminalSquare size={17}/><b>filinta / inference</b><span>LOCAL</span></div><div className="console-dots"><i/><i/><i/></div></div><div className="console-body"><label>PROMPT</label><textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={3}/><div className="output-label"><span>OUTPUT</span><span className="simulation-mark">SYNTHETIC</span></div><div className="generated-output">{generated ? <span>{generated}{generating&&<i className="cursor"/>}</span> : null}</div><div className="console-bottom"><span><span className="offline-dot"/> LOCAL</span><span>{generated.split(/\s+/).filter(Boolean).length} TOKENS</span><div className="console-bottom-spacer"/><button className="btn btn-ghost" onClick={()=>{stopInference();setGenerated('')}}><RotateCcw size={14}/> Clear</button><button className="btn btn-primary" onClick={generating?stopInference:makeInference}>{generating?<Square size={13} fill="currentColor"/>:<TerminalSquare size={15}/>} {generating?'Stop':'Execute'}</button></div></div></section>
          <section className="panel sampler-panel"><div className="panel-head"><div><div className="panel-kicker"><Settings2 size={14}/> DECODER PARAMETERS</div><h3>Sampling Config</h3></div><span className="inspector-chip">LOCAL</span></div><div className="sampler-ranges"><LabeledRange label="Temperature" value={temp} min={0} max={2} step={.05} display={temp.toFixed(2)} onChange={setTemp}/><LabeledRange label="Top-P" value={topP} min={.1} max={1} step={.05} display={topP.toFixed(2)} onChange={setTopP}/><LabeledRange label="Top-K" value={topK} min={1} max={100} onChange={setTopK}/><LabeledRange label="Max tokens" value={maxTokens} min={8} max={128} step={8} onChange={setMaxTokens}/></div><div className="sampler-footer"><button onClick={()=>{setTemp(.7);setTopP(.9);setTopK(40);setMaxTokens(64)}}>Reset defaults</button></div></section></div>

        <footer className="footer"><div className="footer-logo">FILINTA <b>AI</b><span> / CORE SYSTEMS</span></div><div>SYNTHETIC DATA <span className="footer-dot"/> LOCAL RUNTIME <span className="footer-dot"/> v1.3.0</div></footer>
        </>}
      </div>
    </main>

    {settingsOpen&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSettingsOpen(false)}}><div className="settings-modal"><div className="modal-head"><div><div className="panel-kicker"><Settings2 size={14}/> MODEL PARAMETERS</div><h2>Architecture Config</h2></div><button className="icon-button" onClick={()=>setSettingsOpen(false)}><X size={18}/></button></div><div className="modal-content"><div className="preset-choices">{Object.keys(PRESETS).map(p=><button key={p} className={preset===p?'chosen':''} onClick={()=>changePreset(p)}><Boxes size={19}/><b>{p}</b><small>{PRESETS[p].layers}L · {PRESETS[p].hidden}d</small></button>)}</div><LabeledRange label="Transformer Layers" min={2} max={32} value={config.layers} onChange={n=>updateConfig('layers',n)}/><LabeledRange label="Hidden Dimension" min={128} max={2048} step={128} value={config.hidden} onChange={n=>updateConfig('hidden',n)}/><LabeledRange label="Attention Heads" min={2} max={32} step={2} value={config.heads} onChange={n=>updateConfig('heads',n)}/><LabeledRange label="Context Length" min={512} max={16384} step={512} value={config.context} onChange={n=>updateConfig('context',n)}/><label className="precision-field"><span>PRECISION</span><select value={precision} onChange={e=>setPrecision(e.target.value)}>{Object.keys(PRECISION_BYTES).map(p=><option key={p}>{p}</option>)}</select></label><div className="modal-estimate"><span>PARAMETER STORAGE</span><b>{formatParams(modelParameters)}</b><small>{precision} · {sizeMB(modelParameters,precision)}</small></div></div><div className="modal-foot"><button className="btn btn-ghost" onClick={copyConfig}><Copy size={15}/> Copy JSON</button><button className="btn btn-primary" onClick={()=>setSettingsOpen(false)}><Check size={15}/> Apply changes</button></div></div></div>}
    {neuron&&<div className="neuron-popover"><button onClick={()=>setNeuron(null)}><X size={13}/></button><span>NEURON ACTIVATION</span><strong>C{neuron.column+1} · N{String(neuron.neuron+1).padStart(2,'0')}</strong><div className="neuron-meter"><i style={{width:`${30+seedRand(neuron.column*17+neuron.neuron)*65}%`}}/></div></div>}
    {notice&&<div className="toast"><Check size={16}/>{notice}</div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
