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

function Marker(owner, position, clan, area) {
  this.owner = owner;
  this.position = position;
  this.clan = clan;
  this.area = area;
}

var mainView = app.views.create('.view-main');

var westsideLongitude = -112.859390, // Greater than is east, less than is west
    southsideLatitude = 49.698185, // Greater than is north, less than is south
    initialLat = 49.689762,
    initialLng = -112.841782,
    userIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
    allyIcon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    enemyIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
    NORTH = 0,
    WEST = 1,
    SOUTH = 2,
    clan = NORTH,
    user = "user";


document.addEventListener("deviceready", init, false);
// init();
function init() {
  let map,
      markers = [],
      googleMarkers = [];


  map = new google.maps.Map(document.getElementById('map'), { zoom: 12, center: { lat: initialLat, lng: initialLng }});

  $("#take-photo-button").click(function() {
    takePicture();
  });

  let geoLocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 3000
  };

  function geoLocationSuccess(position) {
    console.log("GeoLocation Success");
    let pos = { lat: position.coords.latitude, lng: position.coords.longitude },
        markerIcon;

    if(pos.lng > westsideLongitude) {
      if(pos.lat > southsideLatitude)
        if(clan === NORTH) 
          liberate(clan, pos);
        else
          markers.push(new Marker(user, pos, clan, NORTH));
      else
        if(clan === SOUTH) 
          liberate(clan, pos);
        else
          markers.push(new Marker(user, pos, clan, SOUTH));
    }

    else {
      if(clan === WEST) {
        liberate(clan, pos);
      }
      else
        markers.push(new Marker(user, pos, clan, WEST));
    }

    plotAllMarkers();
  }

  function geoLocationError(e) {
    console.error(e);
  }

  function takePicture() {
    let cameraOptions = {
      quality: 100,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.PNG,
      cameraDirection: Camera.Direction.BACK
    }

    navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
  }


  function cameraSuccess(imageData) {
    console.log("Camera Success!");
    navigator.geolocation.getCurrentPosition(geoLocationSuccess, geoLocationError, geoLocationOptions);

  }

  function cameraError(e) {
    console.error(e);
  }

  function liberate(clan, position) {
    let indexesToRemove = [],
        removeDelay = 5.0;

    for(let i = 0; i < markers.length; ++i) {
      console.log(Math.abs(markers[i].position.lat - position.lat));
      if(Math.abs(element.position.lat - position.lat) < 0.0001) {
        indexesToRemove.push(i);
        let cpy = markers[i];
        markers.splice(i, 1, new Marker);
      }
    };
  }

  function plotAllMarkers() {
    // CLear all markers!
    for(let i = 0; i < googleMarkers.length; ++i) {
      googleMarkers[i].setMap(null);
    }
    googleMarkers = [];

    for(let i = 0; i < markers.length; ++i) {
      googleMarkers.push(new google.maps.Marker({position: markers[i].position, map: map}));
    }
  }
}
