import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import yts from 'yt-search'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'karaoke',
            description: 'ඔබ නම් කරන ලද කැරෝකේ ගීතය ලබාදේ',
            category: 'media',
            aliases: ['sing'],
            usage: `${client.config.prefix}karaoke [term]`,
            baseXp: 20
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!joined) return void M.reply('ගීතය සඳහා නමක් ලබා දෙන්න')
        const term = joined.trim()
        const { videos } = await yts(term + ' karaoke song')
        if (!videos || videos.length <= 0) return void M.reply(`No Matching videos found for the term *${term}*`)
        const text = `Via Queen Hesh❤ && Void`

        this.client
            .sendMessage(M.from, text, MessageType.extendedText, {
                quoted: M.WAMessage,
                contextInfo: {
                    externalAdReply: {
                        title: `Search Term: ${term}`,
                        body: `❤ Handcrafted for you by Queen Hesh ❤`,
                        mediaType: 2,
                        thumbnailUrl: videos[0].thumbnail,
                        mediaUrl: videos[0].url
                    }
                }
            })
            .catch((reason: any) => M.reply(`an error occupered, Reason: ${reason}`))
    }
}
