const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const data = require('../../data_management')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addmoney')
		.setDescription('Adds money !')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The user to check the balance of')
                .setRequired(true))
        .addNumberOption(option => 
            option
                .setName('amount')
                .setDescription('The amount to add to the balance')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async execute(interaction) {
		const newData = await data.getData()

		SpecifiedUser = interaction.options.getUser('target')
        Amount = interaction.options.getNumber('amount')

		if (!SpecifiedUser) {
			SpecifiedUser = interaction.user
		}

		if (!newData[SpecifiedUser.id]) {
			newData[SpecifiedUser.id] = data.defaultData
			data.setData(newData)
		}

        newData[SpecifiedUser.id].Money += Amount
        data.setData(newData)

		newEmbed = new EmbedBuilder()
        .setColor(0x090909)
		.setTitle('**Add Money (ADMINISTRATOR)**')
        .setDescription(`${SpecifiedUser}'s balance is now ${newData[SpecifiedUser.id]['Money']} (+${Amount}) <:RosteriaBuckLight:1178118879323627611>`)

		await interaction.reply({embeds: [newEmbed]});
	},
};
