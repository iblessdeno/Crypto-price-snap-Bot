INFORMATION

The whatsapp-web.js guide is a work in progress, which means there may be typos or unintentional errors. If this happens, please create an issue on Github. The guide may not offer all available functions. To learn more about all the functions available to you in the library, please see the documentation.

Introduction
whatsapp-web.js is an unofficial, open-source library that isn't made by WhatsApp or affiliated with it in any way. This library is designed to offer developers the freedom to create WhatsApp clients, chatbots, applications, and more using node.js.

Disclaimer
This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or its affiliates. The official WhatsApp website can be found at whatsapp.com. "WhatsApp" as well as related names, marks, emblems and images are registered trademarks of their respective owners. Also it is not guaranteed you will not be blocked by using this method. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe. For any businesses looking to integrate with WhatsApp for critical applications, we highly recommend using officially supported methods, such as Twilio's solution or other alternatives. You might also consider the official API.

How It Works
The library works by launching the WhatsApp Web browser application and managing it using Puppeteer to create an instance of WhatsApp Web, thereby mitigating the risk of being blocked. The WhatsApp API client connects through the WhatsApp Web browser app, accessing its internal functions. This grants you access to nearly all the features available on WhatsApp Web, enabling dynamic handling similar to any other Node.js application.

Requirements
Getting into bot development with whatsapp-web.js is thrilling, but there are certain prerequisites you should be aware of. To construct a bot using whatsapp-web.js, it's crucial to have a good understanding of JavaScript. While it's possible to begin with limited JavaScript and programming knowledge, attempting to create a bot without a solid grasp of the language may result in frustration. You may encounter challenges with basic tasks, find it difficult to solve simple problems, and end up feeling discouraged.

If you are a complete beginner, please take your time to learn more about the basics and come back with a better understanding of JavaScript and Node.js. Here are some free educational resources:

Installation
Before getting started with whatsapp-web.js, it's essential for you to install Node.js and whatsapp-web.js itself on your machine. Please note that whatsapp-web.js v1 requires Node v18 or higher.

TIP

To check if you already have Node installed on your machine, run node -v in your terminal. If the output is v18 or higher, then you're good to go! Otherwise you should continue reading.

WARNING

If you already have Node installed, but you are using an older version that is below v18, you need to upgrade your Node version too. You can do this by installing the nvm.

Installing Node.js
Installation on Windows
Installing Node on Windows works just like any other program.

Download any version above 18+ from the official Node.js website.
After the download is complete, open the downloaded file and follow the installer steps.
Once the installation is complete, you can use Node.js and npm in your terminal.
Installation on macOS
Installing Node on macOS is as easy as with installing Node on Windows.

Download any version above 18+ from the official Node.js website.
After the download is complete, open the downloaded file and follow the installer steps.
Once the installation is complete, you can use Node.js and npm in your terminal.
You can also install Node.js using Homebrew, if you have that already installed.


# Run this command in your terminal
brew install node
Installation on Linux
You can install Node.js on Linux using the package manager of your choice.

Installation on no-gui systems
If you want to install whatsapp-web.js on a system without a GUI, such as a linux server image, and you need puppeteer to emulate the Chromium browser, there are a few additional steps you'll need to take.

First, you'll need to install dependencies required by puppeteer, such as the necessary libraries and tools for running a headless Chromium browser.


sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
After installing these dependencies, you can proceed with installing whatsapp-web.js and puppeteer as usual. When puppeteer installs, it will download a version of Chromium suitable for headless environments.

