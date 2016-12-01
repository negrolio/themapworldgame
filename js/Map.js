var Map = function(shapes, selector){
    this.messages       = {};
    this.shapes         = shapes;
    this.container      = {};
    this.zoom           = {};
    this.mouseMoved     = false;
    this.countryUsed    = false;
    this.functionOfPopName = null;
    this.popCountryName = $('#country-hover');
    this.listenZoom();
    this.setContainer(selector)
    this.drawMap();
    this.setEvents()
}

Map.prototype = {
    setEvents: function(){           // this.drawHint(countriesHint) esto nunca, por que la funcion se pasa para que se ejecute y no ya ejecutada. el parametro que manda trigger se recibe internamente
        GameModel.vent.on('show:hint',            this.drawHint,           this)
        GameModel.vent.on('stroke:wrong:country', this.strokeWrongCountry, this)
        GameModel.vent.on('next:turn',            this.colorCountry,       this)
        GameModel.vent.on('game:mode:set',        this.activateCountries,  this)
    },

    listenZoom: function(){
        this.zoom = d3.behavior.zoom()
           .scaleExtent([1, 10])
           .on("zoom", _.bind(this.zoomed, this));
    },

    setContainer: function(selector){
        this.container = d3.select(selector)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .call(this.zoom)
            .append('g')
    },

    drawMap: function(){
        var self = this;

        this.countries = this.container.selectAll('path')
            .data(d3.entries(this.shapes)) // Set data to be used by D3
            .enter() //Start looping trhough the data creating an element for each item
            .append('path')
            .attr('d', function(data){return data.value}) // Draw the path using the data binded to this item
            .classed('country', true)
            .on('mouseover', function(d){ // why 'this' refer only to the country hover?
                d3.select(this).classed('on-mouse-over-the-country',true);
                this.countryUsed = d3.select(this).classed('ctry-clicked'); //this say if countryUsed is true or false
                if (this.countryUsed) {
                    self.showNameCountryPop(WorldMap.names[d.key])
                }
            })
            .on('mouseout', function(d){
                d3.select(this).classed('on-mouse-over-the-country',false);
                self.popCountryName.hide();
                clearInterval(self.functionOfPopName);               
            })
            .on('mousedown', function(){
                self.mouseMoved = false;
            })
            .on('mousemove', function(){
                self.mouseMoved = true;
            })
            .on('mouseup', function(elementData){ 
                if (!self.mouseMoved && !this.countryUsed) {
                    GameModel.onCountryClicked({data: elementData, country:this})
                }
            })
    },

     zoomed: function(a){
        this.container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    },

    drawHint: function(countriesHint){
        this.countries.each(function(d){
            for (var i in countriesHint ){
                if (countriesHint[i] === d.key) {
                    d3.select(this).classed('hint-country',true);
                }
            }
        })
    },

    strokeWrongCountry: function(country){
        d3.select(country).classed('stroke-country',true);
        setTimeout(function(){
            d3.select(country).classed('stroke-country',false);
        }, 400);
    },

    colorCountry:function(options){
        if (!options.guessed) {
            this.countries.each(function(d){
                if (GameModel.currentCountry === d.key) {
                    d3.select(this).classed('ctry-wrong',true);
                    d3.select(this).classed('ctry-clicked',true);
                }
            })
        } else {
            d3.select(options.country).classed(GameModel.currentPlayer.colorClass, true);
            d3.select(options.country).classed('ctry-clicked',true);
        }
    },

    activateCountries: function(){
        countries = GameModel.getCurrentCountries()
        if(countries){
            this.countries.each(function(d){
                d3.select(this).classed('disable-country',true);
                for (var i in countries ){
                    if (countries[i] === d.key) {
                        d3.select(this).classed('disable-country',false);
                    }
                }
            })
        }
    },

    showNameCountryPop: function(name){
        var self = this;
        this.popCountryName.css({'top':event.clientY,'left':event.clientX})
        this.functionOfPopName = setInterval(function(){ // this is a little inappropriate,because if the mouse still hover the country, the function never stop, but you can't see that. so uglymente it works
            self.popCountryName.html(name);  
            self.popCountryName.show();    
         }, 500);
    },

}
