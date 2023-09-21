const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'ban',
    description: 'ban a heathen',
    // devOnly: Boolean,
    // testOnly: Boolean,
    deleted: true,
    option: [
        {
            name: 'target-user',
            description: 'The user you want to ban',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'Why ban em?',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissionsRequired: [PermissionFlagsBits.Administrator],

    callback: (client, interaction) => {
        interaction.reply('User has been banned');
    },
};