async function windowActions() {
  const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'
          
  const request = await fetch(endpoint);

  const eateries = await request.json();
          
  function findMatches(wordToMatch, eateries){
    return eateries.filter(place => {
    // Does a check for the matching
    const regex = new RegExp(wordToMatch, 'gi');
    return place.name.match(regex) || place.category.match(regex)
    })
  }

  function displayMatches(event) {
    const matchArray = findMatches(event.target.value, eateries)
    const html = matchArray.map(place => {
    const regex = new RegExp(event.target.value, 'gi')
    const eateryName = place.name.replace(regex, `<span class="h1">${event.target.value}</span>`)
    const eateryCategory = place.category.replace(regex, `<span class="h1">${event.target.value}</span>`)
    const eateryAddress = place.address_line_1.replace(regex, `<span class="h1">${event.target.value}</span>`)
    const eateryCity = place.city.replace(regex, `<span class="h1">${event.target.value}</span>`)
    const eateryZip = place.zip.replace(regex, `<span class="h1">${event.target.value}</span>`)
      return `
        <li>
          <span class="eatery">${eateryName}<br>${eateryCategory}<br>${eateryAddress}<br>${eateryCity}<br>${eateryZip}<br>,</span>
        </li>
      `;
    }).join('')
    suggestions.innerHTML = html;
  }

  const searchInput = document.querySelector('.eatery-search')
  const suggestions = document.querySelector('.suggestions')

  searchInput.addEventListener('keyup', ((evt) => { displayMatches(evt) }))
}

window.onload = windowActions;