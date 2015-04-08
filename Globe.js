// define(["jquery", "text!./style.css", "./js/Detector", "./js/three.min", "./js/WebGLglobe"], function($, cssContent, detector, threeJS, WebGLglobe) {
define(["jquery", "text!./style.css", "./js/Detector", "./js/three.min", "./js/WebGLglobe", "./js/webgl-utils"], function($, cssContent, detector, threeJS) {
    $("<style>").html(cssContent).appendTo("head");

    var target = { x: Math.PI*2/2, y: Math.PI / 6.0 };

	return {
        initialProperties: {
            version: 1.1,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 4,
                    qHeight: 2500
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 3,
                    max: 3
                },
                measures: {
                    uses: "measures",
                    min: 1,
                    max: 1
                },
                sorting: {
                    uses: "sorting"
                },
                settings: {
                    uses: "settings"
                }
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },
		paint: function ($element,layout) {

            //create unique id
            var id = "globe_" + layout.qInfo.qId;
		    //if extension has already been loaded, empty it, if not attach unique id
            if (document.getElementById(id)) {
                $("#" + id).empty();
            } else {
                // $element.append($('<div />').attr("id", "test").text("test")); // for debugging
                $element.append($('<div />').attr("id", id));
            }
            $("#" + id).width($element.width()).height($element.height());

/*
// For WebGL Debugging
var cvs = document.createElement('canvas');
var link = document.createElement('a');
var linkText = document.createTextNode("webgl info");
link.appendChild(linkText);
link.title = "webgl info";
link.href = "http://webglreport.com/";
document.getElementById(id).appendChild(link);
// $element.append($('<canvas />').attr("id", id+"canvas"));
gl = WebGLUtils.setupWebGL(cvs);
// if (!gl) {
//     return;
// }
*/


			if(!Detector.webgl){
			    parameters = {parent:document.getElementById(id), id:"webGlErrorMsg"};
				// Detector.addGetWebGLMessage(parameters);
                var errorText = document.createTextNode("This extension only works inside of a WebGL capable browser and compatible graphics card. Please try opening this application in a compatible web browser (such as Chrome v9+) through http://localhost:4848/hub");
                document.getElementById(id).appendChild(errorText);
				// $element.html("This extension only works inside of a WebGL capable browser<BR> Please open this application in a modern web browser through http://localhost:4848/hub");
			} else {
				var container = document.getElementById(id);
				var options = {imgDir:"./", target: target};

				var globe = new DAT.Globe(container, options);

	            var qData = layout.qHyperCube.qDataPages[0];
	            var data = [], maxVal = 0;
				this.backendApi.eachDataRow(function(rownum, row) {
					data.push(row[1].qNum, row[2].qNum, row[3].qNum);
					if(row[3].qNum > maxVal) { maxVal = row[3].qNum; }
	            });
                // Normalize data
	            for (i=2; i<data.length; i+=3){
	            	data[i] = data[i]/maxVal/2;
	            }
                // console.log("data length",data.length);

            	globe.addData(data, {format: 'magnitude', name: "Series 1", animated: false});
	            globe.createPoints();
				globe.animate();

			}
		}
	};

} );

