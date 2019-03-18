var app = new Framework7({
  root: '#app',
  name: 'Turf Wars',
  routes: [
    {
      name: 'home',
      path: '/',
      url: './index.html'
    },
    {
      name: 'main',
      path: '/main/',
      url: '/pages/main.html'
    }
  ]
});

var $$ = Dom7;

const modal = app.sheet.create({
  content: `<div class="sheet-modal">
              <div class="sheet-modal-inner">
                <div class="list inline-labels">
                  <ul>
                    <li class="item-content item-input">
                      <div class="item-inner">
                        <div class="item-title item-label">Username</div>
                        <div class="item-input-wrap">
                          <input type="text" id="username">
                          <span class="input-clear-button"></span>
                        </div>
                      </div>
                    </li>
                    <li class="item-content item-input">
                      <div class="item-inner">
                        <div class="item-title item-label">Clan</div>
                        <div class="item-input-wrap input-dropdown-wrap">
                          <select id="clanselect">
                            <option value="0">NORTH</option>
                            <option value="1">WEST</option>
                            <option value="2">SOUTH</option>
                          </select>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div class="block">
                  <div class="row">
                    <a class="button button-fill col sheet-close">Cancel</a>
                    <a class="button button-fill col" onclick="changeUser()">Submit</a>
                  </div>
                </div>
              </div>
            </div>`
});

function Marker(owner, position, clan, area) {
  this.owner = owner;
  this.position = position;
  this.clan = clan;
  this.area = area;
}

var mainView = app.views.create('.view-main');

document.addEventListener("deviceready", init, false);

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
    user = "user",
    map,
    markers = [],
    googleMarkers = [],
    loadingTime = 3000;

$$(document).on('page:init', '.page[data-name="main"]', function(e) {
  map = new google.maps.Map(document.getElementById('map'), { zoom: 12, center: { lat: initialLat, lng: initialLng }});
  console.log("In main!");
});

// init();
function init() {
  setTimeout(function() {
    console.log("Going to main!");
  }, loadingTime);
  let geoLocationOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 3000
  };

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

  function geoLocationSuccess(position) {
    console.log("GeoLocation Success");
    let pos = { lat: position.coords.latitude, lng: position.coords.longitude };

    if(pos.lng > westsideLongitude) {
      if(pos.lat > southsideLatitude)
        if(clan === NORTH)
          liberate(clan, pos);
        else {
          markers.push(new Marker(user, pos, clan, NORTH));
          plotLastMarker();
        }
      else
        if(clan === SOUTH)
          liberate(clan, pos);
        else {
          markers.push(new Marker(user, pos, clan, SOUTH));
          plotLastMarker();
        }
    }

    else {
      if(clan === WEST) {
        liberate(clan, pos);
      }
      else {
        markers.push(new Marker(user, pos, clan, WEST));
        plotLastMarker();
      }
    }
  }

  function geoLocationError(e) {
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
}

function changeUser() {
  clan = parseInt($("#clanselect").val());
  user = $("#username").val();
  modal.close();
  console.log("Username: " + user + " Clan: " + clan);
  plotAllMarkers();
}

function changeUserPopup() {
  modal.open();
}

function plotAllMarkers() {
  // CLear all markers!
  for(let i = 0; i < googleMarkers.length; ++i) {
    googleMarkers[i].setMap(null);
  }
  googleMarkers = [];

  // Place new markers!
  for(let i = 0; i < markers.length; ++i) {
    let url;

    if(markers[i].clan !== clan) {
      url = enemyIcon;
    }
    else {
      if(markers[i].owner === user) {
        url = userIcon;
      }
      else {
        url = allyIcon;
      }
    }
    googleMarkers.push(new google.maps.Marker({position: markers[i].position, map: map, icon: { url: url }}));
  }
}

function plotLastMarker() {
  let url,
      lastIndex = markers.length-1;

  if(markers[lastIndex].clan !== clan) {
    url = enemyIcon;
  }
  else {
    if(markers[lastIndex].owner === user) {
      url = userIcon;
    }
    else {
      url = allyIcon;
    }
  }
  googleMarkers.push(new google.maps.Marker({position: markers[lastIndex].position, map: map, icon: { url: url }}));
}
