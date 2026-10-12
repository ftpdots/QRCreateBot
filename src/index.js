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

// Bot

const bot = new Bot(token);

// Startup

bot.start({
  onStart: () => log("info", "bot_started"),
});
