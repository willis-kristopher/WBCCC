// by: John Allan (habaneros.com)
// ver: 0.2
// date: December 2012
// Requirements: jQuery
//
// The purpose of this plugin is to parse schema.org formatted 
// data and wrap it in a link. The default functionality is for PostalAddress data
// and opens a native mapping app for mobile devices or Google Maps for a desktop or
// unknown device.
//
// Using the settings object of the plug you could change the default functionality to
// parse other micro data formats, build other types of URLs or support other devices.
//
// Supported devices for the default map functionality:
// iPhone,iPad,iPod,Android,WP7,BlackBerry,other via default template
// Tested Device:
// iPhone4, Android(?), FF4+
//
// TODO:
// develop a pure JS version to remove reliance on jQuery
// add support for default/existing anchor tag
//
// Default settings:
//
// $("[itemtype='schema.org/PostalAddress']").linkSchemaData({ 
//     'linkTitle': 'Open a map to this location', (string) //the title which appears on the anchor tag (string)
//     'linkClass': 'mapLink', (string) //the class(es) which appear on the anchor tag (string)
//     'openInNewWindow': true, (boolean) //links open in a new window (boolean)
//     'openInSameWindow': true, (boolean) //if (openInNewWindow) all links open in the same new window (boolean)
//     'dataAttribute': "itemprop", (string) //the attribute name for matching the dataTemplate keys to DOM elements
//     'dataTemplate': {}, (object) //each key must match a marker in the urlTemplates and a dataAttribute
//     'urlTemplates': {}, (object) //contains a URL template for each device type
//     'deviceMap' [] (array) //an array of objects which maps user-agent strings to URL templates via device type
// });
(function($) {

    $.fn.linkSchemaData = function(options) {

        var settings = $.extend({
            'linkTitle': 'Open a map to this location',
            'linkClass': 'mapLink',
            'openInNewWindow': true,
            'openInSameWindow': true,
            'dataAttribute': "itemprop",
            'dataTemplate': {
                "streetAddress": null,
                "addressLocality": null,
                "addressRegion": null,
                "postalCode": null,
                "addressCountry": null
            },
            'urlTemplates': {
                "default": "http://maps.google.com?q={streetAddress} {addressLocality} {addressRegion} {postalCode} {addressCountry}",
                "ios": "maps:?saddr=Current Location&daddr={streetAddress} {addressLocality} {addressRegion} {postalCode} {addressCountry}",
                "android": "geo:{streetAddress} {addressLocality} {addressRegion} {postalCode} {addressCountry}",
                "wp7": "maps:{streetAddress} {addressLocality} {addressRegion} {postalCode} {addressCountry}",
                "w8": "bingmaps:?where={streetAddress} {addressLocality} {addressRegion} {postalCode} {addressCountry}",
                "blackberry": "javascript:blackberry.launch.newMap({'address':{'address1':'{streetAddress}','city':'{addressLocality}','country':'{addressCountry}','stateProvince':'{addressRegion}','zipPostal':'{postalCode}'}});"
            },
            'deviceMap': [
                {
                "dType": "ios",
                "qString": "ipad"},
            {
                "dType": "ios",
                "qString": "ipod"},
            {
                "dType": "ios",
                "qString": "iphone"},
            {
                "dType": "android",
                "qString": "android"},
            {
                "dType": "blackberry",
                "qString": "blackberry"},
            {
                "dType": "wp7",
                "qString": "windows phone"},
            {
                "dType": "w8",
                "qString": "windows nt 6.2"}]

        }, options);

        var methods = {
            //iterates over a JSON ojbect and replaces each marker in the string template
            //with the matching value from the object
            //{key} in string is replaced with the value of "key" from the object
            "JSONStringBuilder": function(s, o) {
                var k;
                for (k in o) {
                    if (o.hasOwnProperty(k)) {
                        s = s.replace("{" + k + "}", o[k]);
                    }
                }
                return s;
            },
            // using the device type and schema data this function chooses a 
            // template, contructs the URL and encodes it
            "buildURL": function(deviceType, locationData) {
                var t, url;
                t = settings.urlTemplates[deviceType];
                url = methods.JSONStringBuilder(t, locationData);
                url = encodeURI(url);
                return url;
            },
            // extracts the schema data from the given element
            "getSchemaData": function(el) {
                var schemaData, k;
                //get the data object template from settings
                schemaData = settings.dataTemplate;
                //iterate over the object and get the matching content from each DOM element
                //object key, template marker and dataAttribute value must all match
                for (k in schemaData) {
                    if (schemaData.hasOwnProperty(k)) {
                        schemaData[k] = el.find("[" + settings.dataAttribute + "='" + k + "']").text();
                    }
                }
                return schemaData;
            },
            // by parsing the user-agent string this function attempts to determine 
            // which type of platform the user is browsing on
            // if a supported platform is not detected it returns 'default'
            // some variations use the same template (ipad,iphone,ipod == ios)
            "getDeviceType": function() {
                var ua, uaArray, i, l, dType;
                ua = navigator.userAgent.toLowerCase();              
                i = 0;
                l = settings.deviceMap.length;
                dType = "default";

                // search the user-agent string for qString and when one is found
                // return the associated device type
                for (i; i < l; i++) {
                    if (ua.indexOf(settings.deviceMap[i].qString) >= 0) {
                        dType = settings.deviceMap[i].dType;
                        break;
                    }
                }

                return dType;
            }
        };

        return this.each(function() {
            var $this, a, href, schemaData, deviceType;
            
            $this = $(this);
            
            //pull schema data from the HTML
            schemaData = methods.getSchemaData($this);
            //determine the device type by user-agent
            deviceType = methods.getDeviceType();
            //build the URL using the location data and device type
            href = methods.buildURL(deviceType, schemaData);
            //create the anchor tag
            a = $("<a />").attr({
                "href": href,
                "title": settings.linkTitle,
                "class": settings.linkClass,
                "target": (settings.openInNewWindow) ? (settings.openInSameWindow) ? "mapLinkWindow" : "_blank" : "_self"
            });
            //inject the anchor tag into the DOM
            $this.wrapInner(a);

        });

    };
})(jQuery);