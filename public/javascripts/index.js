$(document).ready(function() {
    var timeSum = 0,
        temperatureSum = 0,
        humiditySum = 0,
        noiceSum = 0,
        heartrateSum = 0,
        luxSum = 0,
        indexSum = 0;
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
                label: 'Noise',
                yAxisID: 'Noise',
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
            text: 'Lux & Noise Real-time Data',
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
                id: 'Noise',
                type: 'linear',
                scaleLabel: {
                    labelString: 'Noise',
                    display: true
                },
                position: 'right'
            }]
        }
    }

    var basicOption3 = {
        title: {
            display: true,
            text: 'Heartrate & Sleep Quality Index Real-time Data',
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
            temperatureSum += obj.temperature;
            noiceData.push(obj.noice);
            noiceSum += obj.noice;
            heartrateData.push(obj.heartrate);
            heartrateSum += obj.heartrate;
            luxData.push(obj.lux);
            luxSum += obj.lux;

            var tempindex = 1750 / (16 + obj.noice * 5 + obj.lux / 100 + Math.abs(obj.temperature - 16) / 10 + Math.abs(obj.humidity - 45) / 10);
            var state = "N/A";
            if (tempindex > 100) {
                tempindex = 100;
            }
            if (tempindex < 0) {
                tempindex = 0;
            }
            if (tempindex < 33) {
                state = "bad";
            }
            if (tempindex >= 33 && tempindex <= 66) {
                state = "medium";
            }
            if (tempindex > 66) {
                state = "good";
            }

            indexData.push(tempindex);
            indexSum += tempindex;

            // only keep no more than 50 points in the line chart
            const maxLen = 50;
            var len = timeData.length;
            if (len > maxLen) {
                timeData.shift();
                temperatureData.shift();
                noiceData.shift();
                heartrateData.shift();
                luxData.shift();
                indexData.shift();
            }

            if (obj.humidity) {
                humidityData.push(obj.humidity);
                humiditySum += obj.humidity;
            }
            if (humidityData.length > maxLen) {
                humidityData.shift();
            }


            document.getElementById("avgtemp").innerHTML = "avgtemp:" + temperatureSum / temperatureData.length;
            document.getElementById("avghumid").innerHTML = "avghumid:" + humiditySum / humidityData.length;
            document.getElementById("avgnoise").innerHTML = "avgnoise:" + noiceSum / noiceData.length;
            document.getElementById("avglux").innerHTML = "avglux:" + luxSum / luxData.length;
            document.getElementById("avgindex").innerHTML = "avgindex:" + indexSum / indexData.length;
            document.getElementById("state").innerHTML = "current sleep state:" + state;

            if (obj.lux>1500) {
              window.alert("Could you please help this sleeping person close the light?");
            }
            

            myLineChart.update();
            myLineChart2.update();
            myLineChart3.update();
        } catch (err) {
            console.error(err);
        }
    }
});