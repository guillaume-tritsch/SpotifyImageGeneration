class API {
  #token = null;

  isDevMode = true;
  devCallbackURI = "http://localhost:5500/callback.html";
  prodCallbackURL =
    "https://guillaume-tritsch.github.io/SpotifyImageGeneration/pages/callback";
  spotifyData = {
    clientID: "5dbf2ff92be149ca98e8198088566890",
  };

  baseURL = "https://accounts.spotify.com/";
  scope = "user-top-read";

  promiseAllObtention;

  userData;
  userTopTracks;
  topTracksFeatures = null;

  async spotifyConnect() {
    window.location.href =
      this.baseURL +
      "authorize?client_id=" +
      this.spotifyData.clientID +
      "&response_type=token&redirect_uri=" +
      (this.isDevMode ? this.devCallbackURI : this.prodCallbackURL) +
      "&scope=" +
      this.scope;
  }

  isConnected() {
    return this.#token != null;
  }

  setToken(token) {
    sessionStorage.setItem("access_token", token);
    window.location.href = "http://localhost:5500/index.html";
  }

  deleteToken() {
    sessionStorage.removeItem("access_token");
    window.location.href = "http://localhost:5500/index.html";
  }

  clearAllData() {
    sessionStorage.clear();
  }

  constructor() {
    this.#token = sessionStorage.getItem("access_token");

    let dataToObtains = [];

    if (this.isConnected() && !sessionStorage["user_data"]) {
      dataToObtains.push(this.fetchUserData());
    }

    if (this.isConnected() && !sessionStorage["top_tracks"]) {
      dataToObtains.push(this.fetchTopTracks(5));
    }

    this.promiseAllObtention = Promise.all(dataToObtains).then(() => {
      this.userTopTracks = JSON.parse(sessionStorage.getItem("top_tracks"));
      this.userData = JSON.parse(sessionStorage.getItem("user_data"));
    });
  }

  getUserName() {
    return this.userData["display_name"];
  }

  async fetchTopTracks(limit) {
    const url = `https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=${limit}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.#token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Error fetching top tracks");
      }

      const data = await response.json();
      sessionStorage.setItem("top_tracks", JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors de la récupération des morceaux:", error);
    }
  }

  async getAllTopTrackFeature() {
    console.log("eee")
    if (this.topTracksFeatures === null) {
      console.log("bbb")

      let trackPromiseArray = [];
      for (let track of this.userTopTracks["items"]) {
        console.log("eerfff")
        trackPromiseArray.push(this.fetchTrackFeatures(track["id"]));
      }

      this.topTracksFeatures = Promise.all(trackPromiseArray);
    }
    return this.topTracksFeatures;
  }

  async fetchTrackFeatures(id) {
    const url = `https://api.spotify.com/v1/audio-features/${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.#token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching top tracks");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des morceaux:", error);
    }
  }

  async fetchUserData() {
    const url = "https://api.spotify.com/v1/me";
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.#token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching user data");
      }

      const data = await response.json();
      sessionStorage.setItem("user_data", JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors des données utilisateurs:", error);
    }
  }

  async isAllDataObtained() {
    return this.promiseAllObtention;
  }
}

const APIInstance = new API();

function connect() {
  APIInstance.spotifyConnect();
}

function deconnect() {
  APIInstance.clearAllData();
  APIInstance.deleteToken();
}
