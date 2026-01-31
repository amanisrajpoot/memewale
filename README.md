# Memewale 😂

Meme culture first. A dedicated platform for discovering, creating, and sharing memes with a focus on Indian pop culture.

## Features (Phase 1)

- **Infinite Feed**: Vertical scrollable feed of memes.
- **Interactive Cards**: Upvote, downvote, comment, and share.
- **Comments System**: Nested comments, thread support, and "floating modal" drawer on desktop.
- **Discovery**:
  - Trending horizontal tags.
  - Search functionality (UI).
  - Side navigation for quick access (Desktop).
- **Authentication**: Login modal with Email/Phone support (Mock).
- **Meme Submission**: Drag-and-drop upload with AI caption generator stub.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Icons**: Lucide React
- **State Management**: Zustand (Auth)
- **Animation**: CSS Transitions & Keyframes

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/src/app` - App router pages (Home, Submit, etc.)
- `/src/components` - UI components (Feed, Comments, Shell, etc.)
- `/src/lib` - Utilities and helpers
- `/src/store` - Zustand state stores
- `/src/data` - Mock data for development

## License

MIT
