import {
  vnextGraphEdges,
  vnextGraphAdjudicationRecords,
} from "../src/data/vnextGraph";
import { vnextGraphMigrationLedger } from "../src/data/vnextGraphMigration";
import { vnextSpecialistRelationCoverage } from "../src/data/vnextSpecialistRelationCoverage";
import { vnextConstructRegistry } from "../src/data/vnextConstructs";
import { vnextEvidenceCards } from "../src/data/vnextEvidenceCards";
import { vnextOntologyNodes } from "../src/data/vnextOntology";
import { vnextSurfaceManifests } from "../src/data/vnextSurfaceManifests";
import { vnextShadowResultContract } from "../src/data/vnextShadow";
import { assertVNextConstructs } from "../src/validation/vnextConstructs";
import { assertVNextEvidenceCards } from "../src/validation/vnextEvidenceCards";
import { assertVNextGraph } from "../src/validation/vnextGraph";
import { assertVNextOntology } from "../src/validation/vnextOntology";
import { assertVNextShadow } from "../src/validation/vnextShadow";
import { assertVNextSurfaceManifests } from "../src/validation/vnextSurfaceManifests";

assertVNextOntology();
assertVNextGraph();
assertVNextConstructs();
assertVNextSurfaceManifests();
assertVNextEvidenceCards();
assertVNextShadow();
if (vnextGraphAdjudicationRecords.length !== vnextGraphEdges.length)
  throw new Error("graph adjudication records do not cover every edge");
if (vnextGraphMigrationLedger.length !== 64)
  throw new Error(
    "historical graph migration ledger is not the approved 64-edge ledger",
  );
if (vnextShadowResultContract.productionConsumed)
  throw new Error("shadow contract is wired into production consumption");

console.log(
  JSON.stringify(
    {
      ontologyNodes: vnextOntologyNodes.length,
      graphEdges: vnextGraphEdges.length,
      graphAdjudications: vnextGraphAdjudicationRecords.length,
      specialistRelationCoverage: vnextSpecialistRelationCoverage.length,
      historicalGraphEdges: vnextGraphMigrationLedger.length,
      roots: vnextConstructRegistry.roots.length,
      facets: vnextConstructRegistry.facets.length,
      localConstructs: vnextConstructRegistry.localConstructs.length,
      evidenceCards: vnextEvidenceCards.length,
      surfaces: vnextSurfaceManifests.map((manifest) => ({
        surface: manifest.surface,
        items: manifest.itemIds.length,
        status: manifest.status,
      })),
    },
    null,
    2,
  ),
);
