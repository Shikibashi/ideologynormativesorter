import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ResearchSubmission } from "./index";
import {
  PENDING_RESEARCH_LEGACY_KEY,
  PENDING_RESEARCH_MAX_AGE_MS,
  PENDING_RESEARCH_PREFIX,
  clearAllPendingResearchSubmissions,
  deletePendingResearchSubmission,
  listPendingResearchSubmissions,
  loadPendingResearchSubmission,
  retryPendingResearchSubmission,
  savePendingResearchSubmission,
  submitPendingResearchSubmission,
  transitionPendingResearchSubmission,
} from "./pendingSubmission";

type MemoryStorage = Storage & { values: Map<string, string> };

function storage(): MemoryStorage {
  const values = new Map<string, string>();
  return {
    values,
    get length() {
      return values.size;
    },
    key(index) {
      return [...values.keys()][index] ?? null;
    },
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
    clear() {
      values.clear();
    },
  };
}

function submission(id: string, cohort = "cohort-a"): ResearchSubmission {
  return {
    schemaVersion: "schema",
    submissionId: id,
    recordType: "core",
    studyId: cohort,
    participantId: "participant",
    itemMap: [{ questionId: "q-pending" }],
    answers: {
      "q-pending": { questionId: "q-pending", value: 1 },
    },
  } as unknown as ResearchSubmission;
}

beforeEach(() => localStorage.clear());

