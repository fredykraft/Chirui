# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability in this repository, please report it responsibly by **NOT** opening a public GitHub issue. Instead, please use GitHub's security advisory feature or email [your security contact email].

### Preferred Reporting Method

1. Go to the [Security Advisories](../../security/advisories) tab
2. Click **"Report a vulnerability"**
3. Fill in the form with:
   - **Vulnerability title**: Brief description
   - **Description**: Detailed explanation of the vulnerability
   - **Severity**: CVSS severity rating if applicable
   - **Affected file(s)**: Which files are affected
   - **Proof of concept**: Example showing the vulnerability
   - **Suggested fix**: If you have a potential solution

### What Constitutes a Security Vulnerability

**IS a security vulnerability:**
- Unauthorized access to user data
- Authentication/authorization bypass
- Exposure of sensitive credentials or API keys
- SQL injection, XSS, CSRF vulnerabilities
- Hardcoded secrets in code
- Insecure dependencies with known CVEs
- HTTPS/TLS configuration issues
- Missing security headers when expected
- Privilege escalation issues

**IS NOT a security vulnerability:**
- Spelling mistakes or typos
- Feature requests
- Documentation improvements
- UI/UX issues
- Performance optimization suggestions
- Questions about deployment

## Security Features

This project implements the following security measures:

### 1. **Configuration Management**
- Environment variables via `.env` file (in `.gitignore`, never committed)
- `.env.example` template as secure configuration pattern
- Early configuration in HTML head before API scripts load
- No hardcoded localhost development endpoints in production code

### 2. **Authentication**
- PocketBase backend authentication
- Token-based sessions with secure storage
- Password hashing and salt by PocketBase

### 3. **Data Protection**
- HTTPS-only communication with secure headers:
  - Content-Security-Policy (CSP) for XSS prevention
  - X-Frame-Options to prevent clickjacking
  - X-Content-Type-Options to prevent MIME sniffing
  - Referrer-Policy for privacy
  - Strict-Transport-Security (HSTS) for HTTPS enforcement

### 4. **Repository Security**
- Sensitive files protected in `.gitignore` (ADMIN_PASSWORD.md, .env, secrets)
- `.gitattributes` configuration for proper file handling
- CODEOWNERS for code review requirements on sensitive files
- Branch protection rules for main branch

### 5. **Dependency Management**
- Regular Gemfile updates for Jekyll and plugins
- Monitoring for vulnerable dependencies
- Automated vulnerability alerts via Dependabot

## Security Response Timeline

- **Critical Issues (CVSS 9.0-10.0)**: Resolved within 48 hours
- **High Issues (CVSS 7.0-8.9)**: Resolved within 1 week
- **Medium Issues (CVSS 4.0-6.9)**: Resolved within 2 weeks
- **Low Issues (CVSS 0.1-3.9)**: Resolved within 1 month

## After Your Report

1. We'll acknowledge receipt within 24 hours
2. We'll investigate and assess the severity
3. We'll develop and test a fix
4. We'll release a security update (may include version bump)
5. We'll credit you in the security advisory (unless you prefer anonymity)

## Responsible Disclosure

Please allow reasonable time (30 days minimum) for us to fix and release a patch before publicly disclosing the vulnerability. We're committed to working transparently while protecting users' security.

## Security Contact

For sensitive security inquiries, you can also contact:
- **Email**: [your-security-email@example.com]
- **PGP Key**: [link to your PGP key if available]

## Additional Resources

- [GitHub Security Advisory Guidance](https://docs.github.com/en/code-security/repository-security-advisories)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/CVSS Score Calculator](https://www.first.org/cvss/calculator/3.1)
- [Security Checklist](./DEPLOYMENT_SECURITY_CHECKLIST.md)

---

**Last Updated**: 2024
**Security Policy Version**: 1.0
