// Active nav item stays highlighted
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-item");

  navLinks.forEach((link) => {
    if (link.href === window.location.href) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// Load external guide text into .card-text blocks
document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".card-text[data-src]");

  containers.forEach((container) => {
    const file = container.getAttribute("data-src");
    fetch(file)
      .then((res) => res.text())
      .then((html) => {
        container.innerHTML = html;
      })
      .catch((err) => {
        container.innerHTML = "<p>⚠ Failed to load guide.</p>";
        console.error("Error loading guide:", err);
      });
  });
});

// Fullscreen image view
document.addEventListener("DOMContentLoaded", () => {
  // Find all boss images inside .card-left
  const bossImages = document.querySelectorAll(".card-left img");

  bossImages.forEach((img) => {
    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => {
      // Create fullscreen overlay
      const overlay = document.createElement("div");
      overlay.classList.add("fullscreen");

      // Clone the clicked image
      const fullImg = document.createElement("img");
      fullImg.src = img.src;
      fullImg.alt = img.alt;

      // Close on click
      overlay.addEventListener("click", () => overlay.remove());

      // Add image to overlay, then overlay to body
      overlay.appendChild(fullImg);
      document.body.appendChild(overlay);
    });
  });
});
