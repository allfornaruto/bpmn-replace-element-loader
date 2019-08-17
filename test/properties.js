module.exports = function(element, bpmnFactory, options, translate) {

  var getParent = options.getParent;

  var modelProperties = options.modelProperties,
    createParent = options.createParent;

  var bo = getBusinessObject(element);

  if (is(element, 'bpmn:Participant')) {
    bo = bo.get('processRef');
  }

  // build properties group only when the participant have a processRef
  if (!bo) {
    return;
  }

  assign(options, {
    addLabel: translate('Add Property'),
    getElements: function(element, node) {
      var parent = getParent(element, node, bo);
      return getPropertyValues(parent);
    },
    addElement: function(element, node) {
      var commands = [],
        parent = getParent(element, node, bo);

      if (!parent && typeof createParent === 'function') {
        var result = createParent(element, bo);
        parent = result.parent;
        commands.push(result.cmd);
      }

      var properties = getPropertiesElement(parent);
      if (!properties) {
        properties = elementHelper.createElement('camunda:Properties', {}, parent, bpmnFactory);

        if (!isExtensionElements(parent)) {
          commands.push(cmdHelper.updateBusinessObject(element, parent, { 'properties': properties }));
        } else {
          commands.push(cmdHelper.addAndRemoveElementsFromList(
            element,
            parent,
            'values',
            'extensionElements',
            [ properties ],
            []
          ));
        }
      }

      var propertyProps = {};
      forEach(modelProperties, function(prop) {
        propertyProps[prop] = undefined;
      });

      // create id if necessary
      if (modelProperties.indexOf('id') >= 0) {
        propertyProps.id = generatePropertyId();
      }

      var property = elementHelper.createElement('camunda:Property', propertyProps, properties, bpmnFactory);
      commands.push(cmdHelper.addElementsTolist(element, properties, 'values', [ property ]));

      return commands;
    },
    updateElement: function(element, value, node, idx) {
      var parent = getParent(element, node, bo),
        property = getPropertyValues(parent)[idx];

      forEach(modelProperties, function(prop) {
        value[prop] = value[prop] || undefined;
      });

      return cmdHelper.updateBusinessObject(element, property, value);
    },
    validate: function(element, value, node, idx) {
      // validate id if necessary
      if (modelProperties.indexOf('id') >= 0) {

        var parent = getParent(element, node, bo),
          properties = getPropertyValues(parent),
          property = properties[idx];

        if (property) {
          // check if id is valid
          var validationError = utils.isIdValid(property, value.id, translate);

          if (validationError) {
            return { id: validationError };
          }
        }
      }
    },
    removeElement: function(element, node, idx) {
      var commands = [],
        parent = getParent(element, node, bo),
        properties = getPropertiesElement(parent),
        propertyValues = getPropertyValues(parent),
        currentProperty = propertyValues[idx];

      commands.push(cmdHelper.removeElementsFromList(element, properties, 'values', null, [ currentProperty ]));

      if (propertyValues.length === 1) {
        // remove camunda:properties if the last existing property has been removed
        if (!isExtensionElements(parent)) {
          commands.push(cmdHelper.updateBusinessObject(element, parent, { properties: undefined }));
        } else {
          forEach(parent.values, function(value) {
            if (is(value, 'camunda:Properties')) {
              commands.push(extensionElementsHelper.removeEntry(bo, element, value));
            }
          });
        }
      }

      return commands;
    }
  });

  return factory.table(options);
};
