 
// Multiple column bar chart
function multiColumnBarPlotter(e) {
    // We need to handle all the series simultaneously.
    if (e.seriesIndex !== 0) return;

    var g = e.dygraph;
    var ctx = e.drawingContext;
    var sets = e.allSeriesPoints;
    var y_bottom = e.dygraph.toDomYCoord(0);

    // Find the minimum separation between x-values.
    // This determines the bar width.
    var min_sep = Infinity;
    for (var j = 0; j < sets.length; j++) {
        var points = sets[j];
        for (var i = 1; i < points.length; i++) {
            var sep = points[i].canvasx - points[i - 1].canvasx;
            if (sep < min_sep) min_sep = sep;
        }
    }
    var bar_width = Math.floor(2.0 / 3 * min_sep);

    var fillColors = [];
    var strokeColors = g.getColors();
    for (var i = 0; i < strokeColors.length; i++) {
        var color = new RGBColorParser(strokeColors[i]);
        color.r = Math.floor((255 + color.r) / 2);
        color.g = Math.floor((255 + color.g) / 2);
        color.b = Math.floor((255 + color.b) / 2);
        fillColors.push(color.toRGB());
    }

    for (var j = 0; j < sets.length; j++) {
        ctx.fillStyle = fillColors[j];
        ctx.strokeStyle = strokeColors[j];
        for (var i = 0; i < sets[j].length; i++) {
            var p = sets[j][i];
            var center_x = p.canvasx;
            var x_left = center_x - (bar_width / 2) * (1 - j / (sets.length - 1));

            ctx.fillRect(x_left, p.canvasy,
            bar_width / sets.length, y_bottom - p.canvasy);

            ctx.strokeRect(x_left, p.canvasy,
            bar_width / sets.length, y_bottom - p.canvasy);
        }
    }
}


// This function draws bars for a single series. See
// multiColumnBarPlotter below for a plotter which can draw multi-series
// bar charts.
function barChartPlotter(e) {
    var ctx = e.drawingContext;
    var points = e.points;
    var y_bottom = e.dygraph.toDomYCoord(0);

    // The RGBColorParser class is provided by rgbcolor.js, which is
    // packed in with dygraphs.
    var color = new RGBColorParser(e.color);
    color.r = Math.floor((255 + color.r) / 2);
    color.g = Math.floor((255 + color.g) / 2);
    color.b = Math.floor((255 + color.b) / 2);
    ctx.fillStyle = color.toRGB();

    // Find the minimum separation between x-values.
    // This determines the bar width.
    var min_sep = Infinity;
    for (var i = 1; i < points.length; i++) {
        var sep = points[i].canvasx - points[i - 1].canvasx;
        if (sep < min_sep) min_sep = sep;
    }
    var bar_width = Math.floor(2.0 / 3 * min_sep);

    // Do the actual plotting.
    for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var center_x = p.canvasx;

        ctx.fillRect(center_x - bar_width / 2, p.canvasy,
        bar_width, y_bottom - p.canvasy);

        ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
        bar_width, y_bottom - p.canvasy);
    }
}                 



function candlePlotter2(e){// (e,iO,iC,iH,iL) {
    var setCount = e.seriesCount;

    var prices = [];
    var price;
    var sets = e.allSeriesPoints;
    for (var p = 0; p < sets[0].length; p++) {
        price = {
            open: sets[0][p].yval,
            close: sets[1][p].yval,
            high: sets[2][p].yval,
            low: sets[3][p].yval,
            openY: sets[0][p].y,
            closeY: sets[1][p].y,
            highY: sets[2][p].y,
            lowY: sets[3][p].y
        };
        prices.push(price);
    }                

    var min_sep = Infinity;
    for (var j = 0; j < sets.length; j++) {
        var points = sets[j];
        for (var i = 1; i < points.length; i++) {
            var sep = points[i].canvasx - points[i - 1].canvasx;
            if (sep < min_sep) min_sep = sep;
        }
    }
    var BAR_WIDTH2 = Math.floor(3 / 4 * min_sep);                        

    var area = e.plotArea;
    var ctx = e.drawingContext;
    ctx.strokeStyle = '#202020';
    ctx.lineWidth = 0.7;

    for (p = 0; p < prices.length; p++) {
        ctx.beginPath();

        price = prices[p];
        var topY = area.h * price.highY + area.y;
        var bottomY = area.h * price.lowY + area.y;
        var centerX = area.x + sets[0][p].x * area.w;
        ctx.moveTo(centerX, topY);
        ctx.lineTo(centerX, bottomY);
        ctx.closePath();
        ctx.stroke();
        var bodyY;
        if (price.open > price.close) {
            ctx.fillStyle = '#E74C3C';//'rgba(244,44,44,1)';
            bodyY = area.h * price.openY + area.y;

//         ctx.fillRect(center_x - bar_width / 2, p.canvasy,
//         bar_width, y_bottom - p.canvasy);
// 
//         ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
//         bar_width, y_bottom - p.canvasy);


        } else {
//             ctx.fillStyle = 'rgba(44,244,44,1.0)';
            ctx.fillStyle = '#2ecc71';//'rgba(1,224,1,1)';
            bodyY = area.h * price.closeY + area.y;
        }
        var bodyHeight = area.h * Math.abs(price.openY - price.closeY);
        ctx.fillRect(centerX - BAR_WIDTH2 / 2, bodyY, BAR_WIDTH2, bodyHeight);

        ctx.lineWidth = 0.5;
        ctx.strokeStyle = '#202020'
        ctx.strokeRect(centerX - BAR_WIDTH2 / 2, bodyY, BAR_WIDTH2, bodyHeight);
    } 
}

 