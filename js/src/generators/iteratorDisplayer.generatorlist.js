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

            return genList;
        }
    };

})();