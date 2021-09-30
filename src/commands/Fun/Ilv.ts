import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'ilv',
            description: 'ilv යන්නෙහි අරුත I Love You යන්නයි. විධානය යවා බලන්න...',
            category: 'fun',
            usage: `${client.config.prefix}ilv`,
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        return void (await M.reply(`I Love too... ${M.sender.username}!❤❤`))
    }
}
