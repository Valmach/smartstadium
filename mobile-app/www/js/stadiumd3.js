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

               scope.center = {};
               scope.center.x = scope.svgWidth/2;
               scope.center.y = scope.svgHeight/2;

               var xmlns = "http://www.w3.org/2000/svg";
               var gElem = document.createElementNS(xmlns, 'g');

               var pathElem = document.createElementNS(xmlns, 'path');
               var textElem = document.createElementNS(xmlns, 'text');
               pathElem.setAttribute('id', scope.id);

               /*
               if (scope.isSelectedHandler()(scope.id)) {
                 pathElem.setAttribute('class', "selected");
               } else {
                 pathElem.setAttribute('class', "selectable");
               }
               */
               pathElem.setAttribute('d', 'M 100,100 H 200 V 200 H 100 Z');

               /*
               textElem.setAttribute('x', scope.textx);
               textElem.setAttribute('y', scope.texty);
               textElem.textContent=scope.id;
               */

               element.replaceWith(gElem);
               //gElem.appendChild(textElem);
               gElem.appendChild(pathElem);
               /*
               $(pathElem).click(function() {
                  alert("Clicked")
                  //var res = scope.selectDepartementHandler()(scope.id);
                  //if (res) {
                  //  pathElem.setAttribute('class', 'selected');
                  //} else {
                  // pathElem.setAttribute('class', 'selectable');
                  //}
               });
               */

               stadiumUtils.debug(gElem, scope)
               $compile(element.contents())(scope);



              /*
              var startX = 0, startY = 0, x = 0, y = 0;

              element.css({
               position: 'relative',
               border: '1px solid red',
               backgroundColor: 'lightgrey',
               cursor: 'pointer'
              });

              element.on('mousedown', function(event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.pageX - x;
                startY = event.pageY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
              });

              function mousemove(event) {
                y = event.pageY - startY;
                x = event.pageX - startX;
                element.css({
                  top: y + 'px',
                  left:  x + 'px'
                });
              }

              function mouseup() {
                $document.off('mousemove', mousemove);
                $document.off('mouseup', mouseup);
              }
*/


            } // End of link function




         }

        }) // end of directive stadium
        .factory('stadiumUtils', function(){
            return {
              debug: function(gElem, scope) {

                var circleElem = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                circleElem.setAttribute('r', '2');
                circleElem.setAttribute('class', 'debug');
                circleElem.setAttribute('cx', scope.center.x);
                circleElem.setAttribute('cy', scope.center.y);
                gElem.appendChild(circleElem);

                var createLine = function(data){
                   var path1 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                   //<path id="lineAB" d="M 100 350 l 150 -300" stroke="red" stroke-width="3" fill="none" />
                   path1.setAttribute('stroke', 'red');
                   path1.setAttribute('class', 'debug');
                   path1.setAttribute('stroke-width', 3);
                   path1.setAttribute('fill', 'none');
                   path1.setAttribute('d', data);
                   return path1;
                }

                gElem.appendChild(createLine("M 0 10 L "+scope.svgWidth+" 10"));
                gElem.appendChild(createLine("M 0 "+(scope.svgHeight-10)+" L "+scope.svgWidth+" "+(scope.svgHeight-10)+""));
                gElem.appendChild(createLine("M 0 "+(scope.svgHeight-10)+" L "+scope.svgWidth+" "+(scope.svgHeight-10)+""));

                gElem.appendChild(createLine("M 40 0 L 40 "+scope.svgHeight));
                gElem.appendChild(createLine("M "+(scope.svgWidth-40)+" 0 L "+(scope.svgWidth-40)+" "+scope.svgHeight));

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
