import Sticker, { Categories } from 'wa-sticker-formatter'
import { BaseCommand } from '../../Structures/Command/BaseCommand'
import { Command } from '../../Structures/Command/Command'
import Message from '../../Structures/Message'
import { IParsedArgs } from '../../typings/Command'

@Command('vsticker', {
    aliases: ['s'],
    category: 'Utils',
    description: {
        content: 'Convert Images/Videos into Stickers'
    }
})
export default class extends BaseCommand {
    override execute = async (
        { type, quoted, reply, raw, urls }: Message,
        { flags, text }: IParsedArgs
    ): Promise<void> => {
        console.log(quoted)
        const media = ['imageMessage', 'videoMessage'].includes(type)
            ? raw
            : quoted?.message.videoMessage ?? quoted?.message.imageMessage
            ? quoted.message
            : urls[0] ?? null
        if (!media) return void (await reply('No media found!'))
        for (const flag in flags) {
            //remove flags from text
            text = text.replace(new RegExp(`--${flag}`, 'g'), '')
        }

        if (urls.length) for (const url of urls) text = text.replace(url, '')

        const title = text.trim().split('|')
        const sticker = new Sticker(
            typeof media === 'string' ? media : await this.client.downloadMediaMessage(media as Message),
            {
                pack: title[1] ?? 'Hesh',
                author: title[0] ?? 'Well',
                categories: [(flags.category || '🌹') as Categories],
                type: flags.crop ? 'crop' : flags.stretch ? 'default' : 'full'
            }
        )
        await reply(await sticker.build(), 'sticker')
    }
}
