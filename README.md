<center><img src='resources/icons/logoLarge.svg' height='100px' style='border-radius: 10px;'/></center>

> LiveBot is specifically designed for bots; it cannot be used for user accounts.

An app that allows you to be inside a bot!

At the moment, LiveBot is still in alpha. Installation instructions can be found below.

## Discord
If you would like to get the latest information on the project, talk with the developers, post suggestions, get help, etc., join the official LiveBot [Discord server!](https://discord.gg/NG4rgqSgzx)

## What is this?
<img src='https://i.imgur.com/m0HvVmn.png' alt='LiveBot image preview' style='border-radius: 10px;'/>

LiveBot is a program built with electron and discord.js, that will allow you to have discord controlling a bot. You are able to view messages in channels, send messages, interact with people, and see what is going on in the servers your bot is in. LiveBot can only be used on bot accounts, if you find a way to use it on user accounts we're in no way liable for anything that might happen.

LiveBot had been built so that the style and flow is similar to discord, and while it is not exact, it is pretty close. it is also built from scratch, using no frameworks, just straight html, css, and javascript. Due to this, and having a very small developer team, additions may take a while to be added. The point is to built from scratch, we know very well that it's not the fastest way to make something like this. However, LiveBot is slowly being filled with cool exclusive features like the pull-up user settings menu, the soon to come embed builder, native support for scripts, and more!

## How to install
### Manual (Necessary for Mac and Linux - Works on Windows too)
**Before following any installation steps**, make sure you [install Node.js](https://nodejs.org/en/).
You can install LiveBot in many ways such as Git, but the easiest way is to just download as a compressed (zip) file, which you can do by pressing the green button above that has `Code` written on it. Once you have downloaded and extracted the zip file, go into the directory with a command prompt or shell window. In the shell window, enter the command `npm install` to install the needed dependencies. Make sure that the terminal window is running as Administrator (or root, for Linux people). <!-- is this necessary? --> Once this process is finished — it may take some time — type `npm start`. 

### Easy (Windows only)
If you would like to just download and open a `.exe` file, find the releases on the right side of this page, and download the latest release. You will need to download the source code and the `.exe` file, then place the file in the source code folder. 

## Some features:
### Token switcher (User menu)
This box is how you log into a profile after already logging in. To log into a token by default, put it into this box then press the save button. Otherwise if you are just logging into a token just for a look, input the token into the box then press `enter`.

The token changer used to be at the top of the main screen, but has moved to the user options menu.

<img src='https://i.imgur.com/1rnEpQD.png' alt='Token switcher preview' style='border-radius: 10px;'>

### Barry
Barry is the LiveBot version of discord's Clyde. Except Barry has some fun commands! Just use the prefix `/` and to see the commands write `/help`. Only you can see what barry says, so don't worry about interfering with any conversations. <br>
<img src='https://i.imgur.com/PGInuit.png' alt="Barry's help message" style='border-radius: 10px;'>

### Profile card
The profile card is able to tell you the username, the avatar image, the discriminator, and something discord does not have. The profile card will tell you if the account you are signed into is a bot or a user. This can be handy if you are not quite sure. As you can no longer login with a user account it's just legacy code and for the looks. This card also has the pull up menu on the right side, so you can get to all the settings. <br>

<img src='https://i.imgur.com/79NacEx.png' alt='Profile card preview' style='border-radius: 10px;'>

### Generate Invite

LiveBot gives you the ability to generate an invite quickly from within the app, instead of having to go to your bot's application page in the Discord Developer portal. It can be found in the user settings page in the pull up menu. Just toggle all the permissions you'd like to give the invite (by default, everything recommended to use LiveBot's features is enabled). 

<img src='https://i.imgur.com/ggkyQtn.png' alt='Invite generator preview' style='border-radius: 10px;'>
