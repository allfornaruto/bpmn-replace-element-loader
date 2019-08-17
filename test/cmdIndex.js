function CommandInitializer(eventBus, commandStack) {
  eventBus.on('diagram.init', function() {
    forEach(HANDLERS, function(handler, id) {
      commandStack.registerHandler(id, handler);
    });
  });
}
