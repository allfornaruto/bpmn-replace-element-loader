PropertiesPanel.prototype._init = function(config) {
  var canvas = this._canvas,
    eventBus = this._eventBus;

  var self = this;

  /**
   * Select the root element once it is added to the canvas
   */
  eventBus.on('root.added', function(e) {
    var element = e.element;

    if (isImplicitRoot(element)) {
      return;
    }

    self.update(element);
  });

  eventBus.on('selection.changed', function(e) {
    var newElement = e.newSelection[0];

    var rootElement = canvas.getRootElement();

    if (isImplicitRoot(rootElement)) {
      return;
    }

    self.update(newElement);
  });

  // add / update tab-bar scrolling
  eventBus.on([
    'propertiesPanel.changed',
    'propertiesPanel.resized'
  ],function(event) {

    var tabBarNode = domQuery('.bpp-properties-tab-bar', self._container);

    if (!tabBarNode) {
      return;
    }

    var scroller = scrollTabs.get(tabBarNode);

    if (!scroller) {

      // we did not initialize yet, do that
      // now and make sure we select the active
      // tab on scroll update
      scroller = scrollTabs(tabBarNode, {
        selectors: {
          tabsContainer: '.bpp-properties-tabs-links',
          tab: '.bpp-properties-tabs-links li',
          ignore: '.bpp-hidden',
          active: '.bpp-active'
        }
      });


      scroller.on('scroll', function(newActiveNode, oldActiveNode, direction) {

        var linkNode = domQuery('[data-tab-target]', newActiveNode);

        var tabId = domAttr(linkNode, 'data-tab-target');

        self.activateTab(tabId);
      });
    }

    // react on tab changes and or tabContainer resize
    // and make sure the active tab is shown completely
    scroller.update();
  });

  eventBus.on('elements.changed', function(e) {

    var current = self._current;
    var element = current && current.element;

    if (element) {
      if (e.elements.indexOf(element) !== -1) {
        self.update(element);
      }
    }
  });

  eventBus.on('elementTemplates.changed', function() {
    var current = self._current;
    var element = current && current.element;

    if (element) {
      self.update(element);
    }
  });

  eventBus.on('diagram.destroy', function() {
    self.detach();
  });

  this._container = domify('<div class="bpp-properties-panel"></div>');

  this._bindListeners(this._container);

  if (config && config.parent) {
    this.attachTo(config.parent);
  }
};