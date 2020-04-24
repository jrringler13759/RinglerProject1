

 
//When the page loads the screen should be clear of any "errors"
$(window).on( "load", function() {
 
});

//get the capital of the country the user types in
$("#search").on("click", function(event){
  event.preventDefault();
  var country = $("#countryInput").val().trim().toLowerCase();
  if (country) {
        $("#countryInput").val("");
    } 
    getCountryInfo(country);
}) 

//get capital from api to search with
function getCountryInfo(country){
  var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://restcountries-v1.p.rapidapi.com/all",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
		"x-rapidapi-key": "52dbb116femsh414adea3d2d39b0p1baee8jsn399515d8751e"
	}
}
$.ajax(settings).done(function (response) {
    
  for (var i = 0; i < response.length; i++) {
    var countryMatch = (response[i].name).toLowerCase(); 
    if (country === countryMatch){
      var capital = response[i].capital;
      $("#capital").text(capital + ", " + response[i].name);

      getPictures(capital);
      getWeather(capital);
      getForecast(capital);
      wikiLink(capital);
    }
    }
});
}


//search for picture based on the capital
function getPictures(capital){
    var queryURL = "https://api.unsplash.com/search/photos?query=" + capital + "&per_page=20&client_id=tLFvPdAvAFpRTR2LhyEwk38gT8ALPvluLPQTUjttXfc"

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response){
      var picList = response.results;     
      showPictures(picList);
    })
}

//shows pictures in a carousel
function showPictures(picList){

  var count = 1;
  for (var i = 0; i < 20; i++){
    var picWidth = picList[i].width;
    var picHeight = picList[i].height;
    if(picWidth > picHeight){
      var picURL = picList[i].urls.regular;
      $("#pic-" + count).attr("src", picURL );
      //$("#pic-" + count).addClass("sizeIt");
      count++;
    }
  }
}

//openweathermap API to get current weather for capital city
function getWeather(capital) { 
  $("#errorMadeArea").hide();   
  var currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + capital + "&APPID=62fca606199df2afea0a32e25faffdc5";

  $.ajax({
      url: currentQueryURL,
      method: "GET"
  }).then(function(response){
    var timeZone = (response.timezone)/60/60;
      showWeather(response);
      console.log(response);
      showTimes(timeZone);
      
      
  });
}
$("#errorMadeArea").hide();   

//show current weather in capital
function showWeather(response){
  $("#capitalCity").text(response.name)
  var icon = response.weather[0].icon;
  var iconURL = "https://openweathermap.org/img/w/" + icon + ".png";
  $("#mainIcon").attr("src", iconURL);
  var mainTemp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(0); 
  $("#temp").text(mainTemp);   
}

//get 3 day forecast for capital
function getForecast(capital){
  var forecastQueryURL= "https://api.openweathermap.org/data/2.5/forecast?q=" + capital + "&APPID=62fca606199df2afea0a32e25faffdc5";;
    $.ajax({
        url:forecastQueryURL,
        method: "GET"
    }).then(showForecast)
}

//show 3 day forecast in a modal
function showForecast(forecastResponse){
  var list = forecastResponse.list;
  var count = 1;   
  for (var i = 0; i < list.length; i++){
 
    if (list[i].dt_txt.includes("15:00:00")) {
        
        $("#date-"+ count).text(new Date(list[i].dt_txt).toLocaleDateString());
        
        var iconURL = "https://openweathermap.org/img/w/" + list[i].weather[0].icon + ".png";
        $("#icon-"+ count).attr("src", iconURL);

        $("#temp-"+ count).text(((list[i].main.temp- 273.15) * 1.80 +32).toFixed(0));
        
        count++; 
    }
  }
}

//show time in capital city
function showTimes(timeZone){
  var currentHrs= moment().utcOffset()/60;
  var timeDif = timeZone-currentHrs;
    if (timeDif === 1) {
      $("#timeDif").text((Math.abs(timeDif)) + " hour ahead");
    } else if (timeDif === -1) {
      $("#timeDif").text((Math.abs(timeDif)) + " hour behind");
    } else if (timeDif === 0){
      $("#timeDif").text("You are in the same time zone");
    } else if (timeDif > 0){
        $("#timeDif").text((Math.abs(timeDif)) + " hours ahead");
    } 
  var capitalTime = moment().utcOffset(timeZone).format('h:mm A ' + ' / ' + 'MMMM Do');
  var weatherDate = moment().utcOffset(timeZone).format('MMMM Do');
  $("#date").text(weatherDate);
  $("#capitalTime").text(capitalTime);

}

function currentTime() {
  $("#dateTime").text(moment().format('MMMM Do YYYY, h:mm:ss a'));
}

setInterval(currentTime,1000)

function wikiLink (capital){
  var wikiURL = "https://en.wikipedia.org/wiki/" + capital;
  $("#wiki-link").text("Link for the " + capital + " " + "Wikipedia Page");
  $("#wiki-link").attr("href", wikiURL);
}

$('.carousel').carousel();
$('#modal1').modal();
