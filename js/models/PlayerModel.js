window.PlayerModel = function(options){
    this.setProperties(options);
}

PlayerModel.prototype = {
    setProperties: function(options){
        this.points              = 0;
        this.countriesGuessed    = 0;
        this.countriesMissed     = 0;
        this.countClicks         = 0;
        this.colorClass          = options.colorClass
        this.playerName          = options.playerName
        this.playerIndex         = options.playerIndex
    },

    addPoints: function(points){
        this.points += points;
    }
}
