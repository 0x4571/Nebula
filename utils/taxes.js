const data = require('../../data_management')

module.exports = {
	async takeTaxes(User, Income) {
		const newData = await data.getData()
        const bankData = await data.getBankData()

        newData[User.id].Money -= (Income * (bankData.CurrentTax / 100))

		return Income * (bankData.CurrentTax / 100)
	},
};
