import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { configure, ArtifactArchiver } = require('@serenity-js/core');
const { SerenityBDDReporter } = require('@serenity-js/serenity-bdd');

configure({
	crew: [ArtifactArchiver.fromJSON({ outputDirectory: 'target/site/serenity' }), SerenityBDDReporter.fromJSON({ specDirectory: 'features' })],
});
