const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { joinVoiceChannel } = require('@discordjs/voice');
const { Client, Intents } = require("discord.js");

const db = require("./database/database")
const Users = require('./models/Users')

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
var banWorld = ["noir", "nigger", "negger", "negro", "marie"]; // Mot à ne pas dire
let RaccistArray = new Array;

//Toutes les actions à faire quand le bot se connecte
client.on("ready", function() {
    console.log("Bot ON");
    client.channels.cache.get(logsChannel).send("Bot ON");

    try {
        db.authenticate();
        console.log('Connection has been established successfully.');

        Users.init(db);
        Users.sync();

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

});



client.on("messageCreate", (msg) => {
    // Anti raciste section ---------------------------------------------------------------------------
    var heSaid = msg.content.toLowerCase();
    heSaid = heSaid.split(" ");
    for (var j = 0; j < heSaid.length; j++) {
        for (var i = 0; i < banWorld.length; i++) {
            if (banWorld[i] === heSaid[j]) {
                
                // Select
                


                // Ajouter le jeux
            }
        }
    }

    // --------------------------------------------------------------------------------------------------
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
        case "racist":
            if (RaccistArray.length == 0) {
                msg.channel.send("Aucun raciste détecté à ce jour")
            } else {
                msg.channel.send(RaccistArray.toString());
            }
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

        case "rejoindre":
            msg.member.roles.add("935240847639851019");
            Users.create({
                userid: parseInt(msg.author.id),
                username: msg.author.username,
                xp: 0,
                level: 0
            });
            msg.reply(msg.author.tag + ", vous avez rejoind le tableau des racistes !");
            client.channels.cache.get(logsChannel).send(msg.author.tag + "a rejoind le tableau des racistes !");
            break;
        case "stats":
            getStats(msg);
            break;

        default:
            break;
    }
});

async function userExist(msg){
    Users.count({ where: { userid: parseInt(msg.author.id) } })
        .then(count => {
            if (count != 0) {
                return false;
            }
                return true;
        });
}

async function getStats(msg){
    if (userExist(msg)) {
        const stats = await Users.findOne({
            attributes: ['xp', 'level'],
            where: {
                userid: parseInt(msg.author.id)
            }
        });
        return msg.channel.send(msg.author.username + " vos stats sont : lv : " + stats.xp + " - xp : " + stats.level)
    }else{
        return msg.channel.send("Vous n'êtes pas dans la liste des racistes, si vous voulez rejoindre faite : **d!rejoindre**")
    }
}

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