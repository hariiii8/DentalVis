// apps/admin/src/features/editorial/ProcedureEditor.tsx
// DentalVis Admin — Comprehensive Bilingual Procedure Content Editor
// Architecture Baseline v1.9.1 — Milestone M7.3

import React, { useState } from 'react';
import { Badge } from '@dentalvis/ui';
import {
  Save,
  Eye,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import {
  CANONICAL_DEPARTMENTS,
  CANONICAL_EXPLORE_CATEGORIES,
  ProcedureEditorialContent,
  ContentValidationResult,
  checkEditorialPermission,
} from '@dentalvis/common';
import { editorialStore } from '../../lib/editorialStore';
import { ProcedurePreviewModal } from './ProcedurePreviewModal';

interface ProcedureEditorProps {
  procedure: ProcedureEditorialContent;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export function ProcedureEditor({ procedure: initialProcedure, onSaveSuccess, onCancel }: ProcedureEditorProps) {
  const [formData, setFormData] = useState<ProcedureEditorialContent>({ ...initialProcedure });
  const [activeLangTab, setActiveLangTab] = useState<'both' | 'en' | 'ta'>('both');
  const [validation, setValidation] = useState<ContentValidationResult>(
    editorialStore.validateContent(initialProcedure)
  );
  const [showPreview, setShowPreview] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  const currentUser = editorialStore.getCurrentUser();
  const canSave = checkEditorialPermission(currentUser.role, 'SAVE').permitted;

  const handleChange = (field: keyof ProcedureEditorialContent, value: any) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);
    setValidation(editorialStore.validateContent(updated));
  };

  const handleCategoryToggle = (slug: string) => {
    const current = formData.exploreCategorySlugs || [];
    const updated = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    handleChange('exploreCategorySlugs', updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg(null);
    setSaveErrorMsg(null);

    const res = editorialStore.saveProcedure(formData);
    setValidation(res.validation);

    if (res.success) {
      setSaveSuccessMsg(`Content changes for "${formData.titleEn}" saved successfully!`);
      onSaveSuccess();
    } else {
      setSaveErrorMsg(res.error || 'Failed to save changes. Please resolve validation errors.');
    }
  };

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard your edits and revert to the catalogue baseline?')) {
      editorialStore.discardDraft(formData.slug);
      onCancel();
    }
  };

  const handleOpenPreview = () => {
    editorialStore.logPreviewAction(formData, activeLangTab === 'ta' ? 'ta' : 'en');
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      {/* Editor Header Bar */}
      <div className="liquid-glass-primary p-6 md:p-8 rounded-3xl space-y-4 border border-white/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg liquid-glass-lens text-xs font-mono font-bold text-[#145B59]">
                {formData.code}
              </span>
              <span className="text-xs text-[#587477]">Slug: /procedures/{formData.slug}</span>
              {editorialStore.hasDraft(formData.slug) && (
                <Badge variant="mint" className="text-[11px] font-bold">
                  Active Draft
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-[#145B59] tracking-tight mt-1">
              Editing: {formData.titleEn}
            </h2>
            <p className="text-xs text-[#20B2AA] font-medium">{formData.titleTa}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenPreview}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl liquid-glass-secondary text-xs font-bold text-[#145B59] hover:liquid-glass-interactive transition-all cursor-pointer border border-[#C8E7E3]"
            >
              <Eye className="w-3.5 h-3.5 text-[#20B2AA]" />
              <span>Public Preview</span>
            </button>

            <button
              type="button"
              onClick={handleDiscard}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl liquid-glass-secondary text-xs font-bold text-[#587477] hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer border border-[#C8E7E3]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Cancel / Discard</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#20B2AA] to-[#145B59] text-white text-xs font-bold hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Validated Changes</span>
            </button>
          </div>
        </div>

        {/* Completeness & Feedback Banner */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-[#C8E7E3]/60 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[#587477]">English Completeness:</span>
              <span className="font-bold text-[#145B59]">{validation.completeness.englishPercent}%</span>
              {validation.completeness.isEnglishComplete && <CheckCircle2 className="w-3.5 h-3.5 text-[#20B2AA]" />}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#587477]">Tamil Completeness:</span>
              <span className="font-bold text-[#145B59]">{validation.completeness.tamilPercent}%</span>
              {validation.completeness.isTamilComplete && <CheckCircle2 className="w-3.5 h-3.5 text-[#20B2AA]" />}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#587477]">
            <ShieldCheck className="w-4 h-4 text-[#20B2AA]" />
            <span>Authenticated as <strong>{currentUser.name}</strong> ({currentUser.role})</span>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-2xl bg-[#E8F7F6] border border-[#20B2AA] text-xs font-bold text-[#145B59] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#20B2AA] shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {saveErrorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{saveErrorMsg}</span>
          </div>
        )}
      </div>

      {/* Language View Switcher Bar */}
      <div className="flex items-center justify-between p-2 rounded-2xl liquid-glass-lens">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#20B2AA] ml-2" />
          <span className="text-xs font-bold text-[#145B59]">Editorial Language Workspace:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveLangTab('both')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLangTab === 'both' ? 'bg-[#20B2AA] text-white shadow-xs' : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            Side-by-Side (Bilingual)
          </button>
          <button
            type="button"
            onClick={() => setActiveLangTab('en')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLangTab === 'en' ? 'bg-[#20B2AA] text-white shadow-xs' : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            English Only
          </button>
          <button
            type="button"
            onClick={() => setActiveLangTab('ta')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeLangTab === 'ta' ? 'bg-[#20B2AA] text-white shadow-xs' : 'text-[#145B59] hover:bg-white/60'
            }`}
          >
            தமிழ் Only
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Bilingual Content Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* English Column */}
          {(activeLangTab === 'both' || activeLangTab === 'en') && (
            <div className="liquid-glass-secondary p-6 sm:p-7 rounded-3xl space-y-5 border border-[#C8E7E3]/80">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base text-[#145B59] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#20B2AA]/20 text-[#145B59] text-xs flex items-center justify-center font-bold">EN</span>
                  English Content Area
                </span>
                <span className="text-xs text-[#587477]">Validated independently</span>
              </div>

              {/* Title En */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#145B59] block">
                  Procedure Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => handleChange('titleEn', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl liquid-glass-primary border text-xs text-[#145B59] outline-none transition-all ${
                    validation.errors.titleEn ? 'border-red-400 bg-red-50/30' : 'border-[#C8E7E3] focus:border-[#20B2AA]'
                  }`}
                  placeholder="e.g. Pediatric Pulpotomy"
                />
                {validation.errors.titleEn && (
                  <p className="text-[11px] text-red-600 font-medium">{validation.errors.titleEn}</p>
                )}
              </div>

              {/* Summary En */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#145B59] block">
                  Patient Summary (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.summaryEn}
                  onChange={(e) => handleChange('summaryEn', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl liquid-glass-primary border text-xs text-[#145B59] outline-none transition-all resize-y ${
                    validation.errors.summaryEn ? 'border-red-400 bg-red-50/30' : 'border-[#C8E7E3] focus:border-[#20B2AA]'
                  }`}
                  placeholder="Clear, patient-friendly summary without technical jargon..."
                />
                {validation.errors.summaryEn && (
                  <p className="text-[11px] text-red-600 font-medium">{validation.errors.summaryEn}</p>
                )}
              </div>

              {/* Overview HTML En */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#145B59] block">
                  Detailed Overview HTML (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={formData.overviewHtmlEn}
                  onChange={(e) => handleChange('overviewHtmlEn', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl liquid-glass-primary border text-xs text-[#145B59] font-mono outline-none transition-all resize-y ${
                    validation.errors.overviewHtmlEn ? 'border-red-400 bg-red-50/30' : 'border-[#C8E7E3] focus:border-[#20B2AA]'
                  }`}
                  placeholder="<p>Root canal treatment is designed to...</p>"
                />
                {validation.errors.overviewHtmlEn && (
                  <p className="text-[11px] text-red-600 font-medium">{validation.errors.overviewHtmlEn}</p>
                )}
              </div>

              {/* Clinical Indications En */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#145B59] block">
                  Clinical Indications (English)
                </label>
                <textarea
                  rows={2}
                  value={formData.indicationsEn || ''}
                  onChange={(e) => handleChange('indicationsEn', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl liquid-glass-primary border border-[#C8E7E3] text-xs text-[#145B59] outline-none"
                  placeholder="When is this treatment indicated?"
                />
              </div>

              {/* Recovery En */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#145B59] block">
                  Recovery & Aftercare (English)
                </label>
                <textarea
                  rows={2}
                  value={formData.recoveryInfoEn || ''}
                  onChange={(e) => handleChange('recoveryInfoEn', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl liquid-glass-primary border border-[#C8E7E3] text-xs text-[#145B59] outline-none"
                  placeholder="Recovery timeframe and post-procedure comfort guidance..."
                />
              </div>
            </div>
          )}

          {/* Tamil Column */}
          {(activeLangTab === 'both' || activeLangTab === 'ta') && (
            <div className="liquid-glass-secondary p-6 sm:p-7 rounded-3xl space-y-5 border border-[#C8E7E3]/80">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-base text-[#145B59] flex items-center gap-2 font-tamil">
                  <span className="w-6 h-6 rounded-lg bg-[#20B2AA]/20 text-[#145B59] text-xs flex items-center justify-center font-bold">தமிழ்</span>
                  தமிழ் உள்ளடக்கப் பகுதி (Tamil Content)
                </span>
                <span className="text-xs text-[#587477]">Noto Sans Tamil & Unicode</span>
              </div>

              {/* Title Ta */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#145B59] block">
                  சிகிச்சையின் தலைப்பு (Tamil Title) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titleTa}
                  onChange={(e) => handleChange('titleTa', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl liquid-glass-primary border text-xs text-[#145B59] outline-none transition-all font-tamil ${
                    validation.errors.titleTa ? 'border-red-400 bg-red-50/30' : 'border-[#C8E7E3] focus:border-[#20B2AA]'
                  }`}
                  placeholder="எ.கா. பல் தொப்பி (Dental Crown)"
                />
                {validation.errors.titleTa && (
                  <p className="text-[11px] text-red-600 font-medium">{validation.errors.titleTa}</p>
                )}
              </div>

              {/* Summary Ta */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#145B59] block">
                  நோயாளிக்கான சுருக்கம் (Tamil Summary) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.summaryTa}
                  onChange={(e) => handleChange('summaryTa', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl liquid-glass-primary border text-xs text-[#145B59] outline-none transition-all resize-y font-tamil ${
                    validation.errors.summaryTa ? 'border-red-400 bg-red-50/30' : 'border-[#C8E7E3] focus:border-[#20B2AA]'
                  }`}
                  placeholder="நோயாளிகள் எளிதில் புரிந்து கொள்ளக்கூடிய தமிழ் விளக்கம்..."
                />
                {validation.errors.summaryTa && (
                  <p className="text-[11px] text-red-600 font-medium">{validation.errors.summaryTa}</p>
                )}
              </div>

              {/* Overview HTML Ta */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#145B59] block">
                  விரிவான விளக்கம் HTML (Tamil Overview) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={formData.overviewHtmlTa}
                  onChange={(e) => handleChange('overviewHtmlTa', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-2xl liquid-glass-primary border text-xs text-[#145B59] font-mono outline-none transition-all resize-y font-tamil ${
                    validation.errors.overviewHtmlTa ? 'border-red-400 bg-red-50/30' : 'border-[#C8E7E3] focus:border-[#20B2AA]'
                  }`}
                  placeholder="<p>பல் தொப்பி என்பது சேதமடைந்த...</p>"
                />
                {validation.errors.overviewHtmlTa && (
                  <p className="text-[11px] text-red-600 font-medium">{validation.errors.overviewHtmlTa}</p>
                )}
              </div>

              {/* Clinical Indications Ta */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#145B59] block">
                  பரிந்துரைக்கப்படும் காரணங்கள் (Tamil Indications)
                </label>
                <textarea
                  rows={2}
                  value={formData.indicationsTa || ''}
                  onChange={(e) => handleChange('indicationsTa', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl liquid-glass-primary border border-[#C8E7E3] text-xs text-[#145B59] outline-none font-tamil"
                  placeholder="இந்த சிகிச்சை எப்போது பரிந்துரைக்கப்படுகிறது?"
                />
              </div>

              {/* Recovery Ta */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#145B59] block">
                  குணமடைதல் வழிகாட்டுதல் (Tamil Recovery)
                </label>
                <textarea
                  rows={2}
                  value={formData.recoveryInfoTa || ''}
                  onChange={(e) => handleChange('recoveryInfoTa', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-2xl liquid-glass-primary border border-[#C8E7E3] text-xs text-[#145B59] outline-none font-tamil"
                  placeholder="சிகிச்சைக்குப் பின் இயல்பு நிலைக்குத் திரும்பும் காலம்..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Clinical Taxonomy, Duration & Visualization Settings */}
        <div className="liquid-glass-secondary p-6 sm:p-7 rounded-3xl space-y-5 border border-[#C8E7E3]/80">
          <h3 className="font-extrabold text-base text-[#145B59]">
            Clinical Specialty, Timing & Visualization Mappings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Primary Specialty Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#145B59] block">
                Primary Specialty <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.primaryDepartmentCode}
                onChange={(e) => handleChange('primaryDepartmentCode', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl liquid-glass-primary border border-[#C8E7E3] text-xs text-[#145B59] outline-none bg-transparent"
              >
                {CANONICAL_DEPARTMENTS.map((dept) => (
                  <option key={dept.code} value={dept.code} className="bg-white text-[#145B59]">
                    {dept.nameEn} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Minutes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#145B59] block">
                Duration (Minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={480}
                value={formData.durationMinutes}
                onChange={(e) => handleChange('durationMinutes', parseInt(e.target.value, 10) || 0)}
                className="w-full px-3.5 py-2.5 rounded-2xl liquid-glass-primary border border-[#C8E7E3] text-xs text-[#145B59] outline-none"
              />
              {validation.errors.durationMinutes && (
                <p className="text-[11px] text-red-600 font-medium">{validation.errors.durationMinutes}</p>
              )}
            </div>

            {/* Anesthesia / Numbing Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#145B59] block">
                Comfort / Anesthesia Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.anesthesiaType}
                onChange={(e) => handleChange('anesthesiaType', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl liquid-glass-primary border border-[#C8E7E3] text-xs text-[#145B59] outline-none"
                placeholder="e.g. Local Anesthesia"
              />
              {validation.errors.anesthesiaType && (
                <p className="text-[11px] text-red-600 font-medium">{validation.errors.anesthesiaType}</p>
              )}
            </div>
          </div>

          {/* Explore Category Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-[#C8E7E3]/60">
            <label className="text-xs font-bold text-[#145B59] block">
              Patient Explore Categories (Select at least 1) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {CANONICAL_EXPLORE_CATEGORIES.map((cat) => {
                const checked = formData.exploreCategorySlugs?.includes(cat.slug);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryToggle(cat.slug)}
                    className={`p-3 rounded-2xl text-left transition-all flex items-start gap-2.5 cursor-pointer border ${
                      checked
                        ? 'liquid-glass-interactive border-[#20B2AA]'
                        : 'liquid-glass-secondary border-[#C8E7E3]/60 hover:bg-white/40'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 text-white ${
                        checked ? 'bg-[#20B2AA]' : 'border border-[#C8E7E3]'
                      }`}
                    >
                      {checked && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-[#145B59]">{cat.titleEn}</div>
                      <div className="text-[10px] text-[#20B2AA]">{cat.titleTa}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            {validation.errors.exploreCategorySlugs && (
              <p className="text-[11px] text-red-600 font-medium">{validation.errors.exploreCategorySlugs}</p>
            )}
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <ProcedurePreviewModal
          procedure={formData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
