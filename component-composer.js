;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['declarative-view', 'jquery'], factory);
	}
	else if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
		module.exports = factory(require('declarative-view'), jQuery);
	}
	else {
		window.ComponentComposer = factory(DeclarativeView, jQuery);
	}
})(function (View, $) {

	//region ====================== ComponentComposer =============================

	function ComponentComposer(options) {
		View.call(this, options);
	}

	View.extend({
		constructor: ComponentComposer,

		data: function () {
			return {
				arrow: {
					visible: false,
					direction: 'vertical',
					top: 0,
					left: 0,
					component: null,
					index: 0
				},
				toolbar: [],
				components: [],
				componentsDirection: 'vertical',
				componentsProp: 'components',
				componentDataProp: 'component',
				componentTypeProp: 'type'
			};
		},

		ui: {
			arrow: '> [data-arrow]',
			toolbar: '> [data-toolbar]',
			components: '> [data-components]'
		},

		forEachComponent: function (callback) {
			this.views['@components'].forEach(getAllComponents);

			function getAllComponents(item, i) {
				var res = callback(item, i);

				if (res === false) return;

				var views = item.views && item.views['@components'];

				if (views) {
					views.forEach(getAllComponents);
				}
			}
		},

		updateComponentsPositions: function () {
			var list = [];

			if (this.data[this.data.componentsProp].length === 0) {
				var main = getContainerOffset(this.ui.components);

				main.container = true;
				main.component = this;
				main.direction = this.data.componentsDirection;

				list.push(main);
			}

			this.forEachComponent(function (component, index) {
				var offset = getOffset(component.node);

				offset.component = component;
				offset.index = index;
				offset.direction = component.parent.data.componentsDirection;

				list.push(offset);

				var componentsProp = component.data.componentsProp,
					components = componentsProp && component.get(componentsProp);

				if (
					components &&
					components.length === 0
				) {
					var inner = getContainerOffset(component.ui.components);

					inner.container = true;
					inner.component = component;
					inner.direction = component.data.componentsDirection;

					list.push(inner);
				}
			});

			this.componentsPositions = list;

			function getOffset(node) {
				var offset = node.offset();

				offset.width = node.outerWidth();
				offset.height = node.outerHeight();
				offset.bottom = offset.top + offset.height;
				offset.right = offset.left + offset.width;
				offset.middle = offset.top + offset.height / 2;
				offset.center = offset.left + offset.width / 2;

				return offset;
			}

			function getContainerOffset(node) {
				var offset = getOffset(node);

				offset.innerTop = offset.top + parseInt(node.css('padding-top'));
				offset.innerLeft = offset.left + parseInt(node.css('padding-left'));

				return offset;
			}
		},

		updateArrow: function (pos) {
			var list = this.componentsPositions,
				arrow = this.model('arrow');

			for (var i = list.length - 1; i > -1; i--) {
				var offset = list[i];

				if (offset.container) {
					if (pos.top >= offset.top && pos.top <= offset.bottom && pos.left >= offset.left && pos.left <= offset.right) {
						arrow.set({
							direction: offset.direction,
							top: offset.innerTop,
							left: offset.innerLeft,
							visible: offset.component !== pos.component,
							component: null,
							parent: offset.component,
							index: 0
						});

						return;
					}
				}
				else if (offset.direction === 'vertical') {
					if (pos.left < offset.left || pos.left > offset.right) continue;

					if (pos.top >= offset.top && pos.top < offset.middle) {
						arrow.set({
							direction: offset.direction,
							top: offset.top,
							left: offset.left,
							visible: offset.component !== pos.component,
							component: offset.component,
							parent: offset.component.parent,
							index: offset.index
						});

						return;
					}
					else if (pos.top >= offset.middle && pos.top <= offset.bottom) {
						arrow.set({
							direction: offset.direction,
							top: offset.bottom,
							left: offset.left,
							visible: offset.component !== pos.component,
							component: offset.component,
							parent: offset.component.parent,
							index: offset.index + 1
						});

						return;
					}
				}
				else if (offset.direction === 'horizontal') {
					if (pos.top < offset.top || pos.top > offset.bottom) continue;

					if (pos.left >= offset.left && pos.left < offset.center) {
						arrow.set({
							direction: offset.direction,
							top: offset.top,
							left: offset.left,
							visible: offset.component !== pos.component,
							component: offset.component,
							parent: offset.component.parent,
							index: offset.index
						});

						return;
					}
					else if (pos.left >= offset.center && pos.left <= offset.right) {
						arrow.set({
							direction: offset.direction,
							top: offset.top,
							left: offset.right,
							visible: offset.component !== pos.component,
							component: offset.component,
							parent: offset.component.parent,
							index: offset.index + 1
						});

						return;
					}
				}
			}

			arrow.set({
				visible: false,
				component: null,
				parent: null,
				index: -1
			});
		},

		onToolbarItemStartDragging: function () {
			this.updateComponentsPositions();
		},

		onToolbarItemDragging: function (item) {
			this.updateArrow(item.get('position'));
		},

		onToolbarItemStopDragging: function (item) {
			this.componentsPositions = null;

			var arrow = this.model('arrow');

			if (!arrow.get('visible')) return;

			arrow.set('visible', false);

			var parent = arrow.get('parent');

			parent
				.model(parent.data.componentsProp)
				.add(this.getComponentData(item.data.type), arrow.get('index'))
			;
		},

		onComponentStartDragging: function () {
			this.updateComponentsPositions();
		},

		onComponentDragging: function (component) {
			var pos = component.get('position');
			this.updateArrow({
				top: pos.top,
				left: pos.left,
				component: component
			});
		},

		onComponentStopDragging: function (component) {
			this.componentsPositions = null;

			var arrow = this.model('arrow');

			if (!arrow.get('visible')) return;

			arrow.set('visible', false);

			var newParent = arrow.get('parent'),
				oldParent = component.parent,
				list = newParent.model(newParent.data.componentsProp),
				item = component.data[oldParent.data.componentDataProp],
				index = arrow.get('index');

			if (list.indexOf(item) === index) return;

			if (oldParent === newParent) {
				list.move(item, index);
			}
			else {
				oldParent.model(oldParent.data.componentsProp).remove(item);
				list.add(item, index);
			}
		},

		getComponentView: function (data) {
			var typeProp = this.data.componentTypeProp,
				type = data[typeProp];

			if (!type) {
				throw new Error('Undefined prop ' + JSON.stringify(typeProp));
			}

			var types = this.data.types;

			for (var i = 0, item; item = types[i]; i++) {
				if (item.id === type) {
					return typeof item === 'function' ? item : item.view;
				}
			}

			throw new Error('Unknown type ' + JSON.stringify(type));
		},

		getComponentData: function (item) {
			return item.data();
		},

		template: function () {
			return {
				'@arrow': {
					style: {
						top: '@arrow.top',
						left: '@arrow.left',
						display: {
							'@arrow.visible': function (visible) {
								return visible ? 'block' : 'none';
							}
						}
					},

					attr: {
						'data-direction': '@arrow.direction'
					}
				},

				'@toolbar': {
					each: {
						prop: 'types',
						view: ToolbarItem,
						dataProp: 'type'
					}
				},

				'@components': {
					each: {
						prop: this.data.componentsProp,
						view: this.getComponentView,
						dataProp: this.data.componentDataProp,
						node: false
					}
				}
			};
		}
	});

	//endregion

	//region ====================== Draggable =====================================

	function Draggable(options) {
		View.call(this, options);

		this.window = $(window);
		this.documentBody = $(document.body);
		this.listenOn(this.ui.dragZone, 'mousedown', this.validateDragging);
	}

	View.extend({
		constructor: Draggable,

		ui: {
			dragZone: '[data-drag-zone]',
			dragClone: '[data-drag-clone]'
		},

		data: function () {
			return {
				dragging: false,
				offset: {
					left: 10,
					top: 10
				},
				position: {
					left: 0,
					top: 0
				}

			};
		},

		validateDragging: function (e) {
			if (e.which === 1) {
				this.onStartDragging(e);
			}
		},

		onStartDragging: function (e) {
			this.model('position').set({
				top: e.pageY - this.data.offset.top,
				left: e.pageX - this.data.offset.left
			});

			this.ui.dragClone.appendTo(this.documentBody);

			this.listenOn(this.documentBody, 'mousemove.startDragging', this.onDragging);
			this.listenOn(this.documentBody, 'mouseup.startDragging', this.onStopDragging);

			this.set('dragging', true);
		},

		onDragging: function (e) {
			this.model('position').set({
				top: e.pageY - this.data.offset.top,
				left: e.pageX - this.data.offset.left
			});
		},

		onStopDragging: function () {
			this.ui.dragClone.appendTo(this.node);

			this.stopListening(this.window, 'scroll.startDragging');
			this.stopListening(this.documentBody, 'mousemove.startDragging');
			this.stopListening(this.documentBody, 'mouseup.startDragging');

			this.set('dragging', false);
		},

		template: function () {
			var tpl = {},
				node = '@dragClone';

			if (this.ui.dragClone.length === 0) {
				node = '@root';
			}

			tpl[node] = {
				style: {
					left: '@position.left',
					top: '@position.top'
				}
			};

			return tpl;
		}
	});

	//endregion

	//region ====================== ToolbarItem ===================================

	function ToolbarItem(options) {
		Draggable.call(this, options);
	}

	Draggable.extend({
		constructor: ToolbarItem,

		ui: {
			title: '[data-title]',
			dragZone: '@root'
		},

		onStartDragging: function (e) {
			var zone = this.ui.dragZone.offset();

			this.model('offset').set({
				top: e.pageY - zone.top,
				left: e.pageX - zone.left
			});

			Draggable.prototype.onStartDragging.call(this, e);

			this.parent.onToolbarItemStartDragging(this);
		},

		onDragging: function (e) {
			Draggable.prototype.onDragging.call(this, e);

			this.parent.onToolbarItemDragging(this);
		},

		onStopDragging: function (e) {
			Draggable.prototype.onStopDragging.call(this, e);

			this.parent.onToolbarItemStopDragging(this);
		},

		template: {
			'@title': {
				text: '=type.title'
			}
		}
	});

	//endregion

	//region ====================== Component =====================================

	function Component(options) {
		this.composer = (options.parent && options.parent.composer) || options.parent;

		Draggable.call(this, options);
	}

	Draggable.extend({
		constructor: Component,

		onStartDragging: function (e) {
			Draggable.prototype.onStartDragging.call(this, e);

			this.composer.onComponentStartDragging(this);
		},

		onDragging: function (e) {
			Draggable.prototype.onDragging.call(this, e);

			this.composer.onComponentDragging(this);
		},

		onStopDragging: function (e) {
			Draggable.prototype.onStopDragging.call(this, e);

			this.composer.onComponentStopDragging(this);
		}
	});

	//endregion

	//region ====================== ContainerComponent ============================

	function ContainerComponent() {
		Component.apply(this, arguments);
	}

	Component.extend({
		constructor: ContainerComponent,

		ui: {
			components: '[data-components]'
		},

		data: {
			componentsProp: ['component', 'components'],
			componentDataProp: 'component',
			componentsDirection: 'vertical'
		},

		forEachComponent: ComponentComposer.prototype.forEachComponent,

		template: function () {
			return {
				'@components': {
					each: {
						prop: this.data.componentsProp,
						view: function (item) {
							return this.composer.getComponentView(item);
						},
						dataProp: this.data.componentDataProp,
						node: false
					}
				}
			};
		}
	});

	//endregion

	ComponentComposer.Draggable = Draggable;
	ComponentComposer.ToolbarItem = ToolbarItem;
	ComponentComposer.Component = Component;
	ComponentComposer.ContainerComponent = ContainerComponent;

	return ComponentComposer;

});