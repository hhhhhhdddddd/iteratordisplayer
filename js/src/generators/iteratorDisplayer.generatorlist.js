// Contient tous les générateurs
iteratorDisplayer.generatorList = (function() {

    var _generators = [
        {name: "integers", gen: iteratorDisplayer.integerGenerator.create()},
        {name: "primes", gen: iteratorDisplayer.primeGenerator.create()},
        {name: "hanoi", gen: iteratorDisplayer.hanoiSolutionGenerator.create()}
    ];

    return {
        create : function() {

            var genList = HD_.ArrayCollection.create();

            _generators.forEach(function(generator) {
                genList.addElement(generator);
            });

            genList._activeGenerator = null;

            genList.startActiveGenerator = function() {
                this._activeGenerator = this._activeGenerator || _generators[0].gen;
                this._activeGenerator.startGenerating();
            };

            genList.stopActiveGenerator = function() {
                this._activeGenerator.stopGenerating();
            };

            genList.onNewGeneratorSelection = function(generatorId) {
                _generators.forEach(function(generator) {
                    if (generatorId === generator.name) {
                        genList._activeGenerator = generator.gen;
                    }
                });
            };

            return genList;
        }
    };

})();