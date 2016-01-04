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
              gridRow: '@gridRow',      //path element data, [required]
              gridCol: '@gridCol',
              level: '@level',
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
                var createPath = function(data, id, lineColor, fillColor){
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

                   path1.setAttribute('id', id);
                   path1.setAttribute('d', data);



                   return path1;
                };

                var createCircle = function(cx, cy, fillColor){
                  var circleElem = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                  circleElem.setAttribute('r', '2');
                  circleElem.setAttribute('class', 'debug');
                  circleElem.setAttribute('cx', cx);
                  circleElem.setAttribute('cy', cy);

                  if(fillColor){
                   circleElem.setAttribute('fill', fillColor);
                  }else{
                   circleElem.setAttribute('fill', 'black');
                  }
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
                      var currentId = "path_"+(currentRow+1)+"_"+(currentCol+1);
                      var data = "";
                      var x1,y1,x2,y2;
                      if(currentRow == 0 && currentCol == 0){
                         data = "M "+xMin+"," +yMax;
                         data += " L "+xMax+"," +yMax;
                         data += " L "+xMax+"," +yMin;
                         x1 =  xMin;
                         y1 =  yMin;// + (heigth/12);
                         x2 =  xMin;// + (width/12);
                         y2 =  yMin;
                         data += " C "+x1+"," +y1+ " "+x2+"," +y2+ " "+xMin+"," +yMax;
                         gElem.appendChild(createPath(data, currentId));
                      }else if (currentRow == 0 && currentCol == (scope.gridCol-1)){
                        data = "M "+xMin+"," +yMin;
                        data += " L "+xMin+"," +yMax;
                        data += " L "+xMax+"," +yMax;
                        x1 =  xMax;
                        y1 =  yMin;// + (heigth/12);
                        x2 =  xMax;// + (width/12);
                        y2 =  yMin;
                        data += " C "+x1+"," +y1+ " "+x2+"," +y2+ " "+xMin+"," +yMin;
                      }else if (currentRow == (scope.gridRow-1) && currentCol == 0){
                        data = "M "+xMin+"," +yMin;
                        data += " L "+xMax+"," +yMin;
                        data += " L "+xMax+"," +yMax;
                        x1 =  xMin;
                        y1 =  yMax;// + (heigth/12);
                        x2 =  xMin;// + (width/12);
                        y2 =  yMax;
                        data += " C "+x1+"," +y1+ " "+x2+"," +y2+ " "+xMin+"," +yMin;
                      }else if (currentRow == (scope.gridRow-1) && currentCol == (scope.gridCol-1)){
                        data = "M "+xMin+"," +yMin;
                        data += " L "+xMax+"," +yMin;
                        x1 =  xMax;
                        y1 =  yMax;// + (heigth/12);
                        x2 =  xMax;// + (width/12);
                        y2 =  yMax;
                        data += " C "+x1+"," +y1+ " "+x2+"," +y2+ " "+xMin+"," +yMax;
                        data += " L "+xMin+"," +yMin;

                      }else{
                       data = "M "+xMin+"," +yMin;
                       data += " L "+xMin+"," +yMax;
                       data += " L "+xMax+"," +yMax;
                       data += " L "+xMax+"," +yMin;
                       data += " L "+xMin+"," +yMin;
                      }
                      gElem.appendChild(createPath(data, currentId));
                   }
                }

                 var xStart = scope.center.x - (width/2);
                 var yStart = scope.center.y - (heigth);

                 var x1,y1,x2,y2;
                 data = "M "+xStart+", "+yStart;
                 //Line
                 xStart = xStart+width;
                 yStart = yStart;
                 data += " L "+xStart+"," +yStart;

                 // Curve
                 x1 =  xStart+(width/2);
                 y1 =  yStart;
                 x2 =  x1;
                 y2 =  y1;
                 xStart = xStart+(width/2);
                 yStart = yStart+(heigth/2);
                 data += " C "+x1+"," +y1+ " "+x2+"," +y2+ " "+xStart+"," +yStart;
                 //data += " L "+xStart+"," +yStart;

                 // Line
                 xStart = xStart;
                 yStart = yStart+heigth;
                 data += " L "+xStart+"," +yStart;

                 // Curve
                  x1 =  xStart;
                  y1 =  yStart+(heigth/2);
                  x2 =  x1;
                  y2 =  y1;
                  xStart = xStart-(width/2);
                  yStart = yStart+(heigth/2);
                  data += " C "+x1+"," +y1+ " "+x2+"," +y2+ " "+xStart+"," +yStart;

                 //data += " L "+xStart+"," +yStart;

                 // Line
                 xStart = xStart-width;
                 yStart = yStart;
                 data += " L "+xStart+"," +yStart;

                 // Curve
                 x1 =  xStart-(width/2);
                 y1 =  yStart;
                 x2 =  x1;
                 y2 =  y1;
                 xStart = xStart-(width/2);
                 yStart = yStart-(heigth/2);
                 //data += " L "+xStart+"," +yStart;
                 data += " C "+x1+"," +y1+ " "+x2+"," +y2+ " "+xStart+"," +yStart;


                 // Line
                 xStart = xStart;
                 yStart = yStart-(heigth)
                 data += " L "+xStart+"," +yStart;

                 // Curve
                 x1 =  xStart;
                 y1 =  scope.center.y - (heigth);
                 x2 =  x1;
                 y2 =  y1;
                 xStart = scope.center.x - (width/2);
                 yStart = scope.center.y - (heigth);

                 data += " C "+x1+"," +y1+ " "+x2+"," +y2+ " "+xStart+"," +yStart;
                 //data += " L "+xStart+"," +yStart;
                gElem.appendChild(createPath(data, 'center', 'green', 'orange'));

                gElem.appendChild(createCircle(scope.center.x,scope.center.y));

              }
            };// End of factory stadiumUtils
        });
})();
