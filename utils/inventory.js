const data = require('../data_management')

module.exports = {
    async returnPages(userId, itemsPerPage) {
        const Data = await data.getData()
        const userData = Data[userId]

        if (!userData) {
            return
        }

        const inventory = userData.Inventory

        let index = 0
        let Pages = []
        let currentPage = []

        for (const item in inventory) {
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

            currentPage[item] = inventory[item]
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
}