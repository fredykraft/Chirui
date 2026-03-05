# Git Hooks Setup Guide

This project includes Git hooks to prevent accidentally committing sensitive information. This guide helps you set them up locally.

## What are Git Hooks?

Git hooks are scripts that automatically run at certain points in the Git workflow (before commit, before push, etc). We use pre-commit hooks to catch and prevent commits that contain:

- Sensitive files (`.env`, `ADMIN_PASSWORD.md`, keys, etc.)
- Hardcoded secrets (API keys, passwords, tokens)
- Development-only URLs (localhost, 127.0.0.1)

## 🚀 Installation

### Option 1: Automatic Setup (Recommended)

Run this command in the repository root:

```bash
cd /Users/cheerie/Documents/GitHub/Chirui
mkdir -p .git/hooks
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

Or use the all-in-one command:

```bash
cp .githooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit && echo "✓ Pre-commit hook installed"
```

### Option 2: Using Git Configuration

Configure Git to use `.githooks` directory:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit
```

This is preferred because it keeps hooks in version control.

## ✅ Verify Installation

Test that the hook is working:

```bash
# Try to stage a sensitive file
echo "test" > .env
git add .env

# This should fail with the error:
# ✗ BLOCKED: Sensitive file detected: .env
# Aborted commit
```

If you see the error, the hook is working correctly! ✓

Remove the test file:

```bash
git reset .env
rm .env
```

## 🔍 What the Hook Checks

The pre-commit hook will **BLOCK** commits that contain:

### Sensitive Files
- `.env`, `.env.local`, `.env.*.local`
- `ADMIN_PASSWORD.md`
- Any files matching: `*.secret`, `*.pem`, `*.key`, `*.p8`, `*.p12`

### Hardcoded Secrets
- Lines containing: password, api_key, secret, token, auth (case-insensitive)
- **WARNING**: You'll be prompted to confirm (can still override)

### Development URLs
- `127.0.0.1:8090`
- `localhost:8090`

## 🛠️ If the Hook Prevents Your Commit

**Problem**: My legitimate commit is being blocked

**Solution**:

1. **Identify which file/content** is flagged by the error message
2. **Check why** it matches the patterns:
   ```bash
   # Do you really need to commit this file?
   # Or can it be added to .gitignore instead?
   ```
3. **For false positives**:
   - If it's a legitimate file, add it to `ALLOWED_PATTERNS` in `.githooks/pre-commit`
   - Create issue: "False positive in pre-commit hook for: [file]"

## 📝 Bypassing the Hook (Emergency Only)

If you absolutely must commit something flagged by the hook:

```bash
# Skip the pre-commit hook (use sparingly!)
git commit --no-verify -m "Emergency commit reason"
```

**⚠️ WARNING**: Only use `--no-verify` when absolutely necessary, and document why in the commit message.

## 🔄 Updating Hook Files

If `.githooks/pre-commit` is updated, reinstall it:

```bash
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

Or if using `core.hooksPath`:

```bash
git config core.hooksPath .githooks
```

Will automatically use the latest version.

## 🐛 Troubleshooting

### Hook doesn't run at all

**Check that hooks are executable:**

```bash
ls -la .git/hooks/pre-commit
# Should show: -rwxr-xr-x (note the 'x' for executable)
```

**If not marked as executable:**

```bash
chmod +x .git/hooks/pre-commit
```

### Getting permission denied

**Error**: `Permission denied: .git/hooks/pre-commit`

```bash
# Make it executable
chmod +x .git/hooks/pre-commit
chmod +x /Users/cheerie/Documents/GitHub/Chirui/.git/hooks/pre-commit
```

### Hook works in terminal but not in IDE

Some IDEs (like VS Code Git) bypass shell hooks. Solution:

1. Use terminal for commits involving sensitive files
2. Or disable source control Git in IDE and use terminal exclusively
3. Or configure your IDE to respect Git hooks:
   - **VS Code**: Install "Git Hooks" extension
   - **JetBrains IDEs**: Settings → Version Control → Git → Use Git hooks

### False positives getting annoying

If certain patterns trigger too many false positives:

1. Edit `.githooks/pre-commit`
2. Find the `SECRETS_FOUND` section
3. Make the regex pattern more specific
4. Or remove less-important checks

## 📚 Related Files

- [SECURITY.md](.github/SECURITY.md) - How to report security issues
- [.gitignore](.gitignore) - Files that should never be committed
- [.env.example](.env.example) - Template for environment configuration

## 🆘 Need Help?

1. Check this file for troubleshooting
2. Review the error message from the hook
3. Look at `.githooks/pre-commit` source code (well-commented)
4. Create a GitHub issue with tag `security` or `git-hooks`

---

**Last Updated**: 2024
**Hook Version**: 1.0
