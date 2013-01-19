
	var context;
	var canvasWidth = 800;
	var canvasHeight = 600;
	
	var clicksX = new Array();
	var clicksY = new Array();
	var clickDrags = new Array();
	var penColors = new Array();
	var penSizes = new Array();
	//var texts = new Array();
	var currentIndex = 0;
	
	var paint;
	var penStyle = "Pen";
	var drawingBox = false;
	var boxStartX = 0;
	var boxStartY = 0;

	$(document).ready(function () {

		/* init array of drags, clicks, and pens*/
		initArrays();

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
			
			//addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
			
			paint = false;
			clicksX.push(new Array());
			clicksY.push(new Array());
			clickDrags.push(new Array());
			penColors.push(penColors[currentIndex]);
			penSizes.push(penSizes[currentIndex]);
			currentIndex++;
		});
		
		$('#canvas').mouseleave(function(e){
			paint = false;
		});
	
		/* set the pen type */
		setPenStyle('Pen');
	
	});
	
	function initArrays()
	{
		/* init array of drags, clicks, and pens for use */
		clickDrags.push(new Array()); // default zero index drag array
		clicksX.push(new Array());
		clicksY.push(new Array());
		penColors.push("#000000");// defualt to BLACK!
		penSizes.push("5");
	}
	
	function addClick(x, y, dragging)
	{
		switch(penStyle)
		{
			case "Box":
			
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
			
				break;
				
			case "Text":
				if( dragging == false )
				{
					alert("Not yet implemented");
				}
				break;
				
			case "Pen":
			default:
			
				// default to pen
				clicksX[currentIndex].push(x);
				clicksY[currentIndex].push(y);
				clickDrags[currentIndex].push(dragging);
			
				break;
		}
	}
	
	function redraw()
	{
		canvas.width = canvas.width; // Clears the canvas

		for(var j=0; j < clicksX.length; j++)
		{
			context.strokeStyle = penColors[j];
			context.lineJoin = "round";
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
		
		
	}
	
	function setPenColor(newPenColor)
	{
		//alert("New Color: " + newPenColor);
	
		penColors[currentIndex] = newPenColor;
		
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
				
				break;
			case 'Pen':
			default:
				// default to pen
				
				// set the border of the type we are using
				$('#stylepen').css('border', '1px solid Red');
				
				break;
		}
		
		// set our global
		penStyle = style;
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
				penSizes[currentIndex] = "1";
		
				break;
			case '3':
				// set the border of the type we are using
				$('#pensize3').css('border', '1px solid Red');
			
				// set our global
				penSizes[currentIndex] = "10";
			
				break;
				
			case '2':
			default:
				// default to size 3
				
				// set the border of the type we are using
				$('#pensize2').css('border', '1px solid Red');
				
				// set our global
			penSizes[currentIndex] = "5";
				
				break;
		}
		
		
	}