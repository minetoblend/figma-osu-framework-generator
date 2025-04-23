# figma osu!framework generator

Figma plugin that generates osu!framework code

### Requirements

-   [Node.js](https://nodejs.org/en)
-   [Figma desktop app](https://www.figma.com/downloads/)

### Install and Import

1. Install the dependencies and watch for changes while developing:

    ```bash
    pnpm install
    pnpm dev # pnpm build works too if you don't want hot-reload
    ```

2. Open the Figma desktop app and import the plugin:

    - Open a file in Figma.
    - Search for "Import plugin from manifest..." using the [Quick Actions](https://help.figma.com/hc/en-us/articles/360040328653-Use-shortcuts-and-quick-actions#Use_quick_actions) bar.
    - Choose the `manifest.json` file from the `dist` folder.