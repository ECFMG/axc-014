import { configure } from '@serenity-js/core';

configure({
	crew: [
		['@serenity-js/core:ArtifactArchiver', { outputDirectory: 'target/site/serenity' }],
		['@serenity-js/serenity-bdd', { specDirectory: 'features' }],
	],
});
