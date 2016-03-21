iteratorDisplayer = (function () {

    return {

        registerListener : function(object, listener) {
            object._listener = listener;

            if (! listener.onTargetChange) {
                listener.onTargetChange = function() {
                    throw new Error("A coder");
                };
            }
        },

        main : function() {
            HD_.LocalWarnings.persistentLocalWarnings();

            var generators = iteratorDisplayer.generatorList.create();

            var outputPanel = iteratorDisplayer.outputPanel.create();
            var generatorSelectorPanel = iteratorDisplayer.generatorSelectorPanel.create(generators.generatorsNamesToArray());
            var subPanels = [
                generatorSelectorPanel,
                iteratorDisplayer.buttonsPanel.create(generators),
                outputPanel
            ];

            // Le panneau d'affichage s'inscrit auprès de tous les générateurs.
            // Il affichera la valeur générée à chaque génération de valeur.
            generators.eachElement(function(generator) {
                iteratorDisplayer.registerListener(generator, outputPanel);
            });

            // Le liste des générateurs s'inscrit auprès de sélecteur de générateurs
            // pour se tenir informé du nom du prochain générateur active à qui elle
            // demandera de débiter des valeurs lors du prochain appuie sur le bouton
            // "commencer".
            iteratorDisplayer.registerListener(generatorSelectorPanel, generators);

            var mainPanel = iteratorDisplayer.mainPanel.create();
            for (var i = 0; i < subPanels.length; i++) {
                mainPanel.pushPanelElement(subPanels[i]);
            }

            var mainNode = mainPanel.buildDomNode();
            return mainNode;
        }
    };
})();
