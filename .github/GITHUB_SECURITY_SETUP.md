# GitHub Repository Security Setup Guide

This guide walks through all GitHub-specific security configurations for the Chirui repository.

## 📋 Pre-requisites

- GitHub account with owner/admin access to the repository
- Familiarity with GitHub Settings and Actions

## 🔐 Security Features Setup

### 1. Enable GitHub Advanced Security (if available)

**For public repositories (free):**
1. Go to Repository → Settings → Security & analysis
2. Enable:
   - ✅ "Dependabot alerts" → Watch for vulnerable dependencies
   - ✅ "Dependabot security updates" → Auto-fix vulnerable packages
   - ✅ "Secret scanning" → Detect exposed secrets
   - ✅ "Ensure Docker base images are scanned" (if applicable)

**For private repositories:**
- Consider GitHub Enterprise for full advanced security suite

### 2. Configure Branch Protection Rules

**Main Branch Protection:**

1. Go to Repository → Settings → Branches
2. Click "Add rule" under "Branch protection rules"
3. **Branch name pattern**: `main`
4. Enable protections:
   - ✅ "Require a pull request before merging"
     - Required number of approving reviews: **1**
     - Dismiss stale pull request approvals: **Yes**
     - Require review from code owners: **Yes** (requires CODEOWNERS file)
   - ✅ "Require status checks to pass before merging"
     - Require branches to be up to date before merging: **Yes**
     - Required status checks:
       - `CodeQL / Analyze` (JavaScript)
       - `CodeQL / Analyze` (Python)
       - `Secret Scanning & Validation`
   - ✅ "Require signed commits"
   - ✅ "Restrict who can push to matching branches"
   - ✅ "Allow force pushes" → **Disabled**
   - ✅ "Allow deletions" → **Disabled**

### 3. Setup GitHub Actions Secrets

**For PocketBase Configuration:**

1. Go to Repository → Settings → Secrets and variables → Actions
2. Create new repository secrets:

```
Name: POCKETBASE_URL
Value: https://your-instance.pockethost.io

Name: POCKETBASE_ADMIN_USERNAME
Value: your-admin-username

Name: POCKETBASE_ADMIN_PASSWORD
Value: your-admin-password
```

**IMPORTANT**: Never commit these values. They're only used in GitHub Actions workflows.

### 4. Configure Commit Signing

**Using GitHub's web interface (recommended for simple setup):**

1. Go to Account Settings → SSH and GPG keys
2. Click "New GPG key"
3. Generate or paste your GPG public key
4. In Repository Settings → Branches → Branch protection rule, enable "Require signed commits"

**Note**: Commits made via GitHub web interface are automatically signed by GitHub.

### 5. Enable Security Advisories

1. Go to Repository → Security → Security advisories
2. GitHub now allows security advisories for this repository
3. Set notification preferences in Settings → Email notifications

## 📁 File Reference

The following files are part of the GitHub security setup:

| File | Purpose |
|------|---------|
| `.github/SECURITY.md` | Security vulnerability reporting policy |
| `.github/workflows/codeql-analysis.yml` | Automated code security scanning |
| `.github/workflows/security-scanning.yml` | Secret detection and validation |
| `.github/dependabot.yml` | Automated dependency updates |
| `CODEOWNERS` | Code review requirements for sensitive files |
| `.gitattributes` | Git configuration for file handling |
| `.gitignore` | Prevent committing sensitive files |
| `.env.example` | Configuration template |

## 🚀 Deployment Secrets in GitHub Actions

**If you need to configure environment variables for deployments:**

1. Create separate environments: Settings → Environments
   - Development → auto-deploy on merge to `develop` branch
   - Staging → manual approval for staging deployments
   - Production → manual approval for production deployments

2. Add environment-specific secrets:
   ```
   POCKETBASE_URL (environment-specific URL)
   POCKETBASE_TOKEN (service account token if needed)
   ```

3. In workflows, reference environment:
   ```yaml
   jobs:
     deploy:
       environment: production
       runs-on: ubuntu-latest
   ```

## ✅ Verification Checklist

Run through this checklist to verify all security configurations:

- [ ] Branch protection rules enabled on `main`
- [ ] Required PR reviews enabled (requires code owner approval)
- [ ] Status checks required (CodeQL, Secret Scanning)
- [ ] "Require branches to be up to date" enabled
- [ ] "Restrict push access" enabled (if needed)
- [ ] Signed commits required
- [ ] GitHub Actions secrets configured (POCKETBASE_URL, etc.)
- [ ] `.github/SECURITY.md` file exists
- [ ] `CODEOWNERS` file exists and configured
- [ ] `.gitignore` includes all sensitive files
- [ ] `.env.example` provided as template
- [ ] Dependabot alerts/updates enabled
- [ ] Secret scanning enabled
- [ ] CodeQL analysis workflows running successfully
- [ ] Security scanning workflow running successfully

## 🔍 Monitoring & Maintenance

### Weekly Tasks
- Check pull request reviews for security-related changes
- Monitor Dependabot PRs for dependency updates
- Review security alerts in Security tab

### Monthly Tasks
- Review and update security documentation
- Check GitHub security advisories for new vulnerabilities
- Verify branch protection rules are still optimal

### Quarterly Tasks
- Audit access permissions (who has write access)
- Review deployed secrets in GitHub Actions
- Update security policy if needed

## 🆘 Troubleshooting

### CodeQL Analysis Fails
**Error**: "CodeQL workflow error"
- Ensure your code compiles without major syntax errors
- Check workflow log for specific language errors
- See: https://codeql.github.com/docs/

### Secret Scanning False Positives
**Problem**: Legitimate credentials detected as secrets
- Update filter in `security-scanning.yml` workflow
- Or rename the secret (exclude pattern)
- Document in `SECURITY.md` why it's a false positive

### Branch Protection Rule Not Applying
**Problem**: Can't merge PRs even with approvals
- Verify required status checks are showing up
- Wait for all GitHub Actions workflows to complete
- Check if using personal access token instead of GitHub token

## 📚 Additional Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Managing Repository Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CodeQL Documentation](https://codeql.github.com/docs/)

## 🔄 Next Steps

1. **Manual Setup** (requires GitHub UI access):
   - [ ] Configure branch protection rules
   - [ ] Create environments (Dev, Staging, Prod)
   - [ ] Add repository secrets

2. **Verify Automated Setup**:
   - [ ] Check that workflows run and pass
   - [ ] Confirm Dependabot creates PRs
   - [ ] Test secret scanning on test branch

3. **Team Communication**:
   - [ ] Share `SECURITY.md` with team
   - [ ] Communicate new PR review requirements
   - [ ] Share this setup guide with contributors

---

**Last Updated**: 2024
**Setup Version**: 1.0
