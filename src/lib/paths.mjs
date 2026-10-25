/**
 * Path resolution helpers for the installer.
 *
 * The skill package ships with two key locations:
 *   - bin/    : the CLI scripts (npx runs these)
 *   - skill/  : the SKILL.md and supporting files (this is what we install)
 *
 * When the package is published to npm and a user runs `npx dna-spec`,
 * npm extracts both directories somewhere inside node_modules. We use
 * import.meta.url on the CLI script to resolve that runtime location,
 * then derive the absolute path to the bundled skill/ directory.
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Locate the bundled skill/ directory at runtime.
 *
 * Walks up the directory tree from this file until it finds a `skill/`
 * directory containing SKILL.md. This handles:
 *   - Local dev:    bin/dna-spec.mjs → ../skill/
 *   - npm pack:     node_modules/dna-spec/bin/dna-spec.mjs → ../skill/
 *   - Global npm:   <prefix>/lib/node_modules/dna-spec/bin/dna-spec.mjs
 *
 * Throws if not found — that means the package is broken.
 */
export function findBundledSkillDir() {
  let dir = __dirname;
  for (let i = 0; i < 8; i++) {
    const candidate = path.join(dir, "skill");
    const skillMd = path.join(candidate, "SKILL.md");
    if (fs.existsSync(skillMd)) return candidate;
    dir = path.dirname(dir);
  }
  throw new Error(
    `Could not locate bundled skill directory. ` +
      `Looked for skill/SKILL.md starting at ${__dirname}. ` +
      `This usually means the dna-spec package is corrupted.`
  );
}

/**
 * Resolve the user's Pi skills directory.
 *
 * Honors PI_SKILLS_DIR env var for overrides; defaults to the standard
 * location: ~/.pi/agent/skills/
 */
export function resolveSkillsDir(override) {
  if (override) {
    return path.resolve(override);
  }
  if (process.env.PI_SKILLS_DIR) {
    return path.resolve(process.env.PI_SKILLS_DIR);
  }
  return path.join(os.homedir(), ".pi", "agent", "skills");
}

/**
 * Default install target: <skillsDir>/dna-spec/
 */
export function resolveInstallTarget(skillsDir) {
  return path.join(skillsDir, "dna-spec");
}
