document.addEventListener('DOMContentLoaded', function() {
  const sourceDropdown = document.getElementById('sourceDropdown');
  const destinationDropdown = document.getElementById('destinationDropdown');
  const searchBtn = document.getElementById('searchBtn');
  const routeDetails = document.getElementById('routeDetails');
  const noRoute = document.getElementById('noRoute');
  const sourceStation = document.getElementById('sourceStation');
  const destStation = document.getElementById('destStation');
  const totalDistance = document.getElementById('totalDistance');
  const totalStations = document.getElementById('totalStations');
  const estimatedFare = document.getElementById('estimatedFare');
  const stationList = document.getElementById('stationList');
  const destinationInput = document.getElementById('destinationInput');
  const clearBtn = document.querySelector('.clear-btn');
  const searchActionBtn = document.querySelector('.search-action-btn');

  // Search box clear button
  if (clearBtn) {
      clearBtn.addEventListener('click', function() {
          destinationInput.value = '';
          destinationInput.focus();
      });
  }

  // Search action button (alternative search trigger)
  if (searchActionBtn) {
      searchActionBtn.addEventListener('click', function() {
          if (sourceDropdown.value && destinationDropdown.value) {
              findRoute(sourceDropdown.value, destinationDropdown.value);
          } else {
              alert('Please select both source and destination stations');
          }
      });
  }

  // Destination input suggestions (simulated)
  if (destinationInput) {
      destinationInput.addEventListener('input', function() {
          // This would typically use an autocomplete API
          // For demo purposes, we're not implementing full autocomplete
      });
  }

  // Populate dropdowns
  fetch('/stations')
  .then(res => res.json())
  .then(stations => {
      stations.forEach(station => {
          let opt1 = document.createElement('option');
          opt1.value = station;
          opt1.textContent = station;
          sourceDropdown.appendChild(opt1);

          let opt2 = document.createElement('option');
          opt2.value = station;
          opt2.textContent = station;
          destinationDropdown.appendChild(opt2);
      });
  });

  // Find route button
  searchBtn.addEventListener('click', function() {
      const source = sourceDropdown.value;
      const destination = destinationDropdown.value;
      
      if (!source || !destination) {
          alert('Please select both source and destination stations');
          return;
      }
      
      findRoute(source, destination);
  });

  // Function to find route
  function findRoute(source, destination) {
      fetch('/route', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, destination })
      })
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              routeDetails.classList.add('hidden');
              noRoute.classList.remove('hidden');
              return;
          }
          
          routeDetails.classList.remove('hidden');
          noRoute.classList.add('hidden');
          sourceStation.textContent = source;
          destStation.textContent = destination;
          totalDistance.textContent = data.distance + ' km';
          totalStations.textContent = data.stations_count;
          estimatedFare.textContent = '₹' + data.fare;
          
          stationList.innerHTML = '';
          data.path.forEach(station => {
              const li = document.createElement('li');
              li.textContent = station;
              stationList.appendChild(li);
          });
          
          // Scroll to route details
          routeDetails.scrollIntoView({ behavior: 'smooth' });
      })
      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while finding the route');
      });
  }
});
