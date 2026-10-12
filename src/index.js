const { Bot } = require("grammy");
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

// Texts
const texts = {
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

// Startup

bot.catch((err) => {
  log("error", "unhandled_error", { error: err.message });
});

bot.start({
  onStart: () => log("info", "bot_started"),
});
