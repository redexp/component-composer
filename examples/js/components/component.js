define('components/component', [
	'component-composer'
], function (
	Composer
) {

	function Component() {
		Composer.Component.apply(this, arguments);
	}

	Composer.Component.extend({
		constructor: Component,

		data: {
			menuOpened: false
		},

		closeMenu: function () {
			this.set('menuOpened', false);
		},

		toggleMenu: function () {
			this.set('menuOpened', !this.get('menuOpened'));
		},

		cut: function () {
			this.closeMenu();

			return Component.__super__.cut.call(this);
		},

		copy: function () {
			this.closeMenu();

			return Component.__super__.copy.call(this);
		},

		clone: function () {
			this.closeMenu();

			return Component.__super__.clone.call(this);
		},

		delete: function () {
			this.parent.model(this.parent.data.componentsProp).remove(this.data.component);
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
						'click': '!closeMenu'
					}
				},

				'& [data-remove]': {
					on: {
						'click': 'delete'
					}
				}
			}

		}
	});

	return Component;
});