// apps/admin/src/features/governance/ClinicalReviewOversightPanel.tsx
// DentalVis Admin — Clinical Review Oversight Component
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-D

import React, { useState } from 'react';
import { Card, Button, Badge } from '@dentalvis/ui';
import { Award, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { governanceApi, ClinicalReviewResultDto } from '../../lib/governanceApi';

export function ClinicalReviewOversightPanel({ revisionId }: { revisionId?: string }) {
  const [targetRevisionId, setTargetRevisionId] = useState(revisionId || '');
  const [decision, setDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [rubricScore, setRubricScore] = useState(90);

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
      rubricScore,
    });
    setSubmitting(false);

    if (res.error) {
      setError(`[${res.error.code}] ${res.error.message}`);
    } else if (res.data) {
      setReviewResult(res.data);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#0D9488]" />
            <h3 className="font-bold text-lg text-[#134E4A]">Clinical Review Board Oversight</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative clinical review submission enforcing reviewer qualifications, active accepted assignment, and author separation.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {reviewResult && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Clinical Review Submitted Successfully</span>
          </div>
          <p className="font-mono text-[11px]">
            Approval ID: {reviewResult.approvalId || 'N/A'} | Revision Status: {reviewResult.revisionStatus}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="mint" className="text-[10px]">
              Decision: {reviewResult.decision}
            </Badge>
            <Badge variant={reviewResult.quorumSatisfied ? 'mint' : 'outline'} className="text-[10px]">
              Quorum Satisfied: {reviewResult.quorumSatisfied ? 'YES' : 'PENDING ADDITIONAL REVIEWS'}
            </Badge>
          </div>
        </div>
      )}

      {/* Review Submission Form */}
      <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-slate-700 block mb-1">Target Revision UUID</label>
            <input
              type="text"
              value={targetRevisionId}
              onChange={(e) => setTargetRevisionId(e.target.value)}
              placeholder="Revision UUID..."
              className="w-full px-3 py-2 border rounded-md font-mono text-xs"
              required
            />
          </div>

          <div>
            <label className="font-medium text-slate-700 block mb-1">Clinical Evaluation Decision</label>
            <select
              value={decision}
              onChange={(e) => setDecision(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-md text-xs bg-white"
            >
              <option value="APPROVED">APPROVED (Meets Evidence & Accuracy Standards)</option>
              <option value="REJECTED">REJECTED (Requires Clinical Revision)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-medium text-slate-700 block mb-1">Rubric Score (0 - 100)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={rubricScore}
            onChange={(e) => setRubricScore(parseInt(e.target.value, 10))}
            className="w-32 px-3 py-1.5 border rounded-md text-xs"
            required
          />
        </div>

        <div>
          <label className="font-medium text-slate-700 block mb-1">Clinical Notes & Justification</label>
          <textarea
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Document clinical observations, guideline references, and safety assessments..."
            className="w-full px-3 py-2 border rounded-md text-xs h-20"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <ShieldAlert className="w-3.5 h-3.5 text-[#0D9488]" />
            <span>Author-reviewer separation strictly enforced by server authorization pipeline.</span>
          </div>

          <Button variant="primary" size="sm" type="submit" disabled={submitting}>
            {submitting ? 'Submitting Review...' : 'Submit Clinical Evaluation'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
