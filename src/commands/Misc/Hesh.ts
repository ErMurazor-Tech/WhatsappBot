import { MessageType } from '@adiwajshing/baileys'
import { join } from 'path'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'hesh',
            description: 'බොට්ගේ විස්තර පෙන්වයි',
            category: 'misc',
            usage: `${client.config.prefix}hesh`,
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        return void M.reply(`👾 *Queen Hesh* 👾\n\n🍀 *විස්තරය:* Queen Hesh යනු Er Murazor විසින් නැවත ලියන ලද Whatsapp Group Bot කෙනෙකි.\n\n🌐 *සබැඳිය:* https://github.com/ErMurazor-Tech/WhatsappBot#readme\n\n📂 *Repository:* https://github.com/ErMurazor-Tech/WhatsappBot`
        ).catch((reason: any) =>
            M.reply(`දෝෂයක් හටගැණුනි, හේතුව: ${reason}`))
    }
}
