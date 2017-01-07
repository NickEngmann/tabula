var express = require('express');
var router = express.Router();

var liveConnect = require('../lib/liveconnect-client');
var createExamples = require('../lib/create-examples');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}


/* GET Index page */
router.get('/', function (req, res) {
    var authUrl = liveConnect.getAuthUrl();
    res.render('index', { title: 'Tabular', authUrl: authUrl});
});
//initialize Array variables
var array = new Array();
var realBody = new Array();
var chromeArray = new Array();
/* POST Create example request */
router.post('/', function (req, res, next) {
    var accessToken = req.cookies['access_token'];
    var exampleType = req.body['submit'];

    // Render the API response with the created links or with error output
    var createResultCallback = function (error, httpResponse, body) {
        if (error) {
            return res.render('error', {
                message: 'HTTP Error',
                error: {details: JSON.stringify(error, null, 2)}
            });
        }

        // Parse the body since it is a JSON response
        var parsedBody;
        try {
            parsedBody = JSON.parse(body);
            var lengthResults = parsedBody.value.length;
        } catch (e) {
            parsedBody = {};
        }
        // Get the submitted resource url from the JSON response
        var resourceUrl = parsedBody['links'] ? parsedBody['links']['oneNoteWebUrl']['href'] : null;

        if (resourceUrl) {
            res.render('result', {
                title: 'OneNote API Result',
                body: body,
                resourceUrl: resourceUrl
            });
        } else {
            res.render('error', {
                message: 'OneNote API Error',
                error: {status: httpResponse.statusCode, details: body}
            });
        }
    };
    var createCallback = function (error, httpResponse, body) {
        var stringChromeArray = JSON.stringify(realBody);
        // localStorage.setItem('tabular', stringChromeArray);
        // console.log(localStorage.getItem('tabular'));
        var minute = 600 * 1000;
        console.log(stringChromeArray);
        res.cookie('tabular', stringChromeArray, { maxAge: minute });
        // res.redirect('back');
        // if (error) {
        //     return res.render('error', {
        //         message: 'HTTP Error',
        //         error: {details: JSON.stringify(error, null, 2)}
        //     });
        // }
        // // Get the submitted resource url from the JSON response
        // var resourceUrl = null;

        // if (resourceUrl) {
        //     res.render('result', {
        //         title: 'OneNote API Result',
        //         body: realBody,
        //         resourceUrl: resourceUrl
        //     });

        // } else {
        //     res.render('error', {
        //         message: 'OneNote API Error',
        //         error: {status: httpResponse.statusCode, details: realBody}
        //     });
        // }
    };
    var createBetweenCallback = function (error, httpResponse, body) {
        // Parse the body since it is a JSON response
        var regexText = body.match(/highlight" style="margin-top:0pt.*?\</g);
        if(regexText != null){
            if(regexText.length > 0){
                //convert title to string
                var regexTitle1 = body.match(/title>.*?\</g);
                var regexTitle2 = regexTitle1[0].match(/\>.*?\</g);
                var stringTitle = regexTitle2.toString();
                var realTitle = stringTitle.slice(1, -1);
                //convert text into strings
                for(var g = 0; g < regexText.length; g++){
                    var regexText2 = regexText[g].match(/\>.*?\</g);
                    var stringRegex = regexText2.toString()
                    realText = stringRegex.slice(1, -1)
                    realBody.push(realText);
                    chromeArray.push([realTitle, realText]);
                }
            }
        }

    };
    var createSearchCallback = function (error, httpResponse, body) {
        // Parse the body since it is a JSON response
        var parsedBody;
        try {
            parsedBody = JSON.parse(body);
            var lengthResults = parsedBody.value.length;
            for(var i = 0; i< lengthResults; i++){
                array.push(parsedBody.value[i].contentUrl);
            }
            while(array.length > 0){
                createExamples.createPageWithSearchResults(accessToken, createBetweenCallback, array);
            }
            if(array.length == 0){
                // console.log(chromeArray);

                //for now I am just going to stringify the text array to save space.
                createExamples.createPageWithSearch(accessToken, createCallback);
            }
            createExamples.createPageWithSearch(accessToken, createCallback);
        } catch (e) {
            parsedBody = {};
        }
    };
    // Request the specified create example
    switch (exampleType) {
        case 'text':
            createExamples.createPageWithSimpleText(accessToken, createResultCallback);
            break;
        case 'textimage':
            createExamples.createPageWithTextAndImage(accessToken, createResultCallback);
            break;
        case 'html':
            createExamples.createPageWithScreenshotFromHtml(accessToken, createResultCallback);
            break;
        case 'url':
            createExamples.createPageWithScreenshotFromUrl(accessToken, createResultCallback);
            break;
        case 'file':
            createExamples.createPageWithFile(accessToken, createResultCallback);
            break;
        case 'search':
            createExamples.createPageWithSearch(accessToken, createSearchCallback);
            break;
    }
});

module.exports = router;
