# HxMeet Core Component

This project provides the core component for video conferencing systems. It is open-source, allowing the creation 
of custom, tailored conferencing solutions. The conference component `<HxMeet>` is a browser-based Vue.js component.

## Live Demo

Try it out at: [https://hxmeet.io](https://hxmeet.io)

## Screenshot

![HxMeet Screenshot](https://hxmeet.io/changelog/roundtable_1.jpg)  

## ✨ Conferencing Features

- Low-latency WebRTC video & audio
- Screen sharing
- Chat
- Different layout options
- Participant list
- Media controls (mute, camera off)
- Support keyboard shortcuts

## 📦 Installation

### Requirements
- [Node.js](https://nodejs.org/) (v22 recommended)
- [npm](https://www.npmjs.com/)

### Install from npm
```bash
npm i hxmeet-core-component
```

---

## ▶️ Usage

You can import and use the HxMeet Core Component in your Vue 3 project:

```vue
<script setup>
import { HxMeet } from 'hxmeet-core-component'
</script>

<template>
  <HxMeet room="my-conference-room" pin="123456" />
</template>
```

---

## ⚙️ Configuration

A running [LiveKit](https://livekit.io) instance is required (Cloud or self-hosted).  
From this instance you need the **URL** and a **Token**.

1. Copy the `.env` file to `.env.local`
2. Enter your LiveKit credentials there:

```bash
VITE_LIVEKIT_URL=<your-livekit-url>
VITE_LIVEKIT_TOKEN=<your-token>
```

---

## 🐳 Self-Hosting with Docker

You can run the component standalone with Docker:

```bash
docker compose up -d
```

This will start a local HxMeet instance connected to your own LiveKit server.  
See the [technical documentation](../technische-losung.md) for details.

---

## 📖 Development Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/hxmeet/hxmeet-core-component.git
cd hxmeet-core-component
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## 📜 License

Licensed under the MIT License.

---

## 🙌 Contributing

We welcome contributions!  
Please check out our [development roadmap](../schritte-entwicklung.md) and open issues.
