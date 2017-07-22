define('components/cell', [
	'component-composer'
], function (
	Composer
) {

	function Cell() {
		Composer.ContainerComponent.apply(this, arguments);
	}

	Composer.ContainerComponent.extend({
		constructor: Cell
	});

	return Cell;
});