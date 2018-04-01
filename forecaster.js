$(document).ready(function() {
    const baseUrl = 'https://judgetests.firebaseio.com';
   $('#submit').click(loadForecast);
    
   function request(endpoint) {
       return $.ajax({
           method: "GET",
           url: baseUrl + endpoint
       })
   }

   function loadForecast() {
       request('/locations.json')
           .then(displayLocations)
           .catch(handleError)
   }
   
   function displayLocations(dataArr) {
       let inputLocation = $('#location').val();
       let code = dataArr.filter(loc => loc['name'] === inputLocation)
           .map(loc => loc['code'])[0];

           if(!code){
               handleError();
           }

           let forecastToday = request(`/forecast/today/${code}.json`);
           let forecastUpcoming = request(`/forecast/upcoming/${code}.json`);
           Promise.all([forecastToday, forecastUpcoming])
               .then(displayAllForecast)
               .catch(handleError);
   }
   
   function displayAllForecast([todayWeather, upcomingWeather]) {
       let weatherSymbols = {
           'Sunny' : '&#x2600;',
           'Partly sunny' : '&#x26C5;',
           'Overcast': '&#x2601;',
           'Rain' : '&#x2614;',
           'Degrees' : '&#176;'
       }

       let forecast = $('#forecast');
       forecast.css('display', 'block');
       displayToCurrent(todayWeather, weatherSymbols);
       displayToUpcoming(upcomingWeather, weatherSymbols);
   }

   //objects in object
   function displayToCurrent(todayWeather, weatherSymbols) {
        let current = $('#current');
        current.empty();
        current.append($('<div class="label">Current conditions</div>'))
            .append($(`<span class='condition symbol'>${weatherSymbols[todayWeather['forecast']['condition']]}</span>`))
            .append($(`<span class = 'condition' >`)
                .append($(`<span class='forecast-data'>${todayWeather['name']}</span>`))
                .append($(`<span class='forecast-data'>${todayWeather['forecast']['low']}&#176;/${todayWeather['forecast']['high']}&#176;</span>`))
                .append($(`<span class='forecast-data'>${todayWeather['forecast']['condition']}</span>`)));
   }

   //array from object -forecast
   function displayToUpcoming(upcomingWeather, weatherSymbols) {
       let upcoming = $('#upcoming');
       upcoming.empty();
       upcoming.append($('<div class="label">Three day forecast</div>'));
       let data = upcomingWeather['forecast'];
       console.log(data);
       for(let info of data){
           upcoming.append($(`<span class = 'upcoming'>`)
                   .append($(`<span class='symbols'>${weatherSymbols[info['condition']]}</span>`))
                   .append($(`<span class='forecast-data'>${info['low']}&#176;/${info['high']}&#176;</span>`))
                   .append($(`<span class='forecast-data'>${info['condition']}</span>`)));
       }
   }
   
   function handleError() {
        $('#forecast').css('display', 'block')
            .text('Error');
   }
});