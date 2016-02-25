var sketch=angular.module('sketch',[]);
sketch.controller('mysketch', ['$scope', function($scope){
	$scope.canvasWH={width:800,height:600}
	var canvas=document.querySelector('#canvas');
	var ctx=canvas.getContext('2d');
	var clearCanvas=function(){
		ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
	}
	var current;
	$scope.tool='line';
	$scope.tools={
		'直线':'line',
		'画圆':'arc',
		'矩形':'rect',
		'橡皮':'erase',
		'铅笔':'pen'
	};
	console.table($scope.tools)
	$scope.csState={fillStyle:'#000000',strokeStyle:'#000000',lineWidth:1,style:'stroke'}
	$scope.settool=function(tool){
        $scope.tool=tool;
	};
	$scope.setStyle=function(s){
       $scope.csState.style=s;
	};
	$scope.newSketch = function(){
		if(current){
			if( confirm('是否保存') ){
				location.href = canvas.toDataURL();		
			}
		}
		clearCanvas();
		current = null;
	}
	$scope.save = function(ev){
		if(current){
			ev.srcElement.href=canvas.toDataURL();
			ev.srcElement.download = 'mypic.png';
		}else{
			alert('空画布');
		}
	}
	
	var setmousemove={

		line:function(e){
			canvas.onmousemove=function(ev){
			clearCanvas();
			if(current){
     		ctx.putImageData(current,0,0);
     	    }
			ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);
     	    ctx.lineTo(ev.offsetX,ev.offsetY);
     	     ctx.stroke();
     	     }
		     },
		arc:function(e){
			canvas.onmousemove=function(ev){
			clearCanvas();
			if(current){
     		ctx.putImageData(current,0,0);
     	    }
			ctx.beginPath();
			var r=Math.abs(ev.offsetX-e.offsetX)
            ctx.arc(e.offsetX,e.offsetY,r,0,Math.PI*2);
            if($scope.csState.style=='fill'){
            	ctx.fill();
            }else{
            	ctx.stroke();
            }
     	    
     	     }
		   },
		 rect:function(e){
            canvas.onmousemove=function(ev){
			clearCanvas();
			if(current){
     		ctx.putImageData(current,0,0);
     	    }
			ctx.beginPath();
			var w=ev.offsetX-e.offsetX;
			var h=ev.offsetY-e.offsetY;
			if($scope.csState.style=='fill'){
     	     ctx.fillRect(e.offsetX-0.5,e.offsetY-0.5,w,h)
			}else{
             ctx.strokeRect(e.offsetX-0.5,e.offsetY-0.5,w,h)
			}
     	    //ctx.stroke();
     	     }
		    },
		    pen:function(e){
		    ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);	
		    canvas.onmousemove=function(ev){
			/*clearCanvas();
			if(current){
     		ctx.putImageData(current,0,0);
     	    }*/
			ctx.lineTo(ev.offsetX,ev.offsetY);
     	     ctx.stroke();
     	     }
		    }, 
		    erase:function(e){

		    canvas.onmousemove=function(ev){
			/*clearCanvas();
			if(current){
     		ctx.putImageData(current,0,0);
     	    }*/
			
     	     ctx.clearRect(ev.offsetX,ev.offsetY,10,10);
     	     }
		    }
     };     
    //$scope.setmousemove='line';
     canvas.onmousedown=function(e){
    	setmousemove[$scope.tool](e);
    	ctx.fillStyle=$scope.csState.fillStyle;
    	ctx.strokeStyle=$scope.csState.strokeStyle;
    	ctx.lineWidth=$scope.csState.lineWidth;
      document.onmouseup=function(){
        canvas.onmousemove=null;
     	canvas.onmouseup=null;
     	current=ctx.getImageData(0,0,$scope.canvasWH.width,$scope.canvasWH.height)
     }  
	}

}])