const map = L.map('map', {
    maxBounds: [
      [-90, -180],
      [90, 180],
    ],
    zoomControl: false,         // Entfernt die Zoom-Schaltflächen
    scrollWheelZoom: true,     // Deaktiviert Zoomen per Mausrad
    doubleClickZoom: true,     // Deaktiviert Zoomen per Doppelklick
    touchZoom: true,           // Deaktiviert Zoomen per Touch-Geste (Mobil)
    dragging: true,            // Deaktiviert das Verschieben der Karte
    maxBoundsViscosity: 1.0,
  }).setView([0, 0], 2);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

let selectedCountry = null;
let countryLayer;
let totalCustomPrice = 40;
let customCountries = [];
let displayedCountries = "";

const continentViews = {
  Europa: [[54.5260, 15.2551], 4],
  Asien: [[34.0479, 100.6197], 3],
  Nordamerika: [[46.0732, -100.5460], 3],
  Südamerika: [[-14.6048, -57.6562], 3],
  Ozeanien: [[-18.7763, 145.3010], 4],
  Custom: [[0, 0], 2],
};

let selectedCountries = [];

function updateCountryList(countries) {
  const countryListElement = document.getElementById('country-list');
  countryListElement.textContent = countries.length ? countries.join(', ') : 'Keine Länder ausgewählt.';
}

function setMapView(region) {
  const view = continentViews[region];
  if (view) {
    map.setView(view[0], view[1]);
    selectedCountries = regionCountries[region] || [];
    updateCountryList(selectedCountries);
  }
}

document.getElementById('btnEuropa').addEventListener('click', () => setMapView('Europa'));
document.getElementById('btnAsien').addEventListener('click', () => setMapView('Asien'));
document.getElementById('btnNordamerika').addEventListener('click', () => setMapView('Nordamerika'));
document.getElementById('btnSuedamerika').addEventListener('click', () => setMapView('Südamerika'));
document.getElementById('btnOzeanien').addEventListener('click', () => setMapView('Ozeanien'));
document.getElementById('btnCustom').addEventListener('click', () => setMapView('Custom'));

const regionCountries = {
    Europa: [
      "Albania","Andorra","Austria","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Estonia",
      "Finland",
      "France",
      "Germany",
      "Greece",
      "Hungary",
      "Iceland",
      "Ireland",
      "Italy",
      "Kosovo",            // teils anerkannt
      "Latvia",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Malta",
      "Moldova",
      "Monaco",
      "Montenegro",
      "Netherlands",
      "North Macedonia",
      "Norway",
      "Poland",
      "Portugal",
      "Romania",
      "Russia",
      "San Marino",
      "Serbia",
      "Slovakia",
      "Slovenia",
      "Spain",
      "Sweden",
      "Switzerland",
      "Ukraine",
      "United Kingdom",
      "Vatican City"
    ],
  
    Asien: [
      "Afghanistan",
      "Armenia",
      "Azerbaijan",
      "Bahrain",
      "Bangladesh",
      "Bhutan",
      "Brunei",
      "Cambodia",
      "China",
      "Georgia",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Israel",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Lebanon",
      "Malaysia",
      "Maldives",
      "Mongolia",
      "Myanmar",
      "Nepal",
      "North Korea",
      "Oman",
      "Pakistan",
      "Philippines",
      "Qatar",
      "Russia",       // transkontinental
      "Saudi Arabia",
      "Singapore",
      "South Korea",
      "Sri Lanka",
      "Syria",
      "Taiwan",       // teils anerkannt
      "Tajikistan",
      "Thailand",
      "Timor-Leste",
      "Turkey",       // transkontinental
      "Turkmenistan",
      "United Arab Emirates",
      "Uzbekistan",
      "Vietnam",
      "Yemen"
    ],
  
    Nordamerika: [
      "Antigua and Barbuda",
      "Bahamas",
      "Barbados",
      "Belize",
      "Canada",
      "Costa Rica",
      "Cuba",
      "Dominica",
      "Dominican Republic",
      "El Salvador",
      "Grenada",
      "Guatemala",
      "Haiti",
      "Honduras",
      "Jamaica",
      "Mexico",
      "Nicaragua",
      "Panama",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Trinidad and Tobago",
      "United States of America"
    ],
  
    Südamerika: [
      "Argentina",
      "Bolivia",
      "Brazil",
      "Chile",
      "Colombia",
      "Ecuador",
      "Guyana",
      "Paraguay",
      "Peru",
      "Suriname",
      "Uruguay",
      "Venezuela"
    ],
  
    Ozeanien: [
      "Australia",
      "Fiji",
      "Kiribati",
      "Marshall Islands",
      "Micronesia",
      "Nauru",
      "New Zealand",
      "Palau",
      "Papua New Guinea",
      "Samoa",
      "Solomon Islands",
      "Tonga",
      "Tuvalu",
      "Vanuatu"
    ]
  };

