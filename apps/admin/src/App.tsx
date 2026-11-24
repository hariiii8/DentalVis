import { useState } from 'react';
import { Card, Button, Badge } from '@dentalvis/ui';
import { ShieldCheck, BookOpen, Layers, Users, Lock, Key } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F8FBFA] flex flex-col text-[#173F3B]">
      {/* Top Header */}
      <header className="bg-white border-b border-teal-900/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#134E4A] flex items-center justify-center text-white font-bold">
            DV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#134E4A]">DentalVis Editorial Portal</span>
              <Badge variant="mint" className="text-[10px]">M6.1.5 Governance Enabled</Badge>
            </div>
            <p className="text-xs text-slate-500">Clinical Revision & Content Governance Administration</p>
          </div>
        </div>

        {/* Session Token Context */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border px-3 py-1.5 rounded-lg text-xs">
            <Key className="w-3.5 h-3.5 text-[#0D9488]" />
            <input
              type="password"
              placeholder="Session Token Hash..."
              value={sessionToken}
              onChange={(e) => setSessionToken(e.target.value)}
              className="bg-transparent border-none text-xs outline-none w-36 font-mono"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleApplyToken}
              className="text-[10px] h-6 px-2"
            >
              {isTokenSet ? 'Active' : 'Set Token'}
            </Button>
          </div>

          <Badge variant={isTokenSet ? 'mint' : 'alert'} className="gap-1.5 py-1">
            <Lock className="w-3.5 h-3.5" />
            <span>{isTokenSet ? 'Authenticated Bearer' : 'No Session Token'}</span>
          </Badge>
        </div>
      </header>

      {/* Main Administrative Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Security & Governance Notice Banner */}
        <div className="p-4 rounded-xl bg-teal-50/70 border-l-4 border-[#0D9488] text-xs text-[#134E4A] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
            <span>Server-Side Governance Enforcement (M6.1.5-D)</span>
          </div>
          <p className="text-slate-600">
            Per Architecture Baseline v1.9.1, all governance operations (Reviewer Assignments, Conflict of Interest disclosures, and Clinical Review evaluations) are executed authoritatively against PostgreSQL through server-side authorization guards.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Button
            variant={activeTab === 'overview' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('overview')}
            className="text-xs"
          >
            Dashboard Overview
          </Button>
          <Button
            variant={activeTab === 'governance' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('governance')}
            className="text-xs"
          >
            CRB Governance Workflows
          </Button>
          <Button
            variant={activeTab === 'procedures' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('procedures')}
            className="text-xs"
          >
            Procedures ({CANONICAL_PROCEDURES.length})
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('categories')}
            className="text-xs"
          >
            Explore Categories ({CANONICAL_EXPLORE_CATEGORIES.length})
          </Button>
        </div>

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Educational Procedures</span>
                  <BookOpen className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div className="text-3xl font-extrabold text-[#134E4A]">{CANONICAL_PROCEDURES.length}</div>
                <p className="text-xs text-slate-500 mt-1">4 canonical bilingual treatments loaded</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Explore Categories</span>
                  <Layers className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div className="text-3xl font-extrabold text-[#134E4A]">{CANONICAL_EXPLORE_CATEGORIES.length}</div>
                <p className="text-xs text-slate-500 mt-1">Patient-facing discovery hierarchy</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Editorial Roles</span>
                  <Users className="w-5 h-5 text-[#0D9488]" />
                </div>
                <div className="text-3xl font-extrabold text-[#134E4A]">5 Roles</div>
                <p className="text-xs text-slate-500 mt-1">Author, Reviewer, Chief Editor, Admin, Viewer</p>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-bold text-lg text-[#134E4A] mb-4">Phase 5 Content Workflow Architecture Plan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">1. Author Draft</span>
                  <p className="text-slate-500">Clinical author drafts revision in English & Tamil with media assets.</p>
                </div>
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                  <span className="font-bold text-[#0D9488] block mb-1">2. Review Quorum</span>
                  <p className="text-slate-500">Requires certified dental clinician consensus approvals via CRB.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">3. Deterministic Snapshot</span>
                  <p className="text-slate-500">Generates immutable RFC 8785 JSON snapshot with SHA-256 hash.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">4. Fenced Outbox Revalidate</span>
                  <p className="text-slate-500">Atomic outbox worker purges edge CDN caches via HMAC signature.</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Tab 2: CRB Governance Workflows (M6.1.5-D Integration) */}
        {activeTab === 'governance' && (
          <div className="space-y-6">
            <ReviewerAssignmentsPanel />
            <CoiManagementPanel />
            <ClinicalReviewOversightPanel />
          </div>
        )}

        {/* Tab 3: Procedures */}
        {activeTab === 'procedures' && (
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-lg text-[#134E4A]">Canonical Procedures Register</h3>
            <div className="divide-y divide-slate-100">
              {CANONICAL_PROCEDURES.map((p) => (
                <div key={p.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#134E4A]">{p.titleEn}</span>
                      <Badge variant="outline" className="text-[10px]">{p.code}</Badge>
                      <Badge variant="mint" className="text-[10px]">{p.primaryDepartmentName}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{p.summaryEn}</p>
                    <p className="text-xs font-medium text-[#0D9488]">{p.titleTa}</p>
                  </div>
                  <Badge variant="default" className="text-xs">
                    PUBLISHED (Mock)
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tab 4: Explore Categories */}
        {activeTab === 'categories' && (
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-lg text-[#134E4A]">Patient Explore Taxonomy Register</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CANONICAL_EXPLORE_CATEGORIES.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#134E4A]">{c.titleEn}</span>
                    <span className="text-xs font-semibold text-[#0D9488]">{c.titleTa}</span>
                  </div>
                  <p className="text-xs text-slate-600">{c.descriptionEn}</p>
                  <p className="text-[11px] text-slate-400 font-mono">Slug: {c.slug}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
