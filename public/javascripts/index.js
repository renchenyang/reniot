$(document).ready(function() {
    var timeData = [],
        temperatureData = [],
        humidityData = [],
        noiceData = [],
        heartrateData = [],
        luxData = [],
        indexData = [];
    var data = {
        labels: timeData,
        datasets: [{
                fill: false,
                label: 'Temperature',
                yAxisID: 'Temperature',
                borderColor: "rgba(255, 204, 0, 1)",
                pointBoarderColor: "rgba(255, 204, 0, 1)",
                backgroundColor: "rgba(255, 204, 0, 0.4)",
                pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                data: temperatureData
            },
            {
                fill: false,
                label: 'Humidity',
                yAxisID: 'Humidity',
                borderColor: "rgba(24, 120, 240, 1)",
                pointBoarderColor: "rgba(24, 120, 240, 1)",
                backgroundColor: "rgba(24, 120, 240, 0.4)",
                pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
                pointHoverBorderColor: "rgba(24, 120, 240, 1)",
                data: humidityData
            }
        ]
    }

    var data2 = {
        labels: timeData,
        datasets: [{
                fill: false,
                label: 'Lux',
                yAxisID: 'Lux',
                borderColor: "rgba(255, 204, 0, 1)",
                pointBoarderColor: "rgba(255, 204, 0, 1)",
                backgroundColor: "rgba(255, 204, 0, 0.4)",
                pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                data: luxData
            },
            {
                fill: false,
                label: 'Noice',
                yAxisID: 'Noice',
                borderColor: "rgba(24, 120, 240, 1)",
                pointBoarderColor: "rgba(24, 120, 240, 1)",
                backgroundColor: "rgba(24, 120, 240, 0.4)",
                pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
                pointHoverBorderColor: "rgba(24, 120, 240, 1)",
                data: noiceData
            }
        ]
    }

    var data3 = {
        labels: timeData,
        datasets: [{
                fill: false,
                label: 'Index',
                yAxisID: 'Index',
                borderColor: "rgba(255, 204, 0, 1)",
                pointBoarderColor: "rgba(255, 204, 0, 1)",
                backgroundColor: "rgba(255, 204, 0, 0.4)",
                pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
                pointHoverBorderColor: "rgba(255, 204, 0, 1)",
                data: indexData
            },
            {
                fill: false,
                label: 'heartrate',
                yAxisID: 'heartrate',
                borderColor: "rgba(24, 120, 240, 1)",
                pointBoarderColor: "rgba(24, 120, 240, 1)",
                backgroundColor: "rgba(24, 120, 240, 0.4)",
                pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
                pointHoverBorderColor: "rgba(24, 120, 240, 1)",
                data: heartrateData
            }
        ]
    }

    var basicOption = {
        title: {
            display: true,
            text: 'Temperature & Humidity Real-time Data',
            fontSize: 36
        },
        scales: {
            yAxes: [{
                id: 'Temperature',
                type: 'linear',
                scaleLabel: {
                    labelString: 'Temperature(C)',
                    display: true
                },
                position: 'left',
            }, {
                id: 'Humidity',
                type: 'linear',
                scaleLabel: {
                    labelString: 'Humidity(%)',
                    display: true
                },
                position: 'right'
            }]
        }
    }

    var basicOption2 = {
        title: {
            display: true,
            text: 'Lux & Noice Real-time Data',
            fontSize: 36
        },
        scales: {
            yAxes: [{
                id: 'Lux',
                type: 'linear',
                scaleLabel: {
                    labelString: 'Lux',
                    display: true
                },
                position: 'left',
            }, {
                id: 'Noice',
                type: 'linear',
                scaleLabel: {
                    labelString: 'Noice',
                    display: true
                },
                position: 'right'
            }]
        }
    }

    var basicOption3 = {
        title: {
            display: true,
            text: 'heartrate & Index Real-time Data',
            fontSize: 36
        },
        scales: {
            yAxes: [{
                id: 'heartrate',
                type: 'linear',
                scaleLabel: {
                    labelString: 'heartrate',
                    display: true
                },
                position: 'left',
            }, {
                id: 'Index',
                type: 'linear',
                scaleLabel: {
                    labelString: 'sleep index(%)',
                    display: true
                },
                position: 'right'
            }]
        }
    }

    //Get the context of the canvas element we want to select
    var ctx = document.getElementById("myChart").getContext("2d");
    var ctx2 = document.getElementById("myChart2").getContext("2d");
    var ctx3 = document.getElementById("myChart3").getContext("2d");
    var optionsNoAnimation = { animation: false }
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: basicOption
    });
    var myLineChart2 = new Chart(ctx2, {
        type: 'line',
        data: data2,
        options: basicOption2
    });
    var myLineChart3 = new Chart(ctx3, {
        type: 'line',
        data: data3,
        options: basicOption3
    });

    var ws = new WebSocket('wss://' + location.host);
    ws.onopen = function() {
        console.log('Successfully connect WebSocket');
    }
    ws.onmessage = function(message) {
        console.log('receive message' + message.data);
        try {
            var obj = JSON.parse(message.data);
            if (!obj.time || !obj.temperature) {
                return;
            }
            timeData.push(obj.time);
            temperatureData.push(obj.temperature);
            noiceData.push(obj.noice);
            heartrateData.push(obj.heartrate);
            luxData.push(obj.lux);
            indexData.push(obj.index);
            // only keep no more than 50 points in the line chart
            const maxLen = 50;
            var len = timeData.length;
            if (len > maxLen) {
                timeData.shift();
                temperatureData.shift();
            }

            if (obj.humidity) {
                humidityData.push(obj.humidity);
            }
            if (humidityData.length > maxLen) {
                humidityData.shift();
            }

            myLineChart.update();
        } catch (err) {
            console.error(err);
        }
    }
});