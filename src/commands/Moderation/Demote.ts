import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'demote',
            description: 'ඔබ සඳහන් කරන ලද පරිශීලකයාගේ තනතුර ඉවත් කරයි',
            category: 'moderation',
            usage: `${client.config.prefix}demote [mention | @tag]`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply(`❌ මම ඇඩ්මින් වරයෙක් නොවන නිසා ${this.config.command} මෙම විධානය ඉටු කිරිමට නොහැක`)
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length) return void M.reply(`ඔබට ${this.config.command} කිරීමට අවශ්‍ය පරිශීලකයාව සඳහන් කරන්න`)
        M.mentioned.forEach(async (user) => {
            const usr = this.client.contacts[user]
            const username = usr.notify || usr.vname || usr.name || user.split('@')[0]
            if (!M.groupMetadata?.admins?.includes(user)) M.reply(`❌ *${username}* ඇඩ්මින් වරයෙකු නොවේ`)
            else if (user !== this.client.user.jid) {
                await this.client.groupDemoteAdmin(M.from, [user])
                M.reply(`➰ සාර්ථකව තනතුරෙන් පහකරන ලදී *${username}*`)
            }
        })
    }
}
