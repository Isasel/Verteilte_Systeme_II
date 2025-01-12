// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

/*
Lesen sie dort die geeigneten Formularfelder im DOM aus und testen sie, ob schon Koordinaten 
eingetragen sind. Rufen sie die Methode LocationHelper.findLocation() nur noch dann auf, wenn es die Situation erfordert.
*/
/*
const mapElement = document.getElementById("map");
const taglistJSON = mapElement.dataset.tags;
const taglist = JSON.parse(taglistJSON); // JavaScript-Array

function updateLocation(){

    LocationHelper.findLocation(function(helper){
        var lat = document.getElementsByClassName("Latitude");
        lat[0].value =  helper.latitude;
        lat[1].value =  helper.latitude;

        var lon = document.getElementsByClassName("Longitude");
        lon[0].value =  helper.longitude;
        lon[1].value =  helper.longitude;

        var elements = document.getElementsByClassName("PHolder");
        var element2 = Array.from(elements);
        for (let elem of element2) { 
            elem.remove();
        } 

        let mapManager = new MapManager(); 
        mapManager.initMap(helper.latitude, helper.longitude, 20); 
        mapManager.updateMarkers(helper.latitude, helper.longitude);

        const map = document.getElementById("map");
        const taglistString = map.getAttribute("data-tags");

        const tagList = JSON.parse(taglistString);

        for (const tag of tagList) {
        tag.location = { latitude: tag.latitude, longitude: tag.longitude };
        }
        });
        mapManager.updateMarkers(latitude, longitude, tagList);
    
}*/

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
  
      mapManager.updateMarkers(latitude, longitude, tagList);
    }
  }


    
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});