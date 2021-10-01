import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'
import axios from 'axios'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'animequote',
            description: 'අහඹූ ලෙස ඇනිමේ කියමනක් සොයා දෙයි.',
            aliases: ['aq'],
            category: 'fun',
            usage: `${client.config.prefix}animequote`
        })
    }

    run = async (M: ISimplifiedMessage): Promise<void> => {
        await axios
            .get(`https://animechan.vercel.app/api/random`)
            .then((response) => {
                // console.log(response);
                const text = `⛩ *Anime:* ${response.data.anime}\n\n*🎎 චරිතය:* ${response.data.character}\n\n*✏ කියමන:* ${response.data.quote}`
                M.reply(text)
            })
            .catch((err) => {
                M.reply(`🔍 දෝෂයක්: ${err}`)
            })
    }
}
