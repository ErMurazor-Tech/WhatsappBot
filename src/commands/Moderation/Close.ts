import { GroupSettingChange } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'close',
            description: 'ඇඩ්මින් වරුන්ට හැර අනෙක් සාමාජිකයන් හට මැසේජ් කිරීමට නොහැකි වේ',
            category: 'moderation',
            usage: `${client.config.prefix}close`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply("ඇඩ්මින් වරයෙකු නොවී මට මෙම සමූහය වසාදැමීමට නොහැක")
        if (M.groupMetadata.announce === "true")
          return void M.reply("සමූහය දැනටමත් වසා ඇත")
        this.client.groupSettingChange(M.groupMetadata.id, GroupSettingChange.messageSend, true)
        return
    }
}
