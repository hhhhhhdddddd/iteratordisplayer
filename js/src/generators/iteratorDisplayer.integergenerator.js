iteratorDisplayer.integerGenerator = (function() {

    return {
        create : function() {
            var iGen = Object.create(null);
            iteratorDisplayer.generator.init(iGen);

            iGen.i = 0;

            iGen.hasNext = function() {
                return true;
            };

            iGen.next = function() {
                var previous = this.i;
                this.i = this.i + 1;
                return previous;
            };

            return iGen;
        }
    };

})();