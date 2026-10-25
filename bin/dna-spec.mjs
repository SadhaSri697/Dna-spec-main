#!/usr/bin/env node
/**
 * dna-spec CLI entry point.
 *
 * Usage:
 *   npx dna-spec [command] [options]
 *
 * Commands:
 *   install   Install the DNA Spec skill into Pi's skills directory (default)
 *   update    Force-reinstall the skill
 *   uninstall Remove the skill
 *   help      Show this message
 *
 * Options:
 *   --force       Overwrite existing files (used by update)
 *   --dry-run     Print actions without making changes
 *   --dir <path>  Install to a custom skills directory
 *   -h, --help    Show help
 */

import { installCommand } from "../src/commands/install.mjs";
import { uninstallCommand } from "../src/commands/uninstall.mjs";
import { updateCommand } from "../src/commands/update.mjs";
import { log, c } from "../src/lib/output.mjs";

const HELP = `
${c.bold("dna-spec")} ${c.dim("— install the DNA Spec skill for Pi")}

${c.bold("Usage:")}
  npx dna-spec [command] [options]

${c.bold("Commands:")}
  install     Install the skill into Pi's skills directory ${c.gray("(default)")}
  update      Force-reinstall the skill (overwrites local edits)
  uninstall   Remove the skill
  help        Show this message

${c.bold("Options:")}
  --force       Overwrite existing files
  --dry-run     Print actions without making changes
  --dir <path>  Install to a custom skills directory
  -h, --help    Show help

${c.bold("Environment:")}
  PI_SKILLS_DIR   Override the Pi skills directory ${c.gray("(default: ~/.pi/agent/skills)")}
  NO_COLOR        Disable colored output
`;

async function main() {
  const argv = process.argv.slice(2);
  let command = "install";
  const opts = {};

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help" || a === "help") {
      console.log(HELP);
      return;
    }
    if (a === "--force") opts.force = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--dir") {
      opts.dir = argv[++i];
    } else if (a === "install" || a === "uninstall" || a === "update") {
      command = a;
    } else if (a.startsWith("-")) {
      log.error(`Unknown flag: ${a}`);
      log.info(`Run \`dna-spec help\` for usage.`);
      process.exit(2);
    } else {
      log.error(`Unexpected argument: ${a}`);
      log.info(`Run \`dna-spec help\` for usage.`);
      process.exit(2);
    }
  }

  try {
    if (command === "install") await installCommand(opts);
    else if (command === "uninstall") await uninstallCommand(opts);
    else if (command === "update") await updateCommand(opts);
  } catch (err) {
    log.error(err.message || String(err));
    if (process.env.DNA_SPEC_DEBUG) console.error(err.stack);
    process.exit(1);
  }
}

main();
