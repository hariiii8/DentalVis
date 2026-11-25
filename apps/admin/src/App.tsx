import { useState } from 'react';
import { Badge } from '@dentalvis/ui';
import {
  ShieldCheck,
  BookOpen,
  Layers,
  Lock,
  Key,
  Search,
  Sparkles,
  Edit3,
  Eye,
  CheckCircle2,
  User,
} from 'lucide-react';
import {
  CANONICAL_DEPARTMENTS,
  CANONICAL_EXPLORE_CATEGORIES,
  ProcedureEditorialContent,
  checkEditorialPermission,
} from '@dentalvis/common';
import { governanceApi } from './lib/governanceApi';
import { editorialStore } from './lib/editorialStore';
import { ReviewerAssignmentsPanel } from './features/governance/ReviewerAssignmentsPanel';
import { CoiManagementPanel } from './features/governance/CoiManagementPanel';
import { ClinicalReviewOversightPanel } from './features/governance/ClinicalReviewOversightPanel';
import { ProcedureEditor } from './features/editorial/ProcedureEditor';
import { ProcedurePreviewModal } from './features/editorial/ProcedurePreviewModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'governance' | 'procedures' | 'categories' | 'audit'>('overview');
  const [sessionToken, setSessionToken] = useState(governanceApi.getToken() || '');
  const [isTokenSet, setIsTokenSet] = useState(!!governanceApi.getToken());

  // Editorial Procedure State
  const [editingProcedure, setEditingProcedure] = useState<ProcedureEditorialContent | null>(null);
  const [previewProcedure, setPreviewProcedure] = useState<ProcedureEditorialContent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeRole, setActiveRole] = useState<string>('SYSTEM_ADMIN');

  // Load metrics dynamically
  const metrics = editorialStore.getDashboardMetrics();
  const allProcedures = editorialStore.getProcedures();

  const handleApplyToken = () => {
    governanceApi.setToken(sessionToken ? sessionToken.trim() : null);
    setIsTokenSet(!!sessionToken);
  };

  const handleRoleChange = (newRole: string) => {
    setActiveRole(newRole);
    editorialStore.setCurrentUser({
      role: newRole,
      name:
        newRole === 'SYSTEM_ADMIN'
          ? 'Clinical Editorial Admin'
          : newRole === 'CHIEF_EDITOR'
          ? 'Dr. Rajesh Sundaram (Chief Editor)'
          : newRole === 'CLINICAL_AUTHOR'
          ? 'Dr. Priyadharshini (Author)'
          : newRole === 'CLINICAL_REVIEWER'
          ? 'Dr. Ananya Murugan (Reviewer)'
          : 'Patient Education Viewer',
    });
  };

  // Filtered procedures list
  const filteredProcedures = allProcedures.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      p.titleEn.toLowerCase().includes(q) ||
      p.titleTa.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.primaryDepartmentCode.toLowerCase().includes(q);

    const matchesSpecialty =
      selectedSpecialty === 'ALL' ||
      p.primaryDepartmentCode === selectedSpecialty ||
      (p.secondaryDepartmentCodes && p.secondaryDepartmentCodes.includes(selectedSpecialty));

    const matchesCategory =
      selectedCategory === 'ALL' ||
      (p.exploreCategorySlugs && p.exploreCategorySlugs.includes(selectedCategory));

    return matchesSearch && matchesSpecialty && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5FAF9] via-[#E8F7F6]/60 to-[#F5FAF9] flex flex-col text-[#164B50] relative selection:bg-[#BFE9E2] selection:text-[#145B59] overflow-x-hidden">
      {/* Global Ambient Luminance Canvas Behind Glass */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
        <div className="absolute -top-32 left-1/4 w-[42rem] h-[42rem] bg-gradient-to-br from-[#BFE9E2]/45 via-[#20B2AA]/15 to-transparent rounded-full blur-3xl opacity-80" />
        <div className="absolute top-1/3 -right-32 w-[38rem] h-[38rem] bg-gradient-to-bl from-[#DCEFF5]/70 via-[#20B2AA]/15 to-transparent rounded-full blur-3xl opacity-75" />
        <div className="absolute bottom-10 left-1/5 w-[36rem] h-[36rem] bg-[#DDF5F1]/55 rounded-full blur-3xl opacity-70" />
      </div>

      {/* Top Header in Glass Nav */}
      <header className="sticky top-0 z-50 glass-nav transition-all duration-300 px-6 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
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
              Content Management, Bilingual Publishing & CRB Governance
            </p>
          </div>
        </div>

        {/* User Context & Session Token */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Selector Pill */}
          <div className="flex items-center gap-1.5 liquid-glass-secondary px-3 py-1.5 rounded-2xl text-xs border border-[#C8E7E3]/80">
            <User className="w-3.5 h-3.5 text-[#20B2AA]" />
            <span className="text-[#587477] font-medium hidden sm:inline">Role:</span>
            <select
              value={activeRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-transparent border-none text-xs outline-none font-bold text-[#145B59] cursor-pointer"
            >
              <option value="SYSTEM_ADMIN" className="bg-white">System Admin</option>
              <option value="CHIEF_EDITOR" className="bg-white">Chief Editor</option>
              <option value="CLINICAL_AUTHOR" className="bg-white">Clinical Author</option>
              <option value="CLINICAL_REVIEWER" className="bg-white">Clinical Reviewer</option>
              <option value="PATIENT_VIEWER" className="bg-white">Patient Viewer (Read-only)</option>
            </select>
          </div>

          {/* Session Token Input */}
          <div className="flex items-center gap-2 liquid-glass-secondary px-3 py-1.5 rounded-2xl text-xs border border-[#C8E7E3]/80">
            <Key className="w-3.5 h-3.5 text-[#20B2AA]" />
            <input
              type="password"
              placeholder="Session Token Hash..."
              value={sessionToken}
              onChange={(e) => setSessionToken(e.target.value)}
              className="bg-transparent border-none text-xs outline-none w-32 font-mono text-[#145B59] placeholder-[#587477]/70"
            />
            <button
              type="button"
              onClick={handleApplyToken}
              className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[#20B2AA] text-white hover:bg-[#145B59] transition-all shadow-xs cursor-pointer"
            >
              {isTokenSet ? 'Active' : 'Set'}
            </button>
          </div>

          <Badge variant={isTokenSet ? 'mint' : 'alert'} className="gap-1.5 py-1.5 px-3 rounded-2xl liquid-glass-lens">
            <Lock className="w-3.5 h-3.5" />
            <span>{isTokenSet ? 'Authenticated Bearer' : 'No Bearer'}</span>
          </Badge>
        </div>
      </header>

      {/* Main Administrative Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8 relative z-10">
        {/* Security & Governance Notice Banner in Liquid Glass */}
        <div className="liquid-glass-secondary p-5 sm:p-6 rounded-3xl border border-[#C8E7E3] space-y-2 relative isolate">
          <div className="flex items-center gap-2 font-bold text-[#145B59] text-sm">
            <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
            <span>Authoritative Governance Runtime & Public Catalogue Separation</span>
          </div>
          <p className="text-xs text-[#587477] leading-relaxed max-w-4xl">
            All 48 procedures remain publicly accessible across public educational routes without visible clinical-review badges. Formal clinical approval (CRB review quorum, COI declarations, RFC 8785 hashes) operates separately from content management. Ordinary edits update educational draft content without falsifying or creating clinical approvals.
          </p>
        </div>

        {/* Navigation Tabs (Floating Liquid Glass Strip) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl liquid-glass-lens isolate overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              setEditingProcedure(null);
            }}
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
            onClick={() => {
              setActiveTab('procedures');
              setEditingProcedure(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'procedures'
                ? 'bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white shadow-sm'
                : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            Procedure Management ({allProcedures.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('categories');
              setEditingProcedure(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white shadow-sm'
                : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            Explore Categories ({CANONICAL_EXPLORE_CATEGORIES.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('governance');
              setEditingProcedure(null);
            }}
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
            onClick={() => {
              setActiveTab('audit');
              setEditingProcedure(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white shadow-sm'
                : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            Audit Trail ({metrics.recentAuditActivity.length})
          </button>
        </div>

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="liquid-glass-secondary p-6 rounded-3xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#587477] uppercase tracking-wider">
                    Total Procedures
                  </span>
                  <div className="w-9 h-9 rounded-2xl liquid-glass-lens flex items-center justify-center text-[#20B2AA]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#145B59]">{metrics.totalProcedures}</div>
                <p className="text-[11px] text-[#587477]">100% accessible on public educational web</p>
              </div>

              <div className="liquid-glass-secondary p-6 rounded-3xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#587477] uppercase tracking-wider">
                    Bilingual Completeness
                  </span>
                  <div className="w-9 h-9 rounded-2xl liquid-glass-lens flex items-center justify-center text-[#20B2AA]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#145B59]">
                  {metrics.tamilCompleteCount} / {metrics.totalProcedures}
                </div>
                <p className="text-[11px] text-[#587477]">Full English & Tamil title/summary/details</p>
              </div>

              <div className="liquid-glass-secondary p-6 rounded-3xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#587477] uppercase tracking-wider">
                    Visualization Assets
                  </span>
                  <div className="w-9 h-9 rounded-2xl liquid-glass-lens flex items-center justify-center text-[#20B2AA]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#145B59]">
                  {metrics.proceduresWith3DAssets} 3D / {metrics.proceduresWith2DAssets} 2D
                </div>
                <p className="text-[11px] text-[#587477]">Interactive anatomy + clinical schematics</p>
              </div>

              <div className="liquid-glass-secondary p-6 rounded-3xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#587477] uppercase tracking-wider">
                    Clinical Specialties
                  </span>
                  <div className="w-9 h-9 rounded-2xl liquid-glass-lens flex items-center justify-center text-[#20B2AA]">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#145B59]">{CANONICAL_DEPARTMENTS.length} Specialties</div>
                <p className="text-[11px] text-[#587477]">Covering all 15 clinical dental departments</p>
              </div>
            </div>

            {/* Specialty Distribution Grid */}
            <div className="liquid-glass-primary p-7 sm:p-8 rounded-3xl space-y-5 border border-white/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-[#145B59] tracking-tight">
                    Procedures by Dental Specialty
                  </h3>
                  <p className="text-xs text-[#587477] mt-0.5">
                    Accurate procedure counts mapped across all 15 clinical departments
                  </p>
                </div>
                <Badge variant="mint" className="text-xs font-bold liquid-glass-lens">
                  15 Specialties
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                {metrics.proceduresBySpecialty.map((s) => (
                  <div
                    key={s.code}
                    className="p-3.5 rounded-2xl liquid-glass-secondary space-y-1 hover:liquid-glass-interactive transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#20B2AA]">{s.code}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-[#20B2AA]/15 text-[#145B59] font-bold text-[11px]">
                        {s.totalCount}
                      </span>
                    </div>
                    <div className="font-bold text-[#145B59] line-clamp-1">{s.nameEn}</div>
                    <div className="text-[10px] text-[#587477] line-clamp-1">{s.nameTa}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Editorial Pipeline & Governance Separation Card */}
            <div className="liquid-glass-primary p-8 rounded-3xl space-y-6 shadow-md border border-white/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-[#145B59] tracking-tight">
                    Bilingual Editorial Lifecycle & Governance Integration
                  </h3>
                  <p className="text-xs text-[#587477] mt-0.5">
                    Clear separation between public educational editing and statutory clinical review
                  </p>
                </div>
                <Badge variant="mint" className="text-xs font-bold liquid-glass-lens">
                  M7.3 Verified
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
                  <div className="w-7 h-7 rounded-xl liquid-glass-lens flex items-center justify-center font-bold text-[#20B2AA]">1</div>
                  <span className="font-bold text-[#145B59] block">Bilingual Authoring</span>
                  <p className="text-[#587477] leading-relaxed">
                    Authors independently manage English & Tamil content with Noto Sans Tamil validation.
                  </p>
                </div>
                <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
                  <div className="w-7 h-7 rounded-xl liquid-glass-lens flex items-center justify-center font-bold text-[#20B2AA]">2</div>
                  <span className="font-bold text-[#145B59] block">Content Validation</span>
                  <p className="text-[#587477] leading-relaxed">
                    Strict client/server validation checks required fields, Unicode, and department mappings.
                  </p>
                </div>
                <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
                  <div className="w-7 h-7 rounded-xl liquid-glass-lens flex items-center justify-center font-bold text-[#20B2AA]">3</div>
                  <span className="font-bold text-[#145B59] block">True-to-Life Preview</span>
                  <p className="text-[#587477] leading-relaxed">
                    Interactive modal simulates exact public patient view with 0 clinical warning badges.
                  </p>
                </div>
                <div className="p-5 rounded-2xl liquid-glass-secondary space-y-2">
                  <div className="w-7 h-7 rounded-xl liquid-glass-lens flex items-center justify-center font-bold text-[#20B2AA]">4</div>
                  <span className="font-bold text-[#145B59] block">Immutable Audit Log</span>
                  <p className="text-[#587477] leading-relaxed">
                    Every save, draft, and preview action is immutably recorded with editor attribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Procedure Management */}
        {activeTab === 'procedures' && (
          <div>
            {editingProcedure ? (
              <ProcedureEditor
                procedure={editingProcedure}
                onSaveSuccess={() => {
                  setEditingProcedure(null);
                }}
                onCancel={() => {
                  setEditingProcedure(null);
                }}
              />
            ) : (
              <div className="liquid-glass-primary p-7 sm:p-9 rounded-3xl space-y-6 shadow-md border border-white/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-extrabold text-2xl text-[#145B59] tracking-tight">
                      Procedure Content Management
                    </h3>
                    <p className="text-xs text-[#587477] mt-1">
                      Manage, edit, validate, and preview all 48 canonical procedures
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="mint" className="text-xs font-bold liquid-glass-lens">
                      Showing {filteredProcedures.length} of {allProcedures.length}
                    </Badge>
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#587477] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search title, code, slug, specialty..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl liquid-glass-secondary border border-[#C8E7E3] text-xs text-[#145B59] outline-none"
                    />
                  </div>

                  <div>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl liquid-glass-secondary border border-[#C8E7E3] text-xs text-[#145B59] outline-none bg-transparent"
                    >
                      <option value="ALL" className="bg-white">All Specialties ({CANONICAL_DEPARTMENTS.length})</option>
                      {CANONICAL_DEPARTMENTS.map((d) => (
                        <option key={d.code} value={d.code} className="bg-white">
                          {d.nameEn} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl liquid-glass-secondary border border-[#C8E7E3] text-xs text-[#145B59] outline-none bg-transparent"
                    >
                      <option value="ALL" className="bg-white">All Explore Categories ({CANONICAL_EXPLORE_CATEGORIES.length})</option>
                      {CANONICAL_EXPLORE_CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug} className="bg-white">
                          {c.titleEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Procedure Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProcedures.map((p) => {
                    const hasDraft = editorialStore.hasDraft(p.slug);
                    const canEdit = checkEditorialPermission(activeRole, 'EDIT').permitted;

                    return (
                      <div
                        key={p.id}
                        className="p-5 rounded-2xl liquid-glass-secondary space-y-3 hover:liquid-glass-interactive transition-all border border-[#C8E7E3]/60"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-bold text-sm text-[#145B59] leading-snug block">
                              {p.titleEn}
                            </span>
                            <span className="text-xs font-medium text-[#20B2AA] block font-tamil">
                              {p.titleTa}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {hasDraft && (
                              <span className="px-2 py-0.5 rounded-lg bg-[#20B2AA] text-white text-[10px] font-bold">
                                Draft
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-lg liquid-glass-lens text-[11px] font-mono font-bold text-[#145B59]">
                              {p.code}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[#587477] line-clamp-2 leading-relaxed">{p.summaryEn}</p>

                        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] border-t border-[#C8E7E3]/60">
                          <span className="font-semibold text-[#145B59]">{p.primaryDepartmentCode}</span>
                          <span className="text-[#20B2AA] font-bold">~{p.durationMinutes} min</span>
                          <span className="text-[#587477]">
                            {p.has3DModel ? '3D WebGL' : '2D Schematic'}
                          </span>

                          <div className="flex items-center gap-2 ml-auto">
                            <button
                              type="button"
                              onClick={() => {
                                editorialStore.logPreviewAction(p, 'en');
                                setPreviewProcedure(p);
                              }}
                              className="p-1.5 rounded-xl hover:bg-white/60 text-[#20B2AA] transition-all cursor-pointer"
                              title="Public Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingProcedure(p)}
                              disabled={!canEdit}
                              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#20B2AA] text-white font-bold text-[11px] hover:bg-[#145B59] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{canEdit ? 'Edit' : 'View'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Explore Categories */}
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
                    <span className="text-xs font-semibold text-[#20B2AA] font-tamil">{c.titleTa}</span>
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

        {/* Tab 4: CRB Governance Workflows */}
        {activeTab === 'governance' && (
          <div className="space-y-8">
            <ReviewerAssignmentsPanel />
            <CoiManagementPanel />
            <ClinicalReviewOversightPanel />
          </div>
        )}

        {/* Tab 5: Audit Trail */}
        {activeTab === 'audit' && (
          <div className="liquid-glass-primary p-7 sm:p-9 rounded-3xl space-y-6 shadow-md border border-white/80">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-2xl text-[#145B59] tracking-tight">
                  Immutable Editorial Audit Log
                </h3>
                <p className="text-xs text-[#587477] mt-1">
                  Tamper-evident record of procedure edits, draft creations, and preview events
                </p>
              </div>
              <Badge variant="mint" className="text-xs font-bold liquid-glass-lens">
                {metrics.recentAuditActivity.length} Events Recorded
              </Badge>
            </div>

            <div className="space-y-3">
              {metrics.recentAuditActivity.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl liquid-glass-secondary space-y-1.5 border border-[#C8E7E3]/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-[#20B2AA]/20 text-[#145B59] font-mono font-bold text-[10px]">
                        {log.action}
                      </span>
                      <span className="font-bold text-[#145B59]">{log.procedureCode}</span>
                      <span className="text-[#587477]">by {log.editorName} ({log.editorRole})</span>
                    </div>
                    <span className="text-[#587477] font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#587477] leading-relaxed">{log.changesSummary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Standalone Preview Modal */}
      {previewProcedure && (
        <ProcedurePreviewModal
          procedure={previewProcedure}
          onClose={() => setPreviewProcedure(null)}
        />
      )}
    </div>
  );
}
