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
var banWorld = ["noir", "nigger", "negger", "negro", "marie"]; // Mot à ne pas dire
let RaccistArray = new Array;

//Toutes les actions à faire quand le bot se connecte
client.on("ready", function() {
    console.log("Bot ON");
    client.channels.cache.get(logsChannel).send("Bot ON");

    // Lecture du json --------------------------------------------
    const fs = require('fs');
    const path = require('path');

    let rawdata = fs.readFileSync(path.resolve(__dirname, './database.json'));
    let data = JSON.parse(rawdata);
    // console.log(data[326660584848490496n].username);
    // console.log(data[326660584848490496n].xp);
    // console.log(data[326660584848490496n].level);
    // console.log("-----------");
    // console.log(data[249522071581753354n].username);
    // console.log(data[249522071581753354n].xp);
    // console.log(data[249522071581753354n].level);
    // console.log("-----------");
    // ------------------------------------------------------------

    // Ecriture dans le Json --------------------------------------------
    let userInfo = {
        '12345': {
            'username': 'Test',
            'xp': 45,
            'level': 50
        }
    }

    // let newData = JSON.stringify(userInfo);
        

    
	
    const mergedObject = {
    ...data,
    ...userInfo
    };

    fs.writeFileSync(path.resolve(__dirname, './database.json'), mergedObject);
    
    // console.log(data[12345].username);
    // console.log(data[12345].xp);
    // console.log(data[12345].level);
    // console.log("-----------");

    let rawdata2 = fs.readFileSync(path.resolve(__dirname, './database.json'));
    let data2 = JSON.parse(rawdata2);

    console.log(data2);
    // ------------------------------------------------------------

});

client.on("messageCreate", (msg) => {
    // Anti raciste section ---------------------------------------------------------------------------
    var sanction = false;
    var heSaid = msg.content.toLowerCase();
    heSaid = heSaid.split(" ");
    for (var j = 0; j < heSaid.length; j++) {
        for (var i = 0; i < banWorld.length; i++) {
            if (banWorld[i] === heSaid[j]) {
                msg.member.roles.add("935240847639851019");
                client.channels.cache
                    .get(logsChannel)
                    .send(
                        "Le rôle de raciste a été attribué à **" +
                        msg.member.user.username +
                        "** pour avoir dit le mot **" +
                        heSaid[j] +
                        "**"
                    );
                sanction = true;
            }
        }
    }
    if (sanction == true) {
        msg.reply("Vous avez été sanctionné sur le message !");
        sanction = false;
    }

    // --------------------------------------------------------------------------------------------------
});

client.on("messageCreate", (msg) => {
    // Tableau du racisme ---------------------------------------------------------------------------
    var heSaid = msg.content.toLowerCase();
    for (var i = 0; i < banWorld.length; i++) {
        if (banWorld[i] === heSaid) {
            RaccistArray.push(msg.member.user.id);
        }
    }
    // --------------------------------------------------------------------------------------------------   

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