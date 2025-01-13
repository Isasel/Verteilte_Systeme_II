

//lade express-modul, Webframework-Bibliothel für node.js
const express = require("express");
const router = express.Router();
router.use(express.json());

// eslint-disable-next-line no-unused-vars
const GeoTag = require("../models/geotag");

// eslint-disable-next-line no-unused-vars
const GeoTagStore = require("../models/geotag-store");
const geoTagStore = new GeoTagStore();

const GeoTagExamples = require("../models/geotag-examples");
const geoTagExamples = new GeoTagExamples(geoTagStore);

/////
// liefert die einzelne Ressource als JSON zurück,
router.get("/api/geotags", (req, res) => {
  const { latitude, longitude, searchterm , page} = req.query;
  const radius = 0.005;
  const limit = 8;
  let results;


  if (searchterm) {
    results = geoTagStore.searchNearbyGeoTags(
      parseFloat(latitude),
      parseFloat(longitude),
      radius,
      searchterm
    );

  } else {
      results = geoTagStore.getNearbyGeoTags(
      parseFloat(latitude),
      parseFloat(longitude),
      radius
    );
  }
  const startIndex = (page-1)* limit;
  let endIndex = page * limit;
  
  const maxPage = Math.ceil(results.length / limit);

  results = results.slice(startIndex, endIndex);

  let jsonResult = {
    geotags: results,
    maxPage: maxPage,};
  res.status(200).json(jsonResult);
});
//Überprüft

//füge neuen Geotag hinzu (aufgerufen wenn POST-Anfrage an URL /geotags)
router.post("/api/geotags", (req, res) => {
  const { name, latitude, longitude, tag } = req.body;

  const newGeoTag = new GeoTag(name, latitude, longitude, tag);
  geoTagStore.addGeoTag(newGeoTag); //geoTag der Liste hinzugügen

  //gibt status und neuen geotag in antwort zurück
  res.status(201) //http response code (created)
  .location(`/api/geotags/${newGeoTag.id}`) //url im location header zurücksenden
  .json({ message: "GeoTag created successfully", geotag: newGeoTag });
});
//Überprüft


//suche geotag mit bestimmter id 
router.get("/api/geotags/:id", (req, res) => {
  const geoTag = geoTagStore.getGeoTagById(Number(req.params.id));
  if (geoTag) {
    res.status(200).json(geoTag);
  } else {
    res.status(404).json({ message: "GeoTag not found" });
  }
});
//Überprüft

//aktualisiere geotag basierend auf id
//eine Beschreibung der geänderten Ressource mitgeschickt
router.put("/api/geotags/:id", (req, res) => {
  const { name, latitude, longitude, tag } = req.body;
  const updatedGeoTag = geoTagStore.updateGeoTag(req.params.id, { name, latitude, longitude, tag });

  if (updatedGeoTag) {
    res.status(200).json({ message: "GeoTag updated successfully", geotag: updatedGeoTag });
  } else {
    const newGeoTag = new GeoTag(name, latitude, longitude, tag);
    geoTagStore.addGeoTag(newGeoTag); //geoTag der Liste hinzugügen
    res.status(200).json({ message: "GeoTag not found, created new" }); //id existiert nicht
  }
});// Überprüft

//lösche geotag basierend auf id 
//keine Ressourcenbeschreibungen ausgetauscht
router.delete("/api/geotags/:id", (req, res) => {
  const success = geoTagStore.deleteGeoTag(Number(req.params.id));
  if (success) {
    res.status(204).end(); //204 --> no content 
  } else {
    res.status(404).json({ message: "GeoTag not found" }); //404 --> not found 
  }
});

/////

router.get("/", (req, res) => {
  res.render("index", {
    taglist: [],
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    markers: null,
  });
});


router.post("/tagging", (req, res) => {
  const name = req.body.name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const tag = req.body.tag;
  
  const newGeoTag = new GeoTag(name, latitude, longitude, tag);
  geoTagStore.addGeoTag(newGeoTag);

  console.log(geoTagStore);
  // Optionally return updated data or redirect
  res.redirect("/"); // Redirecting back to home page or render updated view
});


router.post("/discovery", (req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const searchterm  = req.body.searchterm;
  let results;

  const search = searchterm;

  const radius = 0.005; // todo: kann angepasst werden

  console.log(search);

  if (search) {
    results = geoTagStore.searchNearbyGeoTags(
      latitude, longitude ,
      radius,
      searchterm
    );

  } else {
    results = geoTagStore.getNearbyGeoTags(latitude, longitude , radius);
  }
  console.log(results);
  
  res.render("index", {
    latitude: latitude,
    longitude: longitude,
    taglist: results,
    markers: JSON.stringify(results),
  });
});

module.exports = router;