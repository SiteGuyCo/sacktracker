# Sack Tracker

Sack Tracker is a demo web application that displays crawfish prices in a stock-style dashboard. A simple Node.js backend is included for vendor management.

Run `npm install` and `npm start` to launch the server locally, then open `http://localhost:3000` in your browser. The server automatically seeds a few example vendors (including a "Sample Seafood" entry you can edit) the first time it runs so you can see the dashboard and admin interface in action. The page shows:

- Current average crawfish price with color-coded trend
- A 7-day price chart powered by Chart.js
- Vendor tiles that let you switch the chart to each vendor's history

Use the **Admin** button to view, insert, edit, or delete vendor information. Any changes made in the admin page are reflected immediately on the dashboard. A starter vendor called "Sample Seafood" is included so you can try editing and saving changes right away.

Netlify CMS is configured in the `admin/` folder. When deployed to Netlify, visit `/admin/` and log in with Netlify Identity to edit `vendors.json`.
