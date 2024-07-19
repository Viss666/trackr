
const URL = "https://api.coingecko.com/api/v3/coins/";
const URL2 = "https://api.coincap.io/v2/assets"
// const NEWSURL = "https://api.marketaux.com/v1/news/all?language=en&api_token=rHh7bLzkHWemOyThaWhNlv4oFGhkzv22nVXy1EMT"
const COINBASEURL = "https://api.developer.coinbase.com/rpc/v1/base/D0jBiNT0dtUAcHt4CKgKAJKkpH7mCYTH"
Vue.createApp({
    data() {
        return {
            currentPage: "Home",
            user: {
                name: "",
                email: "",
                password: "",
                profilepic:"",
            },
            chartmode:"graphdiv"
            ,
            currentUser: null,
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
            cryptoID: "bitcoin",
            cryptoData: [],
            cryptoData2: [],
            cryptoData3: [],
            news:[]
        };
    },
    methods: {
        async getcryptodata() {
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        'x-cg-demo-api-key': 'CG-StMKU8Y2HFSrmSkoTuP3Q986'
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
            data.data.splice(25,100);
            this.cryptoData2 = data
            console.log(this.cryptoData3)
            console.log(this.cryptoData2)
        },
        async getcryptodata3() {
            const options = {
                method: 'GET',
                headers: {accept: 'application/json',
                'x-cg-demo-api-key': 'CG-StMKU8Y2HFSrmSkoTuP3Q986'}
              };
              
              try {
                const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=20', options);
                const data = await response.json();
                this.cryptoData3 = data;
                console.log(this.cryptoData3);
              } catch (err) {
                console.error(err);}
        },
        // async getNews(){
        //     const options = {
        //         method: 'GET',
        //         headers: {accept: 'application/json',
        //         'x-cg-demo-api-key': 'rHh7bLzkHWemOyThaWhNlv4oFGhkzv22nVXy1EMT'}
        //       };
        //     try {
        //         const response = await fetch(NEWSURL, options )
        //         const data = await response.json();
        //         this.news = data;
        //         console.log(this.news);
        //       } catch (err) {
        //         console.error(err);}
        // },
        setPage(Page){
            document.title = "TRAKR | " + Page;
            this.currentPage = Page;
            if (Page == "Dashboard"){
                // this.cryptoID="bitcoin"
                document.getElementById("cryptodropdown").value = "Bitcoin"
                
                
                this.chartmode="graphdiv"
                this.getcryptodata()
                
            }
            else if (Page == "Chart"){                
                this.chartmode="chartgraph"
                this.getcryptodata()

                
            }
        },
        setTimeframe(time){
            this.timeframe = time;
            this.cryptoData = []
            console.log("time " , this.timeframe)
            this.getcryptodata()
        },
        formatprice(price){
            let number = parseFloat(price)
            let newnumber = number.toFixed(2)
            return newnumber
        },
        // getCryptoName(cryptoID){
        //     let name = ""
        //     name = cryptoID.charAt(0).toUpperCase()+cryptoID.slice(1)
        //     name += "/" + this.cryptoData2.data.find(item=>item.id===cryptoID).symbol
        //     return name
        // }
        setCryptoId(event){
            // this.cryptoID = event.target.value.toLowerCase()
            // this.cryptoID = this.cryptoData3.find(item => item.name === event.target.value).id
            console.log(this.cryptoID)
            if (document.getElementById('cryptoChart')){
                document.getElementById('cryptoChart').remove();
            }
            this.getcryptodata()
        
        },
        getCryptoName(cryptoID) {
            let name = cryptoID.charAt(0).toUpperCase() + cryptoID.slice(1);
        
            for (let i = 0; i < this.cryptoData2.data.length; i++) {
                if (this.cryptoData2.data[i].id === cryptoID) {
                    name += "/" + this.cryptoData2.data[i].symbol;
                    break;
                }
            }
        
            return name;
        },
        fullpage(){
            this.chartmode = "chartgraph"
            this.setPage("Chart")
            console.log(this.currentPage)
            this.getcryptodata()
        }
        ,
        renderChart() {
            if (document.getElementById("cryptoChart")){
                document.getElementById("cryptoChart").remove();
            }
            // let le = document.getElementById("chartgraph")
            // let chart = document.createElement("canvas")
            // chart.setAttribute("id", "cryptoChart")
            let el = document.getElementById(this.chartmode)
            console.log(el)
            let canvas = document.createElement("canvas")
            console.log("canvas: ",  canvas)
            canvas.setAttribute("id", "cryptoChart")
            el.appendChild(canvas)
            const ctx = document.getElementById("cryptoChart").getContext('2d');
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
                    hover: {
                        intersect: false,
                      },
                    elements: {
                        point:{
                            radius: 0.01,
                            hoverRadius: 20
                            
                        }
                    },
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
        this.getcryptodata3()
        // this.getNews()
    }
}).mount("#app");
