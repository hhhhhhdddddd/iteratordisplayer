iteratorDisplayer.outputPanel = (function() {

    return {

        create : function(textVersions) {

            // Création du champ d'affichage
            var outputField = HD_.PanelField.create({
                name: "outputField",
                type: "textDisplay"
            });

            return outputField;
        }
    };

})();