function selectCountry(feature, layer) {
  const countryName = feature.properties.name;
  if (!customCountries.includes(countryName)) {
    customCountries.push(countryName);
    totalCustomPrice += 15;
    updatePrice(totalCustomPrice);
    updateCountryList(customCountries);
  }
  layer.setStyle({
    color: 'blue',
    weight: 3,
    fillOpacity: 0.3
  });
}

function selectCountry(feature, layer) {
  const countryName = feature.properties.name;
  if (!customCountries.includes(countryName)) {
    customCountries.push(countryName);
    totalCustomPrice += 15;
    updatePrice(totalCustomPrice);
    updateCountryList(customCountries);
  }
  layer.setStyle({
    color: 'blue',
    weight: 3,
    fillOpacity: 0.3
  });
}

// GeoJSON
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(response => response.json())
  .then(data => {
    countryLayer = L.geoJSON(data, {
      style: {
        color: '#4caf50',
        weight: 1,
        fillOpacity: 0.1
      },
      onEachFeature: function (feature, layer) {
        layer.on('click', () => {
          if (document.getElementById('map').classList.contains('active')) {
            selectCountry(feature, layer);
          }
        });
      }
    }).addTo(map);
  });

function selectBundle(element, price) {
  resetSelection();
  document.querySelectorAll('.region-button').forEach(b => b.classList.remove('selected'));
  element.classList.add('selected');
  highlightRegion(element.dataset.region);
  updatePrice(price);
  updateCountryList(regionCountries[element.dataset.region]);
}

function selectCustom(element) {
  resetSelection();
  document.querySelectorAll('.region-button').forEach(b => b.classList.remove('selected'));
  element.classList.add('selected');
  document.getElementById('map').classList.add('active');
  updatePrice(40);
}

function highlightRegion(region) {
  countryLayer.eachLayer(layer => {
    const countryName = layer.feature.properties.name;
    if (regionCountries[region].includes(countryName)) {
      layer.setStyle({
        color: 'red',
        weight: 2,
        fillOpacity: 0.3
      });
    } else {
      countryLayer.resetStyle(layer);
    }
  });
}

function selectCountry(feature, layer) {
  const countryName = feature.properties.name;
  if (!customCountries.includes(countryName)) {
    customCountries.push(countryName);
    totalCustomPrice += 15;
    updatePrice(totalCustomPrice);
    updateCountryList(customCountries);
  }
  layer.setStyle({
    color: 'blue',
    weight: 3,
    fillOpacity: 0.3
  });
}

function updateCountryList(countries) {
  const countryList = document.getElementById('country-list');
  countryList.textContent = countries.length ? countries.join(', ') : 'Keine Länder ausgewählt.';
}

function resetSelection() {
  totalCustomPrice = 40;
  customCountries = [];
  displayedCountries = "";
  countryLayer.eachLayer(layer => countryLayer.resetStyle(layer));
  document.getElementById('map').classList.remove('active');
}

function updatePrice(price) {
  const priceDisplay = document.getElementById('price-display');
  priceDisplay.textContent = `Preis: ${price} €`;
}
function selectBundle(element, price) {
  resetSelection();
  document.querySelectorAll('.region-button').forEach(b => b.classList.remove('selected'));
  element.classList.add('selected');
  highlightRegion(element.dataset.region);
  updatePrice(price);
  updateCountryList(regionCountries[element.dataset.region]);
}

function selectCustom(element) {
  resetSelection();
  document.querySelectorAll('.region-button').forEach(b => b.classList.remove('selected'));
  element.classList.add('selected');
  document.getElementById('map').classList.add('active');
  updatePrice(40);
}
