import { MessageType } from '@adiwajshing/baileys'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'status',
            description: 'ඔබගේ වචන හෝ පින්තූර status ලෙස පල කරයි ',
            category: 'dev',
            dm: true,
            usage: `${client.config.prefix}status [text] [tag Image/Video]`
        })
    }

    run = async (M: ISimplifiedMessage, parsedArgs: IParsedArgs): Promise<void> => {
        if (!this.client.config.mods?.includes(M.sender.jid))
            return void (await M.reply(`මෙම command එක බොට්ගෙහි අයිතිකරුට පමණක් භාවිතා කල හැක`))
        // const text = parsedArgs.joined
        parsedArgs.flags.forEach((flag) => (parsedArgs.joined = parsedArgs.joined.replace(flag, '')))
        const args = parsedArgs.joined.split(',')
        let buffer
        if (M.quoted?.message?.message?.imageMessage) {
            M.reply('⭐ පින්තූරය පල කරමින් සිටිමි')
            let i = 0
            while(i<5){
            try{
            buffer = await this.client.downloadMediaMessage(M.quoted.message)
            const caption = args[0] || ''
            // M.reply(`caption : ${caption}`)
            return void this.client.sendMessage('status@broadcast', buffer, MessageType.image, {
                caption
            })
        }
        catch{
            i += 1
            M.reply("Marker Not Found Error : https://github.com/oliver-moran/jimp/issues/102 ")
        }
        }
            // this.client.sendMessage('status@broadcast', buffer, MessageType.image)
        } else if (M.WAMessage.message?.imageMessage) {
            M.reply('⭐ පින්තූරය පල කරමින් සිටිමි')
            buffer = await this.client.downloadMediaMessage(M.WAMessage)
            const caption = args[0] || ''
            // M.reply(`caption : ${caption}`)
            this.client.sendMessage('status@broadcast', buffer, MessageType.image, {
                caption
            })
            // this.client.sendMessage('status@broadcast', buffer, MessageType.image)
        } else if (M.quoted?.message?.message?.videoMessage) {
            M.reply('වීඩියෝව පලකරමින් සිටිමි ✨')
            buffer = await this.client.downloadMediaMessage(M.quoted.message)
            const caption = args[0] || ''
            // M.reply(`caption : ${caption}`)
            this.client.sendMessage('status@broadcast', buffer, MessageType.video, {
                caption
            })
            // this.client.sendMessage('status@broadcast', buffer, MessageType.video)
        } else if (M.WAMessage.message?.videoMessage) {
            M.reply('✨ වීඩියෝව පල කරමින් සිටිමි')
            buffer = await this.client.downloadMediaMessage(M.WAMessage)
            const caption = args[0] || ''
            // M.reply(`caption : ${caption}`)
            this.client.sendMessage('status@broadcast', buffer, MessageType.video, {
                caption
            })
            // this.client.sendMessage('status@broadcast', buffer, MessageType.video)
        } else if (M.quoted?.message?.message?.conversation) {
            M.reply('✨ ඔබගේ ලියමන පලකරමින් සිටිමි')
            const text = M.quoted?.message?.message?.conversation || ''
            const backgroundArgb =
                args.slice(3).map((arg) => `${parseInt(arg) / 16}${parseInt(arg) % 16}`) || 0x00000000
            const textArgb =
                args.slice(3).map((arg) => `${256 - parseInt(arg) / 16}${256 - (parseInt(arg) % 16)}`) || 0xf0f0f0f0
            M.reply(`backgroundArgb : ${backgroundArgb}\ntextArgb: ${textArgb}`)
            this.client.sendMessage(
                'status@broadcast',
                {
                    text,
                    backgroundArgb,
                    textArgb
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any,
                MessageType.extendedText
            )
        } else if (!M.quoted?.message) {
            M.reply('ඔබගේ ලියමන පලකරමින් සිටිමි ✨')
            const text = args[0] || ''
            M.reply(`text : ${text}`)
            // const backgroundArgb = args.slice(3).map((arg) => `${parseInt(arg) / 16}${parseInt(arg) % 16}`) || 0x00000000
            // const textArgb = args.slice(3).map((arg) => `${256 - parseInt(arg) / 16}${256 - (parseInt(arg) % 16)}`) || 0xf0f0f0f0
            this.client.sendMessage('status@broadcast', text, MessageType.extendedText)

            // this.client.sendMessage('status@broadcast', text, MessageType.text)
        } else M.reply('Use Image/Video via Tagging it or/and use text')
    }
}
