define(["jquery", "text!./style.css", "./js/Detector", "./js/three.min", "./js/WebGLglobe"], function($, cssContent, detector, threeJS, WebGLglobe) {
    $("<style>").html(cssContent).appendTo("head");

	return {
        initialProperties: {
            version: 1.1,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 10,
                    qHeight: 500
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
                    max: 20
                },
                measures: {
                    uses: "measures",
                    min: 1,
                    max: 2
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
                $element.append($('<div />').attr("id", id));
            }
            $("#" + id).width($element.width()).height($element.height());

			if(!Detector.webgl){
			    parameters = {parent:id, id:"elder"};
				//Detector.addGetWebGLMessage();
				$element.html("This extension only works inside of a WebGL capable browser<BR> Please open this application in a modern web browser through http://localhost:4848/hub");
			} else {
				var container = document.getElementById(id);
				var options = {imgDir:"./"};

				var globe = new DAT.Globe(container, options);

	            var qData = layout.qHyperCube.qDataPages[0];
	            var data = [], maxVal = 0;
				this.backendApi.eachDataRow(function(rownum, row) {
					data.push(row[1].qNum, row[2].qNum, row[3].qNum);
					if(row[3].qNum > maxVal) { maxVal = row[3].qNum; }
	            });
	            for (i=2; i<data.length; i+=3){
	            	data[i] = data[i]/maxVal/2;
	            }

            	globe.addData(data, {format: 'magnitude', name: "Series 1", animated: false});
	            globe.createPoints();
				globe.animate();

			}
		}
	};

} );

