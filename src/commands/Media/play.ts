import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'
import yts from 'yt-search'
import YT from '../../lib/YT'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'play',
            description: '🎵 ඔබට අවශ්‍ය ගීතය වාදනය කරයි!',
            category: 'media',
            aliases: ['music'],
            usage: `${client.config.prefix}play [term]`,
            baseXp: 30
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!joined) return void M.reply('🔎 ඔබට අවශ්‍ය ගීතයෙහි නම ලියන්න')
        const term = joined.trim()
        const { videos } = await yts(term)
        if (!videos || videos.length <= 0) return void M.reply(`⚓ එම වචනයට ගැලපෙන වීඩියෝවක් හමුවූයෙ නැත : *${term}*`)
        const audio = new YT(videos[0].url, 'audio')
        if (!audio.url) return
        M.reply('❤ ගීතය එවමින්...')
        this.client
            .sendMessage(M.from, await audio.getBuffer(), MessageType.audio, {
                quoted: M.WAMessage,
                contextInfo: {
                    externalAdReply: {
                        title: videos[0].title.substr(0, 30),
                        body: `ගායකයා : ${videos[0].author.name.substr(0, 20)}\nSent Via : Queen Hesh`,
                        mediaType: 2,
                        thumbnailUrl: `https://i.ytimg.com/vi/${audio.id}/hqdefault.jpg`,
                        mediaUrl: audio.url
                    }
                }
            })
            .catch((reason: Error) => M.reply(`❌ දෝෂයක් හටගැණුනි, හේතුව: ${reason}`))
    }
}
