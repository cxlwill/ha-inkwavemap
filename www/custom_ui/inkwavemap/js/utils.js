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

/**
 * 
 * 获取当前时间
 */
function p(s) {
    return s < 10 ? '0' + s: s;
}

//yyyy-mm-dd hh24:mi:ss
function getCurrentDate(){
	var myDate = new Date();
	
	//获取当前年
	var year=myDate.getFullYear();
	//获取当前月
	var month=myDate.getMonth()+1;
	//获取当前日
	var date=myDate.getDate(); 
	var h=myDate.getHours();       //获取当前小时数(0-23)
	var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	var s=myDate.getSeconds();  

	//var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
	var now=year+'-'+p(month)+"-"+p(date);
	return now;
}

//yyyy-mm-dd hh24:mi:ss
function getDatetime(d){
	try
	{
		var myDate = new Date(d);
		//获取当前年
		var year=myDate.getFullYear();
		//获取当前月
		var month=myDate.getMonth()+1;
		//获取当前日
		var date=myDate.getDate(); 
		var h=myDate.getHours();       //获取当前小时数(0-23)
		var m=myDate.getMinutes();     //获取当前分钟数(0-59)
		var s=myDate.getSeconds();  

		//var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
		var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
		return now;
	}
	catch(e)
	{
		return;
	}
}

//yyyy-mm-ddThh24:mi:ss
function getStandardDatetime(d){
	try
	{
		var myDate = new Date(d);
		//获取当前年
		var year=myDate.getFullYear();
		//获取当前月
		var month=myDate.getMonth()+1;
		//获取当前日
		var date=myDate.getDate(); 
		var h=myDate.getHours();       //获取当前小时数(0-23)
		var m=myDate.getMinutes();     //获取当前分钟数(0-59)
		var s=myDate.getSeconds();  

		//var now=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m)+":"+p(s);
		var now=year+'-'+p(month)+"-"+p(date)+"T"+p(h)+':'+p(m)+":"+p(s);
		return now;
	}
	catch(e)
	{
		return;
	}
}