Setup essentials
After installed Node, you can now run commands in your terminal. We recommend using npm(Node's package manager) that comes bundelt with every Node installation. However, you have the option to use either Yarn or pnpm as your package manager. The guide supports all three package managers in the examples.

Choose an editor
As for code editors, you have the freedom to choose any editor you prefer. However, we recommend Visual Studio Code. It's a free and open-source editor available for Windows, macOS, and Linux. Visual Studio Code offers a plethora of features, extensions, and a vibrant community, making it immensely popular and user-friendly.

If you don't find VSC appealing, you can explore a list of other code editors here:

Atom
Sublime Text
Notepad++
Brackets
WebStorm
IntelliJ IDEA
Create your project folder
TIP

Setup via Terminal

Depending on your preference, you can create a new project folder using the terminal.

The folder is created on your directory you are currently located in. You can navigate to the location of your choice on your machine via cd path/to/your/folder and create a new folder.


mkdir wwebjs-bot
cd wwebjs-bot
Navigate to the location of your choice on your machine and create a new folder named wwebjs-bot (or whatever you want) for your project. Next you'll need to open your terminal in your folder.

TIP

If you use Visual Studio Code, you can press Ctrl + ` to open its integrated terminal.

With the terminal open, run the node -v command to ensure that you've successfully installed Node.js. If it outputs v18 or higher, you're all set! If not, you should consider reinstalling Node.js and following the installation steps again.

Initialize your project
NPMYARNPNPM

npm init
This command creates a package.json file for your project, which will keep track of the dependencies your project uses, as well as other information. When you run it, it will ask you a series of questions. You should fill them out according to your project's needs. If you're unsure about something or want to skip it entirely, you can leave it blank and press Enter.

TIP

For a quick start, simply run the following command to automatically fill in all the details for you.

NPMYARNPNPM

npm init -y
Example `package.json` file
Once you've completed that step, you're all set to install whatsapp-web.js!

Installing whatsapp-web.js
Now that you have your project folder set up, you can install whatsapp-web.js. To do this, open your terminal again within your folder and execute the following command:

NPMYARNPNPM

npm install whatsapp-web.js
In your console, the downloading progress will now be displayed. Once the download is completed, you'll be ready to start with your project.
Create the main file
In this section, we will create the main file for your bot. This file will be the entry point for your bot, and it will contain the code that will start the bot and handle incoming messages. We suggest that you save the file as main.js, but you may name it whatever you wish.

Here's the base code to get you started:


const { Client } = require('whatsapp-web.js');

// Create a new client instance
const client = new Client();

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

// Start your client
client.initialize();
QR-Code generation
Since whatsapp-web.js works by running WhatsApp Web in the background and automating its interaction, you'll need to authorize the client by scanning a QR code from WhatsApp on your phone. Right now, we're just logging the text representation of that QR code to the console. Let's install and use qrcode-terminal so we can render the QR code and scan it with our phone to authorize the client.

NPMYARNPNPM

npm install qrcode-terminal
And now we'll modify our code to use this new module:


const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client();

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.initialize();
Our modification now results in the QR code being displayed in the terminal upon startup. From that moment onward, the QR code will be regenerated every 30 seconds until it's scanned with your mobile device. To authorize the client, open WhatsApp on your phone, go to the settings, and scan the QR code. After the scan, the client should be authorized, and you'll see a Client is ready! message printed out in the terminal.

qr code imagge

Run your bot
To run your bot, open your terminal and, simply execute node main.js in your terminal. If you've followed all the steps correctly, you should now have a connected client to WhatsApp Web.

TIP

For a quicker way to run your bot, open your package.json file and modify the main property to main.js. Additionally, include a start script in the scripts field. This will enable you to run your bot by executing npm start in your terminal.


"main": "main.js",
"scripts": {
  "start": "node ."
},
After closing the process with Ctrl + C, you can press the up arrow on your keyboard to bring up the latest commands you've run. This will allow you to quickly run your bot again by pressing Enter.

Listening for messages
To listen for incoming messages, the client needs to listen for the message event. When a message is received, it emits a Message object in response, which provides information about the message. In this example, we aim to receive the message and log it to the console. Here's how you can do it:


// Listening to all incoming messages
client.on('message_create', message => {
	console.log(message.body);
});
Replying to messages
To reply to a message, you can use the sendMessage method. This method accepts a string as a parameter, which will be sent as a message. This capability also allows you to create commands. Here's an example of a simple ping/pong command:


client.on('message_create', message => {
	if (message.body === '!ping') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
	}
});
ping message asset

The messages object contains also a reply() method, which allows you to directly reply to a message. This method also require a string as a parameter, which will be sent as a message.


client.on('message_create', message => {
	if (message.body === '!ping') {
		// reply back "pong" directly to the message
		message.reply('pong');
	}
});
ping message replay asset

In this case, notice that we didn't have to specify which chat we were sending the message to.
Authentication
By default, whatsapp-web.js does not save session information. This means that you would have to scan the QR-Code to reauthenticate every time you restart the client. If you'd like to persist the session, you can pass an authStrategy as a client option. The library provides a few authentication strategies to choose from, but you can also choose to extend them or build your own.

WARNING

To ensure proper functioning of Puppeteer on no-gui systems, include the no-sandbox flag into the launch command within the configuration. Additionally, if your program runs with root privileges, remember to include the --disable-setuid-sandbox flag, as Chromium doesn't support running as root without a sandbox by default due to security reasons:


const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});
TIP

For most usage cases, we would recommend the LocalAuth strategy because it is the easiest to use. However, you can also use the RemoteAuth strategy for more flexibility and customization.

NoAuth Strategy
This is the default authStrategy used when you don't provide one. It does not provide any means of saving and restoring sessions. You can set this if you'd like to be explicit about getting a fresh session every time the client is restarted.


const { Client, NoAuth } = require('whatsapp-web.js');

const client = new Client();

// equivalent to:
const client = new Client({
    authStrategy: new NoAuth()
});
LocalAuth Strategy
WARNING

LocalAuth requires a persistent filesystem to be able to restore sessions. This means that out of the box it is not compatible with hosts that provide ephemeral file systems, such as Heroku.

This strategy enables session-restore functionality by passing a persistent user data directory to the browser. This means that other data, such as message history when using a multidevice-enabled account, will also be persisted and restored.


const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth()
});
Location Path
By default, the relevant session files are stored under a .wwebjs_auth directory. However, you can change this by specifying the dataPath option when instantiating LocalAuth Strategy:


const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'yourFolderName'
    })
});
This will create a yourFolderName folder with a stored session.

Multiple Sessions
If you're interested in using multiple clients belonging to different sessions, you can pass a clientId to segregate them from each other. This is useful when you want to run multiple clients at the same time.


const { Client, LocalAuth } = require('whatsapp-web.js');

const client1 = new Client({
    authStrategy: new LocalAuth({
    clientId: "client-one" })
});

const client2 = new Client({
    authStrategy: new LocalAuth({
    clientId: "client-two" })
});
RemoteAuth Strategy
The RemoteAuth strategy allows you to save the WhatsApp Multi-Device session in a remote database. Instead of relying on a persistent file system, RemoteAuth can efficiently save, extract, and restore sessions. It also generates periodic backups to ensure that the saved session is always in sync and avoids data loss.


const { Client, RemoteAuth } = require('whatsapp-web.js');

const store = new MongoStore({ mongoose: mongoose });
const client = new Client({
    authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000
    })
});
Remote Stores
Stores are external-independent database plugins that enable storing the session into different databases. To work with RemoteAuth, new stores must implement the following interface.

sessionExistssavesessionExistsdelete

await store.sessionExists({session: 'yourSessionName'});
You can either implement your own store or use already implemented ones.

MongoDB Store
Before you can use this Auth strategy you need to install the wwebjs-mongo module in your terminal:

NPMYARNPNPM

npm install wwebjs-mongo
Once the package is installed, you have to import it and pass it to the RemoteAuth strategy as follows:


const { Client, RemoteAuth } = require('whatsapp-web.js');

// Require database
const { MongoStore } = require('wwebjs-mongo');
const mongoose = require('mongoose');

// Load the session data
mongoose.connect(process.env.MONGODB_URI).then(() => {
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
        authStrategy: new RemoteAuth({
            store: store,
            backupSyncIntervalMs: 300000
        })
    });

    client.initialize();
});
AWS S3 Store
Before you can use this Auth strategy you need to install the wwebjs-aws-s3 module in your terminal:

NPMYARNPNPM

npm install wwebjs-aws-s3
Once the package is installed, you have to import it and pass it to the RemoteAuthstrategy as follows:


const { Client, RemoteAuth } = require('whatsapp-web.js');
const { AwsS3Store } = require('wwebjs-aws-s3');
const {
    S3Client,
    PutObjectCommand,
    HeadObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: 'AWS_REGION',
    credentials: {
        accessKeyId: 'AWS_ACCESS_KEY_ID',
        secretAccessKey: 'AWS_SECRET_ACCESS_KEY'
    }
});

const putObjectCommand = PutObjectCommand;
const headObjectCommand = HeadObjectCommand;
const getObjectCommand = GetObjectCommand;
const deleteObjectCommand = DeleteObjectCommand;

const store = new AwsS3Store({
    bucketName: 'example-bucket',
    remoteDataPath: 'example/path/',
    s3Client: s3,
    putObjectCommand,
    headObjectCommand,
    getObjectCommand,
    deleteObjectCommand
});

const client = new Client({
    authStrategy: new RemoteAuth({
        clientId: 'yourSessionName',
        dataPath: 'yourFolderName',
        store: store,
        backupSyncIntervalMs: 600000
    })
});
Session Saved
After the initial QR scan to link the device, RemoteAuth takes about 1 minute to successfully save the WhatsApp session into the remote database, therefore the ready event does not mean the session has been saved yet. In order to listen to this event, you can now use the following:


client.on('remote_session_saved', () => {
    // Do Stuff...
});
Platform Compatibility
Status	OS
✅	MacOS
✅	Windows
✅	Ubuntu 20.04 (Heroku Compatible)
Handling Attachments
Downloading Media
Sometimes your client may need to download and process media files that have been attached to messages it receives. This library includes some useful functions to download these files in base64 format.

You can detect which messages have attached media by checking its hasMedia property. Then, you can actually download the data by using downloadMedia method of a Message object:


client.on('message', async (msg) => {
    if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        // do something with the media data here
    }
});
The downloadMedia function returns an object of type MessageMedia. This will give you access to its mimetype, base64 data and filename, if specified.

IMPORTANT

You shouldn't assume that the download will be successful. In cases where the media is not able to be downloaded (for example, if the media has been deleted from the phone or can no longer be downloaded), the downloadMedia method will return undefined.

Sending Media
You can easily send photos, audio, videos and gifs by using the library. To do this, you'll just need to construct a MessageMedia object, exactly like the one you get by downloading media. This requires the mimetype for the file you'll send, as well as a base64-encoded string representing the data:


const { MessageMedia } = require('whatsapp-web.js');

// client initialization...

client.on('message', async (msg) => {
    if (msg.body === '!send-media') {
        const media = new MessageMedia('image/png', base64Image);
        await client.sendMessage(msg.from, media);
    }
});
TIP

You can send a caption along with the file by specifying the caption option while sending the message:


// your code here...
await client.sendMessage(chatId, media, { caption: 'this is my caption' });
For more additional information, check available message send options.

Sending Local Files
If you're sending files from your computer, you can use a helper function to automatically read the file in base64, compute its mime type and get its filename:


const { MessageMedia } = require('whatsapp-web.js');

client.on('message', async (msg) => {
    if (msg.body === '!send-media') {
        const media = MessageMedia.fromFilePath('./path/to/image.png');
        await client.sendMessage(msg.from, media);
    }
});
Sending Files from a URL
A similar helper function is also available for sending files based on a remote URL:


const { MessageMedia } = require('whatsapp-web.js');

client.on('message', async (msg) => {
    if (msg.body === '!send-media') {
        const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
        await client.sendMessage(msg.from, media);
    }
});
Caveat for Sending Videos and GIFs
Whatsapp-web.js uses Puppeteer, which comes bundled with the Chromium browser, an open source version of the popular Google Chrome browser. Since AAC and H.264 are licensed formats, they are not supported by Chromium. More info on this can be found on the Puppeteer documentation.

Because of this, you'll need to point Puppeteer to use a separately installed Chrome browser if you intend to use this functionality. This can be done by passing the executablePath option to Puppeteer while creating the client:


const client = new Client({
    puppeteer: {
        executablePath: '/path/to/Chrome',
    }
})
The executablePath value will depend on your OS and install location for Chrome, but here are some defaults by OS:

macOS: /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
Windows: C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe
Linux: /usr/bin/google-chrome-stable
Mentions
With the help of the library, you can mention WhatsApp users and groups you are participating in.

Mentioning Users
Example of message with a mentioned users

TIP

It is possible to mention also those users who are not in your contact list.

Getting Mentioned Users
You can get all users that have been mentioned in a message by using getMentions method of a Message object. This will conveniently return a list of Contact objects:


// client initialization...

client.on('message', async (msg) => {
    const mentions = await msg.getMentions();
    
    for (let user of mentions) {
        console.log(`${user.pushname} was mentioned`);
    }
});
This is just a helper function for parsing the mentionedIds array available on messages. This just contains a list of user IDs, so you can use this instead if you don't intend to do anything like getting their name or accessing any properties on their Contact.

Sending Messages with User Mentions
You can mention other user by using the mentions option when sending a message. Note that the message text needs to also reference mentioned users by using the format @[phone number] without a '+' at the beginning of a phone number:


// client initialization...

client.on('message', async (msg) => {
    const chat = await msg.getChat();
    let user = await msg.getContact();
    await chat.sendMessage(`Hello @${user.id.user}`, {
        mentions: [user]
    });

    // OR

    let userPhone = '123456789';
    await chat.sendMessage(`Hello @${userPhone}`, {
        mentions: [userPhone + 'c.us']
    });
});
TIP

You can mention users in a message without explicitly referencing them by using the format @[phone number] in a message body. Those users will still be mentioned but silently; they won't see their mentioned nicknames in a message body but will still be pinged.

Example of Mentioning All Group Members
The following is a simple command that mentions all users in a group if someone sends a !everyone message:


// client initialization...

client.on('message', async (msg) => {
    if (msg.body === '!everyone') {
        const chat = await msg.getChat();
        
        let text = '';
        let mentions = [];

        for (let participant of chat.participants) {
            mentions.push(`${participant.id.user}@c.us`);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }
});
Mentioning Groups
Example of a message with a mentioned group

TIP

As a name of a group to mention, you can provide your custom group name (like in the image above). It aslo can be an original group name, this is for your choice.

Getting Mentioned Groups
You can get all groups that have been mentioned in a message by using getGroupMentions method of a Message object. This will conveniently return a list of groups:


// client initialization...

client.on('message', async (msg) => {
    const group_mentions = await msg.getGroupMentions();
    
    for (const group of group_mentions) {
        console.log(`Group ${group.name} with an ID ${group.id._serialized} was mentioned`);
    }
});
This is just a helper function that simply prints group names mentioned in the message along with their IDs for demonstration.

Sending Messages with Group Mentions
You can send a message with clickable group mentions, and similar to user mentions, when the group mention is tapped, a chat with that mentioned group will be opened.

IMPORTANT

Users who do not participate in the mentioned group, will not be able to get that group opened by tapping on its mention, the same when the group does not exist.


// client initialization...

client.on('message', async (msg) => {    
    if (msg.body === '!mentionGroups') {
        const chat = await msg.getChat(); // defining chat to send the group mention to
        const groupId = 'YYYYYYYYYY@g.us'; // defining an ID of a group to mention

        // To mention one group:
        await chat.sendMessage(
            `@${groupId}`,
            { groupMentions: { subject: 'Your Group Name Here', id: groupId } }
        );

        // To mention a list of groups:
        const anotherGrpId = 'XXXXXXXXXX@g.us'; // defining another ID of a group to mention
        await chat.sendMessage(
            `Here can be your custom text... @${groupId}, @${anotherGrpId}`, {
            groupMentions: [
                { subject: 'Some Group Name Of Your Choice', id: groupId },
                { subject: 'Some Another Group Name', id: anotherGrpId }
            ]
        });
    }
});