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
            generators.eachElement(function(generator) {
                iteratorDisplayer.registerListener(generator, outputPanel);
            });

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
