/**
 * Tests for the example DNA projects.
 *
 * Each example should:
 *   - Have all required files (vision, domains, features, flows,
 *     requirements, plan, tasks, AGENTS.md)
 *   - Have AGENTS.md that points at real files
 *   - Have task IDs that are unique and stable
 *   - Have all internal links (e.g. "../domains/auth.md") resolve
 */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const EXAMPLES_DIR = path.resolve("examples");

const EXAMPLES = ["saas-app", "cli-tool", "api-service"];

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function exists(p) {
  return fs.existsSync(p);
}

function listFiles(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) return listFiles(full);
    return [full];
  });
}

describe("examples structure", () => {
  for (const example of EXAMPLES) {
    describe(example, () => {
      const dir = path.join(EXAMPLES_DIR, example);
      const dnaDir = path.join(dir, "dna");

      it("has a README.md and AGENTS.md", () => {
        expect(exists(path.join(dir, "README.md"))).toBe(true);
        expect(exists(path.join(dir, "AGENTS.md"))).toBe(true);
      });

      it("has a dna/ directory with vision, domains, features, flows, requirements", () => {
        expect(exists(dnaDir)).toBe(true);
        expect(exists(path.join(dnaDir, "vision.md"))).toBe(true);
        expect(exists(path.join(dnaDir, "domains"))).toBe(true);
        expect(exists(path.join(dnaDir, "features"))).toBe(true);
        expect(exists(path.join(dnaDir, "flows"))).toBe(true);
        expect(exists(path.join(dnaDir, "requirements.md"))).toBe(true);
      });

      it("has at least one domain file", () => {
        const files = fs.readdirSync(path.join(dnaDir, "domains"));
        const md = files.filter((f) => f.endsWith(".md"));
        expect(md.length).toBeGreaterThanOrEqual(2);
      });

      it("has at least one feature file", () => {
        const files = listFiles(path.join(dnaDir, "features"));
        const md = files.filter((f) => f.endsWith(".md"));
        expect(md.length).toBeGreaterThanOrEqual(2);
      });

      it("has at least one flow file", () => {
        const files = fs.readdirSync(path.join(dnaDir, "flows"));
        const md = files.filter((f) => f.endsWith(".md"));
        expect(md.length).toBeGreaterThanOrEqual(1);
      });

      it("has a plan.md and tasks.md in implementation/", () => {
        const impl = path.join(dnaDir, "implementation");
        expect(exists(impl)).toBe(true);
        expect(exists(path.join(impl, "plan.md"))).toBe(true);
        expect(exists(path.join(impl, "tasks.md"))).toBe(true);
      });

      it("tasks.md has unique, stable task IDs", () => {
        const tasks = read(path.join(dnaDir, "implementation", "tasks.md"));
        const ids = [...tasks.matchAll(/\*\*T-(\d{3})\*\*/g)].map((m) => m[1]);
        expect(ids.length).toBeGreaterThan(0);
        const unique = new Set(ids);
        expect(unique.size, "duplicate task IDs").toBe(ids.length);
        // IDs should be sequential and zero-padded
        const sorted = [...ids].sort();
        const expected = sorted.map((_, i) => String(i + 1).padStart(3, "0"));
        expect(sorted).toEqual(expected);
      });

      it("every internal link in DNA files resolves", () => {
        const dnaFiles = listFiles(dnaDir);
        let linkCount = 0;
        for (const file of dnaFiles) {
          if (!file.endsWith(".md")) continue;
          const content = read(file);
          // Find relative md links
          const links = [...content.matchAll(/\]\(([^)]+\.md)(?:#[^)]*)?\)/g)].map(
            (m) => m[1]
          );
          for (const link of links) {
            if (link.startsWith("http")) continue;
            if (link.startsWith("#")) continue;
            // Resolve relative to file location
            const resolved = path.normalize(path.join(path.dirname(file), link));
            expect(
              exists(resolved),
              `Broken link in ${path.relative(dir, file)}: ${link} -> ${path.relative(
                dir,
                resolved
              )}`
            ).toBe(true);
            linkCount++;
          }
        }
        // Sanity: there should be at least some links
        expect(linkCount).toBeGreaterThan(0);
      });

      it("AGENTS.md lists files that actually exist", () => {
        const agents = read(path.join(dir, "AGENTS.md"));
        // Find [text](relative/path) links
        const links = [...agents.matchAll(/\]\(([^)]+)\)/g)]
          .map((m) => m[1])
          .filter((l) => !l.startsWith("http") && !l.startsWith("#"));
        for (const link of links) {
          const resolved = path.normalize(path.join(dir, link));
          expect(
            exists(resolved),
            `AGENTS.md points at missing file: ${link}`
          ).toBe(true);
        }
      });
    });
  }
});
