/**
 * Tests for the skill's structure: SKILL.md validity, frontmatter
 * shape, presence of required files.
 *
 * The skill is the deliverable. If the structure is wrong, it
 * won't load in Pi.
 */

import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const SKILL_DIR = path.resolve("skill");
const SKILL_MD = path.join(SKILL_DIR, "SKILL.md");

function read(p) {
  return fs.readFileSync(p, "utf8");
}

function exists(p) {
  return fs.existsSync(p);
}

describe("SKILL.md structure", () => {
  it("exists", () => {
    expect(exists(SKILL_MD)).toBe(true);
  });

  it("starts with YAML frontmatter", () => {
    const content = read(SKILL_MD);
    expect(content.startsWith("---\n")).toBe(true);
    const closeIdx = content.indexOf("\n---\n", 4);
    expect(closeIdx).toBeGreaterThan(0);
  });

  it("has a `name` field in frontmatter", () => {
    const content = read(SKILL_MD);
    const front = content.slice(0, content.indexOf("\n---\n", 4));
    expect(front).toMatch(/^name:\s*[a-z0-9-]+\s*$/m);
  });

  it("has a `description` field in frontmatter", () => {
    const content = read(SKILL_MD);
    const front = content.slice(0, content.indexOf("\n---\n", 4));
    expect(front).toMatch(/^description:/m);
  });

  it("description is multi-line and at least 100 chars", () => {
    const content = read(SKILL_MD);
    const front = content.slice(0, content.indexOf("\n---\n", 4));
    const m = front.match(/^description:\s*\|([\s\S]*?)(?=^\w|\Z)/m);
    if (!m) {
      // try multi-line without |
      const inlineMatch = front.match(/^description:\s*(.+)$/m);
      expect(inlineMatch[1].length).toBeGreaterThanOrEqual(100);
      return;
    }
    expect(m[1].trim().length).toBeGreaterThanOrEqual(100);
  });

  it("description mentions trigger phrases", () => {
    const content = read(SKILL_MD);
    // The description should help the model decide when to load
    // this skill. It should mention at least one trigger phrase.
    const front = content.slice(0, content.indexOf("\n---\n", 4));
    const descSection = front.match(/description:[\s\S]*?(?=^\w|\Z)/m);
    const descText = descSection ? descSection[0] : front;
    expect(descText).toMatch(/DNA|spec|specification/i);
  });

  it("body contains all phase names", () => {
    const content = read(SKILL_MD);
    expect(content).toMatch(/Discover/i);
    expect(content).toMatch(/Plan/i);
    expect(content).toMatch(/Tasks?/);
    expect(content).toMatch(/Diff|Regenerat/i);
  });

  it("body describes the fundamental rule", () => {
    const content = read(SKILL_MD);
    expect(content).toMatch(/No code change.*DNA/i);
  });

  it("body describes AGENTS.md role", () => {
    const content = read(SKILL_MD);
    expect(content).toMatch(/AGENTS\.md/);
    expect(content).toMatch(/session memory|summary|index/i);
  });
});

describe("skill directory structure", () => {
  it("contains SKILL.md, templates/, prompts/, references/", () => {
    expect(exists(SKILL_MD)).toBe(true);
    expect(exists(path.join(SKILL_DIR, "templates"))).toBe(true);
    expect(exists(path.join(SKILL_DIR, "prompts"))).toBe(true);
    expect(exists(path.join(SKILL_DIR, "references"))).toBe(true);
  });

  it("contains AGENTS-TEMPLATE.md", () => {
    expect(exists(path.join(SKILL_DIR, "AGENTS-TEMPLATE.md"))).toBe(true);
  });

  it("every required file is non-empty", () => {
    const required = [
      "SKILL.md",
      "AGENTS-TEMPLATE.md",
      "templates/vision.md",
      "templates/domain.md",
      "templates/feature.md",
      "templates/flow.md",
      "templates/requirements.md",
      "templates/plan.md",
      "templates/tasks.md",
      "prompts/discover.md",
      "prompts/plan.md",
      "prompts/tasks.md",
      "prompts/diff.md",
      "references/dna-philosophy.md",
      "references/flow-examples.md",
    ];
    for (const f of required) {
      const p = path.join(SKILL_DIR, f);
      expect(exists(p), `missing: ${f}`).toBe(true);
      const content = read(p);
      expect(content.length, `empty: ${f}`).toBeGreaterThan(200);
    }
  });

  it("every template has a clear comment block at the top", () => {
    const templates = [
      "templates/vision.md",
      "templates/domain.md",
      "templates/feature.md",
      "templates/flow.md",
      "templates/requirements.md",
      "templates/plan.md",
      "templates/tasks.md",
    ];
    for (const t of templates) {
      const content = read(path.join(SKILL_DIR, t));
      // Templates should have a level marker or purpose statement
      // in the first 5 lines
      const head = content.split("\n").slice(0, 5).join("\n");
      expect(head.length, `${t} has no header`).toBeGreaterThan(20);
    }
  });

  it("every prompt file references its phase", () => {
    const prompts = {
      "prompts/discover.md": /Discover/i,
      "prompts/plan.md": /Plan/i,
      "prompts/tasks.md": /Tasks?/i,
      "prompts/diff.md": /Diff|Regenerat/i,
    };
    for (const [file, pattern] of Object.entries(prompts)) {
      const content = read(path.join(SKILL_DIR, file));
      expect(content, `${file} does not mention its phase`).toMatch(pattern);
    }
  });
});
