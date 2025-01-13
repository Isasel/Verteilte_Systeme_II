

  let mapManager;

  let currentPage = 1;
  let maxPage = 1;

  
let latitude;
let longitude;
let searchTerm;


let prevButton;
let nextButton;



    
// Event-Listener nach Laden der Seite registrieren
document.addEventListener("DOMContentLoaded", () => {
    mapManager = new MapManager();
    updateLocation();
    
  
  const taggingForm = document.getElementById("tag-form");
  const discoveryForm = document.getElementById("discovery-form");

  prevButton = document.getElementById("prevPage");
  nextButton = document.getElementById("nextPage");

  prevButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      handleDiscoveryNewPage();
    }
  });

  nextButton.addEventListener("click", (event) => {
    event.preventDefault();
    currentPage++;
    handleDiscoveryNewPage();
  });


  if (taggingForm) {
      taggingForm.addEventListener("submit", handleTagging);
  }

  if (discoveryForm) {
      discoveryForm.addEventListener("submit", handleDiscovery);
  }
  
  fetchAndDisplayResults(); 
});




async function handleDiscovery(event) {
  event.preventDefault();
  
  latitude = document.getElementById("Search_Latitude").value;
  longitude = document.getElementById("Search_Longitude").value;
  searchterm = document.getElementById("Search_Key").value;
  currentPage = 1; // Setze auf die erste Seite zurück
  await handleDiscoveryNewPage();
}

// Verarbeitung des Discovery-Formulars
async function handleDiscoveryNewPage() {

  const params = new URLSearchParams({
      latitude: latitude,
      longitude: longitude,
      searchterm: searchterm,
      page: currentPage,
  });

  
    const response = await fetch(`/api/geotags?${params.toString()}`, {
      method: "GET",
    }).then((response) => response.json()).then((data) =>{
        console.log("Erfolg:", data);
  
        console.log(data);
        const tagList = data.geotags;
        maxPage = data.maxPage;
        const resultsListElement = document.getElementById("discoveryResults");
        resultsListElement.innerHTML = "";
  
        for (const tag of tagList) {
          tag.location = { latitude: tag.latitude, longitude: tag.longitude };
  
          const childElement = document.createElement("li");
          childElement.innerHTML = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.tag}`;
  
          resultsListElement.appendChild(childElement);
        }
        updatePagination();
        mapManager.updateMarkers(latitude, longitude, tagList);
      })
    }

    function updatePagination() {
      const prevButton = document.getElementById("prevPage");
      const nextButton = document.getElementById("nextPage");
      const pageInfo = document.getElementById("pageInfo");
    
      // Seiteninformationen aktualisieren
      pageInfo.textContent = `${currentPage} / ${maxPage}`;
    
      // Buttons aktivieren/deaktivieren
      prevButton.disabled = currentPage <= 1;
      nextButton.disabled = currentPage >= maxPage;
    }
























    
// Verarbeitung des Tagging-Formulars
async function handleTagging(event) {
  event.preventDefault(); // Standardverhalten verhindern
  
  const name = document.getElementById("Add_Name").value;
  const latitude = document.getElementById("Add_Latitude").value;
  const longitude = document.getElementById("Add_Longitude").value;
  const tag = document.getElementById("Add_Hashtag").value;
  
    const geoTag = { name:name, latitude: parseFloat(latitude), longitude: parseFloat(longitude), tag: tag };
  
    fetch("/api/geotags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geoTag),
    })
      .then((response) => response.json())
      .then((data) => console.log("Erfolg:", data))
      .catch((error) => console.error("Fehler:", error));
  }



  

function updateLocation() {
  var lat = document.getElementsByClassName("Latitude");
  var lon = document.getElementsByClassName("Longitude");

  const latitudeField = lat[0];
  const longitudeField = lon[0];

  //falls eines der Felder leer --> findLocation um aktuelle Position zu bestimmen 
  if (!latitudeField.value || !longitudeField.value) {
      LocationHelper.findLocation((helper) => {
          const latitude = helper.latitude;
          const longitude = helper.longitude;
  
          latitudeField.value = latitude;
          longitudeField.value = longitude;
  
          lat[1].value = latitude;
          lon[1].value = longitude;
  
          //entferne alle place-holder Elemente 
          const elements = document.getElementsByClassName("PHolder");
          for (const element of elements) {
              element.remove();
          }
  
          //ein neues Map-Manager-Objekt erstellt, mit abgerufenen Koordinaten initialisiert 
          mapManager.initMap(latitude, longitude);
          mapManager.updateMarkers(latitude, longitude);
    });
  //Koordinaten bereits vorhanden --> initialisiere mit diesen werten 
  } else {

    const latitude = latitudeField.value;
    const longitude = longitudeField.value;

    mapManager.initMap(latitude, longitude);

    const map = document.getElementById("map");
    const taglistString = map.getAttribute("data-tags");
    
    //wenn tagList nicht null/undefined
      const tagList = JSON.parse(taglistString);
    

    //für jedes Tag location setzen 
    for (const tag of tagList) {
      tag.location = { latitude: tag.latitude, longitude: tag.longitude };
    }
    
    const elements = document.getElementsByClassName("PHolder");
    for (const element of elements) {
        element.remove();
    }

    mapManager.updateMarkers(latitude, longitude, tagList);
  }
}