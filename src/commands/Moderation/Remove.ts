import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            aliases: ['boom', 'kick'],
            command: 'remove',
            description: 'ඔබ සඳහන් කරන පරිශීලකයන්ව සමූහයෙන් ඉවත් කරයි',
            category: 'moderation',
            usage: `${client.config.prefix}remove [@mention | tag]`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply(`❌ මම ඇඩ්මින් වරයෙක් නොවන නිසාඅ ${this.config.command} විධානය ඉටු කිරීමට නොහැකි විය`)
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length) return void M.reply(`ඔබට ${this.config.command} කිරීමට අවශ්‍ය පරිශීලකයන්ව සඳහන් කරන්න`)
        M.mentioned.forEach(async (user) => {
            const usr = this.client.contacts[user]
            const username = usr.notify || usr.vname || usr.name || user.split('@')[0]
            if (M.groupMetadata?.admins?.includes(user)) M.reply(`❌ *${username}* ඇඩ්මින් කෙනෙකු වේ`)
            else {
                await this.client.groupRemove(M.from, [user])
                M.reply(`🏌️‍♂️සාර්ථකව ඉවත් කෙරිණි *${username}*`)
            }
        })
    }
}
