<img src="https://res.cloudinary.com/idevart/image/upload/v1701009610/images/wguilqxxbiya9fjtibtr.png" width="200" alt="Spotify Downloader Logo">

<p align="center">
<img src="https://res.cloudinary.com/idevart/image/upload/v1701012749/images/vcxwab3d5intbygulfyy.png" width="800" alt="Spotify Downloader Web App">
</p>


## About Spotify Downloader Web Console

Welcome to the Spotify Downloader Web Console – a powerful and user-friendly tool built on the Angular framework for seamlessly downloading your favorite Spotify tracks. This web console provides an intuitive interface to interact with the underlying Spotify Track Downloader API, enhancing your music listening experience.<br/></br>
This web console seamlessly integrates with the [Spotify Track Downloader API](https://github.com/febriarief/api-spotify-downloader). The API handles the actual downloading process, while the web console provides a user-friendly interface for interaction.

## Features
- Angular Framework: Leverage the speed and efficiency of Angular for a responsive and dynamic web console.
- Search and Download: Easily search for Spotify tracks and initiate downloads with a simple and intuitive interface.
- Real-Time Progress: Track the progress of your downloads in real-time, providing instant feedback on the process.
- Cross-Platform Compatibility: Enjoy a consistent and smooth experience across various devices and platforms.

## Requirements
- Node version >= 18.10.0

## Installation
1. Clone the repository to your local environment. 
```bash
git clone https://github.com/febriarief/console-spotify-downloader.git
```
2. Install packages
```bash
npm i

or 

npm ci
```
3. Configure the necessary environment variables, including the API endpoint.
```bash
# src/environmets/environment.ts

{
	...
	apiUrl: YOUR_REST_API,
	socketUrl: YOUR_SOCKET_URL
    ...
}
```
4. Run application
```bash
# Development
npm run start

# Development (no hmr)
npm run start:no-hmr

# Production
npm run build
```
## Disclaimer
This web console is not an official product of Spotify. Users are advised to use it responsibly and at their own risk. Respect copyright and licensing agreements when downloading and using Spotify tracks.

## Contribution
Feel free to contribute to the development of this Spotify Track Downloader API. Fork the repository, make your changes, and submit a pull request.

## License
This application is also licensed under the [MIT License](https://opensource.org/licenses/MIT), promoting an open and collaborative development environment.
