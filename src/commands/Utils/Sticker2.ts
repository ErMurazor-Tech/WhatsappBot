import { MessageType } from '@adiwajshing/baileys'
import { exec } from 'child_process'
import { getRandom } from '../utils/functions'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import { removeBackgroundFromImageFile } from 'remove.bg'

module.exports = {
    command: 'sticker2',
    aliases: ['s', 'st'],
    category: 'utils',
    cooldown: 600,
    description: 'පින්තූර සහ වීඩියො භාවිතයෙන් ස්ටිකර් සෑදීමට',
    usage: `${client.config.prefix}sticker [(as caption | tag)[video | image]]`,
    async execute (client: any, chat: any, pesan: any, args: any) {
        if ((client.isMedia && !chat.message.videoMessage || client.isQuotedImage) && args[0] == 'nobg') {
            if ((!client.isGroup && !client.isPmium) || (client.isGroup && !client.isGmium)) return client.reply(pesan.hanya.premium)
            const encmedia = client.isQuotedImage ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
            const media = await client.downloadAndSaveMediaMessage(encmedia)
            const ranw = getRandom('.webp')
            client.reply(pesan.tunggu)
            await ffmpeg(`./${media}`)
                .input(media)
                .on('start', function (cmd: string) {
                    console.log(`[INFO] Started : ${cmd}`)
                })
                .on('error', function (err: string) {
                    console.log(`[INFO] Error : ${err}`)
                    fs.unlinkSync(media)
                    client.reply('Error saat membuat sticker')
                    client.log(err)
                })
                .on('end', function () {
                    console.log('[INFO] Berhasil membuat sticker')
                    client.sendMessage(client.from, fs.readFileSync(ranw), MessageType.sticker, { quoted: chat })
                    fs.unlinkSync(media)
                    fs.unlinkSync(ranw)
                })
                .addOutputOptions(['-vcodec', 'libwebp', '-vf', 'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse'])
                .toFormat('webp')
                .save(ranw)
        } else if ((client.isMedia && chat.message.videoMessage.seconds < 11 || client.isQuotedVideo && chat.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
            if ((!client.isGroup && !client.isPmium) || (client.isGroup && !client.isGmium)) return client.reply(pesan.hanya.premium)
            const encmedia = client.isQuotedVideo ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
            const media = await client.downloadAndSaveMediaMessage(encmedia)
            const ranw = getRandom('.webp')
            client.reply(pesan.tunggu)
            await ffmpeg(`./${media}`)
                .inputFormat(media.split('.')[1])
                .on('start', function (cmd: string) {
                    console.log(`[INFO] Started : ${cmd}`)
                })
                .on('error', function (err: string) {
                    console.log(`[INFO] Error : ${err}`)
                    fs.unlinkSync(media)
                    const tipe = media.endsWith('.mp4') ? 'video' : 'gif'
                    client.reply(`❌ ස්ටිකරය සෑදීමට නොහැකි විය.`)
                    client.log(err)
                })
                .on('end', function () {
                    console.log('[INFO] Berhasil membuat sticker')
                    client.sendMessage(client.from, fs.readFileSync(ranw), MessageType.sticker, { quoted: chat })
                    fs.unlinkSync(media)
                    fs.unlinkSync(ranw)
                })
                .addOutputOptions(['-vcodec', 'libwebp', '-vf', 'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse'])
                .toFormat('webp')
                .save(ranw)
        } else if ((client.isMedia || client.isQuotedImage) && args[0] == 'rbg') {
            if ((!client.isGroup && !client.isPmium) || (client.isGroup && !client.isGmium)) return client.reply(pesan.hanya.premium)
            const encmedia = client.isQuotedImage ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
            const media = await client.downloadAndSaveMediaMessage(encmedia)
            const ranw = getRandom('.webp')
            const ranp = getRandom('.png')
            client.reply(pesan.tunggu)
            const keyrmbg = process.env.KEY_REMOVEBG
            await removeBackgroundFromImageFile({ path: media, apiKey: `${keyrmbg}`, size: 'auto', type: 'auto', outputFile: ranp }).then((res: any) => {
                fs.unlinkSync(media)
                exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err: any) => {
                    fs.unlinkSync(ranp)
                    if (err) return client.reply('දෝෂයක් හටගැනිනි')
                    client.sendMessage(client.from, fs.readFileSync(ranw), MessageType.sticker, { quoted: chat })
                })
            }).catch((err: Array<any>) => {
                client.log(err)
                return client.reply('දෝෂයක් ඇති විය. කරුණාකර පසුව උත්සාහ කරන්න.')
            })
        } else if ((client.isMedia || client.isQuotedImage) && args.length == 0) {
            const encmedia = client.isQuotedImage ? JSON.parse(JSON.stringify(chat).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : chat
            const media = await client.downloadAndSaveMediaMessage(encmedia)
            const ranw = getRandom('.webp')
            await ffmpeg(`./${media}`)
                .on('start', function (cmd: any) {
                    console.log('[INFO] Started :', cmd)
                })
                .on('error', function (err: any) {
                    fs.unlinkSync(media)
                    console.log('[INFO] Error :', err)
                    client.reply('Error saat membuat sticker')
                    client.log(err)
                })
                .on('end', function () {
                    console.log('[INFO] Berhasil membuat sticker')
                    client.sendMessage(client.from, fs.readFileSync(ranw), MessageType.sticker, { quoted: chat })
                    fs.unlinkSync(media)
                    fs.unlinkSync(ranw)
                })
                .addOutputOptions(['-vcodec', 'libwebp', '-vf', 'scale=\'min(320,iw)\':min\'(320,ih)\':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=off [p]; [b][p] paletteuse'])
                .toFormat('webp')
                .save(ranw)
        } else {
            client.reply('පින්තූරයක් හෝ වීඩියෝවක් එවා, එය ටැග් කරමින් sticker2 විධානය එවන්න.')
        }
    }
}
