// apps/admin/src/features/governance/ClinicalReviewOversightPanel.tsx
// DentalVis Admin — Clinical Review Oversight Component
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-D & M6.6 Addendum

import React, { useState } from 'react';
import { Badge } from '@dentalvis/ui';
import { Award, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { governanceApi, ClinicalReviewResultDto } from '../../lib/governanceApi';

export function ClinicalReviewOversightPanel({ revisionId }: { revisionId?: string }) {
  const [targetRevisionId, setTargetRevisionId] = useState(revisionId || '');
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [clinicalNotes, setClinicalNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState<ClinicalReviewResultDto | null>(null);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRevisionId) {
      setError('Revision UUID is required.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setReviewResult(null);

    const res = await governanceApi.submitClinicalReview({
      revisionId: targetRevisionId,
      decision,
      clinicalNotes: clinicalNotes || undefined,
    });
    setSubmitting(false);

    if (res.error) {
      setError(`[${res.error.code}] ${res.error.message}`);
    } else if (res.data) {
      setReviewResult(res.data);
    }
  };

  return (
    <div className="liquid-glass-primary p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 tracking-tight">Clinical Review Board Oversight</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-10.5">
            Authoritative clinical review submission enforcing reviewer qualifications, active accepted assignment, and author separation.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-700 flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {reviewResult && (
        <div className="p-4.5 rounded-2xl bg-teal-500/10 border border-teal-500/25 text-xs text-teal-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-teal-800">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            <span>Clinical Review Submitted Successfully</span>
          </div>
          <p className="font-mono text-[11px] text-slate-600">
            Approval ID: {reviewResult.approvalId || 'N/A'} | Revision Status: {reviewResult.revisionStatus}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="mint" className="text-[10px] rounded-lg">
              Decision: {reviewResult.decision}
            </Badge>
            <Badge variant={reviewResult.quorumSatisfied ? 'mint' : 'outline'} className="text-[10px] rounded-lg">
              Quorum Satisfied: {reviewResult.quorumSatisfied ? 'YES' : 'PENDING ADDITIONAL REVIEWS'}
            </Badge>
          </div>
        </div>
      )}

      {/* Review Submission Form */}
      <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Target Revision UUID</label>
            <input
              type="text"
              value={targetRevisionId}
              onChange={(e) => setTargetRevisionId(e.target.value)}
              placeholder="Revision UUID..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all shadow-sm"
              required
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Clinical Evaluation Decision</label>
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all shadow-sm"
            >
              <option value="APPROVED">APPROVED (Meets Evidence & Accuracy Standards)</option>
              <option value="REJECTED">REJECTED (Requires Clinical Revision)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1.5">Clinical Notes & Justification</label>
          <textarea
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Document clinical observations, guideline references, and safety assessments..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur-sm text-slate-800 text-xs h-24 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all shadow-sm resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/60">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldAlert className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Author-reviewer separation strictly enforced by server authorization pipeline.</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold text-xs transition-all shadow-sm hover:shadow-teal-500/20 disabled:opacity-50"
          >
            {submitting ? 'Submitting Review...' : 'Submit Clinical Evaluation'}
          </button>
        </div>
      </form>
    </div>
  );
}
