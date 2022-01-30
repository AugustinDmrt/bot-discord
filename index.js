const Discord = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice');
const { Client, Intents } = require("discord.js");
const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
    ],
});
require("dotenv").config();

const prefixCmd = "d!";
var logsChannel = "937026983265726495"; // Identifiant du channel des logs du bot

//Toutes les actions à faire quand le bot se connecte
client.on("ready", function() {
    console.log("Bot ON");
    client.channels.cache.get(logsChannel).send("Bot ON");
});

// Affiche un message si erreur ou autres... ----------------------------------------------------------
client.on("error", (e) => {
    client.channels.cache.get(logsChannel).send("**Erreur :**" + e.message);
});
client.on("warn", (e) => {
    client.channels.cache.get(logsChannel).send("**Warn :**" + e.message);
});
// ----------------------------------------------------------------------------------------------------

client.on("messageCreate", (msg) => {
    // Si le message n'est pas préfixé ou qu'il vient d'un autre bot, nous l'ignorons
    if (!msg.content.startsWith(prefixCmd) || msg.author.bot) return;

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
            client.channels.cache.get(logsChannel).send("OK !");
            break;

        case "invite":
            msg.channel.createInvite({ unique: true }).then((invite) => {
                msg.reply(
                    "Tu a créer un invitation, voici le lien : https://discord.gg/" +
                    invite.code +
                    ". Tu peux l'utiliser pendant 24H"
                );
                // const User = client.users.cache.get(msg.author.tag); // Getting the user by ID.
                client.channels.cache
                    .get(logsChannel)
                    .send(
                        "L'utilisateur **" + msg.author.tag + "** a crée une invitation"
                    );
            });
            break;

        default:
            break;
    }
});

// Envoie un message dans les logs du bot si un joueur rejoind le serveur -----------------------------------
client.on("guildMemberAdd", (member) => {
    member.roles.add("417415677348020224");
    client.channels.cache
        .get(logsChannel)
        .send("**" + member.user.username + "** a rejoind le serveur");
});
// ----------------------------------------------------------------------------------------------------------

// Envoie un message dans les logs du bot si un joueur quitte le serveur ------------------------------------
client.on("guildMemberRemove", (member) => {
    client.channels.cache
        .get(logsChannel)
        .send("**" + member.user.username + "** a quitté le serveur...");
});
// ----------------------------------------------------------------------------------------------------------

client.login(process.env.BOT_TOKEN);