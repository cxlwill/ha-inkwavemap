function MapGaode() {
    this.map = null;
    this.trafficLayer = null;
    this.homerangeLayer = null;
    this.homepointLayer = null;
    this.devicesLayer = {};
    this.devicesDrivingLayer = {};
    this.markerClusterer = null;
    this.homeWindow = null;
}

MapGaode.prototype = {
    init: function(coordinate) {
        var that = this;

        AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
            AMap.SimpleMarker = SimpleMarker;
            
            var cCoordinate = that.getCustomCoordinate(coordinate);
            that.map = new AMap.Map('mapContainer', {
                resizeEnable: true,
                zoom: 15,
                center: [cCoordinate.lon, cCoordinate.lat]
            });
            
            that.map.on('zoomchange', function() {
                $(document).trigger('zoomchange');
            });
            
            //交通
            that.trafficLayer = new AMap.TileLayer.Traffic({
                map: that.map,
                zIndex: 4
            });
            that.traffic(true);
            
            //家地理围栏
            that.homerangeLayer = new AMap.Circle({
                map: that.map,
                center: [cCoordinate.lon, cCoordinate.lat],
                radius: 100,
                fillOpacity:0.2,
                strokeWeight: 1
            });
            that.homerange(true);
            
            //家标记
            that.homepointLayer = new AMap.SimpleMarker({
                map: that.map,
                iconLabel: '家',
                iconTheme: 'default',
                iconStyle: 'green',
                position: [cCoordinate.lon, cCoordinate.lat]
            });
            that.homepoint(true);
            
            var sts = [{
                url: "images/blue.png",
                size: new AMap.Size(32, 32),
                offset: new AMap.Pixel(-16, -16)
            }]
            that.markerClusterer = new AMap.MarkerClusterer(
                that.map, 
                [], {
                styles: sts,
                gridSize: 20,
                zoomOnClick: true
            });
            that.markerClusterer.on('click', function({cluster, lnglat, target, markers}) {
                if(that.homerangeLayer.contains(lnglat)) {
                    var info = [];
                    info.push("<div style=\"width:200px;padding:0px 0px 0px 0px;\"><b>Stay Home List</b>");
                    info.push("<hr>");
                    for(var deviceId in that.devicesLayer) {
                        if(that.devicesLayer[deviceId].visible) {
                            if(that.homerangeLayer.contains(that.devicesLayer[deviceId].getPosition())) {
                                info.push("<li>" + that.devicesLayer[deviceId].getContent().innerText + "</li>");
                            }
                        }
                    }
                    info.push("</div></div>");
                    that.homeWindow = new AMap.InfoWindow({
                        content: info.join("<br/>")
                    });
                    that.homeWindow.open(that.map, markers[0].getPosition());
                }
            });
            
            $(document).trigger('mapInitFinished');
        });
    },
    
    getStandardCoordinate: function(coordinate) {
        return coordinateutil.gcj_decrypt(coordinate.lat, coordinate.lon);
    },
    
    getCustomCoordinate: function(coordinate) {
        return coordinateutil.gcj_encrypt(coordinate.lat, coordinate.lon);
    },
    
    center: function(coordinate) {
        var cCoordinate = this.getCustomCoordinate(coordinate);
        this.map.setCenter([cCoordinate.lon, cCoordinate.lat]);
    },
    
    drawdevicemarker: function(deviceid, lableName, coordinate) {
        var that = this;
        var cCoordinate = this.getCustomCoordinate(coordinate);
        if(this.devicesLayer[deviceid]) {
            this.devicesLayer[deviceid].setPosition([cCoordinate.lon, cCoordinate.lat]);
        } else {
            this.devicesLayer[deviceid] = new AMap.SimpleMarker({
                map: that.map,
                iconLabel: lableName,
                iconTheme: 'fresh',
                iconStyle: 'blue',
                position: [cCoordinate.lon, cCoordinate.lat]
            });
            this.devicesLayer[deviceid].visible = true;
            
            this.updateMarkerClusterer();
        }
    },
    
    updateMarkerClusterer: function() {
        var markers = [];
        for(var deviceid in this.devicesLayer) {
            if(this.devicesLayer[deviceid].visible) {
                markers.push(this.devicesLayer[deviceid]);
            }
        }
        this.markerClusterer.setMarkers(markers);
    },
    
    showdevicemarker: function(deviceid, flag) {
        if(this.devicesLayer[deviceid]) {
            if(flag) {
                this.devicesLayer[deviceid].show();
                this.devicesLayer[deviceid].visible = true;
            } else {
                this.devicesLayer[deviceid].hide();
                this.devicesLayer[deviceid].visible = false;
            }
            this.updateMarkerClusterer();
        }
    },
    
    drawdrivingmarker: function(deviceid, coordinate) {
        var that = this;
        if(null == this.devicesLayer[deviceid]) {
            return;
        }
        var cCoordinate = this.getCustomCoordinate(coordinate);
        var c = this.devicesLayer[deviceid].getPosition();
        if(this.devicesDrivingLayer[deviceid]) {
            this.devicesDrivingLayer[deviceid].clear();
        }
        
        if(that.homerangeLayer.contains([c.lng, c.lat])) {
            $(document).trigger('updateDrivingTime', {'deviceId': deviceid, 'time': 'Home'});
        } else {
            this.devicesDrivingLayer[deviceid] = new AMap.Driving({
                map: this.devicesLayer[deviceid].visible ? that.map : null,
                hideMarkers: true,
                autoFitView: false
            });
            this.devicesDrivingLayer[deviceid].search([c.lng, c.lat], [cCoordinate.lon, cCoordinate.lat]);
            this.devicesDrivingLayer[deviceid].on('complete', function(DrivingResult) {
                if(null == DrivingResult) {
                    return;
                }
                
                if(null == DrivingResult.routes) {
                    return;
                }
                
                var sum = 0;
                for(var index in DrivingResult.routes) {
                    sum += DrivingResult.routes[index].time;
                }
                $(document).trigger('updateDrivingTime', {'deviceId': deviceid, 'time': sum});
            });
        }
    },
    
    zoomin: function() {
        if(null == this.map) {
            return;
        }
        
        if(this.map.getZoom() >= 18) {
            return;
        }
        
        this.map.zoomIn();
    },
    
    zoomout: function() {
        if(null == this.map) {
            return;
        }
        
        if(this.map.getZoom() <= 3) {
            return false;
        }
        
        this.map.zoomOut();
    },
    
    traffic: function(flag) {
        if(null == this.map) {
            return;
        }
        
        if(null == this.trafficLayer) {
            return;
        }
        
        if(null == flag) {
            if(this.trafficLayer.visible) {
                this.trafficLayer.hide();
                this.trafficLayer.visible = false;
            } else {
                this.trafficLayer.show();
                this.trafficLayer.visible = true;
            }
        } else {
            if(flag) {
                this.trafficLayer.show();
                this.trafficLayer.visible = true;
            } else {
                this.trafficLayer.hide();
                this.trafficLayer.visible = false;
            }
        }
    },
    
    homerange: function(flag) {
        if(null == this.map) {
            return;
        }
        
        if(null == this.homerangeLayer) {
            return;
        }
        
        if(null == flag) {
            if(this.homerangeLayer.visible) {
                this.homerangeLayer.hide();
                this.homerangeLayer.visible = false;
            } else {
                this.homerangeLayer.show();
                this.homerangeLayer.visible = true;
            }
        } else {
            if(flag) {
                this.homerangeLayer.show();
                this.homerangeLayer.visible = true;
            } else {
                this.homerangeLayer.hide();
                this.homerangeLayer.visible = false;
            }
        }
    },
    
    homepoint: function(flag) {
        if(null == this.map) {
            return;
        }
        
        if(null == this.homepointLayer) {
            return;
        }
        
        if(null == flag) {
            if(this.homepointLayer.visible) {
                this.homepointLayer.hide();
                this.homepointLayer.visible = false;
            } else {
                this.homepointLayer.show();
                this.homepointLayer.visible = true;
            }
        } else {
            if(flag) {
                this.homepointLayer.show();
                this.homepointLayer.visible = true;
            } else {
                this.homepointLayer.hide();
                this.homepointLayer.visible = false;
            }
        }
    },
    
    iszoomin: function() {
        if(null == this.map) {
            return false;
        }
        
        if(this.map.getZoom() >= 18) {
            return false;
        }
        
        return true;
    },

    iszoomout: function() {
        if(null == this.map) {
            return false;
        }
        
        if(this.map.getZoom() <= 3) {
            return false;
        }
        
        return true;
    },

    istraffic: function() {
        if(null == this.map) {
            return false;
        }
        
        if(null == this.trafficLayer) {
            return false;
        }
        
        if(this.trafficLayer.visible) {
            return true;
        } else {
            return false;
        }
    },
    
    ishomerange: function() {
        if(null == this.map) {
            return false;
        }
        
        if(null == this.homerangeLayer) {
            return false;
        }
        
        if(this.homerangeLayer.visible) {
            return true;
        } else {
            return false;
        }
    },
    
    ishomepoint: function() {
        if(null == this.map) {
            return false;
        }
        
        if(null == this.homepointLayer) {
            return false;
        }
        
        if(this.homepointLayer.visible) {
            return true;
        } else {
            return false;
        }
    }
}
