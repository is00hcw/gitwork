https://www.script-tutorials.com/html5-color-picker-canvas/

// create canvas and context objects
var canvas = document.getElementById('picker');
var ctx = canvas.getContext('2d');

// drawing active image
var image = new Image();
image.onload = function () {
	ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
}


var canvasOffset = $(canvas).offset();
var canvasX = Math.floor(e.pageX - canvasOffset.left);
var canvasY = Math.floor(e.pageY - canvasOffset.top);

// get current pixel
var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
var pixel = imageData.data;

// update preview color
var pixelColor = "rgb("+pixel[0]+", "+pixel[1]+", "+pixel[2]+")";
$('.preview').css('backgroundColor', pixelColor);

var dColor = pixel[2] + 256 * pixel[1] + 65536 * pixel[0];
$('#hexVal').val('#' + ('0000' + dColor.toString(16)).substr(-6));