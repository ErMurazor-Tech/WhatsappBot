import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'enable',
            description: 'ඔබ විසින් ලබා දුන් command එකක් නැවත සක්‍රීය කරයි',
            category: 'dev',
            dm: true,
            usage: `${client.config.prefix}enable [command]`
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!this.client.config.mods?.includes(M.sender.jid)) return void null
        const key = joined.toLowerCase().trim()
        if (!key) return void (await M.reply(`සක්‍රීය කිරීමට අවශ්‍ය command එක type කරන්න`))
        const command = this.handler.commands.get(key) || this.handler.aliases.get(key)
        if (!command) return void (await M.reply(`කිසිඳු command එකක් හමුවූයේ නැත`))
        if (!(await this.client.DB.disabledcommands.findOne({ command: command.config.command })))
            return void M.reply(`${this.client.util.capitalize(command.config.command)} command එක දැනටමත් සක්‍රීය කොට ඇත`)
        await this.client.DB.disabledcommands.deleteOne({ command: command.config.command })
        await M.reply(`*${this.client.util.capitalize(command.config.command)}* command එක සක්‍රීය විය`)
    }
}
