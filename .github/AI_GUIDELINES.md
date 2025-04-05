# AI Assistant Guidelines

When working with this codebase, AI assistants MUST:

1. **ALWAYS check TECH_STACK.md first** before suggesting any technology, library, or framework
2. **NEVER suggest Maven** or any Maven-related tooling (this is a Gradle-only project)
3. **NEVER suggest Redux** or other state management libraries (use React Query only)
4. **NEVER suggest jQuery or CSS-in-JS libraries** (use native DOM methods and TailwindCSS)
5. **ALWAYS USE .env FOR SECRETS AND SENSITIVE DATA** - never suggest hardcoding credentials
6. **Use existing patterns** found in the codebase for all suggestions
7. **Follow the architecture** defined in the project documentation
8. **Respect the repository structure** and file organization patterns

## Verification Checklist

Before making suggestions, verify:
- [ ] Is this compatible with Gradle (backend) or npm+Vite (frontend)?
- [ ] Does this follow Spring Boot standards (backend) or React standards (frontend)?
- [ ] Does this match existing patterns in the codebase?
- [ ] Have I checked TECH_STACK.md to confirm this is allowed?
- [ ] Are all sensitive values handled via environment variables?

## Security Standards

When handling security-related code:
1. Always use environment variables for secrets via .env files
2. Never suggest hardcoded credentials in application code
3. Use proper JWT authentication for protected endpoints
4. Ensure sensitive operations require admin role verification
5. Reference secrets in configuration files using variable syntax with secure defaults

## When In Doubt

If uncertain about a technology choice, ALWAYS:
1. Defer to TECH_STACK.md
2. Ask for clarification before proceeding
3. Suggest options that align with existing technology choices 