/**
 * DNA Spec Studio - Web Server & REST API
 * Author: sadhasri697
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { resolveSkillsDir, resolveInstallTarget } from "./lib/paths.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const EXAMPLES_DIR = path.join(ROOT_DIR, "examples");
const SKILL_DIR = path.join(ROOT_DIR, "skill");

export const AUTHOR_NAME = "sadhasri697";
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data, null, 2));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

/**
 * Scan an example directory and extract its DNA hierarchy.
 */
function readExampleSpec(exampleName) {
  const examplePath = path.join(EXAMPLES_DIR, exampleName);
  if (!fs.existsSync(examplePath)) return null;

  const dnaDir = path.join(examplePath, "dna");
  const result = {
    id: exampleName,
    title: exampleName
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    path: examplePath,
    vision: "",
    requirements: "",
    plan: "",
    tasks: "",
    agentsMd: "",
    domains: [],
    features: [],
    flows: [],
  };

  const visionPath = path.join(dnaDir, "vision.md");
  if (fs.existsSync(visionPath)) {
    result.vision = fs.readFileSync(visionPath, "utf8");
  }

  const reqPath = path.join(dnaDir, "requirements.md");
  if (fs.existsSync(reqPath)) {
    result.requirements = fs.readFileSync(reqPath, "utf8");
  }

  const planPath = path.join(dnaDir, "implementation", "plan.md");
  if (fs.existsSync(planPath)) {
    result.plan = fs.readFileSync(planPath, "utf8");
  }

  const tasksPath = path.join(dnaDir, "implementation", "tasks.md");
  if (fs.existsSync(tasksPath)) {
    result.tasks = fs.readFileSync(tasksPath, "utf8");
  }

  const agentsPath = path.join(examplePath, "AGENTS.md");
  if (fs.existsSync(agentsPath)) {
    result.agentsMd = fs.readFileSync(agentsPath, "utf8");
  }

  // Domains
  const domainsDir = path.join(dnaDir, "domains");
  if (fs.existsSync(domainsDir)) {
    const files = fs.readdirSync(domainsDir).filter((f) => f.endsWith(".md"));
    result.domains = files.map((file) => ({
      name: path.basename(file, ".md"),
      file,
      content: fs.readFileSync(path.join(domainsDir, file), "utf8"),
    }));
  }

  // Features
  const featuresDir = path.join(dnaDir, "features");
  if (fs.existsSync(featuresDir)) {
    const domainDirs = fs
      .readdirSync(featuresDir, { withFileTypes: true })
      .filter((d) => d.isDirectory());
    for (const d of domainDirs) {
      const featFiles = fs
        .readdirSync(path.join(featuresDir, d.name))
        .filter((f) => f.endsWith(".md"));
      for (const f of featFiles) {
        result.features.push({
          domain: d.name,
          name: path.basename(f, ".md"),
          file: `${d.name}/${f}`,
          content: fs.readFileSync(path.join(featuresDir, d.name, f), "utf8"),
        });
      }
    }
  }

  // Flows
  const flowsDir = path.join(dnaDir, "flows");
  if (fs.existsSync(flowsDir)) {
    const files = fs.readdirSync(flowsDir).filter((f) => f.endsWith(".md"));
    result.flows = files.map((file) => ({
      name: path.basename(file, ".md"),
      file,
      content: fs.readFileSync(path.join(flowsDir, file), "utf8"),
    }));
  }

  return result;
}

/**
 * Validate a DNA spec against rules.
 */
