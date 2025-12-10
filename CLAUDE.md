# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a WXT-based browser extension using React. It follows WXT's convention-based architecture.

## Core Commands
```bash
# Start development server for Chrome
npm run dev

# Start development server for Firefox
npm run dev:firefox

# Build for Chrome
npm run build

# Build for Firefox
npm run build:firefox

# Zip for Chrome
npm run zip

# Zip for Firefox
npm run zip:firefox

# Type checking
npm run compile

# Prepare dependencies (run after install)
npm run postinstall
```

## Architecture
The project uses WXT's entrypoint-based structure:
- `/entrypoints`: Contains all extension entrypoints
  - `background.ts`: Background service worker
  - `content.ts`: Content script
  - `/popup`: React-based popup UI with:
    - `index.html`: Popup HTML file
    - `main.tsx`: React entry point
    - `App.tsx`: Main App component
    - CSS files for styling

## Key Configuration
- `wxt.config.ts`: WXT configuration with React module
- `package.json`: Dependencies and scripts

## Technologies
- WXT 0.20.6: Browser extension framework
- React 19: UI library
- TypeScript 5.9.2: Type safety