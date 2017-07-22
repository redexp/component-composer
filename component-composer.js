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
				componentsDirection: 'vertical'
			};
		},

		ui: {
			arrow: '> [data-arrow]',
			toolbar: '> [data-toolbar]',
			components: '> [data-components]'
		},

		forEachComponent: function (callback) {
			this.data.components.forEach(function (item, i) {
				getAllComponents(item, i);
			});

			function getAllComponents(item, i) {
				var res = callback(item, i);

				if (res === false) return;

				if (item.data.components && item.data.components.length > 0) {
					item.data.components.forEach(function (item, i) {
						getAllComponents(item, i);
					});
				}
			}
		},

		updateComponentsPositions: function (options) {
			options = options || {};

			var list = [],
				exclude = options.exclude;

			if (this.data.components.length === 0) {
				var main = getContainerOffset(this.ui.components);

				main.container = true;
				main.component = this;
				main.direction = this.data.componentsDirection;

				list.push(main);
			}

			this.forEachComponent(function (component, index) {
				if (component === exclude) return false;

				var offset = getOffset(component.node);

				offset.component = component;
				offset.index = index;
				offset.direction = component.parent.data.componentsDirection;

				list.push(offset);

				if (component.data.components && component.ui.components && component.data.components.length === 0) {
					var inner = getContainerOffset(component.ui.components);

					inner.container = true;
					inner.component = component;
					inner.direction = component.data.componentsDirection;

					list.push(inner);
				}
			});

			this.data.componentsPositions = list;

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

		updateArrow: function (item) {
			var pos = item.get('position'),
				list = this.data.componentsPositions,
				arrow = this.model('arrow');

			for (var i = list.length - 1; i > -1; i--) {
				var offset = list[i];

				if (offset.container) {
					if (pos.top >= offset.top && pos.top <= offset.bottom && pos.left >= offset.left && pos.left <= offset.right) {
						arrow.set({
							direction: offset.direction,
							top: offset.innerTop,
							left: offset.innerLeft,
							visible: true,
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
							visible: true,
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
							visible: true,
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
							visible: true,
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
							visible: true,
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
			this.updateArrow(item);
		},

		onToolbarItemStopDragging: function (item) {
			var arrow = this.model('arrow');

			if (!arrow.get('visible')) return;

			arrow.set('visible', false);

			var component = new item.context.view({
				parent: this,
				context: item.context,
				node: item.context.node && item.context.node.clone(),
				data: {
					title: item.context.title
				}
			});

			component.composer = this;

			arrow.get('parent').model('components').add(component, arrow.get('index'));
		},

		onComponentStartDragging: function (component) {
			this.updateComponentsPositions({exclude: component});
		},

		onComponentDragging: function (component) {
			this.updateArrow(component);
		},

		onComponentStopDragging: function (component) {
			var arrow = this.model('arrow');

			if (!arrow.get('visible')) return;

			arrow.set('visible', false);

			var parent = arrow.get('parent'),
				components = parent.model('components'),
				index = arrow.get('index');

			if (components.indexOf(component) === index) return;

			if (component.parent === parent) {
				components.move(component, index);
			}
			else {
				component.parent.model('components').remove(component);
				components.add(component, index);
			}
		},

		template: {
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
					prop: 'toolbar',
					view: function (item, node) {
						return new ToolbarItem({
							parent: this,

							node: node,

							context: item,

							data: {
								title: item.title
							}
						});
					}
				}
			},

			'@components': {
				each: {
					prop: 'components',
					view: function (component) {
						component.parent = this;
						return component;
					},
					node: '> *:nth-child(2)',
					remove: function (ul, component) {
						component.node.detach();
					}
				}
			}
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
			dragZone: '@root',
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
			title: '[data-title]'
		},

		onStartDragging: function (e) {
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
				text: '=title'
			}
		}
	});

	//endregion

	//region ====================== Component =====================================

	function Component(options) {
		Draggable.call(this, options);
	}

	Draggable.extend({
		constructor: Component,

		ui: {
			dragZone: '[data-drag-zone]',
			title: '[data-title]',
			edit: '[data-edit]',
			clone: '[data-clone]',
			remove: '[data-remove]',
			collapse: '[data-collapse]',
			expand: '[data-expand]',
			content: '[data-content]'
		},

		data: {
			collapsed: false
		},

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
		},

		collapse: function () {
			this.set('collapsed', true);
		},

		expand: function () {
			this.set('collapsed', false);
		},

		template: {
			'@root': {
				toggleClass: {
					'component-collapsed': '@collapsed'
				}
			},

			'@title': {
				text: '=title'
			},

			'@collapse': {
				on: {
					'click': 'collapse'
				}
			},
			'@expand': {
				on: {
					'click': 'expand'
				}
			}
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

		data: function () {
			return {
				components: [],
				componentsDirection: 'vertical'
			}
		},

		template: {
			'@components': {
				each: {
					prop: 'components',
					node: false,
					view: function (component) {
						component.parent = this;

						return component;
					},
					remove: function (ul, component) {
						component.node.detach();
					}
				}
			}
		}
	});

	//endregion

	ComponentComposer.Draggable = Draggable;
	ComponentComposer.ToolbarItem = ToolbarItem;
	ComponentComposer.Component = Component;
	ComponentComposer.ContainerComponent = ContainerComponent;

	return ComponentComposer;

});