function validateDnaSpec(spec) {
  const issues = [];
  const checks = [];

  // Level 0: Vision
  if (spec.vision && spec.vision.trim().length > 50) {
    checks.push({
      level: 0,
      name: "Vision Specification",
      status: "passed",
      message: "Vision defines mission, goals, philosophy, and non-goals.",
    });
  } else {
    issues.push({
      level: 0,
      name: "Vision Specification",
      status: "failed",
      message: "dna/vision.md is missing or too brief.",
    });
  }

  // Level 1: Domains
  if (spec.domains && spec.domains.length > 0) {
    checks.push({
      level: 1,
      name: "Domain Boundary Architecture",
      status: "passed",
      message: `Found ${spec.domains.length} domain definition(s).`,
    });
  } else {
    issues.push({
      level: 1,
      name: "Domain Boundary Architecture",
      status: "failed",
      message: "No domains defined under dna/domains/.",
    });
  }

  // Level 2: Features
  if (spec.features && spec.features.length > 0) {
    checks.push({
      level: 2,
      name: "Feature Capabilities",
      status: "passed",
      message: `Found ${spec.features.length} feature specification(s).`,
    });
  } else {
    issues.push({
      level: 2,
      name: "Feature Capabilities",
      status: "failed",
      message: "No feature specs defined under dna/features/.",
    });
  }

  // Level 3: Flows
  if (spec.flows && spec.flows.length > 0) {
    checks.push({
      level: 3,
      name: "Behavioral Flows",
      status: "passed",
      message: `Found ${spec.flows.length} user/system interaction flow(s).`,
    });
  } else {
    issues.push({
      level: 3,
      name: "Behavioral Flows",
      status: "failed",
      message: "No behavioral flows found under dna/flows/.",
    });
  }

  // Level 4: Requirements
  if (spec.requirements && spec.requirements.includes("Invariant")) {
    checks.push({
      level: 4,
      name: "Immutable Requirements & Invariants",
      status: "passed",
      message: "dna/requirements.md specifies core system invariants.",
    });
  } else if (spec.requirements && spec.requirements.trim().length > 30) {
    checks.push({
      level: 4,
      name: "Requirements",
      status: "warning",
      message: "Requirements defined but consider adding explicit Invariant sections.",
    });
  } else {
    issues.push({
      level: 4,
      name: "Requirements",
      status: "failed",
      message: "dna/requirements.md missing or empty.",
    });
  }

  // Implementation: Plan
  if (spec.plan && (spec.plan.includes("Milestone") || spec.plan.includes("Phase"))) {
    checks.push({
      level: 5,
      name: "Implementation Plan",
      status: "passed",
      message: "plan.md defines structured milestones and build sequence.",
    });
  } else {
    issues.push({
      level: 5,
      name: "Implementation Plan",
      status: "failed",
      message: "plan.md is missing or lacks clear milestones.",
    });
  }

  // Implementation: Tasks
  const taskCount = (spec.tasks.match(/- \[[ x]\]/g) || []).length;
  if (taskCount > 0) {
    checks.push({
      level: 5,
      name: "Decomposed Tasks",
      status: "passed",
      message: `tasks.md contains ${taskCount} atomic executable task(s).`,
    });
  } else {
    issues.push({
      level: 5,
      name: "Decomposed Tasks",
      status: "failed",
      message: "tasks.md missing atomic task checklists (`- [ ]`).",
    });
  }

  // Memory: AGENTS.md
  if (spec.agentsMd && spec.agentsMd.includes("DNA")) {
    checks.push({
      level: 6,
      name: "AGENTS.md Session-Memory Index",
      status: "passed",
      message: "AGENTS.md enables cross-session agent continuity.",
    });
  } else {
    issues.push({
      level: 6,
      name: "AGENTS.md Session-Memory Index",
      status: "warning",
      message: "AGENTS.md not found in project root.",
    });
  }

  const total = checks.length + issues.length;
  const passed = checks.filter((c) => c.status === "passed").length;
  const score = Math.round((passed / total) * 100);

  return {
    score,
    passedCount: passed,
    totalChecks: total,
    checks,
    issues,
    summary:
      score >= 80
        ? "Excellent DNA Specification! Ready for autonomous agent execution."
        : score >= 50
        ? "Good starting specification. Complete remaining levels before code generation."
        : "Incomplete DNA hierarchy. Vision through Requirements must be defined.",
  };
}

/**
 * Generate a complete 5-level DNA specification.
 */
