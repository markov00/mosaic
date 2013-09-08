#[ MOSAIC ] Mosaic - Map bounding box to PNG

This application allows you to request map tiles from in a specified bounding box. The output is mosaic of tiles, cropped exactly on that bounds.
Can be used with any map tiles that respect the TMS specification.

##Installation
The app depends on GraphicsMagick <http://www.graphicsmagick.org/>. 

E.g. For Mac can be installed via brew:

	brew install graphicsmagick

Install application dependences:

	npm install
	
##Usage

You just need to change the config.json file with your preferences. Remember to specify a subdomain for the tile provider if it has multiple subdomains:

	{
    	"name": "test",
    	"sw" : [45.3921679, 9.065897500000005],
    	"ne": [45.5359728, 9.277915300000018],
    	"zoom": 13,
    	"url": "http://a.tile.osm.org/{z}/{x}/{y}.png"
	}	

and than run:

	node app
	
The app create two folders: one with all single 256 tiles, and another with two files: `name.mosaic.png` that is the full image not cropped to boundingbox, 	and the `name.png` that is the cropped image.



##Terms of service
This software is released for testing purposes only. Is currently under development 
You may use this software ONLY as permitted by the terms of service of the tile server you are using. Attribution and license specification needs to be applied depending on the tile server used.

I'm not responsible to any use of this software against the policy and terms of service/use of the map tiles provider. 


