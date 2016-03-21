// build 20160321_154041
HD_ = (function() {
    return {};
})();
HD_.ArrayCollection = (function() {

    return {

        create : function() {
            var collection = Object.create(null);
            collection._elements = [];

            HD_._Collection.initCollection(collection);

            collection._addCollectionElement = function(element) {
                this._elements.push(element);
                return element;
            };

            collection.addCollectionElements = function(elements) {
                var that = this;
                elements.forEach(function(element) {
                    that.addElement(element);
                });
            };

            collection.eachElement = function(fun) {
                this._elements.forEach(function(element, index) {
                    fun(element, index);
                });
            };

            collection.clearCollection = function() {
                collection._elements = [];
            };

            collection.toArray = function() {
                var array = [];
                this.eachElement(function(element) {
                    array.push(element);
                });
                return array;
            };

            return collection;
        }
    };
})();
HD_.MapCollection = (function() {

    return {

        create : function() {
            var collection = Object.create(null);
            collection._elements = {};

            HD_._Collection.initCollection(collection);

            collection._addCollectionElement = function(key, element) {
                this._elements[ key ] = element;
            };

            collection.eachElement = function(fun) {
                for (var propName in this._elements) {
                    fun(this._elements[ propName ], propName);
                }
            };

            collection.clearCollection = function() {
                for (var key in this._elements) {
                    delete this._elements[key];
                }
            };

            return collection;
        }
    };
})();
HD_._Collection = (function() {

    return {

        initCollection : function(collection) {
            collection._size = 0;

            collection.eachElement = function(fun) {
                alert("HD_._Collection: eachElement no implemented");
            };

            collection.clearCollection = function(fun) {
                alert("HD_._Collection: clearCollection no implemented");
            };

            /*
            On profite du fait que les tableaux sont des objets
            dont les clé sont les indices.
            */
            collection.findElement = function(predicat) {
                var size = this.getSize();
                for (var key in this._elements) {
                    var currentElement = this.getElement(key);
                    if (predicat(currentElement)) {
                        return currentElement;
                    }
                }
                return null;
            };

            collection.getElement =  function(key) {
                return this._elements[ key ];
            };

            collection.addElement =  function() {
                this._size++;
                return this._addCollectionElement.apply(this, arguments);
            };

            collection.getSize =  function(key) {
                return this._size;
            };

            collection.mapFunToArray = function(fun) {
                var res = [];
                this.eachElement(function(elt) {
                    res.push(fun(elt));
                });
                return res;
            };
        }
    };
})();
HD_.LocalWarnings = (function() {

    var _warnings = [
        _createWarning({
            name: 'localhost',
            predicatName : "isLocalHost",
            condition : location.hostname
        }),
        _createWarning({
            name: 'file:',
            predicatName : "isFileProtocol",
            condition : location.protocol
        })
    ];

    function _createWarning(warningData) {
        var warning = Object.create(warningData);
        warning._name = warningData.name;
        warning._predicatName = warningData.predicatName;

        warning.warningPredicat = function() {
            return warningData.condition === this._name;
        };

        warning.getWarningPredicatName = function() {
            return this._predicatName;
        };

        warning.getWarningName = function() {
            return this._name;
        };

        warning.buildWarningSpan = function() {

            function buildSpan(warningName) {
                var warningSpan = document.createElement('span');
                warningSpan.style.backgroundColor = 'red';
                warningSpan.style.marginLeft = '10px';
                warningSpan.innerHTML = warningName;
                return warningSpan;
            }

            var warningSpan = buildSpan(this._name);

            setInterval(function blinkWarning() {
                var span = warningSpan;
                span.style.visibility = (span.style.visibility === 'visible') ? 'hidden' : 'visible';
            }, 500);

            return warningSpan;
        };

        return warning;
    }

    function _createWarningsCollection() {
        var localWarnings = HD_.ArrayCollection.create();
        localWarnings._isAtLeastOneWarningTrue = false;

        // Ajoute les warnings et initialise isOneWarningTrue.
        _warnings.forEach(function(warning) {
            localWarnings.addElement(warning);
            localWarnings._isAtLeastOneWarningTrue = localWarnings._isAtLeastOneWarningTrue || warning.warningPredicat();
        });

        localWarnings.isAtLeastOneWarningTrue = function() {
            return this._isAtLeastOneWarningTrue;
        };

        localWarnings.eachTrueWarning = function(fun) {
            return this.eachElement(function(warning) {
                if (warning.warningPredicat()) {
                    fun(warning);
                }
            });
        };

        return localWarnings;
    }

    var _warningsCollection = _createWarningsCollection();

    function _addWarningsPredicats(object) {
        _warningsCollection.eachElement(function(warning) {
            object[warning.getWarningPredicatName()] = function() {
                return warning.warningPredicat.call(warning);
            };
        });
        return object;
    }

    return _addWarningsPredicats({

        // Affiche un avertissement clignotant si on travaille en local
        // c'est-à-dire si l'hote est 'localhost' ou si le protocole est 'file:'
        persistentLocalWarnings : function () {

            if (! _warningsCollection.isAtLeastOneWarningTrue()) {
                return;
            }

            var warningsContainer = document.createElement("div");
            warningsContainer.innerHTML = "HD_.Debug: ";
            
            _warningsCollection.eachTrueWarning(function(warning) {
                warningsContainer.appendChild(warning.buildWarningSpan());
            });
            document.body.appendChild(warningsContainer);
        }
    });
})();
HD_.HorizontalPanel = (function() {

    return {

        create : function(options) {
            var hPanel = HD_._StackPanel.create("horizontal", {name: options.name, style: options.style, type: options.type});
            return hPanel;
        }
    };

})();
HD_.PanelField = (function() {

    function _findHtmlInputValue(node) {
        return node.value;
    }

    var _types = {
        list : {
            findDomValue : function() {
                return this._fieldDomNode.options[this._fieldDomNode.selectedIndex].value;
            },
            buildDomElement : function() {
                var select = document.createElement("select");
                var option = null;
                var values = this._labelValuesBuilder();
                var labels = this._labelsBuilder();
                values.forEach(function(value, index) {
                    option = document.createElement("option");
                    option.setAttribute("value", value);
                    option.innerHTML = labels[index];
                    select.appendChild(option);
                });
                return select;
            },
            refreshFieldTexts : function(text) {
                var labels = this._labelsBuilder();
                for (var i = 0; i < this._fieldDomNode.options.length; i++) {
                    this._fieldDomNode.options[i].innerHTML = labels[i];
                }
            },
            getValue : function(i) {
                return this._labelValuesBuilder()[i];
            },
            multiLabels : true,
            multiLabelValues : true,
        },

        number : {
            buildDomElement : function() {
                return HD_._DomTk.buildTextInput(5, null);
            },
            findDomValue : function() {
                return parseInt(_findHtmlInputValue(this._fieldDomNode), 10);
            }
        },

        fileSelector : {
            buildDomElement : function() {
                var fileInput = HD_._DomTk.buildDomInput("file");
                return fileInput;
            },
            findDomValue : function() {
                return _findHtmlInputValue(this._fieldDomNode);
            },
            addMandatoryEventListeners : function() {
                var that = this;
                that._panelDomContent.addEventListener("change", function(evt) {
                    //Retrieve the first (and only!) File from the FileList object

                    var f = evt.target.files[0];
                    if (f) {
                        that.postChangeValue = f;
                    }
                    else {
                        alert("Failed to load file");
                    }
                },
                false);
            },
            //http://www.htmlgoodies.com/beyond/javascript/read-text-files-using-the-javascript-filereader.html#fbid=uTCcfskrObx
            readFileAsText : function(onFileRead) {
                var r = new FileReader();
                r.onload = function(e) {
                    var contents = e.target.result;
                    onFileRead(contents);
                };
                r.readAsText(this.postChangeValue);
            }
        },

        button : {
            buildDomElement : function() {
                var label = this._labelBuilder();
                var button = HD_._DomTk.buildButtonWithClickHandler(label, this._handler);
                return button;
            },
            findDomValue : function() {
                return null;
            },
            refreshFieldTexts : function(text) {
                var label = this._labelBuilder();
                this._fieldDomNode.innerHTML = label;
            }
        },

        text : {
            buildDomElement : function() {
                var textArea = HD_._DomTk.createDomElement("textarea");
                textArea.setAttribute("rows", this._height);
                textArea.setAttribute("cols", this._width);
                return textArea;
            },
            findDomValue : function() {
                return _findHtmlInputValue(this._fieldDomNode);
            },
            setFieldContent : function(content) {
                this._fieldDomNode.value = content;
            }
        },

        string : {
            buildDomElement : function() {
                var stringInput = HD_._DomTk.buildTextInput(this._width, this._initValue);
                return stringInput;
            },
            findDomValue : function() {
                return _findHtmlInputValue(this._fieldDomNode);
            },
            setFieldContent : function(content) {
                this._fieldDomNode.value = content;
            }
        },

        textDisplay : {
            buildDomElement : function() {
                var div = HD_._DomTk.createDomElement("div");
                return div;
            },
            setParentStyle : function() {
                if ( this._style.verticalAlign ) {
                    this._parentContainerStyle['verticalAlign'] = "top";
                }
            },
            findDomValue : function() {
                return "HD_.PanelField._types.textDisplay: findDomValue todo";
            },
            setFieldContent : function(content) {
                var that = this;
                var paragraph = null;
                content.split("\n").forEach(function(line) {
                    paragraph = HD_._DomTk.createDomElement("p");
                    paragraph.innerHTML = line;
                    that._fieldDomNode.appendChild(paragraph);
                });
            },
            addLine : function(str) {
                var text = document.createTextNode(str);
                this._fieldDomNode.appendChild(text);
                var nl = document.createElement("br");
                this._fieldDomNode.appendChild(nl);
            }
        },

        title : {
            buildDomElement : function() {
                this._size =  this._size ? this._size : "medium";
                var titleTagName = null;
                if (this._size) {
                    if (this._size === "small") {
                        titleTagName = "h3";
                    }
                    else if (this._size === "medium") {
                        titleTagName = "h2";
                    }
                    else if (this._size === "big") {
                        titleTagName = "h1";
                    }
                }

                var node = HD_._DomTk.createDomElement(titleTagName);

                return node;
            },
            findDomValue : function() {
                return "HD_.PanelField._types.title: findDomValue todo";
            },
            setFieldContent : function(content) {
                this._fieldDomNode.innerHTML = content;
                
            }
        },

        image : {
            buildDomElement : function() {
                var img = HD_._DomTk.createDomElement("img");
                return img;
            },
            findDomValue : function() {
                return null;
            },
            setFieldContent : function(content) {
                this._fieldDomNode.setAttribute('src', content);
            }
        }
    };

    return {
        create : function(options) {
            var field = Object.create(_types[options.type]);
            HD_._Panel.init(field, {name: options.name, className: "fieldPanel", style: options.style});

            field._valuesGetter = options.valuesGetter;
            field._eventListeners = options.eventListeners;
            field._handler = options.handler;
            field._height = options.height;
            field._width = options.width;
            field._initValue = options.initValue;
            field._type = options.type;
            field._parentContainerStyle = {};
            field._fieldDomNode = null;
            field._size = options.size;
            field._name = options.name;
            field._label = options.label;
            field._labelUpdater = options.labelUpdater;
            field._placeholdersValues = options.placeholdersValues;

            if (field.setParentStyle) {
                field.setParentStyle();
            }

            // Tous les champs ont un libellé, simple ou multiple
            if (field.multiLabels === true) {
                field._labelsBuilder = options.labelsBuilder;
            }
            else {
                field._labelBuilder = options.labelBuilder;
            }

            // Tous les champs n'ont pas de valeur associé à leur libellé.
            if (field.multiLabelValues === true) {
                field._labelValuesBuilder = options.labelValuesBuilder;
            }

            field.buildPanelDomNode = function() {
                var that = this;

                that._fieldDomNode = that.buildDomElement();
                that._panelDomContent = HD_._DomTk.createDomElement("div");
                that._panelDomContent.appendChild(that._fieldDomNode);

                if (options.initValue) {
                    that.setFieldContent(that._initValue);
                }

                // Ajout des écouteurs obligatoires
                if (that.addMandatoryEventListeners) {
                    that.addMandatoryEventListeners();
                }

                // Ajout des écouteurs de l'utilisateur
                if (that._eventListeners) {
                    that._eventListeners.forEach(function(eventListener) {
                        that._panelDomContent.addEventListener(eventListener.name, function(evt) {
                            eventListener.handler(evt);
                        },
                        false);
                    });
                }

                return that._panelDomContent;
            };

            field.mapPanels = function(fun) {
                fun(this);
            };

            field.findVerifyingPanel = function(predicat) {
                // Rien de plus à faire que ce qui est fait dans panel.findPanel()
            };

            field.applyPanelTreeStyle = function(domNode) {
                // Rien de plus à faire que ce qui est fait dans panel.findPanel()
            };


            field.changeTexts_ = function(textsObject) {
                if (this.changeFieldTexts) {
                    this.changeFieldTexts(textsObject);
                }
            };

            /*
            L'argument est
            - soit un texte simple
            - soit un tableau
            Si c'est un tableau alors textUpdater() doit pouvoir le gérer.
            */
            field.generateText = function(label) {
                if (this._labelUpdater) {
                    if (this._placeholdersValues) {
                        return this._labelUpdater(this._label, this._placeholdersValues);
                    }
                    else {
                        return this._labelUpdater(this._label);
                    }
                }
                else {
                    return this._label;
                }
            };

            return field;
        }
    };

})();

