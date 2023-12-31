const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't ban that user because they're the server owner.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // highest role of the target user
        const requestUserPosition = interaction.member.roles.highest.position; // command users highest role
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // bots highest role

        if (targetUserRolePosition >= requestUserPosition) {
            await interaction.editReply("You are unable to ban this user as you lack the authority.")
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I am unable to ban this user as I lack the power for it.")
            return;
        }

        // ban the target user
        try {
            await targetUser.ban({ reason })
            await interaction.editReply(`User ${targetUser} has been slain. \nReason: ${reason}`)
        } catch (error) {
            console.log(error)
        }
    },
    
    name: 'ban',
    description: 'Bans a member from this server.',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to ban.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason you want to ban',
            type: ApplicationCommandOptionType.String,
        },
        
    ],

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissionsRequired: [PermissionFlagsBits.Administrator],

   

};