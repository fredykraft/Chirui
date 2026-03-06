# .github Directory - Repository Security & Governance

This directory contains GitHub-specific configuration and documentation for repository security, workflows, and policies.

For the main project overview, setup guide, and support links, see the root README:
- [../README.md](../README.md)

## 📁 Contents Overview

### 🔐 Security Configuration Files

These are automatically used by GitHub:

```
.github/
├── SECURITY.md                    # ✓ Vulnerability reporting policy (required)
├── dependabot.yml                 # ✓ Automated dependency updates
└── workflows/
    ├── codeql-analysis.yml        # ✓ Automated code security scanning
    └── security-scanning.yml      # ✓ Secret detection and validation
```

### 📖 Documentation & Guides

These provide setup and reference information:

```
.github/
├── SECURITY_OVERVIEW.md           # 🎯 Security strategy overview
├── GITHUB_SECURITY_SETUP.md       # 🔧 Manual GitHub configuration steps
├── GIT_HOOKS_SETUP.md             # 👨‍💻 Developer guide for git hooks
└── verify-github-security.sh      # ✅ Verification script
```

---

## 🚀 Quick Start

### For Repository Maintainers

1. **Review Security Strategy**:
   ```bash
   cat SECURITY_OVERVIEW.md
   ```
   Understand the defense-in-depth approach with 4 security layers.

2. **Configure GitHub Settings**:
   ```bash
   cat GITHUB_SECURITY_SETUP.md
   ```
   Follow manual steps in GitHub web interface (branch protection, secrets, etc.)

3. **Verify Setup**:
   ```bash
   bash verify-github-security.sh
   ```
   Check that all files and configurations are in place.

### For Developers

1. **Setup Git Hooks**:
   ```bash
   git config core.hooksPath .githooks
   chmod +x .githooks/pre-commit
   ```

2. **Read Developer Guide**:
   ```bash
   cat GIT_HOOKS_SETUP.md
   ```
   Understand how pre-commit hooks work and troubleshoot if needed.

3. **Follow Security Policy**:
   ```bash
   cat SECURITY.md
   ```
   Know how to report vulnerabilities responsibly.

---

## 📋 File Reference Guide

### SECURITY.md
**Purpose**: GitHub's standard security policy for responsible disclosure  
**Audience**: Security researchers, bug bounty hunters  
**Content**:
- How to report vulnerabilities (not public issues)
- Severity classifications  
- Response timeline (critical within 48h)
- Security contact information  

**Use When**:
- Someone finds a security vulnerability
- You need to establish responsible disclosure practices
- Researchers ask "how do I report a security issue?"

**Key Sections**:
```
├── Reporting Security Vulnerabilities
├── What Constitutes a Security Vulnerability
├── Security Features
├── Security Response Timeline
├── After Your Report
└── Responsible Disclosure
```

---

### SECURITY_OVERVIEW.md
**Purpose**: Complete overview of all security mechanisms in one place  
**Audience**: Technical leads, maintainers, security auditors  
**Content**:
- Defense-in-depth strategy (4 layers)
- Complete file inventory with purposes
- Threat matrix (what protects against what)
- Workflow automation details
- Incident response procedures  

**Use When**:
- Onboarding new team members to security
- Conducting security audit
- Planning security improvements
- Understanding how layers work together

**Key Sections**:
```
├── Security Strategy (visual diagram)
├── Security File Inventory
├── What's Protected
├── Workflow Automation
├── Threat Matrix
├── Monitoring & Verification
└── Security Incident Response
```

---

### GITHUB_SECURITY_SETUP.md
**Purpose**: Step-by-step manual configuration in GitHub web interface  
**Audience**: Repository maintainers with GitHub admin access  
**Content**:
- Enable advanced security features
- Configure branch protection rules
- Setup repository secrets
- Enable commit signing
- Configure security advisories
- Deployment environment setup  

**Use When**:
- First-time security setup for repository
- Adding GitHub security to existing repo
- Updating branch protection rules
- Troubleshooting "why can't I merge?"

**Key Sections**:
```
├── Enable GitHub Advanced Security
├── Configure Branch Protection Rules
├── Setup GitHub Actions Secrets
├── Configure Commit Signing
├── Enable Security Advisories
├── Deployment Secrets in GitHub Actions
├── Verification Checklist
├── Monitoring & Maintenance
└── Troubleshooting
```

---

### GIT_HOOKS_SETUP.md
**Purpose**: Guide developers to install and use local security hooks  
**Audience**: All developers / team members  
**Content**:
- What git hooks are and why they matter
- Installation instructions (2 methods)
- Verification/testing
- Troubleshooting common issues
- How to bypass (emergency only)

**Use When**:
- Developer first clones repository
- Hook installation fails
- Hook is preventing needed commit
- Documentation needed for onboarding

