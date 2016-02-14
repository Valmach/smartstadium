/**************************************************************************
* AngularJS-stade, v1.0.0; 02.01.2016
*
**************************************************************************/
(function(){

    'use strict';

    angular.module('stade', [])

        .directive('stade', function($compile, $document){
        return {
            restrict: 'E',
            templateUrl: 'svg/stade.svg',


            /*
            * @param scope is an Angular scope object.
            * @param element is the jqLite-wrapped element that this directive matches.
            * @param attrs is a hash object with key-value pairs of normalized attribute names and their corresponding attribute values.
            * @param controller is the directive's required controller instance(s) or its own controller (if any). The exact value depends on the directive's require property.
            * @param transcludeFn is a transclude linking function pre-bound to the correct transclusion scope.
            */
            link: function (scope, element, attrs, controller, transcludeFn) {
                var xmlns = "http://www.w3.org/2000/svg";
                var x = document.querySelectorAll('path');
                for (var i = 0; i < x.length - 1; i++) {
                    var path=x[i];
                    var len = path.getTotalLength();
                    var p=path.getPointAtLength(0);
                    var stp=p.x+","+p.y
                    for(var t=1; t<len; t++){
                         p=path.getPointAtLength(t);
                         stp=stp+" "+p.x+","+p.y;
                    }
                    // var path = this;

                    var polygonElem = document.createElementNS(xmlns, 'polygon');
                    polygonElem.setAttribute('id', 'zone'+i);
                    polygonElem.setAttribute('original-id', path.id);
                    polygonElem.setAttribute('points', stp);
                    polygonElem.style.stroke='#FE642E';
                    polygonElem.setAttribute("fill", '#F2F5A9');
                    polygonElem.style.fill = '#F2F5A9';
                    polygonElem.onclick = function(){
                         var color = "#00FF66";
                         var pathItem = document.getElementById(this.id);
                         pathItem.setAttribute("fill", color);
                         pathItem.style.fill = color;
                         document.getElementById("userZoneSelectedId").value = pathItem.id;
                     };
                      var parent = path.parentElement;
                      parent.appendChild(polygonElem);
                      parent.removeChild(path);

                    }




            } // End of link function




         }

        }) // end of directive stadium

})();


