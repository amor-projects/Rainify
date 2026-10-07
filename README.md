# ☔ Rainify

A weather app focused on clear forecasts, useful context, and a calm interface.

**[Live Demo](https://rainify-weather.vercel.app)**

## What is it?

Rainify gives you the weather information you need without filling the screen with unnecessary controls. It combines current conditions, hourly forecasts, daily outlooks, and practical guidance in a responsive interface designed for desktop and mobile devices.

## Features

- Current weather conditions with temperature, feels-like temperature, humidity, pressure, visibility, UV, precipitation, wind, and sunrise/sunset details
- Hourly forecast carousel with bounded navigation
- Today, Tomorrow, and Next 12 Days views
- Full forecast view for each day in the 12-day outlook
- Practical descriptions for rain, wind, UV exposure, humidity, visibility, and pressure
- Location-based weather using browser geolocation
- Manual city and location search with suggestions
- Pinned locations saved in local storage
- Fahrenheit and Celsius unit switching
- Light and dark themes with system preference support
- Responsive layout for desktop and mobile devices
- Reduced-motion support for users who prefer less animation

## Built With

- **JavaScript** - Vanilla JS with ES modules
- **CSS** - Responsive layout, theme styling, loading states, and animations
- **Express** - Local development server and API routes
- **Visual Crossing** - Weather data
- **BigDataCloud** - Reverse geolocation
- **Photon** - Location search suggestions
- **Vercel** - Deployment and hosting

## Running Locally

You need to create a `.env` file in the project root with the following variables:

```sh
WEATHER_API_KEY=your_visual_crossing_api_key
BDC_API_KEY=your_bigdatacloud_api_key
```

Do not commit `.env` or share your API keys.

```sh
# Clone the repo
git clone https://github.com/amor-projects/Rainify.git
cd Rainify

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app should open at `http://localhost:3000`.

The local development server serves the frontend and API routes through Express. The Vercel configuration is kept for deployment.

## Contributing

Found a bug or have an idea for improvement? Feel free to open an issue or submit a pull request. All contributions are welcome.

## License

MIT License - feel free to use this project however you'd like.

---

Made with ❣️ by [ZephyrAmmor](https://github.com/ZephyrAmmor)
