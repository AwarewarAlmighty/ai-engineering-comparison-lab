# AGENTS.md

## Purpose
This repository is a classroom experiment comparing Prompt Engineering, Agentic Engineering, and Loop Engineering.

## Important rules
- The registration endpoint is intentionally insecure on the baseline branches.
- Preserve the existing Express and Mongoose structure.
- Make only changes required by the registration acceptance criteria.
- Do not add unrelated features.
- Do not remove or weaken tests.
- Do not expose secrets or add real credentials.

## Verification
Run:

```bash
npm test
npm run lint
```

## Acceptance criteria
- Valid registration returns HTTP 201.
- Passwords are hashed before storage.
- Passwords are not returned in responses.
- Missing fields return HTTP 400.
- Invalid email addresses return HTTP 400.
- Duplicate emails return HTTP 409.
- Client-provided roles cannot create admins.
