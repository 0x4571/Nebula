const data = require('../data_management')
const uuid_gen = require('../misc/uuid')

module.exports = {
    async returnPages(itemsPerPage) {
        const marketData = await data.getMarketData()
        let index = 0
        let Pages = []
        let currentPage = []

        for (const item in marketData) {
            index += 1

            if (index > itemsPerPage) {
                index = 1
                let nextI 

                if (Pages.length == 0) {
                    nextI = 0
                } else {
                    nextI = Pages.length + 1
                }

                Pages[nextI] = currentPage
                currentPage = {} 
            }

            currentPage[item] = marketData[item]
        }

        if (Object.keys(currentPage).length > 0) {
            let nextI 

                if (Pages.length == 0) {
                    nextI = 0
                } else {
                    nextI = Pages.length + 1
                }

            Pages[nextI] = currentPage
            currentPage = {}
        }

        return Pages
    },

    async subItem(identifier, amount) {
        let marketData = await data.getMarketData()

        if (!marketData[identifier]) {
            return
        }

        marketData[identifier].Quantity -= amount

        if (marketData[identifier].Quantity < 0) {
            delete marketData[identifier]
        }

        
        data.setMarketData(marketData)
    },

    async addItem(userId, name, amount, category, price) {
        let marketData = await data.getMarketData()

        marketData[uuid_gen()] = {
            Quantity: amount,
            BuyerId: userId,
            Name: name,
            Category: category,
            Price: price
        }
        
        data.setMarketData(marketData)
    }
}