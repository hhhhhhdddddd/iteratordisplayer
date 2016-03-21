// Contient tous les générateurs
iteratorDisplayer.generatorList = (function() {

    var _generators = [
        iteratorDisplayer.integerGenerator.create(),
        iteratorDisplayer.primeGenerator.create(),
        iteratorDisplayer.hanoiSolutionGenerator.create()
    ];

    return {
        create : function() {

            var genList = HD_.ArrayCollection.create();

            _generators.forEach(function(generator) {
                genList.addElement(generator);
            });

            genList._activeGenerator = null;

            genList.startActiveGenerator = function() {
                this._activeGenerator = this._activeGenerator || _generators[0];
                this._activeGenerator.startGenerating();
            };

            genList.stopActiveGenerator = function() {
                this._activeGenerator.stopGenerating();
            };

            genList.onNewGeneratorSelection = function(generatorId) {
                _generators.forEach(function(generator) {
                    if (generatorId === generator.getName()) {
                        genList._activeGenerator = generator;
                    }
                });
            };

            genList.generatorsNamesToArray = function() {
                var res = [];
                this.eachElement(function(generator) {
                    res.push(generator.getName());
                });
                return res;
            };

            return genList;
        }
    };

})();