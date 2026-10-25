/**
 * Colored terminal output without external dependencies.
 * Uses ANSI escape codes; auto-disables when output is not a TTY.
 */

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;

const codes = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

const wrap = (open, close = codes.reset) => (text) =>
  useColor ? `${open}${text}${close}` : String(text);

export const c = {
  reset: wrap(codes.reset),
  bold: wrap(codes.bold),
  dim: wrap(codes.dim),
  red: wrap(codes.red),
  green: wrap(codes.green),
  yellow: wrap(codes.yellow),
  blue: wrap(codes.blue),
  magenta: wrap(codes.magenta),
  cyan: wrap(codes.cyan),
  gray: wrap(codes.gray),
};

export const log = {
  info: (msg) => console.log(`${c.cyan("ℹ")}  ${msg}`),
  success: (msg) => console.log(`${c.green("✔")}  ${msg}`),
  warn: (msg) => console.log(`${c.yellow("⚠")}  ${msg}`),
  error: (msg) => console.error(`${c.red("✖")}  ${msg}`),
  step: (msg) => console.log(`\n${c.bold(c.magenta("▸"))} ${c.bold(msg)}`),
  plain: (msg) => console.log(msg),
  blank: () => console.log(),
};

export function banner() {
  const lines = [
    "",
    `${c.bold(c.magenta("DNA Spec"))} ${c.dim("— specification-driven development for Pi")}`,
    "",
  ];
  console.log(lines.join("\n"));
}
