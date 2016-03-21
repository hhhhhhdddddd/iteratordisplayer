iteratorDisplayer.mainPanel = (function() {

    return {

        create : function() {
            //Création au panneau principal des élments créés ci-dessus.
            var mainPanel = HD_.VerticalPanel.create({name: "mainPanel"});
            return mainPanel;
        }
    };

})();
