iteratorDisplayer = (function () {

    var _outputPrimesSetInterval = null;
    var _generator = null;

    function stopExecution() {
        window.clearInterval(_outputPrimesSetInterval);
    }

    return {

        main : function() {
            HD_.LocalWarnings.persistentLocalWarnings();

            var generators = [
                {name: "integers", gen: iteratorDisplayer.integerGenerator.create()},
                {name: "primes", gen: iteratorDisplayer.primeGenerator.create()}
            ];

            var generatorSelectorPanel = iteratorDisplayer.generatorSelectorPanel.create(generators);

            var subPanels = [
                generatorSelectorPanel,
                iteratorDisplayer.outputPanel.create(),
                iteratorDisplayer.buttonsPanel.create(function startHandler() {
                    _outputPrimesSetInterval = setInterval(outputInfiniteSequence, 100);
                }, function stopHandler() {
                    stopExecution();
                })
            ];

            function outputInfiniteSequence() {
                var selectedName = mainPanel.findPanelByName("generator-selector").getSelectedName();
                

                var generator = null;
                generators.forEach(function(generatorData) {
                    if (generatorData.name === selectedName) {
                        generator = generatorData.gen;
                    }
                });

                if (generator && generator.hasNext()) {
                    mainPanel.findPanelByName("outputField").addLine("" + generator.next());
                    window.scrollTo(0,document.body.scrollHeight);
                } else {
                    stopExecution();
                    alert("Stopped");
                }
            }

            var mainPanel = iteratorDisplayer.mainPanel.create();
            for (var i = 0; i < subPanels.length; i++) {
                mainPanel.pushPanelElement(subPanels[i]);
            }

            var mainNode = mainPanel.buildDomNode();
            return mainNode;
        }
    };
})();
