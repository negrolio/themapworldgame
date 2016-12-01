// WINDOW es el objeto global en los browsers. Cualquier propiedad de este objeto es una variable global
// que puede ser utilizada desde cualquier parte de la aplicación
// OJO! también puede ser sobrescrita. Por eso, para prevenir en cierta medida esto, se usa la
// convención de que las variables globales comiencen con Mayúsculas

window.GameUI = function(){
    this.setProperties();
}

GameUI.prototype = {
    setProperties: function(){
        this.wrongPoints     = 0;
        this.countryClicked  = null
        this.UI              = {}
        this.playersUI       = []
        this.setUI()
        this.initialize()
    },

    initialize: function(){
        this.listenToEvents();
        this.showCountry();
        //$(".chosen-select").chosen()
        this.takeValueSelect()
    },

    setUI: function(){
        this.UI = {
            reset            : $('#reset-button'),
            hint             : $('#hint-button'),
            countryName      : $('#h-country'),
            finalPanel       : $('#final-indicator'),
            countryNamePanel : $('#bottom-bar'),
            containerGame    : $('#container-game'),
            selectCountry    : $('#select-country'),
            selectChild      : $('#select-child'),
        }
    },

    listenToEvents: function(){
        this.UI.reset.click(function(event) {
            location.reload()
        });
        // this.UI.reset.click( _.bind( this.resetGame,             this));
        this.UI.hint.click(  _.bind( this.colorHintsCountries,   this));

        GameModel.vent.on('choose:mode',            this.setChooseMode,          this);
        GameModel.vent.on('player:mode:set',        this.setPlayersUI,           this);
        GameModel.vent.on('game:mode:set',          this.onModeSelected,         this);
        GameModel.vent.on('points:added',           this.setPoints,              this);
        GameModel.vent.on('next:turn',              this.nextTurn,               this);
        GameModel.vent.on('current:player:changed', this.onCurrentPlayerChanged, this);
    },

    takeValueSelect:function(){
        var self = this;
        this.UI.selectChild.chosen().change(function(){
            var val = self.UI.selectChild.val();
            GameModel.currentCountry = val[0];
            self.showCountry();
            GameModel.setHintCountries();
            self.UI.countryName.show();
            self.UI.selectCountry.fadeOut();
            self.UI.selectChild.empty();
            self.UI.selectChild.trigger("liszt:updated")
        })
    },

    setChooseMode:function(){
        this.putNamesInSelect();
        this.UI.countryName.hide();
        GameModel.currentCountry = null;
    },

    putNamesInSelect: function(){
        var countries = GameModel.getCurrentCountries();
        for (var i = 0; i < countries.length; i++) {
            this.UI.selectChild.append('<option value="'+countries[i]+'">' + WorldMap.names[countries[i]] + '</option>')            
        };
        // for (var a in countries) {
        //     this.UI.selectChild.append('<option value="'+countries[a]+'">' + WorldMap.names[countries[a]] + '</option>')            
        // };
        this.UI.selectChild.trigger("liszt:updated"); //usually for this have to use "chosen:update"
        this.UI.selectCountry.show();
    },

    onModeSelected: function(mode){
        this.UI.countryNamePanel.fadeIn();
        this.UI.containerGame.css({ //esta funcion pone el fondo celeste y hace el cuadriculado
            'background-color': '#1D6C8F',
            'background-size': '28px 28px, 28px 28px'
        });
    },

    setPlayersUI: function(mode){
        this.playersUI.push(new PlayerUI(1))
        if(mode == 'multi'){
            this.playersUI.push(new PlayerUI(2))
            $('#player2-div').show()
        }

    },

    colorHintsCountries: function(){
        GameModel.showHint();
    },

    //Este método puede ir en el GameModel
    isThisTheLastCountry: function(){
        var oneCountryLeft = GameModel.getNumberOfCountriesLeft() === 1;
        var triedAllTimes = this.countClicks === GameModel.amountOfTries;
        var rightCountry = this.countryClicked === GameModel.currentCountry;
        if (( oneCountryLeft && triedAllTimes)||(oneCountryLeft && rightCountry)) {
            return true;
        };
    },

    nextTurn: function(){
        if (GameModel.multiMode == 'random') {
            this.showNextCountry();
        }else{
            this.selectNextCountry();
        }
    },

    selectNextCountry: function(){
        GameModel.prepareSelect();
        this.UI.selectCountry.toggleClass("select-side");
        this.UI.selectCountry.show();
        d3.selectAll('path').classed('hint-country',false)
    },

    showNextCountry: function(){
        GameModel.nextCountry()
        this.showCountry()
        d3.selectAll('path').classed('hint-country',false)
    },

    showCountry: function(){
        this.UI.countryName.empty();
        this.addFlag();
        this.UI.countryName.append(GameModel.getCurrentCountryName());
    },

    addFlag: function(){
        if (!GameModel.isItNoMoreCountries()) {
            this.UI.countryName.append('<span class="flag-cuestion flag-icon flag-icon-'+ GameModel.currentCountry.toLowerCase() +'"></span>  ');           
        };
    },

    setPoints: function(){
        current = this.playersUI[GameModel.currentPlayer.playerIndex]
        current.UI.panelPoints.html(GameModel.currentPlayer.points)
        current.UI.panelGuessed.html(GameModel.currentPlayer.countriesGuessed)
        current.UI.panelMissed.html(GameModel.currentPlayer.countriesMissed)
    },

    onCurrentPlayerChanged: function(player){
        if(GameModel.playersMode == 'multi'){
            this.playersUI[0].UI.turnIndicator.hide();
            this.playersUI[1].UI.turnIndicator.hide();
            if (!GameModel.isItNoMoreCountries()) 
                this.playersUI[player.playerIndex].UI.turnIndicator.show();
        }
    },

    resetColors: function(){
        d3.selectAll('path').classed('ctry-fine ctry-wrong',false);
    },

    // resetGame: function(){
    //     GameModel.reset();
    //     this.setProperties();
    //     this.start();
    //     this.resetColors()
    //     this.UI.finalPanel.animate({left:'-340px'}, 1000);
    //     this.UI.finalPanel.empty();
    //     this.UI.finalPanel.append('<span id="reset-button" class="label label-default">Reset</span>');
    //     this.UI.points.empty();
    // },

    
}
