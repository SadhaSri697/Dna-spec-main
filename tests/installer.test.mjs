/**
 * Tests for the dna-spec CLI installer.
 *
 * Strategy: run the actual CLI in a temp directory and verify
 * the side effects (files copied, exit codes, output).
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CLI = path.resolve("bin/dna-spec.mjs");

function runCli(args, env = {}) {
  return spawnSync(process.execPath, [CLI, ...args], {
    env: { ...process.env, ...env, NO_COLOR: "1" },
    encoding: "utf8",
  });
}

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "dna-spec-test-"));
}

describe("dna-spec installer", () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = makeTempDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("prints help on `help`", () => {
    const r = runCli(["help"]);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage:/);
    expect(r.stdout).toMatch(/install/);
    expect(r.stdout).toMatch(/uninstall/);
    expect(r.stdout).toMatch(/update/);
  });

  it("prints help on `--help`", () => {
    const r = runCli(["--help"]);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Usage:/);
  });

  it("rejects unknown subcommands", () => {
    const r = runCli(["bogus"]);
    expect(r.status).not.toBe(0);
    expect(r.stderr + r.stdout).toMatch(/Unexpected argument|bogus/i);
  });

  it("installs the skill to a custom dir", () => {
    const r = runCli(["install", "--dir", tmpDir]);
    expect(r.status).toBe(0);
    const target = path.join(tmpDir, "dna-spec");
    expect(fs.existsSync(target)).toBe(true);
    expect(fs.existsSync(path.join(target, "SKILL.md"))).toBe(true);
    expect(fs.existsSync(path.join(target, "templates", "vision.md"))).toBe(true);
    expect(fs.existsSync(path.join(target, "prompts", "discover.md"))).toBe(true);
    expect(fs.existsSync(path.join(target, "references", "dna-philosophy.md"))).toBe(true);
  });

  it("uses PI_SKILLS_DIR when --dir is not passed", () => {
    const r = runCli(["install"], { PI_SKILLS_DIR: tmpDir });
    expect(r.status).toBe(0);
    expect(fs.existsSync(path.join(tmpDir, "dna-spec", "SKILL.md"))).toBe(true);
  });

  it("dry-run does not write any files", () => {
    const r = runCli(["install", "--dir", tmpDir, "--dry-run"]);
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/Would copy/);
    expect(fs.existsSync(path.join(tmpDir, "dna-spec"))).toBe(false);
  });

  it("is idempotent — re-running does not duplicate or rewrite", () => {
    runCli(["install", "--dir", tmpDir]);
    const firstStat = fs.statSync(path.join(tmpDir, "dna-spec", "SKILL.md"));

    // Wait a tick to ensure mtime would change if rewritten
    const t = firstStat.mtimeMs;
    while (Date.now() <= t) {} // spin briefly (tiny wait)

    runCli(["install", "--dir", tmpDir]);
    const secondStat = fs.statSync(path.join(tmpDir, "dna-spec", "SKILL.md"));
    expect(secondStat.mtimeMs).toBe(firstStat.mtimeMs);
  });

  it("uninstall removes the skill directory", () => {
    runCli(["install", "--dir", tmpDir]);
    const r = runCli(["uninstall", "--dir", tmpDir]);
    expect(r.status).toBe(0);
    expect(fs.existsSync(path.join(tmpDir, "dna-spec"))).toBe(false);
  });

  it("uninstall on a missing dir is a no-op (exit 0)", () => {
    const r = runCli(["uninstall", "--dir", tmpDir]);
    expect(r.status).toBe(0);
  });

  it("uninstall refuses to delete a non-dna-spec directory", () => {
    const decoy = path.join(tmpDir, "dna-spec");
    fs.mkdirSync(decoy);
    fs.writeFileSync(path.join(decoy, "README.md"), "not a dna-spec install");
    // No SKILL.md — should refuse
    const r = runCli(["uninstall", "--dir", tmpDir]);
    expect(r.status).not.toBe(0);
    expect(r.stderr + r.stdout).toMatch(/Refusing to delete/);
  });

  it("update is an alias for install --force", () => {
    runCli(["install", "--dir", tmpDir]);
    // Modify a file to simulate user edit
    const target = path.join(tmpDir, "dna-spec", "SKILL.md");
    fs.writeFileSync(target, "# user edits\n");
    // update should restore it
    const r = runCli(["update", "--dir", tmpDir]);
    expect(r.status).toBe(0);
    const content = fs.readFileSync(target, "utf8");
    expect(content).not.toMatch(/user edits/);
  });

  it("published tarball is self-contained (regression for #files-field)", () => {
    // Build a tarball and install from it. This catches the case
    // where the bin/ script imports from src/ but src/ is not in
    // the published files.
    const tmp = makeTempDir();
    const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
    const pack = spawnSync(npmCmd, ["pack", "--pack-destination", tmp], {
      encoding: "utf8",
      shell: process.platform === "win32",
    });
    expect(pack.status, `npm pack failed: ${pack.stderr}`).toBe(0);
    // npm pack prints the produced filename (relative) to stdout
    // as the last non-empty line. Resolve it to the absolute path.
    const lines = pack.stdout.trim().split("\n").filter(Boolean);
    const producedName = lines[lines.length - 1].trim();
    const produced = path.join(tmp, producedName);
    expect(fs.existsSync(produced), `expected tarball at ${produced}`).toBe(true);

    const extractDir = makeTempDir();
    const untar = spawnSync("tar", ["-xz", "-f", produced, "-C", extractDir], { encoding: "utf8" });
    expect(untar.status, `tar extract failed: ${untar.stderr}`).toBe(0);

    const installDir = makeTempDir();
    const pkgBin = path.join(extractDir, "package", "bin", "dna-spec.mjs");
    const r = spawnSync(process.execPath, [pkgBin, "install", "--dir", installDir], {
      env: { ...process.env, NO_COLOR: "1" },
      encoding: "utf8",
    });
    expect(r.status, `install from tarball failed: ${r.stderr}`).toBe(0);
    expect(fs.existsSync(path.join(installDir, "dna-spec", "SKILL.md"))).toBe(true);
    expect(fs.existsSync(path.join(installDir, "dna-spec", "templates", "vision.md"))).toBe(true);

    // Cleanup
    fs.rmSync(tmp, { recursive: true, force: true });
    fs.rmSync(extractDir, { recursive: true, force: true });
    fs.rmSync(installDir, { recursive: true, force: true });
  });
});
