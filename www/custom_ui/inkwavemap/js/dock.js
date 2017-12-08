window.onload = function() {
    document.onmousemove = function(ev) {
        var oevent = ev || event;
        var aimg = document.getElementsByTagName('img');
        var odiv = document.getElementById('dock');
        for (var i = 0; i < aimg.length; i++) {
            var x = aimg[i].offsetLeft + aimg[i].offsetWidth / 2;
            var y = aimg[i].offsetTop + odiv.offsetTop + aimg[i].offsetHeight / 2;
            var a = x - oevent.clientX;
            var b = y - oevent.clientY;
            var dis = parseInt(Math.sqrt(a * a + b * b));
            var scale = 1 - dis / 200;
            if (scale < 0.5) {
                scale = 0.5;
            }
            aimg[i].width = scale * 64;

        }
    }
}