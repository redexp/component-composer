define('components/column', [
	'components/container'
], function (
	Container
) {

	function Column() {
		Container.apply(this, arguments);
	}

	Container.extend({
		constructor: Column
	});

	return Column;
});