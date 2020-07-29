let chartdata = null;

function getDrawnChart(drawnItems) {
    // if there's nothing to get charts for then quit
    let geojson = drawnItems.toGeoJSON()['features'];
    if (geojson.length === 0 && chosenRegion === '') {
        return
    }

    $("#chart").html('<div class="load"><img src="https://media.giphy.com/media/jAYUbVXgESSti/giphy.gif"></div>');

    let coords = geojson[0]['geometry']['coordinates'];
    let loc_type = geojson[0]['geometry']['type'];
    let variable = $("#variables").val();

    if (loc_type === 'Polygon') {
        coords = [coords[0][0][0], coords[0][0][1], coords[0][2][0], coords[0][2][1]]
    }

    // setup a parameters json to generate the right timeserie
    let data = {
        coords: coords,
        variable: variable,
        loc_type: loc_type,
    };

    $("#chart_modal").modal('show');
    // decide which ajax url you need based on drawing type
    $.ajax({
        url: URL_requestTimeSeries,
        data: data,
        dataType: 'json',
        contentType: "application/json",
        method: 'GET',
        success: function (result) {
            // clear the loading gif
            $("#chart").html('');
            // save the data sent back by python to a global variable we can use later
            chartdata = result;
            // call the function to create a plotly graph of the data
            plotlyTimeseries(chartdata);
        }
    })
}