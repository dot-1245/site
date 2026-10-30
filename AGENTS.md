# AGENTS.md

## General principles

* Read relevant existing code, configuration, and documentation before making changes.
* Understand the existing architecture and conventions before introducing new patterns.
* Prefer small, focused changes over broad refactors.
* Do not replace existing architecture, conventions, or dependencies without a concrete reason.
* Preserve existing functionality unless the task explicitly requests a behavior change.
* Do not modify unrelated files.
* When a task explicitly limits the scope of changes, stay within that scope.
* Avoid speculative cleanup and unrelated modernization.
* Prefer existing project capabilities over introducing additional dependencies.
* Do not make assumptions about project behavior when it can be verified from the repository.

## Before changing code

Before making a non-trivial change:

1. Inspect the relevant files.
2. Read applicable project documentation and `AGENTS.md` files.
3. Identify existing conventions and implementation patterns.
4. Determine the smallest coherent set of files that needs modification.
5. Check for existing utilities or abstractions before creating new ones.
6. Avoid unrelated cleanup unless explicitly requested.

When requirements are ambiguous, prefer investigating the repository before asking the user questions that the repository itself can answer.

## Scope and preservation

* Preserve existing behavior unless a change is explicitly requested.
* Do not silently broaden the scope of a task.
* Do not alter unrelated configuration, formatting, dependencies, generated files, or documentation.
* Avoid large mechanical rewrites unless they are necessary for the requested change.
* If an existing implementation appears unusual, determine why it exists before replacing it.
* Treat existing user changes and uncommitted work as intentional unless proven otherwise.
* Never discard or overwrite user changes merely to simplify the task.

## Dependencies

* Do not introduce a new dependency when the language, framework, platform, or existing project code can adequately solve the problem.
* Before adding a dependency, determine whether the repository already provides equivalent functionality.
* Prefer well-maintained and appropriately scoped dependencies when one is genuinely necessary.
* Do not upgrade unrelated dependencies as part of another task unless explicitly requested.

## External services

* Avoid unnecessary runtime dependencies on external services.
* Assume external APIs and services may be unavailable, rate-limited, changed, or removed.
* Prefer designs that degrade gracefully when external services are unavailable.
* Cache or synchronize externally sourced data when that is more appropriate than making repeated runtime requests.
* Respect documented API limits and identification requirements.
* Do not treat externally available data as automatically safe, accurate, permanent, or legally reusable.

## Security and credentials

* Never commit secrets, credentials, private keys, access tokens, session material, or other sensitive authentication data.
* Do not print secrets into logs or command output unless explicitly required for a secure administrative task.
* Prefer environment variables, secret stores, credential helpers, agents, or the project's established secret-management mechanism.
* Do not weaken authentication, authorization, transport security, or other security controls merely to make a task easier.
* Do not expose services publicly unless explicitly requested.
* Preserve least-privilege boundaries where practical.

## Accessibility

For user-facing interfaces, target WCAG 2.2 AA-level accessibility unless the repository specifies a different standard.

In particular:

* Do not communicate essential information through color alone.
* Maintain visible keyboard focus.
* Prefer semantic HTML and native controls where appropriate.
* Preserve meaningful heading hierarchy.
* Provide useful alternative text for meaningful images.
* Use empty alternative text for purely decorative images.
* Ensure interactive controls are keyboard accessible.
* Respect `prefers-reduced-motion`.
* Ensure interfaces remain usable with increased text size and page zoom.

## Responsive interfaces

For responsive user interfaces:

* Do not design solely around named devices.
* Choose breakpoints based on where the content or layout actually stops working.
* Preserve meaningful aspect ratios for media.
* Avoid layouts that depend on a single viewport size.
* Check narrow, intermediate, and wide layouts when relevant.

## Validation

After making changes:

* Inspect the resulting diff.
* Verify that only intended files changed.
* Run the project's relevant formatting, linting, type-checking, test, and build commands when available and appropriate.
* Prefer targeted validation first, followed by broader validation when justified.
* Do not claim that a test, build, lint, formatter, deployment, or other validation step passed unless it was actually run successfully.
* If validation cannot be run, state that clearly.
* Report relevant failures instead of hiding or silently ignoring them.
* Distinguish failures caused by the change from unrelated pre-existing failures when possible.

## Generated files

* Do not manually edit generated files unless the project explicitly requires it.
* Prefer modifying the source and running the documented generation process.
* Do not commit generated output unless the repository normally tracks it or the task explicitly requires it.
* If generation changes many files, verify that the resulting changes are expected.

## Documentation

* Keep documentation synchronized with behavior when the requested change makes existing documentation incorrect.
* Do not create documentation solely to describe obvious implementation details.
* Follow existing documentation structure and terminology.
* Prefer concise documentation that explains intent, constraints, and non-obvious behavior.

## Git

Keep commits focused, descriptive, and limited to the intended changes.

Before committing:

