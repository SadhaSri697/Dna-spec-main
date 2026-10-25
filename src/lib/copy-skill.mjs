/**
 * File copying logic for the installer.
 *
 * Recursively copies a directory tree. By default it skips files that
 * already exist with the same content (to avoid touching mtimes on
 * user-edited skill files). Pass `overwrite: true` to force a clean copy.
 */

import fs from "node:fs";
import path from "node:path";

/**
 * Recursively copy `src` directory to `dest`.
 *
 * @param {object} opts
 * @param {string} opts.src  - source directory (must exist)
 * @param {string} opts.dest - destination directory (created if missing)
 * @param {boolean} [opts.overwrite=false] - overwrite existing files
 * @param {boolean} [opts.dryRun=false]    - log actions without writing
 * @returns {{copied: string[], skipped: string[], errors: string[]}}
 */
export function copyDir({ src, dest, overwrite = false, dryRun = false }) {
  const copied = [];
  const skipped = [];
  const errors = [];

  if (!fs.existsSync(src)) {
    errors.push(`Source does not exist: ${src}`);
    return { copied, skipped, errors };
  }

  walk(src, dest, "");

  function walk(s, d, rel) {
    const stat = fs.statSync(s);
    if (stat.isDirectory()) {
      if (!fs.existsSync(d) && !dryRun) {
        fs.mkdirSync(d, { recursive: true });
      }
      const entries = fs.readdirSync(s, { withFileTypes: true });
      for (const entry of entries) {
        walk(path.join(s, entry.name), path.join(d, entry.name), path.join(rel, entry.name));
      }
      return;
    }
    // File
    const target = d;
    if (fs.existsSync(target) && !overwrite) {
      const existing = fs.readFileSync(target, "utf8");
      const incoming = fs.readFileSync(s, "utf8");
      if (existing === incoming) {
        skipped.push(rel);
        return;
      }
      // Different content + overwrite=false → skip but warn
      skipped.push(rel);
      return;
    }
    if (dryRun) {
      copied.push(rel);
      return;
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(s, target);
    copied.push(rel);
  }

  return { copied, skipped, errors };
}

/**
 * Recursively remove a directory. Throws on failure unless `force` is true.
 */
export function removeDir(target, { force = false } = {}) {
  if (!fs.existsSync(target)) return false;
  if (force) {
    fs.rmSync(target, { recursive: true, force: true });
    return true;
  }
  // Verify it's safe to delete (must look like a dna-spec install)
  const skillMd = path.join(target, "SKILL.md");
  if (!fs.existsSync(skillMd)) {
    throw new Error(
      `Refusing to delete ${target}: no SKILL.md found. ` +
        `This doesn't look like a dna-spec install. Use --force to override.`
    );
  }
  fs.rmSync(target, { recursive: true, force: true });
  return true;
}
