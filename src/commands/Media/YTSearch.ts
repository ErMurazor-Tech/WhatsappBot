import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import yts from 'yt-search'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'yts',
            description: 'YouTube හි සෙවීමට',
            category: 'media',
            aliases: ['ytsearch'],
            usage: `${client.config.prefix}yts [term]`,
            baseXp: 20
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!joined) return void M.reply('🔎 සෙවීමට අවශ්‍ය වචනය ලබා දෙන්න')
        const term = joined.trim()
        const { videos } = await yts(term)
        if (!videos || videos.length <= 0) return void M.reply(`⚓ කිසිඳු ගැලපෙන වීඩියෝවක් හමුවූයේ නැත : *${term}*`)
        const length = videos.length < 10 ? videos.length : 10
        let text = `🔎 *ප්‍රතිපල ලබාදීම ${term}*\n`
        for (let i = 0; i < length; i++) {
            text += `*#${i + 1}*\n📗 *තේමාව:* ${videos[i].title}\n📕 *නාලිකාව:* ${
                videos[i].author.name
            }\n 📙 *ධාවන කාලය:* ${videos[i].duration}\n📘 *සබැඳිය:* ${videos[i].url}\n\n`
        }
        M.reply('❤ සොයමින් පවතී')
        this.client
            .sendMessage(M.from, text, MessageType.extendedText, {
                quoted: M.WAMessage,
                contextInfo: {
                    externalAdReply: {
                        title: `සෙවුම් වචනය: ${term}`,
                        body: `❤Queen Hesh වෙතින්❤`,
                        mediaType: 2,
                        thumbnailUrl: videos[0].thumbnail,
                        mediaUrl: videos[0].url
                    }
                }
            })
            .catch((reason: any) => M.reply(`❌ දෝෂයක් හටගැණුනි, හේතුව: ${reason}`))
    }
}
