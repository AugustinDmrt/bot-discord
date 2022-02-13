const Sequelize = require('sequelize');
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// [alpha]
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'mysql://portfolioaugustin.zd.fr',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});


// [beta]

client.once('ready', () => {
	// [gamma]
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'addtag') {
		// [delta]
        client.channels.cache.get(logsChannel).send("delta !");
            break;
	} else if (commandName === 'tag') {
		// [epsilon]
        client.channels.cache.get(logsChannel).send("epsilon !");
            break;
	} else if (commandName === 'edittag') {
		// [zeta]
        client.channels.cache.get(logsChannel).send("zeta !");
            break;
	} else if (commandName === 'taginfo') {
		// [theta]
        client.channels.cache.get(logsChannel).send("theta !");
            break;
	} else if (commandName === 'showtags') {
		// [lambda]
        client.channels.cache.get(logsChannel).send("lambda !");
            break;
	} else if (commandName === 'removetag') {
		// [mu]
        client.channels.cache.get(logsChannel).send("mu !");
            break;
	}
});

client.login(process.env.BOT_TOKEN);
