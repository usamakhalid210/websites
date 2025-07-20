document.addEventListener('DOMContentLoaded', function() {
    // Initialize date range picker
    $('#dateRangeInput').daterangepicker({
        opens: 'left',
        startDate: moment().subtract(29, 'days'),
        endDate: moment(),
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, function(start, end) {
        $('#dateRange').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
        updateCharts();
    });

    // Sample data for charts
    const salesData = {
        dates: Array.from({ length: 30 }, (_, i) => moment().subtract(29 - i, 'days').format('MMM D')),
        revenue: Array.from({ length: 30 }, () => Math.floor(Math.random() * 2000) + 500),
        categories: ['Men', 'Women', 'Kids', 'Accessories'],
        categoryRevenue: [12500, 18500, 8500, 6500],
        topProducts: [
            { name: 'Premium Denim Jacket', revenue: 4200, units: 56 },
            { name: 'Classic White Sneakers', revenue: 3800, units: 72 },
            { name: 'Silk Summer Dress', revenue: 3500, units: 48 },
            { name: 'Cotton T-Shirt Pack', revenue: 2800, units: 112 },
            { name: 'Leather Wallet', revenue: 2400, units: 85 }
        ],
        regions: ['North', 'South', 'East', 'West'],
        regionRevenue: [9800, 12500, 8700, 11500],
        regionMonthly: Array.from({ length: 12 }, (_, i) => ({
            month: moment().month(i).format('MMM'),
            north: Math.floor(Math.random() * 4000) + 1000,
            south: Math.floor(Math.random() * 4000) + 1000,
            east: Math.floor(Math.random() * 4000) + 1000,
            west: Math.floor(Math.random() * 4000) + 1000
        })),
        tableData: Array.from({ length: 100 }, (_, i) => ({
            date: moment().subtract(Math.floor(Math.random() * 30), 'days').format('MMM D, YYYY'),
            orderId: 'ORD-' + (10000 + i),
            product: ['Denim Jacket', 'White Sneakers', 'Summer Dress', 'T-Shirt', 'Wallet', 'Jeans', 'Sunglasses'][Math.floor(Math.random() * 7)],
            category: ['Men', 'Women', 'Kids', 'Accessories'][Math.floor(Math.random() * 4)],
            region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
            revenue: (Math.random() * 200 + 50).toFixed(2),
            units: Math.floor(Math.random() * 3) + 1,
            customer: ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson'][Math.floor(Math.random() * 5)]
        }))
    };

    // Initialize charts
    let revenueChart, categoryChart, productsChart, regionChart;

    function initCharts() {
        // Revenue Trend Chart
        const revenueCtx = document.getElementById('revenueChart').getContext('2d');
        revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: salesData.dates,
                datasets: [{
                    label: 'Revenue',
                    data: salesData.revenue,
                    borderColor: '#ff4d4d',
                    backgroundColor: 'rgba(255, 77, 77, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        // Sales by Category Chart
        const categoryCtx = document.getElementById('categoryChart').getContext('2d');
        categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: salesData.categories,
                datasets: [{
                    data: salesData.categoryRevenue,
                    backgroundColor: [
                        'rgba(255, 77, 77, 0.8)',
                        'rgba(77, 123, 255, 0.8)',
                        'rgba(255, 193, 77, 0.8)',
                        'rgba(77, 255, 158, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 77, 77, 1)',
                        'rgba(77, 123, 255, 1)',
                        'rgba(255, 193, 77, 1)',
                        'rgba(77, 255, 158, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.raw;
                                const percentage = Math.round((value / total) * 100);
                                return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Top Products Chart
        const productsCtx = document.getElementById('productsChart').getContext('2d');
        productsChart = new Chart(productsCtx, {
            type: 'bar',
            data: {
                labels: salesData.topProducts.map(p => p.name),
                datasets: [{
                    label: 'Revenue',
                    data: salesData.topProducts.map(p => p.revenue),
                    backgroundColor: 'rgba(255, 77, 77, 0.8)',
                    borderColor: 'rgba(255, 77, 77, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // Regional Performance Chart
        const regionCtx = document.getElementById('regionChart').getContext('2d');
        regionChart = new Chart(regionCtx, {
            type: 'bar',
            data: {
                labels: salesData.regionMonthly.map(r => r.month),
                datasets: [
                    {
                        label: 'North',
                        data: salesData.regionMonthly.map(r => r.north),
                        backgroundColor: 'rgba(255, 77, 77, 0.8)',
                        borderColor: 'rgba(255, 77, 77, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'South',
                        data: salesData.regionMonthly.map(r => r.south),
                        backgroundColor: 'rgba(77, 123, 255, 0.8)',
                        borderColor: 'rgba(77, 123, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'East',
                        data: salesData.regionMonthly.map(r => r.east),
                        backgroundColor: 'rgba(255, 193, 77, 0.8)',
                        borderColor: 'rgba(255, 193, 77, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'West',
                        data: salesData.regionMonthly.map(r => r.west),
                        backgroundColor: 'rgba(77, 255, 158, 0.8)',
                        borderColor: 'rgba(77, 255, 158, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Update charts based on filters
    function updateCharts() {
        // In a real app, you would fetch new data based on the date range
        // For this demo, we'll just simulate some changes
        
        // Randomize some data to show updates
        salesData.revenue = salesData.revenue.map(() => Math.floor(Math.random() * 2000) + 500);
        salesData.categoryRevenue = salesData.categoryRevenue.map(val => val + Math.floor(Math.random() * 1000) - 500);
        salesData.regionMonthly.forEach(region => {
            region.north = Math.floor(Math.random() * 4000) + 1000;
            region.south = Math.floor(Math.random() * 4000) + 1000;
            region.east = Math.floor(Math.random() * 4000) + 1000;
            region.west = Math.floor(Math.random() * 4000) + 1000;
        });
        
        // Update revenue chart
        revenueChart.data.datasets[0].data = salesData.revenue;
        revenueChart.update();
        
        // Update category chart
        categoryChart.data.datasets[0].data = salesData.categoryRevenue;
        categoryChart.update();
        
        // Update region chart
        regionChart.data.datasets[0].data = salesData.regionMonthly.map(r => r.north);
        regionChart.data.datasets[1].data = salesData.regionMonthly.map(r => r.south);
        regionChart.data.datasets[2].data = salesData.regionMonthly.map(r => r.east);
        regionChart.data.datasets[3].data = salesData.regionMonthly.map(r => r.west);
        regionChart.update();
    }

    // Chart period buttons
    document.querySelectorAll('.chart-action-btn[data-period]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-action-btn[data-period]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, you would fetch data for the selected period
            // For this demo, we'll just update the chart labels
            const period = this.getAttribute('data-period');
            let labels = [];
            
            if (period === 'daily') {
                labels = Array.from({ length: 30 }, (_, i) => moment().subtract(29 - i, 'days').format('MMM D'));
            } else if (period === 'weekly') {
                labels = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);
            } else {
                labels = Array.from({ length: 12 }, (_, i) => moment().month(i).format('MMM'));
            }
            
            revenueChart.data.labels = labels;
            revenueChart.update();
        });
    });

    // Products chart metric toggle
    document.querySelectorAll('.chart-action-btn[data-metric]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-action-btn[data-metric]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const metric = this.getAttribute('data-metric');
            productsChart.data.datasets[0].data = salesData.topProducts.map(
                p => metric === 'revenue' ? p.revenue : p.units
            );
            productsChart.options.scales.y.ticks.callback = function(value) {
                return metric === 'revenue' ? '$' + value.toLocaleString() : value;
            };
            productsChart.update();
        });
    });

    // Region filter buttons
    document.querySelectorAll('.chart-action-btn[data-region]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-action-btn[data-region]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const region = this.getAttribute('data-region');
            
            if (region === 'all') {
                regionChart.data.datasets.forEach(ds => ds.hidden = false);
            } else {
                regionChart.data.datasets.forEach(ds => {
                    ds.hidden = ds.label.toLowerCase() !== region;
                });
            }
            
            regionChart.update();
        });
    });

    // Initialize data table
    function initDataTable() {
        const tableBody = document.querySelector('#salesDataTable tbody');
        const rowsPerPage = 25;
        let currentPage = 1;
        
        function renderTable(page) {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const pageData = salesData.tableData.slice(start, end);
            
            tableBody.innerHTML = '';
            pageData.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.date}</td>
                    <td>${row.orderId}</td>
                    <td>${row.product}</td>
                    <td>${row.category}</td>
                    <td>${row.region}</td>
                    <td>$${parseFloat(row.revenue).toFixed(2)}</td>
                    <td>${row.units}</td>
                    <td>${row.customer}</td>
                `;
                tableBody.appendChild(tr);
            });
            
            document.querySelector('.page-info').textContent = 
                `Page ${page} of ${Math.ceil(salesData.tableData.length / rowsPerPage)}`;
        }
        
        // Pagination controls
        document.getElementById('prevPage').addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderTable(currentPage);
            }
        });
        
        document.getElementById('nextPage').addEventListener('click', function() {
            if (currentPage < Math.ceil(salesData.tableData.length / rowsPerPage)) {
                currentPage++;
                renderTable(currentPage);
            }
        });
        
        // Rows per page selector
        document.getElementById('rowsPerPage').addEventListener('change', function() {
            rowsPerPage = parseInt(this.value);
            currentPage = 1;
            renderTable(currentPage);
        });
        
        // Initial render
        renderTable(currentPage);
    }

    // Export CSV
    document.querySelector('.export-btn').addEventListener('click', function() {
        // In a real app, this would generate and download a CSV file
        // For this demo, we'll just show an alert
        alert('CSV export functionality would be implemented here.\nIn a real app, this would download a CSV file with all sales data.');
    });

    // View type selector
    document.getElementById('viewType').addEventListener('change', function() {
        // In a real app, this would change the dashboard view
        alert(`View changed to: ${this.value}\nIn a real app, this would load the appropriate data and charts.`);
    });

    // Initialize everything
    initCharts();
    initDataTable();
});