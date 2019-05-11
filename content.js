function httpGet(theUrl, successFunction, errorFunction)
{
    let result = "";
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onerror = function() {
        errorFunction();
    }

    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            result = xmlhttp.responseText;
            successFunction(result);
        }
    }

    xmlhttp.open("GET", theUrl, false );
    xmlhttp.send();
}

function directShare(url, listElement) {
    console.log("getting direct link of " + url);
    $(listElement).children().get(0).innerText = "Loading...";
    let jsonUrl = url + ".json";
    httpGet(jsonUrl, function (result) {
        let jsonParsed = JSON.parse(result);
        // check if crosspost
        let data = jsonParsed[0]["data"]["children"][0]["data"];
        let fallbackUrl = "Something went wrong!";
        if(!data["media"]) {
            fallbackUrl = data["crosspost_parent_list"][0]["media"]["reddit_video"]["fallback_url"];
        } else {
            fallbackUrl = data["media"]["reddit_video"]["fallback_url"];
        }
        $(listElement).children().get(0).innerText = "direct-link";
        prompt("Direct Link:", fallbackUrl);
    }, function () {
        $(listElement).children().get(0).innerText = "direct-link";
    })
}
$(document).ready(function () {

    // check if in comments or on scroll page

    if(window.location.href.includes("comments")) {
        if($(".domain")[0].innerHTML.includes("v.redd.it")) {
            let listElement = $($(".post-sharing-button").get(0).parentElement).get(0);
            let dataUrl = window.location.href;
            let directLinkButton = "<li><a href='javascript: void 0;'>direct-link</a></li>";
            $(listElement).after(directLinkButton);
            $($(listElement).next()).click(function () {
                directShare(dataUrl, this);
            });
        }
    } else {
        let topics = $("#siteTable").children();
        for (let index = 0; index < topics.length; index++) {
            let currentDiv = topics.get(index);
            // if we have the MALICIOUS case of v.reddit media
            if (currentDiv.getAttribute("data-domain") === "v.redd.it") {
                // find its share-button
                let shareButton = $(currentDiv).find(".post-sharing-button").get(0);
                let dataUrl = "https://reddit.com" + currentDiv.getAttribute("data-permalink");
                let directLinkButton = "<li><a href='javascript: void 0;'>direct-link</a></li>";
                let listElement = $(shareButton.parentElement).get(0);
                $(listElement).after(directLinkButton);
                $($(listElement).next()).click(function () {
                    directShare(dataUrl, this);
                });
            }
        }
    }
});