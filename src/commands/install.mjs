/**
 * Install command — copies bundled skill/ to the user's Pi skills directory.
 */

import fs from "node:fs";
import path from "node:path";
import {
  findBundledSkillDir,
  resolveSkillsDir,
  resolveInstallTarget,
} from "../lib/paths.mjs";
import { copyDir } from "../lib/copy-skill.mjs";
import { log, c, banner } from "../lib/output.mjs";

export async function installCommand(opts) {
  const { force = false, dryRun = false, dir: dirOverride } = opts;

  const skillsDir = resolveSkillsDir(dirOverride);
  const target = resolveInstallTarget(skillsDir);
  const src = findBundledSkillDir();

  banner();
  log.step("Install DNA Spec skill");
  log.plain(`  ${c.dim("Source:")} ${src}`);
  log.plain(`  ${c.dim("Target:")} ${target}`);
  log.blank();

  if (!fs.existsSync(skillsDir)) {
    if (dryRun) {
      log.info(`Would create ${skillsDir}`);
    } else {
      fs.mkdirSync(skillsDir, { recursive: true });
      log.success(`Created ${skillsDir}`);
    }
  }

  const result = copyDir({ src, dest: target, overwrite: force, dryRun });

  if (result.errors.length) {
    for (const e of result.errors) log.error(e);
    process.exit(1);
  }

  log.blank();
  if (result.copied.length) {
    log.success(
      `${dryRun ? "Would copy" : "Copied"} ${result.copied.length} file(s):`
    );
    for (const f of result.copied) log.plain(`    ${c.green("+")} ${f}`);
  }
  if (result.skipped.length) {
    log.info(`Skipped ${result.skipped.length} unchanged file(s):`);
    for (const f of result.skipped) log.plain(`    ${c.gray("=")} ${f}`);
  }
  log.blank();
  log.success("DNA Spec is installed.");
  log.blank();
  log.plain(c.bold("Next:"));
  log.plain(`  1. Open a project in Pi: ${c.cyan("pi")}`);
  log.plain(`  2. Ask Pi to start a spec: ${c.cyan('"Start a DNA spec for my project"')}`);
  log.plain(
    `  3. Pi will guide you through discovery and write the DNA files.`
  );
  log.blank();
}
