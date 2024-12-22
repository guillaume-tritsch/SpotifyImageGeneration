
class API {
  #token = null;

  devCallbackURI = "callback.html";
  prodCallbackURL =
    "callback";

  promiseAllObtention;

  userData;
  userTopTracks;
  userTopArtists;
  userPlaylist;

  #getCallbackURL() {
    return `${this.#getBase()}/${(IS_DEV_MODE) ? 'callback.html' : 'callback' }`
  }

  #getBase() {
    return (IS_DEV_MODE) ? DEV_URL : PROD_URL;
  }

  async spotifyConnect() {
     window.location.href = AUTH_URL +
      "/authorize?client_id=" +
      CLIENT_ID +
      "&response_type=code&redirect_uri=" +
      this.#getCallbackURL() +
      "&scope=" +
      SCOPE + "&show_dialog=true"
  }

  isConnected() {
    return this.#token != null;
  }

  setCode(code) {
    sessionStorage.setItem("code", code);
    this.requestToken(code)
  }

  setToken(token) {
    sessionStorage.setItem("access_token", token);
    window.location.href = this.#getBase();
  }

  deleteToken() {
    sessionStorage.removeItem("access_token");
    window.location.href = this.#getBase();
  }

  clearAllData() {
    sessionStorage.clear();
  }

  async requestToken(code) {
    const credentials = CLIENT_ID + ':' + CLIENT_SECRET;
    const base64Credentials = btoa(unescape(encodeURIComponent(credentials)));

    const url = `https://accounts.spotify.com/api/token?code=${code}&redirect_uri=${this.#getCallbackURL()}&grant_type=authorization_code`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": 'Basic ' + base64Credentials,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        throw new Error("Error request token");
      }

      const data = await response.json();
      this.setToken(data["access_token"])
    } catch (error) {
      console.error("Erreur token:", error);
    }
  }

  constructor() {
    this.#token = sessionStorage.getItem("access_token");

    sessionStorage.removeItem("playlists")

    let dataToObtains = [];

    if (this.isConnected() && !sessionStorage["user_data"]) {
      dataToObtains.push(this.fetchUserData());
    }

    if (this.isConnected() && !sessionStorage["top_tracks"]) {
      dataToObtains.push(this.fetchTopTracks(5));
    }

    if (this.isConnected() && !sessionStorage["top_artists"]) {
      dataToObtains.push(this.fetchTopArtists(5));
    }

    if (this.isConnected() && !sessionStorage["playlists"]) {
      dataToObtains.push(this.fetchAllPlaylists());
    }

    this.promiseAllObtention = Promise.all(dataToObtains).then(() => {
      this.userTopTracks = JSON.parse(sessionStorage.getItem("top_tracks"));
      this.userData = JSON.parse(sessionStorage.getItem("user_data"));
      this.userTopArtists = JSON.parse(sessionStorage.getItem("top_artists"));
      this.userPlaylist = JSON.parse(sessionStorage.getItem("playlists"));
    });
  }

  getTopTracks() {
    return JSON.parse(sessionStorage.getItem("top_tracks"));
  }

  getTopArtists() {
    return JSON.parse(sessionStorage.getItem("top_artists"));
  }

  getUserName() {
    return this.userData["display_name"];
  }

  getPlaylists() {
    return JSON.parse(sessionStorage.getItem("playlists"));
  }

  async fetchAllPlaylists() {
    const playlists = [];
    let url = `${API_URL}/me/playlists?limit=50`;
  
    try {
      while (url) {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.#token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Error fetching playlists");
        }
  
        const data = await response.json();

        playlists.push(...data.items);
  
        url = data.next;
      }
  
      sessionStorage.setItem("playlists", JSON.stringify(playlists));
    } catch (error) {
      console.error("Erreur lors de la récupération des playlists:", error);
    }
  }
  
  async fetchTopArtists(limit) {
    const url = `${API_URL}/me/top/artists?time_range=long_term&limit=${limit}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.#token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching top artists");
      }

      const data = await response.json();
      sessionStorage.setItem("top_artists", JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors de la récupération des artistes favoris:", error);
    }
  }

  async fetchTopTracks(limit) {
    const url = `${API_URL}/me/top/tracks?time_range=long_term&limit=${limit}`;
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
      sessionStorage.setItem("top_tracks", JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors de la récupération des morceaux:", error);
    }
  }

  async fetchUserData() {
    const url = `${API_URL}/me`;
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
