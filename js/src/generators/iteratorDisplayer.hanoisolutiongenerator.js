/*
Inspiré de JavaScript, Algorithms and Applications for Desktop and Mobile Browsers, Dionisio and Toal
NB. L'algorithme résoud une variation des tours d'Hanoi : il fait passer les disques d'un piquet à un
autre en s'aidant d'un troisième, le piquet de destination et le piquet de transit peuvent être
différent en fonction du nombre de disques.
*/
iteratorDisplayer.hanoiSolutionGenerator = (function() {

    return {
        create : function() {
            var hsGen = Object.create(null);
            iteratorDisplayer.generator.init(hsGen, "hanoi");

            hsGen.n = 4;
            hsGen.t = 1;

            hsGen.hasNext = function() {
                return this.t < 1 << this.n;
            };

            hsGen.next = function() {
                var prevT = this.t;
                this.t++;
                return "Move from "  + ((prevT & prevT - 1) % 3) + " to " + (((prevT | prevT - 1) + 1) % 3);
            };

            return hsGen;
        }
    };

})();