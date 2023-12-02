const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const data = require('../../data_management')
const jobs = data.getJobs()
const jobsList = Object.keys(jobs)
let exportData 

exportData = new SlashCommandBuilder()
		.setName('jobapply')
		.setDescription('Lets you apply for a job')
		.addStringOption(option =>
			option
				.setName('job')
				.setDescription('The job you want to apply for')
                .setRequired(true)),

jobsList.forEach(job =>{
    exportData.options[0].addChoices({name: job, value: job});
})

module.exports = {
	data: exportData,

	async execute(interaction) {
		const newData = await data.getData()

		let Job = interaction.options.getString('job')


		if (!newData[interaction.user.id]) {
			newData[interaction.user.id] = data.defaultData
			data.setData(newData)
		}

        let userData = newData[interaction.user.id]

        
		newEmbed = new EmbedBuilder()
        .setColor(0x090909)
		.setTitle('**Applying for Job**')

        if (userData.Jobs.length >= 3) {
            newEmbed.setDescription('You cannot have more than 3 Jobs at a time!')
        } else {
            console.log(userData.Jobs)

            if (userData.Jobs[Job]) {
                newEmbed.setDescription('You\'re already working at this job!')
            } else {
                userData.Jobs[Job] = {XP: 0, HoursWorked: 0}
                newEmbed.setDescription(`You\'re now a(n) ${Job}!`)
            }
        }

		data.setData(newData)
    
		await interaction.reply({embeds: [newEmbed]});
	},
};
