import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'purge',
            description: 'සියලුම සාමාජිකයන්ව සමූහයෙන් ඉවත් කරයි',
            category: 'moderation',
            usage: `${client.config.prefix}purge`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (
            M.groupMetadata?.owner !== M.sender.jid &&
            M.groupMetadata?.owner !== M.sender.jid.replace('s.whatsapp.net', 'c.us')
        )
            M.reply('මෙම විධානය භාවිතා කල හැක්කේ සමූහයේ අයිතිකරුට පමණි')
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply("ඇඩ්මින් වරයෙකු නොවී මට කිසිවෙකුව ඉවත් කල නොහැක")
        if (!this.purgeSet.has(M.groupMetadata?.id || '')) {
            this.addToPurge(M.groupMetadata?.id || '')
            return void M.reply(
                "ඔබට මේ පිලිබඳ විශ්වාසද? මෙයින් සියලුදෙනාවම සමූහයෙන් ඉවත් කරාවි. ඔබට අවශ්‍ය නම් පමණක් මෙම විධානය බාවිතා කරන්න"
            )
        }
        M.groupMetadata.participants.map(async (user) => {
            if (!user.isAdmin) await this.client.groupRemove(M.from, [user.jid])
        })
        await M.reply('හරි!')
        this.client.groupLeave(M.from)
    }

    purgeSet = new Set<string>()

    addToPurge = async (id: string): Promise<void> => {
        this.purgeSet.add(id)
        setTimeout(() => this.purgeSet.delete(id), 60000)
    }
}
