export default {
	paths: ['features/**/*.feature'],
	import: ['src/serenity.ts', 'src/world.ts', 'src/step-definitions/**/*.ts'],
	format: ['@serenity-js/cucumber', 'summary'],
	formatOptions: {
		snippetInterface: 'async-await',
	},
};
