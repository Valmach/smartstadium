var SQUARE_SIZE = 10;
var ROW_COUNT = 20;
var COL_COUNT = 15;
var START_PIXEL = 5;
var FLOOR_SEPARATOR = 3;
var FLOOR_SEPARATOR_INDEX = ROW_COUNT/FLOOR_SEPARATOR;
var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x; })
                         .y(function(d) { return d.y; })
                         .interpolate("linear");
//The SVG Container
var svgContainer = d3.select("body").append("svg")
                                    .attr("width", 1200)
                                    .attr("height",1200);
var firstSelectedId = null;
var secondSelected = null;

svgContainer.on("click", function(){
    var selected =d3.select(this);

    var coordinates = [0, 0];
    coordinates = d3.mouse(this);
    var x = coordinates[0] - START_PIXEL;
    var y = coordinates[1] - START_PIXEL;


    var maxY = SQUARE_SIZE * ROW_COUNT;
    var maxX = SQUARE_SIZE * COL_COUNT;

    if(firstSelectedId != null && secondSelected != null){
        d3.select(firstSelectedId).attr("fill", "none");
        d3.select(secondSelected).attr("fill", "none");
        firstSelectedId = null;
        secondSelected = null;
    }

    if (y > 0 && y <= maxY && x <= maxX && x > 0){
        var row = 0;
        while(y > 0){
            y = y-SQUARE_SIZE;
            row++;
        }

        var col = 0;
        while(x > 0){
            x = x-SQUARE_SIZE;
            col++;
        }
        var pathId = "#path_"+row+"_"+col;
        if(firstSelectedId == null){
            firstSelectedId = pathId;
            d3.select(pathId).attr("fill", "magenta");
        }else if(secondSelected == null && secondSelected != firstSelectedId){
            secondSelected = pathId;
            d3.select(pathId).attr("fill", "yellow");
        }

    }

});

//The data for our line

function buidGridPaths(xStart, squareSize, rows, cols){

    var path = [];
    var i;
    var j;
    for(i=1;  i<=rows; i++){

        var minY = xStart+squareSize*(i-1);
        var maxY = i*squareSize+xStart;
        for(j=1;  j<=cols; j++){
            var minX = xStart+squareSize*(j-1);
            var maxX = j*squareSize+xStart;
            var positions = [{ "x": minX,   "y": minY},{ "x": maxX,   "y": minY},{ "x": maxX,"y": maxY},{ "x": minX,   "y": maxY}, { "x": minX,   "y": minY}];
            var data = { "row":i, "col":j, "data":lineFunction(positions) };
            path.push(data);
        }

    }


    return path;
}





//This is the accessor function we talked about above
var paths = buidGridPaths(START_PIXEL,SQUARE_SIZE,ROW_COUNT,COL_COUNT);
//The line SVG Path we draw
var floorIndex = 0;
var color = "blue";
var separator = FLOOR_SEPARATOR_INDEX;
for(var nbPath=0; nbPath < paths.length;nbPath++){

    if(paths[nbPath].row > separator){
        separator += FLOOR_SEPARATOR_INDEX;
        switch(color){
            case "blue":
                color="green";
                break;
            case "green":
                color="red";
                break;
        }

    }
    svgContainer.append("path")
        .attr("id", "path_"+paths[nbPath].row+"_"+paths[nbPath].col)
        .attr("d", paths[nbPath].data)
        .attr("stroke", color)
        .attr("stroke-width", 1)
        .attr("fill", "none");

    floorIndex++;
}
