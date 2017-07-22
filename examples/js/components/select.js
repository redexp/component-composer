define('components/select', [
	'component-composer'
], function (
	Composer
) {

	function Select() {
		Composer.Component.apply(this, arguments);
	}

	Composer.Component.extend({
		constructor: Select,

		template: {

		}
	});

	return Select;
});