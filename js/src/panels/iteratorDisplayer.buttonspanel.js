/*
Le bouton start prévient la liste de générateur qu'il faut que le générateur
active lance la génération de valeur. A chaque génération de valeur le générateur
prévient la zone d'affichage qu'il à débité une valeur et la zone d'affichage l'affiche.

Le bouton stop prévient qu'il faut arrêter la génération de valeur.
*/
iteratorDisplayer.buttonsPanel = (function() {

    return {

        create : function(generators) {

            // Création des boutons (PanelField)           
            var startButton = HD_.PanelField.create({
                name: "startButton",
                type: "button",
                labelBuilder: function() {
                    return "Commencer";
                },
                handler: function startButtonHandler() {
                    generators.startActiveGenerator();
                }
            });

            var stopButton = HD_.PanelField.create({
                name: "stopButton",
                type: "button",
                labelBuilder: function() {
                    return "Terminer";
                },
                handler: function stopButtonHandler() {
                    generators.stopActiveGenerator();
                }
            });

            // Création du panneau destiné à contenir les boutons (placés horizontalement).
            var buttonsPanel = HD_.HorizontalPanel.create({name: "buttonsPanel"});
            buttonsPanel.pushPanelElement(startButton);
            buttonsPanel.pushPanelElement(stopButton);

            return buttonsPanel;
        }
    };

})();
