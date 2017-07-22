require([
	'component-composer',
	'components/row',
	'components/cell',
	'components/textfield',
	'components/select',
	'jquery'
], function (
	Composer,
	Row,
	Cell,
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
			title: 'Cell',
			view: Cell,
			node: $('[data-component="cell"]').detach()
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

	composer.model('toolbar').moveFrom(1, 0); // Row on first place
});