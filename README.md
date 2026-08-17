# Chicago Art Archive

A responsive web application that explores artworks and exhibitions from the Art Institute of Chicago using the public ARTIC API.

## Project Structure
- `index.html`: Navigation layout
- `style.css`: Responsive CSS and typography
- `app.js`: API fetching, DOM manipulation, and view routing

## Features
- **Multi-Endpoint Integration:**
    - **Artworks (`/api/v1/artworks`):** Fetches artwork metadata, dates, medium details, and high-resolution images via the ARTIC IIIF image delivery API.
    - **Exhibitions (`/api/v1/exhibitions`):** Displays some past, current, and upcoming museum exhibitions sorted chronologically with status indicators.
- **Interactive Search:** Real-time keyword search querying the ARTIC search API (`/api/v1/artworks/search`).
- **Dynamic View Navigation:** Single page tab navigation switching between Artworks and Exhibitions without page reloads.
- **Error Handling & Feedback:** User-facing loading indicators, error banners, and empty search result notifications.
- **Responsive Layout:** CSS Grid and Flexbox layouts. Great for mobile, tablet, and desktop viewports.

## Technologies Used

- **HTML:**
- **CSS:** Design inspired by the Art Institute of Chicago website layout.
- **JavaScript:** Asynchronous API data fetching (`async`/`await`), DOM manipulation, and event handling.
- **API Source:** [Art Institute of Chicago API](https://api.artic.edu/docs/)

---

## How to Run Locally

1. **Clone the repository:**
```bash
git clone [https://github.com/TheFirstJona/chicago-art-archive](https://github.com/TheFirstJona/chicago-art-archive)
cd chicago-art-archive
```
2. **Open the application:**
- Open your file explorer, navigate to the folder, and double click `index.html` to open it in whatever is your default web browser

## Final Words
Thank you so much for taking the time to review my application and for offering this incredible opportunity. As stated in my application, I recognize that with my degree, my technical background and pre-work might seem more advanced than that of a typical applicant. However, given my current inability to legally work, this program would be the vital bridge I need during this transitional period in my life. It'd provide the structured environment, collaborative community, and hands-on practice I need to keep my skills sharp and stay connected to the tech ecosystem while I navigate this hold on my career. I would participate meaningfully, actively contribute and help members of the community, and support Code the Dream’s mission.