iteratorDisplayer.generatorSelectorPanel = (function() {

    function _buildNamesArray(data) {
        var res = [];
        data.forEach(function(element, index, array) {
            res.push(element.name);
        });
        return res;
    }

    return {

        create : function(generatorsData) {

            var genSelectorField = HD_.PanelField.create({
                name: "generator-selector",
                type: "list",
                labelValuesBuilder: function() {
                    return _buildNamesArray(generatorsData);
                },
                labelsBuilder: function() {
                    return _buildNamesArray(generatorsData);
                }
            });

            genSelectorField.getSelectedName = function() {
                return this.findDomValue();
            };

            return genSelectorField;
        }
    };

})();
