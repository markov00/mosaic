/**
 * The following code is under Creative Commons Attribution-ShareAlike 2.0 license
 * and is adapted from http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
 */

exports.long2tile = function(lon, zoom) {
    var val = (lon + 180) / 360 * Math.pow(2, zoom);

    var pixel = Math.floor((val - Math.floor(val)) * 256);
    return { t: Math.floor(val), p: pixel };
}

exports.lat2tile = function(lat, zoom) {
    var val = ((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    var pixel = Math.floor((val - Math.floor(val)) * 256);
    return { t: Math.floor(val), p: pixel };
}
exports.tile2long  = function(x, z) {
    return (x / Math.pow(2, z) * 360 - 180);
}
exports.tile2lat = function(y, z) {
    var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}



exports.replaceUrl = function(url, zoom, x, y) {
    var u = url;
    u = u.replace(/{z}/g, zoom);
    u = u.replace(/{x}/g, x);
    u = u.replace(/{y}/g, y);
    return u;
}