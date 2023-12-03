const data = require('../data_management');

module.exports = {
	async createItem(userId, itemName, category, amount) {
        const newData = await data.getData()
        const userData = newData[userId]

        if (!userData) {
            newData[userId] = data.defaultData
        }

        if (!newData[userId].Inventory[itemName]) {
            newData[userId].Inventory[itemName] = {
                Category: category || 'Miscellaneous',
                Amount: amount || 0,
            }
        }

        return newData[userId].Inventory[itemName]
    },

    async addAmountToItem(userId, itemName, amount) {
        const newData = await data.getData()
        const userData = newData[userId]

        if (!userData) {
            newData[userId] = data.defaultData
        }

        if (!newData[userId].Inventory[itemName]) {
            return
        }

        newData[userId].Inventory[itemName].Amount += amount

        if (newData[userId].Inventory[itemName].Amount < 0) {
            newData[userId].Inventory[itemName].Amount = 0
        }

        return newData[userId].Inventory[itemName].Amount
    }
};
