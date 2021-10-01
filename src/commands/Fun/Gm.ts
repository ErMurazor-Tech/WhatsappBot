import { MessageType, Mimetype } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import request from '../../lib/request'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor (client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'gm',
            description: 'ඔබ සඳහන් කල පුද්ගලයන් වෙත සුභ උදෑසනක් පතයි',
            category: 'fun',
            usage: `${client.config.prefix}gm@<user>`,
        })
    }
    run = async (M:ISimplifiedMessage) : Promise<void> => {
        const immortals = [M.sender, this.client.user.jid]
        if (M.quoted?.sender) M.mentioned.push(M.quoted.sender)
        if (!M.mentioned.length || !M.mentioned[0]) return void M.reply('සුබපැතීමට අවශ්‍ය පුද්ගලයාව සඳහන් කරන්න')
        let text = '*STATE*\n\n'
        for (const user of M.mentioned) {
            if (immortals.includes(user)) continue
            const data = await this.client.getUser(user)
            const info = this.client.getContact(user)
            const username = info.notify || info.vname || info.name || user.split('@')[0]
        const n = ['./assets/images/gm1.jpg', './assets/images/gm2.jpg', './assets/images/gm3.jpg', './assets/images/gm4.jpg',]
        let hug = n[Math.floor(Math.random() * n.length)]
        return void this.client.sendMessage(M.from, {url : hug},
            MessageType.image,
            {mimetype: Mimetype.jpeg, caption: `ඔයාට සුබම සුබ උදෑසනක් වේවා ${username}!❤❤`})
    }
}
