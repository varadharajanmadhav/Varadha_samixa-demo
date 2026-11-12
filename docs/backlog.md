# Backlog

## DEMO-1 (defect): 7-character passwords are accepted

The policy says a new password needs **at least 8 characters**, but
`validatePassword` in `src/utils/passwordPolicy.ts` accepts a 7-character
password such as `abc1234`.

Acceptance criteria:
- `validatePassword("abc1234")` is rejected with reason `too_short`.
- `validatePassword("abcd1234")` is accepted.
- A test covers the 7- and 8-character boundary.

## DEMO-2 (feature): limit password-reset emails

Anyone can request unlimited reset emails for an account, which can be used to
spam a user.

Acceptance criteria:
- At most **3** reset emails per account in any rolling **60-minute** window.
- The 4th request inside the window is refused with reason `rate_limited` and
  sends no email.
- Requests for an unknown email still return the same neutral response
  (do not reveal whether the account exists).
- Tests cover the limit and the window reset.

## DEMO-3 (question): how does lockout interact with password reset?

Explain, with file and line references, whether completing a password reset
clears a login lockout today.
