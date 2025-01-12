  // File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require("express");
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore.
 * It represents geotags.
 *
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require("../models/geotag");

/**
 * The module "geotag-store" exports a class GeoTagStore.
 * It provides an in-memory store for geotag objects.
 *
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require("../models/geotag-store");
const geoTagStore = new GeoTagStore();

const GeoTagExamples = require("../models/geotag-examples");
const geoTagExamples = new GeoTagExamples(geoTagStore);

/////

router.post("/api/geotags", (req, res) => {
  const { name, latitude, longitude, tag } = req.body;

  geoTagStore.addGeoTag(new GeoTag(name, latitude, longitude, tag));

  res.status(201)
  .location(`/api/geotags/${newGeoTag.id}`)
  .json({ message: "GeoTag created successfully", geotag: newGeoTag });
});

router.get("/api/geotags", (req, res) => {
  const { latitude, longitude, radius, searchterm } = req.query;

  let results;
  if (latitude && longitude && radius) {
    // Suche nach GeoTags in der Nähe
    results = searchterm
      ? geoTagStore.searchNearbyGeoTags(latitude, longitude, radius, searchterm)
      : geoTagStore.getNearbyGeoTags(latitude, longitude, radius);
  } else {
    // Alle GeoTags zurückgeben
    results = geoTagStore.getAllGeoTags();
  }

  res.status(200).json(results);
});

router.get("/api/geotags/:id", (req, res) => {
  const geoTag = geoTagStore.getGeoTagById(req.params.id);
  if (geoTag) {
    res.status(200).json(geoTag);
  } else {
    res.status(404).json({ message: "GeoTag not found" });
  }
});


router.put("/api/geotags/:id", (req, res) => {
  const { name, latitude, longitude, tag } = req.body;
  const updatedGeoTag = geoTagStore.updateGeoTag(req.params.id, { name, latitude, longitude, tag });

  if (updatedGeoTag) {
    res.status(200).json({ message: "GeoTag updated successfully", geotag: updatedGeoTag });
  } else {
    res.status(404).json({ message: "GeoTag not found" });
  }
});


router.delete("/api/geotags/:id", (req, res) => {
  const success = geoTagStore.deleteGeoTag(req.params.id);
  if (success) {
    res.status(204).end();
  } else {
    res.status(404).json({ message: "GeoTag not found" });
  }
});

/////





































































/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
// router.get("/", (req, res) => {
//   res.render("index", { taglist: [] });
// });





router.get("/", (req, res) => {
  res.render("index", {
    taglist: [],
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    markers: null,
  });
});
 



/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags
 * by radius around a given location.
 */

// TODO: ... your code here ...
 
router.post("/tagging", (req, res) => {
  const name = req.body.name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const tag = req.body.tag;

  const radius = 0.01; // todo: kann angepasst werden
  results = geoTagStore.getNearbyGeoTags(latitude, longitude , radius);

  console.log(results);
  res.render("index", {
    latitude: latitude,
    longitude: longitude,
    taglist: results,
    markers: JSON.stringify(results),
  });
  
  const newGeoTag = new GeoTag(name, latitude, longitude, tag);
  geoTagStore.addGeoTag(newGeoTag);

  // Optionally return updated data or redirect
  res.redirect("/"); // Redirecting back to home page or render updated view



});



/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain
 * the term as a part of their names or hashtags.
 * To this end, "GeoTagStore" provides methods to search geotags
 * by radius and keyword.
 */

// TODO: ... your code here ...


router.post("/discovery", (req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const searchterm  = req.body.searchterm;
  let results;

  const search = searchterm;

  const radius = 0.005; // todo: kann angepasst werden

  if (search) {
    results = geoTagStore.searchNearbyGeoTags(
      latitude, longitude ,
      radius,
      search
    );

  } else {
    results = geoTagStore.getNearbyGeoTags(latitude, longitude , radius);
  }
  
  
  res.render("index", {
    latitude: latitude,
    longitude: longitude,
    taglist: results,
    markers: JSON.stringify(results),
  });
});



module.exports = router;