describe("pending research submission recovery", () => {
  it("keeps concurrent submissions under distinct deterministic keys", () => {
    const store = storage();
    expect(
      savePendingResearchSubmission(
        submission("one"),
        "https://one.test/submit",
        "a",
        {
          storage: store,
        },
      ).saved,
    ).toBe(true);
    expect(
      savePendingResearchSubmission(
        submission("two"),
        "https://two.test/submit",
        "b",
        {
          storage: store,
        },
      ).saved,
    ).toBe(true);
    expect([...store.values.keys()].sort()).toEqual([
      `${PENDING_RESEARCH_PREFIX}one`,
      `${PENDING_RESEARCH_PREFIX}two`,
    ]);
    expect(listPendingResearchSubmissions({ storage: store })).toHaveLength(2);
  });
  it("enforces the fixed pending-record count bound", () => {
    const store = storage();
    for (let index = 0; index < 32; index += 1) {
      expect(
        savePendingResearchSubmission(
          submission(`bounded-${index}`),
          "/submit",
          "cohort-a",
          { storage: store },
        ).saved,
      ).toBe(true);
    }
    expect(
      savePendingResearchSubmission(
        submission("bounded-overflow"),
        "/submit",
        "cohort-a",
        { storage: store },
      ).saved,
    ).toBe(false);
    const other = storage();
    expect(
      savePendingResearchSubmission(
        submission("bounded-extra"),
        "/submit",
        "cohort-a",
        { storage: other },
      ).saved,
    ).toBe(true);
    store.setItem(
      `${PENDING_RESEARCH_PREFIX}bounded-extra`,
      other.getItem(`${PENDING_RESEARCH_PREFIX}bounded-extra`) ?? "",
    );
    expect(listPendingResearchSubmissions({ storage: store })).toHaveLength(33);
  });

  it("rejects new records when the aggregate bound is exceeded", () => {
    const store = storage();
    const padding = "x".repeat(1_400_000);
    for (let index = 0; index < 5; index += 1) {
      expect(
        savePendingResearchSubmission(
          {
            ...submission(`aggregate-${index}`),
            padding,
          } as unknown as ResearchSubmission,
          "/submit",
          "cohort-a",
          { storage: store },
        ).saved,
      ).toBe(true);
    }
    expect(
      savePendingResearchSubmission(
        {
          ...submission("aggregate-overflow"),
          padding,
        } as unknown as ResearchSubmission,
        "/submit",
        "cohort-a",
        { storage: store },
      ).saved,
    ).toBe(false);
    expect(listPendingResearchSubmissions({ storage: store })).toHaveLength(5);
  });
  it("fails closed on an immutable collision and preserves the first payload", () => {
    const store = storage();
    const first = submission("same", "first");
    expect(
      savePendingResearchSubmission(first, "/submit", "first", {
        storage: store,
      }).saved,
    ).toBe(true);
    const result = savePendingResearchSubmission(
      submission("same", "second"),
      "/other",
      "second",
      { storage: store },
    );
    expect(result.saved).toBe(false);
    expect(
      loadPendingResearchSubmission("same", { storage: store })?.payload,
    ).toEqual(first);
  });

  it("migrates the old singleton once and preserves its export-only state", () => {
    const store = storage();
    const record = submission("legacy");
    store.setItem(
      PENDING_RESEARCH_LEGACY_KEY,
      JSON.stringify({ submission: record, status: { status: "export-only" } }),
    );
    expect(listPendingResearchSubmissions({ storage: store })[0]?.state).toBe(
      "export-only",
    );
    expect(store.getItem(PENDING_RESEARCH_LEGACY_KEY)).toBeNull();
    expect(store.getItem(`${PENDING_RESEARCH_PREFIX}legacy`)).not.toBeNull();
  });

  it("enumerates after a reload without an in-memory singleton", () => {
    const first = storage();
    savePendingResearchSubmission(submission("reload"), "/submit", "cohort-a", {
      storage: first,
    });
    const reloaded = storage();
    for (const [key, value] of first.values) reloaded.setItem(key, value);
    expect(
      listPendingResearchSubmissions({ storage: reloaded })[0]?.submissionId,
    ).toBe("reload");
  });

  it("classifies success, dedupe, conflict, retryable, permanent, unknown, and network outcomes", async () => {
    const statuses = [202, 409, 429, 500, 403, 413, 422, 418];
    for (const status of statuses) {
      const store = storage();
      const id = `status-${status}`;
      const result = await submitPendingResearchSubmission(
        submission(id),
        "https://collector.test/submit",
        vi.fn().mockResolvedValue(
          new Response(
            status === 202 ? JSON.stringify({ deduplicated: true }) : "",
            {
              status,
              headers: status === 429 ? { "retry-after": "3" } : undefined,
            },
          ),
        ),
        { storage: store, now: () => 1_000_000 },
      );
      if (status === 202) {
        expect(result.status.status).toBe("submitted");
        expect(result.deduplicated).toBe(true);
        expect(listPendingResearchSubmissions({ storage: store })).toHaveLength(
          0,
        );
      } else {
        expect(result.status.status).toBe("failed");
        expect(
          loadPendingResearchSubmission(id, {
            storage: store,
            now: () => 1_000_000,
          })?.state,
        ).toBe(
          status === 409
            ? "conflict"
            : status === 429 || status === 500
              ? "retryable"
              : "failed",
        );
      }
    }
    const store = storage();
    const network = await submitPendingResearchSubmission(
      submission("network"),
      "https://collector.test/submit",
      vi.fn().mockRejectedValue(new Error("offline")),
      { storage: store },
    );
    expect(network.state).toBe("retryable");
  });
  it("durably marks an accepted submission before cleanup", async () => {
    const store = storage();
    store.removeItem = () => {
      throw new Error("cleanup unavailable");
    };
    const result = await submitPendingResearchSubmission(
      submission("accepted-durable"),
      "https://collector.test/submit",
      vi.fn().mockResolvedValue(new Response("", { status: 202 })),
      { storage: store, now: () => 1_000_000 },
    );
    expect(result.status.status).toBe("submitted");
    expect(result.persisted).toBe(true);
    expect(result.pending?.state).toBe("submitted");
    expect(
      JSON.parse(
        store.getItem(`${PENDING_RESEARCH_PREFIX}accepted-durable`) ?? "{}",
      ).state,
    ).toBe("submitted");
  });

  it("expires old records, supports explicit delete, and preserves storage failures", () => {
    const store = storage();
    const now = 10_000_000;
    const old = savePendingResearchSubmission(
      submission("old"),
      "/submit",
      "cohort-a",
      {
        storage: store,
        now: () => now - PENDING_RESEARCH_MAX_AGE_MS - 1,
      },
    );
    expect(old.saved).toBe(true);
    expect(
      listPendingResearchSubmissions({ storage: store, now: () => now }),
    ).toEqual([
      expect.objectContaining({
        submissionId: "old",
        state: "retention-expired",
      }),
    ]);
    expect(store.getItem(`${PENDING_RESEARCH_PREFIX}old`)).not.toBeNull();
    const current = savePendingResearchSubmission(
      submission("current"),
      "/submit",
      "cohort-a",
      {
        storage: store,
        now: () => now,
      },
    );
    expect(current.saved).toBe(true);
    expect(deletePendingResearchSubmission("current", { storage: store })).toBe(
      true,
    );
    const failing = storage();
    failing.setItem(`${PENDING_RESEARCH_PREFIX}kept`, "existing");
    failing.setItem = () => {
      throw new Error("quota");
    };
    const result = savePendingResearchSubmission(
      submission("kept"),
      "/submit",
      "cohort-a",
      {
        storage: failing,
      },
    );
    expect(result.saved).toBe(false);
    expect(failing.getItem(`${PENDING_RESEARCH_PREFIX}kept`)).toBe("existing");
    expect(clearAllPendingResearchSubmissions({ storage: store })).toBe(true);
  });
  it("rejects malformed persisted timestamps and states without touching siblings", () => {
    const store = storage();
    expect(
      savePendingResearchSubmission(
        submission("valid-sibling"),
        "/submit",
        "a",
        {
          storage: store,
        },
      ).saved,
    ).toBe(true);
    expect(
      savePendingResearchSubmission(submission("malformed"), "/submit", "a", {
        storage: store,
      }).saved,
    ).toBe(true);
    const key = `${PENDING_RESEARCH_PREFIX}malformed`;
    const raw = JSON.parse(store.getItem(key) ?? "{}");
    raw.updatedAt = "invalid";
    raw.state = "unknown";
    store.setItem(key, JSON.stringify(raw));
    expect(
      loadPendingResearchSubmission("malformed", { storage: store }),
    ).toBeNull();
    expect(
      loadPendingResearchSubmission("valid-sibling", { storage: store }),
    ).not.toBeNull();
    expect(store.getItem(key)).not.toBeNull();
  });
  it("rejects malformed prefixes and tampered route/cohort values", () => {
    const store = storage();
    expect(
      savePendingResearchSubmission(
        submission("integrity"),
        "/submit",
        "cohort-a",
        {
          storage: store,
        },
      ).saved,
    ).toBe(true);
    const key = `${PENDING_RESEARCH_PREFIX}integrity`;
    const raw = store.getItem(key) ?? "";
    store.setItem(`${PENDING_RESEARCH_PREFIX}wrong-key`, raw);
    expect(listPendingResearchSubmissions({ storage: store })).toHaveLength(1);
    expect(store.getItem(`${PENDING_RESEARCH_PREFIX}wrong-key`)).not.toBeNull();

    const tampered = JSON.parse(raw);
    tampered.route = "/evil";
    store.setItem(key, JSON.stringify(tampered));
    expect(
      loadPendingResearchSubmission("integrity", { storage: store }),
    ).toBeNull();

    tampered.route = "/submit";
    tampered.cohort = "other-cohort";
    store.setItem(key, JSON.stringify(tampered));
    expect(
      loadPendingResearchSubmission("integrity", { storage: store }),
    ).toBeNull();
  });

  it("rejects noncanonical timestamps and honors retry backoff", async () => {
    const store = storage();
    expect(
      savePendingResearchSubmission(
        submission("backoff"),
        "/submit",
        "cohort-a",
        {
          storage: store,
          now: () => 1_000_000,
        },
      ).saved,
    ).toBe(true);
    const key = `${PENDING_RESEARCH_PREFIX}backoff`;
    const raw = JSON.parse(store.getItem(key) ?? "{}");
    raw.updatedAt = "1970-01-01T00:16:40Z";
    store.setItem(key, JSON.stringify(raw));
    expect(
      loadPendingResearchSubmission("backoff", {
        storage: store,
        now: () => 1_000_000,
      }),
    ).toBeNull();

    const retryStore = storage();
    expect(
      savePendingResearchSubmission(
        submission("retry-backoff"),
        "/submit",
        "cohort-a",
        {
          storage: retryStore,
          now: () => 1_000_000,
        },
      ).saved,
    ).toBe(true);
    expect(
      transitionPendingResearchSubmission("retry-backoff", "retryable", {
        storage: retryStore,
        now: () => 1_000_000,
        retryAfterMs: 5_000,
      }).saved,
    ).toBe(true);
    const send = vi.fn();
    const result = await retryPendingResearchSubmission("retry-backoff", send, {
      storage: retryStore,
      now: () => 1_001_000,
    });
    expect(result?.retryAfterMs).toBe(4_000);
    expect(send).not.toHaveBeenCalled();
  });
  it("does not retry terminal export-only records", async () => {
    const store = storage();
    expect(
      savePendingResearchSubmission(submission("terminal"), "/submit", "a", {
        storage: store,
      }).saved,
    ).toBe(true);
    expect(
      transitionPendingResearchSubmission("terminal", "export-only", {
        storage: store,
      }).saved,
    ).toBe(true);
    const send = vi.fn();
    expect(
      await retryPendingResearchSubmission("terminal", send, {
        storage: store,
      }),
    ).toBeNull();
    expect(send).not.toHaveBeenCalled();
  });
});
