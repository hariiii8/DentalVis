# DentalVis 2.0 — Architecture Baseline v1.9.1 Documentation

This directory contains the central source of truth for the DentalVis 2.0 system architecture.

- **Baseline Version:** 1.9.1
- **Status:** Phase 1 Frozen & Approved for Phase 2 Implementation
- **Key Invariants:**
  - Option A Bearer Token Rotation with recovery envelope and 10s recovery window.
  - Fail-Closed Distributed Revocation with authoritative startup baseline sweeps and durable consumer acknowledgements.
  - Universal Immutable Revisions across all content entities with append-only database triggers.
  - Patient Explore Taxonomy decoupled from clinical internal departments.
  - Liquid Glass Light Healthcare aesthetic (Mint/Teal/Slate) meeting WCAG AAA.
  - Strict healthcare boundary: Zero PHI, zero diagnostic triage, zero patient accounts.
