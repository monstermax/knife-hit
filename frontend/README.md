# Knife Hit Game

A modern implementation of the popular Knife Hit game built with React, TypeScript, and Vite.

## Features

- **Fast-paced gameplay**: Throw knives at rotating targets
- **Multiple knife throwing**: Launch several knives rapidly without waiting
- **Realistic visuals**: Only knife handles are visible when planted in targets
- **Progressive difficulty**: Levels get harder with more pre-planted knives and faster rotation
- **Apple collection**: Collect apples for bonus points (persistent across games)
- **Boss levels**: Special lemon targets every 5 levels
- **Responsive design**: Works on both desktop and mobile devices

## Game Rules

1. **Objective**: Throw all your knives into the rotating target without hitting existing knives
2. **Controls**: Click/tap the knife at the bottom to throw it
3. **Collision**: Game ends if you hit an already planted knife
4. **Apples**: Hit apples for bonus points and permanent collection
5. **Level progression**: Complete all knives to advance to the next level
6. **Scoring**: Earn points for each successful knife throw and apple collection

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **SVG** - Vector graphics for game elements
- **Canvas API** - Game rendering and animations

## Development

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

### Project Structure

```
src/
├── components/
│   ├── svg/           # SVG components (targets, knives, apples)
│   ├── GameCanvas.tsx # Main game canvas
│   ├── GameUI.tsx     # UI components
│   └── GameOverlay.tsx # Menu and game over screens
├── hooks/
│   └── useGameState.ts # Game state management
├── types/
│   └── game.ts        # TypeScript interfaces
├── utils/
│   └── gameUtils.ts   # Game logic utilities
└── App.tsx            # Main application component
```

## Game Mechanics

### Difficulty Progression

- **Level 1**: 6 knives, few obstacles, slow rotation
- **Higher levels**: More pre-planted knives, faster rotation
- **Boss levels** (every 5th): Special lemon targets with unique mechanics

### Scoring System

- **Knife hit**: 10 points × level
- **Apple collection**: 5 points × level
- **Apples persist**: Collected apples are saved between games

### Visual Features

- **Irregular wood rings**: Target has natural wood grain patterns for better rotation visibility
- **Realistic knife planting**: Only handles visible when knives are planted
- **Smooth animations**: 60fps target rotation and knife throwing
- **Responsive SVG graphics**: Scalable vector graphics for crisp visuals

## Deployment

The game can be deployed to any static hosting service:

1. Run `pnpm run build`
2. Upload the `dist/` folder contents to your hosting service
3. Ensure the server serves `index.html` for all routes

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Credits

Inspired by the original Knife Hit mobile game. Built as a web implementation with modern technologies.

