const isInsideSubfolder =
  window.location.pathname.includes("/pages/") ||
  window.location.pathname.includes("/projects/");

const rootPath = isInsideSubfolder ? "../" : "";

async function loadComponent(selector, filePath) {
  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Could not load ${filePath}`);
    }

    const html = await response.text();
    const container = document.querySelector(selector);

    if (!container) {
      return;
    }

    container.innerHTML = html;

    container.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");

      if (
        !href ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.startsWith("/")
      ) {
        return;
      }

      link.setAttribute("href", `${rootPath}${href}`);
    });
  } catch (error) {
    console.error(error);
  }
}

loadComponent("#header", `${rootPath}components/header.html`);
loadComponent("#footer", `${rootPath}components/footer.html`);

// Back-to-Top
const backToTopButton = document.getElementById("back-to-top");

if (backToTopButton) {
  window.addEventListener("scroll", () => {
    backToTopButton.classList.toggle(
      "is-visible",
      window.scrollY > 500
    );
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}