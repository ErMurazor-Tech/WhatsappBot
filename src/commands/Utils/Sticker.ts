import { MessageType, Mimetype } from '@adiwajshing/baileys'
import { Sticker } from 'wa-sticker-formatter'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'sticker',
            description: 'ඔබ එවූ පින්තූරය හෝ වීඩියෝව ස්ටිකරයක් බවට පත් කරයි',
            category: 'utils',
            usage: `${client.config.prefix}sticker [(as caption | tag)[video | image]]`,
            dm: true,
            baseXp: 30
        })
    }

    run = async (M: ISimplifiedMessage, parsedArgs: IParsedArgs): Promise<void> => {
        let buffer
        if (M.quoted?.message?.message?.imageMessage || M.quoted?.message?.message?.videoMessage)
            buffer = await this.client.downloadMediaMessage(M.quoted.message)
        if (M.WAMessage.message?.imageMessage || M.WAMessage.message?.videoMessage)
            buffer = await this.client.downloadMediaMessage(M.WAMessage)
        if (!buffer) return void M.reply(`ඔබ කිසිදු පින්තූරයක් හෝ වීඩියෝවක් එවා නැත`)
        parsedArgs.flags.forEach((flag) => (parsedArgs.joined = parsedArgs.joined.replace(flag, '')))
        const pack = parsedArgs.joined.split('|')
        const sticker = new Sticker(buffer, {
            pack: pack[1] || '❤ 𝐇𝐚𝐧𝐝𝐜𝐫𝐚𝐟𝐭𝐞𝐝 𝐅𝐨𝐫 𝐘𝐨𝐮 ',
            author: pack[2] || 'Queen Hesh Whatsapp Botto ❤',
            crop: parsedArgs.flags.includes('--stretch')
        })
        await sticker.build()
        await M.reply(await sticker.get(), MessageType.sticker, Mimetype.webp)
    }
}
