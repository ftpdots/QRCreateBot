const path = require("path");
const { Bot, InputFile, InlineKeyboard } = require("grammy");
const QRCode = require("qrcode");
require("dotenv").config();

// Logger

function log(level, event, data = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...data,
  }));
}

// Config

const token = process.env.BOT_TOKEN;
const maxLength = Number(process.env.MAX_LENGTH);

if (!token) {
  log("error", "token_not_found");
  process.exit(1);
}

if (!Number.isInteger(maxLength) || maxLength <= 0) {
  log("error", "max_length_not_found");
  process.exit(1);
}

const welcomeImage = path.join(__dirname, "../assets/welcome.png");

// Texts
const texts = {
  start: (ctx) => `Hello, ${ctx.from.first_name}!

Send any text or link, and I'll turn it into a QR code.`,

  qr: `Create QR

Send a message with the content you want to encode, and the bot will reply with a QR code.

Supported:
- Plain text
- Links

Maximum length: ${maxLength} characters.`,

  about: `QR Generator

A simple bot that turns text and links into QR codes.

Send a message, get an image back. No forms, no extra steps. The code is ready to scan, save or share right away.

Use it for links, notes, contact details or anything else you want to pass on quickly.

Need the list of commands? Send /help.`,

  help: `How to use

Send any text or link, and the bot will reply with a QR code.

Commands:
/start - start the bot
/about - about the bot
/help - show this message

Support: @ftpdot`,

  error: "Something has gone wrong. Please try again",
  tooLong: `Text is too long. Maximum is ${maxLength} characters.`,
  unsupported: "Unsupported format. Send text or a link.",
};

// Keyboards

const startKeyboard = new InlineKeyboard()
  .text("Create QR", "qr").row()
  .text("About", "about")
  .text("Help", "help");

// Bot

const bot = new Bot(token);

function safe(event, handler) {
  return async (ctx) => {
    try {
      await handler(ctx);
    } catch (error) {
      log("error", event, {
        userId: ctx.from?.id,
        error: error.message,
      });
      await ctx.reply(texts.error);
    }
  };
}

// Commands

bot.command("start", safe("command_start", async (ctx) => {
  await ctx.replyWithPhoto(new InputFile(welcomeImage), {
    caption: texts.start(ctx),
    reply_markup: startKeyboard,
  });
  log("info", "command_start", { userId: ctx.from.id });
}));

bot.command("help", safe("command_help", async (ctx) => {
  await ctx.reply(texts.help);
  log("info", "command_help", { userId: ctx.from.id });
}));

bot.command("about", safe("command_about", async (ctx) => {
  await ctx.reply(texts.about);
  log("info", "command_about", { userId: ctx.from.id });
}));

// Buttons

bot.callbackQuery("qr", safe("button_qr", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(texts.qr);
  log("info", "button_qr", { userId: ctx.from.id });
}));

bot.callbackQuery("about", safe("button_about", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(texts.about);
  log("info", "button_about", { userId: ctx.from.id });
}));

bot.callbackQuery("help", safe("button_help", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(texts.help);
  log("info", "button_help", { userId: ctx.from.id });
}));

// Messages

bot.on("message:text", safe("send_text", async (ctx) => {
  const text = ctx.message.text;

  if (text.length > maxLength) {
    await ctx.reply(texts.tooLong);
    log("error", "max_length_exceeded", { userId: ctx.from.id });
    return;
  }

  const qr = await QRCode.toBuffer(text);
  await ctx.replyWithPhoto(new InputFile(qr, "qr.png"));
  log("info", "send_text", { userId: ctx.from.id, text });
}));

bot.on("message", safe("unsupported_format", async (ctx) => {
  await ctx.reply(texts.unsupported);
  log("error", "unsupported_format", { userId: ctx.from.id });
}));

// Startup

bot.catch((err) => {
  log("error", "unhandled_error", { error: err.message });
});

bot.start({
  onStart: () => log("info", "bot_started"),
});
