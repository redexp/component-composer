require([
	'component-composer',
	'components/row',
	'components/column',
	'components/textfield',
	'components/select',
	'jquery'
], function (
	Composer,
	Row,
	Column,
	Textfield,
	Select,
	$
) {

	Row.prototype.node = $('[data-component="row"]').detach().prop('outerHTML');
	Column.prototype.node = $('[data-component="column"]').detach().prop('outerHTML');
	Textfield.prototype.node = $('[data-component="textfield"]').detach().prop('outerHTML');
	Select.prototype.node = $('[data-component="select"]').detach().prop('outerHTML');

	var composer = new Composer({
		node: '#composer',
		data: {
			toolbar: [
				{
					type: 'row',
					title: 'Row',
					componentView: Row,
					componentData: function () {
						return {
							type: 'row',
							cells: []
						};
					}
				},
				{
					type: 'column',
					title: 'Column',
					componentView: Column,
					componentData: function () {
						return {
							type: 'column',
							rows: []
						};
					}
				},
				{
					type: 'textfield',
					title: 'Text field',
					componentView: Textfield,
					componentData: function () {
						return {
							type: 'textfield'
						};
					}
				},
				{
					type: 'select',
					title: 'Select',
					componentView: Select,
					componentData: function () {
						return {
							type: 'select'
						};
					}
				}
			],
			components: [
				{
					type: 'row',
					cells: [
						{
							type: 'column',
							rows: [
								{type: 'textfield'}
							]
						},
						{
							type: 'column',
							rows: [
								{type: 'select'}
							]
						}
					]
				}
			]
		}
	});

	composer.node.removeClass('initializing');

	window.test = composer;
});