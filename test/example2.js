ReplaceMenuProvider.prototype._createSequenceFlowEntries = function (element, replaceOptions) {
  var businessObject = getBusinessObject(element);
  var menuEntries = [];
  var modeling = this._modeling,
    moddle = this._moddle;
  var self = this;
  forEach(replaceOptions, function (entry) {
    switch (entry.actionName) {
      case "replace-with-default-flow":
        if (businessObject.sourceRef.default !== businessObject && (is(businessObject.sourceRef, "bpmn:ExclusiveGateway") || is(businessObject.sourceRef, "bpmn:InclusiveGateway"
      ) ||
        is(businessObject.sourceRef, "bpmn:ComplexGateway") || is(businessObject.sourceRef, "bpmn:Activity")
      ))
      {
        menuEntries.push(self._createMenuEntry(entry, element, function () {
          modeling.updateProperties(element.source, {
            default: businessObject
          });
        }));
      }

        break;

      case "replace-with-conditional-flow":
        if (!businessObject.conditionExpression && is(businessObject.sourceRef, "bpmn:Activity")) {
          menuEntries.push(self._createMenuEntry(entry, element, function () {
            var conditionExpression = moddle.create("bpmn:FormalExpression", {
              body: ""
            });
            modeling.updateProperties(element, {
              conditionExpression: conditionExpression
            });
          }));
        }

        break;

      default:
        // default flows
        if (is(businessObject.sourceRef, "bpmn:Activity") && businessObject.conditionExpression) {
          return menuEntries.push(self._createMenuEntry(entry, element, function () {
            modeling.updateProperties(element, {
              conditionExpression: undefined
            });
          }));
        } // conditional flows


        if ((is(businessObject.sourceRef, "bpmn:ExclusiveGateway") || is(businessObject.sourceRef, "bpmn:InclusiveGateway") || is(businessObject.sourceRef, "bpmn:ComplexGateway"
      ) ||
        is(businessObject.sourceRef, "bpmn:Activity")
      ) &&
        businessObject.sourceRef.default === businessObject
      )
      {
        return menuEntries.push(self._createMenuEntry(entry, element, function () {
          modeling.updateProperties(element.source, {
            default: undefined
          });
        }));
      }

    }
  });
  return menuEntries;
};