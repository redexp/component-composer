define('components/textfield', [
	'component-composer'
], function (
	Composer
) {

	function Textfield() {
		Composer.Component.apply(this, arguments);
	}

	Composer.Component.extend({
		constructor: Textfield,

		template: {

		}
	});

	return Textfield;
});