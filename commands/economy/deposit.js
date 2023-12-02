const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const data = require('../../data_management')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deposit')
		.setDescription('Deposits money into the bank.')
		.addNumberOption(option =>
			option
				.setName('amount')
				.setDescription('Amount to deposit')
                .setRequired(true)),

	async execute(interaction) {
		const newData = await data.getData()

		Amount = interaction.options.getNumber('amount')

		if (!newData[interaction.user.id]) {
			newData[interaction.user.id] = data.defaultData
			data.setData(newData)
		}

        const canDeposit = newData[interaction.user.id].Money - Amount >= 0

        newEmbed = new EmbedBuilder()
        .setColor(0x090909)
		.setTitle('**Deposit**')

		if (Amount < 0) {
			Amount = 0
		}

		Amount = Math.floor(Amount)

        if (canDeposit) {
            newData[interaction.user.id].BankMoney += Amount
            newData[interaction.user.id].Money -= Amount
            newEmbed.setDescription(`Deposited ${Amount} <:NebulaBuck:1178388626132971590>!`)
            data.setData(newData)   
        } else {
            newEmbed.setDescription(`You tried depositing ${Amount} <:NebulaBuck:1178388626132971590>, but you only got ${newData[interaction.user.id].Money} <:NebulaBuck:1178388626132971590> in your purse, therefore you cannot deposit that amount. (Difference of ${Amount - newData[interaction.user.id].Money} <:NebulaBuck:1178388626132971590>).`)
        }

		await interaction.reply({embeds: [newEmbed]});
	},
};
