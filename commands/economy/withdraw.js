const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const data = require('../../data_management')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('withdraw')
		.setDescription('Withdraws money from the bank.')
		.addNumberOption(option =>
			option
				.setName('amount')
				.setDescription('Amount to withdraw')
                .setRequired(true)),

	async execute(interaction) {
		const newData = await data.getData()

		Amount = interaction.options.getNumber('amount')

		if (!newData[interaction.user.id]) {
			newData[interaction.user.id] = data.defaultData
			data.setData(newData)
		}

        const canWithdraw = newData[interaction.user.id].BankMoney - Amount >= 0

        newEmbed = new EmbedBuilder()
        .setColor(0x090909)
		.setTitle('**Withdraw**')

		if (Amount < 0) {
			Amount = 0
		}

		Amount = Math.floor(Amount)

        if (canWithdraw) {
            newData[interaction.user.id].BankMoney -= Amount
            newData[interaction.user.id].Money += Amount
            newEmbed.setDescription(`Withdrawn ${Amount} <:RosteriaBuckLight:1178118879323627611>!`)
            data.setData(newData)   
        } else {
            newEmbed.setDescription(`You tried withdrawing ${Amount} <:RosteriaBuckLight:1178118879323627611>, but you only got ${newData[interaction.user.id].BankMoney} <:RosteriaBuckLight:1178118879323627611> in your bank, therefore you cannot withdraw that amount. (Difference of ${Amount - newData[interaction.user.id].BankMoney} <:RosteriaBuckLight:1178118879323627611>).`)
        }

		await interaction.reply({embeds: [newEmbed]});
	},
};
