// apps/admin/src/features/governance/CoiManagementPanel.tsx
// DentalVis Admin — Conflict of Interest (COI) Management Component
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-D

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@dentalvis/ui';
import { FileText, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { governanceApi, CoiDeclarationDto } from '../../lib/governanceApi';

export function CoiManagementPanel({ procedureId, revisionId }: { procedureId?: string; revisionId?: string }) {
  const [declaration, setDeclaration] = useState<CoiDeclarationDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Submit Declaration State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [hasFinancialInterest, setHasFinancialInterest] = useState(false);
  const [hasInstitutionalAffiliation, setHasInstitutionalAffiliation] = useState(false);
  const [hasAuthorRelationship, setHasAuthorRelationship] = useState(false);
  const [hasCommercialSponsorship, setHasCommercialSponsorship] = useState(false);
  const [conflictDetails, setConflictDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Admin Assessment State
  const [assessing, setAssessing] = useState(false);
  const [assessmentNotes, setAssessmentNotes] = useState('');

  const fetchActiveCoi = async () => {
    setLoading(true);
    setError(null);
    const res = await governanceApi.getActiveCoiDeclaration({ procedureId, revisionId });
    setLoading(false);
    if (res.error) {
      if (res.status === 404) {
        setDeclaration(null);
      } else {
        setError(`[${res.error.code}] ${res.error.message}`);
      }
    } else if (res.data) {
      setDeclaration(res.data);
    }
  };

  useEffect(() => {
    fetchActiveCoi();
  }, [procedureId, revisionId]);

  const handleSubmitDeclaration = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMsg(null);

    const expiresAt = new Date(Date.now() + 365 * 86400000).toISOString();
    const res = await governanceApi.submitCoiDeclaration({
      targetProcedureId: procedureId,
      targetRevisionId: revisionId,
      hasFinancialInterest,
      hasInstitutionalAffiliation,
      hasAuthorRelationship,
      hasCommercialSponsorship,
      conflictDetails: conflictDetails || undefined,
      expiresAt,
    });
    setSubmitting(false);

    if (res.error) {
      setError(`[${res.error.code}] ${res.error.message}`);
    } else {
      setSuccessMsg('Conflict of Interest declaration submitted successfully.');
      setShowSubmitModal(false);
      fetchActiveCoi();
    }
  };

  const handleAssess = async (outcome: 'VERIFIED_CLEAR' | 'RECUSED') => {
    if (!declaration) return;
    setAssessing(true);
    setError(null);
    setSuccessMsg(null);

    const res = await governanceApi.assessCoiDeclaration({
      declarationId: declaration.id,
      outcome,
      assessmentNotes: assessmentNotes || undefined,
    });
    setAssessing(false);

    if (res.error) {
      setError(`[${res.error.code}] ${res.error.message}`);
    } else {
      setSuccessMsg(`Declaration successfully assessed as ${outcome}.`);
      fetchActiveCoi();
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0D9488]" />
            <h3 className="font-bold text-lg text-[#134E4A]">Conflict of Interest (COI) Disclosures</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative reviewer disclosures and administrative vetting status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchActiveCoi} disabled={loading} className="gap-1.5 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          {!declaration && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowSubmitModal(true)}
              className="text-xs"
            >
              Submit Disclosure
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-xs text-[#134E4A]">New COI Declaration</span>
            <Button variant="ghost" size="sm" onClick={() => setShowSubmitModal(false)} className="text-xs h-6 px-2">
              Cancel
            </Button>
          </div>
          <form onSubmit={handleSubmitDeclaration} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFinancialInterest}
                  onChange={(e) => setHasFinancialInterest(e.target.checked)}
                />
                <span>Financial Interest in Sponsor/Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInstitutionalAffiliation}
                  onChange={(e) => setHasInstitutionalAffiliation(e.target.checked)}
                />
                <span>Institutional Affiliation with Author</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAuthorRelationship}
                  onChange={(e) => setHasAuthorRelationship(e.target.checked)}
                />
                <span>Personal/Professional Relationship with Author</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCommercialSponsorship}
                  onChange={(e) => setHasCommercialSponsorship(e.target.checked)}
                />
                <span>Commercial Sponsorship or Speaker Fees</span>
              </label>
            </div>

            <div>
              <label className="font-medium text-slate-700 block mb-1">Conflict Details (if any)</label>
              <textarea
                value={conflictDetails}
                onChange={(e) => setConflictDetails(e.target.value)}
                placeholder="Disclose relevant commercial or academic ties..."
                className="w-full px-3 py-2 border rounded-md text-xs h-16"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Confirm Submission'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Active Declaration View */}
      {declaration ? (
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#134E4A]">{declaration.id}</span>
              <Badge
                variant={
                  declaration.status === 'VERIFIED_CLEAR'
                    ? 'mint'
                    : declaration.status === 'CONFLICT_DECLARED' || declaration.status === 'RECUSED'
                    ? 'alert'
                    : 'default'
                }
                className="text-[10px]"
              >
                {declaration.status}
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400">
              Declared: {new Date(declaration.declaredAt).toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-white border">
              <span className="text-slate-400 block text-[10px]">Financial Interest</span>
              <span className="font-semibold">{declaration.hasFinancialInterest ? 'YES' : 'NO'}</span>
            </div>
            <div className="p-2 rounded bg-white border">
              <span className="text-slate-400 block text-[10px]">Institutional Affiliation</span>
              <span className="font-semibold">{declaration.hasInstitutionalAffiliation ? 'YES' : 'NO'}</span>
            </div>
            <div className="p-2 rounded bg-white border">
              <span className="text-slate-400 block text-[10px]">Author Relationship</span>
              <span className="font-semibold">{declaration.hasAuthorRelationship ? 'YES' : 'NO'}</span>
            </div>
            <div className="p-2 rounded bg-white border">
              <span className="text-slate-400 block text-[10px]">Commercial Sponsorship</span>
              <span className="font-semibold">{declaration.hasCommercialSponsorship ? 'YES' : 'NO'}</span>
            </div>
          </div>

          {declaration.conflictDetails && (
            <p className="text-xs text-slate-600 bg-white p-3 rounded border">
              <strong className="text-slate-700">Disclosed Details:</strong> {declaration.conflictDetails}
            </p>
          )}

          {/* Admin Assessment Actions */}
          {declaration.status === 'SUBMITTED' && (
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Optional assessment notes..."
                value={assessmentNotes}
                onChange={(e) => setAssessmentNotes(e.target.value)}
                className="text-xs px-3 py-1.5 border rounded-md flex-1 bg-white"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAssess('RECUSED')}
                  disabled={assessing}
                  className="text-xs text-red-600 hover:bg-red-50"
                >
                  Recuse
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleAssess('VERIFIED_CLEAR')}
                  disabled={assessing}
                  className="text-xs"
                >
                  Clear Declaration
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        !loading && (
          <div className="py-6 text-center text-xs text-slate-500">
            No active COI declaration found for this clinical context.
          </div>
        )
      )}
    </Card>
  );
}
