const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const data = require('../../data_management')
const casinoUtils = require('../../utils/casino')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roulette')
    .setDescription('Play a game of roulette')
    .addStringOption(option =>
      option.setName('color')
        .setDescription('The color to bet on.')
        .setRequired(true)
        .addChoices(
          { name: 'Green', value: 'green' },
          { name: 'Yellow', value: 'yellow' },
          { name: 'Blue', value: 'blue' },
          { name: 'Pink', value: 'pink' },
          { name: 'Red', value: 'red' },
          { name: 'Black', value: 'black' }
        ))
    .addNumberOption(option =>
       option.setName('bet')
        .setDescription('Amount of money to bet.')
        .setRequired(true)),
  
  async execute(interaction) {
    const color = interaction.options.getString('color');
    const amount = interaction.options.getNumber('bet');

    const multipliers = {
      green: { multiplier: 5, chance: 32 },
      yellow: { multiplier: 10, chance: 13 },
      blue: { multiplier: 20, chance: 8 },
      pink: { multiplier: 2, chance:  41},
      red: { multiplier: 1.5, chance: 49 },
      black: { multiplier: 1.5, chance: 49 },
    };
  
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    const { multiplier, chance } = multipliers[color.toLowerCase()];
  
    const newData = await data.getData()

    if (!newData[interaction.user.id]) {
      newData[interaction.user.id] = data.defaultData
      data.setData(newData)
    }

    let result

    if (!casinoUtils.isCasinoOpen()) {
      result = '**The casino is currently closed! Try again between 6 AM to 10 AM or 9 PM to 2 AM (UTC timezone).**'
    } else if (amount < 5000) {
      result = '**The minimum bet allowed is 5K <:NebulaBuck:1178388626132971590>! Please try betting more.**'
    } else if (amount > 500_000) {
      result = '**The maximum bet allowed is 500K <:NebulaBuck:1178388626132971590>! Please try betting less.**'
    } else if (newData[interaction.user.id].Money < amount) {
      result = '**You don\'t have enough money to bet! Please try a lower amount (Minimum of 5K <:NebulaBuck:1178388626132971590>)**'
    } else {
      result = randomNumber <= chance
        ? `**Congratulations, it landed on ${color}! You just won yourself an extra ${(amount * multiplier) - amount} <:NebulaBuck:1178388626132971590>!** <a:NebulaWon:1187844348272988294>`
        : `**Sorry, it did not land on ${color}. You just lost ${amount} <:NebulaBuck:1178388626132971590>.** <:NebulaLost:1187844344074485830>`;

      if (randomNumber <= chance) {
        newData[interaction.user.id].Money += (amount * multiplier) - amount
      } else {
        newData[interaction.user.id].Money -= amount
      }

      data.setData(newData)
    }

    newEmbed = new EmbedBuilder()
    .setColor(0x090909)
    .setTitle('**Roulette**')
    newEmbed.setDescription(result);

    await interaction.reply({embeds: [newEmbed]});
  }
}