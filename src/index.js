require('dotenv').config();
const  { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);
});

client.on('messageCreate', (message) =>{
    if (message.author.bot)
    {
        return;
    }

    if (message.content === 'hello')
    {
        message.reply('hello');
    }
});

client.on('interactionCreate', (interaction) => {
    if ( !interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'add')
    {
        const num1 = interaction.options.get('first-number').value;
        const num2 = interaction.options.get('second-number').value;

        interaction.reply(`The sum of ${num1} and ${num2} is ${num1 + num2}`)
    }

    if (interaction.commandName === 'ping')
    {
        interaction.reply('Pong!')
    }
    
});

client.login(process.env.TOKEN);