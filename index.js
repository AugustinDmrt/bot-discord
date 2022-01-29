const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
require("dotenv").config();

const prefixCmd = 'd!';
const logsChannel = client.channels.cache.get("937026983265726495");


//Toutes les actions à faire quand le bot se connecte
client.on("ready", function() {
    console.log("Bot ON");
})

client.on("messageCreate", msg => {

    // Si le message n'est pas préfixé ou qu'il vient d'un autre bot, nous l'ignorons
    if (!msg.content.startsWith(prefixCmd) || msg.author.bot) return

    // Si nous arrivons jusque ici, alors c'est une commande

    // Nous convertissons la commande sous forme de tableau en prenant soin de retirer le préfixe
    const args = msg.content.slice(prefixCmd.length).trim().split(/ +/);
    // Extraction du premier élément de 'args', ce qui correspond à la commande
    const command = args.shift().toLowerCase();

    // À ce stade, args est un tableau ne contenant que les arguments étant donné que la commande a été extraite de celui-ci

    // On se sert maintenant de la varibale 'command' pour le test

    switch (command) {
        case "ping":
            msg.channel.send("pong");
            break;

        case "test":
            logsChannel.send("OK !");
            break;

        default:
            break;
    }

});

// ------------- Test plus tard ----------------
// // Leave a guild
// guild.leave()
//   .then(g => console.log(`Left the guild ${g}`))
//   .catch(console.error);



client.login(process.env.BOT_TOKEN);