function generateFullDnaSpec(params) {
  const {
    projectName = "my-next-system",
    author = AUTHOR_NAME,
    visionMission = "Build a high-performance system with spec-first architecture",
    visionGoal = "Eliminate hallucination and regression through strict DNA specifications",
    nonGoals = "- Building without specs\n- Manual ad-hoc code rewrites\n- Monolithic untracked dependencies",
    domainName = "core",
    domainResponsibility = "Domain models, persistence, and state validation",
    featureName = "spec-orchestrator",
    featureDescription = "Enables automatic DNA parsing, schema diffing, and task regeneration",
    flowName = "discovery-to-execution",
    requirementsList = [
      "No code change without a DNA change.",
      "All tasks must link to an invariant requirement.",
      "The agent must stop after task generation and prompt for user review.",
    ],
  } = params;

  const date = new Date().toISOString().split("T")[0];

  const visionMd = `# Vision

## Mission

${visionMission}

## Goal

${visionGoal}

## Philosophy

- **DNA as Source of Truth**: Prompts are ephemeral; hierarchical DNA is enduring.
- **Strict Verification**: Every deliverable must be traced to a requirement.
- **Autonomous Isolation**: Tasks are small enough for any subagent to finish independently.

## Non-goals

${nonGoals}

---
*Maintained by ${author}. Last spec update: ${date}.*
`;

  const domainMd = `# Domain: ${domainName}

## Responsibility

${domainResponsibility}

## Boundaries

- Owns domain entity schemas and core invariants
- Does not directly interact with third-party transport layers

## Dependencies

- None (pure domain boundary)
`;

  const featureMd = `# Feature: ${featureName}

## Context

Domain: \`../domains/${domainName}.md\`

## Overview

${featureDescription}

## Inputs & Preconditions

- Valid hierarchical DNA specifications present in project
- Target coding agent loaded with DNA Spec skill

## Expected Behavior

1. Reads Level 0 (Vision) through Level 4 (Requirements).
2. Synthesizes milestones and atomic tasks into \`dna/implementation/\`.
3. Stops and alerts the developer before executing implementation tasks.

## Invariants & Guardrails

- Never execute code changes directly inside the discovery phase.
`;

  const flowMd = `# Flow: ${flowName}

## Overview

End-to-end lifecycle from conversation discovery to verified code completion.

## Sequence

1. **User Request**: User invokes Pi coding agent to start a new project or change.
2. **Discovery (Levels 0-4)**: The agent guides user through 5 questions and commits the DNA.
3. **Synthesis**: The skill diffs existing DNA and produces \`plan.md\` and \`tasks.md\`.
4. **Execution**: The user commands an agent (or themselves) to execute atomic tasks.
5. **Verification**: Automated test suite validates code matches all Level 4 invariants.
`;

  const requirementsMd = `# Requirements

## Invariants (Must Always Be True)

${requirementsList.map((r, i) => `${i + 1}. **INV-${i + 1}**: ${r}`).join("\n")}

## Security & Compliance

- All sessions and personal secrets must be excluded from public packages.
- All dependencies must be strictly pinned.
`;

  const planMd = `# Implementation Plan

## Milestone 1: Specification & Domain Foundation
- Set up domain schemas and project initialization
- Validate Level 0-4 invariants

## Milestone 2: Feature Implementation
- Implement \`${featureName}\` logic
- Run automated unit and integration tests

## Milestone 3: Packaging & Release
- Verify CLI installer and documentation
- Run full test suite regression checks
`;

  const tasksMd = `# Tasks

## Milestone 1: Foundation
- [ ] **T-${domainName}-1**: Initialize project configuration and linting rules
- [ ] **T-${domainName}-2**: Implement \`${domainName}\` entities and type definitions

## Milestone 2: Core Feature
- [ ] **T-${domainName}-3**: Build \`${featureName}\` core logic
- [ ] **T-${domainName}-4**: Add test suite covering invariants INV-1 through INV-${requirementsList.length}

## Milestone 3: Delivery
- [ ] **T-${domainName}-5**: Run vitest test suite and generate documentation
- [ ] **T-${domainName}-6**: Publish skill/package under author \`${author}\`
`;

  const agentsMd = `# AGENTS.md

> Memory index for autonomous agents working on **${projectName}**.
> Author: **${author}**

## State of the System

- **DNA Spec**: Active & Authoritative
- **Active Milestone**: Milestone 1
- **Source of Truth**: \`dna/\`

## Next Action for Future Agent

Read \`dna/implementation/tasks.md\` and start on the first unchecked task.
Verify all changes against \`dna/requirements.md\`.
`;

  return {
    projectName,
    author,
    date,
    files: {
      "dna/vision.md": visionMd,
      [`dna/domains/${domainName}.md`]: domainMd,
      [`dna/features/${domainName}/${featureName}.md`]: featureMd,
      [`dna/flows/${flowName}.md`]: flowMd,
      "dna/requirements.md": requirementsMd,
      "dna/implementation/plan.md": planMd,
      "dna/implementation/tasks.md": tasksMd,
      "AGENTS.md": agentsMd,
    },
  };
}

/**
 * Simulate DNA diff and impact analysis.
 */
function simulateDnaDiff(changeType, entityName) {
  return {
    changeType,
    entityName,
    detectedDiff: `diff --git a/dna/features/core/${entityName}.md b/dna/features/core/${entityName}.md
--- a/dna/features/core/${entityName}.md
+++ b/dna/features/core/${entityName}.md
@@ -12,3 +12,4 @@
+ - Added real-time reactive impact notifications
+ - Updated API response schema for mobile and web frontends`,
    impactAnalysis: {
      affectedDomains: ["core", "api"],
      affectedFlows: ["discovery-to-execution", "webhook-dispatch"],
      affectedRequirements: ["INV-1: Real-time notification latency < 50ms"],
      regeneratedTasks: [
        {
          id: "T-core-7",
          title: `Update ${entityName} data contract to include reactive notifications`,
          status: "pending",
          milestone: "Milestone 2",
        },
        {
          id: "T-core-8",
          title: `Implement WebSocket event publisher for ${entityName}`,
          status: "pending",
          milestone: "Milestone 2",
        },
        {
          id: "T-core-9",
          title: `Add integration test asserting INV-1 latency requirement`,
          status: "pending",
          milestone: "Milestone 2",
        },
      ],
    },
    message: `Mini CI/CD Pipeline completed: 3 tasks regenerated for affected spec.`,
  };
}

