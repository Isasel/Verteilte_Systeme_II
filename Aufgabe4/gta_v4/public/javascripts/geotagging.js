

function updateLocation() {
    var lat = document.getElementsByClassName("Latitude");
    var lon = document.getElementsByClassName("Longitude");

    const latitudeField = lat[0];
    const longitudeField = lon[0];
  
    //falls eines der Felder leer --> findLocation um aktuelle Position zu bestimmen 
    if (!latitudeField.value || !longitudeField.value) {
        console.log("Case 1");
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
            let mapManager = new MapManager();
            mapManager.initMap(latitude, longitude);
            mapManager.updateMarkers(latitude, longitude);
      });
    //Koordinaten bereits vorhanden --> initialisiere mit diesen werten 
    } else {
        console.log("Case 2");

      const latitude = latitudeField.value;
      const longitude = longitudeField.value;
  
      console.log(latitude);
      console.log(longitude);
  
      let mapManager = new MapManager();
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


    
// Event-Listener nach Laden der Seite registrieren
document.addEventListener("DOMContentLoaded", () => {
  updateLocation();

  const taggingForm = document.getElementById("tagging-form");
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

  const name = document.getElementById("name").value;
  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;
  const tag = document.getElementById("tag").value;

  if (!name || !latitude || !longitude || !tag) {
      alert("Bitte alle Felder ausfüllen.");
      return;
  }

  const geoTag = { name, latitude: parseFloat(latitude), longitude: parseFloat(longitude), tag };

  try {
      const response = await fetch("/api/geotags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geoTag),
      });

      if (response.ok) {
          alert("GeoTag erfolgreich hinzugefügt!");
          updateLocation(); // Aktualisiere die Karte und Liste
      } else {
          console.error("Fehler beim Hinzufügen des GeoTags:", response.statusText);
      }
  } catch (error) {
      console.error("Fehler beim Server-Aufruf:", error);
  }
}

// Verarbeitung des Discovery-Formulars
async function handleDiscovery(event) {
  event.preventDefault(); // Standardverhalten verhindern

  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;
  const searchterm = document.getElementById("searchterm").value;

  const params = new URLSearchParams({
      latitude: latitude,
      longitude: longitude,
      searchterm: searchterm,
  });

  try {
      const response = await fetch(`/api/geotags?${params.toString()}`, {
          method: "GET",
      });

      if (response.ok) {
          const results = await response.json();
          updateDisplay(results); // Aktualisiere die Anzeige mit den Suchergebnissen
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
  let mapManager = new MapManager();
  mapManager.updateMarkers(
      results[0]?.latitude || 0,
      results[0]?.longitude || 0,
      results
  );
}