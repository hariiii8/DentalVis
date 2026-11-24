import { useState } from 'react';
import { Badge } from '@dentalvis/ui';
import {
  ShieldCheck,
  BookOpen,
  Layers,
  Users,
  Lock,
  Key,
} from 'lucide-react';
import { CANONICAL_PROCEDURES, CANONICAL_EXPLORE_CATEGORIES } from '@dentalvis/common';
import { governanceApi } from './lib/governanceApi';
import { ReviewerAssignmentsPanel } from './features/governance/ReviewerAssignmentsPanel';
import { CoiManagementPanel } from './features/governance/CoiManagementPanel';
import { ClinicalReviewOversightPanel } from './features/governance/ClinicalReviewOversightPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'governance' | 'procedures' | 'categories'>('overview');
  const [sessionToken, setSessionToken] = useState(governanceApi.getToken() || '');
  const [isTokenSet, setIsTokenSet] = useState(!!governanceApi.getToken());

  const handleApplyToken = () => {
    governanceApi.setToken(sessionToken ? sessionToken.trim() : null);
    setIsTokenSet(!!sessionToken);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5FAF9] via-[#E8F7F6]/60 to-[#F5FAF9] flex flex-col text-[#164B50] relative selection:bg-[#BFE9E2] selection:text-[#145B59] overflow-x-hidden">
      {/* Global Ambient Luminance Canvas Behind Glass */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        <div className="absolute -top-32 left-1/4 w-[42rem] h-[42rem] bg-gradient-to-br from-[#BFE9E2]/45 via-[#20B2AA]/15 to-transparent rounded-full blur-3xl opacity-80" />
        <div className="absolute top-1/3 -right-32 w-[38rem] h-[38rem] bg-gradient-to-bl from-[#DCEFF5]/70 via-[#20B2AA]/15 to-transparent rounded-full blur-3xl opacity-75" />
        <div className="absolute bottom-10 left-1/5 w-[36rem] h-[36rem] bg-[#DDF5F1]/55 rounded-full blur-3xl opacity-70" />
      </div>

      {/* Top Header in Glass Nav */}
      <header className="sticky top-0 z-50 glass-nav transition-all duration-300 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 select-none">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#20B2AA] to-[#145B59] flex items-center justify-center text-white font-extrabold shadow-md">
            DV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-[#145B59]">
                Dental<span className="bg-gradient-to-r from-[#0D9488] via-[#14B8A6] to-[#0F766E] bg-clip-text text-transparent">Vis</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-xl liquid-glass-lens text-[11px] font-bold text-[#145B59] uppercase tracking-wider">
                Editorial Portal
              </span>
            </div>
            <p className="text-xs font-medium text-[#587477]">
              Clinical Governance & Procedure Taxonomy Administration
            </p>
          </div>
        </div>

        {/* Session Token Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 liquid-glass-secondary px-3 py-1.5 rounded-2xl text-xs border border-[#C8E7E3]/80">
            <Key className="w-3.5 h-3.5 text-[#20B2AA]" />
            <input
              type="password"
              placeholder="Session Token Hash..."
              value={sessionToken}
              onChange={(e) => setSessionToken(e.target.value)}
              className="bg-transparent border-none text-xs outline-none w-36 font-mono text-[#145B59] placeholder-[#587477]/70"
            />
            <button
              type="button"
              onClick={handleApplyToken}
              className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[#20B2AA] text-white hover:bg-[#145B59] transition-all shadow-xs cursor-pointer"
            >
              {isTokenSet ? 'Active' : 'Set Token'}
            </button>
          </div>

          <Badge variant={isTokenSet ? 'mint' : 'alert'} className="gap-1.5 py-1.5 px-3 rounded-2xl liquid-glass-lens">
            <Lock className="w-3.5 h-3.5" />
            <span>{isTokenSet ? 'Authenticated Bearer' : 'No Session Token'}</span>
          </Badge>
        </div>
      </header>

      {/* Main Administrative Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8 relative z-10">
        {/* Security & Governance Notice Banner in Liquid Glass */}
        <div className="liquid-glass-secondary p-5 sm:p-6 rounded-3xl border border-[#C8E7E3] space-y-2 relative isolate">
          <div className="flex items-center gap-2 font-bold text-[#145B59] text-sm">
            <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
            <span>Authoritative Governance Runtime (M6.1.5-D / v1.9.1 Frozen Baseline)</span>
          </div>
          <p className="text-xs text-[#587477] leading-relaxed max-w-4xl">
            Per DentalVis governance invariants, reviewer assignments, Conflict of Interest disclosures, and quorum evaluations execute authoritatively against PostgreSQL through server-side authorization guards. Public catalog endpoints remain strictly decoupled from admin session state.
          </p>
        </div>

        {/* Navigation Tabs (Floating Liquid Glass Strip) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl liquid-glass-lens isolate overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white shadow-sm'
                : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            Dashboard Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('governance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'governance'
                ? 'bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white shadow-sm'
                : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            CRB Governance Workflows
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('procedures')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'procedures'
                ? 'bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white shadow-sm'
                : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            Procedures ({CANONICAL_PROCEDURES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white shadow-sm'
                : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            Explore Categories ({CANONICAL_EXPLORE_CATEGORIES.length})
          </button>
        </div>

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="liquid-glass-secondary p-7 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#587477] uppercase tracking-wider">
                    Educational Procedures
                  </span>
                  <div className="w-10 h-10 rounded-2xl liquid-glass-lens flex items-center justify-center text-[#20B2AA]">
                    <BookOpen className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-4xl font-black text-[#145B59]">{CANONICAL_PROCEDURES.length}</div>
                <p className="text-xs text-[#587477]">Canonical bilingual clinical treatments loaded</p>
              </div>

              <div className="liquid-glass-secondary p-7 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#587477] uppercase tracking-wider">
                    Explore Taxonomies
                  </span>
                  <div className="w-10 h-10 rounded-2xl liquid-glass-lens flex items-center justify-center text-[#20B2AA]">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-4xl font-black text-[#145B59]">{CANONICAL_EXPLORE_CATEGORIES.length}</div>
                <p className="text-xs text-[#587477]">Patient-facing symptoms and discovery hierarchy</p>
              </div>

              <div className="liquid-glass-secondary p-7 rounded-3xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#587477] uppercase tracking-wider">
                    Editorial Roles
                  </span>
                  <div className="w-10 h-10 rounded-2xl liquid-glass-lens flex items-center justify-center text-[#20B2AA]">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-4xl font-black text-[#145B59]">5 Roles</div>
                <p className="text-xs text-[#587477]">Author, Reviewer, Chief Editor, Admin, Viewer</p>
              </div>
            </div>

            {/* Workflow Architecture Card in Liquid Glass Primary */}
            <div className="liquid-glass-primary p-8 rounded-3xl space-y-6 shadow-md border border-white/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-[#145B59] tracking-tight">
                    Clinical Review Board Editorial Pipeline
                  </h3>
                  <p className="text-xs text-[#587477] mt-0.5">
                    Immutable governance lifecycle for certified patient dental education content
                  </p>
                </div>
                <Badge variant="mint" className="text-xs font-bold liquid-glass-lens">
                  Phase 5 Specification
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
                  <div className="w-7 h-7 rounded-xl liquid-glass-lens flex items-center justify-center font-bold text-[#20B2AA]">1</div>
                  <span className="font-bold text-[#145B59] block">Author Draft</span>
                  <p className="text-[#587477] leading-relaxed">Clinical author drafts revision in English & Tamil with calibrated media assets.</p>
                </div>
                <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2 border border-[#20B2AA]/30">
                  <div className="w-7 h-7 rounded-xl bg-[#20B2AA] text-white flex items-center justify-center font-bold">2</div>
                  <span className="font-bold text-[#145B59] block">Review Quorum</span>
                  <p className="text-[#587477] leading-relaxed">Certified clinicians evaluate medical validity without self-approval conflict.</p>
                </div>
                <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
                  <div className="w-7 h-7 rounded-xl liquid-glass-lens flex items-center justify-center font-bold text-[#20B2AA]">3</div>
                  <span className="font-bold text-[#145B59] block">Deterministic Snapshot</span>
                  <p className="text-[#587477] leading-relaxed">Generates immutable RFC 8785 JSON snapshot with SHA-256 cryptographic hash.</p>
                </div>
                <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
                  <div className="w-7 h-7 rounded-xl liquid-glass-lens flex items-center justify-center font-bold text-[#20B2AA]">4</div>
                  <span className="font-bold text-[#145B59] block">Atomic Outbox</span>
                  <p className="text-[#587477] leading-relaxed">Transactional worker purges edge cache via authenticated webhook revalidation.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CRB Governance Workflows */}
        {activeTab === 'governance' && (
          <div className="space-y-8">
            <ReviewerAssignmentsPanel />
            <CoiManagementPanel />
            <ClinicalReviewOversightPanel />
          </div>
        )}

        {/* Tab 3: Procedures */}
        {activeTab === 'procedures' && (
          <div className="liquid-glass-primary p-7 sm:p-9 rounded-3xl space-y-6 shadow-md border border-white/80">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-2xl text-[#145B59] tracking-tight">
                  Canonical Procedures Register
                </h3>
                <p className="text-xs text-[#587477] mt-1">
                  Catalog of all 48 canonical procedures with bilingual clinical summaries
                </p>
              </div>
              <Badge variant="mint" className="text-xs font-bold liquid-glass-lens">
                {CANONICAL_PROCEDURES.length} Total
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CANONICAL_PROCEDURES.map((p) => (
                <div
                  key={p.id}
                  className="p-5 rounded-2xl liquid-glass-secondary space-y-2 hover:liquid-glass-interactive transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-[#145B59] leading-snug">{p.titleEn}</span>
                    <span className="px-2 py-0.5 rounded-lg liquid-glass-lens text-[11px] font-mono text-[#145B59] uppercase shrink-0">
                      {p.code}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-[#20B2AA]">{p.titleTa}</div>
                  <p className="text-xs text-[#587477] line-clamp-2 leading-relaxed">{p.summaryEn}</p>
                  <div className="pt-2 flex items-center justify-between text-[11px] border-t border-[#C8E7E3]/60">
                    <span className="font-semibold text-[#145B59]">{p.primaryDepartmentName}</span>
                    <span className="text-[#20B2AA] font-bold">~{p.durationMinutes} min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Explore Categories */}
        {activeTab === 'categories' && (
          <div className="liquid-glass-primary p-7 sm:p-9 rounded-3xl space-y-6 shadow-md border border-white/80">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-2xl text-[#145B59] tracking-tight">
                  Patient Explore Taxonomy Register
                </h3>
                <p className="text-xs text-[#587477] mt-1">
                  Primary patient-facing entry points for clinical education
                </p>
              </div>
              <Badge variant="mint" className="text-xs font-bold liquid-glass-lens">
                {CANONICAL_EXPLORE_CATEGORIES.length} Categories
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CANONICAL_EXPLORE_CATEGORIES.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl liquid-glass-secondary space-y-2 hover:liquid-glass-interactive transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-[#145B59]">{c.titleEn}</span>
                    <span className="text-xs font-semibold text-[#20B2AA]">{c.titleTa}</span>
                  </div>
                  <p className="text-xs text-[#587477] leading-relaxed">{c.descriptionEn}</p>
                  <div className="text-[11px] text-[#587477]/80 font-mono pt-1">
                    Slug: /explore/{c.slug}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
