const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const data = require('../../data_management')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Tells you an user\'s balance!')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The user to check the balance of')),

	async execute(interaction) {
		const newData = await data.getData()

		SpecifiedUser = interaction.options.getUser('target')

		if (!SpecifiedUser) {
			SpecifiedUser = interaction.user
		}

		if (!newData[SpecifiedUser.id]) {
			newData[SpecifiedUser.id] = data.defaultData
			data.setData(newData)
		}

		newEmbed = new EmbedBuilder()
        .setColor(0x090909)
		.setTitle('**Balance**')
        .setDescription(`${SpecifiedUser}'s balance:\n\n Purse: ${newData[SpecifiedUser.id]['Money']} <:NebulaBuck:1178388626132971590>\nBank: ${newData[SpecifiedUser.id]['BankMoney']} <:NebulaBuck:1178388626132971590>\nDepository: ${newData[SpecifiedUser.id]['Depository']}`)

		await interaction.reply({embeds: [newEmbed]});
	},
};
