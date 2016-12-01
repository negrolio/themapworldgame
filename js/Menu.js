
Menu.prototype = {

	getOutTheMenu: function(){
        $("#menu-buttons").fadeOut('slow', function() {
            $('#container-game').css('-webkit-filter','none');
            $('#container-game').css('pointer-events','all');
            $('#h-country').fadeIn("fast", function() {
                $('#container-game').css('fill-opacity','inherit');
                $('#h-country').css('display', 'auto');
            });
        });
    },

    getInMenu: function(){
        $('#container-game').css('fill-opacity','30%');
        $('#h-country').css('display', 'none');
        $("#menu-buttons").fadeIn('slow', function() {
            $('#container-game').css('pointer-events','none');
            $('#h-country').fadeOut("fast");
        });
    },


}