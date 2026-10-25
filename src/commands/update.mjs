/**
 * Update command — alias for install with --force.
 */

import { installCommand } from "./install.mjs";

export async function updateCommand(opts) {
  return installCommand({ ...opts, force: true });
}
