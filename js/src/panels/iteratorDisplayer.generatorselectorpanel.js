iteratorDisplayer.generatorSelectorPanel = (function() {

    function _buildNamesArray(generators) {
        var res = [];
        generators.eachElement(function(generatorData) {
            res.push(generatorData.name);
        });
        return res;
    }

    return {

        create : function(generators) {

            var genSelectorField = HD_.PanelField.create({
                name: "generator-selector",
                type: "list",
                labelValuesBuilder: function() {
                    return _buildNamesArray(generators);
                },
                labelsBuilder: function() {
                    return _buildNamesArray(generators);
                },
                eventListeners : [{
                    name : "change",
                    handler: function(evt) {
                        genSelectorField._listener.onNewGeneratorSelection(evt.target.value);
                    }
                }]
            });

            genSelectorField._listener = generators;

            genSelectorField.getSelectedName = function() {
                return this.findDomValue();
            };

            return genSelectorField;
        }
    };

})();
