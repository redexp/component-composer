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

	var components = [
		{
			title: 'Row',
			view: Row,
			node: $('[data-component="row"]').detach()
		},
		{
			title: 'Column',
			view: Column,
			node: $('[data-component="column"]').detach()
		},
		{
			title: 'Text field',
			view: Textfield,
			node: $('[data-component="textfield"]').detach()
		},
		{
			title: 'Select',
			view: Select,
			node: $('[data-component="select"]').detach()
		}
	];

	var composer = new Composer({
		node: '#composer'
	});

	composer.model('toolbar').add(components);
});