/*
Chaque écouteur doit implanter onNewGeneratorSelection
*/
iteratorDisplayer.generatorSelectorPanel = (function() {

    return {

        create : function(generatorsNames) {

            var genSelectorField = HD_.PanelField.create({
                name: "generator-selector",
                type: "list",
                labelValuesBuilder: function() {
                    return generatorsNames;
                },
                labelsBuilder: function() {
                    return generatorsNames;
                },
                eventListeners : [{
                    name : "change",
                    handler: function(evt) {
                        genSelectorField._listener.onNewGeneratorSelection(evt.target.value);
                    }
                }]
            });

            genSelectorField.getSelectedName = function() {
                return this.findDomValue();
            };

            return genSelectorField;
        }
    };

})();
