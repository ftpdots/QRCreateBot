const path = require("path");
const { Bot, InputFile } = require("grammy");
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

if (!token) {
  log("error", "token_not_found");
  process.exit(1);
}

const welcomeImage = path.join(__dirname, "../assets/welcome.png");

// Texts
const texts = {
  start: (ctx) => `Hello, ${ctx.from.first_name}!

Send any text or link, and I'll turn it into a QR code.`,

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
};

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

// Startup

bot.catch((err) => {
  log("error", "unhandled_error", { error: err.message });
});

bot.start({
  onStart: () => log("info", "bot_started"),
});