**Key Sections**:
```
├── What are Git Hooks?
├── Installation (Automatic & Manual)
├── Verify Installation
├── What the Hook Checks
├── If the Hook Prevents Your Commit
├── Bypassing the Hook
└── Troubleshooting
```

---

### verify-github-security.sh
**Purpose**: Automated verification that all security is configured  
**Audience**: Maintainers, CI/CD systems  
**Content**: Bash script that checks:
- All required files exist
- All workflows are configured
- Git hooks are in place
- Configuration content is correct
- .gitignore protects sensitive files

**Use When**:
- Initial setup to verify completeness
- After updating security config
- Part of CI/CD pipeline
- Troubleshooting security issues

**Run**:
```bash
bash .github/verify-github-security.sh
```

**Output**:
```
Exit 0: All checks passed ✓
Exit 1: Critical issues found ✗
Exit 2: Warnings but functional ⚠️
```

---

## 🔧 Configuration Files

### dependabot.yml
Configures automated dependency updates:
- **Bundler** (Ruby/Jekyll): Updates daily at 3 AM UTC
- **npm** (JavaScript): Updates daily at 3:30 AM UTC
- **GitHub Actions**: Updates daily at 4 AM UTC
- Auto-merges patch/minor updates with squash strategy

**GitHub Setup Required**: Enable Dependabot alerts/updates in Settings

### workflows/codeql-analysis.yml
Runs CodeQL security analysis:
- **When**: Every push to main/develop, every PR to main, daily at 2 AM UTC
- **Languages**: JavaScript, Python
- **Results**: Appear in Security → Code scanning

**GitHub Setup Required**: CodeQL analysis is free for public repos

### workflows/security-scanning.yml
Custom security checks:
- Gitleaks: Scan for hardcoded secrets
- .gitignore validation: Check sensitive files are protected
- Development URL detection: Find localhost endpoints
- Configuration validation: Verify POCKETBASE_URL set

**GitHub Setup Required**: None - runs automatically

---

## ✅ Security Checklist

### Initial Setup (One-time)
- [ ] Copy `.githooks/pre-commit` from root directory
- [ ] Create `.github/workflows/` directory
- [ ] Add workflow YAML files from this directory
- [ ] Create `.github/dependabot.yml`
- [ ] Review and customize `SECURITY.md`
- [ ] Run verification script: `bash verify-github-security.sh`

### GitHub Settings (Web UI)
- [ ] Enable branch protection on main branch
- [ ] Require PR reviews (1 minimum)
- [ ] Require CodeQL and Security Scanning to pass
- [ ] Require signed commits
- [ ] Enable Dependabot alerts
- [ ] Create GitHub Actions secrets (POCKETBASE_URL, etc.)

### Developer Onboarding
- [ ] New developers run: `git config core.hooksPath .githooks`
- [ ] Provide: `GIT_HOOKS_SETUP.md` for reference
- [ ] Provide: `SECURITY.md` for vulnerability reporting

### Regular Maintenance
- [ ] Review Dependabot PRs weekly
- [ ] Check CodeQL findings monthly
- [ ] Update CODEOWNERS when team changes
- [ ] Review security advisories quarterly

---

## 🎯 Common Tasks

### "I found a security vulnerability"
→ See [SECURITY.md](SECURITY.md) for responsible disclosure

### "The pre-commit hook is blocking my commit"
→ See [GIT_HOOKS_SETUP.md](GIT_HOOKS_SETUP.md) → Troubleshooting section

### "I need to configure GitHub for security"
→ See [GITHUB_SECURITY_SETUP.md](GITHUB_SECURITY_SETUP.md)

### "What security protections are in place?"
→ See [SECURITY_OVERVIEW.md](SECURITY_OVERVIEW.md)

### "I need to verify the setup is complete"
→ Run: `bash verify-github-security.sh`

### "I'm new and don't understand the setup"
→ Read in order:
1. [SECURITY_OVERVIEW.md](SECURITY_OVERVIEW.md) - Strategy overview
2. [GIT_HOOKS_SETUP.md](GIT_HOOKS_SETUP.md) - Your local setup
3. [SECURITY.md](SECURITY.md) - How to report issues

---

## 📚 Related Documentation

Outside this directory:

- [.env.example](../.env.example) - Configuration template
- [.gitignore](../.gitignore) - Files never to commit
- [CODEOWNERS](../CODEOWNERS) - Code review requirements
- [DEPLOYMENT_SECURITY_CHECKLIST.md](../DEPLOYMENT_SECURITY_CHECKLIST.md) - Pre-deployment steps
- [WEBSITE_SECURITY.md](../WEBSITE_SECURITY.md) - Application-level security

---

## 🔗 External Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [GitHub Actions](https://docs.github.com/en/actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Last Updated**: March 6, 2026  
**Version**: 1.1
