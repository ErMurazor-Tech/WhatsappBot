import { MessageType, Mimetype } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import request from '../../lib/request'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor (client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'godmode',
            description: 'ආහ්හ්...ආහ්හ්හ්...ආහ්හ්හ්...අනේ මගෙ දෙවියනේ...',
            category: 'fun',
            usage: `${client.config.prefix}godmode@<user>`,
        })
    }
    run = async (M:ISimplifiedMessage) : Promise<void> => {
        const immortals = [M.sender, this.client.user.jid]
        const n = ['https://t.me/hubprcloude', 'https://t.me/joinchat/idJuKbMClCQzZTky', 'https://t.me/joinchat/OeaT3cmxYCVkZDQy', 'https://t.me/joinchat/6u365c6BNVk1ZWZit.me/joinchat/LZHLrV_F1z00YzBl',]
        let hug = n[Math.floor(Math.random() * n.length)]
    }
}
