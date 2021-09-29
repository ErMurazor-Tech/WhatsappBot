import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'unban',
            description: 'ඔබ විසින් පෙරදී තහනම් කල පුද්ගලයකුගේ තහනම ඉවත් කරයි',
            category: 'dev',
            usage: `${client.config.prefix}unban [@tag]`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!this.client.config.mods?.includes(M.sender.jid)) return void M.reply('❌ ඇඩ්මින් වරුන්ට පමණක් භාවිතා කල හැක')
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length || !M.mentioned[0])
            return void M.reply('සක්‍රීය කිරීමට අවශ්‍ය තැනැත්තාව tag කරන්න')
        let text = '*STATE*\n\n'
        for (const user of M.mentioned) {
            const data = await this.client.getUser(user)
            const info = this.client.getContact(user)
            const username = info.notify || info.vname || info.name || user.split('@')[0]
            if (!data?.ban) {
                text += `🟨 ${username}: තහනමට ලක්වී නැත\n`
                continue
            }
            await this.client.unbanUser(user)
            text += `🟩 ${username}: තහනම ඉවත් කරන ලදී\n`
        }
        M.reply(text)
    }
}
