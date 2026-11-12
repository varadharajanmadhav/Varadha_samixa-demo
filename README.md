# Varadha_samixa-demo

A small, dependency-free TypeScript service for a customer portal's sign-in.
It exists only to exercise Samixa's AI orchestration (repository sync, code
questions, defect fixes, feature work and reviews). **Safe to delete.**

## What it does

| Area | File | Behaviour |
|---|---|---|
| Users | `src/users/userStore.ts` | In-memory user store with hashed passwords |
| Sign-in | `src/auth/login.ts` | Email + password login; locks the account for 15 minutes after 5 failed attempts |
| Password reset | `src/auth/passwordReset.ts` | "Forgot password" issues a single-use token valid for 60 minutes and emails a reset link |
| Password policy | `src/utils/passwordPolicy.ts` | New passwords need at least 8 characters, a digit and a letter |
| Email | `src/notifications/emailSender.ts` | Fake sender that records messages (no real email) |

## Run the tests

Requires Node.js 22.6 or later (runs TypeScript directly, no build step).

```bash
npm test
```

## Open work

See [docs/backlog.md](docs/backlog.md) for the known defect and the next feature.
