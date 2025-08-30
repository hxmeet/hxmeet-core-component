# HxMeet Core Component

This project provides the core component for video conferencing systems. It is open-source, allowing the creation 
of custom, tailored conferencing solutions. The conference component `<HxMeet>` is a browser-based Vue.js component.

## Live Demo

👉 Try it out at: [https://hxmeet.io](https://hxmeet.io)

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
- Dark mode
- Mobile friendly

## 🛠️ Developer options

- Themable (set your own color schema)
- Embeddable in your app or website 
- Customizable
  - Hook into the component events
  - Add extensions
- Add test participants
- Open-source (MIT license)

## Installation and first tests

### Requirements
- [Node.js](https://nodejs.org/) (v22 recommended)
- [npm](https://www.npmjs.com/)
- [LiveKit](https://livekit.io) account (later you can switch to an self-hosted livekit solution)

### Simple test

The project contains a simple test page. You can run it locally with:

1. Checkout project and install dependencies: `npm install`
2. Copy the `.env` file to `.env.local`
3. Enter your LiveKit credentials there:

```bash
VITE_LIVEKIT_URL=<your-livekit-url>
VITE_LIVEKIT_TOKEN=<your-token>
```

> [!NOTE] 
> The URL is the Livekit project URL and the token you can find in _Settings/API-Keys_ (create an API-Key and generate a token inside the three-dot menu)

4. Start the test page: `npm run dev`
5. Open [http://localhost:5173](http://localhost:5173) in your browser

This test is limited to only one 'real' participant, because you have only one token, but you can add more test participants.

### Advanced test (starter project )

see [Starter-Project](https://github.com/hxmeet/hxmeet-core-starter)

## License

Licensed under the MIT License.
