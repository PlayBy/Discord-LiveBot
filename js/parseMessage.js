let parseSend = (text) => {
  // The regex used for the emojis
  let emojiRegex = /:\(|>:-\(|>=\(|>=-\(|:"\)|:-"\)|="\)|=-"\)|<\/3|<3|<3|♡|:-\/|=-\/|:'\(|:'-\(|:,\(|:,-\(|='\(|='-\(|=,\(|=,-\(|:\(|:-\(|=\(|=-\(|]:\(|]:-\(|]=\(|]=-\(|o:\)|O:\)|o:-\)|O:-\)|0:\)|0:-\)|o=\)|O=\)|o=-\)|O=-\)|0=\)|0=-\)|:'\)|:'-\)|:,\)|:,-\)|:'D|:'-D|:,D|:,-D|='\)|='-\)|=,\)|=,-\)|='D|='-D|=,D|=,-D|:\*|:-\*|=\*|=-\*|x-\)|X-\)|:o|:-o|:O|:-O|=o|=-o|=O|=-O|:@|:-@|=@|=-@|:D|:-D|=D|=-D|:\)|:-\)|=\)|=-\)|]:\)|]:-\)|]=\)|]=-\)|:,'\(|:,'-\(|;\(|;-\(|=,'\(|=,'-\(|:P|:-P|=P|=-P|8-\)|B-\)|,:\(|,:-\(|,=\(|,=-\(|,:\)|,:-\)|,=\)|,=-\)|:s|:-S|:z|:-Z|:\$|:-\$|=s|=-S|=z|=-Z|=\$|=-\$|;\)|;-\)|:\||=\|/gm;

  // Replace all the shortcuts with actual emojis
  text = text.replace(emojiRegex, (a) => {
    let shortcut = shortcuts.find((s) => s.face === a);
    if (shortcut) return idToUni[shortcut.id];
    return a;
  });

  text = text.replace(/:(.*):/gm, (a, b) => {
    let shortcut = idToUni[b];
    if (shortcut) return shortcut;
    return a;
  });

  return text;
};

