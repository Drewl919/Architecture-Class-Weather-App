let weather = [];
let graphData = {
    'date': [],
    'celsius': [],
    'fahrenheit': [],
    'humidity': []
}

function load(file) {
    let minutes = 4;
    document.getElementById("data").href = `${file}.html`
    let ref = new Firebase(`https://weather-data-90123-default-rtdb.firebaseio.com/${file}/`);
    let ct = 0;
    ref.on("child_added", function (data) {
        let newData = data.val();
        weather[ct] = [newData.date, parseFloat(newData.cTemp).toFixed(1), parseFloat(newData.fTemp).toFixed(1), parseFloat(newData.humidity).toFixed(1)];
        ct++;
    });
    (function countdown(remaining) {
        if (remaining <= 0)
            location.reload(true);
        document.getElementById('countdown').innerHTML = `Refreshing page in: ${remaining} seconds`;
        setTimeout(function () {
            countdown(remaining - 1);
        }, 1000);
    })(60 * minutes);
    let dt = new Date();
    document.getElementById('date-time').innerHTML = dt.toISOString();
    let delayInMilliseconds = 1000
    setTimeout(function() {
        table(false)
    }, delayInMilliseconds);
}

function table(n) {
    setUpGraphData(n);
    document.getElementById("refresh").innerHTML = "<br><button type='button' class='btn btn-outline-danger' onclick='window.location.reload()'>Refresh Data</button>";
    let oStr = "";
    let tempData; //Sets if it should be Celsius (t) or Fahrenheit (f)
    oStr += "<table class='table table-bordered table-hover ' id='dataTable'><thead class='thead-light'><tr><th>Time</th><th>Temperature</th><th>Humidity</th></tr></thead>";
    oStr += "<tbody>";
    let symbol;
    if (n) {
        tempData = 1;
        symbol = "&degC";
        document.getElementById("bt1").style.backgroundColor = "gray";
        document.getElementById("bt2").style.backgroundColor = "black";
    } else {
        tempData = 2;
        symbol = "&degF";
        document.getElementById("bt1").style.backgroundColor = "black";
        document.getElementById("bt2").style.backgroundColor = "gray";
    }
    for (let i = weather.length - 1; i > 0; i--) {
        let data = weather[i];
        oStr += "<tr>";
        oStr += `<td>${data[0]}</td>`;
        oStr += `<td>${data[tempData]}${symbol}</td>`;
        oStr += `<td>${data[3]}%</td>`;
        oStr += "</tr>";
    }
    oStr += "</tbody></table>";
    document.getElementById("chart").innerHTML = oStr;
    $('#dataTable').DataTable({
        "pageLength": 20,
        "paging": true,
        "lengthChange": false,
        "searching": false,
        "ordering": false,
        "info": true,
        "autoWidth": true
    });
}

function setUpGraphData(type) {
    let ct = 0;
    if(weather.length<20) {
        for (let i = weather.length-1; i < weather.length; i++) {
            let data = weather[i];
            // console.log(`${weather[i]}`);
            graphData.date[ct] = data[0];
            graphData.celsius[ct] = data[1];
            graphData.fahrenheit[ct] = data[2];
            graphData.humidity[ct] = data[3];
            ct++;
        }
    } else {
        for (let i = weather.length - 20; i < weather.length; i++) {
            let data = weather[i];
            graphData.date[ct] = data[0];
            graphData.celsius[ct] = data[1];
            graphData.fahrenheit[ct] = data[2];
            graphData.humidity[ct] = data[3];
            ct++;
        }
    }
    document.getElementById("myChart").style.maxHeight = "800px";
    let data;
    let label;
    if (type) {
        data = graphData.celsius;
        label = "Celsius"
    } else {
        data = graphData.fahrenheit;
        label = "Fahrenheit";
    }
    new Chart("myChart", {
        type: "line",
        data: {
            labels: graphData.date,
            datasets: [{
                label: label,
                data: data,
                borderColor: "red",
                fill: false
            }, {
                label: "Humidity (%)",
                data: graphData.humidity,
                borderColor: "blue",
                fill: false
            }]
        },
        options: {
            legend: {display: true},
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            layout: {
                padding: {
                    left: 0,
                    right: 4,
                    top: 0,
                    bottom: 0
                }
            }
        }
    });
}

