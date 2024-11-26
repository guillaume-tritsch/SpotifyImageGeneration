// LOAD COMPONENTS

async function loadNavbar() {
  const response = await fetch("./components/header.html");
  if (response.ok) {
    const navbarHtml = await response.text();
    document.getElementById("page-header").innerHTML = navbarHtml;
  } else {
    console.error("Navbar could not be loaded");
  }
}

async function loadFooter() {
  const response = await fetch("./components/footer.html");
  if (response.ok) {
    const footerHtml = await response.text();
    document.getElementById("page-footer").innerHTML = footerHtml;
  } else {
    console.error("Footer could not be loaded");
  }
}

let isAllLoaded = [loadFooter(), loadNavbar()];

Promise.all(isAllLoaded).then(() => {
  let isNotLoadingHTMLElement =
    document.getElementsByClassName("if-not-loading");

  for (let el of isNotLoadingHTMLElement) {
    el.style.display = "none";
  }
});

// Apply javascript utilities when everything has load
Promise.all([APIInstance.isAllDataObtained(), ...isAllLoaded])
  .then(() => {
    let isLoadingHTMLElement = document.getElementsByClassName("if-loading");

    for (let el of isLoadingHTMLElement) {
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

    for (let el of isConnectedHTMLElement) {
      if (!APIInstance.isConnected()) {
        el.remove();
      }
    }

    for (let el of isNotConnectedHTMLElement) {
      if (APIInstance.isConnected()) {
        el.remove();
      }
    }

    // Users data
    let userImageHTMLElement =
      document.getElementsByClassName("data-user-image");

    let userNameHTMLElement = document.getElementsByClassName("data-user-name");
    console.log(userNameHTMLElement.length);
    for (let el of userNameHTMLElement) {
      console.log(APIInstance.getUserName());
      el.innerText = APIInstance.getUserName();
    }
  })
  .catch((error) => {
    console.error(error);
  });
