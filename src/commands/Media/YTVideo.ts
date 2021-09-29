import { MessageType, Mimetype } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import YT from '../../lib/YT'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'ytv',
            description: 'ඔබ ලබාදුන් YouTube සබැඳිය වීඩියෝවක් ලෙස ලබාගත හැක',
            category: 'media',
            aliases: ['ytvideo'],
            usage: `${client.config.prefix}ytv [URL]`,
            baseXp: 10
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.urls.length) return void M.reply('🔎 ඔබට බාගත කිරීමට අවශ්‍ය වීඩියෝවෙහි සබැඳිය ලබාදෙන්න')
        const video = new YT(M.urls[0], 'video')
        if (!video.validateURL()) return void M.reply(`වලංගු සබැඳියක් ලබාදෙන්න`)
        const { videoDetails } = await video.getInfo()
        M.reply('❤ වීඩියෝව එවමින් පවතී...')
        if (Number(videoDetails.lengthSeconds) > 1800)
            return void M.reply('⚓ විනාඩි 30 කට වැඩි වීඩියෝ එවීමට නොහැක')
        M.reply(await video.getBuffer(), MessageType.video).catch((reason: Error) =>
            M.reply(`❌ දෝෂයක් හටගැණුනි, හේතුව: ${reason}`)
        )
    }
}
