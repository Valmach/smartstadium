/**************************************************************************
* AngularJS-stadium, v1.0.0; 02.01.2016
*
**************************************************************************/
(function(){

    'use strict';

    angular.module('stadium', [])

        .directive('stadium', function(stadiumUtils, $compile, $document){
        return {
            restrict: 'E',

            scope: {
              id: '@',      //path element id, [required]
              row: '@',      //path element data, [required]
              col: '@',
              gridRow: '@gridRow',      //path element data, [required]
              gridCol: '@gridCol',

              level: '@',
              svgWidth: '@svgWidth',      //path element data, [required]
              svgHeight: '@svgHeight',      //path element data, [required]
            },


            /*
            * @param scope is an Angular scope object.
            * @param element is the jqLite-wrapped element that this directive matches.
            * @param attrs is a hash object with key-value pairs of normalized attribute names and their corresponding attribute values.
            * @param controller is the directive's required controller instance(s) or its own controller (if any). The exact value depends on the directive's require property.
            * @param transcludeFn is a transclude linking function pre-bound to the correct transclusion scope.
            */
            link: function (scope, element, attrs, controller, transcludeFn) {

               scope.bx = {};
               scope.bx.min = 0;
               scope.bx.max = scope.svgWidth - scope.bx.min;
               scope.bx.line = scope.bx.max + scope.bx.min;
               // Distance entre le premier point et le centre

               scope.by = {};
               scope.by.min = 0;
               scope.by.max = scope.svgHeight - scope.by.min;
               scope.by.line = scope.by.max + scope.by.min;

               scope.center = {};
               scope.center.x = scope.svgWidth/2;
               scope.center.y = scope.svgHeight/2;
               scope.center.xSquare = Math.round(scope.svgWidth/10);
               scope.center.ySquare = Math.round(scope.svgHeight/10);

               scope.rect = {};
               scope.rect.w = Math.round((scope.center.x - scope.center.xSquare) / scope.gridRow) * 2;
               scope.rect.h = Math.round((scope.center.y - scope.center.ySquare) / scope.gridCol) * 2;

               //Pythagore :-)
               var a = scope.center.x - scope.bx.min;
               var b = scope.center.y - scope.by.min;
               var pythagore = a*a + b*b;

               var distance = Math.round(Math.sqrt(pythagore));
               scope.center.distance = distance;

               var xmlns = "http://www.w3.org/2000/svg";
               var gElem = document.createElementNS(xmlns, 'g');

               var pathElem = document.createElementNS(xmlns, 'path');
               pathElem.setAttribute('id', scope.id);
               //pathElem.setAttribute('d', 'M 100,100 H 200 V 200 H 100 Z');


               element.replaceWith(gElem);

               gElem.appendChild(pathElem);

               stadiumUtils.debug(gElem, scope)
               $compile(element.contents())(scope);



            } // End of link function




         }

        }) // end of directive stadium
        .factory('stadiumUtils', function(){
            return {
              debug: function(gElem, scope) {
                var createPath = function(data, lineColor, fillColor){
                   var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                   //<path id="lineAB" d="M 100 350 l 150 -300" stroke="red" stroke-width="3" fill="none" />
                   if(lineColor){
                    path1.setAttribute('stroke', lineColor);
                   }else{
                    path1.setAttribute('stroke', 'red');
                   }
                   path1.setAttribute('class', 'debug');
                   path1.setAttribute('stroke-width', 2);
                   if(fillColor){
                    path1.setAttribute('fill', fillColor);
                   }else{
                    path1.setAttribute('fill', 'none');
                   }
                   path1.setAttribute('d', data);



                   return path1;
                };

                var createCircle = function(cx, cy){
                  var circleElem = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                  circleElem.setAttribute('r', '2');
                  circleElem.setAttribute('class', 'debug');
                  circleElem.setAttribute('cx', cx);
                  circleElem.setAttribute('cy', cy);
                  return circleElem;
                };


                var width  = Math.round(scope.svgWidth/scope.gridCol);
                var heigth = Math.round(scope.svgHeight/scope.gridRow);
                for(var currentRow=0; currentRow< scope.gridRow; currentRow++){
                   var yMin = currentRow * heigth;
                   var yMax = yMin + heigth;
                   for(var currentCol=0; currentCol< scope.gridCol; currentCol++){
                      var xMin = currentCol * width;
                      var xMax = xMin + width;

                      var data = "";
                      if(currentRow == 0 && currentCol == 0){
                         data = "M "+xMin+"," +yMax;
                         data += " L "+xMax+"," +yMax;
                         data += " L "+xMax+"," +yMin;
                         data += " L "+xMin+"," +yMax;
                         gElem.appendChild(createPath(data, 'blue', 'yellow'));
                      }else if (currentRow == 0 && currentCol == (scope.gridCol-1)){
                        data = "M "+xMin+"," +yMin;
                        data += " L "+xMin+"," +yMax;
                        data += " L "+xMax+"," +yMax;
                        data += " L "+xMin+"," +yMin;
                        gElem.appendChild(createPath(data, 'blue', 'yellow'));
                      }else if (currentRow == (scope.gridRow-1) && currentCol == 0){
                        data = "M "+xMin+"," +yMin;
                        data += " L "+xMax+"," +yMin;
                        data += " L "+xMax+"," +yMax;
                        data += " L "+xMin+"," +yMin;
                        gElem.appendChild(createPath(data, 'blue', 'yellow'));
                      }else if (currentRow == (scope.gridRow-1) && currentCol == (scope.gridCol-1)){
                        data = "M "+xMin+"," +yMin;
                        data += " L "+xMax+"," +yMin;
                        data += " L "+xMin+"," +yMax;
                        data += " L "+xMin+"," +yMin;
                        gElem.appendChild(createPath(data, 'blue', 'yellow'));
                      }else{
                       data = "M "+xMin+"," +yMin;
                       data += " L "+xMin+"," +yMax;
                       data += " L "+xMax+"," +yMax;
                       data += " L "+xMax+"," +yMin;
                       data += " L "+xMin+"," +yMin;
                       gElem.appendChild(createPath(data));
                      }

                   }
                }

                var xStart = scope.center.x - (width/2);
                var yStart = scope.center.y - (heigth);

                 data = "M "+xStart+", "+yStart;
                 xStart = xStart+width;
                 yStart = yStart;
                 data += " L "+xStart+"," +yStart;
                 xStart = xStart+(width/2);
                 yStart = yStart+(heigth/2);
                 data += " L "+xStart+"," +yStart;
                 xStart = xStart;
                 yStart = yStart+heigth;
                 data += " L "+xStart+"," +yStart;
                 xStart = xStart-(width/2);
                 yStart = yStart+(heigth/2);
                 data += " L "+xStart+"," +yStart;
                 xStart = xStart-width;
                 yStart = yStart;
                 data += " L "+xStart+"," +yStart;
                 xStart = xStart-(width/2);
                 yStart = yStart-(heigth/2)
                 data += " L "+xStart+"," +yStart;
                 xStart = xStart;
                 yStart = yStart-(heigth)
                 data += " L "+xStart+"," +yStart;
                 // End
                 xStart = scope.center.x - (width/2);
                 yStart = scope.center.y - (heigth);
                 data += " L "+xStart+"," +yStart;

                gElem.appendChild(createPath(data, 'green', 'orange'));

                gElem.appendChild(createCircle(scope.center.x,scope.center.y));
/*
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
*/

              },
              debug2: function(gElem, scope) {


                var createCircle = function(cx, cy){
                  var circleElem = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                  circleElem.setAttribute('r', '2');
                  circleElem.setAttribute('class', 'debug');
                  circleElem.setAttribute('cx', cx);
                  circleElem.setAttribute('cy', cy);
                  return circleElem;
                };

                var createLine = function(data){
                   var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                   //<path id="lineAB" d="M 100 350 l 150 -300" stroke="red" stroke-width="3" fill="none" />
                   path1.setAttribute('stroke', 'red');
                   path1.setAttribute('class', 'debug');
                   path1.setAttribute('stroke-width', 3);
                   path1.setAttribute('fill', 'none');
                   path1.setAttribute('d', data);
                   return path1;
                };

                gElem.appendChild(createCircle(scope.center.x,scope.center.y));

                for(var i=1; i<= scope.gridRow; i++){

                   var p = {};
                   p.x = scope.rect.w * i;
                   for(var j=1; j<= scope.gridCol; j++){
                    p.y = scope.rect.h * j;

                    gElem.appendChild(createCircle(p.x, p.y) );

                  }
                }

                gElem.appendChild(createLine("M "+scope.bx.min+" "+scope.by.min+" H "+(scope.svgWidth-scope.bx.min)));
                gElem.appendChild(createLine("M "+scope.bx.min+" "+(scope.svgHeight-scope.by.min)+" H "+(scope.svgWidth-scope.bx.min)+""));

                gElem.appendChild(createLine("M "+scope.bx.min+" "+scope.by.min+" V "+(scope.svgHeight-scope.by.min)));
                gElem.appendChild(createLine("M "+(scope.svgWidth-scope.bx.min)+" "+scope.by.min+" V "+(scope.svgHeight-scope.by.min) ));

                return true;

              },
              generatePath: function(rowIndex, colIndex, row, col, svgWidth, svgHeight) {
                var pathData;
                return pathData;
              },

                testFunction: function(func, wait, immediate) {
                    var timeout;
                    return function() {
                        var context = this, args = arguments;
                        var later = function() {
                            timeout = null;
                            if (!immediate) func.apply(context, args);
                        };
                        var callNow = immediate && !timeout;
                        clearTimeout(timeout);
                        timeout = setTimeout(later, wait);
                        if (callNow) func.apply(context, args);
                    };
                } // End of function testFunction
                , testFunction2: function(dst){
                    var me = this;

                    return dst;
                } // End of function testFunction2

            };// End of factory stadiumUtils
        });
})();
