import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'admins',
            description: 'සියලුම ඇඩ්මින් වරුන්ව tag කරයි 🎖️',
            category: 'general',
            usage: `${client.config.prefix}admins (Message)`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        return void (await M.reply(
            `ADMINS!\n[Tags Hidden]`,
            undefined,
            undefined,
            M.groupMetadata?.admins
        ).catch((reason: any) => M.reply(`an error occupered, Reason: ${reason}`)))
    }
}
