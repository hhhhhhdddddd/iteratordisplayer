iteratorDisplayer.primeGenerator = (function() {

    return {

        // De "Program Development in Java", Barbara Liskov
        create : function() {
            var pGen = Object.create(null);
            iteratorDisplayer.generator.init(pGen);

            pGen.ps = []; // Nombre premier retournés jusque là
            pGen.p = 2; // Candidat suivant à tester

            pGen.hasNext = function() {
                return true;
            };

            pGen.next = function() {
                if (this.p === 2) {
                    this.ps.push(2);
                    this.p = 3; //
                    return 2;
                }

                for (var n = this.p; true; n = n + 2) {
                    for (var i = 0; i < this.ps.length; i++) {
                        var el = this.ps[i];
                        if (n % el === 0) {
                            break; // not a prime
                        }
                        if (el * el > n) { // c'est un nombre premier
                            this.ps.push(n);
                            this.p = n + 2;
                            return n;
                        }
                    }
                }
            };

            return pGen;
        }
    };

})();