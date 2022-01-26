import { Client } from 'discord.js';
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
require("dotenv").config();

const prefixCmd = 'd!';

//Toutes les actions à faire quand le bot se connecte
client.on("ready", function () {
    console.log("Bot ON");
})

client.on("messageCreate", msg => {

    // Si le message n'est pas préfixé ou qu'il vient d'un autre bot, nous l'ignorons
    if(!msg.content.startsWith(prefixCmd) || msg.author.bot) return

    // Si nous arrivons jusque ici, alors c'est une commande

    // Nous convertissons la commande sous forme de tableau en prenant soin de retirer le préfixe
    const args = msg.content.slice(prefixCmd.length).trim().split(/ +/);
    // Extraction du premier élément de 'args', ce qui correspond à la commande
    const command = args.shift().toLowerCase();

    // À ce stade, args est un tableau ne contenant que les arguments étant donné que la commande a été extraite de celui-ci

    // On se sert maintenant de la varibale 'command' pour le test
    if (command === "ping") {
        msg.channel.send("pong");
    }

});

client.login(process.env.BOT_TOKEN);