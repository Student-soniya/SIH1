import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Cpu, 
  Code2, 
  Building2, 
  Calendar, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ProblemDetailsModal from './ProblemDetailsModal';

export default function ProblemStatementsSection({ onApplyProblem, initialTheme = '' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState(initialTheme || 'All');
  const [selectedOrg, setSelectedOrg] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalProblem, setActiveModalProblem] = useState(null);

  useEffect(() => {
    if (initialTheme) {
      setSelectedTheme(initialTheme);
      setCurrentPage(1);
    }
  }, [initialTheme]);

  // Realistic Problem Statements dataset (SIH 2026)
  const problemsData = [
    {
      id: 'SIH2026-1049',
      organization: 'Ministry of Social Justice & Empowerment (NSFDC)',
      title: 'AI-Driven Proactive Beneficiary Readiness & Channel Partner Routing for Concessional Credit',
      category: 'Software',
      theme: 'FinTech & Inclusive Banking',
      submissionsCount: 142,
      deadline: '30 Sep 2026',
      techStack: 'ASP.NET Core, React, SQL, NLP, Amortization Engine',
      description: 'NSFDC provides concessional financial assistance to SC beneficiaries with annual income up to ₹5 Lakhs. However, direct applications are rejected and must route via 100+ Channel Partners (SCAs, RRBs). Build an explainable AI readiness platform verifying documents, computing DSCR, generating DPRs, and routing applications to performing branches.',
      deliverables: [
        'Voice/Indic conversational onboarding in 7 languages',
        'Deterministic rule matcher citing NSFDC Clause 4.2',
        'DigiLocker document verification with PDF preview',
        'Banking amortization & business survival score (DSCR)'
      ]
    },
    {
      id: 'SIH2026-1284',
      organization: 'Indian Space Research Organisation (ISRO)',
      title: 'Automated Satellite Telemetry Anomaly Detection & Predictive Health Monitoring using Edge AI',
      category: 'Software',
      theme: 'AI / ML & Cognitive Systems',
      submissionsCount: 189,
      deadline: '30 Sep 2026',
      techStack: 'Python, PyTorch, C++, TensorRT, Time-Series Models',
      description: 'Develop an intelligent deep learning system capable of processing real-time multi-sensor telemetry from low-earth orbit satellites to forecast subsystem degradation, power bus anomalies, and thermal fluctuations prior to component failure.',
      deliverables: [
        'Edge-deployable lightweight neural time-series model',
        'Real-time visualization dashboard for Mission Control',
        'Low-false-positive rate anomaly alerts with confidence scores',
        'Automated telemetry playback simulator'
      ]
    },
    {
      id: 'SIH2026-1412',
      organization: 'Defence Research & Development Organisation (DRDO)',
      title: 'Anti-Drone Acoustic & RF Signature Triangulation System for Border Surveillance',
      category: 'Hardware',
      theme: 'Robotics & UAV Drones',
      submissionsCount: 118,
      deadline: '30 Sep 2026',
      techStack: 'FPGA, SDR, Microphone Array, Embedded Linux',
      description: 'Design and prototype a modular ground sensor array combining 8-channel acoustic microphone arrays and RF spectrum scanning to detect, identify, and localize micro and nano UAVs operating below radar cross-section horizons in border terrains.',
      deliverables: [
        'Hardware prototype with FPGA/SDR processing board',
        'Acoustic signal angle-of-arrival (AoA) estimation algorithms',
        'Encrypted mesh radio telemetry to base station',
        'Field-ruggedized IP67 enclosure design'
      ]
    },
    {
      id: 'SIH2026-1105',
      organization: 'Ministry of Health & Family Welfare',
      title: 'AI-Powered Automated Diabetic Retinopathy & Glaucoma Screening for Primary Health Centers',
      category: 'Software',
      theme: 'Healthcare & Biomedical Tech',
      submissionsCount: 164,
      deadline: '30 Sep 2026',
      techStack: 'TensorFlow.js, React Native, FHIR, Offline SQLite',
      description: 'Develop an offline-first smartphone / fundus camera interface utilizing computer vision to grade diabetic retinopathy lesions and optic cup ratios, delivering instant diagnostic triage in remote rural clinics without internet connectivity.',
      deliverables: [
        'Mobile-optimized CNN model running locally on smartphone',
        'Ayushman Bharat Digital Mission (ABDM) ABHA ID integration',
        'Automated bilingual diagnostic patient slip generation',
        'Audit trail for clinical verification by ophthalmologists'
      ]
    },
    {
      id: 'SIH2026-1330',
      organization: 'Ministry of Agriculture & Farmers Welfare',
      title: 'Autonomous Hexacopter with Multispectral Imaging for Precision Weed & Pest Micro-Spraying',
      category: 'Hardware',
      theme: 'Agriculture, FoodTech & Rural Tech',
      submissionsCount: 135,
      deadline: '30 Sep 2026',
      techStack: 'Pixhawk, Raspberry Pi 5, Multispectral Cam, Brushless Motors',
      description: 'Build an autonomous agricultural drone equipped with multispectral vegetation index cameras and targeted micro-solenoid spray nozzles to identify crop pest infestations in real-time, reducing chemical pesticide consumption by 70%.',
      deliverables: [
        'Working hexacopter UAV flight prototype with 10L payload',
        'Real-time NDVI / crop health inference on edge companion computer',
        'Variable rate spraying flow controller',
        'Farmer-friendly bilingual mobile ground station app'
      ]
    },
    {
      id: 'SIH2026-1520',
      organization: 'Ministry of Railways (Railway Board)',
      title: 'Predictive Wheel Bearing Acoustic & Thermal Profiling for High-Speed Vande Bharat Trains',
      category: 'Hardware',
      theme: 'Transportation & Logistics',
      submissionsCount: 97,
      deadline: '30 Sep 2026',
      techStack: 'MEMS Accelerometers, Infrared Sensors, Edge ML',
      description: 'Design trackside acoustic bearing detectors (TABD) and optical thermal sensors positioned at 50 km intervals along rail tracks to identify bearing sub-surface spalls and hot axle boxes on trains traveling at speeds up to 160 km/h.',
      deliverables: [
        'Ruggedized trackside sensor mounting enclosure',
        'High-speed acoustic doppler correction algorithm',
        'Instant SMS/Automated alert to Divisional Railway Control',
        'Cloud telemetry dashboard with locomotive history'
      ]
    },
    {
      id: 'SIH2026-1608',
      organization: 'Ministry of Jal Shakti (Namami Gange)',
      title: 'Solar-Powered River Water Quality Telemetry Buoy with Automated Sluice Contamination Gate Control',
      category: 'Hardware',
      theme: 'Clean & Green Technology',
      submissionsCount: 112,
      deadline: '30 Sep 2026',
      techStack: 'ESP32 / LoRaWAN, Electrochemical Probes, Solar MPPT',
      description: 'Create an autonomous floating river buoy equipped with optical Dissolved Oxygen, pH, Turbidity, and Heavy Metal sensors powered by solar energy, transmitting telemetry via LoRaWAN to automatically shut industrial drain sluice gates when pollutants surge.',
      deliverables: [
        'Hermetically sealed floating marine buoy with antifouling wipers',
        'LoRaWAN / 4G dual communication redundancy',
        'Sluice gate relay trigger actuator module',
        'Central CPCB compliance dashboard'
      ]
    },
    {
      id: 'SIH2026-1742',
      organization: 'Ministry of Power & Renewable Energy',
      title: 'Smart Microgrid Autonomous Islanding & Distributed Solar Inverter Synchronization',
      category: 'Software',
      theme: 'Smart Automation & Industry 4.0',
      submissionsCount: 88,
      deadline: '30 Sep 2026',
      techStack: 'Rust, WebSockets, Modbus TCP, IEEE 1547 Protocols',
      description: 'Develop a fast-acting grid controller software capable of managing phase angle synchronization and seamless islanding transitions between rural rooftop solar arrays, battery energy storage systems (BESS), and the national 3-phase grid.',
      deliverables: [
        'Sub-cycle phase angle synchronization algorithm (< 20ms)',
        'Frequency and voltage stability droop control logic',
        'SCADA/HMI simulator demonstrating islanding recovery',
        'Zero export and peak shaving scheduling engine'
      ]
    }
  ];

  // Distinct Filter options
  const themesList = useMemo(() => {
    return ['All', ...new Set(problemsData.map(p => p.theme))];
  }, [problemsData]);

  const orgsList = useMemo(() => {
    return ['All', ...new Set(problemsData.map(p => p.organization))];
  }, [problemsData]);

  // Filtering and Sorting logic
  const filteredProblems = useMemo(() => {
    return problemsData
      .filter((p) => {
        const matchesQuery = 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.theme.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesTheme = selectedTheme === 'All' || p.theme === selectedTheme;
        const matchesOrg = selectedOrg === 'All' || p.organization === selectedOrg;

        return matchesQuery && matchesCat && matchesTheme && matchesOrg;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.submissionsCount - a.submissionsCount;
        if (sortBy === 'newest') return b.id.localeCompare(a.id);
        return 0;
      });
  }, [problemsData, searchQuery, selectedCategory, selectedTheme, selectedOrg, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTheme('All');
    setSelectedOrg('All');
    setSortBy('popular');
    setCurrentPage(1);
  };

  const pageSize = 6;
  const totalPages = Math.ceil(filteredProblems.length / pageSize) || 1;
  const paginatedProblems = filteredProblems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <section id="problems" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 border border-blue-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>SIH 2026 Problem Statements Repository</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Find Your Challenge
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-normal">
            Explore 240+ verified challenges submitted by Government Ministries, State Administrations, and Defense Establishments.
          </p>
        </div>

        {/* Filter & Search Bar Container */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md space-y-5">
          {/* Main Search Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Problem ID, Ministry name, keyword, or technology (e.g. 'SIH2026-1049', 'NSFDC', 'ISRO', 'Drone')..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-orange-500 transition-all shadow-inner"
            />
          </div>

          {/* Filter Pills & Dropdowns */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            {/* Category Pills (Software / Hardware / All) */}
            <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
              {['All', 'Software', 'Hardware'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedCategory === cat ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {cat === 'All' ? 'All Categories (240)' : cat === 'Software' ? 'Software (182)' : 'Hardware (58)'}
                </button>
              ))}
            </div>

            {/* Dropdowns row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Theme Dropdown */}
              <select
                value={selectedTheme}
                onChange={(e) => { setSelectedTheme(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-orange-500 cursor-pointer"
              >
                <option value="All">All Innovation Themes</option>
                {themesList.filter(t => t !== 'All').map(th => (
                  <option key={th} value={th}>{th}</option>
                ))}
              </select>

              {/* Organization Dropdown */}
              <select
                value={selectedOrg}
                onChange={(e) => { setSelectedOrg(e.target.value); setCurrentPage(1); }}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-orange-500 cursor-pointer max-w-xs truncate"
              >
                <option value="All">All Ministries &amp; Organizations</option>
                {orgsList.filter(o => o !== 'All').map(org => (
                  <option key={org} value={org}>{org}</option>
                ))}
              </select>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-orange-500 cursor-pointer"
              >
                <option value="popular">Sort: Most Popular</option>
                <option value="newest">Sort: Problem ID</option>
              </select>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Count Banner */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Showing <strong>{filteredProblems.length}</strong> matching problem statements</span>
            <span>SIH 2026 Verified Data</span>
          </div>
        </div>

        {/* Problem Statements Cards / Table Hybrid */}
        <div className="space-y-4">
          {paginatedProblems.map((prob) => {
            const isHardware = prob.category === 'Hardware';
            return (
              <div
                key={prob.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group"
              >
                {/* Left Info Cluster */}
                <div className="space-y-3 max-w-4xl">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-xs text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-md">
                      {prob.id}
                    </span>

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center space-x-1 ${isHardware ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                      {isHardware ? <Cpu className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                      <span>{prob.category}</span>
                    </span>

                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {prob.theme}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                    {prob.title}
                  </h3>

                  {/* Organization & Description excerpt */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-800">{prob.organization}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                      {prob.description}
                    </p>
                  </div>
                </div>

                {/* Right Action & Metadata Cluster */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  <div className="text-left lg:text-right space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 font-mono">
                      {prob.submissionsCount} Teams Submitted
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Deadline: {prob.deadline}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModalProblem(prob)}
                    className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-orange-500 hover:text-slate-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredProblems.length === 0 && (
            <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Problem Statements match your filter</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching with broader terms or click reset to view all challenges.
              </p>
              <button
                onClick={handleReset}
                className="bg-orange-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl mt-2 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className={`p-2 rounded-xl border ${currentPage === 1 ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer'}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${currentPage === i + 1 ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className={`p-2 rounded-xl border ${currentPage === totalPages ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer'}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Problem Details Modal Component */}
      <ProblemDetailsModal
        problem={activeModalProblem}
        isOpen={Boolean(activeModalProblem)}
        onClose={() => setActiveModalProblem(null)}
        onApply={onApplyProblem}
      />
    </section>
  );
}