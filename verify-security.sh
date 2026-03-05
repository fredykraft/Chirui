#!/bin/bash

# Website Security Verification Script
# Run this to verify all security measures are in place

echo "🔒 Website Security Verification Script"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to print result
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $1"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $1"
        ((FAILED++))
    fi
}

echo "📋 Checking File Protection..."
echo "================================"

# Check .gitignore exists
test -f .gitignore
check "✓ .gitignore file exists"

# Check ADMIN_PASSWORD.md in gitignore
grep -q "ADMIN_PASSWORD.md" .gitignore
check "✓ ADMIN_PASSWORD.md protected in .gitignore"

# Check no .env in repo
! git ls-files | grep -q "\.env"
check "✓ .env files not committed"

# Check no exposed secrets in JS
! grep -r "password\|api_key\|API_KEY" js/ --include="*.js" | grep -qv "//"
check "✓ No hardcoded passwords in JavaScript"

echo ""
echo "🔐 Checking Configuration Security..."
echo "======================================"

# Check for localhost in JS files (excluding comments)
! grep -r "localhost\|127\.0\.0\.1" js/ --include="*.js" | grep -qv "^[^:]*://[^/]*[[:space:]]*#"
check "✓ No localhost URLs in JavaScript files"

# Check head.html has PocketBase configuration
grep -q "POCKETBASE_URL" _includes/head.html
check "✓ PocketBase configuration in head.html"

# Check head.html has security headers
grep -q "Content-Security-Policy" _includes/head.html
check "✓ Content Security Policy configured"

grep -q "X-Content-Type-Options" _includes/head.html
check "✓ X-Content-Type-Options header configured"

grep -q "X-Frame-Options" _includes/head.html
check "✓ X-Frame-Options header configured"

echo ""
echo "🌍 Checking Language Configuration..."
echo "====================================="

# Check auto-language.js has location support
grep -q "LOCATION_LANGUAGE_MAP" js/auto-language.js
check "✓ Location-based language mapping exists"

grep -q "getLanguageByLocation" js/auto-language.js
check "✓ Location detection function exists"

grep -q "siteLanguageManager" js/auto-language.js
check "✓ Language manager API available"

# Check dashboard has location setting
grep -q "locationModal" dashboard.html
check "✓ Location setting UI in dashboard"

echo ""
echo "📚 Checking Documentation..."
echo "============================"

# Check security documentation exists
test -f WEBSITE_SECURITY.md
check "✓ WEBSITE_SECURITY.md exists"

test -f DEPLOYMENT_SECURITY_CHECKLIST.md
check "✓ DEPLOYMENT_SECURITY_CHECKLIST.md exists"

test -f PUBLIC_DEPLOYMENT_GUIDE.md
check "✓ PUBLIC_DEPLOYMENT_GUIDE.md exists"

test -f DEVELOPER_SECURITY_REFERENCE.md
check "✓ DEVELOPER_SECURITY_REFERENCE.md exists"

test -f SECURITY_UPDATE_SUMMARY.md
check "✓ SECURITY_UPDATE_SUMMARY.md exists"

test -f README_SECURITY_UPDATE.md
check "✓ README_SECURITY_UPDATE.md exists"

echo ""
echo "🔧 Checking Configuration Files..."
echo "=================================="

# Check config files exist
test -f _config.yml
check "✓ _config.yml exists"

# Check head.html exists
test -f _includes/head.html
check "✓ _includes/head.html exists"

# Verify auth files are not in git
! git ls-files | grep -q "ADMIN_PASSWORD\.md$" && ! test -f ADMIN_PASSWORD.md
check "✓ Admin password not in repository"

echo ""
echo "📊 Checking API Integration..."
echo "=============================="

# Check pocketbase-integration.js is secure
grep -q "PB_URL = window.POCKETBASE_URL" js/pocketbase-integration.js
check "✓ PocketBase uses environment configuration"

# Check user-auth.js is secure  
grep -q "this.baseUrl = baseUrl || window.POCKETBASE_URL" js/user-auth.js
check "✓ User auth uses environment configuration"

# Check no fallback to localhost
! grep -q "http://127.0.0.1:8090" js/user-auth.js
check "✓ No localhost fallback in user-auth.js"

! grep -q "http://127.0.0.1:8090" js/pocketbase-integration.js
check "✓ No localhost fallback in pocketbase-integration.js"

echo ""
echo "📋 Summary"
echo "=========="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All security checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review: PUBLIC_DEPLOYMENT_GUIDE.md"
    echo "2. Check: _includes/head.html has correct POCKETBASE_URL"
    echo "3. Test:  bundle exec jekyll serve --config _config_dev.yml"
    echo "4. Deploy: git push origin main"
    exit 0
else
    echo -e "${RED}❌ Some security checks failed!${NC}"
    echo ""
    echo "Issues found:"
    if ! test -f .gitignore; then
        echo "  - .gitignore file missing"
    fi
    if ! grep -q "ADMIN_PASSWORD.md" .gitignore 2>/dev/null; then
        echo "  - ADMIN_PASSWORD.md not protected"
    fi
    if grep -rq "password\|api_key" js/ --include="*.js" 2>/dev/null; then
        echo "  - Possible hardcoded credentials in JavaScript"
    fi
    echo ""
    echo "Review: WEBSITE_SECURITY.md for detailed information"
    exit 1
fi
