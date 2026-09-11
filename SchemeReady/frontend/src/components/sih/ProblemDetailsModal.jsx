import React from 'react';
import { 
  X, 
  Building2, 
  Calendar, 
  Cpu, 
  Code2, 
  Users, 
  Award, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function ProblemDetailsModal({ problem, isOpen, onClose, onApply }) {
  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl relative animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges & ID */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="bg-orange-100 text-orange-800 font-mono font-black text-xs px-3 py-1 rounded-md border border-orange-200">
            {problem.id}
          </span>
          <span className={`text-xs font-bold px-3 py-1 rounded-md flex items-center space-x-1 ${problem.category === 'Hardware' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
            {problem.category === 'Hardware' ? <Cpu className="w-3.5 h-3.5" /> : <Code2 className="w-3.5 h-3.5" />}
            <span>{problem.category} Edition</span>
          </span>
          <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1 rounded-md">
            {problem.theme}
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {problem.title}
          </h3>
          <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
            <Building2 className="w-4 h-4 text-orange-600" />
            <span className="font-bold text-slate-800">{problem.organization}</span>
            <span>&bull;</span>
            <span>SIH 2026 Challenge</span>
          </div>
        </div>

        {/* Problem Brief & Narrative */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-orange-500" />
            <span>Problem Description &amp; Challenge Context</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {problem.description}
          </p>
        </div>

        {/* Expected Solution & Deliverables */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Expected Output / Key Deliverables</span>
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {problem.deliverables?.map((deliv, i) => (
              <li key={i} className="flex items-start space-x-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-emerald-600 font-bold mt-0.5">&bull;</span>
                <span>{deliv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Tech Stack & Eligibility Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Recommended Tech</span>
            <span className="font-bold text-slate-800 font-mono text-[11px]">
              {problem.techStack || 'Open Stack / Edge Computing / Cloud'}
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Total Submissions</span>
            <span className="font-bold text-slate-900 font-mono text-sm">
              {problem.submissionsCount} Teams Registered
            </span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Submission Deadline</span>
            <span className="font-bold text-rose-600 font-mono text-xs">
              {problem.deadline || '30 September 2026'}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="text-[11px] text-slate-500">
            Official PS under Ministry of Education guidelines. IP remains with student team.
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => { onClose(); onApply(problem); }}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Submit Idea for this PS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}