// pie chart
let status_labels = Object.keys(code_frequencies);
let status_data = Object.values(code_frequencies);
let status_sum = 0;
for (let data of status_data) {
    status_sum += data;
}

// line chart
const sortedKeys = Object.keys(timestamp_logs).sort((a, b) => {
  const parseDate = str => new Date(str.replace(/(\d{2})\/(\w{3})/, (_, d, m) => {
    const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
    return `2025-${months[m]}-${d}`;
  }));
  return parseDate(a) - parseDate(b);
});

// map
document.addEventListener('DOMContentLoaded', async () => {
    let ping_icon;
    let count;
    let ip_keys = Object.keys(unique_ips_location)
    if (!ips) return;
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    let redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let yellowIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    let greenIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
      const div = L.DomUtil.create('div', 'legend');
      div.innerHTML += '<i style="background: red"></i>High Concentration<br><br>';
      div.innerHTML += '<i style="background: yellow"></i>Medium Concentration<br><br>';
      div.innerHTML += '<i style="background: green"></i>Low Concentration<br><br>';
      return div;
    };

    legend.addTo(map);

    for (const ip of ips) {
        let ip_base = ip.split('.')
        ip_base = ip_base[0] + '.' + ip_base[1]
        for (const key of ip_keys) {
            if (ip_base === key) {
                count = unique_ips_location[key]
                }
            }
        if (high_conc.includes(ip_base)) {
            ping_icon = redIcon
        }
        else if (mid_conc.includes(ip_base)) {
            ping_icon = yellowIcon
        }
        else {
            ping_icon = greenIcon
        }
        
        try {
            const res = await fetch(`http://ip-api.com/json/${ip}`);
            const data = await res.json();
            if (data.status === "success") {
                L.marker([data.lat, data.lon], {icon:ping_icon}).addTo(map)
                    .bindPopup(`IP: ${ip}, COUNT: ${count}`);
            }
        } catch (e) {
        }
    }
});

const timestamp_labels = sortedKeys;
const timestamp_data = sortedKeys.map(key => timestamp_logs[key]);

let requestChart;
let statusChart;
let errorChart;

function createChart() {
    const requestCtx = document.getElementById('requestChart').getContext('2d');
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    const barCtx = document.getElementById('errorChart').getContext('2d');

    const average = timestamp_data.reduce((a, b) => a + b) / timestamp_data.length;

    requestChart = new Chart(requestCtx, {
    type: 'line',
    data: {
        labels: timestamp_labels,
        datasets: [
            {
                label: 'Logs',
                data: timestamp_data,
                borderColor: (ctx) => {
                    const index = ctx.dataIndex;
                    return timestamp_data[index] > average ? 'rgb(34, 197, 94)' : 'rgb(220, 38, 38)';
                },
                backgroundColor: (ctx) => {
                    const index = ctx.dataIndex;
                    return timestamp_data[index] > average ? 'rgba(34, 197, 94, 0.2)' : 'rgba(220, 38, 38, 0.2)';
                },
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                segment: {
                    borderColor: ctx => {
                        const i = ctx.p1DataIndex;
                        return timestamp_data[i] > average ? 'rgb(34, 197, 94)' : 'rgb(220, 38, 38)';
                    },
                    backgroundColor: ctx => {
                        const i = ctx.p1DataIndex;
                        return timestamp_data[i] > average ? 'rgba(34, 197, 94, 0.2)' : 'rgba(220, 38, 38, 0.2)';
                    }
                }
            },
            {
                label: 'Average',
                data: Array(timestamp_data.length).fill(average),
                borderColor: 'white',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                color: 'white',
                display: true,
                text: 'Logs Over Time',
                font: {
                    size: 18
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: '#666'
                }
            },
            y: {
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: '#666'
                }
            }
        }
    }
});


    statusChart = new Chart(statusCtx, {
    type: 'pie',
    data: {
        labels: status_labels,
        datasets: [{
            label: 'Occurrences',
            data: status_data,
            backgroundColor: ['#35ca44','brown','red','yellow','orange','purple','pink',
                              'blue','white','black','gray', 'cyan','green'],
            borderWidth: 2, 
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    font: {
                        size: 14,
                        family: 'Arial',
                        weight: 'bold'
                    },
                    color: 'white',
                    boxWidth: 20,
                    usePointStyle: true
                }
            },
            title: {
                color: 'white',
                display: true,
                text: 'Status Code Distribution',
                font: {
                    size: 18
                },
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        const percentage = ((value / status_sum) * 100).toFixed(1);
                        return `${context.label}: ${value} (${percentage}%)`;
                    }
                }
            },
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold',
                    size: 13
                },
                formatter: function(value, context) {
                    const percentage = ((value / status_sum) * 100).toFixed(1);
                    return `Occurences${value}, (${percentage}%)`;
                }
            }
        }
    },
});

    
    errorChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: error_hour_labels,
            datasets: [{
                label: 'Errors per Hour',
                data: error_hour_data,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 0, 0, 0.75)',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                },
                title: {
                    color: 'white',
                    display: true,
                    text: 'Errors by Hour of Day',
                    font: {
                        size: 18
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: '#666'
                    }
                },
                y: {
                    ticks: {
                        color: 'white'
                    },
                    grid: {
                        color: '#666'
                    }
                }
            }
        }
    });
}

createChart();

document.addEventListener("DOMContentLoaded", function () {
    const backToTop = document.getElementById("backToTop");
    window.addEventListener("scroll", function () {
        if (window.scrollY > 200) {
            backToTop.style.display = "block";
        } else {
            backToTop.style.display = "none";
        }
    });
    backToTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}); 

const downloadBtn = document.getElementById("downloadLogBtn");
const downloadModal = document.getElementById("downloadModal");
const closeModalBtn = document.getElementById("closeModalBtn");

downloadBtn.addEventListener("click", () => {
    downloadModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
    downloadModal.style.display = "none";
});

downloadModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
        downloadModal.style.display = "none";
    }
});
