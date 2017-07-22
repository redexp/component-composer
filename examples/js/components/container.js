define('components/container', [
	'components/component',
	'component-composer'
], function (
	Component,
	Composer
) {

	function Container() {
		Component.apply(this, arguments);
	}

	Component.extend(Object.assign({}, Composer.ContainerComponent.prototype, {
		constructor: Container
	}));

	return Container;
});