
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

		// create our unique token
		drawingToken = md5(Math.random().toString())
		
		// create url
		var url = "http://mycodespace.net/projects/quickvis/view.php?token=" + drawingToken;
		
		// insert share link on main page
		$("#sharelink").html('<a href="' + url + '">' + url + '</a>');

		// init our first layer
		var firstlayer = createNewLayer("#000000", "5", "Pen");
		layers.push(firstlayer);

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
		

		$('#canvas').mousedown(function(e){
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;

			paint = true;
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false);
			redraw();
		});
		
		$('#canvas').mousemove(function(e){
			if(paint){
				addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
				redraw();
			}
		});
		
		$('#canvas').mouseup(function(e){
			
			paint = false;			

			var layer = createNewLayer(layers[currentLayerIndex].pencolor, layers[currentLayerIndex].pensize, layers[currentLayerIndex].penstyle);

			layers.push(layer);
			currentLayerIndex++;

		});
		
		$('#canvas').mouseleave(function(e){
			paint = false;
		});
	
		/* set the pen type and size */
		setPenStyle('Pen');
		setPenSize('2');
	
	});
	
	function createNewLayer(pencolor, pensize, penstyle)
	{
		// create our layer
		var layer = {};
		
		// create an array of clicks to work with
		layer.clicks = new Array();
	 	
		layer.pencolor = pencolor;
	 	layer.pensize = pensize;
		layer.penstyle = penstyle;
		
		// what a click looks like
		/*
			var click = {};
			click.x = x;
			click.y = y;
			click.dragging = dragging;
			layer.clicks.push(click);
	 	*/
	
		// create our defautl text region for the layer
	 	layer.text = {};
		layer.text.x = -1;
		layer.text.y = -1;
		layer.text.value = "";
		
		return layer;
	}
	
	function addClick(x, y, dragging)
	{
		switch(layers[currentLayerIndex].penstyle)
		{
			case "Box":
			
				if( dragging == false )
				{
				
					//alert("start set to x,y (" + boxStartX +", " + boxStartY + ")");
					
					if( layers[currentLayerIndex].clicks.length == 0)
						boxIndex = 0;
					else
						boxIndex = layers[currentLayerIndex].clicks.length - 1;
					
					
					// load in 5 clicks that we will update as the user redraws the screen
					for(var i=0; i<5; i++)
					{
						var click = {};
							click.x = x;
							click.y = y;
							click.dragging = true;
						
						layers[currentLayerIndex].clicks.push(click);
					}
					
				}
				else
				{
				
					//alert("start: (" + boxStartX +", " + boxStartY + ")\nend: (" + x +", " + y + ")");
				
					// we are in the middle of drawing a box.  We are now done, and have the four
					// cordinates we need to draw our box
					//drawingBox = true;
					
					// save these so we don't have to pull them each time
					var xStart = layers[currentLayerIndex].clicks[boxIndex].x;
					var yStart = layers[currentLayerIndex].clicks[boxIndex].y;
					
					// top-left
					
					// top-right
					layers[currentLayerIndex].clicks[boxIndex+1].x = xStart + (x - xStart);
					layers[currentLayerIndex].clicks[boxIndex+1].y = yStart;
					
					// bottom-right
					layers[currentLayerIndex].clicks[boxIndex+2].x = xStart + (x - xStart);
					layers[currentLayerIndex].clicks[boxIndex+2].y = yStart + (y - yStart);
					
					// bottom-left
					layers[currentLayerIndex].clicks[boxIndex+3].x = xStart;
					layers[currentLayerIndex].clicks[boxIndex+3].y = yStart + (y - yStart);
					
					// top-left
					layers[currentLayerIndex].clicks[boxIndex+4].x = xStart;
					layers[currentLayerIndex].clicks[boxIndex+4].y = yStart;
					
				}
			
				break;
				
			case "Text":
				
				layers[currentLayerIndex].text.x = x;
				layers[currentLayerIndex].text.y = y;
			
				break;
				
			case "Pen":
			default:
			
				// create the click object
				var click = {};
					click.x = x;
					click.y = y;
					click.dragging = dragging;
					
				// ad the object to the array of other click objects
				layers[currentLayerIndex].clicks.push(click);
			
				break;
		}
		
		// to be updated on the canvas
		curx = x;
		cury = y;
	}
	
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
		
		/*
		context.fillStyle = "#000000";
		context.font = "bold 12px sans-serif";
		var cords = curx + "," + cury;
		context.fillText(cords, 750,590);
		*/
	}
	
	function setPenColor(newPenColor)
	{
		//alert("New Color: " + newPenColor);
	
		layers[currentLayerIndex].pencolor = newPenColor;
		
		//redraw();
	}
	
	function resetImage()
	{
		//
		// TODO: Ask the user if they really want to blow away their image
		//
	
		alert("reset");
	
		// we need to blow away layers, and we should be good
		layers = new Array();
		currentLayerIndex = 0;
		
		// push a default layer to the array of layers
		var firstlayer = createNewLayer("#000000", "5", "Pen");
		layers.push(firstlayer);
			
		// update the canvas object
		redraw();
	}
	
	function saveImage()
	{
		// get the canvas element from the DOM
		var oCanvas = document.getElementById("canvas");
		
		// prompt the user to save it
		Canvas2Image.saveAsPNG(oCanvas);
	}
	
	function launchGitHub()
	{
		url = "https://github.com/thequbit/quickvis";
	
		window.open(url, '_blank');
		window.focus();
	}
	
	function setPenStyle(style)
	{
	
		// reset all borders
		$('#stylepen').css('border', '0');
		$('#stylebox').css('border', '0');
		$('#styletext').css('border', '0');
	
		// figure out which style we are using
		switch(style)
		{
			case 'Box':
				// set the border of the type we are using
				$('#stylebox').css('border', '1px solid Red');
		
				break;
			case 'Text':
				// set the border of the type we are using
				$('#styletext').css('border', '1px solid Red');
				
				// get input
				var textvalue=prompt("Text to place:");
				// set intput as layer text
				layers[currentLayerIndex].text.value = textvalue;
				
				break;
			case 'Pen':
			default:
				// default to pen
				
				// set the border of the type we are using
				$('#stylepen').css('border', '1px solid Red');
				
				break;
		}
		
		// set our global
		layers[currentLayerIndex].penstyle = style;
	}
	
	function setPenSize(size)
	{
		// reset all borders
		$('#pensize1').css('border', '0');
		$('#pensize2').css('border', '0');
		$('#pensize3').css('border', '0');
	
		// figure out which style we are using
		switch(size)
		{
			case '1':
				// set the border of the type we are using
				$('#pensize1').css('border', '1px solid Red');
		
				// set our global
				layers[currentLayerIndex].pensize = "1";
		
				break;
			case '3':
				// set the border of the type we are using
				$('#pensize3').css('border', '1px solid Red');
			
				// set our global
				layers[currentLayerIndex].pensize = "10";
			
				break;
				
			case '2':
			default:
				// default to size 3
				
				// set the border of the type we are using
				$('#pensize2').css('border', '1px solid Red');
				
				// set our global
				layers[currentLayerIndex].pensize = "5";
				
				break;
		}
		
		
	}
	
	
	function shareVis()
	{
		// generate big-o-list of clicks
		
		var count = 0;
		
		for(var i=0;i<layers.length;i++)
		{
			count = count + layers[i].clicks.length;
		}
		
		alert(count);
	}