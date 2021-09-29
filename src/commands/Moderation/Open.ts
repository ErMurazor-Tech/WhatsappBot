import { GroupSettingChange } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'open',
            description: 'සෑම සාමාජිකයෙකුටම සමූහයට මැසේජ් දැමීමට ඉඩ ලබාදේ.',
            category: 'moderation',
            usage: `${client.config.prefix}open`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.groupMetadata?.admins?.includes(this.client.user.jid))
            return void M.reply("මට ඇඩ්මින් වරයෙකු නොවී සමූහය විවෘත කල නොහැක")
            if (M.groupMetadata.announce === "false")
            return void M.reply("සමූහය දැනටමත් විවෘතයි")
  
        this.client.groupSettingChange(M.groupMetadata.id, GroupSettingChange.messageSend, false)
    }
}
