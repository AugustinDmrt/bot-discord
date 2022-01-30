const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { joinVoiceChannel } = require('@discordjs/voice');
const { Client, Intents } = require("discord.js");
const client = new Discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
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

        case "drill":
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel)
                return msg.channel.send(
                    "You need to be in a voice channel to play music!"
                );
            const permissions = voiceChannel.permissionsFor(msg.client.user);
            if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
                return msg.channel.send(
                    "I need the permissions to join and speak in your voice channel!"
                );
            }

            joinVoiceChannel({
                channelId: "568439232780042282",
                guildId: "404321483498717196",
                adapterCreator: msg.guild.voiceAdapterCreator,
            });


            // if (msg.member.voice.channel) {
            //     msg.member.voice.channel
            //         .join()
            //         .then((connection) => {
            //             // let args = msg.content.split(" ");
            //             // let dispatcher = connection.play(
            //             //     ytdl(args[1], { quality: "highestaudio" })
            //             // );
            //             // dispatcher.on("finish", () => {
            //             //     dispatcher.destroy();
            //             //     connection.disconnect();
            //             // });
            //             // dispatcher.on("error", (err) => {
            //             //     client.channels.cache
            //             //         .get(logsChannel)
            //             //         .send("**Erreur du dispatcher : " + err);
            //             // });
            //         })
            //         .catch((err) => {
            //             msg.reply("Erreur lors de la connection");
            //         });
            // } else {
            //     msg.reply("Vous n'êtes pas connecté a un salon vocal");
            // }
            break;

        case "leave":
            connection.destroy();
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