const emojis = {
    "Fishes": "<:NebulaFishCaught:1178461824136511630>",
    "Miscellaneous": '<a:NebulaMiscellaneous:1179439047484133489>',
    "Stones": ''
}

module.exports = {
    async getEmojisPerCategory() {
        return emojis
    }
}