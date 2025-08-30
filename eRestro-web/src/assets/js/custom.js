let section = document.querySelectorAll("section");
let NavLinks = document.querySelectorAll("ul li a");

window.onscroll = () => {
  section.forEach((sec) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      NavLinks.forEach((links) => {
        links.classList.remove("active");
        document
          .querySelector("ul li a[href*=" + id + "]")
          .classList.add("active");
      });
    }
  });
};

// outside click
