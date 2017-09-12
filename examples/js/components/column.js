define('components/column', [
	'components/container'
], function (
	Container
) {

	function Column() {
		Container.apply(this, arguments);
	}

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