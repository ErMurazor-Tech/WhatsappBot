import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import request from '../../lib/request'
import Spotify from '../../lib/Spotify'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'spotify',
            description: 'ඔබ සැපයූ Spotify සබැඳියෙහි ඇති ගීතය බාගත කරයි',
            category: 'media',
            usage: `${client.config.prefix}spotify [URL]`,
            baseXp: 20,
            aliases: ['sp']
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.urls.length) return void M.reply(`🔎 බාගත කරගැනීමට අවශ්‍ය Spotify ගීතයෙහි සබැඳිය ලබාදෙන්න`)
        const url = M.urls[0]
        const track = new Spotify(url)
        const info = await track.getInfo()
        if (info.error) return void M.reply(`⚓ දෝෂයක් : ${url}. සබැඳිය නිවරැදිදැයි පරීක්ෂා කොට බලන්න`)
        const caption = `🎧 *Title:* ${info.name || ''}\n🎤 *Artists:* ${(info.artists || []).join(',')}\n💽 *Album:* ${
            info.album_name
        }\n📆 *Release Date:* ${info.release_date || ''}`
        M.reply(
            await request.buffer(info?.cover_url as string),
            MessageType.image,
            undefined,
            undefined,
            caption
        ).catch((reason: any) => M.reply(`❌ දෝෂයක් හටගැණුනි, හේතුව: ${reason}`))
        M.reply(await track.getAudio(), MessageType.audio).catch((reason: any) =>
            M.reply(`❌ දෝෂයක් හටගැණුනි, හේතුව: ${reason}`)
        )
    }
}