1. Inspect `git status`.
2. Inspect the relevant diff.
3. Verify that only the intended files are staged.
4. Ensure unrelated or pre-existing user changes are not included.

Do not rewrite history, reset, rebase, amend existing commits, force-push, delete branches, or otherwise perform destructive Git operations unless explicitly requested.

Do not commit generated files, unrelated changes, or pre-existing uncommitted work unless the task requires them.

When a task specifies an exact commit message, use it exactly.

### Commit messages

When an AI agent creates a commit, use the following subject format by default:

```text
[AgentName] <type>: <description>
```

Use the agent's canonical short name in uppercase when known.

Examples:

```text
[CODEX] feat: add search filtering
[CODEX] fix: handle missing artwork
[CODEX] docs: update repository guidelines
```

Use a concise lowercase commit type appropriate to the change. Prefer conventional types where applicable:

* `feat` — new user-facing functionality
* `fix` — bug fixes and corrections
* `docs` — documentation-only changes
* `refactor` — code restructuring without intended behavior changes
* `test` — tests or test infrastructure
* `chore` — maintenance that does not fit another category
* `build` — build system or dependency changes
* `ci` — continuous-integration configuration

The description should be concise, imperative in style, and describe the actual change.

Do not infer a mandatory commit-message convention solely from historical commits. Existing Git history is useful context, but is not authoritative unless the repository explicitly documents a different convention.

If the repository explicitly defines its own commit-message policy in documentation or configuration, follow that policy instead of this default.

If the agent identity is unknown and an agent-prefixed commit is required, ask for clarification rather than guessing.

### Authorship and commit attribution

Git authorship should represent who materially authored the change. Git committer identity should represent the human or system that accepted and recorded the resulting commit.

When an AI agent is the primary material author of a commit, set the Git author identity to that agent while preserving the existing committer identity.

For example, a Codex-authored commit should normally have:

```text
Author: Codex <codex@openai.com>
Committer: <existing human committer identity>
```

For Codex, this can be accomplished without changing the repository's configured committer identity by creating the commit with:

```sh
git commit --author="Codex <codex@openai.com>" ...
```

Do not globally replace `user.name` or `user.email` merely to attribute an individual agent-authored commit.

Do not change the committer identity from the existing human or system identity unless explicitly requested.

The commit should continue to use the appropriate agent-prefixed subject:

```text
[CODEX] <type>: <description>
```

Do not add a `Co-authored-by` trailer for the primary author. In particular, if Codex is already the Git author, do not also add:

```text
Co-authored-by: Codex <codex@openai.com>
```

When multiple parties materially author the same change, use the primary author as the Git author and attribute other material authors with appropriate `Co-authored-by` trailers.

Known agent identities are:

Codex:

```text
Codex <codex@openai.com>
```

Gemini Code Assist:

```text
gemini-code-assist[bot] <176961590+gemini-code-assist[bot]@users.noreply.github.com>
```

Claude:

```text
Claude <noreply@anthropic.com>
```

For example, if Codex is the primary author and Gemini Code Assist also materially contributed:

```text
Author: Codex <codex@openai.com>

Co-authored-by: gemini-code-assist[bot] <176961590+gemini-code-assist[bot]@users.noreply.github.com>
```

When the human operator materially co-authored an AI-authored change, attribute the human as a co-author only when their contribution constitutes authorship rather than merely review, approval, prompting, or execution of the agent.

Do not treat merely invoking an agent, providing a task, reviewing its work, approving tool use, or accepting a commit as material co-authorship.

Likewise, do not attribute an AI agent that did not materially contribute to the contents of the commit.

When multiple agents materially contributed, include each applicable `Co-authored-by` trailer that is not already represented by the primary Git author.

Never infer or invent names, email addresses, or other attribution identities for unknown agents. If correct attribution is required but the identity is unknown, ask for clarification.

### Signing

Preserve the repository or user's existing commit-signing configuration.

The commit's cryptographic signer does not need to be identical to its Git author. An AI-authored commit may therefore be authored by the agent while being committed and signed by the human operator.

For example:

```text
Author: Codex <codex@openai.com>
Committer: dot-1245 <github@dot1245.net>
Signature: dot-1245's configured signing key
```

Do not disable required or existing commit signing merely because an agent-authored commit uses a different author identity.

Do not bypass signing failures without explicit permission. If signing requires an SSH agent, credential manager, hardware token, approval dialog, or other external authentication mechanism and it is unavailable, report the failure rather than silently creating an unsigned commit.

After committing, inspect the resulting commit when appropriate and verify:

* the intended files were committed,
* the subject is correct,
* the Git author is correct,
* the committer identity was preserved,
* co-author attribution is correct,
* and required signing succeeded.

## Completion

When finishing a task:

* Summarize what materially changed.
* Mention validation that was actually performed.
* Mention important validation that could not be performed.
* Surface any remaining limitations or follow-up work that directly affects the requested task.
* Do not exaggerate the completeness of the implementation.


## Other
read AGENTS/* if it exist.