# Sack Tracker

Sack Tracker is a small demo application for tracking crawfish prices. Start the
server with `npm start` and open `http://localhost:3000/index.html` in your browser. The page shows:

- Current average crawfish price with color-coded trend
- A 7-day price chart powered by Chart.js
- Vendor tiles that let you switch the chart to each vendor's history

Vendor and price data are stored in `data/vendors.json`. Access `admin.html` to update prices using basic authentication (default user `admin`, password `password`).
