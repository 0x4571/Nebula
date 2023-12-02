const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'data/player_data.json');
const bankDataPath = path.join(__dirname, 'data/bank_data.json');
const jobsPath = path.join(__dirname, 'data/jobs.json');
const fishesPath = path.join(__dirname, 'data/fishes.json');
const marketDataPath = path.join(__dirname, 'data/market_data.json')

module.exports = {
    async setData(Data) {
        fs.writeFileSync(dataPath, JSON.stringify(Data));
    },

    async setMarketData(Data) {
        fs.writeFileSync(marketDataPath, JSON.stringify(Data))
    },

    async getData() {
        return await JSON.parse(fs.readFileSync(dataPath));
    },

    async getBankData() {
        return await JSON.parse(fs.readFileSync(bankDataPath));
    },

    getFishes() {
        return JSON.parse(fs.readFileSync(fishesPath)); 
    },

    getJobs() {
        return JSON.parse(fs.readFileSync(jobsPath));
    },

    getMarketData() {
        return JSON.parse(fs.readFileSync(marketDataPath));
    },

    defaultData: {
        "Money": 0,
        "BankMoney": 5000,
        "Depository": "Nebula's National Bank",
        "Jobs": {},
        "AtWork": false,
        "Inventory": {}
    }
}