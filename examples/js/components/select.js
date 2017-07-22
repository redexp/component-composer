define('components/select', [
	'components/component'
], function (
	Component
) {

	function Select() {
		Component.apply(this, arguments);
	}

	Component.extend({
		constructor: Select,

		template: {

		}
	});

	return Select;
});