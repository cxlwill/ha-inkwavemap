var map = new Map();
var homePoint = null;
$(function() {
    $("#deviceListGrid").datagrid({
        onClickRow: function(rowIndex,rowData) {
            if(!rowData.lon || !rowData.lat) {
                return;
            }
            
            map.center({
                'lon': rowData.lon,
                'lat': rowData.lat
            });
        },
        
        onCheckAll: function(rows) {
            for(var index in rows) {
                rows[index].checked = true;
                map.showdevicemarker(rows[index].id, true);
                map.drawdrivingmarker(rows[index].id, homePoint);
            }
        },
        
        onCheck: function(rowIndex, rowData) {
            rowData.checked = true;
            map.showdevicemarker(rowData.id, true);
            map.drawdrivingmarker(rowData.id, homePoint);
        },
        
        onUncheckAll: function(rows) {
            for(var index in rows) {
                rows[index].checked = false;
                map.showdevicemarker(rows[index].id, false);
                map.drawdrivingmarker(rows[index].id, homePoint);
            }
        },
        
        onUncheck: function(rowIndex, rowData) {
            rowData.checked = false;
            map.showdevicemarker(rowData.id, false);
            map.drawdrivingmarker(rowData.id, homePoint);
        }
    });

    $.ajax({
        type: "GET",
        url: HomeAssistantWebAPIUrl + "/api/config?api_password=" + HomeAssistantWebAPIPassword,
        cache: false,
        async: false,
        dataType: "json",
        success: function(data) {
            if(typeof(data) === 'string') {
                data = $.parseJSON(data);
            }
            
            homePoint = {
                'lon': data.longitude, 
                'lat': data.latitude
            };
            map.init(homePoint);
        }
    });

    $("#toolbar_zoomin").click(function() {
        map.zoomin();
        syncToolbarState(['zoomin', 'zoomout']);
    });
    $("#toolbar_zoomout").click(function() {
        map.zoomout();
        syncToolbarState(['zoomin', 'zoomout']);
    });
    $("#toolbar_traffic").click(function() {
        map.traffic();
        syncToolbarState(['traffic']);
    });
    $("#toolbar_homepoint").click(function() {
        map.homepoint();
        syncToolbarState(['homepoint']);
    });
    $("#toolbar_homerange").click(function() {
        map.homerange();
        syncToolbarState(['homerange']);
    });
    $("#toolbar_devicelist").click(function() {
        map.devicelist();
        syncToolbarState(['devicelist']);
    });
});

function getDevice(deviceId) {
    var getDeviceFun = function() {
        $.ajax({
            type: "GET",
            url: HomeAssistantWebAPIUrl + "/api/states/device_tracker." + deviceId + "?api_password=" + HomeAssistantWebAPIPassword,
            cache: false,
            async: true,
            success: function(data) {
                if(null == data) {
                    return;
                }
                if(typeof(data) === 'string') {
                    data = $.parseJSON(data);
                }
                if(null == data.attributes) {
                    return;
                }
             //   var deviceFullId = data.entity_id;
             //   var deviceId = deviceFullId.replace("device_tracker.", "");
             //   var deviceName = unicode2hanzi(data.attributes.friendly_name);
                var deviceName = data.attributes.friendly_name;
                if(null == deviceName) {
                    deviceName = deviceId;
                }
                updateDeviceList(deviceId, {'name': deviceName});
                
                var longitude = data.attributes.longitude;
                var latitude = data.attributes.latitude;
                if(null != longitude && null != latitude) {
                    if(longitude != getDeviceListValue(deviceId, 'lon') && latitude != getDeviceListValue(deviceId, 'lat')) {
                        updateDeviceList(deviceId, {'lon': longitude, 'lat': latitude, 'state': '---'});
                        map.drawdevicemarker(deviceId, deviceName, {'lon': longitude, 'lat': latitude});
                        map.drawdrivingmarker(deviceId, homePoint);
                    }
                }
            }
        });
    };
    getDeviceFun();
    setInterval(getDeviceFun, 10000);
}
    
$(document).on("zoomchange", function() {
    syncToolbarState(['zoomin', 'zoomout']);
});
$(document).on("mapInitFinished", function() {
    syncToolbarState(['zoomin', 'zoomout', 'traffic', 'homepoint', 'homerange', 'devicelist']);
    $.ajax({
        type: "GET",
        url: HomeAssistantWebAPIUrl + "/api/states/group.all_devices?api_password=" + HomeAssistantWebAPIPassword,
        cache: false,
        async: true,
        success: function(data) {
            if(null == data) {
                return;
            }
            if(typeof(data) === 'string') {
                data = $.parseJSON(data);
            }
            if(null == data.attributes) {
                return;
            }
            if(null == data.attributes.entity_id) {
                return;
            }
            for(var index in data.attributes.entity_id) {
                var deviceFulId = data.attributes.entity_id[index];
                var deviceId = deviceFulId.replace("device_tracker.", "");
                insertDeviceList(0, {
                    checked: true,
                    id: deviceId,
                    name: 'loading...',
                    state: '---'
                });
                getDevice(deviceId);
            }
        }
    });
});
$(document).on("updateDrivingTime", function(event, params) {
    updateDeviceList(params['deviceId'], {state: isNaN(params['time']) ? params['time'] : formatSeconds(params['time'])});
});

function syncToolbarState(ids) {
    for(var idIndex in ids) {
        var id = ids[idIndex];
        if(eval("map.is" + id + "();")) {
            $("#toolbar_" + id).attr("src", "images/toolbar_" + id + "_enable.png");
        } else {
            $("#toolbar_" + id).attr("src", "images/toolbar_" + id + "_disable.png");
        }
    }
}

function getDeviceListValue(deviceId, colName) {
    var datas = $("#deviceListGrid").datagrid('getRows');
    for(var index in datas) {
        var data = datas[index];
        if(data.id == deviceId) {
            for(var col in data) {
                if(col == colName) {
                    return data[col];
                }
            }
        }
    }
}

function updateDeviceList(deviceId, newData) {
    var datas = $("#deviceListGrid").datagrid('getRows');
    for(var index in datas) {
        var data = datas[index];
        if(data.id == deviceId) {
            $("#deviceListGrid").datagrid('updateRow', {
                index: index,
                row: newData
            });
        }
    }
}

function insertDeviceList(index, newData) {
    $("#deviceListGrid").datagrid('insertRow',{
        index: index,
        row: newData
    });
}
