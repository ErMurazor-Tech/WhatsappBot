import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import YT from '../../lib/YT'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'yta',
            description: 'සපයන ලද YouTube සබැඳිය ශ්‍රව්‍ය මාධ්‍යයක් ලෙස බාගත කරයි',
            category: 'media',
            aliases: ['ytaudio'],
            usage: `${client.config.prefix}ytv [URL]`,
            baseXp: 20
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!M.urls.length) return void M.reply('🔎 ඔබට බාගත කරගැනීමට අවශ්‍ය Youtube සබැඳිය ලබාදෙන්න')
        const audio = new YT(M.urls[0], 'audio')
        if (!audio.validateURL()) return void M.reply(`⚓ වලංගු සබැඳියක් ලබාදෙන්න`)
        M.reply('❤ ගීතය එවමින්...')
        M.reply(await audio.getBuffer(), MessageType.audio).catch((reason: Error) =>
            M.reply(`❌ දෝෂයක් හටගැණුනි, හේතුව: ${reason}`)
        )
    }
}
