import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import jimp from 'jimp'
export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'blur',
            description: 'ලබාදුන් පින්තූරය බොඳ කරයි',
            category: 'utils',
            usage: `${client.config.prefix}blur [(as caption | quote)[image] | @mention]`,
            baseXp: 30
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        const image = await (M.WAMessage?.message?.imageMessage
            ? this.client.downloadMediaMessage(M.WAMessage)
            : M.quoted?.message?.message?.imageMessage
            ? this.client.downloadMediaMessage(M.quoted.message)
            : M.mentioned[0]
            ? this.client.getProfilePicture(M.mentioned[0])
            : this.client.getProfilePicture(M.quoted?.sender || M.sender.jid))
        if (!image) return void M.reply(`පින්තූරය ලබාගැනීමට නොහැකි විය`)
        const level = joined.trim() || '5'
        const img = await jimp.read(image as string)
        img.blur(isNaN((level as unknown) as number) ? 5 : parseInt(level))
        img.getBuffer(`image/png`, (err, buffer) => {
            if (err) return void M.reply(err?.message || `පින්තූරය බොඳ කිරීමට නොහැකි විය`)
            M.reply(buffer, MessageType.image)
        })
    }
}
