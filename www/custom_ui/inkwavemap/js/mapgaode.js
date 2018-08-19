function MapGaode() {
    this.map = null;
    this.trafficLayer = null;
    this.homerangeLayer = null;
	this.homerangeLayerArr = new Array();
    this.homepointLayer = null;
	this.homepointLayerArr = new Array();
    this.devicesLayer = {};
    this.devicesDrivingLayer = {};
    this.markerClusterer = null;
    this.homeWindow = null;
	this.trackPlaybackLayer = null;
	this.trackPlaybackLine1 = null;
	this.trackPlaybackLine2 = null;
	this.trackPlaybackMass1 = null;
	this.trackPlaybackMass2 = null;
	this.DrawlineArr = [];
}

MapGaode.prototype = {
    init: function(coordinate,zone) {
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
            
			/*
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
            */
			
			//mengqi
			var vhomepointLayerArr = new Array();
			var vhomerangeLayerArr = new Array();
			$.each(zone, function (i, n)
			{
				var cZone = that.getCustomCoordinate({'lon':n.longitude,'lat':n.latitude });
				
				//标注zone
				var vhomepointLayer = new AMap.SimpleMarker({
					map: that.map,
					iconLabel: n.friendly_name,
					iconTheme: 'default',
					iconStyle: 'green',
					position: [cZone.lon, cZone.lat]
				});
				
				vhomepointLayerArr.push(vhomepointLayer);
				
				//zone的地理围栏
				var vhomerangeLayer = new AMap.Circle({
					map: that.map,
					center: [cZone.lon, cZone.lat],
					radius: n.radius,
					fillOpacity:0.2,
					strokeWeight: 1,
					a : 123
				});
				vhomerangeLayerArr.push(vhomerangeLayer);
				
				if (n.entity_id == "zone.home")
				{
					that.homepointLayer = vhomepointLayer;
					that.homerangeLayer = vhomerangeLayer;
				}
				
			});
			that.homepointLayerArr = vhomepointLayerArr;
			that.homerangeLayerArr = vhomerangeLayerArr;
			that.homerange(true);
			that.homepoint(true);
			
            var sts = [{
                url: "images/blue.png",
                size: new AMap.Size(32, 32),
				//resizeEnable: true,
                offset: new AMap.Pixel(-16, -16)
				//offset: new AMap.Pixel(-26, 0)
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
	
	//mengqi
	query: function(coordinate) {
		this.drawTrackPlaybackmarker(coordinate);
	},
	
	drawTrackPlaybackmarker: function(coordinate) {
        if(null == this.map) {
            return;
        }
		var that = this;
        //var cCoordinate = coordinate;
		
		var cCoordinate = new Array();
		$.each(coordinate, function (i, n)
		{
			var cPosition = that.getCustomCoordinate({'lon':n.longitude,'lat':n.latitude });
			cCoordinate.push({
								'longitude': cPosition.lon, 
								'latitude': cPosition.lat,
								'updatedate': n.updatedate,
								'lnglat': [ cPosition.lon,cPosition.lat]
							});
		});
		
		//alert(cCoordinate);
		
		
        //var marker, lineArr = [];
		//var cZone = that.getCustomCoordinate({'lon':n.longitude,'lat':n.latitude });
		//position: [cZone.lon, cZone.lat]
		var lineArr = [];
			//var trackPlaybackPosition = that.getCustomCoordinate({'lon':cCoordinate[0].longitude,'lat':cCoordinate[0].latitude });
			that.trackPlaybackLayer = new AMap.Marker({
				map: that.map,
				position: [cCoordinate[0].longitude, cCoordinate[0].latitude],
				//icon: "https://webapi.amap.com/images/car.png",
				icon: "images/car.png",
				offset: new AMap.Pixel(-20, -7),
				autoRotation: true,
				zIndex : 120
			});
			
			var lngX = cCoordinate[0].longitude, latY = cCoordinate[0].latitude;        
			lineArr.push(new AMap.LngLat(lngX, latY));
			
			$.each(cCoordinate, function (i, n)
			{
				lineArr.push(new AMap.LngLat(n.longitude, n.latitude));
			});
		   



			// 绘制轨迹
		    that.trackPlaybackLine1 = new AMap.Polyline({
				map: that.map,
				path: lineArr,
				strokeColor: "#00A",  //线颜色
				// strokeOpacity: 1,     //线透明度
				strokeWeight: 3,      //线宽
				zIndex : 111
				// strokeStyle: "solid"  //线样式
			});
			that.trackPlaybackLine2 = new AMap.Polyline({
				map: that.map,
			   // path: lineArr,
				strokeColor: "#F00",  //线颜色
				// strokeOpacity: 1,     //线透明度
				strokeWeight: 3,      //线宽
				zIndex : 112
				// strokeStyle: "solid"  //线样式
			});


			that.trackPlaybackLayer.on('moving',function(e){
			that.trackPlaybackLine2.setPath(e.passedPath);
			})
			that.map.setFitView();
			
			that.DrawlineArr = lineArr;
			
			//定义锚点样式
			var style = [{
			  url: 'images/mass0.png',
			  anchor: new AMap.Pixel(6, 6),
			  size: new AMap.Size(11, 11)
			},{
			  url: 'images/mass1.png',
			  anchor: new AMap.Pixel(4, 4),
			  size: new AMap.Size(7, 7)
			},{
			  url: 'images/mass2.png',
			  anchor: new AMap.Pixel(3, 3),
			  size: new AMap.Size(5, 5)
			}
		  ];
		  
		  //加载锚点数据，并实现锚点
		  that.trackPlaybackMass1 = new AMap.MassMarks(cCoordinate, {
				opacity:0.8,
				zIndex: 5,
				cursor:'pointer',
				style:style[0]
		  });
		  
		  //this.trackPlaybackMass1.setStyle(style[2]);
		  
		  that.trackPlaybackMass2 = new AMap.Marker({content:' ',map:that.map})
		  that.trackPlaybackMass1.on('mouseover',function(e){
		  that.trackPlaybackMass2.setPosition(e.data.lnglat);
		  that.trackPlaybackMass2.setLabel({content:e.data.updatedate})
		  })
		  that.trackPlaybackMass1.setMap(that.map);
		  
    },
	
	DrawStart: function() {
		var that = this;
		that.trackPlaybackLayer.moveAlong(that.DrawlineArr, 1000);
	},
	
	DrawPause: function() {
		this.trackPlaybackLayer.pauseMove();
	},
	
	DrawResume: function() {
		this.trackPlaybackLayer.resumeMove();
	},
	
	DrawStop: function() {
		this.trackPlaybackLayer.stopMove();
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
    
    drawdrivingmarker: function(deviceid, coordinate, tracktype) {
        var that = this;
        if(null == this.devicesLayer[deviceid]) {
            return;
        }
        var cCoordinate = this.getCustomCoordinate(coordinate);
        var c = this.devicesLayer[deviceid].getPosition();
        if(this.devicesDrivingLayer[deviceid]) {
            this.devicesDrivingLayer[deviceid].clear();
        }
		
        /*
		$.each(that.homerangeLayerArr, function (i, n)
		{
			if(n.contains([c.lng, c.lat])){
				$(document).trigger('updateDrivingTime', {'deviceId': deviceid, 'time': 'Home'});
				
			}
		});		*/
		
		
        if(that.homerangeLayer.contains([c.lng, c.lat])) {
            $(document).trigger('updateDrivingState', {'deviceId': deviceid, 'state_r': 'Home'});
			//$(document).trigger('updateDrivingTime', {'deviceId': deviceid, 'time': 'Home'});

        } else {
			
			if (tracktype == "ride"){	//骑行
				this.devicesDrivingLayer[deviceid] = new AMap.Riding({
					map: this.devicesLayer[deviceid].visible ? that.map : null,
					hideMarkers: true,
					autoFitView: false
				});
			}else if (tracktype == "walk") {	//步行
				this.devicesDrivingLayer[deviceid] = new AMap.Walking({
					map: this.devicesLayer[deviceid].visible ? that.map : null,
					hideMarkers: true,
					autoFitView: false
				});
			} else {	//驾车
				this.devicesDrivingLayer[deviceid] = new AMap.Driving({
					map: this.devicesLayer[deviceid].visible ? that.map : null,
					hideMarkers: true,
					autoFitView: false
				});
			}
			
			
			
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
    
	drawdrivingmarkerShow: function(flag) {
		if(null == this.map) {
            return;
        }
        
        if(null == this.trafficLayer) {
            return;
        }
        
        if(flag) {
			
			$.each(this.devicesDrivingLayer, function (i, n)
			{
				//没有显示的方法，在前端重新查询实现展示
				null;
				
			});
		}else{
			$.each(this.devicesDrivingLayer, function (i, n)
			{
				n.clear();
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
                //this.homerangeLayer.hide();
                //this.homerangeLayer.visible = false;
				
				$.each(this.homerangeLayerArr, function (i, n)
				{
					n.hide();
					n.visible = false;
				});				
				
            } else {
                //this.homerangeLayer.show();
                //this.homerangeLayer.visible = true;
				
				$.each(this.homerangeLayerArr, function (i, n)
				{
					n.show();
					n.visible = true;
				});	
            }
        } else {
            if(flag) {
                //this.homerangeLayer.show();
                //this.homerangeLayer.visible = true;
				
				$.each(this.homerangeLayerArr, function (i, n)
				{
					n.show();
					n.visible = true;
				});	
            } else {
                //this.homerangeLayer.hide();
                //this.homerangeLayer.visible = false;
				
				$.each(this.homerangeLayerArr, function (i, n)
				{
					n.hide();
					n.visible = false;
				});	
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
                //this.homepointLayer.hide();
                //this.homepointLayer.visible = false;
				
				$.each(this.homepointLayerArr, function (i, n)
				{
					n.hide();
					n.visible = false;
				});		
				
            } else {
                //this.homepointLayer.show();
                //this.homepointLayer.visible = true;
				
				$.each(this.homepointLayerArr, function (i, n)
				{
					n.show();
					n.visible = true;
				});		
            }
        } else {
            if(flag) {
                //this.homepointLayer.show();
                //this.homepointLayer.visible = true;
				
				$.each(this.homepointLayerArr, function (i, n)
				{
					n.show();
					n.visible = true;
				});		
            } else {
                //this.homepointLayer.hide();
                //this.homepointLayer.visible = false;
				
				$.each(this.homepointLayerArr, function (i, n)
				{
					n.hide();
					n.visible = false;
				});		
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
    },
	
	//mengqi
	trackplayback: function(flag) {
        if(null == this.map) {
            return;
        }
        
        if(null == this.trackPlaybackLayer) {
            return;
        }
        
        if(null == flag) {
            if(this.trackPlaybackLayer.visible) {
                this.trackPlaybackLayer.hide();
                this.trackPlaybackLayer.visible = false;
				this.trackPlaybackLine1.visible = false;
				this.trackPlaybackLine2.visible = false;
				this.trackPlaybackMass1.visible = false;
				this.trackPlaybackMass2.visible = false;
				this.trackPlaybackLine1.hide();
				this.trackPlaybackLine2.hide();
				this.trackPlaybackMass1.hide();
				this.trackPlaybackMass2.hide();
				
            } else {
                this.trackPlaybackLayer.show();
                this.trackPlaybackLayer.visible = true;
				this.trackPlaybackLine1.visible = true;
				this.trackPlaybackLine2.visible = true;
				this.trackPlaybackMass1.visible = true;
				this.trackPlaybackMass2.visible = true;
				this.trackPlaybackLine1.show();
				this.trackPlaybackLine2.show();
				this.trackPlaybackMass1.show();
				this.trackPlaybackMass2.show();
            }
        } else {
            if(flag) {
                this.trackPlaybackLayer.show();
                this.trackPlaybackLayer.visible = true;
				this.trackPlaybackLine1.visible = true;
				this.trackPlaybackLine2.visible = true;
				this.trackPlaybackMass1.visible = true;
				this.trackPlaybackMass2.visible = true;
				this.trackPlaybackLine1.show();
				this.trackPlaybackLine2.show();
				this.trackPlaybackMass1.show();
				this.trackPlaybackMass2.show();
            } else {
                this.trackPlaybackLayer.hide();
                this.trackPlaybackLayer.visible = false;
				this.trackPlaybackLine1.visible = false;
				this.trackPlaybackLine2.visible = false;
				this.trackPlaybackMass1.visible = false;
				this.trackPlaybackMass2.visible = false;
				this.trackPlaybackLine1.hide();
				this.trackPlaybackLine2.hide();
				this.trackPlaybackMass1.hide();
				this.trackPlaybackMass2.hide();
            }
        }
    }
}
