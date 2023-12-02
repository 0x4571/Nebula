const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const data = require('../../data_management')
const market = require('../../utils/market')
const items = require('../../utils/items')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sell')
        .setDescription('Sells an item')
        .addStringOption(option =>
            option
                .setName('item')
                .setDescription('The name of the item to sell')
                .setRequired(true)
            )
        .addNumberOption(option =>
            option
                .setName('price')
                .setDescription('The price of each item (price per 1 item)')
                .setRequired(true)
            )
        .addNumberOption(option =>
            option
                .setName('quantity')
                .setDescription('Amount to sell')
            ),

    async execute(interaction) {
        let item = interaction.options.getString('item')
        const quant = interaction.options.getNumber('quantity') || 1
        const price = interaction.options.getNumber('price')

        const newEmbed = new EmbedBuilder()
        .setColor(0x090909)
        .setTitle('**Nebula\'s Market - Sell Item**')
        
        let Data = await data.getData()

        if (!Data[interaction.user.id]) {
            Data[interaction.user.id] = Data.defaultData
        }

       let userInventory = Data[interaction.user.id].Inventory

        if (!userInventory[item]) {
            newEmbed.setDescription(`**${item} was not found in your inventory**`)
        } else if (userInventory[item].Amount < quant) {
            newEmbed.setDescription(`**You do not have enough ${item}(s) to sell ${quant}, the max you can sell right now is ${userInventory[item].Amount}**`)
        } else {
            // selling
            market.addItem(interaction.user.id, item, quant, userInventory[item].Category, price)
            newEmbed.setDescription(`**You're now selling ${quant} ${item}(s) on Nebula's Market for ${price} <:NebulaBuck:1178388626132971590> each  ((Totalling ${price * quant} <:NebulaBuck:1178388626132971590>)!**`)
        }

        data.setData(Data)
        
        await interaction.reply({embeds: [newEmbed]});
    }
}