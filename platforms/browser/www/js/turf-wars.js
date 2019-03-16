var app = new Framework7({
  root: '#app',
  name: 'Turf Wars',
  routes: [
    {
      path: '/',
      url: 'index.html'
    }
  ]
});

var mainView = app.views.create('.view-main');

document.addEventListener("deviceready", init, false);
// init();
function init() {
  $("#take-photo-button").click(function() {
    takePicture();
  });

  let geoLocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 3000
  };

  var captureSuccess = function(mediaFiles) {
    console.log("Hello");
  }

  var captureError = function(e) {

  }

  navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError, geoLocationOptions);
  navigator.device.capture.captureImage(captureSuccess, captureError, { limit: 2 });

  function geoLocationSuccess(position) {
    alert(`latitude: ${position.coords.latitude}\n
          longitude: ${position.coords.longitude}`);
  }

  function geoLocationError(e) {
    console.error(e);
  }

  function takePicture() {
    let cameraOptions = {
      quality: 100,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.PNG,
      cameraDirection: Camera.Direction.BACK
    }

    navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions)
  }


  function captureSuccess(mediaFiles) {
    console.log("Hello");
  }

  function captureError(e) {

  }
}
