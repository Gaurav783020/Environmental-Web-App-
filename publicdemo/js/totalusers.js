$(document).ready(function() {
    $('#example').DataTable( 
        {
            "scrollX": true,
        columnDefs: [{
            type: 'time-date-sort',
            targets: [0],
        }],
        order: [
            [0, "desc"]
        ]
    } );
} );

fetch('http://122.176.120.160:5001/getalluser')
  .then(response => response.json())
  .then(data =>{
//    myJsonData = data;
        populateDataTable(data["data"]);

  })

      


// populate the data table with JSON data
function populateDataTable(data) {
    console.log("populating data table...");
    // clear the table before populating it with more data
    $("#example").DataTable().clear();

    $.each(data, function(index, value) {

        var name=value["Name"];
        var Email=value["Email"];
        var Password=value["Password"];
        var Mobile=value["Mobile"];
      
var x="NAN";
        //  var md = JSON.stringify(value, undefined, 4);

        // $('.json').html(JSON.stringify(value, undefined, 4));

        // You could also use an ajax property on the data table initialization
        $('#example').dataTable().fnAddData([
          name,
          Email,
          Password,
          Mobile,
          x
        ])
    })
}