iteratorDisplayer = (function () {

    return {

        main : function() {
            HD_.LocalWarnings.persistentLocalWarnings();

            var generators = iteratorDisplayer.generatorList.create();

            var subPanels = [
                iteratorDisplayer.generatorSelectorPanel.create(generators),
                iteratorDisplayer.buttonsPanel.create(generators),
                iteratorDisplayer.outputPanel.create(generators)
            ];

            var mainPanel = iteratorDisplayer.mainPanel.create();
            for (var i = 0; i < subPanels.length; i++) {
                mainPanel.pushPanelElement(subPanels[i]);
            }

            var mainNode = mainPanel.buildDomNode();
            return mainNode;
        }
    };
})();
