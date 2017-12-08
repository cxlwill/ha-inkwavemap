function Map() {
    this.maps = [
        new MapGaode(),
        new MapBaidu()
    ];
    this.currentMapIndex = 0;
}

Map.prototype = {
    getMap: function() {
        return this.maps[this.currentMapIndex];
    },
    
    init: function(coordinate) {
        this.getMap().init(coordinate);
    },
    
    center: function(coordinate) {
        this.getMap().center(coordinate);
    },
    
    drawdevicemarker: function(deviceid, lableName, coordinate) {
        this.getMap().drawdevicemarker(deviceid, lableName, coordinate);
    },
    
    showdevicemarker: function(deviceid, flag) {
        this.getMap().showdevicemarker(deviceid, flag);
    },
    
    drawdrivingmarker: function(deviceid, coordinate) {
        this.getMap().drawdrivingmarker(deviceid, coordinate);
    },
    
    zoomin: function() {
        this.getMap().zoomin();
    },
    
    zoomout: function() {
        this.getMap().zoomout();
    },
    
    homerange: function() {
        this.getMap().homerange();
    },
    
    homepoint: function() {
        this.getMap().homepoint();
    },
    
    traffic: function() {
        this.getMap().traffic();
    },
    
    devicelist: function() {
        if($('#deviceListWin').is(":visible")) {
            $('#deviceListWin').window('close');
        } else {
            $('#deviceListWin').window('open');
        }
    },
            
    iszoomin: function() {
        return this.getMap().iszoomin();
    },

    iszoomout: function() {
        return this.getMap().iszoomout();
    },

    istraffic: function() {
        return this.getMap().istraffic();
    },
    
    ishomerange: function() {
        return this.getMap().ishomerange();
    },
    
    ishomepoint: function() {
        return this.getMap().ishomepoint();
    },
    
    isdevicelist: function() {
        return $('#deviceListWin').is(":visible");
    }

}
