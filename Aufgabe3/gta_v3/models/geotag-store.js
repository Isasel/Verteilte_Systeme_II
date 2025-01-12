// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{
    constructor() {
        //Array zum Speichern aller Geotags
        this.geoTags = [];
    }

    //add a geotag to the store
    addGeoTag(geoTag) {
        this.geoTags.push(geoTag);
    }

    //delete geo-tags from the store by name
    removeGeoTag(name) {
        this.geoTags = this.geoTags.filter(tag => tag.name !== name);
    }

    // returns all geotags in the proximity of a location (within certain radius)
    getNearbyGeoTags(latitude, longitude, radius) {
        return this.geoTags.filter(tag => {
            const distance = this.calculateDistance(latitude, longitude, tag.latitude, tag.longitude);
            return distance <= radius;
        });
    }

    searchNearbyGeoTags(latitude, longitude, radius, keyword) {
        return this.getNearbyGeoTags(latitude, longitude, radius).filter(tag => {
            return (tag.name.toLowerCase().includes(keyword.toLowerCase()) ||
            tag.tag.toLowerCase().includes(keyword.toLowerCase()));
        });
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        const Y_diff = lat1 - lat2;
        const X_diff = lon1 - lon2;
        return Math.sqrt(X_diff * X_diff + Y_diff * Y_diff);
    }
    
}

module.exports = InMemoryGeoTagStore
