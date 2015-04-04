/**
 * Created by xuchen509 on 2015/3/19.
 */
/**
 * data structure for color wheel
 */
(function() {
    var pixelPositionMap = {};
    var x;
    var y;
    function ColorWheel(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
    }
    ColorWheel.prototype.getMap = function () {
        this.setMap(this._context);
        return pixelPositionMap;
    };
    ColorWheel.prototype.setMap = function () {
        var imgData = this._context.getImageData(250,50,300,300);
        var data = imgData.data;
        //console.log(data);
        for(var i = 0; i<data.length;i+=4){
            //if(data[i]!= 0){
            //    console.log('yeah');
            //}
            var r = data[i];
            var g = data[i+1];
            var b = data[i+2];
            // set key to rgb value
            var key = 'rgb('+r+','+g+','+b+')';
            var posList = [];
            // get x,y coordinates
            x = (i / 4) % this._canvas.width;
            y = Math.floor((i / 4) / this._canvas.width);
            posList.push(x);
            posList.push(y);
            if (!(key in pixelPositionMap)){
                pixelPositionMap[key] = posList;
            }
        }
    };
    window.ColorWheel = ColorWheel;
}());


function draw_colorWheel(src, callback){
    var image = new Image();
    image.onload = function(){
        //console.log("before: "+map);
        var canvas = document.getElementById('picker');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image,250,50,image.width,image.height);
        var color_wheel = new ColorWheel(canvas);
        var map = color_wheel.getMap();
        callback(map);
    };
    image.src = src;
}


