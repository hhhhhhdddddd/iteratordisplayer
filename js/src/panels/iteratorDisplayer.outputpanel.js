iteratorDisplayer.outputPanel = (function() {

    return {

        create : function() {

            // Création du champ (d'une zone) d'affichage
            var outputField = HD_.PanelField.create({
                name: "outputField",
                type: "textDisplay"
            });

            // onNextValue.
            outputField.onNextValue = function(value) {
                this.addLine("" + value);
            };

            return outputField;
        }
    };

})();