let parseMessage = (
  text,
  msg = null,
  embed = false,
  ping = false,
  embededLink
) => {
  // Remove html <, > and & in the message
  let textContent = text.replace(/<|>|&/gm, (s) =>
    s == '<' ? '&lt;' : s == '>' ? '&gt;' : '&amp'
  );
  // General message parsing
  // Match links
  textContent = textContent.replace(
    /https?:\/\/((?:\w|.)+?)(?=\/|(?= )|[>)}\]:; ]|$)(?:[\w\.!@#$%^&*\-\/]+?)*(?:\?.*?(?=[>)}\]:; ]|$))?/gm,
    (a, b, c) => {
      let endl = '';
      if (!a.endsWith('/')) endl = '/';
      return `<a href="${a}" rel="noreferrer noopener" title="${a}" target="_blank">${a}${endl}</a>`;
    }
  );

  // Add html tags for markup
  textContent = textContent.replace(
    /(?<!\\)\*\*\*(.*?)(?<!\\)\*\*\*/gm,
    '<strong><i>$1<i></strong>'
  );
  textContent = textContent.replace(
    /(?<!\\)\*\*(.*?)(?<!\\)\*\*/gm,
    '<strong>$1</strong>'
  );
  textContent = textContent.replace(/(?<!\\)__(.*?)(?<!\\)__/gm, '<u>$1</u>');
  textContent = textContent.replace(/(?<!\\)_(.*?)(?<!\\)_/gm, '<i>$1</i>');
  textContent = textContent.replace(/(?<!\\)\*(.*?)(?<!\\)\*/gm, '<i>$1</i>');
  textContent = textContent.replace(
    /(?<!\\)\`\`\`([^\n]+)?\n(.*?)(?:\n)?(?=\`\`\`)\`\`\`/gs,
    `<div class="codeBlock${embed ? ' codeBlockEmbed' : ''} $1">$2</div>`
  );
  textContent = textContent.replace(
    /(?<!\\)`(.*?)`/gm,
    '<span class="inlineCodeBlock">$1</span>'
  );
  textContent = textContent.replace(
    /(?<!\\)\|\|(.*?)\|\|(?<!\\)/gm,
    '<span class="spoilerBlock" onclick="discoverSpoiler(this)">$1</span>'
  );
  textContent = textContent.replace(
    /(?<!\\)\~(.*?)(?<!\\)\~/gm,
    '<del>$1</del>'
  );

  // Match all emojis
  if (
    !textContent.replace(
      /((\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])| |(&lt;a?:!?.+?:[0-9]{18}?&gt;))/g,
      ''
    ).length
  ) {
    textContent = `<span class="bigEmoji">${textContent}</span>`;
  }

  // Render custom emojis
  let customEmoji = /&lt;(a)?:!?(.+?):([0-9]{18}?)&gt;/gm;
  textContent = textContent.replace(customEmoji, (a, b, c, d) => {
    if (d !== undefined) {
      return `<img class="emoji" draggable="false" alt=":${c}:" src="https://cdn.discordapp.com/emojis/${d}.${
        b == 'a' ? 'gif' : 'png'
      }?v=1"></img>`;
    }
    return b;
  });

  // Format pings
  if (msg) {
    // Format pings in embeds
    if (ping || !embed) {
      let dms = selectedChan.type == 'dm';
      textContent = formatEmbedPings(msg, textContent, dms);
      textContent = formatPings(msg, textContent, dms);
    }
    // Format links in embeds
    if (embededLink) {
      textContent = textContent.replace(
        /(?:\[(?:<(?:[\w\W]+?>([\w\.!@#$%^&*\-\/"=\[\];]+?)<(?:[\w\W\/]+?)>)|([\w\.!@#$%^&*\-\/"=<>\]\[; ]+?))\]\((?:<a href="([\w:\/.<=\-]+?)".+\)|([\w.:\/_"=\-<> ]+?)\)))/gm,
        (a, b, c, d, e) => {
          return `<a title="${b ? b : c}" href="${d ? d : e}">${b ? b : c}</a>`;
        }
      );
    }
  }

  // Parse the emojis to SVGs
  textContent = twemoji.parse(textContent);
  return textContent;
};

function discoverSpoiler(spoiler) {
  spoiler.classList.toggle('discovered');
}

// Ping formatting
function formatPings(msg, text, dms) {
  let textContent = text;
  let keys = [];

  // Get all the mentions from users, roles and channels
  if (msg.mentions.users)
    msg.mentions.users.keyArray().forEach((id) => keys.push([id, 'user']));
  if (msg.mentions.roles)
    msg.mentions.roles.keyArray().forEach((id) => keys.push([id, 'role']));
  if (msg.mentions.channels)
    msg.mentions.channels
      .keyArray()
      .forEach((id) => keys.push([id, 'channel']));

  // Replace the ping with a span container
  keys.forEach((ping) => {
    let id = ping[0];
    let type = ping[1];

    let name = '';
    let color = 0;
    if (type == 'user') {
      let user = dms
        ? bot.users.cache.get(id)
        : msg.guild.members.cache.get(id);
      name = user ? (user.displayName ? user.displayName : user.username) : id;
    } else if (type == 'role' && !dms) {
      let role = msg.guild.roles.cache.get(id);
      name = role ? role.name : id;
      color = role.color ? role.color.toString(16) : 0;
      color = color ? '#' + '0'.repeat(6 - color.length) + color : 0;
    } else if (type == 'channel' && !dms) {
      let channel = msg.guild.channels.cache.get(id);
      name = channel ? channel.name : 'deleted-channel';
    } else {
      name = id;
    }

    name = name.replace(/(\[|\]|\(|\)|\\)/gm, (a) => '\\' + a);
    let pingRegex = new RegExp(`(?:(<|>)?@!?(${name}))`, 'g');
    let channelRegex = new RegExp(`(?:(<|>)?#(${name}))`, 'g');
    textContent = textContent.replace(pingRegex, (a, b, c) =>
      b == '<' || b == '>'
        ? a
        : `<span class="ping" ${id}" ${
            color ? `style="color: ${color}"` : ''
          }>@${c}</span>`
    );
    if (!dms) {
      textContent = textContent.replace(channelRegex, (a, b, c) =>
        b == '<' || b == '>' ? a : `<span class="ping ${id}">#${c}</span>`
      );
    }
  });
  return textContent;
}

function formatEmbedPings(msg, text, dms) {
  let textContent = text;
  // console.log(text)
  let keys = [];

  // Replace user/role pings
  text.replace(/&lt;@(!?[0-9]+)&gt;/gm, (a, id) => keys.push(id));

  // Replace channel pings
  text.replace(/&lt;#(\d+)&gt;/gm, (a, id) => keys.push(id));

  // Replace the ping with a span container
  keys.forEach((id) => {
    let name = '';
    let chanName = '';
    let color = 0;

    let user = dms
      ? bot.users.cache.get(id.replace(/!/, ''))
      : msg.guild.members.cache.get(id.replace(/!/, ''));
    name = user ? (user.displayName ? user.displayName : user.username) : id;

    if (name == id && !dms) {
      let role = msg.guild.roles.cache.get(id);
      name = role ? role.name : id;
      color = role ? (role.color ? role.color.toString(16) : 0) : 0;
      color = color ? '#' + '0'.repeat(6 - color.length) + color : 0;
    }
    let channel;
    if (!dms) channel = msg.guild.channels.cache.get(id);
    chanName = channel ? channel.name : 'deleted-channel';

    let pingRegex = new RegExp(`(?:(<|>)?&lt;@!?(${id})&gt;)`, 'g');
    let channelRegex = new RegExp(`&lt;#${id}&gt;`, 'g');

    textContent = textContent.replace(pingRegex, (a, b, c) =>
      b == '<' || b == '>'
        ? a
        : `<span class="ping" ${id}" ${
            color ? `style="color: ${color}"` : ''
          }>${name.startsWith('!') ? `&lt;@${c}&gt;` : '@' + name}</span>`
    );
    if (!dms)
      textContent = textContent.replace(
        channelRegex,
        chanName == 'deleted-channel'
          ? '#deleted-channel'
          : `<span class="ping ${id}">\#${chanName}</span>`
      );
  });

  return textContent;
}
