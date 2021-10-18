import { MessageType, Mimetype } from '@adiwajshing/baileys'
import { Sticker, Categories } from 'wa-sticker-formatter'
import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { IParsedArgs, ISimplifiedMessage } from '../../typings'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
    කොම්මන්ඩ්: 'sticker2',
    category: 'utils',
    cooldown: 20,
    description: {
        content: "ඔබ එවූ වීඩියෝවකින් හෝ පින්තූරයකින් ස්ටිකරයක් සාදයි.",
        usage: "[--crop]"
    }
})
export default class extends BaseCommand {
    public async exec(msg: Message, query: string[]): Promise<void> {
        const { flags } = this.parseArgs(query);
        const isCropped = flags.includes("crop");
        const isQuotedImage = msg.quotedMsg && msg.quotedMsg.type === "image";
        const isQuotedVideo = msg.quotedMsg && msg.quotedMsg.type === "video";
        if (msg.type === "image" || isQuotedImage) {
            const wait = await this.client.reply(msg.chatId, "*මොහොතක් සිටින්න...*", msg.id) as Message["id"];
            await this.create(msg, wait, isQuotedImage!, false, isCropped);
        } else if (msg.quotedMsg && msg.quotedMsg.type === "document" && ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(msg.quotedMsg.mimetype!)) {
            const wait = await this.client.reply(msg.chatId, "*මොහොතක් සිටින්න...*", msg.id) as Message["id"];
            await this.create(msg, wait, true, false, isCropped);
        } else if (msg.type === "video" || isQuotedVideo) {
            if ((Number(msg.duration) || Number(msg.quotedMsg!.duration)) >= 15) {
                await this.client.reply(msg.chatId, "Please use video/gif with duration under 15 seconds and try again.", msg.id);
                return undefined;
            }
            const wait = await this.client.reply(msg.chatId, "*මොහොතක් සිටින්න...* (සර්වරයේ වේගය අනුව විනාඩි 1-5ත් අතර කාලයක් ගතවීමට පුලුවන.)", msg.id) as Message["id"];
            await this.create(msg, wait, isQuotedVideo!, true, isCropped);
        } else {
            await this.client.reply(msg.chatId, `කරුණාකර පින්තූරයක්/ වීඩියෝවක් හෝ gif එකක් එවා, එය ටැග් කර *${msg.prefix}sticker* ලෙස Reply කරන්න.`, msg.id);
        }
    }

    private async create(message: Message, waitMsg: Message["id"], isQuoted: boolean, isGif = false, crop = false): Promise<void> {
        try {
            const msg = isQuoted ? message.quotedMsg! : message;
            const media = await decryptMedia(msg, this.client.config.UserAgent);
            const imageBase64 = `data:${msg.mimetype as string};base64,${media.toString("base64")}`;
            if (isGif) {
                await this.client.sendMp4AsSticker(message.chatId, media.toString("base64"), { crop }, { author: "Hesh", pack: "Created by" });
                await this.client.deleteMessage(message.chatId, waitMsg);
                return undefined;
            }
            await this.client.sendImageAsSticker(message.chatId, imageBase64, { keepScale: !crop, author: "Hesh", pack: "Created by" });
            await this.client.deleteMessage(message.chatId, waitMsg);
        } catch (e) {
            await this.client.deleteMessage(message.chatId, waitMsg);
            await this.client.reply(message.chatId, `ස්ටිකරය නිර්මාණයේදී දෝෂයක් හට ගැනිනි. ${isGif ? "මෙයට වඩා කොට වීඩියෝවක් හෝ gif එකක් භාවිතා කරන්න" : ""}`, message.id);
        }
    }
}
