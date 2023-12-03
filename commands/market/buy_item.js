const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const data = require('../../data_management')
const market = require('../../utils/market')
const items = require('../../utils/items')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Buys an item')
        .addStringOption(option =>
            option
                .setName('identifier')
                .setDescription('The identifier of an item')
                .setRequired(true)
            )
        .addNumberOption(option =>
            option
                .setName('quantity')
                .setDescription('Amount to buy')
            ),

    async execute(interaction) {
        let Identifier = interaction.options.getString('identifier')
        const quant = interaction.options.getNumber('quantity') || 1

        const newEmbed = new EmbedBuilder()
        .setColor(0x090909)
        .setTitle('**Nebula\'s Market - Buy Item**')
        
        let marketData = await data.getMarketData()
        let Data = await data.getData()
        let item = marketData[Identifier]

        if (!Data[interaction.user.id]) {
            Data[interaction.user.id] = Data.defaultData
        }

        if (!item) {
            newEmbed.setDescription(`**There\'s no identifier "${Identifier}"**`)
        } else {
            if (!Data[item.BuyerId]) {
                newEmbed.setDescription('**Invalid seller, please contact an administrator.**')
            } else if (quant <= 0) {
                newEmbed.setDescription('**You cannot buy under or 0 items!**')
            } else if (item.Quantity <= 0) {
                await market.rmItem(Identifier)
                newEmbed.setDescription('**It appears this item has already been sold!**')
            } else if (item.BuyerId === interaction.user.id) {
                newEmbed.setDescription('**You cannot buy your own items!**')
            } else if (Data[item.BuyerId].Inventory[item.Name].Amount < quant) {
                await market.subItem(Identifier, (item.Quantity - (item.Quantity - Data[item.BuyerId].Inventory[item.Name].Amount)))
                newEmbed.setDescription(`**<@${item.BuyerId}> doesn't have enough ${item.Name}(s) to sell you! (${Data[item.BuyerId].Inventory[item.Name].Amount} ${item.Name}(s) remaining)**`)
            } else if (Data[interaction.user.id].Money < (item.Price * quant)) {
                newEmbed.setDescription(`**You don't have enough money in your purse to buy this item!**`)
            } else {
                await market.subItem(Identifier, quant)
                Data[item.BuyerId].Inventory[item.Name].Amount -= quant
                Data[interaction.user.id].Money -= (item.Price * quant)
                Data[item.BuyerId].Money += (item.Price * quant)

                if (!Data[interaction.user.id].Inventory[item.Name]) {
                   Data[interaction.user.id].Inventory[item.Name] = await items.createItem(interaction.user.id, item.Name, item.Category)
                }

                Data[interaction.user.id].Inventory[item.Name].Amount = await items.addAmountToItem(interaction.user.id, item.Name, quant)

                newEmbed.setDescription(`**You bought ${quant} ${item.Name}(s) from <@${item.BuyerId}> at ${item.Price} <:NebulaBuck:1178388626132971590> each  (Totalling ${item.Price * quant} <:NebulaBuck:1178388626132971590>)!**`)
            }
        }

        data.setData(Data)
        
        await interaction.reply({embeds: [newEmbed]});
    }
}