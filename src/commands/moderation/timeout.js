const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const ms = require('ms')

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    
    callback: async (client, interaction) => {
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided";
        const duration = interaction.options.get('duration').value;

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if (!targetUser) {
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if (targetUser.user.bot) {
            await interaction.editReply("That user is a bot!");
            return;
        }

        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply("You can't timeout that user because they're the server owner.");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; // highest role of the target user
        const requestUserPosition = interaction.member.roles.highest.position; // command users highest role
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // bots highest role

        if (targetUserRolePosition >= requestUserPosition) {
            await interaction.editReply("You are unable to timeout this user as you lack the authority.")
            return;
        }

        if (targetUserRolePosition >= botRolePosition) {
            await interaction.editReply("I am unable to timeout this user as I lack the power for it.")
            return;
        }

        const msDuration = ms(duration);
        if(isNaN(msDuration)) {
            await interaction.editReply("Please provide a valid timeout duration.")
        }

        if (msDuration < 5000 || msDuration > 2419200000) {
            await interaction.editReply("Duration cant be less than 5 seconds nor more than 28 days.")
            return;
        }

        // timeout the target user
        try {
            const {default: prettyMS} = await import ('pretty-ms');

            if (targetUser.isCommunicationDisabled()) {
                await targetUser.timeout(msDuration, reason);
                await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMS(msDuration, { verbose: true})}\nReason: ${reason}`);
                return;
            }

            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser} was timed out.\nReason: ${reason}`);

        } catch (error) {
            console.log(error)
        }
    },
    
    name: 'timeout',
    description: 'timeouts a member from this server.',
    options: [
        {
            name: 'target-user',
            description: 'The user you want to timeout.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
        },
        {
            name: 'duration',
            description: 'The time you want to timeout them (30min, 1h, 1 day, 28 days)',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason you want to timeout for',
            type: ApplicationCommandOptionType.String,
        },
       
        
    ],

    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissionsRequired: [PermissionFlagsBits.Administrator],

   

};