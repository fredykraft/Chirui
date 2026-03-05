#!/bin/bash
# GitHub Security Setup Verification Script
# 
# This script verifies that all repository security measures are properly configured.
# Run from the repository root: bash .github/verify-github-security.sh
#
# Exit codes:
#   0 = All checks passed ✓
#   1 = Some critical checks failed ✗
#   2 = Some warnings but configuration is functional ⚠️

# Note: Not using 'set -e' to allow script to continue through all checks
# even if some fail, so we can get a complete picture

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Helper functions
print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

file_exists() {
    if [ -f "$1" ]; then
        return 0
    else
        return 1
    fi
}

dir_exists() {
    if [ -d "$1" ]; then
        return 0
    else
        return 1
    fi
}

print_header "GITHUB SECURITY SETUP VERIFICATION"

# ============================================================================
# SECTION 1: Repository Structure
# ============================================================================

print_header "1️⃣  Repository Structure"

echo "Checking essential files and directories..."

if file_exists ".env.example"; then
    check_pass ".env.example template exists"
else
    check_fail ".env.example template is MISSING (required)"
fi

if file_exists ".gitignore"; then
    if grep -q "ADMIN_PASSWORD.md" .gitignore; then
        check_pass ".gitignore properly protects sensitive files"
    else
        check_fail ".gitignore missing sensitive file rules"
    fi
else
    check_fail ".gitignore is MISSING"
fi

if file_exists ".gitattributes"; then
    check_pass ".gitattributes file exists"
else
    check_warn ".gitattributes file missing (optional but recommended)"
fi

if file_exists "CODEOWNERS"; then
    check_pass "CODEOWNERS file exists"
else
    check_warn "CODEOWNERS file missing (recommended for code reviews)"
fi

# ============================================================================
# SECTION 2: GitHub Workflows
# ============================================================================

print_header "2️⃣  GitHub Actions Workflows"

echo "Checking GitHub Actions workflow files..."

if file_exists ".github/workflows/codeql-analysis.yml"; then
    check_pass "CodeQL analysis workflow configured"
else
    check_fail ".github/workflows/codeql-analysis.yml is MISSING"
fi

if file_exists ".github/workflows/security-scanning.yml"; then
    check_pass "Security scanning workflow configured"
else
    check_fail ".github/workflows/security-scanning.yml is MISSING"
fi

if file_exists ".github/dependabot.yml"; then
    check_pass "Dependabot configuration exists"
else
    check_warn ".github/dependabot.yml missing (optional but recommended)"
fi

# ============================================================================
# SECTION 3: Security Documentation
# ============================================================================

print_header "3️⃣  Security Documentation"

echo "Checking security documentation files..."

if file_exists ".github/SECURITY.md"; then
    check_pass "SECURITY.md vulnerability policy exists"
else
    check_fail ".github/SECURITY.md is MISSING (required by GitHub)"
fi

if file_exists ".github/GITHUB_SECURITY_SETUP.md"; then
    check_pass "GitHub security setup guide exists"
else
    check_warn ".github/GITHUB_SECURITY_SETUP.md missing (optional but helpful)"
fi

if file_exists ".github/GIT_HOOKS_SETUP.md"; then
    check_pass "Git hooks setup guide exists"
else
    check_warn ".github/GIT_HOOKS_SETUP.md missing (optional but helpful)"
fi

if file_exists ".github/SECURITY_OVERVIEW.md"; then
    check_pass "Security overview documentation exists"
else
    check_warn ".github/SECURITY_OVERVIEW.md missing (optional but helpful)"
fi

# ============================================================================
# SECTION 4: Git Hooks
# ============================================================================

print_header "4️⃣  Git Hooks Setup"

echo "Checking local security hooks..."

if dir_exists ".githooks"; then
    check_pass ".githooks directory exists"
    
    if file_exists ".githooks/pre-commit"; then
        check_pass "Pre-commit hook script exists"
        
        if [ -x ".githooks/pre-commit" ]; then
            check_pass "Pre-commit hook is executable"
        else
            check_warn "Pre-commit hook is not executable (run: chmod +x .githooks/pre-commit)"
        fi
    else
        check_fail ".githooks/pre-commit script is MISSING"
    fi
else
    check_fail ".githooks directory is MISSING"
fi

# Check if hooks are installed
if [ -f ".git/hooks/pre-commit" ]; then
    check_pass "Pre-commit hook is installed in .git/hooks"
