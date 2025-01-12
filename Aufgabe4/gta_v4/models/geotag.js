// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {

    // TODO: ... your code here ...
    constructor(name, latitude, longitude, tag){
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.tag = tag;
    }

    toString(){
        return `${this.name} (${this.latitude}, ${this.longitude}) ${this.hashtag}`;
    }
    
}

module.exports = GeoTag;