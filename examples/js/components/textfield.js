define('components/textfield', [
	'components/component'
], function (
	Component
) {

	function Textfield() {
		Component.apply(this, arguments);
	}

	Component.extend({
		constructor: Textfield,

		template: {

		}
	});

	return Textfield;
});