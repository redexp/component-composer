define('components/column', [
	'component-composer'
], function (
	Composer
) {

	function Column() {
		Composer.ContainerComponent.apply(this, arguments);
	}

	Composer.ContainerComponent.extend({
		constructor: Column
	});

	return Column;
});