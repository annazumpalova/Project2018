function getInfo() {
    let stopId = $('#stopId').val();
    let list = $('#buses');
    list.empty();

    let getRequest = {
        method: 'GET',
        url : `https://judgetests.firebaseio.com/businfo/${stopId}.json`,
        success: displayBusStop,
        error: displayError
    };

    $.ajax(getRequest);

   /* $.get(`https://judgetests.firebaseio.com/businfo/${stopId}.json`)
        .then(displayBusStop)
        .catch(displayError);
        */

    function displayBusStop(busStopInfo) {
        $('#stopName').text(busStopInfo.name);
        let buses = busStopInfo.buses;

        for(let key in buses){
            let busMinutes = buses[key];
            let listItem = $('<li>');
            listItem.text(`Bus ${key} arrives in ${busMinutes} minutes`);
            list.append(listItem);
        }
    }
    
    function displayError() {
        $('#stopName').text('Error')
    }
}