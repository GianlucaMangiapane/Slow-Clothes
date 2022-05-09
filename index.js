
const map = L.map('map').setView([40.7128, -74.0060], 12);

L.tileLayer('https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=41b07724991442f8b7f0cf7354c4605c', {
  attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  apikey: '<41b07724991442f8b7f0cf7354c4605c>',
  maxZoom: 25,
}).addTo(map);


// load textile API
let textileLayer = null;
const loadTextiles = function () {
  fetch('https://data.cityofnewyork.us/resource/qnjm-wvu5.geojson')
    .then(resp => resp.json())
    .then(data => {
      textileLayer = L.geoJSON(data, {
        style: {
          weight: 6,
          opacity: 0,
        },
      });
      textileLayer.bindTooltip(l => l.feature.properties['.ntaname'], { sticky: true });
      textileLayer.addTo(map);
    });
};

loadTextiles();

/*
  We're going to add a marker for the user's position on the map. However, we
  won't know the actual position when we're not tracking it. To communicate to
  the user whether the marker represents their actual position, we will style
  the marker differently based on whether we are tracking their position or not.
*/


// Geolocator
const trackingStyle = { color: 'green' };
const nonTrackingStyle = { color: 'red' };

const positionMarker = L.circleMarker(
  [40.7128, -74.0060],
  nonTrackingStyle,
).addTo(map);
let trackingID = null;

const handlePositionUpdated = function (position) {
  // Move the position marker to the
  const latlng = [position.coords.latitude, position.coords.longitude];
  positionMarker.setLatLng(latlng);
  map.panTo(latlng, 11);

  // Now that we know the user's position, update the marker style.
  positionMarker.setStyle(trackingStyle);

  console.log(position);
};

const trackingButton = document.querySelector('#tracking-button');
trackingButton.addEventListener('click', () => {
  if (trackingID === null) {
    startTracking();
  } else {
    stopTracking();
  }
});

const startTracking = function () {
  // Start tracking the position.
  console.log('Starting to track position...');
  trackingID = navigator.geolocation.watchPosition(handlePositionUpdated);

  // Update the button text.
  trackingButton.innerHTML = 'Stop Tracking Me.';
};

const stopTracking = function () {
  // Stop tracking the position.
  navigator.geolocation.clearWatch(trackingID);
  trackingID = null;
  console.log('No longer tracking position...');

  // Update the marker style.
  positionMarker.setStyle(nonTrackingStyle);

  // Update the button text.
  trackingButton.innerHTML = 'Track Me!';
};


// donation item with the value
const donationItemOptions = [
  {
    name: 'CHOOSE DONATION ITEM',
    value: 0,
  },
  {
    name: 'Jacket',
    value: 17.00,
  },
  {
    name: 'Overcoat',
    value: 39.00,
  },
  {
    name: 'Pajamas',
    value: 5.00,
  },
  {
    name: 'Raincoat',
    value: 13.00,
  },
  {
    name: 'Button-Up Shirt',
    value: 17.50,
  },
  {
    name: 'Pair of Shoes',
    value: 15.00,
  },
  {
    name: 'Shorts',
    value: 7.00,
  },
  {
    name: 'Pants',
    value: 8.50,
  },
  {
    name: 'Suit',
    value: 39.00,
  },
  {
    name: 'Sweater',
    value: 7.50,
  },
  {
    name: 'Swimming Trunks',
    value: 5.50,
  },
  {
    name: 'Tuxedo',
    value: 36.00,
  },
  {
    name: 'Undershirt',
    value: 2.00,
  },
  {
    name: 'Underwear',
    value: 2.00,
  },
  {
    name: 'Bikini',
    value: 8.00,
  },
  {
    name: 'Bathrobe',
    value: 7.50,
  },
  {
    name: 'Blouse',
    value: 7.50,
  },
  {
    name: 'Bra',
    value: 2.00,
  },
  {
    name: 'Coat',
    value: 25.00,
  },
  {
    name: 'Dress',
    value: 12.00,
  },
  {
    name: 'Fur Coat',
    value: 220.00,
  },
  {
    name: 'Handbag',
    value: 11.00,
  },
  {
    name: 'Hat',
    value: 4.50,
  },
  {
    name: 'Nightgown',
    value: 8.00,
  },
  {
    name: 'Skirt',
    value: 5.00,
  },
  {
    name: 'Socks',
    value: 0.75,
  },
];

const donationBox = document.querySelector('#donation-box',);

function addDonationRow() {
  let donationOptions = '';
  for (const itemOption of donationItemOptions) {
    donationOptions += `<option>${itemOption.name}</option>`;
  }
  let donationValue = '';
  for (const itemValue of donationItemOptions) {
    donationValue += `<option>${itemValue.value}</option>`;
  }
  const html = `
    <div class="donation-row">
      <select class="item-type">
        ${donationOptions}
      </select>
      <input class="item-count">
      <span class="item-value"></span>
    </div>
  `;
  const donationRow = htmlToElement(html);
  const itemType = donationRow.querySelector('.item-type');
  const itemCount = donationRow.querySelector('.item-count');
  const itemValue = donationRow.querySelector('.item-value');

  function handleItemTypeCountChange() {
    const typeName = itemType.value;
    const count = parseInt(itemCount.value,10);

    for (const option of donationItemOptions) {
      if (typeName === option.name) {
        itemValue.innerHTML = option.value * count;
      }
    }
  }

  itemType.addEventListener('change', handleItemTypeCountChange);
  itemCount.addEventListener('input', handleItemTypeCountChange);

  donationBox.appendChild(donationRow);
}

const anotherItem = document.querySelector('#addItem button',);

anotherItem.addEventListener('click', addDonationRow);



addDonationRow();
