
class API {
  #token = null;

  devCallbackURI = "callback.html";
  prodCallbackURL =
    "callback";

  promiseAllObtention;

  userData;
  userTopTracks;

  #getCallbackURL() {
    return `${this.#getBase()}/${(IS_DEV_MODE) ? 'callback.html' : 'callback' }`
  }

  #getBase() {
    return (IS_DEV_MODE) ? DEV_URL : PROD_URL;
  }

  async spotifyConnect() {
    window.location.href =
      AUTH_URL +
      "/authorize?client_id=" +
      CLIENT_ID +
      "&response_type=token&redirect_uri=" +
      this.#getCallbackURL() +
      "&scope=" +
      SCOPE;
  }

  isConnected() {
    return this.#token != null;
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

  constructor() {
    this.#token = sessionStorage.getItem("access_token");

    console.log("EEEERRRRR" , this.#token);

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
    const url = `${API_URL}/me/top/tracks?time_range=long_term&limit=${limit}`;
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
