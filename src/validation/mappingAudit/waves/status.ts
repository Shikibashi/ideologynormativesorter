import { questionWaves, labelWaves, type AuditWave } from "./partition";
import {
  responseContributions,
  statementContributions,
} from "../manifests/responseContributions";
import { dossiers } from "../dossiers/index";
import { findingsForSubject } from "../findings/ledger";
import {
  needsRewriteById,
  semanticCorrections,
} from "../../../data/semanticAudit";

export type WaveCompletionStatus =
  | "complete-provisional"
  | "complete-applied"
  | "pending-qualified-expert";

export interface WaveStatusRecord {
  waveId: string;
  corpus: AuditWave["corpus"];
  subjectCount: number;
  subjectsWithRationaleOrClaims: number;
  subjectsWithFindings: number;
  openIssueSubjects: string[];
  status: WaveCompletionStatus;
  notes: string;
}

function poolForWave(wave: AuditWave) {
  if (wave.corpus === "main") return responseContributions;
  if (wave.corpus === "statement") return statementContributions;
  return [];
}

function questionWaveStatus(wave: AuditWave): WaveStatusRecord {
  const rows = poolForWave(wave).filter((r) =>
    wave.subjectIds.includes(r.questionId),
  );
  const covered = new Set(rows.map((r) => r.questionId));
  const withFindings = wave.subjectIds.filter(
    (id) => findingsForSubject(id).length > 0,
  );
  const openIssues = wave.subjectIds.filter((id) => {
    const fs = findingsForSubject(id);
    return fs.some(
      (f) =>
        f.lifecycle === "proposed" ||
        f.lifecycle === "domain-reviewed" ||
        f.lifecycle === "measurement-reviewed" ||
        f.lifecycle === "adjudicated",
    );
  });

  const knownMainIssues = new Set([
    ...Object.keys(semanticCorrections),
    ...Object.keys(needsRewriteById),
  ]);

  return {
    waveId: wave.waveId,
    corpus: wave.corpus,
    subjectCount: wave.subjectIds.length,
    subjectsWithRationaleOrClaims: covered.size,
    subjectsWithFindings: withFindings.length,
    openIssueSubjects: openIssues,
    status:
      openIssues.length === 0
        ? "complete-provisional"
        : "pending-qualified-expert",
    notes:
      wave.corpus === "main"
        ? `Main wave; overlay issues tracked for ${[...knownMainIssues].filter((id) => wave.subjectIds.includes(id)).length} subjects in wave.`
        : "Statement wave: shared with main bank ids; rewrite set handled via main semanticAudit.",
  };
}

function labelWaveStatus(wave: AuditWave): WaveStatusRecord {
  const withClaims = wave.subjectIds.filter((id) => {
    const d = dossiers.find((x) => x.labelId === id);
    return d != null && d.claims.length > 0;
  });
  return {
    waveId: wave.waveId,
    corpus: "labels",
    subjectCount: wave.subjectIds.length,
    subjectsWithRationaleOrClaims: withClaims.length,
    subjectsWithFindings: wave.subjectIds.filter(
      (id) => findingsForSubject(id).length > 0,
    ).length,
    openIssueSubjects: [],
    status: "complete-provisional",
    notes:
      "Dossier claim stubs present (definition/family/centroids); expert perspectives deferred.",
  };
}

export const waveStatusRecords: WaveStatusRecord[] = [
  ...questionWaves().map(questionWaveStatus),
  ...labelWaves().map(labelWaveStatus),
];

export function waveStatusById(waveId: string): WaveStatusRecord | undefined {
  return waveStatusRecords.find((w) => w.waveId === waveId);
}
