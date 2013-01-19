
	var context;
	var canvasWidth = 800;
	var canvasHeight = 600;
	
	var clicksX = new Array();
	var clicksY = new Array();
	var currentIndex = 0;
	
	var clickDrags = new Array();
	
	var paint;
	var penColors = new Array();

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
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
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
			clicksX.push(new Array());
			clicksY.push(new Array());
			clickDrags.push(new Array());
			penColors.push(penColors[currentIndex]);
			currentIndex++;
		});
		
		$('#canvas').mouseleave(function(e){
			paint = false;
		});
	
	});
	
	function initArrays()
	{
		/* init array of drags, clicks, and pens for use */
		clickDrags.push(new Array()); // default zero index drag array
		clicksX.push(new Array());
		clicksY.push(new Array());
		penColors.push("#000000");// defualt to BLACK!
	}
	
	function addClick(x, y, dragging)
	{
		clicksX[currentIndex].push(x);
		clicksY[currentIndex].push(y);
		clickDrags[currentIndex].push(dragging);
	}
	
	function redraw()
	{
		canvas.width = canvas.width; // Clears the canvas

		for(var j=0; j < clicksX.length; j++)
		{
			context.strokeStyle = penColors[j];
			context.lineJoin = "round";
			context.lineWidth = 5;
		
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