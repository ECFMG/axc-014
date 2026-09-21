'use strict';

// Cucumber's import() loads the ESM @serenity-js/cucumber listener, which emits
// ESM event classes. SerenityBDDReporter only matches the CommonJS event classes.
// This formatter is the CommonJS listener so the crew attached in src/serenity.ts
// records the scenario that Cucumber runs.
module.exports = require('@serenity-js/cucumber').default;
