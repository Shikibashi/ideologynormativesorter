# v2 Research and Scoring Separation Audit

Phase 13 keeps the scoring kernel unchanged. The research client imports response contracts and creates a version-bound raw envelope. The Worker validates raw response shape and stores it. Neither location calculates normalized values, construct totals, profiles, modifiers, specialist outputs, uncertainty, or diagnostics.

The acceptance registry contains no contribution arrays, construct IDs, polarity, or weights. The research package contains no engine import. The Worker contains no scoring import. Architecture tests scan these boundaries. A replay test reconstructs an `AssessmentInput` for an offline caller; that caller, not research infrastructure, owns scoring.
