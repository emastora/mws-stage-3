"use strict";var map,restaurants=void 0,neighborhoods=void 0,cuisines=void 0,markers=[],fetchNeighborhoods=function(){DBHelper.fetchNeighborhoods(function(e,n){e?console.error(e):(self.neighborhoods=n,fillNeighborhoodsHTML())})},fillNeighborhoodsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.neighborhoods,t=document.getElementById("neighborhoods-select");e.forEach(function(e){var n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})},fetchCuisines=function(){DBHelper.fetchCuisines(function(e,n){e?console.error(e):(self.cuisines=n,fillCuisinesHTML())})},fillCuisinesHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.cuisines,t=document.getElementById("cuisines-select");e.forEach(function(e){var n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})};document.addEventListener("DOMContentLoaded",function(e){fetchNeighborhoods(),fetchCuisines(),updateRestaurants()}),window.initMap=function(){self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1})};var updateRestaurants=function(){var e=document.getElementById("cuisines-select"),n=document.getElementById("neighborhoods-select"),t=e.selectedIndex,r=n.selectedIndex,a=e[t].value,o=n[r].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(a,o,function(e,n){e?console.error(e):(resetRestaurants(n),fillRestaurantsHTML())})},resetRestaurants=function(e){self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(function(e){return e.setMap(null)}),self.markers=[],self.restaurants=e},fillRestaurantsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants,n=document.getElementById("restaurants-list");e.forEach(function(e){n.append(createRestaurantHTML(e))}),addMarkersToMap()},createRestaurantHTML=function(e){var n=document.createElement("li"),t=document.createElement("img");t.className="restaurant-img",t.src=DBHelper.imageUrlForRestaurant(e),t.setAttribute("alt","Photo of"+e.name+" restaurant"),n.append(t);var r=document.createElement("h2");r.innerHTML=e.name,n.append(r);var a=document.createElement("p");a.innerHTML=e.neighborhood,n.append(a);var o=document.createElement("p");o.innerHTML=e.address,n.append(o);var s=document.createElement("a");return s.innerHTML="View Details",s.href=DBHelper.urlForRestaurant(e),n.append(s),n},addMarkersToMap=function(){(0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants).forEach(function(e){var n=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(n,"click",function(){window.location.href=n.url}),self.markers.push(n)})};
//# sourceMappingURL=main.js.map
