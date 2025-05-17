// pie chart
let status_labels = Object.keys(code_frequencies);
let status_data = Object.values(code_frequencies);

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
    if (!ips) return;
    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    for (const ip of ips) {
        try {
            const res = await fetch(`http://ip-api.com/json/${ip}`);
            const data = await res.json();
            if (data.status === "success") {
                L.marker([data.lat, data.lon]).addTo(map)
                    .bindPopup(`IP: ${ip}`);
            }
        } catch (e) {
        }
    }
});

const timestamp_labels = sortedKeys;
const timestamp_data = sortedKeys.map(key => timestamp_logs[key]);

let requestChart;
let statusChart;
let barChart;

const green = '#00F'//colors.green[600];
const yellow = '#AAA'//colors.yellow[400];
const red = '#F00'//colors.red[600];
const gray = '333'//colors.gray[300];

function getChartColors() {
    const isDark = document.documentElement.classList.contains('dark');

    return {
        textColor: isDark ? 'gray' : '#fff',
        gridColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        backgroundColor: isDark ? '#1f2937' : 'gray',
        borderColor: isDark ? 'gray' : '#000', 
    };
}

function createChart() {
    const requestCtx = document.getElementById('requestChart').getContext('2d');
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    const barCtx = document.getElementById('barChart').getContext('2d');
    
    const chartColors = getChartColors();

    requestChart = new Chart(requestCtx, {
        type: 'line',
        data: {
            labels: timestamp_labels,
            datasets: [{
                label: 'Logs',
                data: timestamp_data,
                borderColor: 'rgb(34, 197, 94)',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
            }]
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
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: chartColors.textColor
                    },
                    grid: {
                        color: chartColors.gridColor
                    }
                },
                y: {
                    ticks: {
                        color: chartColors.textColor
                    },
                    grid: {
                        color: chartColors.gridColor
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
            borderWidth: 2
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
                boxWidth: 20,
                usePointStyle: true
                }},
                title: {
                color: 'white',
                display: true,
                text: 'Status Code Distribution',
                font: {
                    size: 18
                    },
                },
            }
        }
    });
    
    barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
        label: 'Errors',
        data: [3000, 4000, 3200, 5000, 4800, 6000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        }]
    },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: chartColors.textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: chartColors.textColor
                    },
                    grid: {
                        color: chartColors.gridColor
                    }
                },
                y: {
                    ticks: {
                        color: chartColors.textColor
                    },
                    grid: {
                        color: chartColors.gridColor
                    }
                }
            }
        }
    });
}

function updateChartColors(chart, chartColors) {
    if (!chart) return;

    chart.options.plugins.legend.labels.color = chartColors.textColor;

    const hasX = chart.options.scales?.x;
    const hasY = chart.options.scales?.y;

    if (hasX) {
        chart.options.scales.x.ticks.color = chartColors.textColor;
        chart.options.scales.x.grid.color = chartColors.gridColor;
    }

    if (hasY) {
        chart.options.scales.y.ticks.color = chartColors.textColor;
        chart.options.scales.y.grid.color = chartColors.gridColor;
    }

    chart.data.datasets.forEach(dataset => {
        dataset.borderColor = chartColors.borderColor;
    });

    chart.update('none');
}

createChart();
const charts = [requestChart, statusChart, barChart];
const chartColors = getChartColors();
charts.forEach(chart => updateChartColors(chart, chartColors));


document.getElementById('toggleDark').addEventListener('change', (event) => {
    const isChecked = event.target.checked;
    document.documentElement.classList.toggle('dark', isChecked);
    
    const charts = [requestChart, statusChart, barChart];
    const chartColors = getChartColors();
    charts.forEach(chart => updateChartColors(chart, chartColors));
});


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
// document.addEventListener('DOMContentLoaded', function() {
//     const btn = document.getElementById('toggleMode');
//     if (btn) {
//         btn.onclick = function() {
//             if (document.body.classList.contains('dark-mode')) {
//                 setLightMode();
//             } else {
//                 setDarkMode();
//             }
//         };
//     }
// });

// function setDarkMode() {
//     document.body.classList.add('dark-mode');
// }

// function setLightMode() {
//     document.body.classList.remove('dark-mode');
// }
