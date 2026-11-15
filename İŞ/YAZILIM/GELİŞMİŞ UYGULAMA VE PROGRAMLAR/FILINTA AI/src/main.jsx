import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowRight, BarChart3, Boxes, BrainCircuit, Check, ChevronDown,
  ChevronLeft, ChevronRight, CircleDot, Code2, Cpu, Database, Download, FileJson,
  Focus, Gauge, GitBranch, Grid2X2, HardDrive, Layers3, LayoutDashboard, Menu,
  Minus, MoveRight, Network, Pause, Play, Plus, RotateCcw, Scan, Settings2,
  ShieldCheck, SlidersHorizontal, Sparkles, Terminal, Waves, X, Zap
} from 'lucide-react';
import './styles.css';

const PRESETS = {
  Nano: { layers: 6, hidden: 256, heads: 4, context: 1024, vocab: 32000 },
  Base: { layers: 12, hidden: 768, heads: 12, context: 4096, vocab: 50000 },
  Pro: { layers: 24, hidden: 1024, heads: 16, context: 8192, vocab: 64000 }
};
const TENSORS = ['Wq', 'Wk', 'Wv', 'Wo', 'FFN ↑', 'FFN ↓', 'Embedding'];
const PRECISION_BYTES = { FP32: 4, FP16: 2, INT8: 1, INT4: 0.5 };
const GROUPS = [
  {
    items: [{ id: 'overview', name: 'Genel bakış', icon: LayoutDashboard }]
  },
  {
    items: [
      { id: 'model', name: 'Model ayarları', icon: Settings2 },
      { id: 'topology', name: 'Ağ topolojisi', icon: Network },
      { id: 'layers', name: 'Katmanlar', icon: Layers3 },
      { id: 'flow', name: 'Veri akışı', icon: GitBranch },
      { id: 'attention', name: 'Attention matrisi', icon: Focus },
      { id: 'heads', name: 'Attention başlıkları', icon: BrainCircuit }
    ]
  },
  {
    items: [
      { id: 'matrix', name: 'Ağırlık matrisi', icon: Grid2X2 },
      { id: 'distribution', name: 'Dağılım analizi', icon: BarChart3 },
      { id: 'quantization', name: 'Kuantizasyon', icon: Scan }
    ]
  },
  {
    items: [
      { id: 'training', name: 'Eğitim simülasyonu', icon: Activity },
      { id: 'optimizer', name: 'Optimizer', icon: SlidersHorizontal },
      { id: 'gradients', name: 'Gradyan akışı', icon: Waves }
    ]
  },
  {
    items: [
      { id: 'memory', name: 'Bellek profili', icon: HardDrive },
      { id: 'compute', name: 'Hesaplama profili', icon: Cpu }
    ]
  },
  {
    items: [
      { id: 'tokens', name: 'Token görünümü', icon: Boxes },
      { id: 'inference', name: 'Çıktı simülasyonu', icon: Terminal },
      { id: 'decoding', name: 'Çözümleme ayarları', icon: Gauge }
    ]
  }
];
const ALL = GROUPS.flatMap((group) => group.items);
const PAGE_ORDER = ALL.map((item) => item.id);
const meta = {
  overview: ['GENEL BAKIŞ', 'Filinta AI çalışma alanı', ''],
  model: ['MİMARİ', 'Model ayarları', ''],
  topology: ['MİMARİ', 'Ağ topolojisi', ''],
  layers: ['MİMARİ', 'Katmanlar', ''],
  flow: ['MİMARİ', 'Veri akışı', ''],
  attention: ['MİMARİ', 'Attention matrisi', ''],
  heads: ['MİMARİ', 'Attention başlıkları', ''],
  matrix: ['AĞIRLIKLAR', 'Ağırlık matrisi', ''],
  distribution: ['AĞIRLIKLAR', 'Dağılım analizi', ''],
  quantization: ['AĞIRLIKLAR', 'Kuantizasyon', ''],
  training: ['EĞİTİM', 'Eğitim simülasyonu', ''],
  optimizer: ['EĞİTİM', 'Optimizer', ''],
  gradients: ['EĞİTİM', 'Gradyan akışı', ''],
  memory: ['MODEL LAB', 'Bellek profili', ''],
  compute: ['MODEL LAB', 'Hesaplama profili', ''],
  tokens: ['ÇIKTI', 'Token görünümü', ''],
  inference: ['ÇIKTI', 'Çıktı simülasyonu', ''],
  decoding: ['ÇIKTI', 'Çözümleme ayarları', '']
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const rand = (seed) => {
  const v = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return v - Math.floor(v);
};
const fmt = (n) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(n);
const fmtSize = (bytes) => (bytes >= 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : `${(bytes / 1e6).toFixed(1)} MB`);
const countParams = (c) => 12 * c.layers * c.hidden * c.hidden + c.vocab * c.hidden + 4 * c.layers * c.hidden;
const fmtParams = (p) => (p >= 1e9 ? `${(p / 1e9).toFixed(2)}B` : `${(p / 1e6).toFixed(1)}M`);
const lossAt = (step, lr, batch, optimizer) => {
  const o = ({ AdamW: 1, SGD: 0.68, RMSprop: 0.88, Adagrad: 0.78 })[optimizer] || 1;
  const s = step * o * Math.pow(32 / batch, 0.16);
  return Math.max(0.48, 3.88 * Math.exp(-s * (0.00205 + lr * 8)) + 0.55 + 0.07 * Math.sin(s * 0.085) * Math.exp(-s * 0.002));
};
const accAt = (step, batch, optimizer) => {
  const o = ({ AdamW: 1, SGD: 0.68, RMSprop: 0.88, Adagrad: 0.78 })[optimizer] || 1;
  const s = step * o * Math.pow(32 / batch, 0.16);
  return Math.min(97.4, 18 + 77 * (1 - Math.exp(-s * 0.00315)) + 0.75 * Math.sin(s * 0.05));
};
const weightAt = (i, j, layer, tensor, step) =>
  clamp(
    (rand(i * 31 + j * 79 + layer * 137 + tensor * 191) * 2 - 1) * 0.64 +
      Math.sin(step * 0.043 + i * 0.7 - j * 0.38 + tensor) * Math.min(0.28, step * 0.00048),
    -1,
    1
  );
const quant = (v, precision) =>
  precision === 'FP32'
    ? v
    : precision === 'FP16'
      ? Math.round(v * 2048) / 2048
      : Math.round(v * (precision === 'INT8' ? 127 : 7)) / (precision === 'INT8' ? 127 : 7);
const routeFromHash = () => {
  const key = decodeURIComponent(window.location.hash.slice(1));
  return meta[key] ? key : 'overview';
};

function Button({ children, onClick, variant = 'soft', disabled = false, className = '', title }) {
  return (
    <button type="button" title={title} disabled={disabled} onClick={onClick} className={`btn ${variant} ${className}`}>
      {children}
    </button>
  );
}
function Card({ title, action, children, wide = false, className = '' }) {
  return (
    <section className={`surface ${wide ? 'wide' : ''} ${className}`}>
      <div className="surface-top">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
function Field({ label, value, min, max, step = 1, onChange, display }) {
  return (
    <label className="range-field">
      <span className="field-top">
        <span>{label}</span>
        <strong>{display ?? value}</strong>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
      <span className="range-scale">
        <span>{min}</span>
        <span>{max}</span>
      </span>
    </label>
  );
}
function Metric({ name, value, note, icon: Icon }) {
  return (
    <div className="metric">
      <div className="metric-icon">
        <Icon size={19} />
      </div>
      <div>
        <span className="metric-label">{name}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}
function SelectField({ label, value, options, onChange }) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <div className="select-shell">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown size={15} />
      </div>
    </label>
  );
}
function MiniBars({ count = 18, seed = 1, selected = -1 }) {
  return (
    <div className="mini-bars">
      {Array.from({ length: count }, (_, i) => (
        <i key={i} className={selected === i ? 'on' : ''} style={{ height: `${22 + rand(i * 13 + seed) * 76}%` }} />
      ))}
    </div>
  );
}
function Chart({ history, lr, batch, optimizer }) {
  const data =
    history.length > 1
      ? history
      : Array.from({ length: 60 }, (_, i) => ({ step: i * 10, loss: lossAt(i * 10, lr, batch, optimizer), acc: accAt(i * 10, batch, optimizer) }));
  const w = 780;
  const h = 300;
  const left = 30;
  const right = 16;
  const top = 22;
  const bottom = 30;
  const maxStep = Math.max(640, data[data.length - 1].step);
  const sx = (s) => left + (s / maxStep) * (w - left - right);
  const syLoss = (v) => top + ((4.2 - v) / 4.2) * (h - top - bottom);
  const syAcc = (v) => top + ((100 - v) / 100) * (h - top - bottom);
  const path = (key, scale) => data.map((d, i) => `${i ? 'L' : 'M'}${sx(d.step).toFixed(1)} ${scale(d[key]).toFixed(1)}`).join(' ');

  return (
    <div className="line-chart">
      <svg role="img" aria-label="Simüle edilen kayıp ve doğruluk grafiği" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={left} x2={w - right} y1={top + (i * (h - top - bottom)) / 4} y2={top + (i * (h - top - bottom)) / 4} stroke="#243749" strokeDasharray="4 7" />
        ))}
        <path d={path('loss', syLoss)} stroke="#78c4a3" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path('acc', syAcc)} stroke="#6da8d8" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x={left} y={h - 4} fill="#8493a2" fontSize="12">0</text>
        <text x={w - right} y={h - 4} fill="#8493a2" textAnchor="end" fontSize="12">{fmt(maxStep)} adım</text>
      </svg>
    </div>
  );
}
function NetworkGraphic({ layer, tensor, step, onSelect }) {
  const cols = [5, 7, 8, 8, 7, 5];
  const w = 900;
  const h = 315;
  const p = cols.map((count, c) => Array.from({ length: count }, (_, i) => ({ x: 58 + c * 157, y: 30 + ((i + 0.5) * 245) / count })));

  return (
    <div className="network-visual">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Sentetik sinir ağı bağlantı haritası">
        {p.slice(0, -1).flatMap((col, c) =>
          col.flatMap((a, i) =>
            p[c + 1]
              .filter((_, j) => (j + i + c) % 3 !== 0)
              .map((b, j) => {
                const v = weightAt(i, j, layer + c, tensor, step);
                return (
                  <line
                    key={`${c}-${i}-${j}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={v > 0 ? '#78c4a3' : '#6da8d8'}
                    strokeWidth={0.8 + Math.abs(v) * 1.15}
                    strokeOpacity={0.13 + Math.abs(v) * 0.38}
                  />
                );
              })
          )
        )}
        {p.flatMap((col, c) =>
          col.map((pt, i) => (
            <g
              key={`${c}-${i}`}
              role="button"
              tabIndex={0}
              onClick={() => onSelect({ c, i })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect({ c, i });
              }}
              aria-label={`Nöron ${c + 1}.${i + 1}`}
              className="network-node"
            >
              <circle cx={pt.x} cy={pt.y} r="7" fill="#192431" stroke={c === 0 || c === 5 ? '#78c4a3' : '#6da8d8'} strokeWidth="2" />
              <circle cx={pt.x} cy={pt.y} r="2" fill="#78c4a3" />
            </g>
          ))
        )}
      </svg>
      <div className="graph-labels">
        <span>Girdi</span>
        <span>Embedding</span>
        <span>Attention</span>
        <span>FFN</span>
        <span>Çıkış</span>
      </div>
    </div>
  );
}
function Matrix({ values, selected, onSelect, mode }) {
  const n = values.length;
  return (
    <div className="matrix-wrap">
      <div className="matrix-board" style={{ gridTemplateColumns: `repeat(${n},minmax(0,1fr))` }}>
        {values.flatMap((row, i) =>
          row.map((v, j) => {
            const op = 0.16 + Math.abs(v) * 0.83;
            const bg =
              mode === 'Magnitude'
                ? `rgba(120,196,163,${op})`
                : v >= 0
                  ? `rgba(120,196,163,${op})`
                  : `rgba(109,168,216,${op})`;
            return (
              <button
                type="button"
                key={`${i}-${j}`}
                className={`matrix-cell ${selected.i === i && selected.j === j ? 'chosen' : ''}`}
                style={{ background: bg }}
                onClick={() => onSelect({ i, j })}
                aria-label={`${i},${j}: ${v.toFixed(4)}`}
                title={`${i}, ${j} · ${v.toFixed(4)}`}
              />
            );
          })
        )}
      </div>
      <div className="matrix-legend">
        <span>−1</span>
        <div />
        <span>+1</span>
      </div>
    </div>
  );
}
function SparkValue({ value, subtitle }) {
  return (
    <div className="big-value">
      <strong>{value}</strong>
      <span>{subtitle}</span>
    </div>
  );
}

function App() {
  const [page, setPage] = useState(routeFromHash);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [preset, setPreset] = useState('Base');
  const [config, setConfig] = useState({ ...PRESETS.Base });
  const [precision, setPrecision] = useState('FP16');
  const [layer, setLayer] = useState(3);
  const [tensor, setTensor] = useState(0);
  const [graphNeuron, setGraphNeuron] = useState(null);
  const [pipelineStep, setPipelineStep] = useState(2);
  const [matrixSize, setMatrixSize] = useState(16);
  const [matrixMode, setMatrixMode] = useState('Signed');
  const [cell, setCell] = useState({ i: 7, j: 9 });
  const [tokensText, setTokensText] = useState('Operasyon verisi giriş kuyruğu');
  const [attentionHead, setAttentionHead] = useState(1);
  const [selectedToken, setSelectedToken] = useState(0);
  const [step, setStep] = useState(128);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState(() =>
    Array.from({ length: 26 }, (_, i) => ({ step: (i * 128) / 25, loss: lossAt((i * 128) / 25, 0.0003, 32, 'AdamW'), acc: accAt((i * 128) / 25, 32, 'AdamW') }))
  );
  const [lr, setLr] = useState(0.0003);
  const [batch, setBatch] = useState(32);
  const [optimizer, setOptimizer] = useState('AdamW');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);
  const [topK, setTopK] = useState(40);
  const [maxTokens, setMaxTokens] = useState(64);
  const [prompt, setPrompt] = useState('Müşteri operasyon akışını özetle.');
  const [output, setOutput] = useState('');
  const [toast, setToast] = useState('');
  const timer = useRef(null);

  useEffect(() => {
    const sync = () => setPage(routeFromHash());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setStep((s) => s + 8), 450);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    setHistory((h) => {
      const last = h[h.length - 1];
      if (last && Math.abs(last.step - step) < 0.001) return h;
      return [...h, { step, loss: lossAt(step, lr, batch, optimizer), acc: accAt(step, batch, optimizer) }].slice(-100);
    });
  }, [step, lr, batch, optimizer]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const navigate = (id) => {
    setPage(id);
    setMobileMenu(false);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const currentIndex = PAGE_ORDER.indexOf(page);
  const prevPage = () => navigate(PAGE_ORDER[(currentIndex - 1 + PAGE_ORDER.length) % PAGE_ORDER.length]);
  const nextPage = () => navigate(PAGE_ORDER[(currentIndex + 1) % PAGE_ORDER.length]);

  const changePreset = (name) => {
    setPreset(name);
    setConfig({ ...PRESETS[name] });
    setLayer((s) => Math.min(s, PRESETS[name].layers - 1));
    setAttentionHead((s) => Math.min(s, PRESETS[name].heads - 1));
    setToast(`${name} profili uygulandı`);
  };
  const updateConfig = (key, value) => {
    setPreset('Özel');
    setConfig((c) => ({ ...c, [key]: value }));
    if (key === 'layers') setLayer((s) => Math.min(s, value - 1));
    if (key === 'heads') setAttentionHead((s) => Math.min(s, value - 1));
  };
  const resetTraining = () => {
    setRunning(false);
    setStep(0);
    setHistory([{ step: 0, loss: lossAt(0, lr, batch, optimizer), acc: accAt(0, batch, optimizer) }]);
    setToast('Eğitim sıfırlandı');
  };

  const params = countParams(config);
  const storage = params * PRECISION_BYTES[precision];
  const kvCache = 2 * config.layers * config.hidden * config.context * PRECISION_BYTES[precision];
  const activation = config.layers * config.hidden * 4 * PRECISION_BYTES[precision];
  const flopsPerToken = 2 * params;

  const weights = useMemo(
    () => Array.from({ length: matrixSize }, (_, i) => Array.from({ length: matrixSize }, (_, j) => quant(weightAt(i, j, layer, tensor, step), precision))),
    [matrixSize, layer, tensor, step, precision]
  );
  const flat = weights.flat();
  const average = flat.reduce((a, v) => a + v, 0) / flat.length;
  const stdev = Math.sqrt(flat.reduce((a, v) => a + (v - average) ** 2, 0) / flat.length);
  const sparse = (flat.filter((v) => Math.abs(v) < 0.08).length / flat.length) * 100;
  const hist = Array.from({ length: 24 }, (_, i) => flat.filter((v) => clamp(Math.floor(((v + 1) / 2) * 24), 0, 23) === i).length);
  const maxHist = Math.max(...hist, 1);

  const tokens = useMemo(() => tokensText.trim().split(/\s+/).filter(Boolean).slice(0, 10), [tokensText]);
  const safeTokens = tokens.length ? tokens : ['Filinta'];
  const attention = useMemo(
    () =>
      safeTokens.map((_, i) => {
        const r = safeTokens.map((__, j) => {
          const v = rand((i + 1) * 18 + (j + 1) * 71 + attentionHead * 117 + layer * 9);
          return v * v + (i === j ? 0.36 : 0) + (j < i ? 0.12 : 0.02);
        });
        const sum = r.reduce((a, b) => a + b, 0);
        return r.map((v) => v / sum);
      }),
    [tokensText, attentionHead, layer, config.heads]
  );
  const selectedAttention = attention[Math.min(selectedToken, attention.length - 1)];

  const copyConfig = async () => {
    const data = { label: 'FILINTA AI · FRONTEND DEMO', preset, config, precision, training: { step, lr, batch, optimizer } };
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setToast('Yapılandırma kopyalandı');
    } catch {
      setToast('Kopyalama kullanılamıyor');
    }
  };
  const copyPageSummary = async () => {
    const row = [
      `Sayfa: ${ALL.find((item) => item.id === page)?.name || ''}`,
      `Preset: ${preset}`,
      `Katman: ${config.layers}`,
      `Hidden: ${config.hidden}`,
      `Head: ${config.heads}`,
      `Precision: ${precision}`
    ].join(' | ');
    try {
      await navigator.clipboard.writeText(row);
      setToast('Sayfa özeti kopyalandı');
    } catch {
      setToast('Kopyalama kullanılamıyor');
    }
  };
  const downloadWeights = () => {
    const text = JSON.stringify({ type: 'SYNTHETIC_SAMPLE', layer: layer + 1, tensor: TENSORS[tensor], precision, values: weights }, null, 2);
    const a = document.createElement('a');
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    a.href = url;
    a.download = 'filinta-demo-weights.json';
    a.click();
    URL.revokeObjectURL(url);
    setToast('Örnek JSON indirildi');
  };
  const generate = () => {
    if (!prompt.trim()) return;
    setOutput('');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const style = temperature > 1 ? 'yaratıcı' : temperature < 0.5 ? 'kontrollü' : 'dengeli';
      setOutput(
        `Örnek yanıt (${style} üretim)\n\n` +
          `İstek: ${prompt.trim()}\n` +
          `Yapı: ${config.layers} katman · ${config.hidden} hidden · ${config.heads} head\n` +
          `Çözümleme: T=${temperature.toFixed(2)} · Top-P=${topP.toFixed(2)} · Top-K=${topK} · Max=${maxTokens}\n\n` +
          `Bu panel yalnızca arayüz davranışı gösterir. Sonuç sentetiktir ve tarayıcı içinde üretilir.`
      );
    }, 260);
  };
  const applyOptimizerProfile = (profile) => {
    if (profile === 'stable') {
      setOptimizer('AdamW');
      setLr(0.0003);
      setBatch(32);
      setToast('Dengeli optimizer profili yüklendi');
    }
    if (profile === 'fast') {
      setOptimizer('RMSprop');
      setLr(0.0008);
      setBatch(64);
      setToast('Hızlı profil yüklendi');
    }
    if (profile === 'lean') {
      setOptimizer('SGD');
      setLr(0.0002);
      setBatch(16);
      setToast('Hafif profil yüklendi');
    }
  };
  const applyDecodingPreset = (profile) => {
    if (profile === 'balanced') {
      setTemperature(0.7); setTopP(0.9); setTopK(40); setMaxTokens(64); setToast('Dengeli çözümleme seçildi');
    }
    if (profile === 'strict') {
      setTemperature(0.35); setTopP(0.72); setTopK(24); setMaxTokens(48); setToast('Kontrollü çözümleme seçildi');
    }
    if (profile === 'creative') {
      setTemperature(1.1); setTopP(0.96); setTopK(64); setMaxTokens(96); setToast('Yaratıcı çözümleme seçildi');
    }
  };
  const useTextSample = (sample) => {
    setTokensText(sample);
    setSelectedToken(0);
    setToast('Örnek metin yüklendi');
  };
  const syncTokensToPrompt = () => {
    setPrompt(safeTokens.join(' '));
    navigate('inference');
    setToast('Metin çıktı ekranına aktarıldı');
  };

  const progress = clamp((step / 1500) * 100, 0, 100);
  const mainCards = [
    { id: 'model', label: 'Model', caption: 'Mimariyi düzenle', icon: Settings2 },
    { id: 'topology', label: 'Topoloji', caption: 'Ağı incele', icon: Network },
    { id: 'matrix', label: 'Ağırlıklar', caption: 'Matrisi görüntüle', icon: Grid2X2 },
    { id: 'training', label: 'Eğitim', caption: 'Grafiği çalıştır', icon: Activity },
    { id: 'memory', label: 'Bellek', caption: 'Profili hesapla', icon: HardDrive },
    { id: 'inference', label: 'Çıktı', caption: 'Simülasyonu aç', icon: Terminal }
  ];

  const renderPageBody = () => {
    switch (page) {
      case 'overview':
        return (
          <>
            <div className="welcome">
              <div>
                <h2>Filinta AI<br /><em>kontrol paneli</em></h2>
                <p>Alanlar ayrı sayfalarda ve daha kısa bloklarla düzenlendi.</p>
                <div className="welcome-actions">
                  <Button variant="primary" onClick={() => navigate('model')}>Model ayarları <ArrowRight size={17} /></Button>
                  <Button onClick={() => navigate('training')}>Eğitim ekranı <ArrowRight size={17} /></Button>
                </div>
              </div>
              <div className="welcome-art" aria-hidden="true">
                <span className="art-orb orb-a" />
                <span className="art-orb orb-b" />
                <div className="art-grid">{Array.from({ length: 36 }, (_, i) => <i key={i} style={{ opacity: 0.16 + rand(i * 7) * 0.77 }} />)}</div>
              </div>
            </div>
            <div className="headline-row">
              <h2>Bölümler</h2>
              <span>{ALL.length} sayfa</span>
            </div>
            <div className="entry-grid">
              {mainCards.map((item) => (
                <button key={item.id} className="entry-card" onClick={() => navigate(item.id)}>
                  <span className="entry-icon"><item.icon size={22} /></span>
                  <span className="entry-copy"><strong>{item.label}</strong><small>{item.caption}</small></span>
                  <ArrowRight size={17} />
                </button>
              ))}
            </div>
            <div className="overview-meta">
              <span><CircleDot size={14} /> Ayrı çalışma alanları</span>
              <span><ShieldCheck size={14} /> Bağımsız frontend</span>
              <span><Layers3 size={14} /> Hızlı sayfa geçişi</span>
            </div>
          </>
        );
      case 'model':
        return (
          <div className="layout-two">
            <Card title="Model seçimi">
              <div className="preset-grid">
                {Object.entries(PRESETS).map(([name, values]) => (
                  <button key={name} className={`preset ${preset === name ? 'active' : ''}`} onClick={() => changePreset(name)}>
                    <span>{name}</span>
                    <strong>{values.layers}L · {values.hidden}H · {values.heads} head</strong>
                    <small>{fmtParams(countParams(values))}</small>
                  </button>
                ))}
              </div>
              <div className="card-sep" />
              <div className="field-grid">
                <Field label="Katman" value={config.layers} min={2} max={36} onChange={(v) => updateConfig('layers', v)} />
                <Field label="Hidden size" value={config.hidden} min={128} max={2048} step={128} onChange={(v) => updateConfig('hidden', v)} />
                <Field label="Head" value={config.heads} min={2} max={32} onChange={(v) => updateConfig('heads', v)} />
                <Field label="Context" value={config.context} min={512} max={16384} step={512} onChange={(v) => updateConfig('context', v)} display={fmt(config.context)} />
              </div>
            </Card>
            <div className="stack">
              <Card title="Model özeti">
                <SparkValue value={fmtParams(params)} subtitle="Yaklaşık parametre" />
                <div className="info-row"><span>Mimari</span><b>Decoder-only</b></div>
                <div className="info-row"><span>Preset</span><b>{preset}</b></div>
                <div className="info-row"><span>Hassasiyet</span><b>{precision}</b></div>
              </Card>
              <div className="action-stack">
                <Button onClick={copyConfig}><FileJson size={16} /> Yapılandırmayı kopyala</Button>
                <Button variant="primary" onClick={() => navigate('topology')}>Topolojiye geç <ArrowRight size={16} /></Button>
              </div>
            </div>
          </div>
        );
      case 'topology':
        return (
          <div className="stack">
            <Card title="Sinir ağı" action={<span className="tag">Katman {layer + 1}</span>}>
              <NetworkGraphic layer={layer} tensor={tensor} step={step} onSelect={setGraphNeuron} />
              <div className="under-visual"><span>{graphNeuron ? `Nöron ${graphNeuron.c + 1}.${graphNeuron.i + 1}` : 'Bir düğüm seç'}</span><span>{tensor + 1}. tensör görünümü</span></div>
            </Card>
            <div className="compact-row">
              <Card title="Katman seç">
                <div className="stepper">
                  <Button onClick={() => setLayer((v) => Math.max(0, v - 1))} disabled={!layer}><ChevronLeft size={18} /></Button>
                  <strong>{layer + 1} / {config.layers}</strong>
                  <Button onClick={() => setLayer((v) => Math.min(config.layers - 1, v + 1))} disabled={layer === config.layers - 1}><ChevronRight size={18} /></Button>
                </div>
              </Card>
              <Card title="Aksiyonlar">
                <div className="action-stack compact">
                  <Button onClick={() => { setGraphNeuron(null); setStep((s) => s + 5); setToast('Ağ görünümü yenilendi'); }}><RotateCcw size={16} /> Yenile</Button>
                  <Button variant="primary" onClick={() => navigate('flow')}>Akışa geç <ArrowRight size={16} /></Button>
                </div>
              </Card>
            </div>
          </div>
        );
      case 'layers':
        return (
          <div className="layout-two">
            <Card title="Katman seçimi">
              <div className="layer-grid">
                {Array.from({ length: config.layers }, (_, i) => (
                  <button className={i === layer ? 'active' : ''} key={i} onClick={() => setLayer(i)}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <i style={{ height: `${18 + rand(i * 11 + 3) * 70}%` }} />
                  </button>
                ))}
              </div>
            </Card>
            <Card title={`Katman ${layer + 1}`}>
              <div className="layer-detail">
                <div><span className="layer-detail-icon"><Focus size={26} /></span><strong>Self-Attention</strong></div>
                <MoveRight size={18} />
                <div><span className="layer-detail-icon"><Zap size={26} /></span><strong>Feed Forward</strong></div>
              </div>
              <div className="info-row"><span>Boyut</span><b>{config.hidden}</b></div>
              <div className="info-row"><span>Başlık</span><b>{config.heads}</b></div>
              <Button variant="primary" onClick={() => navigate('attention')}>Attention'a geç <ArrowRight size={15} /></Button>
            </Card>
          </div>
        );
      case 'flow': {
        const stages = [
          { name: 'Girdi', icon: Code2, description: 'Token dizisi hazırlanır.' },
          { name: 'Embedding', icon: Boxes, description: 'Sayısal temsile çevrilir.' },
          { name: 'Attention', icon: Focus, description: 'Bağlam ilişkileri hesaplanır.' },
          { name: 'Feed Forward', icon: Zap, description: 'Vektörler dönüştürülür.' },
          { name: 'Çıktı', icon: Terminal, description: 'Yeni token olasılığı üretilir.' }
        ];
        const chosen = stages[pipelineStep];
        const Ic = chosen.icon;
        return (
          <div className="stack">
            <Card title="İşlem hattı">
              <div className="pipeline">
                {stages.map((s, i) => (
                  <React.Fragment key={s.name}>
                    <button onClick={() => setPipelineStep(i)} className={`pipeline-step ${pipelineStep === i ? 'active' : ''}`}>
                      <s.icon size={23} />
                      <span>{s.name}</span>
                    </button>
                    {i < stages.length - 1 && <ArrowRight className="flow-arrow" size={18} />}
                  </React.Fragment>
                ))}
              </div>
            </Card>
            <Card title="Seçili işlem" action={<Button onClick={() => setPipelineStep((v) => (v + 1) % stages.length)}>Sonraki <ChevronRight size={15} /></Button>}>
              <div className="chosen-stage">
                <span className="chosen-stage-icon"><Ic size={26} /></span>
                <div><strong>{chosen.name}</strong><p>{chosen.description}</p></div>
                <span className="stage-index">{pipelineStep + 1} / 5</span>
              </div>
            </Card>
          </div>
        );
      }
      case 'attention':
        return (
          <div className="layout-two dominant">
            <Card title="Token ilişkileri" action={<span className="tag">H{attentionHead + 1}</span>}>
              <label className="text-input-label">Girdi metni
                <input value={tokensText} maxLength={100} onChange={(e) => { setTokensText(e.target.value); setSelectedToken(0); }} />
              </label>
              <div className="sample-actions">
                <Button onClick={() => useTextSample('Müşteri destek kayıtları öncelik sırası')}>Örnek 1</Button>
                <Button onClick={() => useTextSample('Satış fırsat kümesi risk analizi')}>Örnek 2</Button>
              </div>
              <div className="att-grid" style={{ gridTemplateColumns: `68px repeat(${safeTokens.length},minmax(0,1fr))` }}>
                <span />
                {safeTokens.map((tok, i) => <span className="token-col" key={i} title={tok}>{tok.slice(0, 6)}</span>)}
                {attention.flatMap((row, i) => [
                  <button key={`r-${i}`} className={`row-name ${selectedToken === i ? 'active' : ''}`} onClick={() => setSelectedToken(i)}>{safeTokens[i].slice(0, 8)}</button>,
                  ...row.map((v, j) => (
                    <button key={`${i}-${j}`} onClick={() => setSelectedToken(i)} style={{ background: `rgba(120,196,163,${0.11 + clamp(v * 2.7, 0, 0.82)})` }} className={`att-cell ${selectedToken === i ? 'focus' : ''}`} title={`${(v * 100).toFixed(1)}%`}>
                      {safeTokens.length <= 5 ? Math.round(v * 100) : ''}
                    </button>
                  ))
                ])}
              </div>
            </Card>
            <Card title="Seçili token" action={<Button onClick={syncTokensToPrompt}>Çıktıya aktar <ArrowRight size={15} /></Button>}>
              <SparkValue value={safeTokens[Math.min(selectedToken, safeTokens.length - 1)]} subtitle="İlgilenilen token" />
              <div className="token-bars">
                {selectedAttention.map((v, i) => (
                  <div key={i}>
                    <span>{safeTokens[i].slice(0, 10)}</span>
                    <div className="bar-rail"><i style={{ width: `${v * 100}%` }} /></div>
                    <b>{Math.round(v * 100)}%</b>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      case 'heads':
        return (
          <div className="layout-two">
            <Card title="Başlık seç">
              <div className="heads-grid">
                {Array.from({ length: config.heads }, (_, i) => (
                  <button key={i} onClick={() => setAttentionHead(i)} className={attentionHead === i ? 'active' : ''}>
                    <span>H{String(i + 1).padStart(2, '0')}</span>
                    <MiniBars count={5} seed={i * 5} />
                  </button>
                ))}
              </div>
            </Card>
            <Card title={`Başlık H${attentionHead + 1}`}>
              <div className="head-feature"><BrainCircuit size={42} /><strong>{config.hidden / config.heads < 1 ? '—' : (config.hidden / config.heads).toFixed(0)}</strong><span>Yaklaşık boyut / başlık</span></div>
              <div className="info-row"><span>Başlık sayısı</span><b>{config.heads}</b></div>
              <Button variant="primary" onClick={() => navigate('attention')}>Matrisi aç <ArrowRight size={16} /></Button>
            </Card>
          </div>
        );
      case 'matrix':
        return (
          <div className="layout-two dominant">
            <Card title="Tensör görünümü" action={<Button onClick={downloadWeights} title="Örnek JSON indir"><Download size={16} /></Button>}>
              <div className="matrix-toolbar">
                <div className="pills">
                  {TENSORS.map((name, i) => <button key={name} className={tensor === i ? 'active' : ''} onClick={() => setTensor(i)}>{name}</button>)}
                </div>
                <div className="pills small">
                  <button className={matrixMode === 'Signed' ? 'active' : ''} onClick={() => setMatrixMode('Signed')}>İşaret</button>
                  <button className={matrixMode === 'Magnitude' ? 'active' : ''} onClick={() => setMatrixMode('Magnitude')}>Mutlak</button>
                </div>
              </div>
              <Matrix values={weights} selected={cell} onSelect={setCell} mode={matrixMode} />
            </Card>
            <div className="stack">
              <Card title="Seçili ağırlık">
                <SparkValue value={weights[cell.i]?.[cell.j]?.toFixed(4) ?? '—'} subtitle={`[${cell.i}, ${cell.j}] · L${layer + 1} · ${TENSORS[tensor]}`} />
                <div className="info-row"><span>Hassasiyet</span><b>{precision}</b></div>
                <div className="info-row"><span>Matris</span><b>{matrixSize} × {matrixSize}</b></div>
              </Card>
              <Card title="Boyut">
                <div className="choice-row">
                  {[12, 16, 20, 24].map((n) => <button key={n} className={matrixSize === n ? 'active' : ''} onClick={() => { setMatrixSize(n); setCell({ i: 0, j: 0 }); }}>{n}×{n}</button>)}
                </div>
              </Card>
            </div>
          </div>
        );
      case 'distribution':
        return (
          <div className="layout-two dominant">
            <Card title="Ağırlık histogramı" action={<Button onClick={() => { setTensor((t) => (t + 1) % TENSORS.length); setToast('Tensör değiştirildi'); }}>Tensör değiştir <ArrowRight size={15} /></Button>}>
              <div className="histogram">{hist.map((n, i) => <div key={i}><i className={i < 12 ? 'blue' : ''} style={{ height: `${Math.max(3, (n / maxHist) * 100)}%` }} /></div>)}</div>
              <div className="hist-axis"><span>−1.0</span><span>0</span><span>+1.0</span></div>
            </Card>
            <Card title="İstatistikler">
              <div className="stat-block-grid">
                <div><span>Ortalama</span><b>{average.toFixed(4)}</b></div>
                <div><span>Standart sapma</span><b>{stdev.toFixed(4)}</b></div>
                <div><span>Seyreklik</span><b>{sparse.toFixed(1)}%</b></div>
                <div><span>Örnek sayısı</span><b>{flat.length}</b></div>
              </div>
            </Card>
          </div>
        );
      case 'quantization':
        return (
          <div className="layout-two">
            <Card title="Hassasiyet seçimi">
              <div className="precision-grid">
                {Object.keys(PRECISION_BYTES).map((p) => (
                  <button key={p} onClick={() => setPrecision(p)} className={precision === p ? 'active' : ''}>
                    <span>{p}</span>
                    <strong>{fmtSize(params * PRECISION_BYTES[p])}</strong>
                    <div className="prec-track"><i style={{ width: `${PRECISION_BYTES[p] * 25}%` }} /></div>
                  </button>
                ))}
              </div>
            </Card>
            <Card title="Depolama">
              <SparkValue value={fmtSize(storage)} subtitle={`${precision} model ağırlıkları`} />
              <div className="info-row"><span>FP32'ye göre</span><b>%{Math.round((1 - PRECISION_BYTES[precision] / 4) * 100)} daha az</b></div>
              <div className="info-row"><span>Parametre</span><b>{fmtParams(params)}</b></div>
              <Button variant="primary" onClick={() => navigate('memory')}>Belleği aç <ArrowRight size={15} /></Button>
            </Card>
          </div>
        );
      case 'training':
        return (
          <div className="stack">
            <div className="train-stats">
              <Metric name="Kayıp" value={lossAt(step, lr, batch, optimizer).toFixed(3)} note="Anlık" icon={Waves} />
              <Metric name="Doğruluk" value={`${accAt(step, batch, optimizer).toFixed(1)}%`} note="Anlık" icon={Gauge} />
              <Metric name="Adım" value={fmt(step)} note="Simülasyon" icon={Activity} />
            </div>
            <Card title="Eğitim grafiği" action={<div className="chart-keys"><span className="green">Kayıp</span><span className="blue">Doğruluk</span></div>}>
              <Chart history={history} lr={lr} batch={batch} optimizer={optimizer} />
              <div className="progress-line"><span>İlerleme</span><b>{Math.round(progress)}%</b></div>
              <div className="progress-rail"><i style={{ width: `${progress}%` }} /></div>
              <div className="train-actions">
                <Button variant="primary" onClick={() => setRunning((v) => !v)}>{running ? <Pause size={17} /> : <Play size={17} />} {running ? 'Durdur' : 'Başlat'}</Button>
                <Button onClick={() => setStep((s) => s + 8)}><Plus size={17} /> 8 adım</Button>
                <Button onClick={resetTraining}><RotateCcw size={17} /> Sıfırla</Button>
              </div>
            </Card>
          </div>
        );
      case 'optimizer':
        return (
          <div className="layout-two">
            <Card title="Hiperparametreler">
              <div className="field-stack">
                <Field label="Learning rate" value={lr} min={0.0001} max={0.003} step={0.0001} display={lr.toFixed(4)} onChange={setLr} />
                <Field label="Batch size" value={batch} min={8} max={128} step={8} onChange={setBatch} />
                <SelectField label="Optimizer" value={optimizer} options={['AdamW', 'SGD', 'RMSprop', 'Adagrad']} onChange={setOptimizer} />
              </div>
              <div className="sample-actions">
                <Button onClick={() => applyOptimizerProfile('stable')}>Dengeli</Button>
                <Button onClick={() => applyOptimizerProfile('fast')}>Hızlı</Button>
                <Button onClick={() => applyOptimizerProfile('lean')}>Hafif</Button>
              </div>
            </Card>
            <Card title="Güncel ayarlar">
              <div className="optimizer-emblem"><SlidersHorizontal size={34} /><strong>{optimizer}</strong></div>
              <div className="info-row"><span>Learning rate</span><b>{lr.toFixed(4)}</b></div>
              <div className="info-row"><span>Batch size</span><b>{batch}</b></div>
              <Button variant="primary" onClick={() => navigate('training')}>Eğitime geç <ArrowRight size={16} /></Button>
            </Card>
          </div>
        );
      case 'gradients':
        return (
          <div className="stack">
            <Card title="Katman gradyanları">
              <div className="grad-chart">
                {Array.from({ length: config.layers }, (_, i) => {
                  const h = 0.22 + 0.72 * rand(i * 9 + step * 0.01) * Math.exp(-i * 0.025);
                  return (
                    <button className={i === layer ? 'active' : ''} key={i} onClick={() => setLayer(i)} title={`Katman ${i + 1}: ${h.toFixed(3)}`}>
                      <i style={{ height: `${h * 100}%` }} />
                      <span>{i + 1}</span>
                    </button>
                  );
                })}
              </div>
              <div className="under-visual"><span>Giriş</span><span>Çıkış</span></div>
            </Card>
            <div className="compact-row">
              <Card title="Seçili katman"><SparkValue value={`L${layer + 1}`} subtitle="İncelenen katman" /></Card>
              <Card title="Eğitim durumu"><SparkValue value={fmt(step)} subtitle="Güncel adım" /></Card>
            </div>
          </div>
        );
      case 'memory':
        return (
          <div className="stack">
            <div className="train-stats">
              <Metric name="Model" value={fmtSize(storage)} note={precision} icon={Database} />
              <Metric name="KV cache" value={fmtSize(kvCache)} note={`${fmt(config.context)} token`} icon={HardDrive} />
              <Metric name="Aktivasyon" value={fmtSize(activation)} note="Yaklaşık" icon={Layers3} />
            </div>
            <Card title="Bellek dağılımı" action={<Button onClick={() => navigate('compute')}>Hesaplama profili <ArrowRight size={15} /></Button>}>
              <div className="memory-bars">
                {[
                  { label: 'Ağırlıklar', value: storage },
                  { label: 'KV cache', value: kvCache },
                  { label: 'Aktivasyon', value: activation }
                ].map((r, i) => (
                  <div key={r.label}>
                    <span>{r.label}</span>
                    <div className="bar-rail"><i style={{ width: `${Math.max(1, (r.value / Math.max(storage, kvCache, activation)) * 100)}%` }} className={i === 1 ? 'blue' : i === 2 ? 'neutral' : ''} /></div>
                    <b>{fmtSize(r.value)}</b>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      case 'compute':
        return (
          <div className="layout-two">
            <Card title="İşlem tahmini">
              <div className="compute-show"><span><Cpu size={38} /></span><strong>{(flopsPerToken / 1e9).toFixed(2)} G</strong><small>FLOPs / token · teorik</small></div>
            </Card>
            <Card title="Model boyutları">
              <div className="info-row"><span>Katman</span><b>{config.layers}</b></div>
              <div className="info-row"><span>Gizli boyut</span><b>{config.hidden}</b></div>
              <div className="info-row"><span>Başlık</span><b>{config.heads}</b></div>
              <div className="info-row"><span>Bağlam</span><b>{fmt(config.context)}</b></div>
              <Button variant="primary" onClick={() => navigate('quantization')}>Kuantizasyona git <ArrowRight size={15} /></Button>
            </Card>
          </div>
        );
      case 'tokens':
        return (
          <div className="stack">
            <Card title="Girdi">
              <label className="text-input-label">Metin<input value={tokensText} maxLength={100} onChange={(e) => setTokensText(e.target.value)} /></label>
              <div className="sample-actions">
                <Button onClick={() => useTextSample('Operasyon verisi giriş kuyruğu')}>Örnek 1</Button>
                <Button onClick={() => useTextSample('Satış fırsat sıralama akışı')}>Örnek 2</Button>
                <Button onClick={() => useTextSample('Stok güncelleme karar motoru')}>Örnek 3</Button>
              </div>
              <div className="tokens-stage">
                {safeTokens.map((t, i) => (
                  <button key={i} className={selectedToken === i ? 'active' : ''} onClick={() => setSelectedToken(i)}>
                    <small>{String(i + 1).padStart(2, '0')}</small>
                    <strong>{t}</strong>
                  </button>
                ))}
              </div>
              <div className="under-visual"><span>{safeTokens.length} parça</span><span>Maksimum 10 parça</span></div>
            </Card>
            <div className="compact-row">
              <Card title="Seçili parça"><SparkValue value={safeTokens[Math.min(selectedToken, safeTokens.length - 1)]} subtitle="Aktif token" /></Card>
              <Card title="Aksiyon"><Button variant="primary" onClick={syncTokensToPrompt}>Çıktıya aktar <ArrowRight size={15} /></Button></Card>
            </div>
          </div>
        );
      case 'inference':
        return (
          <div className="layout-two dominant">
            <Card title="Girdi / çıktı">
              <label className="text-input-label">Prompt<textarea rows="5" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Bir metin yaz…" /></label>
              <div className="sample-actions">
                <Button onClick={() => setPrompt('Müşteri destek kayıtlarından kısa durum özeti üret.')}>Örnek prompt</Button>
                <Button onClick={() => setPrompt('Satış ve operasyon verisini tek paragrafta özetle.')}>İş promptu</Button>
              </div>
              <div className="output-top"><span>Örnek çıktı</span><span className="tag">Demo</span></div>
              <div className="output-pane">{output || <span className="muted">Çıktı burada görünecek.</span>}</div>
              <div className="action-right">
                <Button onClick={() => setOutput('')}><RotateCcw size={16} /> Temizle</Button>
                <Button onClick={() => navigate('decoding')}><SlidersHorizontal size={16} /> Parametreler</Button>
                <Button variant="primary" onClick={generate} disabled={!prompt.trim()}><Play size={16} /> Çalıştır</Button>
              </div>
            </Card>
            <Card title="Durum">
              <div className="offline-large"><ShieldCheck size={30} /><strong>Bağımsız arayüz</strong><p>İşlem yalnızca tarayıcı içinde örneklenir.</p></div>
              <div className="info-row"><span>Model çağrısı</span><b>Yok</b></div>
              <div className="info-row"><span>API / sunucu</span><b>Yok</b></div>
              <div className="info-row"><span>Aktif çözümleme</span><b>T {temperature.toFixed(2)}</b></div>
            </Card>
          </div>
        );
      case 'decoding':
        return (
          <div className="layout-two">
            <Card title="Üretim parametreleri">
              <div className="field-stack">
                <Field label="Temperature" value={temperature} min={0} max={2} step={0.05} display={temperature.toFixed(2)} onChange={setTemperature} />
                <Field label="Top-P" value={topP} min={0.1} max={1} step={0.05} display={topP.toFixed(2)} onChange={setTopP} />
                <Field label="Top-K" value={topK} min={1} max={100} onChange={setTopK} />
                <Field label="Maksimum token" value={maxTokens} min={8} max={128} step={8} onChange={setMaxTokens} />
              </div>
              <div className="sample-actions">
                <Button onClick={() => applyDecodingPreset('balanced')}>Dengeli</Button>
                <Button onClick={() => applyDecodingPreset('strict')}>Kontrollü</Button>
                <Button onClick={() => applyDecodingPreset('creative')}>Yaratıcı</Button>
              </div>
            </Card>
            <Card title="Yapılandırma">
              <SparkValue value={temperature.toFixed(2)} subtitle="Temperature" />
              <div className="info-row"><span>Top-P</span><b>{topP.toFixed(2)}</b></div>
              <div className="info-row"><span>Top-K</span><b>{topK}</b></div>
              <div className="info-row"><span>Token sınırı</span><b>{maxTokens}</b></div>
              <Button onClick={() => applyDecodingPreset('balanced')}><RotateCcw size={15} /> Varsayılana dön</Button>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-root">
      <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
        <div className="brand-area minimal">
          <strong>FILINTA AI</strong>
          <button className="mobile-close" onClick={() => setMobileMenu(false)} aria-label="Menüyü kapat"><X size={19} /></button>
        </div>
        <nav className="sidebar-nav" aria-label="Ana menü">
          {GROUPS.map((group, groupIndex) => (
            <div className="nav-group" key={groupIndex}>
              {group.items.map((item) => (
                <button type="button" key={item.id} className={`nav-link ${page === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}>
                  <item.icon size={17} strokeWidth={1.9} />
                  <span>{item.name}</span>
                  {page === item.id && <i />}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>
      {mobileMenu && <button className="mobile-overlay" onClick={() => setMobileMenu(false)} aria-label="Menüyü kapat" />}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-toggle" onClick={() => setMobileMenu(true)} aria-label="Menüyü aç"><Menu size={21} /></button>
            <span className="bread-root">FILINTA AI</span>
            <ChevronRight size={15} />
            <strong>{ALL.find((i) => i.id === page)?.name || 'Genel bakış'}</strong>
          </div>
          <div className="topbar-right">
            <span className="page-count">{currentIndex + 1} / {PAGE_ORDER.length}</span>
            <span className="header-avatar">F</span>
          </div>
        </header>

        <div className="page-shell">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><span />{meta[page][0]}</div>
              <h1>{meta[page][1]}</h1>
            </div>
            <div className="heading-actions toolbar-actions">
              <Button onClick={prevPage}><ChevronLeft size={16} /> Önceki</Button>
              <Button onClick={nextPage}>Sonraki <ChevronRight size={16} /></Button>
              <Button variant="primary" onClick={copyPageSummary}><FileJson size={16} /> Özet</Button>
            </div>
          </div>

          {renderPageBody()}

          <footer className="main-footer compact">
            <span>FILINTA AI</span>
            <span>{PAGE_ORDER.length} sayfalık arayüz</span>
          </footer>
        </div>
      </main>
      {toast && <div role="status" className="toast"><Check size={16} />{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