/*
trois types de textes
- un seul texte: le libellé d'un bouton
- plusieurs textes: les libellés d'un select
- 
*/
/*
Un panneau de traduction standard avec autant de bouton que de langage.
*/
HD_.TranslaterPanel = (function() {

    return {
        create : function(translater, translationHandler) {
            var translaterPanel = HD_.HorizontalPanel.create({name: "translater", type: "table", style: {
                position : "absolute",
                top : "0px",
                right : "0px"
            }});

            translaterPanel._translater = translater;
            translaterPanel._translationHandler = translationHandler;

            translaterPanel._translater.eachElement(function(translation) {
                var translationName = translation.getName();
                var translationButton = HD_.PanelField.create({
                    name: translationName,
                    type: "button",
                    labelBuilder: function() {
                        return translationName;
                    },
                    handler: function saveInputsHandler() {
                        var translationName = translationButton.getName();
                        translaterPanel._translationHandler(translationName);
                    }
                });
                translaterPanel.pushPanelElement(translationButton);
            });

            return translaterPanel;
        },

        // Ajoute à panel un panneau avec les boutons de traduction (autant de boutons que de traductions supportées)
        addTranslaterPanel : function(translater, panel, handler) {
            var translaterPanel = HD_.TranslaterPanel.create(translater, function translationHandler(translationName) {

                function refreshFieldsTexts(panel) {
                    panel.mapPanels(function(pan) {
                        if (pan.refreshFieldTexts) {
                            pan.refreshFieldTexts();
                        }
                    });
                }

                translater.setCurrentTranlsation(translationName);
                refreshFieldsTexts(panel);
            });
            var trDomNode = translaterPanel.buildDomNode();
            panel.getDomNode().appendChild(trDomNode);
        }
    };

})();
HD_.VerticalPanel = (function() {

    return {

        create : function(options) {
            var vPanel = HD_._StackPanel.create("vertical", {name: options.name, style: options.style, type: options.type});
            return vPanel;
        }
    };

})();
/*
DomTk = Dom toolkit. Des utilitaires pour la manipulation du DOM.
*/
HD_._DomTk = (function() {

    return {
        appendClassName : function( domNode, className ) {
            domNode.className = domNode.className + " " + className;
        },

        buildDomInput : function(type) {
            var input = document.createElement("input");
            input.setAttribute("type", type);
            return input;
        },

        buildTextInput : function(size, data) {
            var input = this.buildDomInput("text");
            input.setAttribute("size", size);
            if (data) {
                input.value = data;
            }
            return input;
        },

        buildButtonWithClickHandler : function(label, handler) {
            var button = document.createElement("button");
            if (handler) {
                button.addEventListener("click", handler, false);
            }
            button.innerHTML = label;
            return button;
        },

        createDomElement : function(tagName) {
            return document.createElement(tagName);
        },

        appendDomElement : function(parent, child) {
            parent.appendChild(child);
        },

        applyStyle : function(domNode, style) {
            for (var styleName in style) {
                domNode.style[styleName] = style[styleName];
            }
        },

        // Tableaux

        buildEmptyTable : function(rows, columns) {
            var body = this.createDomElement("tbody");
            for (var r = 0; r < rows; r++) {
                var tr = this.createDomElement("tr");
                for (var c = 0; c < columns; c++) {
                    var td = this.createDomElement("td");
                    this.appendDomElement(tr, td);
                }
                this.appendDomElement(body, tr);
            }
            var table = this.createDomElement("table");
            this.appendDomElement(table, body);
            return table;
        },

        getDomTableCell : function(table, row, column) {
            var tableChildren = table.children; // [body]
            var tableBody = tableChildren[0];
            var bodyChildren = tableBody.children; // [tr, tr, ...]
            var tableRow = bodyChildren[row];
            var rowChildren = tableRow.children; // [td, td, ...]
            var tableCell = rowChildren[column];
            return tableCell;
        },

        setDomTableCell : function(table, row, column, domNode) {
            var tableCell = this.getDomTableCell(table, row, column);
            this.appendDomElement(tableCell, domNode);
        },

        // Tableau de div

        buildEmptyDivTable : function(rows, columns) {
            var table = this.createDomElement("div");
            for (var r = 0; r < rows; r++) {
                var row = this.createDomElement("div");
                row.setAttribute("row", r);
                for (var c = 0; c < columns; c++) {
                    var column = this.createDomElement("div");
                    column.setAttribute("column", c);
                    this.appendDomElement(row, column);
                }
                this.appendDomElement(table, row);
            }
            return table;
        },

        getDivTableCell : function(table, row, column) {
            var tableChildren = table.children; // [row, row, ...]
            var tableRow = tableChildren[row];
            var rowChildren = tableRow.children; // [column, column, ...]
            var tableCell = rowChildren[column];
            return tableCell;
        },

        setDivTableCell : function(table, row, column, domNode) {
            var tableCell = this.getDomTableCell(table, row, column);
            this.appendDomElement(tableCell, domNode);
        },

    };

})();
HD_._Panel = (function() {

    return {

        init : function(panel, options) {
            panel._panelDomContent = null;
            panel._parent = null;
            panel._name = options.name ? options.name : "";
            panel._className = options.className;
            panel._style = options.style ? options.style : {};
            panel._content = HD_._DomTk.createDomElement("div");
            panel._domNode = null;

            panel.buildPanelDomNode = function() {
                alert("HD_._Panel -  " + this._className + " has no buildPanelDomNode() method.");
            };

            panel.setPanelParent = function(panelParent) {
                this._parent = panelParent;
            };

            panel.getPanelParent = function() {
                return this._parent;
            };

            // Retourne le panneau racine de l'arbre auquel appartient ce panneau.
            // NB. fonction récursive
            panel.findRootPanel = function() {
                if (this.getPanelParent() === null) {
                    return this;
                }
                else {
                    return this.getPanelParent().findRootPanel();
                }
            };

            panel.getDomNode = function() {
                if (this._domNode === null) {
                    throw new Error("domNode null");
                }
                return this._domNode;
            };

            panel.buildDomNode = function() {
                this.buildPanelDomNode();
                
                var contentNode = HD_._DomTk.createDomElement("div");
                contentNode.setAttribute("name", this._name + "_content");
                contentNode.appendChild(this._panelDomContent);

                var domNode = HD_._DomTk.createDomElement("div");
                domNode.setAttribute("name", this._name);
                HD_._DomTk.appendClassName(domNode, this._className);
                domNode.appendChild(contentNode);
                this.applyPanelStyle(domNode);
                
                this._domNode = domNode;

                return this._domNode;
            };

            panel.applyPanelStyle = function(domNode) {
                this.applyPanelTreeStyle(domNode);
                if (this._style) {
                    HD_._DomTk.applyStyle(domNode, this._style);
                }
            };

            panel.addPanelStyle = function(styleName, styleValue) {
                this._style[styleName] = styleValue;
            };

            panel.hasPanelStyle = function(styleName) {
                return typeof this._style[styleName] !== "undefined";
            };

            panel.refreshPanel = function() {

                // todo: plante sur rafraichissement de la racine (mainPanel)
                function _findParentDomNode(panel) {
                    return panel._panelDomContent.parentElement;
                }

                var parent = _findParentDomNode(this);
                parent.removeChild(this._panelDomContent);
                this.buildPanelDomNode();
                parent.appendChild(this._panelDomContent);
            };

            panel.getName = function() {
                return this._name;
            };

            panel.show = function() {
                this._panelDomContent.style.display = "block";
            };

            panel.hide = function() {
                this._panelDomContent.style.display = "none";
            };

            // Retourne le panneau vérifiant le prédicat passé en argument.
            panel.findPanel = function(predicat) {
                if (predicat(this)) {
                    return this;
                }
                return this.findVerifyingPanel(predicat);
            };
            
            panel.findPanelByName = function(name) {
                return this.findPanel(function(elt) {
                    return name === elt.getName();
                });
            };

            return panel;
        }
    };

})();
// Un panneau à une direction horizontale ou verticale
HD_._StackPanel = (function() {

    return {

        create : function(direction, options) {
            var stackPanel = HD_.ArrayCollection.create();
            HD_._Panel.init(stackPanel, {name: options.name, className: direction + 'Panel', style: options.style});
            stackPanel._cellsStyle = [];

            if (options.type && (options.type === "table")) {
                stackPanel.buildPanelEmptyTable = function() {
                    return HD_._DomTk.buildEmptyTable(this.getNumberOfRows(), this.getNumberOfColumns());
                };

                stackPanel.setPanelTableCell = function(index, domNode) {
                    HD_._DomTk.setDomTableCell(this._panelDomContent,this.getRowIndex(index) , this.getColumnIndex(index), domNode);
                };

                stackPanel.getPanelTableCell = function(index) {
                    return HD_._DomTk.getDomTableCell(this._panelDomContent,this.getRowIndex(index) , this.getColumnIndex(index));
                };
            }
            else {
                stackPanel.buildPanelEmptyTable = function() {
                    return HD_._DomTk.buildEmptyDivTable(this.getNumberOfRows(), this.getNumberOfColumns());
                };

                stackPanel.setPanelTableCell = function(index, domNode) {
                    HD_._DomTk.setDivTableCell(this._panelDomContent,this.getRowIndex(index) , this.getColumnIndex(index), domNode);
                };

                stackPanel.getPanelTableCell = function(index) {
                    return HD_._DomTk.getDivTableCell(this._panelDomContent,this.getRowIndex(index) , this.getColumnIndex(index));
                };
            }

            if (direction === "horizontal") {
                stackPanel.getNumberOfRows = function(index) {
                    return 1;
                };
                stackPanel.getNumberOfColumns = function(index) {
                    return this.getNumberOfElements();
                };
                stackPanel.getRowIndex = function(index) {
                    return 0;
                };
                stackPanel.getColumnIndex = function(index) {
                    return index;
                };
                stackPanel.setChildFloatStyle = function(child) {
                    child.addPanelStyle("float", "left");
                };
            }
            else if (direction === "vertical") {
                stackPanel.getNumberOfRows = function(index) {
                    return this.getNumberOfElements();
                };
                stackPanel.getNumberOfColumns = function(index) {
                    return 1;
                };
                stackPanel.getRowIndex = function(index) {
                    return index;
                };
                stackPanel.getColumnIndex = function(index) {
                    return 0;
                };
                stackPanel.setChildFloatStyle = function(child) {
                    child.addPanelStyle("clear", "both");
                };
            }
            else {
                alert("HD_._StackPanel.create: direction '" + direction + "' not defined");
            }
            
            // Renommer pushPanelElement en pushSubpanel, se mettre au niveau sémantique de l'abstraction
            stackPanel.pushPanelElement = function(panelElt) {

                function addCellStyle(stackPanel, cellStyle, cellIndex) {
                    if (cellStyle) {
                        stackPanel._cellsStyle.push({
                            cellNumber: cellIndex,
                            style: cellStyle
                        });
                    }
                }

                panelElt.setPanelParent(this);
                this.setChildFloatStyle(panelElt);
                addCellStyle(this, panelElt._parentContainerStyle, this.getSize());
                this.addElement(panelElt);
                return panelElt;
            };

            stackPanel.applyPanelTreeStyle = function(domNode) {
                var that = this;

                // On ajoute les styles que l'enfant impose à son container dom parent.
                // NB. Pas à son _Panel parent mais à son container dom parent.
                stackPanel._cellsStyle.forEach(function(cellStyleData) {
                    var tableCell = that.getPanelTableCell(cellStyleData.cellNumber);
                    HD_._DomTk.applyStyle(tableCell, cellStyleData.style);
                });

                if (! that.hasPanelStyle("float")) {
                    this.addPanelStyle("clear", "both");
                }
            };

            stackPanel.pushAndShow = function(panelElt) {
                this.pushPanelElement(panelElt);
                var eltNode = panelElt.buildDomNode();
                this._panelDomContent.appendChild(eltNode);
            };

            stackPanel.mapPanels = function(fun) {
                fun(this);
                this.eachElement(function(panelElt) {
                    panelElt.mapPanels(fun);
                });
            };

            stackPanel.getChildPanel = function(i) {
                return this.getElement(i);
            };

            stackPanel.clearPanelElements = function() {
                this.clearCollection();
            };

            stackPanel.buildPanelDomNode = function() {
                var that = this;
                that._panelDomContent = that.buildPanelEmptyTable();
                that._panelDomContent.setAttribute("name", that._name + "_divtable");
                that.eachElement(function(panelElement, index) {
                    var domNode = panelElement.buildDomNode();
                    domNode.setAttribute("parentPanel", that._name);
                    var tableCell = that.getPanelTableCell(index);
                    tableCell.appendChild(domNode);
                });
            };

            stackPanel.getNumberOfElements = function() {
                return this.getSize();
            };

            stackPanel.findVerifyingPanel = function(predicat) {
                for (var i = 0; i < this.getSize(); i++) {
                    var element = this.getElement(i);
                    var res = element.findPanel(predicat);
                    if (res) {
                        return res;
                    }
                }
            };

            return stackPanel;
        }
    };

})();
HD_.Ajax = (function() {

    return {
        makeRequest : function(requestType, url, onSuccess, onError, onFinished) {
            // Instances of XMLHttpRequest can make an HTTP request to the server.
            var httpRequest = new XMLHttpRequest();

            // Tells the HTTP request object which JavaScript function will handle processing the response. 
            httpRequest.onreadystatechange = function responseHandler() {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                        onSuccess(httpRequest.responseText);
                        onFinished();
                    } else {
                        onError();
                        onFinished();
                    }
                }
            };

            // Actually make the request.
            httpRequest.open(requestType, url);
            httpRequest.send();
        },

        chainRequests : function(requestType, urls, onEachSuccess, onEachFinished, onEachError, onAllFinished) {

            function createArrayIterator(anArray) {
                var iterator = Object.create(null);
                iterator.position = 0;
                iterator.list = anArray;

                iterator.hasNext = function() {
                    return this.position < this.list.length;
                };
                
                iterator.next = function() {
                    return this.list[this.position++];
                };

                return iterator;
            }

            function chainRequestsAux() {
                if (! iterator.hasNext()) {
                    if (onAllFinished) {
                        onAllFinished();
                    }
                    return;
                }

                var url = iterator.next();
                HD_.Ajax.makeRequest(requestType, url, function onEverySuccess(responseText) {
                    onEachSuccess(url, responseText);

                    chainRequestsAux();
                }, function onEveryError() {
                    console.log("HD_.chainRequests - error on processing request: " + url);
                    if (onEachError) {
                        onEachError();
                    }
                }, function onEveryFinished() {
                    console.log("HD_.chainRequests - finished processing request: " + url);
                    if (onEachFinished) {
                        onEachFinished();
                    }
                });
            }

            var iterator = createArrayIterator(urls);
            chainRequestsAux();
        }
    };
})();
HD_.Data = (function() {

    return {
        encodeImage : function(imageSource) {

            // http://stackoverflow.com/a/10473992
            function imageToArraybuffer(imageSource) {
                // atob to base64_decode the data-URI
                var image_data = atob(btoa(imageSource));
                // Use typed arrays to convert the binary data to a Blob
                var arraybuffer = new ArrayBuffer(image_data.length);
                var view = new Uint8Array(arraybuffer);
                for (var i=0; i<image_data.length; i++) {
                    view[i] = image_data.charCodeAt(i) & 0xff;
                }
                
                return arraybuffer;
            }

            function imageToBlob(imageSource) {
                var arraybuffer = imageToArraybuffer(imageSource);
                var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
                return blob;
            }

            function imageToUrl(imageSource) {
                var blob = imageToBlob(imageSource);
                var url = URL.createObjectURL(blob);
                return url;
            }

            var url = imageToUrl(imageSource);
            return url;
        },

        encodeString : function(str) {
            
            // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa
            function utf8_to_b64(str) {
                return window.btoa(unescape(encodeURIComponent(str)));
            }

            // Just in case
            // function b64_to_utf8(str) {
            //     return decodeURIComponent(escape(window.atob(str)));
            // }

            var url = 'data:application/octet-stream;base64,' + utf8_to_b64( data );
            return url;
        }
        

    };

})();
HD_.Download = (function() {

    return {

        // http://stackoverflow.com/questions/12718210/how-to-save-file-from-textarea-in-javascript-with-a-name?lq=1
        saveEncodedData : function(encodedData, name) {

            function buildLink(data, name){
                var a = document.createElement('a');
                a.download = name || self.location.pathname.slice(self.location.pathname.lastIndexOf('/')+1);
                a.href = data || self.location.href;
                return a;
            }

            function click(node) {
                var ev = document.createEvent("MouseEvents");
                ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                return node.dispatchEvent(ev);
            }

            var link = buildLink(encodedData, name);
            click(link);
        }
    };
})();/*
Module chargé de gérer la traduction dans un application correctement interfacée.
Interfaçage:

*/
HD_.Translater = (function() {

    function _createTranslation(name, translations) {
        var translation = Object.create(null);
        translation._name = name;
        translation._translations = translations;
        translation.getName = function() {
            return this._name;
        };

        return translation;
    }

    return {
        create : function() {
            var translater = HD_.ArrayCollection.create();
            translater._translationsKeys = null;
            translater._currentTranslation = null;

            translater.addTranlsation = function(name, translations) {
                this.addElement(_createTranslation(name, translations));
            };

            translater.setCurrentTranlsation = function(name) {
                this._currentTranslation = this.findElement(function(translation) {
                    return translation._name === name;
                });
            };

            translater.getCurrentTranslationName = function() {
                return translater._currentTranslation._name;
            };

            translater.setTrKeys = function(translationsKeys) {
                this._translationsKeys = translationsKeys;
            };

            translater.getTrKey = function(translationsKeys) {
                return this._translationsKeys[translationsKeys];
            };

            translater.findTranslation = function(str) {
                var translation = translater._currentTranslation._translations[str];
                return translation ? translation : str;
            };

            translater.translate = function(str, placeholdersValues) {

                var fullTranslation = null;
                var currentTranslation = this.findTranslation(str);
                if (placeholdersValues) {
                    fullTranslation = HD_.Translater.replaceArgs(currentTranslation, placeholdersValues);
                }
                else {
                    var temp = currentTranslation;
                    if (! temp) {
                        fullTranslation = str;
                    }
                    else {
                        fullTranslation = temp;
                    }
                }

                return fullTranslation;
            };

            translater.trKey = function(key) {
                return this.translate(this.getTrKey(key));
            };

            return translater;
        },

        /*
        Ajoute à l'application appObject un traducteur initialisé avec la langue de départ.
        
        appObject: l'application à laquelle on ajoute le traducteur
        propName: nom du traducteur dans l'application
        language: langage de départ
        translationsKeys: id éléments à traduire
        translationsArray: tableau contenant toutes les traductions
        
        Exemple d'appel:
        HD_.Translater.setAppTrProperty(this, "tr", "fr", {key1:key1, key2:key2}, [
            {name: "en", translations: {key1: "key 1", key2: "key 2"} },
            {name: "fr", translations: {key1: "clé 1", key2: "clé 2"} },
        ]);
        */
        setAppTrProperty : function(appObject, propName, language, translationsKeys, translationsArray) {
            var translater = this.create();
            translationsArray.forEach(function(translation) { // translation == {name: str, translations: array}
                translater.addTranlsation(translation.name, translation.translations);
            });
            translater.setCurrentTranlsation(language);
            translater.setTrKeys(translationsKeys);

            appObject[propName] = translater;
        },

        /*
        Retourne une chaine de caractères où les variables de la forme %x 
        (avec x un entier allant de 1 à 9) sont remplacées par les valeurs
        des arguments correspondant. Le premier argument étant là chaine originale,
        on a :
        %1 est remplacée par la valeur du deuxième argument (arguments[1])
        %2 est remplacée par la valeur du troisième argument (arguments[2]), etc.
        */
        replaceArgs : function (str, placeholdersValues) {
            var stringVarRegExp = /(%.)/;
            var matchData;
            var currentReplacement;
            var i = 0;
            var translatedString = str;
            while ( ( matchData = stringVarRegExp.exec(translatedString )) !== null ) {
                currentReplacement = translatedString.replace( matchData[0], placeholdersValues[ i ]  );
                translatedString =  currentReplacement;
                i++;
            }

            return translatedString;
        }
    };

})();
