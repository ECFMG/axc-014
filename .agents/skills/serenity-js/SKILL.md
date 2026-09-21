---
name: serenity-js
description: >
  Write and run Serenity/JS Cucumber acceptance tests for agentCourses.
  Use when editing packages/axc-verification/acceptance-api, Gherkin features,
  Screenplay tasks, or the Serenity HTML report.
---

# Serenity/JS

`pnpm dlx skills add serenity-js/serenity-js` found no SKILL.md in that repository. This project skill records the local convention.

- Acceptance tests live in `packages/axc-verification/acceptance-api`.
- Drive the API over HTTP against the process started from `@apps/api` (`dist/serve.js`). Do not construct `@axc/rest`, Hono, or application services inside the acceptance package.
- Use `@cellix/serenity-framework` (`ProcessTestServer`, `registerManagedSerenityWorld`, `SerenityCast`) with `@serenity-js/cucumber` and `@serenity-js/serenity-bdd`.
- Generate the HTML report with the Serenity BDD CLI after Cucumber. Java is required.
- The health scenario must assert `GET /health` returns status `ok`, service `agentCourses-api`, projectCode `axc`, the running environment, and an ISO-8601 timestamp.
