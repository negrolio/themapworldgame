window.PlayerUI = function(playerNumber){
    this.playerNumber = playerNumber;
    this.UI           = {};
    this.setUI();
}

PlayerUI.prototype = {
    setUI: function(){
        this.UI = {
            panelPoints   : $('#player-' + this.playerNumber + '-points'),
            panelGuessed  : $('#player-' + this.playerNumber + '-countries-guessed'),
            panelMissed   : $('#player-' + this.playerNumber + '-countries-missed'),
            turnIndicator : $('#player-' + this.playerNumber + '-turn')
        }
    }
}
