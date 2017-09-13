define('components/column', [
	'components/container'
], function (
	Container
) {

	function Column() {
		Container.apply(this, arguments);
	}
	
	Column.data = function () {
		return {
			type: 'column',
			rows: []
		};
	};

	Container.extend({
		constructor: Column,

		data: function () {
			return {
				componentsProp: ['component', 'rows'],
				componentsDirection: 'vertical'
			};
		}
	});

	return Column;
});