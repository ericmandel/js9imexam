/*jslint white: true, vars: true, plusplus: true, nomen: true, unparam: true */
/*globals $, JS9 */ 

"use strict";


(function() {
    var imexam = require("./imexam");

    function histUpdate(im, xreg) {
        var div = this.div;

            var section = imexam.reg2section(xreg);
            var im_2d   = imexam.ndarray(im.raw.data, [im.raw.height, im.raw.width]);
	    var imag;

	    if ( xreg.angle && xreg.angle !== 0 ) {
		imag = imexam.ndops.ndarray([xreg.size.width, xreg.size.height]);

		imexam.ndops.rotate(imag, im_2d, xreg.angle/57.29577951, xreg.pos.y, xreg.pos.x);
	    } else {
		imag    = imexam.ndops.section(im_2d, section);
	    }

            var hist    = imexam.ndops.hist(imag);
            hist.sum    = imexam.ndops.sum(hist.data);

            var n = 0;
            var skip = hist.sum * 0.001;
            var h = 0, i, value;

            $(div).empty();

            var hdata = [];

            for ( i = 0; i < hist.data.shape[0]; i++ ) {
                n += hist.data.get(i);

                if ( n > skip &&  n < hist.sum - skip ) { 
		    value = hist.data.get(h);

		    hdata[h] = [i*hist.width+hist.min, value];
		    h++;
		}
            }

            $.plot(div, [hdata]);
    }

    function histInit() {
	JS9.DecoratePlugin(this);
        $(this.div).append("Create a region to see histogram<br>");
    }

    JS9.RegisterPlugin("ImExam", "Histogram", histInit, {
	    menu: "analysis",

            menuItem: "Histogram",
            winTitle: "Histogram",

            regionchange: histUpdate,
            winDims: [250, 250],
    });

}());
