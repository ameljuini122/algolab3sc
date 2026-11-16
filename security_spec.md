# AlgoLab Security Specification & Red-Team Audit

## 1. Data Invariants
1. Default-deny catch-all rule rejects every unmatched path.
2. Only verified Google-authenticated teacher accounts (`request.auth.token.email_verified == true` and authorized teacher email `amelijuini3@gmail.com` or `/admins/{uid}`) may read or write teacher collections (`classes`, `sessions`, `students`, `exerciseOverrides`, `submissions`, `settings`).
3. Every document ID must match `^[a-zA-Z0-9_\-]+$` and be at most 128 characters.
4. Every string field enforces strict `.size()` upper and lower bounds to prevent Denial-of-Wallet storage attacks.
5. `createdAt` and `updatedAt` are validated against `request.time` (server timestamps only), and `createdAt` / `teacherUid` are immutable after creation.
6. Every `allow update` begins with `isValid[Entity](incoming())` and strictly restricts modified keys using `affectedKeys().hasOnly(...)`.
7. Student classroom operations without Google accounts run through the authenticated Express API (`/api/student/*`) with server-generated opaque `studentId` tokens and active session validation; students never have direct write access to teacher Firestore collections.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated read of `/students/stu_1`**: No `request.auth` -> denied by `isTeacherAdmin()`.
2. **Unverified email spoofing**: `request.auth.token.email == 'amelijuini3@gmail.com'` with `email_verified == false` -> denied by `isVerified()`.
3. **Self-assigned admin escalation**: User writes `/admins/{uid}` directly -> denied (`allow write: if false;` for non-bootstrapped admins).
4. **Shadow field injection on `/classes/{id}` create**: Adding `isAdmin: true` -> denied by `data.keys().hasOnly([...])`.
5. **Shadow field injection on `/sessions/{id}` update**: Modifying `teacherUid` -> denied by `affectedKeys().hasOnly(...)` and immutability check.
6. **ID poisoning**: Creating `/classes/` with a 500-char ID or invalid characters -> denied by `isValidId()`.
7. **Oversized string payload**: Creating `/exerciseOverrides/ex1` with 20KB statement -> denied by `data.statement.size() <= 5000`.
8. **Type poisoning on update**: Updating `settings/tutor` with `maxHintLevel: "unlimited"` -> denied by `isValidTutorConfig()`.
9. **Client-forged timestamp**: Creating `/sessions/s1` with client-provided past `createdAt` -> denied by `data.createdAt == request.time`.
10. **Non-teacher listing `/submissions`**: Signed-in non-teacher user runs `list` on `/submissions` -> denied by `resource.data.teacherUid == request.auth.uid` / `isTeacherAdmin()`.
11. **Invalid enum status on `/submissions/sub1`**: Setting `status: "hacked"` -> denied by allowlist check.
12. **Blanket collection read on `/test/connection`**: Only specific `test/connection` health doc read is permitted for connection check if signed in, never arbitrary documents.
