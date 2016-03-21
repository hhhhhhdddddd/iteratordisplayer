iteratorDisplayer = (function () {

    var _setIntervalId = null;

    function stopExecution() {
        window.clearInterval(_setIntervalId);
    }

    return {

        main : function() {
            HD_.LocalWarnings.persistentLocalWarnings();

            var generators = iteratorDisplayer.generatorList.create();

            var generatorSelectorPanel = iteratorDisplayer.generatorSelectorPanel.create(generators);

            var subPanels = [
                generatorSelectorPanel,
                iteratorDisplayer.outputPanel.create(),
                iteratorDisplayer.buttonsPanel.create(function startButtonHandler() {

                    function outputGeneratorElements(outputPanel, generators, selectedGenerator) {
                        // On choisi le générateur
                        var generator = null;
                        generators.eachElement(function(generatorData) {
                            if (generatorData.name === selectedGenerator) {
                                generator = generatorData.gen;
                            }
                        });

                        // On affiche les éléments tant qu'il y en a
                        if (generator && generator.hasNext()) {
                            outputPanel.addLine("" + generator.next());
                            window.scrollTo(0,document.body.scrollHeight);
                        } else {
                            stopExecution();
                        }
                    }

                    var selectedGenerator = mainPanel.findPanelByName("generator-selector").getSelectedName();
                    var outputPanel = mainPanel.findPanelByName("outputField");
                    _setIntervalId = setInterval(function() {
                        outputGeneratorElements(outputPanel, generators, selectedGenerator);
                    }, 100);
                }, function stopButtonHandler() {
                    stopExecution();
                })
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
