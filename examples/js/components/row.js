define('components/row', [
	'component-composer'
], function (
	Composer
) {

	function Row() {
		Composer.ContainerComponent.apply(this, arguments);
	}

	Composer.ContainerComponent.extend({
		constructor: Row,

		ui: {
			components: '[data-cells]'
		},

		data: {
			componentsDirection: 'horizontal'
		}
	});

	return Row;
});