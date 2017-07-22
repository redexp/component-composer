define('components/component', [
	'component-composer',
	'jquery'
], function (
	Composer,
	$
) {

	function Component() {
		Composer.Component.apply(this, arguments);
	}

	Composer.Component.extend({
		constructor: Component,

		data: {
			menuOpened: false
		},

		toggleMenu: function () {
			this.set('menuOpened', !this.get('menuOpened'));
		},

		template: {
			'[data-menu]': {
				toggleClass: {
					'open': '@menuOpened'
				},

				'& [data-open-menu]': {
					on: {
						'click': 'toggleMenu'
					}
				},

				'& .dropdown-menu': {
					on: {
						'click': '!toggleMenu'
					}
				}
			}

		}
	});

	function Container() {
		Component.apply(this, arguments);
	}

	Component.extend({
		constructor: Container,


	});

	return Component;
});