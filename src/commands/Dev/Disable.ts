import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'disable',
            description: 'ඔබට අවශ්‍ය command එක සමූහයෙහි සාමාජිකයන් හට තහනම් කරයි.',
            category: 'dev',
            dm: true,
            usage: `${client.config.prefix}disable [command] | (reason)`
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        if (!this.client.config.mods?.includes(M.sender.jid)) return void null
        const split = joined.split('|')
        const key = split[0].toLowerCase().trim()
        if (!key) return void (await M.reply(`ඔබට තහනම් කිරීමට අවශ්‍ය command එක type කරන්න`))
        const command = this.handler.commands.get(key) || this.handler.aliases.get(key)
        if (!command) return void (await M.reply(`කිසිඳු command එකක් හමු වූයේ නැත`))
        if (await this.client.DB.disabledcommands.findOne({ command: command.config.command }))
            return void M.reply(`${command.config.command} මෙම command එක දැනටමත් තහනම් කර ඇත`)
        await new this.client.DB.disabledcommands({
            command: command.config.command,
            reason: (split[1] || '').trim() || ''
        }).save()
        await M.reply(
            `*${this.client.util.capitalize(command.config.command)}* is now Disabled${
                split[1] ? ` for ${split[1]}` : ''
            }`
        )
    }
}
