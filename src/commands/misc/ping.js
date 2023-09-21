module.exports = {
    name: 'ping',
    description: 'Replies with bot ping!',
    // devOnly: Boolean,
    // testOnly: Boolean,
    // option: Object[],
    // deleted: Boolean

    callback: async (client, interaction) => {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`);
    },
};