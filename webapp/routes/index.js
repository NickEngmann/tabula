var express = require('express');
var router = express.Router();

var liveConnect = require('../lib/liveconnect-client');
var createExamples = require('../lib/create-examples');


/* GET Index page */
router.get('/', function (req, res) {
    var authUrl = liveConnect.getAuthUrl();
    res.render('index', { title: 'Tabular', oneNoteTitle: 'One Note', everNoteTitle: 'More Features In Development', authUrl: authUrl});
});
//initialize Array variables
var array = new Array();
var realBody = new Array();
var chromeArray = new Array();
var queueSize;
/* POST request */
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
        var stringChromeArray;
        for (var h = 0; h < realBody.length; h++){
            if(h == 0){
                stringChromeArray = realBody[h].toString();
            }
            else{
                stringChromeArray += realBody[h].toString();
            }
            if(h != (realBody.length - 1)){
                //insert a delimeter
                stringChromeArray += "&&";
            }
         }
        var minute = 60 * 10000;
        //check to make sure the body and the string array match with the added delimeters
        console.log("real Array " + realBody); 
        console.log("Delimeter added String Array  " + stringChromeArray);
        if(stringChromeArray){
            var cookiesLength = 1;
            var lowerBound = 0;
            var upperBound = cookiesLength*2000;
            res.cookie('tabular', stringChromeArray.slice(lowerBound,upperBound), { maxAge: minute });
            //convert the array to cookies
            while(stringChromeArray.length > cookiesLength*2000){
                lowerBound = cookiesLength * 2000;
                cookiesLength = cookiesLength + 1;
                upperBound = cookiesLength*2000;
                res.cookie('tabular' + cookiesLength.toString(), stringChromeArray.slice(lowerBound,upperBound), { maxAge: minute });
            }
            //destroy all globals
            realBody = []; 
            array = [];
            chromeArray = [];
            queueSize = 0;
        }
        res.render('error', {
            message: 'Tabular - Success',
            error: {status: httpResponse.statusCode, details: "Sync Complete! Refresh this page in 10 seconds and check out the box below to see tabular in action!"}
        });
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
                queueSize += (regexText.length - 1);
                for(var g = 0; g < regexText.length; g++){
                    var regexText2 = regexText[g].match(/\>.*?\</g);
                    var stringRegex = regexText2.toString();
                    realText = stringRegex.slice(1, -1);
                    realBody.push(realText);
                    chromeArray.push([realTitle, realText]);
                }
            }
        }
        else{
            queueSize -= 1;
        }
        console.log("queueSize is "+ queueSize);
        if(realBody.length == queueSize){
            createExamples.createPageWithSearch(accessToken, createCallback);
        }

    };
    var createSearchCallback = function (error, httpResponse, body) {
        // Parse the body since it is a JSON 
        var parsedBody;
        try {
            parsedBody = JSON.parse(body);
            console.log("Body returned by Search Callback " + parsedBody.value);
            var lengthResults = parsedBody.value.length;
            //console.log(lengthResults);
            for(var i = 0; i< lengthResults; i++){
                array.push(parsedBody.value[i].contentUrl);
            }
            console.log(array);
            queueSize = array.length;
            while(array.length > 0){
                //continue to call the createPagewithSearch results to get the actual text content from those pages until realbody is equal to queueSize
                createExamples.createPageWithSearchResults(accessToken, createBetweenCallback, array);
            }

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
