# iNaturalist Whale Tracker

A Next.js application that allows users to search for and visualize whale sightings from around the world using the iNaturalist API.

## Features

- Search for whale species (default: Humpback Whales)
- Filter observations by date range
- View sightings on an interactive map
- Browse observation details including photos and location information
- Responsive design for desktop and mobile

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Leaflet](https://leafletjs.com/) - Interactive map library
- [React-Datepicker](https://reactdatepicker.com/) - Date range selection
- [Axios](https://axios-http.com/) - HTTP client
- [iNaturalist API](https://api.inaturalist.org/v1/docs/) - Wildlife observation data

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/inaturalist-whale-tracker.git
cd inaturalist-whale-tracker
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Usage

1. Enter a whale species name in the search box (default is "Humpback Whale")
2. Select a date range (default is the last 30 days)
3. Click "Search" to view results
4. Explore observations on the map and in the list
5. Click on markers or list items to view detailed information

## Acknowledgments

- Data provided by [iNaturalist](https://www.inaturalist.org/), a joint initiative of the California Academy of Sciences and the National Geographic Society
- This project is for educational purposes only
