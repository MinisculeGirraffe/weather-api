interface CoordinatePairs {
    lat: Number,
    lon: Number
}
export function harvensineDistance([lon1,lat1]: number[],[lon2,lat2]: number[], isMiles = false) {
    var R = 6371; // km 
    var x1 = lat2 - lat1;
    var dLat = x1 * Math.PI / 180
    var x2 = lon2 - lon1;
    var dLon = x2 * Math.PI / 180
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    if (isMiles) d /= 1.60934;
    return d
}
