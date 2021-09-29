import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'mods',
            description: "ඇඩ්මින් වරයාගේ සම්බන්ධතා විස්තර පෙන්වයි",
            category: 'general',
            usage: `${client.config.prefix}mods`,
            aliases: ['moderators', 'mod', 'owner']
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        if (!this.client.config.mods || !this.client.config.mods[0]) return void M.reply('*[UNMODERATED]*')
        const filteredMap = this.client.config.mods.map((mod) => this.client.getContact(mod)).filter((user) => user)
        let text = '🍥 *Moderators* 🍥\n\n'
        filteredMap.forEach(
            (user, index) =>
                (text += `#${index + 1}\n🎫 *Username: ${
                    user.notify || user.vname || user.name || 'null'
                }*\n🍀 *Contact: https://wa.me/+${user?.jid?.split('@')[0]}*\n\n`)
        )
        text += `\nඔබගේම බොට් කෙනෙකුව සාදගැනීම සඳහා මෙම සබැඳියට පිවිසෙන්න😕❤\n: https://github.com/ErMurazor-Tech/WhatsappBot `
        return void M.reply(text)
    }
}
