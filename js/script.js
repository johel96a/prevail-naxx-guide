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

// Fullscreen image view - FIXED VERSION
document.addEventListener("DOMContentLoaded", () => {
  // Function to create fullscreen overlay
  function showFullscreen(imageSrc, imageAlt) {
    const overlay = document.createElement("div");
    overlay.classList.add("fullscreen");

    const fullImg = document.createElement("img");
    fullImg.src = imageSrc;
    fullImg.alt = imageAlt || "Fullscreen Image";

    // Close on click
    overlay.addEventListener("click", () => overlay.remove());

    // Close on ESC key
    const escHandler = (e) => {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);

    overlay.appendChild(fullImg);
    document.body.appendChild(overlay);
  }

  // Handle regular images (not in carousels)
  const regularImages = document.querySelectorAll(
    ".card-left img:not(.carousel-image)"
  );
  regularImages.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      showFullscreen(img.src, img.alt);
    });
  });

  // Handle carousel images - THIS IS THE KEY FIX
  const carouselImages = document.querySelectorAll(".carousel-image");
  carouselImages.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      // Find the parent carousel
      const carousel = img.closest(".image-carousel");

      // Get the currently active image in this carousel
      const activeImage = carousel.querySelector(".carousel-image.active");

      // Use the active image's src and alt
      if (activeImage) {
        showFullscreen(activeImage.src, activeImage.alt);
      }
    });
  });
});

// Image carousel functionality - IMPROVED VERSION
document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".image-carousel");

  carousels.forEach((carousel) => {
    const images = carousel.querySelectorAll(".carousel-image");
    const prevBtn = carousel.querySelector(".prev-btn");
    const nextBtn = carousel.querySelector(".next-btn");

    // Initialize: make sure first image is active if none are active
    if (
      !carousel.querySelector(".carousel-image.active") &&
      images.length > 0
    ) {
      images[0].classList.add("active");
    }

    // Find current active index
    let currentIndex = 0;
    images.forEach((img, index) => {
      if (img.classList.contains("active")) {
        currentIndex = index;
      }
    });

    // Previous button functionality
    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering fullscreen

        images[currentIndex].classList.remove("active");
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        images[currentIndex].classList.add("active");
      });
    }

    // Next button functionality
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering fullscreen

        images[currentIndex].classList.remove("active");
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add("active");
      });
    }

    // Optional: Add keyboard navigation for carousels
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" && prevBtn) {
        prevBtn.click();
      } else if (e.key === "ArrowRight" && nextBtn) {
        nextBtn.click();
      }
    });

    // Make carousel focusable for keyboard navigation
    carousel.setAttribute("tabindex", "0");
  });
});
