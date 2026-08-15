import { VNEXT_CHALLENGER_FAMILIES } from "../types";
import type {
  VNextChallengerResult,
  VNextChallengerSpecification,
} from "../types";
import {
  vnextChallengerSpecifications,
  vnextChallengerSpecificationById,
} from "../data/vnextChallengers";
import {
  vnextSpecialistItemIdsByModule,
  vnextSurfaceManifestById,
} from "../data/vnextSurfaceManifests";

export function vnextChallengerSpecificationErrors(
  specifications: readonly VNextChallengerSpecification[] = vnextChallengerSpecifications,
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const specification of specifications) {
    if (ids.has(specification.id))
      errors.push(`duplicate challenger ${specification.id}`);
    ids.add(specification.id);
    if (!VNEXT_CHALLENGER_FAMILIES.includes(specification.family)) {
      errors.push(`${specification.id} has an unknown challenger family`);
    }
    if (!specification.preregistrationId.trim())
      errors.push(`${specification.id} lacks preregistration`);
    if (!Number.isInteger(specification.seed) || specification.seed < 0)
      errors.push(`${specification.id} has an invalid seed`);
    if (
      specification.heldOutSplit !== "confirmation" &&
      specification.heldOutSplit !== "replication"
    ) {
      errors.push(`${specification.id} is not held out`);
    }
    if (specification.missingnessPolicy.completeCaseIsDefault) {
      errors.push(`${specification.id} incorrectly defaults to complete cases`);
    }
    if (specification.missingnessPolicy.missingStates.length === 0) {
      errors.push(`${specification.id} lacks explicit missingness states`);
    }
    if (!specification.versionBundle.vnextChallengerModelsVersion) {
      errors.push(`${specification.id} lacks challenger version provenance`);
    }
    if (!specification.provenance.includes("I-009"))
      errors.push(`${specification.id} lacks I-009 traceability`);
    const surface = vnextSurfaceManifestById.get(
      specification.surfaceManifestId,
    );
    if (!surface) {
      errors.push(
        `${specification.id} references an unknown analysis surface manifest`,
      );
    } else if (specification.moduleId) {
      if (surface.surface !== "specialist")
        errors.push(
          `${specification.id} Specialist challenger is not scoped to the Specialist surface`,
        );
      const expected =
        vnextSpecialistItemIdsByModule.get(specification.moduleId) ?? [];
      if (
        JSON.stringify([...specification.itemIds].sort()) !==
        JSON.stringify([...expected].sort())
      )
        errors.push(
          `${specification.id} does not consume its declared module-local roster`,
        );
      if (
        specification.itemIds.some(
          (itemId) => !surface.itemIds.includes(itemId),
        )
      )
        errors.push(
          `${specification.id} contains an item outside the Specialist surface manifest`,
        );
    } else {
      if (surface.surface !== "core")
        errors.push(
          `${specification.id} non-Specialist challenger is not scoped to core`,
        );
      if (
        specification.itemIds.some(
          (itemId) => !surface.itemIds.includes(itemId),
        )
      )
        errors.push(
          `${specification.id} contains an item outside the core surface manifest`,
        );
    }
    if (
      specification.family === "production-baseline" &&
      (surface?.surface !== "core" || specification.moduleId)
    )
      errors.push(
        "production baseline challenger may consume only the core surface",
      );
  }
  const families = new Set(
    specifications.map((specification) => specification.family),
  );
  for (const family of VNEXT_CHALLENGER_FAMILIES) {
    if (!families.has(family))
      errors.push(`missing challenger family ${family}`);
  }
  return [...new Set(errors)];
}

export function vnextChallengerResultErrors(
  result: VNextChallengerResult,
): string[] {
  const errors: string[] = [];
  const specification = vnextChallengerSpecificationById.get(
    result.specificationId,
  );
  if (!specification)
    return [`unknown challenger specification ${result.specificationId}`];
  if (result.seed !== specification.seed)
    errors.push("challenger result seed does not match specification");
  if (result.split !== specification.heldOutSplit)
    errors.push("challenger result split does not match specification");
  if (result.status === "converged" && !result.convergence.converged)
    errors.push("converged result lacks convergence evidence");
  if (result.status === "nonconverged" && result.convergence.converged)
    errors.push("nonconverged result claims convergence");
  if (result.status === "converged" && result.estimates === undefined)
    errors.push("converged result lacks estimates");
  if (
    Object.values(result.missingnessSummary).some(
      (value) => !Number.isFinite(value) || value < 0,
    )
  ) {
    errors.push("challenger missingness summary contains an invalid count");
  }
  for (const disagreement of result.disagreementReviewQueue) {
    if (!disagreement.reviewRequired)
      errors.push(`${disagreement.id} bypasses disagreement review`);
  }
  return errors;
}

export function assertVNextChallengers(): void {
  const errors = vnextChallengerSpecificationErrors();
  if (errors.length > 0)
    throw new Error(
      `vNext challenger contract violation: ${errors.join("; ")}`,
    );
}
