![YouTube-Tidy](https://github.com/osu-cs494-w24/youtube-tidy/assets/98569819/0fa7e74a-58c2-427b-a3ba-7897c0e4833a)

# YouTube Tidy

Manage your YouTube playlists and subscriptions using YouTube Tidy! With YTT, you can easily select multiple videos at once to copy or move between playlists, or mass remove subscriptions and playlist items. Explore new videos and mass-add them to playlists from the search screen.

## Responsive for mobile and desktop

This application was designed for mobile-first, and adapted to higher resolutions such as native desktop resolutions.

## Check out the app (Oregon State University faculty and students)

The web application is currently in testing. We utilized the Google Cloud Console, which requires that we validate our application before publishing into production. Without publication, only students, faculty, and manually approved users may log in to the app.

[If you're an OSU student or staff member, click here to log in and check out our web app!](https://youtubetidy.netlify.app/)

## Screenshots (Homepage, playlists functionality, search)

![](https://i.ibb.co/7KLPNrP/Screenshot-2024-03-29-at-16-22-55-You-Tube-Tidy.png)

![](https://i.ibb.co/CmZfXw5/Screenshot-2024-03-29-at-16-25-11-You-Tube-Tidy.png)

![](https://i.ibb.co/3c4knxN/Screenshot-2024-03-29-at-16-26-17-You-Tube-Tidy.png)

## Development and testing

To contribute to YTT, follow these steps:

1. Clone the repository locally.

2. Copy `.env.example` to a file called `.env` in the root of the repository.

3. Create a new project and register a set of API keys for the YouTube Data API in the [Google Cloud Console](https://console.cloud.google.com/apis/dashboard).

4. Register a set of classic v2 API keys for reCAPTCHA [here](https://www.google.com/recaptcha/admin/create).

5. Replace the variables in `.env` with the keys you just created.

6. Run `npm install` to install the dependencies and then `npm run dev` to start the site. Visit the `localhost` link in the output (usually [http://localhost:5173](http://localhost:5173)) in your browser to preview the site.
