const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { joinVoiceChannel } = require("@discordjs/voice");
const { Client, Intents } = require("discord.js");

const db = require("./database/database");
const Users = require("./models/Users");

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
let RaccistArray = new Array();

async function userExist(msg) {
  let count = await Users.count({ where: { userid: parseInt(msg.author.id) } });
  if (count != 0) {
    return true;
  } else {
    return false;
  }
}

async function getStats(msg) {
  if ((await userExist(msg)) == true) {
    const stats = await Users.findOne({
      attributes: ["xp", "level"],
      where: {
        userid: parseInt(msg.author.id),
      },
    });
    return msg.channel.send(
      msg.author.username +
        " vos stats sont : lv : " +
        stats.level +
        " - xp : " +
        stats.xp
    );
  } else {
    return msg.channel.send(
      "Vous n'êtes pas dans la liste des racistes, si vous voulez rejoindre faite : **d!rejoindre**"
    );
  }
}

async function addLvl(currentLvl, msg) {
  await Users.update(
    { level: currentLvl + 1 },
    {
      where: {
        userid: parseInt(msg.author.id),
      },
    }
  );

  await Users.update(
    { xp: 0 },
    {
      where: {
        userid: parseInt(msg.author.id),
      },
    }
  );

  client.channels.cache
    .get(logsChannel)
    .send("[Logs] : " + msg.author.tag + " a gagné 1 level !");

  msg.channel.send(
    "<@" +
      msg.author.id +
      ">, Vous avez gagné 1 level | Tapez **d!stats** pour en savoir plus..."
  );
}

async function addXp(msg) {
  if ((await userExist(msg)) == true) {
    const currentXp = await Users.findOne({
      attributes: ["xp"],
      where: {
        userid: parseInt(msg.author.id),
      },
    });

    const currentLvl = await Users.findOne({
      attributes: ["level"],
      where: {
        userid: parseInt(msg.author.id),
      },
    });

    let newXp = currentXp.xp + 5;
    let lvl = currentLvl.level;

    if (newXp == 10 && lvl == 0) {
      addLvl(lvl, msg);
      msg.member.roles.remove("943246991352295455");
      msg.member.roles.add("943242312312582225");
    } else if (newXp == 25 && lvl == 1) {
      addLvl(lvl, msg);
      msg.member.roles.remove("943242312312582225");
      msg.member.roles.add("943243068130328637");
    } else if (newXp == 50 && lvl == 2) {
      addLvl(lvl, msg);
      msg.member.roles.remove("943243068130328637");
      msg.member.roles.add("943242563807223919");
    } else if (newXp == 100 && lvl == 3) {
      addLvl(lvl, msg);
      msg.member.roles.remove("943242563807223919");
      msg.member.roles.add("943244095999070228");
    } else if (newXp == 250 && lvl == 4) {
      addLvl(lvl, msg);
      msg.member.roles.remove("943244095999070228");
      msg.member.roles.add("943245557554618368");
    } else if (newXp == 500 && lvl == 5) {
      addLvl(lvl, msg);
      msg.member.roles.remove("943245557554618368");
      msg.member.roles.add("943244351272783912");
    } else if (newXp == 1000 && lvl == 6) {
      addLvl(lvl, msg);
      msg.member.roles.remove("943244351272783912");
      msg.member.roles.add("943242760956289025");
    } else {
      await Users.update(
        { xp: currentXp.xp + 5 },
        {
          where: {
            userid: parseInt(msg.author.id),
          },
        }
      );
      client.channels.cache
        .get(logsChannel)
        .send(
          "[Logs] : " +
            msg.author.tag +
            " a reçu 5 d'xp pour avoir dit : **" +
            msg.content +
            "**"
        );
    }
  }
}

async function getRank(msg) {
  const rank = await Users.findAll({
    attributes: ["username", "level"],
    order: [
      ["level", "DESC"],
    ],
    limit: 3,
  });

  msg.channel.send("Top 3 des racistes :");

  rank.map( r => {
    msg.channel.send(r.username + " avec un niveau de : " + r.level)
  });
}

//Toutes les actions à faire quand le bot se connecte
client.on("ready", function () {
  try {
    db.authenticate();
    console.log("Connection has been established successfully.");

    Users.init(db);
    Users.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  console.log("Bot ON");
  client.channels.cache.get(logsChannel).send("Bot ON");
});

client.on("messageCreate", (msg) => {
  // Anti raciste section ---------------------------------------------------------------------------
  var heSaid = msg.content.toLowerCase();
  heSaid = heSaid.split(" ");
  for (var j = 0; j < heSaid.length; j++) {
    for (var i = 0; i < banWorld.length; i++) {
      if (banWorld[i] === heSaid[j]) {
        addXp(msg);
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
        msg.channel.send("Aucun raciste détecté à ce jour");
      } else {
        msg.channel.send(RaccistArray.toString());
      }
      break;
    case "test":
      client.channels.cache.get(logsChannel).send("[Logs] : OK !");
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
            "[Logs] : L'utilisateur **" +
              msg.author.tag +
              "** a crée une invitation"
          );
      });
      break;

    case "rejoindre":
      if (userExist(msg)) {
        msg.reply("Tu fais déjà partie des racistes !");
      } else {
        msg.member.roles.add("943246991352295455");
        Users.create({
          userid: parseInt(msg.author.id),
          username: msg.author.username,
          xp: 0,
          level: 0,
        });
        msg.reply(
          msg.author.tag + ", vous avez rejoind le tableau des racistes !"
        );
        client.channels.cache
          .get(logsChannel)
          .send(
            "[Logs] : " +
              msg.author.tag +
              " a rejoind le tableau des racistes !"
          );
      }

      break;
    case "stats":
      getStats(msg);
      break;
    case "ranks":
      getRank(msg);
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
    .send("[Logs] : **" + member.user.username + "** a rejoind le serveur");
});
// ----------------------------------------------------------------------------------------------------------

// Envoie un message dans les logs du bot si un joueur quitte le serveur ------------------------------------
client.on("guildMemberRemove", (member) => {
  client.channels.cache
    .get(logsChannel)
    .send("[Logs] : **" + member.user.username + "** a quitté le serveur...");
});
// ----------------------------------------------------------------------------------------------------------

client.login(process.env.BOT_TOKEN);
