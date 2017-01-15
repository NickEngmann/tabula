/*
 * This file is part of Adblock Plus <https://adblockplus.org/>,
 * Copyright (C) 2006-2016 Eyeo GmbH
 *
 * Adblock Plus is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Adblock Plus is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adblock Plus.  If not, see <http://www.gnu.org/licenses/>.
 */

var RegExpFilter = require("filterClasses").RegExpFilter;
var ElemHide = require("elemHide").ElemHide;
var checkWhitelisted = require("whitelisting").checkWhitelisted;
var extractHostFromFrame = require("url").extractHostFromFrame;
var port = require("messaging").port;
var devtools = require("devtools");

port.on("get-selectors", function(msg, sender)
{
  var selectors;
  var trace = devtools && devtools.hasPanel(sender.page);

  if (!checkWhitelisted(sender.page, sender.frame,
                        RegExpFilter.typeMap.DOCUMENT |
                        RegExpFilter.typeMap.ELEMHIDE))
  {
    var specificOnly = checkWhitelisted(sender.page, sender.frame,
                                        RegExpFilter.typeMap.GENERICHIDE);
    selectors = ElemHide.getSelectorsForDomain(
      extractHostFromFrame(sender.frame),
      specificOnly ? ElemHide.SPECIFIC_ONLY : ElemHide.ALL_MATCHING
    );
  }
  else
  {
    selectors = [];
  }

  return {selectors: selectors, trace: trace};
});

port.on("forward", function(msg, sender)
{
  var targetPage;
  if (msg.targetPageId)
    targetPage = ext.getPage(msg.targetPageId);
  else
    targetPage = sender.page;

  if (targetPage)
  {
    msg.payload.sender = sender.page.id;
    if (msg.expectsResponse)
      return new Promise(targetPage.sendMessage.bind(targetPage, msg.payload));
    targetPage.sendMessage(msg.payload);
  }
});

//function to get the cookies from the webApp
function getCookies(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    });
}

//every 10 seconds I get the cookies from the web app
setInterval( function () {
  getCookies("https://www.tabular-webapp.com", "tabular", function(id) {
    //fully decode the cookies from the web app
    var decodeString = decodeURIComponent(id);
    var noApostrophe = decodeString.replace(/&#39;/g, "'");
    var array = noApostrophe.split("&&");
    if(array.length > 15){
      getCookies("https://www.tabular-webapp.com", "tabular2", function(id2) {
        //don't mind me, just decoding more cookies
        decodeString = decodeURIComponent(id2);
        noApostrophe = decodeString.replace(/&#39;/g, "'");
        tempArray = noApostrophe.split("&&");
        array = array.concat(tempArray);
          if(array.length > 30){
            getCookies("https://www.tabular-webapp.com", "tabular3", function(id3) {
              //don't mind me, just decoding more cookies
              decodeString = decodeURIComponent(id3);
              noApostrophe = decodeString.replace(/&#39;/g, "'");
              tempArray = noApostrophe.split("&&");
              array = array.concat(tempArray);
              if(array.length > 50){
                getCookies("https://www.tabular-webapp.com", "tabular4", function(id4) {
                  //don't mind me, just decoding more cookies
                  decodeString = decodeURIComponent(id4);
                  noApostrophe = decodeString.replace(/&#39;/g, "'");
                  tempArray = noApostrophe.split("&&");
                  array = array.concat(tempArray);
                  if(array.length > 65){
                    getCookies("https://www.tabular-webapp.com", "tabular5", function(id5) {
                      //don't mind me, just decoding more cookies
                      decodeString = decodeURIComponent(id4);
                      noApostrophe = decodeString.replace(/&#39;/g, "'");
                      tempArray = noApostrophe.split("&&");
                      array = array.concat(tempArray);
                    })
                  }
                })
              }
            }) 
          }
      })
    }
    if(array != null){
      //if the array exists then I need to go ahead and save it into chrome storage
      chrome.storage.local.set({'tabularResults': array}); 
    }
  })
}, 30000);
