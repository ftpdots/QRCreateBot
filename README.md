# QRCreateTBot

A simple Telegram bot that turns text and links into QR codes.

# Features

- Generate QR codes from text and URLs
- Receive QR codes as images
- Simple interface with inline buttons
- JSON-formatted logs

# Tech Stack

- "Node.js" (https://nodejs.org/)
- "grammY" (https://grammy.dev/)
- "node-qrcode" (https://github.com/soldair/node-qrcode)
- "dotenv" (https://github.com/motdotla/dotenv)

# Getting Started

## Requirements

- Node.js
- A Telegram bot token from "@BotFather" (https://t.me/BotFather)

## Installation

### Clone the repository:
```
git clone https://github.com/ftpdots/qrcreatebot.git
cd qrcreatebot
```
### Install dependencies:
```
npm install
```
### Create your ".env" file from the example:
```
cp .env.example .env
```
**Open ".env" and add your Telegram bot token.**

### Run
```
node src/index.js
```
### Usage

1. Open the bot in Telegram.
2. Send "/start".
3. Press Create QR or send text directly.
4. Receive your QR code as an image.

# Commands

Command| Description
"/start"| Start the bot
"/help"| Show usage instructions
"/about"| About the bot

# License

This project is licensed under the "MIT License" (LICENSE).
