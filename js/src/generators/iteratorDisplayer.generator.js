/*
Regroupe toutes les fonctionnalités commune aux générateurs.

Chaque écouteur implante onNextValue.
*/
iteratorDisplayer.generator = (function() {

    var _generationSpeed = 100;

    // Stop la fonction setInterval qui a lancé la génération de valeur.
    function _stopExecution(generator) {
        window.clearInterval(generator._setIntervalId);
    }

    return {
        init : function(gen, name) {
            gen._name = name;
            
            // L'id de la fonction setInterval qui a lancé le débit.
            // Cette id est nécessaire pour arrêter la fonction. 
            gen._setIntervalId = null;

            gen.getName = function() {
                return this._name;
            };

            // Le générateur commence à débiter des valeurs à partir d'où il s'était arrêté
            // ou à partir de sa valeur initiale si c'est la première fois qu'on le lance.
            // Une valeur est débitée toutes les _generationSpeed ms.
            gen.startGenerating = function() {
                var that = this;

                function generateNextValue() {
                    if (that.hasNext()) {
                        that._listener.onTargetChange(that.next());
                    } else {
                        _stopExecution(that);
                    }
                }

                that._setIntervalId = setInterval(function() {
                    generateNextValue();
                }, _generationSpeed);
            };

            // Arrête le débit de valeur par le générateur.
            gen.stopGenerating = function() {
                _stopExecution(this);
            };

            // Doit être implanté dans les "sous types"
            gen.hasNext = function() {
                alert("generator: pas de hasNext");
            };

            // Doit être implanté dans les "sous types"
            gen.next = function() {
                alert("generator: pas de next");
            };

            return gen;
        }
    };

})();