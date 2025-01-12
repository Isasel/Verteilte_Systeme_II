// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class representing example geoTags at HKA
 * 
 * TODO: populate your InMemoryGeoTagStore with these tags
 * 
 */

const GeoTag = require("../models/geotag");

class GeoTagExamples {
    /**
     * Provides some geoTag data, Array von Geo-Tag-Daten 
     */
    static get tagList() {
        return [
            ['Castle', 49.013790, 8.404435, '#sight'],
            ['IWI', 49.013790, 8.390071, '#edu'],
            ['Building E', 49.014993, 8.390049, '#campus'],
            ['Building F', 49.015608, 8.390112, '#campus'],
            ['Building M', 49.016171, 8.390155, '#campus'],
            ['Building LI', 49.015636, 8.389318, '#campus'],
            ['Auditorium He', 49.014915, 8.389264, '#campus'],
            ['Building R', 49.014992, 8.392365, '#campus'],
            ['Building A', 49.015738, 8.391619, '#campus'],
            ['Building B', 49.016843, 8.391372, '#campus'],
            ['Building K', 49.013190, 8.392090, '#campus'],
        ];
    }

    constructor(geoTagStore) {
        const tagsArray = GeoTagExamples.tagList;
    
        //iteriere über jedes element von tagsArray
        for (const tag of tagsArray) {
          //erstelle für jedes tag ein neues GeoTag-Objekt mit (name,latitude,longitude,tag)
          const newGeoTag = new GeoTag(tag[0], tag[1], tag[2], tag[3]);
    
          //füge GeoTagObjekt zur Sammlung der GeoTags hinzu
          geoTagStore.addGeoTag(newGeoTag);
        }
      }
      
}

//exportiere GeoTagExamples (für Nutzung in anderen Dateien)
module.exports = GeoTagExamples;