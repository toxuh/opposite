# Antipode Explorer 🌍

Discover the exact opposite point on Earth from any location. Interactive maps, real-time calculations, weather comparison, elevation data, and fascinating geographic insights.

## Features

- 🗺️ **Interactive Dual Maps** - Drag markers to explore any location and its antipode
- 🌡️ **Weather Comparison** - Real-time weather data for both locations
- ⛰️ **Elevation Data** - Compare heights above sea level
- 📏 **Geodesic Line** - Visualize the shortest path between points
- 📊 **Location Info** - Coordinates, distance, time difference, and more
- 🎲 **Interesting Facts** - AI-generated facts about antipodes and locations
- 📍 **Popular Locations** - Quick access to famous antipode pairs
- 💾 **Persistent UI** - Panel states saved to localStorage

## Tech Stack

- **Framework**: Next.js 15+ with React 19+
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4+ with Shadcn UI
- **Maps**: Leaflet with React-Leaflet
- **Animations**: Framer Motion
- **APIs**: 
  - OpenWeatherMap (weather data)
  - Open-Elevation (elevation data)
  - OpenAI (facts generation)

## Getting Started

### Prerequisites

- Node.js 20+
- Yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/toxuh/opposite.git
cd opposite
```

2. Install dependencies:
```bash
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# OpenAI API Key (for facts generation)
OPENAI_API_KEY=your_openai_api_key_here

# OpenWeatherMap API Key (for weather data)
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

#### Getting API Keys

**OpenWeatherMap API Key** (Required for weather features):
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key and paste it in `.env.local`

**OpenAI API Key** (Optional - for AI-generated facts):
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and paste it in `.env.local`

> **Note**: The app will work without API keys, but with limited functionality:
> - Without OpenWeatherMap key: Weather panel will show "API key not configured"
> - Without OpenAI key: Facts panel will show fallback static facts

4. Run the development server:
```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
opposite/
├── app/
│   ├── _components/       # React components
│   │   ├── antipode-maps.tsx
│   │   ├── info-panel.tsx
│   │   ├── weather-panel.tsx
│   │   ├── facts-panel.tsx
│   │   └── locations-panel.tsx
│   ├── api/              # API routes
│   │   ├── weather/
│   │   ├── elevation/
│   │   └── facts/
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── services/         # Business logic
│       ├── antipode.ts
│       ├── weather.ts
│       ├── elevation.ts
│       └── geodesic.ts
└── public/
```

## Features in Detail

### Weather Comparison
- Real-time temperature, humidity, wind speed, pressure
- Weather conditions with icons
- Temperature difference calculation
- Automatic updates when location changes

### Elevation Data
- Height above sea level for both locations
- Elevation difference calculation
- Uses Open-Elevation API (no key required)

### Geodesic Line
- Visualizes the great circle path between points
- Shows the shortest distance on Earth's surface
- Rendered on both map views

### Interactive Maps
- Drag markers to explore different locations
- Dark theme optimized for visibility
- Synchronized views of both locations
- Zoom controls and smooth animations

## Scripts

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Anton Zakharov ([@toxuh](https://github.com/toxuh))

## Acknowledgments

- [Leaflet](https://leafletjs.com/) for mapping
- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Open-Elevation](https://open-elevation.com/) for elevation data
- [Shadcn UI](https://ui.shadcn.com/) for beautiful components

