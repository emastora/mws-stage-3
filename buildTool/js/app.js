"use strict";function registerSW(){"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").then(function(){console.log("Service Worker Registered")},function(e){console.log("Service Worker Registration Error: ",e)})}window.addEventListener("load",function(){registerSW()});
//# sourceMappingURL=app.js.map