/**
 * Run a command and return stdout/stderr.
 */
function executeCommand(cmd, args = [], cwd = ROOT_DIR) {
  return new Promise((resolve) => {
    const isWin = process.platform === "win32";
    const executable = isWin && cmd === "npm" ? "npm.cmd" : cmd;
    const proc = spawn(executable, args, {
      cwd,
      shell: isWin,
      env: { ...process.env, NO_COLOR: "1" },
    });

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (d) => (stdout += d.toString()));
    proc.stderr.on("data", (d) => (stderr += d.toString()));

    proc.on("close", (code) => {
      resolve({ exitCode: code, stdout, stderr });
    });

    proc.on("error", (err) => {
      resolve({ exitCode: 1, stdout, stderr: err.message });
    });
  });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = reqUrl.pathname;

  try {
    // API: Status
    if (pathname === "/api/status" && req.method === "GET") {
      const skillsDir = resolveSkillsDir();
      const installTarget = resolveInstallTarget(skillsDir);
      const isInstalled = fs.existsSync(path.join(installTarget, "SKILL.md"));

      const examples = fs
        .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

      sendJson(res, 200, {
        author: AUTHOR_NAME,
        project: "DNA Spec",
        version: "0.1.0",
        piSkillsDir: skillsDir,
        installed: isInstalled,
        nodeVersion: process.version,
        platform: process.platform,
        examplesCount: examples.length,
        examples,
        status: "healthy",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // API: Examples List
    if (pathname === "/api/examples" && req.method === "GET") {
      const examples = fs
        .readdirSync(EXAMPLES_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => {
          const spec = readExampleSpec(d.name);
          return {
            id: d.name,
            title: spec.title,
            domainsCount: spec.domains.length,
            featuresCount: spec.features.length,
            flowsCount: spec.flows.length,
            tasksCount: (spec.tasks.match(/- \[[ x]\]/g) || []).length,
          };
        });
      sendJson(res, 200, { examples });
      return;
    }

    // API: Example Detail
    if (pathname.startsWith("/api/examples/") && req.method === "GET") {
      const exampleId = pathname.replace("/api/examples/", "").trim();
      const spec = readExampleSpec(exampleId);
      if (!spec) {
        sendJson(res, 404, { error: `Example ${exampleId} not found` });
        return;
      }
      sendJson(res, 200, spec);
      return;
    }

    // API: Validate
    if (pathname === "/api/validate" && req.method === "POST") {
      const body = await parseBody(req);
      const targetSpec = body.spec || readExampleSpec(body.exampleId || "saas-app");
      const validation = validateDnaSpec(targetSpec);
      sendJson(res, 200, validation);
      return;
    }

    // API: Generate Spec
    if (pathname === "/api/generate" && req.method === "POST") {
      const body = await parseBody(req);
      const generated = generateFullDnaSpec(body);
      sendJson(res, 200, generated);
      return;
    }

    // API: Diff Simulation
    if (pathname === "/api/diff" && req.method === "POST") {
      const body = await parseBody(req);
      const diffResult = simulateDnaDiff(body.changeType || "feature-edit", body.entityName || "auth-flow");
      sendJson(res, 200, diffResult);
      return;
    }

    // API: Run CLI / Test Action
    if (pathname === "/api/action" && req.method === "POST") {
      const body = await parseBody(req);
      const action = body.action || "help";

      let result;
      if (action === "test") {
        result = await executeCommand("npm", ["test"], ROOT_DIR);
      } else if (action === "dry-run") {
        result = await executeCommand(process.execPath, [path.join(ROOT_DIR, "bin", "dna-spec.mjs"), "install", "--dry-run"], ROOT_DIR);
      } else if (action === "help") {
        result = await executeCommand(process.execPath, [path.join(ROOT_DIR, "bin", "dna-spec.mjs"), "--help"], ROOT_DIR);
      } else {
        result = { exitCode: 1, stdout: "", stderr: `Unknown action: ${action}` };
      }

      sendJson(res, 200, result);
      return;
    }

    // Static Files Serving
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, "");
    if (safePath === "/" || safePath === "\\") {
      safePath = "index.html";
    }

    const filePath = path.join(PUBLIC_DIR, safePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // Fallback to index.html for SPA routing
    const fallbackPath = path.join(PUBLIC_DIR, "index.html");
    if (fs.existsSync(fallbackPath)) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      fs.createReadStream(fallbackPath).pipe(res);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  } catch (err) {
    sendJson(res, 500, { error: err.message || "Internal Server Error" });
  }
});

// Start listening if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🧬 DNA Spec Studio is running at http://localhost:${PORT}`);
    console.log(`👤 Author: ${AUTHOR_NAME}`);
    console.log(`⚡ Specification-driven development server ready`);
    console.log(`======================================================\n`);
  });
}

export default server;
