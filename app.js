var http = require('http'),
    fs = require('fs'),
    gm = require('gm'),
    finish = require("finish"),
    config = require("./config")
utils = require("./utils");

console.log("\n[ MOISAIC ]\n");

console.log("------------\nConfiguration:\nname\t", config.name);
console.log("url\t", config.url);
console.log("sw\t", config.sw);
console.log("ne\t", config.ne);
console.log("zoom\t", config.zoom);
console.log("------------\n")

// create maps and tiles dirs for storing tiles and images
fs.exists('maps', function (exists) {
    if (!exists)
        fs.mkdirSync("maps");
});
fs.exists('tiles', function (exists) {
    if (!exists)
        fs.mkdirSync("tiles");
});

// find boundaries in tile numbering and detect pixel of each bound in the tile.

var minX = utils.long2tile(config.sw[1], config.zoom);
var maxX = utils.long2tile(config.ne[1], config.zoom);
var minY = utils.lat2tile(config.ne[0], config.zoom);
var maxY = utils.lat2tile(config.sw[0], config.zoom);

console.log("Tile X from: " + minX.t + " to: " + maxX.t);
console.log("Tile Y from: " + minY.t + " to: " + maxY.t);


// generate an array of tile url requests
var data = [];
for (var x = minX.t; x <= maxX.t; x++) {
    for (var y = minY.t; y <= maxY.t; y++) {
        var d = {
            x: x,
            y: y
        };
        d.url = utils.replaceUrl(config.url, config.zoom, x, y);
        data.push(d);
    }
}

finish(function (async) {

    data.forEach(function (tile) {
        async(function (done) {

            //download tiles
            http.get(tile.url, function (res) {
                var imagedata = ''
                res.setEncoding('binary');

                res.on('data', function (chunk) {
                    imagedata += chunk
                })

                res.on('end', function () {
                    fs.writeFile("tiles/" + tile.x + "-" + tile.y + '.png', imagedata, 'binary', function (err) {
                        if (err) throw err;
                        done();
                    })
                })

            });
        });
    });
}, function (err, results) {


    var height = ((maxY.t - minY.t + 1) * 256) - (256 - maxY.p) - minY.p;
    var width = ((maxX.t - minX.t + 1) * 256) - (256 - maxX.p) - minX.p;


    console.log("Cropped image size: " + width + " x " + height);
    var g = gm();

    // specify mosaic of tiles
    for (var x = minX.t; x <= maxX.t; x++) {
        for (var y = minY.t; y <= maxY.t; y++) {
            var xp = (x - minX.t) * 256;
            var yp = (y - minY.t) * 256;
            g.in('-page', "+" + xp + "+" + yp)
                .in("tiles/" + x + "-" + y + ".png");
        }
    }


    g.mosaic()
        .write("maps/" + config.name + ".mosaic.png", function (err) {
            if (err) console.log(err);
            gm("maps/" + config.name + ".mosaic.png")
                .crop(width, height, minX.p, minY.p)
                .write("maps/" + config.name + ".png", function (err) {
                    if (!err)
                        console.log('\nDone!\nYou can find your map in maps/' + config.name + ".png\n");
                });

        });


});


