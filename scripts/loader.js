async function loadNavbar() {
  const response = await fetch("./pages/components/header.html");
  if (response.ok) {
    const navbarHtml = await response.text();
    document.getElementById("page-header").innerHTML = navbarHtml;
  } else {
    console.error("Navbar could not be loaded");
  }
}

console.log("eee");
loadNavbar();
console.log("ddd");
