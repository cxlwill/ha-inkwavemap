function formatSeconds(value) { 
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    if(theTime > 60) {
        theTime1 = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
        if(theTime1 > 60) {
            theTime2 = parseInt(theTime1/60);
            theTime1 = parseInt(theTime1%60);
        }
    }
    var result = "" + parseInt(theTime)+"s";
    if(theTime1 > 0) {
        result = "" + parseInt(theTime1)+"m"+result;
    }
    if(theTime2 > 0) {
        result = "" + parseInt(theTime2)+"h"+result;
    }
    return result;
}

function unicode2hanzi(data) {
    if(data == '') {
        return '';
    }
    
    data = data.split("\\u");
    var str ='';
    for(var i=0;i<data.length;i++) {
        str += String.fromCharCode(parseInt(data[i],16).toString(10));
    }
    return str;
}
