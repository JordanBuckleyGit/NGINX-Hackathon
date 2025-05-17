// import './styles.css'

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
        textColor: isDark ? gray : '#000',
        gridColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        backgroundColor: isDark ? '#1f2937' : gray,
        borderColor: isDark ? gray : '#000', 
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
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Logs',
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

    statusChart = new Chart(statusCtx, {
        type: 'pie',
        data: {
            labels: ['200', '500', '404'],
            datasets: [{
            label: 'Occurrences',
            data: [22, 9, 3],
            backgroundColor: [green, yellow, red],
            borderWidth: 2
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
