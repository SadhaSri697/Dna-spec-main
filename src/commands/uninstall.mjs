/**
 * Uninstall command — removes the skill from the user's Pi skills directory.
 */

import {
  resolveSkillsDir,
  resolveInstallTarget,
} from "../lib/paths.mjs";
import { removeDir } from "../lib/copy-skill.mjs";
import { log, c, banner } from "../lib/output.mjs";

export async function uninstallCommand(opts) {
  const { force = false, dryRun = false, dir: dirOverride } = opts;

  const target = resolveInstallTarget(resolveSkillsDir(dirOverride));

  banner();
  log.step("Uninstall DNA Spec skill");
  log.plain(`  ${c.dim("Target:")} ${target}`);
  log.blank();

  if (dryRun) {
    log.info(`Would remove ${target}`);
    return;
  }

  const removed = removeDir(target, { force });
  if (removed) {
    log.success(`Removed ${target}`);
  } else {
    log.info(`Nothing to remove (${target} does not exist)`);
  }
  log.blank();
}
