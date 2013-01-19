
	var context;
	var canvasWidth = 800;
	var canvasHeight = 600;
	
	//var clicksX = new Array();
	//var clicksY = new Array();
	//var clickDrags = new Array();
	//var penColors = new Array();
	//var penSizes = new Array();
	//var texts = new Array();
	//var currentIndex = 0;
	
	var paint;
	//var penStyle = "Pen";
	//var drawingBox = false;
	//var boxStartX = 0;
	//var boxStartY = 0;

	// image layers
	var currentLayerIndex = 0;
	var layers = new Array();

	$(document).ready(function () {

		/* init array of drags, clicks, and pens*/
		//initArrays();

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
			
			// we need to create a new layer to paint to now that we are done with the previous one.
			var layer = createNewLayer(layers[currentLayerIndex].pencolor, layers[currentLayerIndex].pensize, layers[currentLayerIndex].penstyle);
			
			layers.push(layer);
			currentLayerIndex++;
			
			/*
			clicksX.push(new Array());
			clicksY.push(new Array());
			clickDrags.push(new Array());
			penColors.push(penColors[currentIndex]);
			penSizes.push(penSizes[currentIndex]);
			currentIndex++;
			*/
		});
		
		$('#canvas').mouseleave(function(e){
			paint = false;
		});
	
		/* set the pen type */
		setPenStyle('Pen');
	
	});
	
	function initArrays()
	{
		/*
		// init array of drags, clicks, and pens for use
		clickDrags.push(new Array()); // default zero index drag array
		clicksX.push(new Array());
		clicksY.push(new Array());
		penColors.push("#000000");// defualt to BLACK!
		penSizes.push("5");
		*/
	}
	
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
				/*
				if( dragging == false )
				{
			
					if( drawingBox == false )
					{
						//alert("start set to x,y (" + boxStartX +", " + boxStartY + ")");
						
						// we are not drawing the box yet, so record where the box is going to start
						// and set the var so we know we are drawing the box
						drawingBox = true;
						boxStartX = x;
						boxStartY = y;
						boxIndex = currentIndex;
					}
					else
					{
					
						//alert("start: (" + boxStartX +", " + boxStartY + ")\nend: (" + x +", " + y + ")");
					
						// we are in the middle of drawing a box.  We are now done, and have the four
						// cordinates we need to draw our box
						drawingBox = false;
						
						// top //
						
							// first click
							clicksX[currentIndex].push(boxStartX);
							clicksY[currentIndex].push(boxStartY);
							clickDrags[currentIndex].push(true);
							
							// second click
							clicksX[currentIndex].push(boxStartX + (x - boxStartX));
							clicksY[currentIndex].push(boxStartY);
							clickDrags[currentIndex].push(true);
							
						// right side //
						
							// first click
							clicksX[currentIndex].push(boxStartX + (x - boxStartX));
							clicksY[currentIndex].push(boxStartY);
							clickDrags[currentIndex].push(true);
							
							// second click
							clicksX[currentIndex].push(boxStartX + (x - boxStartX));
							clicksY[currentIndex].push(boxStartY + (y - boxStartY));
							clickDrags[currentIndex].push(true);
							
						// bottom //
						
							// first click
							clicksX[currentIndex].push(boxStartX + (x - boxStartX));
							clicksY[currentIndex].push(boxStartY + (y - boxStartY));
							clickDrags[currentIndex].push(true);
							
							// second click
							clicksX[currentIndex].push(boxStartX);
							clicksY[currentIndex].push(boxStartY + (y - boxStartY));
							clickDrags[currentIndex].push(true);
							
						// left side //
						
							// first click
							clicksX[currentIndex].push(boxStartX);
							clicksY[currentIndex].push(boxStartY + (y - boxStartY));
							clickDrags[currentIndex].push(true);
							
							// second click
							clicksX[currentIndex].push(boxStartX);
							clicksY[currentIndex].push(boxStartY);
							clickDrags[currentIndex].push(true);
						
					}
			
				}
				*/
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
			
				/*
				// default to pen
				clicksX[currentIndex].push(x);
				clicksY[currentIndex].push(y);
				clickDrags[currentIndex].push(dragging);
				*/
				
				break;
		}
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
			context.fillStyle = context.strokeStyle = layers[j].pencolor;
			context.font = "bold 16px sans-serif";
			
			// draw text
			context.fillText(layers[j].text.value, layers[j].text.x, layers[j].text.y);
		}
		

		/*
		
		for(var j=0; j < clicksX.length; j++)
		{
			context.strokeStyle = penColors[j];
			
			context.lineWidth = penSizes[j];
		
			for(var i=0; i < clicksX[j].length; i++)
			{		
				context.beginPath();
				
				if(clickDrags[j][i] && i)
				{
					context.moveTo(clicksX[j][i-1], clicksY[j][i-1]);
				}else
				{
					context.moveTo(clicksX[j][i]-1, clicksY[j][i]);
				}
				
				context.lineTo(clicksX[j][i], clicksY[j][i]);
				context.closePath();
				context.stroke();
			}
		}
		
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
	
		// blow away our arrays
		clicksX = new Array();
		clicksY = new Array();
		clickDrags = new Array();
		penColors = new Array();
		
		// reset our index
		currentIndex = 0;
	
		/* we need to blow away our click, drag, and pen arrays first */
		initArrays();
		
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