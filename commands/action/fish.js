const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const data = require('../../data_management');
const fishData = data.getFishes()
const items = require('../../utils/items')

module.exports = {
	cooldown: 2,
    data: new SlashCommandBuilder()
    .setName('fish')
    .setDescription('Fishes. Yea, that\'s it'),

	async execute(interaction) {
		const newData = await data.getData()

		if (!newData[interaction.user.id]) {
			newData[interaction.user.id] = data.defaultData
			data.setData(newData)
		}

        let userData = newData[interaction.user.id]
        
        let randomOutcome = Math.floor(Math.random() * 101);
        let caughtFish 

        for (const fishName in fishData) {
            let catchPercentage = fishData[fishName].Percentage;

            if (!userData.Jobs.hasOwnProperty("Fisherman")) {
                catchPercentage *= 1.1
            }

            if (randomOutcome <= catchPercentage) {
              caughtFish = fishName;
              break;
            } else {
              randomOutcome -= catchPercentage;
            }
          }

        let hookBreakChance = 10;
        const hookBreakOutcome = Math.floor(Math.random() * 101);

        if (!userData.Jobs.hasOwnProperty("Fisherman")) {
            hookBreakChance = 15
        }

        const hookBroke = hookBreakOutcome <= hookBreakChance;

		newEmbed = new EmbedBuilder()
        .setColor(0x090909)
        newEmbed.setDescription("Nothing happened...? <:NebulaQuestionMark:1179164624403304528>")

        if (!userData.Inventory["Fishing Hook"]) {
            newEmbed.setDescription(`**You don't have any fishing hooks left in your inventory, buy some from the market!** <:NebulaHook:1178461820546203708>`)
            await interaction.reply({embeds: [newEmbed]});
            return
        }

        if (userData.Inventory["Fishing Hook"].Amount <= 0) {
            newEmbed.setDescription(`**You don't have any fishing hooks left in your inventory, buy some from the market!** <:NebulaHook:1178461820546203708>`)
            await interaction.reply({embeds: [newEmbed]});
            return
        }

        if (hookBroke) {
            //Amount = Math.floor(Math.random() * (218 - 13 + 1)) + 13
            
            //userData.Money -= Math.floor(Amount)

            //if (userData.Money < 0) {
                //userData.Money = 0
            //}

            if (!userData.Inventory["Fishing Hook"]) {
                items.createItem(interaction.user.id, "Fishing Hook", "Utilities", Amount)
            }

            items.addAmountToItem(interaction.user.id, "Fishing Hook", -1)

            newEmbed.setDescription(`**(-1 Hook) Your fishing hook broke!** <:NebulaHook:1178461820546203708>`)
        } else {
            //Reward = fishData[caughtFish].Reward
            //Amount = Math.floor(Math.random() * (Reward.Max - Reward.Min + 1)) + Reward.Min

            //if (!userData.Jobs.hasOwnProperty("Fisherman")) {
                //Amount *= 2/3
            //}

            //userData.Money += Math.floor(Amount);

            if (!userData.Inventory[caughtFish]) {
                items.createItem(interaction.user.id, caughtFish, "Fishes", 1)
            }

            items.addAmountToItem(interaction.user.id, caughtFish, 1)

            newEmbed.setDescription(`**(+1 ${caughtFish}) You caught a ${caughtFish}!** <:NebulaFishCaught:1178461824136511630>`)
        }

		data.setData(newData)
    
		await interaction.reply({embeds: [newEmbed]});
	},
};
