# Sack Tracker

Sack Tracker is a demo web application that displays crawfish prices in a stock-style dashboard. A simple Node.js backend is included for vendor management.

Run `npm install` and `npm start` to launch the server locally, then open `http://localhost:3000` in your browser. The server automatically seeds a few example vendors the first time it runs so you can see the dashboard and admin interface in action. The page shows:

- Current average crawfish price with color-coded trend
- A 7-day price chart powered by Chart.js
- Vendor tiles that let you switch the chart to each vendor's history

Use the **Admin** button to view and edit these sample vendors or add your own. Changes made in the admin page are reflected immediately on the dashboard.
