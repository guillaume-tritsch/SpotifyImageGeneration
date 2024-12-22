const IS_DEV_MODE = (window.location.origin === "http://localhost:5500" || window.location.origin === "http://127.0.0.1:5500") ? true : false;

console.log(window.location.origin, (window.location.origin === "http://localhost:5500" || window.location.origin === "http://127.0.0.1:5500"));

const DEV_URL = "http://localhost:5500";
const PROD_URL = "https://guillaume-tritsch.github.io/SpotifyImageGeneration";

// API CONFIG
const CLIENT_ID = "5dbf2ff92be149ca98e8198088566890";
const API_URL = "https://api.spotify.com/v1";
const AUTH_URL = "https://accounts.spotify.com";

const SCOPE = "user-top-read user-read-private user-read-email playlist-read-private";
const CLIENT_SECRET = "bf02fb63ce65498e8c66ef6106ba7696";