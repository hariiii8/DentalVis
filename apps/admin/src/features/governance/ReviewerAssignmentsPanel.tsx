// apps/admin/src/features/governance/ReviewerAssignmentsPanel.tsx
// DentalVis Admin — Reviewer Assignments Management Component
// Architecture Baseline v1.9.1 (FROZEN) — Milestone M6.1.5-D

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@dentalvis/ui';
import { UserCheck, Plus, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { governanceApi, ReviewerAssignmentDto } from '../../lib/governanceApi';

export function ReviewerAssignmentsPanel({ revisionId }: { revisionId?: string }) {
  const [assignments, setAssignments] = useState<ReviewerAssignmentDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Assignment Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [targetRevisionId, setTargetRevisionId] = useState(revisionId || '');
  const [targetReviewerId, setTargetReviewerId] = useState('');
  const [expiryDays, setExpiryDays] = useState('14');
  const [submitting, setSubmitting] = useState(false);

  const fetchAssignments = async () => {
    setLoading(true);
    setError(null);
    const res = await governanceApi.listAssignments({ revisionId: targetRevisionId || undefined });
    setLoading(false);
    if (res.error) {
      setError(`[${res.error.code}] ${res.error.message}`);
    } else if (res.data) {
      setAssignments(res.data);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [revisionId]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRevisionId || !targetReviewerId) {
      setError('Revision ID and Reviewer ID are required.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setActionSuccess(null);

    const expiresAt = new Date(Date.now() + parseInt(expiryDays, 10) * 86400000).toISOString();
    const res = await governanceApi.createAssignment({
      revisionId: targetRevisionId,
      reviewerId: targetReviewerId,
      expiresAt,
    });
    setSubmitting(false);

    if (res.error) {
      setError(`[${res.error.code}] ${res.error.message}`);
    } else {
      setActionSuccess('Reviewer assignment created successfully.');
      setShowCreateModal(false);
      setTargetReviewerId('');
      fetchAssignments();
    }
  };

  const handleTransition = async (assignmentId: string, action: 'ACCEPT' | 'DECLINE' | 'REVOKE') => {
    setError(null);
    setActionSuccess(null);
    const reason = action === 'REVOKE' ? 'Revoked by administrator via Editorial Portal.' : undefined;

    const res = await governanceApi.transitionAssignment(assignmentId, action, reason);
    if (res.error) {
      setError(`[${res.error.code}] ${res.error.message}`);
    } else {
      setActionSuccess(`Assignment successfully updated to ${res.data?.status}.`);
      fetchAssignments();
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#0D9488]" />
            <h3 className="font-bold text-lg text-[#134E4A]">Clinical Reviewer Assignments</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative revision reviewer pairings backed by PostgreSQL partial unique index enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchAssignments} disabled={loading} className="gap-1.5 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            className="gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Reviewer</span>
          </Button>
        </div>
      </div>

      {/* Status Banners */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Create Modal / Form */}
      {showCreateModal && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-xs text-[#134E4A]">New Reviewer Assignment</span>
            <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)} className="text-xs h-6 px-2">
              Cancel
            </Button>
          </div>
          <form onSubmit={handleCreateAssignment} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-medium text-slate-700 block mb-1">Target Revision UUID</label>
              <input
                type="text"
                value={targetRevisionId}
                onChange={(e) => setTargetRevisionId(e.target.value)}
                placeholder="e.g. 00000000-0000-..."
                className="w-full px-3 py-2 border rounded-md font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">Reviewer User UUID</label>
              <input
                type="text"
                value={targetReviewerId}
                onChange={(e) => setTargetReviewerId(e.target.value)}
                placeholder="Reviewer UUID"
                className="w-full px-3 py-2 border rounded-md font-mono text-xs"
                required
              />
            </div>
            <div>
              <label className="font-medium text-slate-700 block mb-1">Expiration Window (Days)</label>
              <select
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-xs bg-white"
              >
                <option value="7">7 Days</option>
                <option value="14">14 Days (Standard)</option>
                <option value="30">30 Days</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <Button variant="primary" size="sm" type="submit" disabled={submitting}>
                {submitting ? 'Creating Assignment...' : 'Confirm Assignment'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Assignment List */}
      <div className="divide-y divide-slate-100">
        {assignments.length === 0 && !loading && (
          <div className="py-8 text-center text-xs text-slate-500">
            No reviewer assignments recorded for this scope.
          </div>
        )}

        {assignments.map((a) => {
          const isAssigned = a.status === 'ASSIGNED';
          const isAccepted = a.status === 'ACCEPTED';
          const isCompleted = a.status === 'COMPLETED';

          return (
            <div key={a.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#134E4A]">{a.id.substring(0, 8)}...</span>
                  <Badge
                    variant={
                      isCompleted ? 'mint' : isAccepted ? 'default' : isAssigned ? 'outline' : 'alert'
                    }
                    className="text-[10px]"
                  >
                    {a.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 font-mono">
                  Revision: <span className="text-slate-800">{a.revisionId.substring(0, 13)}...</span> | Reviewer:{' '}
                  <span className="text-slate-800">{a.reviewerId.substring(0, 13)}...</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Assigned At: {new Date(a.assignedAt).toLocaleDateString()} | Expires:{' '}
                  {new Date(a.expiresAt).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {isAssigned && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTransition(a.id, 'ACCEPT')}
                      className="text-xs h-7 px-2"
                    >
                      Accept
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTransition(a.id, 'DECLINE')}
                      className="text-xs h-7 px-2 text-red-600 hover:bg-red-50"
                    >
                      Decline
                    </Button>
                  </>
                )}

                {(isAssigned || isAccepted) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTransition(a.id, 'REVOKE')}
                    className="text-xs h-7 px-2 text-slate-500 hover:text-red-700"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
