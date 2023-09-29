// JavaScript code for creating and selecting saved worlds and cities with persistence
document.addEventListener("DOMContentLoaded", function () {
    const toggleTextboxButton = document.getElementById("toggle-textbox-button");
    const textInput = document.getElementById("text-input");
    const saveButton = document.getElementById("save-button");
    const savedWorldsDropdown = document.getElementById("saved-text-dropdown");
    const worldDropdownContainer = document.getElementById("world-dropdown-container");
    const createCityContainer = document.getElementById("create-city-container");

    const playerLevelInput = document.getElementById("player-level-input");
    const playerLevelContainer = document.getElementById("player-level-container");

    const toggleCityTextboxButton = document.getElementById("toggle-city-textbox-button");
    const cityTextInput = document.getElementById("city-text-input");
    const saveCityButton = document.getElementById("save-city-button");
    const savedCitiesDropdown = document.getElementById("saved-cities-dropdown");

    const cityLevelContainer = document.getElementById("city-level-container");
    const cityLevelDropdown = document.getElementById("city-level-dropdown");
    const citiesDropdownContainer = document.getElementById("cities-dropdown-container");

    const shopLevelInput = document.getElementById("shop-level-input");
    const reputationInput = document.getElementById("reputation-input");
    const shopTypeDropdown = document.getElementById("shop-type-dropdown");

    const new_shop_button = document.getElementById("new_shop_button");

    // Function to toggle visibility of elements
    function toggleElementVisibility(element, isVisible) {
        element.style.display = isVisible ? "block" : "none";
    }

    function refreshVisibility() {
        var selectedWorld = localStorage.getItem("selectedWorld");
        let savedWorlds = JSON.parse(localStorage.getItem("savedWorlds")) || [];

        if (selectedWorld == null && savedWorlds.length > 0){
            selectedWorld = savedWorlds[0];
            localStorage.setItem("selectedWorld", selectedWorld)
        }

        if (selectedWorld) {
            var savedWorldsDropdownOptions = Array.from(savedWorldsDropdown.options).map(option => option.text);

            if (JSON.stringify(savedWorldsDropdownOptions) !== JSON.stringify(savedWorlds)){
                savedWorldsDropdown.innerHTML = "";

                savedWorlds.forEach(function (worldName) {
                    addSavedWorldToDropdown(worldName);
                });
            }

            var savedWorldsDropdownSelection = savedWorldsDropdown.options[savedWorldsDropdown.selectedIndex].text;
            if (savedWorldsDropdownSelection !== selectedWorld){
                savedWorldsDropdown.value = selectedWorld;
            }

            worldDropdownContainer.style.display = "block";

            var playerLevel = localStorage.getItem(`${selectedWorld}_playerLevel`);

            if (playerLevel == null){
                playerLevel = "1";
                localStorage.setItem(`${selectedWorld}_playerLevel`, playerLevel)
            }

            if (playerLevelInput.value != playerLevel){
                playerLevelInput.value = playerLevel;
            }

            playerLevelContainer.style.display = "block";
            createCityContainer.style.display = "block";

            var selectedCity = localStorage.getItem("selectedCity");
            var citiesForWorld = JSON.parse(localStorage.getItem(selectedWorld)) || [];


            if (citiesForWorld.length <= 0){
                selectedCity = null;
            }
            else if(!citiesForWorld.includes(selectedCity)){
                selectedCity = citiesForWorld[0];
                localStorage.setItem("selectedCity", selectedCity);
            }
            
            if (selectedCity) {
                var savedCitiesDropdownOptions = Array.from(savedCitiesDropdown.options).map(option => option.text);

                if (JSON.stringify(savedCitiesDropdownOptions) !== JSON.stringify(citiesForWorld)){
                    savedCitiesDropdown.innerHTML = "";

                    citiesForWorld.forEach(function (cityName) {
                        addSavedCityToDropdown(cityName);
                    });
                }

                var savedCitiesDropdownSelection = savedCitiesDropdown.options[savedCitiesDropdown.selectedIndex].text;
                if (savedCitiesDropdownSelection !== selectedCity){
                    savedCitiesDropdown.value = selectedCity;
                }
                citiesDropdownContainer.style.display = "block";

                var cityLevel = localStorage.getItem(`${selectedCity}_cityLevel`);

                if (cityLevel == null){
                    cityLevel = "1";
                    localStorage.setItem(`${selectedCity}_cityLevel`, cityLevel);
                }

                cityLevelDropdown.value = cityLevel;

                cityLevelContainer.style.display = "block";
            } else {
                citiesDropdownContainer.style.display = "none";
                cityLevelContainer.style.display = "none";
            }
        } else {
            worldDropdownContainer.style.display = "none";
            playerLevelContainer.style.display = "none";
            createCityContainer.style.display = "none";
            citiesDropdownContainer.style.display = "none";
            cityLevelContainer.style.display = "none";
        }
    }

    // Function to add a saved world to the dropdown
    function addSavedWorldToDropdown(worldName) {
        const option = document.createElement("option");
        option.textContent = worldName;
        savedWorldsDropdown.appendChild(option);

        const selectedWorld = localStorage.getItem("selectedWorld");
        if (selectedWorld == null){
            // Save selection on local storage
            localStorage.setItem("selectedWorld", worldName)
        }
    }

    // Function to add a saved city to the dropdown
    function addSavedCityToDropdown(cityName) {
        const option = document.createElement("option");
        option.textContent = cityName;
        savedCitiesDropdown.appendChild(option);

        const selectedCity = localStorage.getItem("selectedCity");
        if (selectedCity == null){
            // Save selection on local storage
            localStorage.setItem("selectedCity", cityName)
        }
    }

    // Event listener for the "New World" button
    toggleTextboxButton.addEventListener("click", function () {
        // Toggle visibility of the world name input and save button
        toggleElementVisibility(textInput, true);
        toggleElementVisibility(saveButton, true);
        toggleElementVisibility(toggleTextboxButton, false);
    });

    // Event listener for the "Save" button for worlds
    saveButton.addEventListener("click", function () {
        const worldName = textInput.value.trim();

        if (worldName) {
            // Retrieve the existing list of saved worlds from local storage or create a new one
            let savedWorlds = JSON.parse(localStorage.getItem("savedWorlds")) || [];

            // Add the new world to the list
            savedWorlds.push(worldName);

            // Save the updated list back to local storage
            localStorage.setItem("savedWorlds", JSON.stringify(savedWorlds));

            localStorage.setItem("selectedWorld", worldName)

            // Clear the input field
            textInput.value = "";

            // Add the saved world to the dropdown without refreshing
            addSavedWorldToDropdown(worldName);
            
            refreshVisibility();
        }

        // Toggle visibility of elements
        toggleElementVisibility(textInput, false);
        toggleElementVisibility(saveButton, false);
        toggleElementVisibility(toggleTextboxButton, true);
    });

    // Event listener for the selected world dropdown
    savedWorldsDropdown.addEventListener("change", function () {
        // Get the selected world name
        const selectedWorld = savedWorldsDropdown.value;

        // Save selection on local storage
        localStorage.setItem("selectedWorld", selectedWorld);

        refreshVisibility();
    });

    // Event listener for changing the player level input
    playerLevelInput.addEventListener("change", function () {
        const selectedWorld = savedWorldsDropdown.value; // Get the selected world
        const playerLevel = parseInt(playerLevelInput.value);

        if (!isNaN(playerLevel) && selectedWorld) {

            if (playerLevel < 1) {
                playerLevel = 1;
            }
            // Save the player level to local storage associated with the selected world
            localStorage.setItem(`${selectedWorld}_playerLevel`, playerLevel.toString());

            refreshVisibility();
        }
    });

    // Event listener for the "Add City" button
    toggleCityTextboxButton.addEventListener("click", function () {
        // Toggle visibility of the city name input and save button
        toggleElementVisibility(cityTextInput, true);
        toggleElementVisibility(saveCityButton, true);
        toggleElementVisibility(toggleCityTextboxButton, false);
    });

    // Event listener for the "Save" button for cities
    saveCityButton.addEventListener("click", function () {
        const cityName = cityTextInput.value.trim();
        const selectedWorld = savedWorldsDropdown.value; // Get the selected world

        if (cityName && selectedWorld) {
            // Retrieve the existing list of saved cities for the selected world from local storage
            let savedCities = JSON.parse(localStorage.getItem(selectedWorld)) || [];

            // Add the new city to the list
            savedCities.push(cityName);

            // Save the updated list back to local storage under the selected world's name
            localStorage.setItem(selectedWorld, JSON.stringify(savedCities));

            // Clear the input field
            cityTextInput.value = "";
            
            // Auto select new city
            localStorage.setItem("selectedCity", cityName);

            // Add the saved city to the dropdown without refreshing
            addSavedCityToDropdown(cityName);

            refreshVisibility();
        }

        // Toggle visibility of elements in any case
        toggleElementVisibility(cityTextInput, false);
        toggleElementVisibility(saveCityButton, false);
        toggleElementVisibility(toggleCityTextboxButton, true);
    });

    // Event listener for the selected city dropdown
    savedCitiesDropdown.addEventListener("change", function () {
        // Get the selected city name
        const selectedCity = savedCitiesDropdown.value;

        // Save selection on local storage
        localStorage.setItem("selectedCity", selectedCity)
        
        refreshVisibility();
    });

    // Event listener for changing the city level dropdown
    cityLevelDropdown.addEventListener("change", function () {
        const selectedCity = savedCitiesDropdown.value; // Get the selected city
        const cityLevel = cityLevelDropdown.value;

        if (selectedCity) {
            // Save the city level to local storage associated with the selected city
            localStorage.setItem(`${selectedCity}_cityLevel`, cityLevel);
        }
        
        refreshVisibility();
    });

    new_shop_button.addEventListener("click", function() {
        const postData = {
            player_level: playerLevelInput.value,
            city_level: cityLevelDropdown.value,
            shop_level: shopLevelInput.value,
            reputation: reputationInput.value,
            shop_type: shopTypeDropdown.value
        };

        // Send the POST request to the specified endpoint
        fetch('/getShop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData) // Convert data to JSON format
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            const table = document.getElementById('items-table');
            table.innerHTML = "";
        
            // Populate the table with items from the response
            data.items.forEach(item => {
                const row = table.insertRow();
                
                // Add cells and set their content
                const numberCell = row.insertCell();
                numberCell.textContent = item["Number"];
                
                const nameCell = row.insertCell();
                const nameLink = document.createElement('a');
                nameLink.href = item["Link"];
                nameLink.textContent = item["Name"];
                nameCell.appendChild(nameLink);
                
                const typeCell = row.insertCell();
                typeCell.textContent = item["Type"];
                
                const costCell = row.insertCell();
                costCell.textContent = `${item["Cost"]} gp`;
        });
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
    });

    refreshVisibility();
});
