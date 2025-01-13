// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

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
            let mapManager = new MapManager();
            mapManager.initMap(latitude, longitude);
            mapManager.updateMarkers(latitude, longitude);
      });
    //Koordinaten bereits vorhanden --> initialisiere mit diesen werten 
    } else {

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
  
      mapManager.updateMarkers(latitude, longitude, tagList);
    }
  }


    
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});