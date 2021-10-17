async function windowActions() {
  const ACCESSTOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
  const mymap = L.map('mapid').setView([38.989, -76.93], 8);
  let markerList = [];
  let firstCoords;

  L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESSTOKEN}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
  }).addTo(mymap);
  
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'
            
  const request = await fetch(endpoint);
  
  const eateries = await request.json();
            
  function findMatches(wordToMatch, eateries){
    return eateries.filter(place => {
    // Does a check for the matching
    const regex = new RegExp(wordToMatch, 'gi');
    return place.zip.match(regex)
    })
  }
  
  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, eateries)
    const limit = 5;
    if (event.target.value === '') {
      suggestions.innerHTML = ''
      return
    }

    markerList.forEach((mark) => {
      mark.remove(mymap)
    });
    markerList = [];
    firstCoords = matchArray[0].geocoded_column_1.coordinates
    if (firstCoords[0] < 0) {
      firstCoords = matchArray[0].geocoded_column_1.coordinates.reverse()
    }
    
    console.log(firstCoords)
    mymap.setView(firstCoords, 10)

    matchArray.slice(0,limit).forEach((location) => {
      if (location.geocoded_column_1.coordinates[0] < 0) { 
        coords = location.geocoded_column_1.coordinates.reverse()
      } else {
        coords = location.geocoded_column_1.coordinates
      }
      
      console.log(coords)
      markerList.push(L.marker(coords).addTo(mymap));
    });
    const html = matchArray.slice(0, limit).map(place => {
    const regex = new RegExp(event.target.value, 'gi')
    const eateryName = place.name.replace(regex, `<span class="h1">${event.target.value}</span>`)
    const eateryAddress = place.address_line_1.replace(regex, `<span class="h1">${event.target.value}</span>`)
      return `
        <li>
          <span class="resto-name"><strong>${eateryName}</strong><br><em>${eateryAddress}</em><br></span>
        </li>
      `;
    }).join('')
    suggestions.innerHTML = html;
  }

  const searchInput = document.querySelector('.eatery-search')
  const suggestions = document.querySelector('.suggestions')
  
  searchInput.addEventListener('input', ((evt) => { displayMatches(evt) }))
}
  
window.onload = windowActions;