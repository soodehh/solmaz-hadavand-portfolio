const params = new URLSearchParams(window.location.search);
const projectId =
  params.get("id") || document.body.dataset.projectId;
const project = projects[projectId];

const gallery = document.getElementById("project-gallery");

if (!project) {
  document.querySelector(".project-page").innerHTML =
    "<h1>Project not found</h1>";
} else {
  document.title = `${project.title} | Solmaz Hadavand`;

  document.getElementById("project-title").textContent = project.title;
  document.getElementById("project-subtitle").textContent = project.subtitle;
  document.getElementById("project-role").textContent = project.role;
  document.getElementById("project-description").textContent =
    project.description;

  gallery.classList.add(`project-gallery--${projectId}`);

  gallery.addEventListener("contextmenu", (event) => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });

  gallery.addEventListener("dragstart", (event) => {
    if (event.target instanceof HTMLImageElement) {
      event.preventDefault();
    }
  });

  project.gallery.forEach((item) => {
    const galleryItem =
      typeof item === "string"
        ? { src: item }
        : item;

    const fileSrc = galleryItem.src;
    const isVideo = fileSrc.toLowerCase().endsWith(".mp4");

    if (isVideo) {
      const video = document.createElement("video");

      video.src = `${rootPath}${fileSrc}`;
      video.controls = true;
      video.preload = "none";
      video.playsInline = true;

      video.setAttribute(
        "aria-label",
        galleryItem.label || `${project.title} project video`
      );

      const folderPath = fileSrc.substring(
        0,
        fileSrc.lastIndexOf("/") + 1
      );

      const posterSrc =
        galleryItem.poster || `${folderPath}1.webp`;

      video.poster = `${rootPath}${posterSrc}`;

      gallery.appendChild(video);
    } else {
      const img = document.createElement("img");

      img.alt =
        galleryItem.alt ||
        `${project.title} project image`;

      img.loading = "lazy";

      img.addEventListener("load", () => {
        if (img.naturalHeight > img.naturalWidth) {
          img.classList.add("portrait");
        }

        updateSculptMasonry();
      });

      img.src = `${rootPath}${fileSrc}`;

      gallery.appendChild(img);
    }
  });
}

function updateSculptMasonry() {
  if (projectId !== "sculpt-studies" || !gallery) {
    return;
  }

  const styles = window.getComputedStyle(gallery);
  const rowHeight = parseFloat(styles.getPropertyValue("grid-auto-rows"));
  const rowGap = parseFloat(styles.getPropertyValue("row-gap"));

  gallery.querySelectorAll("img").forEach((img) => {
    img.style.gridRowEnd = "auto";

    const imageHeight = img.getBoundingClientRect().height;

    const rowSpan = Math.ceil(
      (imageHeight + rowGap) / (rowHeight + rowGap)
    );

    img.style.gridRowEnd = `span ${rowSpan}`;
  });
}

let masonryResizeFrame;

window.addEventListener("resize", () => {
  cancelAnimationFrame(masonryResizeFrame);

  masonryResizeFrame = requestAnimationFrame(() => {
    updateSculptMasonry();
  });
});