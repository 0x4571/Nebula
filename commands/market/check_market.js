const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const data = require('../../data_management')
const market = require('../../utils/market')
const categories = require('../../utils/categories')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('market')
        .setDescription('Checks the Player-based market')
        .addNumberOption(option =>
            option
                .setName('page')
                .setDescription('Page to check')
            )
        .addStringOption(option =>
            option
                .setName('search')
                .setDescription('Item to search for')
        )
        .addStringOption(option =>
            option
                .setName('category')
                .setDescription('Category to search')
            ),

    async execute(interaction) {
        let Page = interaction.options.getNumber('page')

        if (!Page) {
            Page = 0
        }

        const marketPages = await market.returnPages(15)

        const newEmbed = new EmbedBuilder()
        .setColor(0x090909)
        .setTitle('**Nebula\'s Market**')
        
        if (!marketPages[Page]) {
            newEmbed.setDescription(`Page not found, pages go up from 0 to ${marketPages.length}`)
        } else {
            const emojis = await categories.getEmojisPerCategory()

            newEmbed.setDescription(`Page ${Page + 1} out of ${marketPages.length}`)

            let i = 0

            for (const item in marketPages[Page]) {
                i += 1
                newEmbed.addFields({
                name: `\n${emojis[marketPages[Page][item].Category]} **${marketPages[Page][item].Name}** (${item})`, 
                value: `- **Quantity & Price: ${marketPages[Page][item].Quantity} ${marketPages[Page][item].Name}(s) at ${marketPages[Page][item].Price}** <:NebulaBuck:1178388626132971590> **each**\n- **Seller: <@${marketPages[Page][item].BuyerId}>**\n`
                })
            }
        }

        await interaction.reply({embeds: [newEmbed]});
    }
}