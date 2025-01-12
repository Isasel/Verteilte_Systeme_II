

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
        //JSON-String Geotags zu JavaScript-Array umwandeln 
        const tagList = JSON.parse(taglistString);
      
      console.log(taglistString);
      //const tagList = JSON.parse(taglistString);
      //console.log(tagList);
  
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

  let mapManager;

    
// Event-Listener nach Laden der Seite registrieren
document.addEventListener("DOMContentLoaded", () => {
    mapManager = new MapManager();
    updateLocation();
    
  
  const taggingForm = document.getElementById("tag-form");
  const discoveryForm = document.getElementById("discovery-form");

  if (taggingForm) {
      taggingForm.addEventListener("submit", handleTagging);
  }

  if (discoveryForm) {
      discoveryForm.addEventListener("submit", handleDiscovery);
  }
});

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

// Verarbeitung des Discovery-Formulars
async function handleDiscovery(event) {
  event.preventDefault(); // Standardverhalten verhindern

  const latitude = document.getElementById("Search_Latitude").value;
  const longitude = document.getElementById("Search_Longitude").value;
  const searchterm = document.getElementById("Search_Key").value;

  const params = new URLSearchParams({
      latitude: latitude,
      longitude: longitude,
      searchterm: searchterm,
  });

  try {
      const response = await fetch(`/api/geotags`, {
          method: "GET",
      });

      if (response.ok) {
          const results = await response.json();
          if (response.ok) {
            const jsonResponse = await response.json();
            const results = jsonResponse.geotags; // Extrahiere GeoTags aus der Antwort
            console.log(results);
            updateDisplay(results); // Aktualisiere die Anzeige mit den Suchergebnissen
          }
      } else {
          console.error("Fehler bei der Suche:", response.statusText);
      }
  } catch (error) {
      console.error("Fehler beim Server-Aufruf:", error);
  }
}

// Aktualisiere die Ergebnisanzeige und Karte
function updateDisplay(results = []) {
  const resultList = document.getElementById("results-list");

  // Aktualisiere die Ergebnisliste
  resultList.innerHTML = results
      .map((result) => `<li>${result.name} (${result.latitude}, ${result.longitude})</li>`)
      .join("");

  // Aktualisiere die Marker auf der Karte
  mapManager.updateMarkers(
      results[0]?.latitude || 0,
      results[0]?.longitude || 0,
      results
  );
}