import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle,
  Clock,
  Compass,
  Cpu,
  Database,
  DollarSign,
  Droplet,
  Eye,
  Flame,
  Gauge,
  Heart,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Shield,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';
import { apiFetch } from '../api';
import { toast } from 'react-hot-toast';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function PredictiveGovernanceHub() {
  const [activeSubTab, setActiveSubTab] = useState<'twin' | 'budget' | 'simulation' | 'bulletins' | 'search'>('twin');

  // Loaders
  const [loadingTwin, setLoadingTwin] = useState(true);
  const [loadingBudget, setLoadingBudget] = useState(true);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [loadingBriefing, setLoadingBriefing] = useState(true);

  // States
  const [twinData, setTwinData] = useState<any>(null);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [communityData, setCommunityData] = useState<any>(null);
  const [briefingData, setBriefingData] = useState<any>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  // Simulation state
  const [simScenario, setSimScenario] = useState('What happens if repair on Sector 4 main water pipe is delayed by two weeks?');
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  // Digital Twin state layer toggle
  const [activeLayers, setActiveLayers] = useState({
    roads: true,
    water: true,
    electricity: true,
    hospitals: true,
    schools: true,
    density: true
  });

  // Heatmap focus selection
  const [heatmapFocus, setHeatmapFocus] = useState<'road_failure' | 'garbage' | 'leakage' | 'streetlight' | 'traffic' | 'emergency'>('road_failure');

  // Fetch twin health, maintenance, emergencies
  const fetchTwinData = async () => {
    setLoadingTwin(true);
    try {
      const res = await apiFetch('/api/predictive/twin');
      if (res.ok) {
        const data = await res.json();
        setTwinData(data);
      } else {
        toast.error('Failed to load real-time Digital Twin telemetry.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTwin(false);
    }
  };

  // Fetch Budget
  const fetchBudgetData = async () => {
    setLoadingBudget(true);
    try {
      const res = await apiFetch('/api/predictive/budget');
      if (res.ok) {
        const data = await res.json();
        setBudgetData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBudget(false);
    }
  };

  // Fetch Community
  const fetchCommunityData = async () => {
    setLoadingCommunity(true);
    try {
      const res = await apiFetch('/api/predictive/community');
      if (res.ok) {
        const data = await res.json();
        setCommunityData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCommunity(false);
    }
  };

  // Fetch Briefing
  const fetchBriefingData = async () => {
    setLoadingBriefing(true);
    try {
      const res = await apiFetch('/api/predictive/briefing');
      if (res.ok) {
        const data = await res.json();
        setBriefingData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBriefing(false);
    }
  };

  // Initial fetches
  useEffect(() => {
    fetchTwinData();
    fetchBudgetData();
    fetchCommunityData();
    fetchBriefingData();
  }, []);

  // Run customized search
  const handleSemanticSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await apiFetch('/api/predictive/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
        toast.success('Cognitive search index synchronized.');
      } else {
        toast.error('Semantic query execution failed.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  // Run scenario simulation
  const handleDecisionSimulation = async (presetQuestion?: string) => {
    const questionToRun = presetQuestion || simScenario;
    if (!questionToRun.trim()) return;
    if (presetQuestion) setSimScenario(presetQuestion);
    setSimulating(true);
    try {
      const res = await apiFetch('/api/predictive/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionToRun })
      });
      if (res.ok) {
        const data = await res.json();
        setSimResult(data);
        toast.success('Municipal decision impact projected.');
      } else {
        toast.error('Downstream simulation failed.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  // Trigger initial simulation on load if none run
  useEffect(() => {
    if (!simResult && !simulating) {
      handleDecisionSimulation();
    }
  }, []);

  // Layer toggling helper
  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="space-y-8" id="predictive-governance-hub">
      {/* 1. Header Hero section */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-extrabold uppercase tracking-wider rounded-full">
            <Brain className="w-3.5 h-3.5" />
            Phase 5 Core Engine Active
          </div>
          <h2 className="text-xl font-black text-white">Predictive intelligence & Digital Twin</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            CityMind’s autonomous governance network correlates citizen complaints, historical repair cycles, and real-time sensor signals to predict infrastructure fail-states, optimize budgets, and project administrative decision impacts.
          </p>
        </div>

        <button
          onClick={() => {
            fetchTwinData();
            fetchBudgetData();
            fetchCommunityData();
            fetchBriefingData();
            toast.success('Syncing all cognitive node telemetry...');
          }}
          className="h-11 px-5 border border-slate-800 bg-slate-900 hover:bg-slate-800 active:bg-slate-900 text-slate-300 font-bold text-xs rounded-xl transition-all duration-150 flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          Synchronize Nodes
        </button>
      </div>

      {/* 2. Sub-tab Controller */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1 pb-px scrollbar-none" id="predictive-tabs">
        <button
          onClick={() => setActiveSubTab('twin')}
          className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSubTab === 'twin' ? 'border-amber-600 text-amber-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          Digital Twin & Health
        </button>
        <button
          onClick={() => setActiveSubTab('budget')}
          className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSubTab === 'budget' ? 'border-amber-600 text-amber-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Forecasts & Budget
        </button>
        <button
          onClick={() => setActiveSubTab('simulation')}
          className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSubTab === 'simulation' ? 'border-amber-600 text-amber-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          What-If Simulation Lab
        </button>
        <button
          onClick={() => setActiveSubTab('bulletins')}
          className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSubTab === 'bulletins' ? 'border-amber-600 text-amber-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          Strategic Bulletins
        </button>
        <button
          onClick={() => setActiveSubTab('search')}
          className={`px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer shrink-0 ${
            activeSubTab === 'search' ? 'border-amber-600 text-amber-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          Semantic Search Index
        </button>
      </div>

      {/* 3. Panel Content Display */}
      <AnimatePresence mode="wait">
        {/* TAB 1: Digital Twin & Health Scoreboard */}
        {activeSubTab === 'twin' && (
          <motion.div
            key="twin-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8"
          >
            {loadingTwin && !twinData ? (
              <div className="p-24 text-center bg-white border border-slate-100 rounded-3xl space-y-4 shadow-sm">
                <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-500 animate-pulse">Running synthetic Digital Twin correlation sweeps...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left 2 Columns: Vector Canvas Map Twin & Toggles */}
                <div className="xl:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-base font-black text-slate-900">Interactive AI Digital Twin</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">Simulated telemetry overlays on the city junction vector grids.</p>
                      </div>
                      
                      {/* Layer Toggle pills */}
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(activeLayers).map(([layerName, enabled]) => (
                          <button
                            key={layerName}
                            onClick={() => toggleLayer(layerName as any)}
                            className={`px-3 py-1.5 border font-extrabold text-[9px] uppercase rounded-full tracking-wider transition-all duration-100 cursor-pointer ${
                              enabled
                                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100 hover:text-slate-600'
                            }`}
                          >
                            {layerName}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Stylized Visual City Vector Grid */}
                    <div className="h-[400px] bg-slate-950 rounded-2xl relative border border-slate-900 overflow-hidden shadow-inner flex items-center justify-center">
                      {/* Grid background lines */}
                      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
                      
                      {/* Central Radar Sweep indicator */}
                      <div className="absolute w-[360px] h-[360px] border border-emerald-500/10 rounded-full animate-ping-slow" />
                      <div className="absolute w-[180px] h-[180px] border border-emerald-500/20 rounded-full" />
                      
                      {/* Vector Maps Paths (SVG) */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                        {/* Road Network (Feature 1) */}
                        {activeLayers.roads && (
                          <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3">
                            <line x1="10%" y1="20%" x2="90%" y2="80%" />
                            <line x1="90%" y1="10%" x2="10%" y2="90%" />
                            <line x1="50%" y1="0%" x2="50%" y2="100%" strokeWidth="3" />
                            <line x1="0%" y1="50%" x2="100%" y2="50%" strokeWidth="3" />
                            <circle cx="50%" cy="50%" r="20" fill="none" stroke="#fff" strokeWidth="1" />
                          </g>
                        )}

                        {/* Water Network (Feature 1) */}
                        {activeLayers.water && (
                          <g stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.6">
                            <path d="M 0,150 Q 250,50 500,150 T 1000,150" fill="none" strokeWidth="4" />
                            <path d="M 150,0 Q 250,250 150,500" fill="none" strokeWidth="3" />
                            <path d="M 750,0 Q 650,250 750,500" fill="none" strokeWidth="3" />
                          </g>
                        )}

                        {/* Electricity Grid (Feature 1) */}
                        {activeLayers.electricity && (
                          <g stroke="#f59e0b" strokeWidth="1.5" opacity="0.5">
                            <polyline points="50,50 120,150 250,150 350,300 500,280" fill="none" />
                            <polyline points="950,50 820,150 750,150 650,300 500,280" fill="none" />
                            <polyline points="500,500 500,280" fill="none" />
                          </g>
                        )}
                      </svg>

                      {/* Map Nodes / Pinpoints */}
                      <AnimatePresence>
                        {/* Hospitals (Feature 1) */}
                        {activeLayers.hospitals && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-[28%] left-[22%] p-2 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
                          >
                            <Heart className="w-3.5 h-3.5 fill-emerald-400" />
                            <span className="font-bold text-[8px] uppercase tracking-wider">Apex Hospital</span>
                          </motion.div>
                        )}

                        {/* Schools (Feature 1) */}
                        {activeLayers.schools && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute top-[70%] left-[68%] p-2 bg-indigo-500/10 border border-indigo-500 text-indigo-400 rounded-lg flex items-center gap-1.5 shadow-md shadow-indigo-950/40"
                          >
                            <Brain className="w-3.5 h-3.5" />
                            <span className="font-bold text-[8px] uppercase tracking-wider">Primary School S-11</span>
                          </motion.div>
                        )}

                        {/* Active reports density clusters (Feature 1) */}
                        {activeLayers.density && (
                          <>
                            {/* Sector 4 water main hazard cluster */}
                            <motion.div
                              animate={{ scale: [1, 1.12, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center cursor-pointer shadow-lg shadow-rose-950/50"
                              onClick={() => toast("Sector 4 Water Main Leakage: 8 Active Complaints correlated.")}
                            >
                              <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                              <span className="absolute bottom-1 bg-rose-600 text-white font-black text-[7px] px-1 rounded uppercase tracking-wider">Hotspot S-4</span>
                            </motion.div>

                            {/* Sector 11 electrical transformer grid */}
                            <motion.div
                              animate={{ scale: [1, 1.08, 1] }}
                              transition={{ repeat: Infinity, duration: 2.5 }}
                              className="absolute top-[35%] left-[75%] -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center cursor-pointer shadow-lg shadow-amber-950/50"
                              onClick={() => toast("Sector 11 Power Grid Overload: 5 transformer tickets active.")}
                            >
                              <Zap className="w-4 h-4 text-amber-400" />
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>

                      {/* Map Key overlay */}
                      <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-800 p-3 rounded-xl flex items-center gap-4 text-[9px] font-extrabold text-slate-300 uppercase tracking-widest backdrop-blur-md">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-0.5 bg-dashed bg-white block" />
                          <span>Road Network</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-0.5 bg-blue-500 block" />
                          <span>Water Network</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 bg-rose-500/30 border border-rose-500 rounded-full block" />
                          <span>Issue Density</span>
                        </div>
                      </div>

                      {/* Realtime Telemetry Status indicator */}
                      <div className="absolute top-4 right-4 bg-slate-900/95 border border-slate-800 p-2.5 rounded-xl flex items-center gap-2 backdrop-blur-md">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="font-bold text-[9px] text-emerald-400 uppercase tracking-wider">Grid Synced Real-time</span>
                      </div>
                    </div>

                    {/* Predictive Heatmap Filters & Explanation (Feature 2) */}
                    <div className="space-y-4 pt-3 border-t border-slate-100">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Predictive Risk Heatmaps</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Toggle ML model outputs to overlay risk density projections across neighborhood clusters.</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'road_failure', label: 'Road Failure Probability', icon: AlertTriangle, style: 'hover:border-red-200 hover:bg-red-50 text-red-600' },
                          { id: 'garbage', label: 'Garbage Accumulation', icon: Layers, style: 'hover:border-amber-200 hover:bg-amber-50 text-amber-600' },
                          { id: 'leakage', label: 'Water Leakage', icon: Droplet, style: 'hover:border-blue-200 hover:bg-blue-50 text-blue-600' },
                          { id: 'streetlight', label: 'Streetlight Failures', icon: Zap, style: 'hover:border-yellow-200 hover:bg-yellow-50 text-yellow-500' },
                          { id: 'traffic', label: 'Traffic Congestion', icon: Activity, style: 'hover:border-indigo-200 hover:bg-indigo-50 text-indigo-600' },
                          { id: 'emergency', label: 'Emergency Risks', icon: Flame, style: 'hover:border-orange-200 hover:bg-orange-50 text-orange-600' }
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => {
                              setHeatmapFocus(btn.id as any);
                              toast.success(`ML Filter switched to: ${btn.label}`);
                            }}
                            className={`px-4 py-2 border font-bold text-[10px] uppercase rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                              heatmapFocus === btn.id
                                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                                : `bg-white text-slate-500 border-slate-200 ${btn.style}`
                            }`}
                          >
                            <btn.icon className="w-3.5 h-3.5" />
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {/* Display active Heatmap explainable reason */}
                      <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-3 items-start">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-xs">
                            Active Model Forecast: {heatmapFocus === 'road_failure' ? 'Road Pavement Anomalies Model' : heatmapFocus === 'garbage' ? 'Waste Bin Overflow Rates' : heatmapFocus === 'leakage' ? 'Subsurface Hydraulic Stress Model' : heatmapFocus === 'streetlight' ? 'Luminance Depletion Rates' : heatmapFocus === 'traffic' ? 'Peak Flow Congestion Index' : 'Emergency Natural Disaster Warning'}
                          </p>
                          <p className="text-[10px] text-slate-500 leading-relaxed">
                            {heatmapFocus === 'road_failure'
                              ? 'Correlates heavy freighter vehicle movements along Sector 2 industrial corridor against concrete dampness logs. Identifies 82% risk of flyover expansion joint spalling within 25 days.'
                              : heatmapFocus === 'garbage'
                              ? 'Projects daily community trash generation rates against regional collection lag. Forecasts high trash accumulations near Sector 4 parks within 48 hours.'
                              : heatmapFocus === 'leakage'
                              ? 'Evaluates municipal joint pressure variances. Highlights Sector 4 and 9 sub-valves as primary high-pressure rupture risks.'
                              : heatmapFocus === 'streetlight'
                              ? 'Calculates structural wiring fatigue scores. Identifies a 70% risk of commercial market blackouts if transformer load is not rerouted.'
                              : heatmapFocus === 'traffic'
                              ? 'Projects office-commute bottlenecks based on the active closure of the Sector 4 underpass. Predicts average travel queues of 22 minutes.'
                              : 'Flags high hazard index for Sector 4 underpass due to heavy local rainfall spikes, indicating extreme water logging flooding risks.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: City Health Index & Scores (Feature 3) */}
                <div className="space-y-6">
                  {/* City Health scoreboard card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-base font-black text-slate-900">City Health Index</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Multidimensional smart city health metrics calculated by CityHealthAgent.</p>
                    </div>

                    {/* Overall Score Circle display */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Overall City Score</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-900">{twinData?.health?.overallScore ?? 78}</span>
                          <span className="text-xs font-black text-emerald-600 flex items-center gap-0.5">
                            <TrendingUp className="w-3.5 h-3.5" />
                            {twinData?.health?.overallTrend?.toUpperCase() ?? 'IMPROVING'}
                          </span>
                        </div>
                      </div>

                      {/* Health Indicator bar */}
                      <div className="w-24 h-24 relative flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="38" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            stroke="#f59e0b"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 38}
                            strokeDashoffset={2 * Math.PI * 38 * (1 - (twinData?.health?.overallScore ?? 78) / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-sm font-black text-slate-900">{twinData?.health?.overallScore ?? 78}%</span>
                          <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Health</p>
                        </div>
                      </div>
                    </div>

                    {/* Recharts Area Trend graph */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Score History Trend</p>
                      <div className="h-28">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={twinData?.health?.weeklyTrendHistory || [
                            { week: "Week 1", score: 72 },
                            { week: "Week 2", score: 74 },
                            { week: "Week 3", score: 78 }
                          ]}>
                            <defs>
                              <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="week" stroke="#94a3b8" fontSize={9} tickLine={false} />
                            <YAxis domain={[60, 90]} hide={true} />
                            <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '9px' }} />
                            <Area type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Domain Breakdown list */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      {[
                        { key: 'infrastructure', label: 'Infrastructure', color: 'bg-indigo-500' },
                        { key: 'traffic', label: 'Traffic Flow & Transit', color: 'bg-red-500' },
                        { key: 'cleanliness', label: 'Waste & Cleanliness', color: 'bg-emerald-500' },
                        { key: 'water', label: 'Water & Sanitation', color: 'bg-blue-500' },
                        { key: 'electricity', label: 'Electricity & Grid', color: 'bg-amber-500' },
                        { key: 'citizenSatisfaction', label: 'Citizen Satisfaction Index', color: 'bg-pink-500' },
                        { key: 'departmentEfficiency', label: 'Department SLA Efficiency', color: 'bg-cyan-500' }
                      ].map((domain) => {
                        const item = twinData?.health?.scores?.[domain.key] || { score: 70, trend: 'stable' };
                        return (
                          <div key={domain.key} className="space-y-1.5 text-xs">
                            <div className="flex justify-between items-center text-[10px]">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${domain.color}`} />
                                <span className="font-bold text-slate-700">{domain.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900">{item.score}%</span>
                                <span className={`font-bold uppercase text-[8px] ${item.trend === 'improving' ? 'text-emerald-600' : item.trend === 'declining' ? 'text-red-500' : 'text-slate-400'}`}>
                                  {item.trend === 'improving' ? '▲' : item.trend === 'declining' ? '▼' : '●'}
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${item.score}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: Predictive Maintenance & Budget */}
        {activeSubTab === 'budget' && (
          <motion.div
            key="budget-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8 text-xs"
          >
            {loadingBudget && !budgetData ? (
              <div className="p-24 text-center bg-white border border-slate-100 rounded-3xl space-y-4">
                <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-500 animate-pulse">Running ML failure forecasting & budget calculations...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Failure Forecast Cards (Explainable, Feature 4, Feature 12) */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Infrastructure Failure Projections</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Calculated by PredictiveMaintenanceAgent using Bayesian regression logs.</p>
                    </div>
                    <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-100 font-extrabold text-[10px] uppercase rounded-full tracking-wider">
                      {twinData?.maintenance?.predictions?.length ?? 3} Threatened Assets
                    </span>
                  </div>

                  <div className="space-y-6">
                    {(twinData?.maintenance?.predictions || []).map((pred: any, index: number) => (
                      <div key={index} className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 font-black text-[8px] uppercase tracking-wider rounded ${
                                pred.riskLevel === 'Extreme' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                              }`}>
                                {pred.riskLevel} Risk
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pred.category}</span>
                            </div>
                            <h4 className="font-extrabold text-slate-950 text-sm">{pred.infrastructureItem}</h4>
                          </div>

                          <div className="flex items-center gap-6 shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <div className="space-y-0.5">
                              <p className="text-[9px] text-slate-400 font-bold uppercase">Estimated Failure</p>
                              <p className="font-extrabold text-red-600 text-xs">{pred.expectedFailureDate}</p>
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[9px] text-slate-400 font-bold uppercase">Urgency</p>
                              <p className="font-extrabold text-slate-900 text-xs">{pred.repairUrgency}</p>
                            </div>
                          </div>
                        </div>

                        {/* Financial Impact Comparison */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Preventive Cost (Before)</p>
                            <p className="text-sm font-extrabold text-emerald-600 mt-0.5">{pred.financialImpact?.preventiveCost ?? '₹45,000'}</p>
                            <p className="text-[9px] text-slate-400 mt-1 leading-normal">Requires localized gasket coupling sleeve installation.</p>
                          </div>
                          <div className="border-l border-slate-200 pl-4">
                            <p className="text-[9px] text-slate-400 font-bold uppercase">Emergency Repair (After)</p>
                            <p className="text-sm font-extrabold text-red-600 mt-0.5">{pred.financialImpact?.failureCost ?? '₹3,50,000'}</p>
                            <p className="text-[9px] text-slate-400 mt-1 leading-normal">Requires complete trench rehabilitation and flood relief operations.</p>
                          </div>
                        </div>

                        {/* Explainable forecast detail block (Feature 12 - Confidence, reasoning, evidence, regions, impact, recommendation) */}
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-amber-600" />
                              ML Explanatory Analysis
                            </span>
                            <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 border border-emerald-100 text-[9px] rounded-full">
                              Confidence: {pred.explainableForecast?.confidence ?? 85}%
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed text-[10px]">
                            <div className="space-y-2">
                              <p className="text-slate-500 font-bold uppercase text-[8px] tracking-wider">AI Reasoning</p>
                              <p className="text-slate-700 font-medium">{pred.explainableForecast?.reasoning}</p>
                              
                              <p className="text-slate-500 font-bold uppercase text-[8px] tracking-wider pt-1">Historical Evidence</p>
                              <p className="text-slate-700 font-medium">{pred.explainableForecast?.historicalEvidence}</p>
                            </div>

                            <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-100 md:pl-4">
                              <p className="text-slate-500 font-bold uppercase text-[8px] tracking-wider">Affected Regions</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {(pred.explainableForecast?.affectedRegions || []).map((region: string, idx: number) => (
                                  <span key={idx} className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded text-[8px] uppercase tracking-wider">
                                    {region}
                                  </span>
                                ))}
                              </div>

                              <p className="text-slate-500 font-bold uppercase text-[8px] tracking-wider pt-1">Expected Impact</p>
                              <p className="text-slate-700 font-medium">{pred.explainableForecast?.expectedImpact}</p>
                            </div>
                          </div>

                          {/* Quick dispatch recommendation action */}
                          <div className="p-3 bg-slate-900 text-slate-300 rounded-xl flex items-center justify-between text-[10px] gap-4 font-bold">
                            <span className="flex items-center gap-1.5 text-white">
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              Recommended Action: {pred.explainableForecast?.recommendedAction ?? 'Dispatch inspection crew.'}
                            </span>
                            <button
                              onClick={() => {
                                toast.success("Preventive job dispatch ticket issued successfully!");
                              }}
                              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[9px] font-black uppercase transition-all duration-100 cursor-pointer"
                            >
                              Dispatch Crew
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Fiscal Budget Optimization Plan (Feature 5) */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Budget Allocation & ROI</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Recommended budget readjustments analyzed by BudgetOptimizationAgent.</p>
                    </div>

                    {/* Savings Highlight */}
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-center space-y-1">
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Expected Annual Savings</p>
                      <h4 className="text-2xl font-black text-emerald-600">{budgetData?.annualExpectedSavings ?? '₹9,50,000'}</h4>
                      <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">through preventative engineering shifts</p>
                    </div>

                    {/* Cost benefit index widget */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[10px]">
                      <p className="font-extrabold text-slate-800 uppercase tracking-wider">Cost-Benefit Analysis</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">Preventive Investment:</span>
                        <span className="font-extrabold text-slate-900">{budgetData?.costBenefitAnalysis?.preventiveInvestment ?? '₹3,45,000'}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-bold">Emergency Cost Prevented:</span>
                        <span className="font-extrabold text-slate-900">{budgetData?.costBenefitAnalysis?.emergencyRepairPrevention ?? '₹12,95,000'}</span>
                      </div>

                      <div className="h-px bg-slate-200 my-1" />

                      <div className="flex justify-between items-center font-black text-emerald-600">
                        <span>Net Value Created:</span>
                        <span>{budgetData?.costBenefitAnalysis?.netValueCreated ?? '₹9,50,000'}</span>
                      </div>
                    </div>

                    {/* Allocations breakdown */}
                    <div className="space-y-4">
                      <p className="font-extrabold text-slate-400 uppercase tracking-widest text-[9px]">Department Allocation Cuts</p>
                      
                      {(budgetData?.recommendedAllocations || []).map((alloc: any, idx: number) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center gap-4">
                          <div className="space-y-0.5">
                            <h5 className="font-black text-slate-900">{alloc.department}</h5>
                            <div className="flex items-center gap-2 text-[8px] text-slate-400 font-bold uppercase">
                              <span>Current: {alloc.currentSpending}</span>
                              <span>•</span>
                              <span className="text-emerald-600">Optimum: {alloc.optimizedAllocation}</span>
                            </div>
                          </div>

                          <div className="text-right space-y-0.5 shrink-0">
                            <p className="font-black text-emerald-600 text-xs">-{alloc.expectedSavings}</p>
                            <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[7px] px-1 rounded uppercase">
                              ROI: {alloc.roiRatio}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Explanatory insights */}
                    <div className="space-y-2 pt-4 border-t border-slate-100 text-[10px] leading-relaxed">
                      <p className="font-extrabold text-slate-400 uppercase tracking-widest text-[9px]">ML Strategic Justification</p>
                      <p className="text-slate-600 font-medium">{budgetData?.reasoning}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: AI Decision Simulator Lab */}
        {activeSubTab === 'simulation' && (
          <motion.div
            key="simulation-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8 text-xs"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Input Question Scenarios */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Decision Simulation Lab</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Test civic policy and maintenance delays inside our simulator engine.</p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleDecisionSimulation();
                    }}
                    className="space-y-4"
                  >
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Formulate Custom Scenario</label>
                      <textarea
                        value={simScenario}
                        onChange={(e) => setSimScenario(e.target.value)}
                        placeholder="What happens if we delay water pipeline repair by two weeks?"
                        className="w-full h-24 p-4 border border-slate-200 rounded-2xl focus:border-amber-500 focus:outline-none text-[11px] font-semibold text-slate-800 leading-relaxed resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={simulating}
                      className="w-full h-11 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-slate-950/20"
                    >
                      {simulating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Projecting Downstream Variables...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                          Simulate Decision Impact
                        </>
                      )}
                    </button>
                  </form>

                  {/* Preset Scenarios list */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Or select from quick templates:</p>
                    
                    {[
                      { q: "What happens if repair on Sector 4 main water pipe is delayed by two weeks?", label: "Delay Sector 4 pipeline repair" },
                      { q: "What happens if we add two additional support crews to electrical transformers and road maintenance?", label: "Add support maintenance crews" },
                      { q: "What happens if Sector 2 Ring Road is closed during peak commute hours?", label: "Close Sector 2 Ring Road corridor" }
                    ].map((template, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDecisionSimulation(template.q)}
                        className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 rounded-2xl text-left font-bold text-[10px] text-slate-700 transition-all cursor-pointer flex justify-between items-center gap-2"
                      >
                        <span>{template.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 2 Columns: Simulated Output Results */}
              <div className="lg:col-span-2 space-y-6">
                {simulating ? (
                  <div className="p-24 text-center bg-white border border-slate-100 rounded-3xl space-y-4 shadow-sm h-full flex flex-col items-center justify-center">
                    <Cpu className="w-8 h-8 text-amber-500 animate-pulse" />
                    <p className="text-sm font-bold text-slate-500 animate-pulse">Computing multi-department cascade factors and sentiment elasticity models...</p>
                  </div>
                ) : simResult ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 border border-slate-100 rounded-3xl shadow-sm space-y-6 h-full"
                  >
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-100 text-amber-700 font-extrabold text-[8px] uppercase tracking-wider rounded">
                        <Brain className="w-3 h-3" />
                        AI Projection Model Complete
                      </div>
                      <h3 className="text-base font-black text-slate-900">{simResult.scenarioTitle}</h3>
                    </div>

                    {/* Core Simulated metrics grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Metric 1: Traffic congestion */}
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1">
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Traffic Congestion</p>
                        <h4 className="text-xl font-black text-red-500">{simResult.trafficImpact?.scale}/10</h4>
                        <p className="text-[8px] text-slate-500 font-medium leading-relaxed mt-1">{simResult.trafficImpact?.description}</p>
                      </div>

                      {/* Metric 2: Fiscal Balance */}
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1">
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Fiscal Net Balance</p>
                        <h4 className={`text-sm font-black ${simResult.budgetImpact?.netFiscalChange?.startsWith('-') ? 'text-red-500' : 'text-emerald-600'}`}>
                          {simResult.budgetImpact?.netFiscalChange}
                        </h4>
                        <div className="text-[8px] text-slate-400 space-y-0.5 mt-1">
                          <p>Savings: {simResult.budgetImpact?.savings}</p>
                          <p>Penalties: {simResult.budgetImpact?.penaltyCost}</p>
                        </div>
                      </div>

                      {/* Metric 3: Sentiment & Complaint spikes */}
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1">
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Citizen Satisfaction</p>
                        <h4 className="text-xl font-black text-slate-800">{simResult.citizenImpact?.sentimentScore}%</h4>
                        <p className="text-[8px] text-red-500 font-extrabold">+{simResult.citizenImpact?.complaintGrowthPercent}% Tickets</p>
                        <p className="text-[7px] text-slate-400 font-medium leading-normal mt-1">{simResult.citizenImpact?.details}</p>
                      </div>

                      {/* Metric 4: Risk levels & Growth */}
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center space-y-1">
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest font-extrabold text-rose-500">Hazard Risk Escalation</p>
                        <h4 className="text-xl font-black text-rose-600">+{simResult.riskIncreasePercent}%</h4>
                        <p className="text-[8px] text-rose-600 font-extrabold mt-0.5">+{simResult.predictedIssueGrowthCount} predicted tickets</p>
                        <p className="text-[7px] text-slate-400 font-medium leading-normal mt-1">Downstream safety hazard multiplication index.</p>
                      </div>
                    </div>

                    {/* Expert AI Insights bulletin board */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex gap-3 items-start text-[10px]">
                      <Cpu className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-extrabold text-white uppercase tracking-wider">Expert Decision Simulation Verdict</p>
                        <p className="text-slate-300 leading-relaxed font-medium">{simResult.expertAIInsight}</p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-20 text-center text-slate-400">
                    <p className="font-bold text-sm">Formulate a custom scenario on the left and trigger simulation.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: Strategic Bulletins */}
        {activeSubTab === 'bulletins' && (
          <motion.div
            key="bulletins-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8 text-xs"
          >
            {loadingBriefing && !briefingData ? (
              <div className="p-24 text-center bg-white border border-slate-100 rounded-3xl space-y-4 shadow-sm">
                <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-500 animate-pulse">Constructing administrative executive bulletins...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Panel 1: Executive AI Daily Briefing (Feature 8) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Executive Strategic Briefing</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Synthesized hourly by ExecutiveBriefingAgent for municipal leadership.</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-900 text-amber-400 font-extrabold text-[10px] uppercase rounded-full tracking-wider">
                      ADMIN STRATEGY
                    </span>
                  </div>

                  {/* Overall Summary statement */}
                  <div className="p-4 bg-slate-50 border-l-4 border-amber-500 rounded-r-2xl font-medium text-slate-700 leading-relaxed text-[10px]">
                    {briefingData?.overallSummary}
                  </div>

                  <div className="space-y-5">
                    {/* Top Risks */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        Top Active Threats & Risks
                      </p>
                      <ul className="space-y-2 leading-relaxed text-[10px] font-semibold text-slate-800">
                        {(briefingData?.topCityRisks || []).map((risk: string, idx: number) => (
                          <li key={idx} className="flex gap-2 items-start p-2.5 bg-rose-500/5 rounded-xl border border-rose-500/10">
                            <span className="text-rose-500">•</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Critical Unresolved Issues */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Critical Backlogs needing signoff</p>
                      <div className="space-y-2">
                        {(briefingData?.criticalUnresolvedIssues || []).map((issue: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center gap-4 text-[10px]">
                            <div className="space-y-0.5">
                              <span className="font-extrabold text-[8px] bg-red-100 text-red-700 px-1.5 rounded">{issue.severity}</span>
                              <h5 className="font-bold text-slate-900 mt-0.5">{issue.title}</h5>
                              <p className="text-[8px] text-slate-400 uppercase tracking-wider font-bold">{issue.department}</p>
                            </div>
                            <span className="text-[9px] font-mono font-extrabold text-slate-500">{issue.id}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Departments needing attention */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Departments at Risk of SLA Failure</p>
                      <ul className="space-y-1.5 text-[10px] font-bold text-slate-600">
                        {(briefingData?.departmentsNeedingAttention || []).map((dept: string, idx: number) => (
                          <li key={idx} className="flex gap-2 items-center">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            <span>{dept}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Executive Directives Actions */}
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-slate-900">Immediate Directives</p>
                      <ul className="space-y-2">
                        {(briefingData?.recommendedActions || []).map((action: string, idx: number) => (
                          <li key={idx} className="flex gap-2 items-start text-[10px] font-semibold text-slate-700">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Panel 2: Community Intelligence (Feature 10) */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Community Intelligence</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Identifies grassroots cleanups and education campaigns computed by CommunityInsightsAgent.</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 font-extrabold text-[10px] uppercase rounded-full tracking-wider">
                      CIVIC ACTION
                    </span>
                  </div>

                  <div className="space-y-5">
                    {/* Spiking neighborhoods */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Neighborhood Report Spikes</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {(communityData?.increasingReportSectors || []).map((item: any, idx: number) => (
                          <div key={idx} className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl space-y-1">
                            <p className="font-extrabold text-slate-900 text-[10px] truncate">{item.sector}</p>
                            <p className="text-[8px] text-slate-400 uppercase truncate">{item.issueType}</p>
                            <p className="font-black text-red-500 text-xs mt-1">+{item.growthPercent}% Volume</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Volunteer drives */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Upcoming Civic Volunteer Drives</p>
                      <div className="space-y-3">
                        {(communityData?.volunteerOpportunities || []).map((drive: any, idx: number) => (
                          <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
                            <div className="flex justify-between items-start gap-4">
                              <h5 className="font-extrabold text-slate-950 text-xs leading-snug">{drive.title}</h5>
                              <span className="bg-slate-900 text-white font-extrabold text-[8px] px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
                                {drive.expectedDate}
                              </span>
                            </div>
                            <p className="text-[9px] text-slate-500 leading-relaxed font-semibold">{drive.description}</p>
                            <div className="flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                Location: {drive.sector}
                              </span>
                              <button
                                onClick={() => {
                                  toast.success("Broadcasted volunteer drive to Citizen Portal mobile clients!");
                                }}
                                className="text-amber-600 hover:text-amber-700 flex items-center gap-0.5 cursor-pointer"
                              >
                                Broadcast Drive <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Public Awareness campaigns */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">AI Safety Awareness Programs</p>
                      <div className="space-y-2">
                        {(communityData?.awarenessCampaigns || []).map((camp: any, idx: number) => (
                          <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                            <h6 className="font-bold text-slate-950 text-[10px]">{camp.title}</h6>
                            <p className="text-[8px] text-amber-600 font-extrabold uppercase">{camp.topic}</p>
                            <p className="text-[9px] text-slate-400 leading-normal">{camp.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 5: Cognitive Semantic Search Index */}
        {activeSubTab === 'search' && (
          <motion.div
            key="search-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-6 text-xs animate-fade-in"
          >
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-900">Semantic City Database Search</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Executes multi-vector similarity matches across entire incident histories based on concept meanings.</p>
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSemanticSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g., Water leakages close to local primary schools, repeated potholes in Sector 11..."
                    className="w-full h-12 pl-11 pr-4 border border-slate-200 rounded-2xl focus:border-amber-500 focus:outline-none text-[11px] font-semibold text-slate-800"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                </div>
                <button
                  type="submit"
                  disabled={searching}
                  className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl uppercase text-[10px] tracking-wider transition-all duration-100 flex items-center gap-2 cursor-pointer shrink-0 shadow-md shadow-slate-950/20"
                >
                  {searching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Search Concept
                </button>
              </form>

              {/* Preset recommendations */}
              <div className="flex flex-wrap gap-2 items-center text-[10px]">
                <span className="text-slate-400 font-bold uppercase tracking-wider">Common Semantic Queries:</span>
                {[
                  "Water leakage near schools",
                  "Repeated potholes in the last month",
                  "High-risk electrical zones",
                  "Roads repaired more than three times"
                ].map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSearchQuery(tag);
                      // Trigger immediately
                      setTimeout(() => {
                        apiFetch('/api/predictive/search', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ query: tag })
                        }).then(r => r.json()).then(d => setSearchResults(d));
                      }, 100);
                    }}
                    className="px-3 py-1 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-600 transition-all font-semibold cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Display query expansion details */}
              {searchResults?.queryExpansion && (
                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center gap-2 text-[10px] text-amber-800 font-bold">
                  <Brain className="w-4 h-4 text-amber-600" />
                  <span>{searchResults.queryExpansion}</span>
                </div>
              )}

              {/* Search result items */}
              {searching ? (
                <div className="p-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-amber-600 animate-spin mx-auto" />
                  <p className="text-slate-500 font-bold animate-pulse">Running cognitive embedding correlation calculations...</p>
                </div>
              ) : searchResults ? (
                <div className="space-y-4">
                  <p className="font-extrabold text-slate-400 uppercase tracking-widest text-[9px]">Matched Incidents ({searchResults.matches?.length || 0})</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(searchResults.matches || []).map((match: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <span className="font-extrabold text-[8px] bg-slate-900 text-white px-2 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
                              {match.category}
                            </span>
                            <span className="font-black text-emerald-600 text-[10px] bg-emerald-50 px-2 py-0.5 border border-emerald-100 rounded-full shrink-0">
                              Relevance: {Math.round(match.relevanceScore * 100)}%
                            </span>
                          </div>

                          <h5 className="font-bold text-slate-950 text-[11px] leading-snug">{match.title}</h5>
                          <p className="text-slate-400 font-mono text-[8px]">{match.id}</p>
                        </div>

                        <p className="p-3 bg-white border border-slate-150 rounded-xl text-[9px] text-slate-500 font-semibold leading-relaxed">
                          <b>Semantic match link:</b> {match.semanticExplanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-bold">Input custom terms or click on preset queries to test vector query projections.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
