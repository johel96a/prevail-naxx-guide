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

  // Function to create fullscreen card view
  function showFullscreenCard(cardElement) {
    const overlay = document.createElement("div");
    overlay.classList.add("fullscreen-card");

    // Clone the card
    const fullCard = cardElement.cloneNode(true);

    // Remove any hover effects and click handlers from the cloned card
    fullCard.style.transform = "none";

    // Try to load higher quality image if available
    const cardImage = fullCard.querySelector(".card-left img");
    if (cardImage && cardImage.src) {
      // Try to replace low-res image with high-res version
      // Check if there's a data-hires attribute or try common patterns
      const hiResAttr = cardElement
        .querySelector(".card-left img")
        .getAttribute("data-hires");
      if (hiResAttr) {
        cardImage.src = hiResAttr;
      } else {
        // Try common high-res patterns (replace .webp with .jpg, add _large suffix, etc.)
        let hiResSrc = cardImage.src;

        // Pattern 1: Replace .webp with .jpg for potentially higher quality
        if (hiResSrc.includes(".webp")) {
          hiResSrc = hiResSrc.replace(".webp", ".jpg");
        }

        // Pattern 2: Try adding _large or _hd suffix before extension
        const lastDot = hiResSrc.lastIndexOf(".");
        if (lastDot > 0) {
          const baseName = hiResSrc.substring(0, lastDot);
          const extension = hiResSrc.substring(lastDot);
          const potentialHiRes = baseName + "_large" + extension;

          // Test if high-res version exists
          const testImg = new Image();
          testImg.onload = () => {
            cardImage.src = potentialHiRes;
          };
          testImg.src = potentialHiRes;
        }
      }
    }

    // Close on overlay click (but not on card click)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    // Close on ESC key
    const escHandler = (e) => {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", escHandler);
      }
    };
    document.addEventListener("keydown", escHandler);

    overlay.appendChild(fullCard);
    document.body.appendChild(overlay);
  }

  // Handle regular images (not in carousels)
  const regularImages = document.querySelectorAll(
    ".card-left img:not(.carousel-image)"
  );
  regularImages.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", (e) => {
      // Only trigger if not inside a grid card
      if (!img.closest(".card-grid")) {
        showFullscreen(img.src, img.alt);
      }
    });
  });

  // Handle carousel images - THIS IS THE KEY FIX
  const carouselImages = document.querySelectorAll(".carousel-image");
  carouselImages.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", (e) => {
      // Only trigger if not inside a grid card
      if (!img.closest(".card-grid")) {
        // Find the parent carousel
        const carousel = img.closest(".image-carousel");

        // Get the currently active image in this carousel
        const activeImage = carousel.querySelector(".carousel-image.active");

        // Use the active image's src and alt
        if (activeImage) {
          showFullscreen(activeImage.src, activeImage.alt);
        }
      }
    });
  });

  // Handle grid card clicks - NEW FUNCTIONALITY
  const gridCards = document.querySelectorAll(".card-grid .card");
  gridCards.forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", (e) => {
      // Prevent triggering if clicking on an image inside the card
      if (!e.target.matches("img")) {
        showFullscreenCard(card);
      }
    });
  });

  // Handle grid card image clicks - show fullscreen card instead of image
  const gridCardImages = document.querySelectorAll(".card-grid .card img");
  gridCardImages.forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent card click
      const card = img.closest(".card");
      showFullscreenCard(card);
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
