import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient, { toggleableGroupActions } from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            adminOnly: true,
            command: 'deactivate',
            aliases: ['deact'],
            description: 'සමූහයෙහි යම් සේවාවක් අක්‍රීය කරයි',
            category: 'moderation',
            usage: `${client.config.prefix}deactivate [feature]`
        })
    }

    run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {
        const type = joined.trim().toLowerCase() as toggleableGroupActions
        if (!Object.values(toggleableGroupActions).includes(type))
            return void M.reply(`🟥 අවලංගු විකල්පයකි: *${this.client.util.capitalize(type)}*`)
        const data = await this.client.getGroupData(M.from)
        if (!data[type]) return void M.reply(`🟨 *${this.client.util.capitalize(type)}* දැනටමත් අක්‍රීය වී ඇත`)
        await this.client.DB.group.updateOne({ jid: M.from }, { $set: { [type]: false } })
        return void M.reply(`🟩 *${this.client.util.capitalize(type)}* දැන් අක්‍රීයයි`)
    }
}
