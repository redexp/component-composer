define('components/row', [
	'components/container'
], function (
	Container
) {

	function Row() {
		Container.apply(this, arguments);
	}

	Container.extend({
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