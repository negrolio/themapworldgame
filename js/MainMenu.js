window.MainMenu = function(){
    this.setUI();
    this.setEvents();
}

MainMenu.prototype = {
    setUI : function(){
        this.UI = {
            menuContainer         : $('#menu-container'),
            menuPlay              : $('#menu-single-multi'),
            menuPlayers           : $('.menu-buttons'),
            singleButton          : $('#single-button'),
            multiButton           : $('#multi-button'),
            multiModeOption       : $('#multi-mode-option'),
            multiModeButtons      : $('.mode-option-multi'),
            menuDifficultyModes   : $('#menu-difficulty-modes'),
            difficultyModeButtons : $('.difficulty-mode-buttons'),
            menuContainer         : $('#menu-container'),
            containerGame         : $('#container-game'),
            finalPanel            : $('#final-panel'),
            panelWinners          : $('#multi-panel-winner'),
            panelTie              : $('#multi-panel-tie'),
            panelSingle           : $('#single-panel'),
            winnerMessage         : $('#winner-h1'),
            winnerPercent         : $('#winner-percent'),
            loserMessage          : $('#loser-h1'),
            loserPercent          : $('#loser-percent'),
            tiePercent            : $('#tie-percent'),
            singlePercent         : $('#single-percent'),
            randomButton          : $('#random-button'),
            chooseButton          : $('#choose-button')
        }
    },

    setEvents : function(){
        this.UI.menuPlayers.click(          _.bind( this.setElectionOfPlayers, this));
        this.UI.difficultyModeButtons.click(_.bind( this.setDifficultyMode,    this)); //what the deal with bind?
        this.UI.multiModeButtons.click(      _.bind( this.setMultiMode,         this));
        // this.UI.menuPlayers.click(           _.bind( this.moveDiv,           this));
        // this.UI.menuPlayers.click(           _.bind( this.setPlayersMode,    this));
        // this.UI.multiModeOption.click(       _.bind( this.moveDiv2,          this));

        GameModel.vent.on('finish-game',    this.showFinalPanel, this);
        GameModel.vent.on('winner:message', this.putNamesPodium, this);
    },

    setElectionOfPlayers : function(evt){
        var modePlayer = $(evt.currentTarget).data('mode');
        GameModel.setPlayersMode(modePlayer);
        this.moveMenu(modePlayer);
    },

    moveMenu : function(mode){
        this.moveFirstMenu()

        check = this.checkElectionPlayer(mode);
        if (!check){
            this.bringMultiModeMenu();
        }else {
            // this.UI.menuDifficultyModes.css('position','initial');
            this.bringDifficultyMenu();
        }

        // this.UI.singleButton.css('animation','mymoveUp 2s').css('animation-fill-mode','forwards');
    },

    moveFirstMenu : function(){
      this.UI.singleButton.addClass('animate-single-button'); //this animate with css
      this.UI.multiButton.addClass('animate-multi-button');
    },
    moveMultiPlayersOptions : function(){
      this.UI.randomButton.addClass('animate-single-button'); //this animate with css
      this.UI.chooseButton.addClass('animate-multi-button');
    },

    checkElectionPlayer : function(mode){
        if (mode == 'single') {
            return true
        }else{
            return false
        }
    },

    bringMultiModeMenu : function(){
        this.UI.multiModeOption.fadeIn(2000).css("display","block");
    },

    bringDifficultyMenu : function(){
        this.UI.menuDifficultyModes.fadeIn(2000);
    },

    // setPlayersMode: function(evt){ // que hace el evt?
    //     var mode = $(evt.currentTarget).data('mode');
    //     GameModel.setPlayersMode(mode);
    // },

    setDifficultyMode: function(evt){
        var mode = $(evt.currentTarget).data('mode');
        GameModel.setDifficultyMode(mode);
        if (this.checkMultiMode()) {GameModel.setMultiMode(GameModel.multiMode);};//because we need first the number of countries
        this.getOutModeMenuFrontBackground();
    },

    setMultiMode : function(evt){
        GameModel.multiMode = $(evt.currentTarget).data('mode');
        // aqui deberiamos llamar a setMultiMode de GameModel, pero lo dejamos que lo haga setDifficultyMode para saber antes con cuantos paises se va a jugar

        //this.moveDiv2();
        this.moveMultiPlayersOptions();
        this.bringDifficultyMenu();
    },

    checkMultiMode: function(){
        if (GameModel.multiMode == 'choose') {return true}else{return false};
    },

    getOutModeMenuFrontBackground : function(){
        this.UI.menuContainer.fadeOut();
        this.UI.containerGame.css('-webkit-filter','none');
        this.UI.containerGame.css('pointer-events','all');
        this.UI.containerGame.css('fill-opacity','inherit');
    },

    showFinalPanel: function(options){
        this.UI.finalPanel.css({'height':'85%','width':'33.3%'});
        if (GameModel.playersMode === 'multi') {
            if (options.winner) {
                this.UI.panelWinners.show()
            } else {
                this.UI.tiePercent.html(GameModel.currentPlayer.countriesGuessed +' of '+(GameModel.currentPlayer.countriesGuessed+GameModel.currentPlayer.countriesMissed) +' guessed countries <br>' + options.points + ' of points');
                this.UI.panelTie.show()
            }
        } else {
            this.UI.singlePercent.html(GameModel.currentPlayer.countriesGuessed +' of '+(GameModel.currentPlayer.countriesGuessed+GameModel.currentPlayer.countriesMissed) +' guessed countries <br>' + options.points + ' of points')
            this.UI.panelSingle.show()
        }
    },

    putNamesPodium: function(position){
        this.UI.winnerMessage.html(position.winner.playerName + ' winner! <br>'+position.winner.countriesGuessed+' guessed countries of '+(position.winner.countriesGuessed+position.winner.countriesMissed));
        this.UI.winnerPercent.html(position.winnerPercent     + ' of points');
        this.UI.loserMessage.html(position.loser.playerName   + ' Loser <br>'  +position.loser.countriesGuessed+' guessed countries of '+(position.winner.countriesGuessed+position.winner.countriesMissed));
        this.UI.loserPercent.html(position.loserPercent       + ' of points');
    },

}
