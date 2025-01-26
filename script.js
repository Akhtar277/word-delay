let isSearching = false;
let searchLists = {};
let searchTimeout = null; // Store the timeout ID to cancel if stop is clicked

// Fetch the search lists from the JSON file
fetch('searches.json')
  .then(response => response.json())
  .then(data => {
    searchLists = data;

    // Populate the select options dynamically
    const searchListSelect = document.getElementById('search-list');
    const searchListKeys = Object.keys(searchLists);
    searchListKeys.forEach(list => {
      let option = document.createElement('option');
      option.value = list;
      option.textContent = list;
      searchListSelect.appendChild(option);
    });

    // Set default list to random list on load
    searchListSelect.value = searchListKeys[Math.floor(Math.random() * searchListKeys.length)];
  })
  .catch(error => console.error('Error loading search lists:', error));

const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const searchListSelect = document.getElementById('search-list');

// Start button click event
startButton.addEventListener("click", function () {
  if (isSearching) return; // Prevent multiple clicks if a search is already in progress

  // Disable the start button during the search
  startButton.classList.add("disabled");
  startButton.disabled = true;
  stopButton.disabled = false;

  isSearching = true;

  // Select delay range between 5 and 7 seconds
  const delayRangeStart = parseFloat(document.getElementById('delay-start').value);
  const delayRangeEnd = parseFloat(document.getElementById('delay-end').value);

  let currentIndex = 0;
  const searchList = searchLists[searchListSelect.value];

  // Function to start search with delay
  function startSearch() {
    if (currentIndex >= searchList.length || !isSearching) {
      // End search when all terms are used or when search is stopped
      startButton.classList.remove("disabled");
      startButton.disabled = false;
      isSearching = false;
      stopButton.disabled = true;
      return;
    }

    // Fetch the current search term
    let searchTerm = searchList[currentIndex].trim();
    if (searchTerm) {
      // Open the selected search engine with the search term
      let selectedEngine = document.getElementById("search-engine").value;
      let searchUrl = "";

      if (selectedEngine === "Google") {
        searchUrl = "https://www.google.com/search?q=" + encodeURIComponent(searchTerm);
      } else if (selectedEngine === "Bing") {
        searchUrl = "https://www.bing.com/search?q=" + encodeURIComponent(searchTerm) + "&form=QBLH";
      } else if (selectedEngine === "Yahoo") {
        searchUrl = "https://search.yahoo.com/search?p=" + encodeURIComponent(searchTerm);
      }

      window.open(searchUrl, "_blank");
    }

    currentIndex++;

    // Calculate random delay between the specified range (5-7 seconds)
    const delay = (Math.random() * (delayRangeEnd - delayRangeStart) + delayRangeStart) * 1000;

    // Schedule the next search ONLY if isSearching is still true
    if (isSearching) {
      searchTimeout = setTimeout(startSearch, delay); 
    }
  }

  // Begin search process
  startSearch();
});

// Stop button click event
stopButton.addEventListener("click", function () {
  // Stop the search process
  isSearching = false;
  clearTimeout(searchTimeout); // Clear the timeout to stop the search
  startButton.disabled = false;
  startButton.classList.remove("disabled");
  stopButton.disabled = true;
});
