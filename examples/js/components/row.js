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

		data: function () {
			return {
				componentsProp: ['component', 'cells'],
				componentsDirection: 'horizontal'
			};
		}
	});

	return Row;
});