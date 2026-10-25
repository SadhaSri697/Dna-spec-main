/**
 * DNA Spec Studio — Interactive Frontend Logic
 * Author: sadhasri697
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  let currentExampleData = null;
  let activeSpecKey = 'vision';
  let activeTab = 'explorer';
  let generatedSpecCache = null;

  // DOM Elements - Header & Tabs
  const serverStatusText = document.getElementById('server-status-text');
  const btnQuickTest = document.getElementById('btn-quick-test');
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const toastEl = document.getElementById('toast');

  // Tab 1: Explorer Elements
  const exampleSelect = document.getElementById('example-select');
  const specTree = document.getElementById('spec-tree');
  const currentFilePath = document.getElementById('current-file-path');
  const currentLevelBadge = document.getElementById('current-level-badge');
  const specViewerCode = document.getElementById('spec-viewer-code');
  const btnCopySpec = document.getElementById('btn-copy-spec');
  const countDomains = document.getElementById('count-domains');
  const countFeatures = document.getElementById('count-features');
  const countFlows = document.getElementById('count-flows');

  // Tab 2: Generator Elements
  const btnGenerateDna = document.getElementById('btn-generate-dna');
  const wizardForm = document.getElementById('wizard-form');
  const genFilesPills = document.getElementById('gen-files-pills');
  const genCodePreview = document.getElementById('gen-code-preview');
  const btnCopyGenerated = document.getElementById('btn-copy-generated');
  const generatedSpecTitle = document.getElementById('generated-spec-title');

  // Tab 3: Auditor Elements
  const btnRunAudit = document.getElementById('btn-run-audit');
  const scoreVal = document.getElementById('score-val');
  const scoreCircle = document.getElementById('score-circle');
  const scoreStatus = document.getElementById('score-status');
  const scoreDesc = document.getElementById('score-desc');
  const auditChecklist = document.getElementById('audit-checklist');

  // Tab 4: Diff Elements
  const diffScenario = document.getElementById('diff-scenario');
  const btnTriggerDiff = document.getElementById('btn-trigger-diff');
  const diffGitOutput = document.getElementById('diff-git-output');
  const impactSummary = document.getElementById('impact-summary');
  const diffImpactBadge = document.getElementById('diff-impact-badge');
  const regeneratedTasksList = document.getElementById('regenerated-tasks-list');

  // Tab 5: Terminal Elements
  const btnCliHelp = document.getElementById('btn-cli-help');
  const btnCliDryrun = document.getElementById('btn-cli-dryrun');
  const btnCliTest = document.getElementById('btn-cli-test');
  const btnClearTerm = document.getElementById('btn-clear-term');
  const terminalBody = document.getElementById('terminal-body');
  const terminalStatus = document.getElementById('terminal-status');

  // ==========================================
  // Helper: Toast Notifications
  // ==========================================
  function showToast(message, duration = 3000) {
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, duration);
  }

  // ==========================================
  // Helper: Terminal Logger
  // ==========================================
  function logToTerminal(text, type = 'normal') {
    const line = document.createElement('div');
    line.className = `term-line ${type ? `term-${type}` : ''}`;
    line.textContent = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // ==========================================
  // Tab Switching
  // ==========================================
  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      navTabs.forEach((t) => t.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      activeTab = tab.getAttribute('data-tab');
      const targetPanel = document.getElementById(`panel-${activeTab}`);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // ==========================================
  // Backend Status Fetch
  // ==========================================
  async function fetchServerStatus() {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error('Status endpoint returned non-200');
      const data = await res.json();

      serverStatusText.textContent = `Backend Ready • ${data.author}`;
      logToTerminal(`[System] Connected to DNA Spec Studio API v${data.version}`, 'cyan');
      logToTerminal(`[System] Author: ${data.author} | Node ${data.nodeVersion} on ${data.platform}`, 'dim');
      logToTerminal(`[System] Pi Skills Dir: ${data.piSkillsDir} (Installed: ${data.installed})`, 'dim');
    } catch (err) {
      serverStatusText.textContent = 'Backend Offline';
      serverStatusText.style.color = '#f87171';
      logToTerminal(`[Error] Failed to connect to backend: ${err.message}`, 'red');
    }
  }

  // ==========================================
  // Tab 1: Load and Browse Example Specs
  // ==========================================
  async function loadExampleSpec(exampleId) {
    try {
      specViewerCode.textContent = 'Loading DNA specification files...';
      const res = await fetch(`/api/examples/${exampleId}`);
      if (!res.ok) throw new Error(`Failed to load ${exampleId}`);
      currentExampleData = await res.json();

      // Update counters
      countDomains.textContent = currentExampleData.domains.length;
      countFeatures.textContent = currentExampleData.features.length;
      countFlows.textContent = currentExampleData.flows.length;

      // Select default view
      selectTreeItem('vision');
      showToast(`Loaded DNA Spec: ${currentExampleData.title}`);
    } catch (err) {
      specViewerCode.textContent = `Error: ${err.message}`;
      showToast(`Error loading example: ${err.message}`);
    }
  }

  function selectTreeItem(key) {
    activeSpecKey = key;

    // Highlight tree
    document.querySelectorAll('.tree-item').forEach((item) => {
      if (item.getAttribute('data-file-key') === key) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (!currentExampleData) return;

    let content = '';
    let filePath = '';
    let badgeText = '';

    switch (key) {
      case 'vision':
        content = currentExampleData.vision;
        filePath = 'dna/vision.md';
        badgeText = 'Level 0: Vision';
        break;
      case 'domains':
        content = currentExampleData.domains.map((d) => `### Domain: ${d.name}\nFile: dna/domains/${d.file}\n\n${d.content}`).join('\n\n---\n\n');
        filePath = `dna/domains/ (${currentExampleData.domains.length} files)`;
        badgeText = 'Level 1: Domains';
        break;
      case 'features':
        content = currentExampleData.features.map((f) => `### Feature: ${f.name} (Domain: ${f.domain})\nFile: dna/features/${f.file}\n\n${f.content}`).join('\n\n---\n\n');
        filePath = `dna/features/ (${currentExampleData.features.length} files)`;
        badgeText = 'Level 2: Features';
        break;
      case 'flows':
        content = currentExampleData.flows.map((f) => `### Flow: ${f.name}\nFile: dna/flows/${f.file}\n\n${f.content}`).join('\n\n---\n\n');
        filePath = `dna/flows/ (${currentExampleData.flows.length} files)`;
        badgeText = 'Level 3: Flows';
        break;
      case 'requirements':
        content = currentExampleData.requirements;
        filePath = 'dna/requirements.md';
        badgeText = 'Level 4: Invariants';
        break;
      case 'plan':
        content = currentExampleData.plan;
        filePath = 'dna/implementation/plan.md';
        badgeText = 'Implementation Plan';
        break;
      case 'tasks':
        content = currentExampleData.tasks;
        filePath = 'dna/implementation/tasks.md';
        badgeText = 'Atomic Tasks';
        break;
      case 'agents':
        content = currentExampleData.agentsMd;
        filePath = 'AGENTS.md';
        badgeText = 'Session-Memory Index';
        break;
      default:
        content = '// No content available';
    }

    currentFilePath.textContent = filePath;
    currentLevelBadge.textContent = badgeText;
    specViewerCode.textContent = content || '// File is empty or uninitialized';
  }

  // Tree click listeners
  specTree.addEventListener('click', (e) => {
    const item = e.target.closest('.tree-item');
    if (!item) return;
    const key = item.getAttribute('data-file-key');
    if (key) selectTreeItem(key);
  });

  // Example dropdown change listener
  exampleSelect.addEventListener('change', (e) => {
    loadExampleSpec(e.target.value);
  });

  // Copy current spec viewer code
  btnCopySpec.addEventListener('click', () => {
    const text = specViewerCode.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied markdown to clipboard!');
    }).catch(() => {
      showToast('Failed to copy');
    });
  });

  // ==========================================
  // Tab 2: Spec Generator Wizard
  // ==========================================
  btnGenerateDna.addEventListener('click', async () => {
    const projectName = document.getElementById('wizard-proj-name').value.trim() || 'hyper-agent';
    const visionMission = document.getElementById('wizard-mission').value.trim();
    const visionGoal = document.getElementById('wizard-goal').value.trim();
    const nonGoals = document.getElementById('wizard-nongoals').value.trim();
    const domainName = document.getElementById('wizard-domain-name').value.trim() || 'core';
    const domainResponsibility = document.getElementById('wizard-domain-resp').value.trim();
    const featureName = document.getElementById('wizard-feat-name').value.trim() || 'core-engine';
    const flowName = document.getElementById('wizard-flow-name').value.trim() || 'main-flow';
    const featureDescription = document.getElementById('wizard-feat-desc').value.trim();
    const rawReqs = document.getElementById('wizard-reqs').value.trim();
    const requirementsList = rawReqs.split(',').map((r) => r.trim()).filter(Boolean);

    try {
      btnGenerateDna.textContent = 'Synthesizing...';
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          visionMission,
          visionGoal,
          nonGoals,
          domainName,
          domainResponsibility,
          featureName,
          featureDescription,
          flowName,
          requirementsList,
        }),
      });

      if (!res.ok) throw new Error('Spec generation failed');
      const data = await res.json();
      generatedSpecCache = data;

      generatedSpecTitle.textContent = `Generated Spec: ${data.projectName} (${Object.keys(data.files).length} files)`;
      renderGeneratedFilesPills(data.files);
      showToast(`Synthesized 5-level DNA for ${projectName}!`);
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      btnGenerateDna.innerHTML = '<span class="btn-icon">⚡</span> Synthesize DNA Spec';
    }
  });

  function renderGeneratedFilesPills(files) {
    genFilesPills.innerHTML = '';
    const fileKeys = Object.keys(files);

    fileKeys.forEach((key, index) => {
      const btn = document.createElement('button');
      btn.className = `btn btn-secondary btn-sm ${index === 0 ? 'btn-primary' : ''}`;
      btn.style.fontSize = '0.75rem';
      btn.textContent = key.split('/').pop();
      btn.setAttribute('data-file-key', key);

      btn.addEventListener('click', () => {
        genFilesPills.querySelectorAll('button').forEach((b) => b.classList.replace('btn-primary', 'btn-secondary'));
        btn.classList.replace('btn-secondary', 'btn-primary');
        genCodePreview.textContent = files[key];
      });

      genFilesPills.appendChild(btn);
    });

    if (fileKeys.length > 0) {
      genCodePreview.textContent = files[fileKeys[0]];
    }
  }

  btnCopyGenerated.addEventListener('click', () => {
    if (!generatedSpecCache) {
      showToast('Generate a specification first!');
      return;
    }
    const allText = Object.entries(generatedSpecCache.files)
      .map(([filename, content]) => `<!-- FILE: ${filename} -->\n${content}`)
      .join('\n\n=========================================\n\n');

    navigator.clipboard.writeText(allText).then(() => {
      showToast('Copied all generated files to clipboard!');
    }).catch(() => {
      showToast('Failed to copy');
    });
  });

  // ==========================================
  // Tab 3: Spec Auditor
  // ==========================================
  async function runAudit() {
    try {
      btnRunAudit.textContent = 'Auditing...';
      const exampleId = exampleSelect.value || 'saas-app';

      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exampleId }),
      });

      if (!res.ok) throw new Error('Audit request failed');
      const data = await res.json();

      // Update score display
      scoreVal.textContent = `${data.score}%`;
      scoreStatus.textContent = data.score >= 80 ? 'DNA Spec Fully Compliant' : 'Specification Incomplete';
      scoreDesc.textContent = data.summary;

      // Circle border color
      scoreCircle.style.borderColor = data.score >= 80 ? '#10b981' : '#f59e0b';
      scoreCircle.style.boxShadow = data.score >= 80 ? '0 0 30px rgba(16, 185, 129, 0.25)' : '0 0 30px rgba(245, 158, 11, 0.25)';

      // Render checks
      auditChecklist.innerHTML = '';
      const allItems = [...data.checks, ...data.issues];

      allItems.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'check-item';

        const isPassed = item.status === 'passed';
        const isWarn = item.status === 'warning';
        const icon = isPassed ? '✅' : isWarn ? '⚠️' : '❌';

        row.innerHTML = `
          <span class="check-icon">${icon}</span>
          <div class="check-details">
            <span class="check-name">${item.name}</span>
            <span class="check-msg">${item.message}</span>
          </div>
          <span class="badge ${isPassed ? 'badge-emerald' : isWarn ? 'badge-amber' : 'badge-purple'}">${item.status.toUpperCase()}</span>
        `;
        auditChecklist.appendChild(row);
      });

      showToast(`Audit Completed: ${data.score}% compliance`);
    } catch (err) {
      showToast(`Audit failed: ${err.message}`);
    } finally {
      btnRunAudit.innerHTML = '<span class="btn-icon">🔍</span> Run Full Audit';
    }
  }

  btnRunAudit.addEventListener('click', runAudit);

  // ==========================================
  // Tab 4: Mini CI/CD Diff & Impact
  // ==========================================
  async function runDiffSimulation() {
    const scenario = diffScenario.value;
    try {
      btnTriggerDiff.textContent = 'Simulating...';
      const res = await fetch('/api/diff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changeType: scenario, entityName: 'webhook-engine' }),
      });

      if (!res.ok) throw new Error('Diff simulation failed');
      const data = await res.json();

      diffGitOutput.textContent = data.detectedDiff;
      impactSummary.innerHTML = `<strong>Impact Detected:</strong> Affects Domains [${data.impactAnalysis.affectedDomains.join(', ')}] & Requirements [${data.impactAnalysis.affectedRequirements.join(', ')}].`;
      diffImpactBadge.textContent = `${data.impactAnalysis.regeneratedTasks.length} Tasks Regenerated`;

      regeneratedTasksList.innerHTML = '';
      data.impactAnalysis.regeneratedTasks.forEach((task) => {
        const item = document.createElement('div');
        item.className = 'task-card-item';
        item.innerHTML = `
          <div class="task-card-header">
            <span class="task-id">[ ] ${task.id}</span>
            <span class="badge badge-emerald">${task.milestone}</span>
          </div>
          <span class="task-title">${task.title}</span>
        `;
        regeneratedTasksList.appendChild(item);
      });

      showToast('Mini CI/CD Pipeline executed: Tasks regenerated!');
    } catch (err) {
      showToast(`Diff simulation failed: ${err.message}`);
    } finally {
      btnTriggerDiff.innerHTML = '<span class="btn-icon">⚡</span> Run Mini CI/CD';
    }
  }

  btnTriggerDiff.addEventListener('click', runDiffSimulation);

  // ==========================================
  // Tab 5: Terminal & Action Runner
  // ==========================================
  async function runTerminalAction(actionName, commandDisplay) {
    // Switch to terminal tab
    document.getElementById('tab-btn-cli').click();

    logToTerminal(`\n$ ${commandDisplay}`, 'cyan');
    terminalStatus.textContent = 'Executing...';
    terminalStatus.style.color = '#fbbf24';

    try {
      const res = await fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionName }),
      });

      const data = await res.json();

      if (data.stdout) {
        data.stdout.split('\n').forEach((line) => {
          if (line.includes('passed') || line.includes('✓')) {
            logToTerminal(line, 'green');
          } else if (line.includes('failed') || line.includes('Error')) {
            logToTerminal(line, 'red');
          } else {
            logToTerminal(line, 'normal');
          }
        });
      }

      if (data.stderr) {
        data.stderr.split('\n').forEach((line) => {
          if (line.trim()) logToTerminal(line, 'red');
        });
      }

      if (data.exitCode === 0) {
        logToTerminal(`✔ Command completed with code 0`, 'green');
        terminalStatus.textContent = 'Ready (Code 0)';
        terminalStatus.style.color = '#6ee7b7';
      } else {
        logToTerminal(`✖ Command failed with exit code ${data.exitCode}`, 'red');
        terminalStatus.textContent = `Failed (Code ${data.exitCode})`;
        terminalStatus.style.color = '#f87171';
      }
    } catch (err) {
      logToTerminal(`Fatal network error: ${err.message}`, 'red');
      terminalStatus.textContent = 'Error';
      terminalStatus.style.color = '#f87171';
    }
  }

  btnCliTest.addEventListener('click', () => runTerminalAction('test', 'npm test (vitest run)'));
  btnQuickTest.addEventListener('click', () => runTerminalAction('test', 'npm test (vitest run)'));
  btnCliHelp.addEventListener('click', () => runTerminalAction('help', 'node bin/dna-spec.mjs --help'));
  btnCliDryrun.addEventListener('click', () => runTerminalAction('dry-run', 'node bin/dna-spec.mjs install --dry-run'));

  btnClearTerm.addEventListener('click', () => {
    terminalBody.innerHTML = '';
    logToTerminal('Console cleared. Terminal ready.', 'dim');
  });

  // Initial load
  fetchServerStatus();
  loadExampleSpec('saas-app');
  runAudit();
  runDiffSimulation();
});
