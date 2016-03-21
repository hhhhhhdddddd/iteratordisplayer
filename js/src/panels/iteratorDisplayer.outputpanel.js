iteratorDisplayer.outputPanel = (function() {

    return {

        create : function(generators) {

            // Création du champ (d'une zone) d'affichage
            var outputField = HD_.PanelField.create({
                name: "outputField",
                type: "textDisplay"
            });

            // Afficher chaque nouvelle valeur.
            outputField.onNextValue = function(value) {
                this.addLine("" + value);
            };

            // Le panneau d'affichage s'inscrit auprès de tous les générateur.
            generators.eachElement(function(generator) {
                generator.gen.registerListener(outputField);
            });

            return outputField;
        }
    };

})();
