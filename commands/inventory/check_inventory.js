const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const data = require('../../data_management');
const categories = require('../../utils/categories')
const inventoryM = require('../../utils/inventory')

module.exports = {
	cooldown: 2,
    data: new SlashCommandBuilder()
    .setName('inventory')
    .setDescription('Checks the user\'s inventory')
    .addNumberOption(option =>
        option
            .setName('page')
            .setDescription('Page to check'),
        )
    .addUserOption(option => 
        option
            .setName('target')
            .setDescription('User to check the inventory of')
        ),

	async execute(interaction) {
		const newData = await data.getData()

        let user = interaction.options.getUser('target')
        let Page = interaction.options.getNumber('page') || 0

        if (!user || user === undefined) {
            user = interaction.user.id
        } else {
            user = interaction.options.getUser('target').id
        }

		if (!newData[user]) {
			newData[user] = data.defaultData
			data.setData(newData)
		}

        let inventory = await inventoryM.returnPages(user, 15)
        
        const newEmbed = new EmbedBuilder()
        .setColor(0x090909)
        .setTitle(`**${user} Inventory**`)

        if (!inventory[Page]) {
            newEmbed.setDescription(`Page not found, pages go up from 0 to ${inventory.length}`)
        } else {
            const emojis = await categories.getEmojisPerCategory()

            newEmbed.setDescription(`Page ${Page + 1} out of ${inventory.length}`)

            let i = 0

            for (const item in inventory[Page]) {
                i += 1
                newEmbed.addFields({
                name: `\n${emojis[inventory[Page][item].Category]} **${item}**`, 
                value: `- **Amount: ${inventory[Page][item].Amount}** \n`
                })
            }
        }
    
		await interaction.reply({embeds: [newEmbed]});
	},
};
