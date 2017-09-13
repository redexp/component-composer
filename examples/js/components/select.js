define('components/select', [
	'components/component'
], function (
	Component
) {

	function Select() {
		Component.apply(this, arguments);
	}
	
	Select.data = function () {
		return {
			type: 'select'
		};
	};

	Component.extend({
		constructor: Select,

		template: {

		}
	});

	return Select;
});