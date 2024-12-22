document.addEventListener("DOMContentLoaded", function (event) {
  let isNotLoadingHTMLElement =
    document.getElementsByClassName("if-not-loading");

  for (let el of isNotLoadingHTMLElement) {
    el.style.display = "none";
  }

  // Apply javascript utilities when everything has load
  Promise.all([APIInstance.isAllDataObtained()])
    .then(() => {
      let isLoadingHTMLElement = document.getElementsByClassName("if-loading");

      let elementsToRemove = Array.from(isLoadingHTMLElement);

      for (let el of elementsToRemove) {
        el.remove();
      }

      let isNotLoadingHTMLElement =
        document.getElementsByClassName("if-not-loading");

      for (let el of isNotLoadingHTMLElement) {
        el.style.display = "block";
      }

      // Connected / Disconnected
      let isConnectedHTMLElement =
        document.getElementsByClassName("if-connected");
      let isNotConnectedHTMLElement =
        document.getElementsByClassName("if-not-connected");

      if (!APIInstance.isConnected()) {
        let elementsToRemove = Array.from(isConnectedHTMLElement);

        for (let el of elementsToRemove) {
          el.remove();
        }
      }

      if (APIInstance.isConnected()) {
        let elementsToRemove = Array.from(isNotConnectedHTMLElement);

        for (let el of elementsToRemove) {
          el.remove();
        }
      }

      // Users data
      if (APIInstance.isConnected()) {
        let userNameHTMLElement =
          document.getElementsByClassName("data-user-name");

        for (let el of userNameHTMLElement) {
          el.innerText = APIInstance.getUserName();
        }

        let listArtistsHTMLElement =
          document.getElementsByClassName("data-list-artists");

        let topArtistImageHTMLElement =
          document.getElementsByClassName("data-artist-image");

        let artistsItem = APIInstance.getTopArtists()["items"];

        for (let el of listArtistsHTMLElement) {
          for (let index = 0; index < artistsItem.length; index++) {
            const element = artistsItem[index];

            let artistLI = document.createElement("li");
            artistLI.innerText = index + 1 + ". " + element.name;
            el.appendChild(artistLI);
          }
        }

        for (let el of topArtistImageHTMLElement) {
          el.src = artistsItem[0]["images"][0]["url"];
          el.alt = artistsItem[0]["name"];
        }

        let listTracksHTMLElement =
          document.getElementsByClassName("data-list-tracks");

        let topTrackImageHTMLElement =
          document.getElementsByClassName("data-track-image");

        let tracksItem = APIInstance.getTopTracks()["items"];

        for (let el of listTracksHTMLElement) {
          for (let index = 0; index < tracksItem.length; index++) {
            const element = tracksItem[index];

            let trackLI = document.createElement("li");
            trackLI.innerText = index + 1 + ". " + element.name;
            el.appendChild(trackLI);
          }
        }

        for (let el of topTrackImageHTMLElement) {
          el.src = tracksItem[0]["album"]["images"][0]["url"];
          el.alt = tracksItem[0]["name"];
        }

        let popularityHTMLElement =
          document.getElementsByClassName("data-popularity");

        let total = 0;
        for (let el of artistsItem) {
          total += el["popularity"];
        }

        for (let el of popularityHTMLElement) {
          el.innerText = Math.round(total / 5);
        }

        let playlistHTMLElement =
          document.getElementsByClassName("data-playlist");

        for (let el of playlistHTMLElement) {
          for (let playlist of APIInstance.getPlaylists()) {
            let liElement = document.createElement("li");
            if (playlist['images'] !== null) {
              liElement.innerHTML = `<img src="${playlist['images'][0]["url"]}" alt="${playlist["name"]}">`
            } else {
              liElement.innerHTML = `<img src="img/no-image.jpg" alt="no image">`
            }
            liElement.innerHTML += `<p>${playlist["name"]}</p>`
            el.appendChild(liElement);
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
});
