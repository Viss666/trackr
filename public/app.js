
const URL = "https://api.coingecko.com/api/v3/coins/";
const URL2 = "https://api.coincap.io/v2/assets"
Vue.createApp({
    data() {
        return {
            currentPage: "Dashboard",
            pages: [
                { text: "Dashboard", image: "/public/images/icons/dashboard.svg" },
                { text: "Account", image: "/public/images/icons/user-regular.svg" },
                { text: "Chart", image: "/public/images/icons/bar-chart-2.svg" },
                { text: "Wallet", image: "/public/images/icons/wallet.svg" },
                { text: "News", image: "/public/images/icons/news.svg" },
                { text: "Settings", image: "/public/images/icons/settings-outline.svg" }
            ],
            timeframe:"365"
            ,
            times:[
                { text: "1y", days: "365" },
                { text: "6m", days: "180" },
                { text: "1m", days: "30" },
                { text: "1w", days: "7" },
                { text: "1d", days: "1" },
            ], 
            cryptoID: "dogecoin",
            cryptoData: [],
            cryptoData2: []
        };
    },
    methods: {
        async getcryptodata() {
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        'x-cg-demo-api-key': 'CG-t3LtBnSXvgWENNfVLcy96h7y'
                    }
                };

                const response = await fetch(`${URL}${this.cryptoID}/market_chart?vs_currency=usd&days=${this.timeframe}`, requestOptions);
                const data = await response.json();
                this.cryptoData = data.prices;

                this.renderChart();
            } catch (error) {
                console.log('Error fetching crypto data:', error);
            }
        },
        async getcryptodataFree() {
            const requestOptions= {
                method: 'GET'
            }
            const response = await fetch(`${URL2}`, requestOptions);
            const data = await response.json();
            console.log(data)
            data.data.splice(20,100);
            this.cryptoData2 = data
            console.log(this.cryptoData2)
        },
        setPage(Page){
            document.title = "TRAKR | " + Page;
            this.currentPage = Page;
        },
        setTimeframe(time){
            this.timeframe = time;
            this.cryptoData = []
            console.log(this.timeframe)
    if (document.getElementById('cryptoChart')){
        document.getElementById('cryptoChart').remove();
    }
            this.getcryptodata()
        },
        formatprice(price){
            let number = parseFloat(price)
            let newnumber = number.toFixed(2)
            return newnumber
        },
        renderChart() {
            let el = document.getElementById("graphdiv")
            let canvas = document.createElement("canvas")
            canvas.setAttribute("id", "cryptoChart")
            el.appendChild(canvas)
            const ctx = document.getElementById('cryptoChart').getContext('2d');
            const chartData = this.cryptoData.map(item => ({
                x: item[0],
                y: item[1]
            }));
            console.log(chartData)
            new Chart(ctx, {
                type: 'line',
                data: {

                    datasets: [{
                        label: 'Price',
                        data: chartData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: {
                            type: 'time',

                            time: {
                                unit: 'day'
                            }
                        },
                        y: {
                            beginAtZero: true
                        }
                    }}
               
            });
        }
    },
    // watch: {
    //     currentPage(currentPage) {
    //         document.title = "TRAKR | " + currentPage; // Update document title whenever currentPage changes
    //     }
    // },
    created() {
        console.log("created");
        document.title = "TRAKR | " + this.currentPage;
        this.getcryptodata();
        this.getcryptodataFree()
    }
}).mount("#app");
