const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const data = require('../../data_management');
const items = require('../../utils/items')
const scavenge = require('../../data/scavenge_items.json')
const categories = require('../../utils/categories')

module.exports = {
	cooldown: 30,
    data: new SlashCommandBuilder()
    .setName('scavenge')
    .setDescription('Searches within your own pockets. They go deep, trust the Nebula'),

	async execute(interaction) {
        let randomOutcome = Math.floor(Math.random() * 101);
        let scavengedItem 

        const emojis = await categories.getEmojisPerCategory()
        const Data = await data.getData()
        let userData = Data[interaction.user.id]

        for (const itemName in scavenge) {
            let catchPercentage = scavenge[itemName].Percentage;

            if (!userData.Jobs.hasOwnProperty("Scavenger") || itemName !== 'null') {
                catchPercentage *= 1.5
            }

            if (randomOutcome <= catchPercentage) {
              scavengedItem = itemName;
              break;
            } else {
              randomOutcome -= catchPercentage;
            }
        }

        const newEmbed = new EmbedBuilder()
        .setColor(0x090909)
        .setTitle('**Scavenge**')

        if (scavengedItem === 'null' || !scavengedItem) {
            newEmbed.setDescription('**It appears you didn\'t find anything. Better luck next time!**')
        } else {
            newEmbed.setDescription(`**(+1 ${scavengedItem}) You found a ${scavengedItem} in your pocket!** ${emojis[scavenge[scavengedItem].Category]}`)
            
            if (!userData.Inventory[scavengedItem]) {
                items.createItem(interaction.user.id, scavengedItem, scavenge[scavengedItem].Category, 0)
            }

            items.addAmountToItem(interaction.user.id, scavengedItem, 1)
        }

        await interaction.reply({embeds: [newEmbed]});
	},
};