elif git config core.hooksPath > /dev/null 2>&1; then
    HOOKS_PATH=$(git config core.hooksPath)
    if [ "$HOOKS_PATH" = ".githooks" ]; then
        check_pass "Git is configured to use .githooks directory"
    else
        check_warn "Git hooks path is set to: $HOOKS_PATH (expected: .githooks)"
    fi
else
    check_warn "Pre-commit hook not installed (developers need to run: git config core.hooksPath .githooks)"
fi

# ============================================================================
# SECTION 5: Configuration Files
# ============================================================================

print_header "5️⃣  Configuration Content Verification"

echo "Checking configuration files for security settings..."

if file_exists "_includes/head.html"; then
    if grep -q "window.POCKETBASE_URL" _includes/head.html; then
        check_pass "POCKETBASE_URL configuration found in head.html"
    else
        check_fail "POCKETBASE_URL configuration MISSING from head.html"
    fi
else
    check_warn "_includes/head.html not found (expected for Jekyll)"
fi

# Check that localhost URLs are not hardcoded in JS files
if grep -r "127\.0\.0\.1:8090\|localhost:8090" js/ --include="*.js" > /dev/null 2>&1; then
    check_fail "Hardcoded localhost development URLs found in js/ directory"
else
    check_pass "No hardcoded localhost URLs in JavaScript files"
fi

# ============================================================================
# SECTION 6: Git Ignore Verification
# ============================================================================

print_header "6️⃣  .gitignore Security Verification"

echo "Checking .gitignore rules..."

REQUIRED_PATTERNS=(
    "\.env"
    "ADMIN_PASSWORD\.md"
    "\.secret"
    "\.pem"
    "\.key"
)

ALL_PATTERNS_FOUND=1

for pattern in "${REQUIRED_PATTERNS[@]}"; do
    if grep -q "$pattern" .gitignore; then
        check_pass ".gitignore protects files matching: $pattern"
    else
        check_fail ".gitignore missing protection for: $pattern"
        ALL_PATTERNS_FOUND=0
    fi
done

# ============================================================================
# SECTION 7: GitHub UI Configuration (Informational)
# ============================================================================

print_header "7️⃣  GitHub UI Configuration (Manual - requires web access)"

echo "ℹ️  The following settings must be configured in GitHub Settings UI:"
echo ""
echo "  [ ] Branch Protection Rules:"
echo "      • Require pull request reviews (minimum 1)"
echo "      • Require status checks to pass (CodeQL, Security Scanning)"
echo "      • Require branches to be up to date before merging"
echo "      • Require signed commits"
echo ""
echo "  [ ] Repository Secrets:"
echo "      • POCKETBASE_URL"
echo "      • POCKETBASE_ADMIN_USERNAME"
echo "      • POCKETBASE_ADMIN_PASSWORD"
echo ""
echo "  [ ] Enable Security Features:"
echo "      • Dependabot alerts and security updates"
echo "      • Secret scanning"
echo "      • CodeQL analysis"
echo ""

# ============================================================================
# SECTION 8: Summary
# ============================================================================

print_header "📊 VERIFICATION SUMMARY"

TOTAL=$((PASSED + FAILED + WARNINGS))

echo ""
echo "Results:"
echo -e "  ${GREEN}✓ Passed${NC}:   $PASSED"
echo -e "  ${RED}✗ Failed${NC}:   $FAILED"
echo -e "  ${YELLOW}⚠ Warnings${NC}: $WARNINGS"
echo -e "  ${BLUE}Total${NC}:     $TOTAL"
echo ""

# ============================================================================
# Exit with appropriate code
# ============================================================================

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}❌ CRITICAL ISSUES FOUND${NC}"
    echo ""
    echo "🔧 Next Steps:"
    echo "1. Review failures above (marked with ✗)"
    echo "2. Create missing files or fix configuration"
    echo "3. Run this script again to verify fixes"
    echo ""
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  CONFIGURATION MOSTLY COMPLETE (Some optional items missing)${NC}"
    echo ""
    echo "👉 Recommended Actions:"
    echo "1. Review warnings above (marked with ⚠)"
    echo "2. Optional: Add recommended files for complete protection"
    echo "3. Manual: Configure GitHub UI settings (see Section 7)"
    echo ""
    exit 2
else
    echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
    echo ""
    echo "🎉 Your repository security is properly configured!"
    echo ""
    echo "⚠️  Remaining Manual Steps:"
    echo "1. Configure branch protection rules in GitHub Settings"
    echo "2. Add repository secrets (POCKETBASE_URL, etc.)"
    echo "3. Enable Dependabot alerts in GitHub Settings"
    echo "4. Developers: Run 'git config core.hooksPath .githooks'"
    echo ""
    exit 0
fi
