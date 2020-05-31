const Discord = require('discord.js');
const customisation = require('../customisation.json');
exports.run = (client, message, args) => {
  let reason = args.slice(1).join(' ');
  if (!message.mentions.users.first()) return message.reply("You need to Mention someone to soft ban them!");
  let user = message.mentions.users.first();
  let logchannel = message.guild.channels.cache.find(val => val.name === 'logs');
  if (!logchannel) return message.reply('I cannot find a logs channel');
  //if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply(":no_entry_sign: **Error:** You don't have the **Ban Members** permission!");
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to soft ban them.').catch(console.error);
  if (message.mentions.users.first().id === message.author.id) return message.reply('I can\' let you do that, self-harm is bad:facepalm:');
  if (message.mentions.users.first().id === "242263403001937920") return message.reply("You can't ban my Developer:wink:");
  if (reason.length < 1) reason = 'No reason supplied.';

  if (!message.guild.member(user).bannable) return message.reply(`:redTick: I cannot ban that member`);
  
  const embed = new Discord.MessageEmbed()
  .setColor(0xFF0000)
  .setTimestamp()
  .addField('Action:', ' Soft Ban')
  .addField('User:', `${user.username}#${user.discriminator} (${user.id})`)
  .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
  .addField('Reason', reason)
  .setFooter(`© Cryptonix X Mod Bot by ${customisation.ownername}`);

  //let obj = JSON.parse(`{"days":7, "reason": ${reason}}`)
  message.mentions.users.first().send({embed});
  message.guild.members.ban(user.id, {days:7, reason: reason});
  message.guild.members.unban(user.id, reason);

  const settings = require("../models/settings.js")
  settings.findOne({
    guildID: message.guild.id
  }, (err, settings) =>{
    let logs = settings.logs
    let logchannel = settings.logchannel;
    if  (logs == true && logchannel !== 'none'){
      message.channel.send(`:hammer: Done. <@${user.id}> has been Softbanned. Also I've logged the ban in <#${logchannel}>.`)
      if(client.channels.cache.get(logchannel)) client.channels.cache.get(logchannel).send({embed});
    }else{
      return message.channel.send(`:hammer: Done. You don't have to worry about that shit head anymore, I have banned them!`)
    }
  })
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'softban',
  description: 'Soft Bans the mentioned user.',
  usage: 'softban [mention] [reason]'
};
