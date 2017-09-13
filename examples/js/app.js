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
			types: [
				{
					id: 'row',
					title: 'Row',
					view: Row,
					data: Row.data
				},
				{
					id: 'column',
					title: 'Column',
					view: Column,
					data: Column.data
				},
				{
					id: 'select',
					title: 'Dropdown',
					view: Select,
					data: Select.data
				},
				{
					id: 'textfield',
					title: 'Text field',
					view: Textfield,
					data: function () {
						return {
							type: 'textfield'
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
});