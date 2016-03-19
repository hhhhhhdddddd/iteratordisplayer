iteratorDisplayer.buttonsPanel = (function() {

    return {

        create : function(startHandler, stopHandler) {

            // Création des boutons (PanelField)           
            var startButton = HD_.PanelField.create({
                name: "startButton",
                type: "button",
                labelBuilder: function() {
                    return "Commencer";
                },
                handler: startHandler
            });

            var stopButton = HD_.PanelField.create({
                name: "stopButton",
                type: "button",
                labelBuilder: function() {
                    return "Terminer";
                },
                handler: stopHandler
            });

            // Création du panneau destiné à contenir les boutons, placé horizontalement.
            var buttonsPanel = HD_.HorizontalPanel.create({name: "buttonsPanel"});
            buttonsPanel.pushPanelElement(startButton);
            buttonsPanel.pushPanelElement(stopButton);

            return buttonsPanel;
        }
    };

})();
