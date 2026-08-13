import type { ReviewRecord } from "../types";
import { seededFindingsAndReviews } from "../findings/ledger";

export const reviewRecords: ReviewRecord[] = seededFindingsAndReviews.reviews;

export function reviewById(reviewId: string): ReviewRecord | undefined {
  return reviewRecords.find((r) => r.reviewId === reviewId);
}

export function reviewsForFinding(findingId: string): ReviewRecord[] {
  return reviewRecords.filter((r) => r.findingId === findingId);
}
