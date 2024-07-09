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
            { text: "Settings", image: "/public/images/icons/settings-outline.svg" }]
        }
    },
    methods:{

    },
    watch: {
        currentPage(currentPage) {
            document.title = "TRAKR | " +  currentPage; // Update document title whenever currentPage changes
    }
    },
    created(){
        console.log("created")
        document.title = "TRAKR | " + this.currentPage;
    }
}).mount("#app")