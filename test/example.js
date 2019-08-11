ReplaceMenuProvider.prototype._createMenuEntry = function(definition, element, action) {
    var translate = this._translate;
    var replaceElement = this._bpmnReplace.replaceElement;

    var replaceAction = function() {
        return replaceElement(element, definition.target);
    };

    action = action || replaceAction;

    var menuEntry = {
        label: translate(definition.label),
        className: definition.className,
        id: definition.actionName,
        action: action
    };

    return menuEntry;
};
