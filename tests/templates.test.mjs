/**
 * Tests for the DNA file templates.
 *
 * Templates should:
 *   - Exist for every level
 *   - Be non-empty
 *   - Match the structure used in the example projects
 *   - Have clear level markers in the header
 */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const TEMPLATES_DIR = path.resolve("skill", "templates");

function read(p) {
  return fs.readFileSync(p, "utf8");
}

const REQUIRED = [
  "vision.md",
  "domain.md",
  "feature.md",
  "flow.md",
  "requirements.md",
  "plan.md",
  "tasks.md",
];

describe("templates", () => {
  for (const t of REQUIRED) {
    describe(t, () => {
      const p = path.join(TEMPLATES_DIR, t);

      it("exists", () => {
        expect(fs.existsSync(p)).toBe(true);
      });

      it("is non-trivial (> 500 chars)", () => {
        const content = read(p);
        expect(content.length).toBeGreaterThan(500);
      });

      it("starts with a level marker (Level N or auto-generated note)", () => {
        const content = read(p);
        const head = content.split("\n").slice(0, 3).join("\n");
        // Either a "Level N" marker or an "Auto-generated" note
        expect(head).toMatch(/Level \d|Auto-generated/i);
      });

      it("has section headings", () => {
        const content = read(p);
        // Should have at least 2 markdown headings
        const headings = content.match(/^## /gm) || [];
        expect(headings.length).toBeGreaterThanOrEqual(2);
      });
    });
  }

  describe("vision.md", () => {
    it("has Mission, Goal, Philosophy, Non-goals sections", () => {
      const content = read(path.join(TEMPLATES_DIR, "vision.md"));
      expect(content).toMatch(/Mission/);
      expect(content).toMatch(/Goal/);
      expect(content).toMatch(/Philosophy/);
      expect(content).toMatch(/Non-goals/);
    });
  });

  describe("domain.md", () => {
    it("has Purpose, Scope, Out of scope, Depends on sections", () => {
      const content = read(path.join(TEMPLATES_DIR, "domain.md"));
      expect(content).toMatch(/Purpose/);
      expect(content).toMatch(/Scope/);
      expect(content).toMatch(/Out of scope/);
      expect(content).toMatch(/Depends on/);
    });
  });

  describe("feature.md", () => {
    it("has What it does, Why it exists, Inputs, Outputs sections", () => {
      const content = read(path.join(TEMPLATES_DIR, "feature.md"));
      expect(content).toMatch(/What it does/);
      expect(content).toMatch(/Why it exists/);
      expect(content).toMatch(/Inputs/);
      expect(content).toMatch(/Outputs/);
      expect(content).toMatch(/Happy path/);
    });
  });

  describe("flow.md", () => {
    it("has Trigger, Goal, Pre-conditions, Steps sections", () => {
      const content = read(path.join(TEMPLATES_DIR, "flow.md"));
      expect(content).toMatch(/Trigger/);
      expect(content).toMatch(/Goal/);
      expect(content).toMatch(/Pre-conditions/);
      expect(content).toMatch(/Steps/);
      expect(content).toMatch(/Failure modes/);
    });
  });

  describe("requirements.md", () => {
    it("groups by category and uses 'must' language", () => {
      const content = read(path.join(TEMPLATES_DIR, "requirements.md"));
      expect(content).toMatch(/Security/);
      expect(content).toMatch(/must/);
    });
  });
});
