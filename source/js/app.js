/**
 * Service Worker
 */
function registerSW() {
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/sw.js')
             .then(
               function() { console.log("Service Worker Registered"); },
               function(err) { console.log("Service Worker Registration Error: ", err); }
             );
  }
}

window.addEventListener('load', function() {
  registerSW();
});
