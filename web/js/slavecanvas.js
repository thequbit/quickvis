
	var context;
	var canvasWidth = 800;
	var canvasHeight = 600;
	
	var paint;

	// image layers
	var currentLayerIndex = 0;
	var layers = new Array();

	var drawingBox = false;
	var boxIndex = -1;
	
	var curx = 0;
	var cury = 0;
	
	var drawingToken;

	$(document).ready(function () {

		/* Setup canvas stuff */
		var canvasDiv = document.getElementById('canvasDiv');
		canvas = document.createElement('canvas');
		canvas.setAttribute('width', canvasWidth);
		canvas.setAttribute('height', canvasHeight);
		canvas.setAttribute('id', 'canvas');
		canvasDiv.appendChild(canvas);
		if(typeof G_vmlCanvasManager != 'undefined') {
			canvas = G_vmlCanvasManager.initElement(canvas);
		}
		context = canvas.getContext("2d");
		// set font for text
	
	});
	
	function redraw()
	{
		canvas.width = canvas.width; // Clears the canvas

		context.lineJoin = "round";

		for(var j=0; j < layers.length; j++)
		{
			// set pen color and size
			context.strokeStyle = layers[j].pencolor;
			context.lineWidth = layers[j].pensize;
		
			// draw lines
			for(var i=0; i < layers[j].clicks.length; i++)
			{
				context.beginPath();
				
				if(layers[j].clicks[i].dragging && i)
				{
					context.moveTo(layers[j].clicks[i-1].x, layers[j].clicks[i-1].y);
				}else
				{
					context.moveTo(layers[j].clicks[i].x-1, layers[j].clicks[i].y);
				}
				
				context.lineTo(layers[j].clicks[i].x, layers[j].clicks[i].y);
				context.closePath();
				context.stroke();
			}
			
			// set text color and font
			context.fillStyle = layers[j].pencolor;
			context.font = "bold 16px sans-serif";
			
			// draw text
			context.fillText(layers[j].text.value, layers[j].text.x, layers[j].text.y);
		}
		
	}
	
	function saveImage()
	{
		// get the canvas element from the DOM
		var oCanvas = document.getElementById("canvas");
		
		// prompt the user to save it
		Canvas2Image.saveAsPNG(oCanvas);
	}