const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const data = require('../../data_management')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('listjobs')
		.setDescription('Lists the jobs available.'),

	async execute(interaction) {
        let jobList = ""
        const jobs = await data.getJobs()

        for (const job in jobs) {
            console.log(job)
            jobList += job + " " + jobs[job].Icon + "\n"
        }

		newEmbed = new EmbedBuilder()
        .setColor(0x090909)
		.setTitle('**Jobs List**')
        .setDescription(`\n${jobList}`)
        
		await interaction.reply({embeds: [newEmbed]});
	},
};
