document.addEventListener("DOMContentLoaded", function () {
    // 1. Thumbnail Image Switcher
    const mainImg = document.getElementById("pdpMainImage");
    const thumbBoxes = document.querySelectorAll(".pdp-thumb-box");

    thumbBoxes.forEach(box => {
        box.addEventListener("click", function () {
            const newSrc = this.getAttribute("data-src");
            if (newSrc && mainImg) {
                // Fade out slight transition effect
                mainImg.style.opacity = "0.4";
                setTimeout(() => {
                    mainImg.src = newSrc;
                    mainImg.style.opacity = "1";
                }, 150);

                // Update active state
                thumbBoxes.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });

    // Thumbnail scroll arrow down
    const thumbContainer = document.querySelector(".pdp-thumbnails-stack");
    const thumbScrollBtn = document.getElementById("thumbScrollDown");
    if (thumbScrollBtn && thumbContainer) {
        thumbScrollBtn.addEventListener("click", function () {
            thumbContainer.scrollBy({ top: 80, behavior: "smooth" });
        });
    }

    // 2. Wishlist Toggle
    const wishlistBtn = document.getElementById("pdpWishlistBtn");
    if (wishlistBtn) {
        wishlistBtn.addEventListener("click", function () {
            this.classList.toggle("active");
            const svg = this.querySelector("svg");
            if (this.classList.contains("active")) {
                svg.setAttribute("fill", "#E53E3E");
                svg.setAttribute("stroke", "#E53E3E");
                showToast("Added to your wishlist!");
            } else {
                svg.setAttribute("fill", "none");
                svg.setAttribute("stroke", "currentColor");
                showToast("Removed from your wishlist.");
            }
        });
    }

    // 3. Tab Switcher (Description / Specifications / Reviews / Q&A)
    const tabBtns = document.querySelectorAll(".pdp-tab-btn");
    const tabPanes = document.querySelectorAll(".pdp-tab-pane");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const targetTab = this.getAttribute("data-tab");

            tabBtns.forEach(b => b.classList.remove("active"));
            tabPanes.forEach(p => p.classList.remove("active"));

            this.classList.add("active");
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add("active");
            }
        });
    });

    // View all reviews link -> switch tab to reviews
    const viewReviewsBtn = document.getElementById("viewAllReviewsBtn");
    if (viewReviewsBtn) {
        viewReviewsBtn.addEventListener("click", function (e) {
            e.preventDefault();
            const reviewsTabBtn = document.querySelector('.pdp-tab-btn[data-tab="tab-reviews"]');
            if (reviewsTabBtn) {
                reviewsTabBtn.click();
                document.getElementById("pdpTabsCard")?.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    // 4. Change Pincode Form Toggle & Handler
    const changePincodeBtn = document.getElementById("changePincodeBtn");
    const pincodeForm = document.getElementById("pincodeForm");
    const submitPincodeBtn = document.getElementById("submitPincodeBtn");
    const pincodeInput = document.getElementById("pincodeInput");
    const currentCityText = document.getElementById("currentCityText");

    if (changePincodeBtn && pincodeForm) {
        changePincodeBtn.addEventListener("click", function () {
            pincodeForm.classList.toggle("hidden");
            if (!pincodeForm.classList.contains("hidden")) {
                pincodeInput?.focus();
            }
        });
    }

    if (submitPincodeBtn && pincodeInput) {
        submitPincodeBtn.addEventListener("click", function () {
            const pin = pincodeInput.value.trim();
            if (pin.length === 6 && /^\d+$/.test(pin)) {
                if (currentCityText) {
                    currentCityText.textContent = `Pincode ${pin}`;
                }
                pincodeForm.classList.add("hidden");
                showToast(`Pincode updated to ${pin}. Express delivery available!`);
            } else {
                alert("Please enter a valid 6-digit postal pincode.");
            }
        });
    }

    // 5. Add to Cart & Buy Now Buttons
    const addToCartBtn = document.getElementById("addToCartBtn");
    const buyNowBtn = document.getElementById("buyNowBtn");
    const cartBadge = document.querySelector(".store-badge");

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function () {
            if (cartBadge) {
                let current = parseInt(cartBadge.textContent || "0");
                cartBadge.textContent = (current + 1).toString();
                cartBadge.style.transform = "scale(1.3)";
                setTimeout(() => cartBadge.style.transform = "scale(1)", 200);
            }
            showToast("Demon Slayer Giyu Tomioka Figure added to cart!");
        });
    }

    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", function () {
            showToast("Proceeding to Express Checkout...");
            setTimeout(() => {
                alert("Proceeding to secure checkout for Demon Slayer Giyu Tomioka 1/8 Scale Figure.");
            }, 500);
        });
    }

    // 6. 3D View Modal logic
    const open3dModalBtn = document.getElementById("open3dModalBtn");
    const close3dModalBtn = document.getElementById("close3dModalBtn");
    const pdp3dModal = document.getElementById("pdp3dModal");
    const spinImg = document.getElementById("spinImage3D");
    const spinLeftBtn = document.getElementById("spinLeftBtn");
    const spinRightBtn = document.getElementById("spinRightBtn");
    const reset3dBtn = document.getElementById("reset3dBtn");

    let currentRotation = 0;

    if (open3dModalBtn && pdp3dModal) {
        open3dModalBtn.addEventListener("click", function () {
            pdp3dModal.classList.remove("hidden");
        });
    }

    if (close3dModalBtn && pdp3dModal) {
        close3dModalBtn.addEventListener("click", function () {
            pdp3dModal.classList.add("hidden");
        });
    }

    if (pdp3dModal) {
        pdp3dModal.addEventListener("click", function (e) {
            if (e.target === pdp3dModal) {
                pdp3dModal.classList.add("hidden");
            }
        });
    }

    if (spinLeftBtn && spinImg) {
        spinLeftBtn.addEventListener("click", function () {
            currentRotation -= 45;
            spinImg.style.transform = `rotateY(${currentRotation}deg)`;
        });
    }

    if (spinRightBtn && spinImg) {
        spinRightBtn.addEventListener("click", function () {
            currentRotation += 45;
            spinImg.style.transform = `rotateY(${currentRotation}deg)`;
        });
    }

    if (reset3dBtn && spinImg) {
        reset3dBtn.addEventListener("click", function () {
            currentRotation = 0;
            spinImg.style.transform = `rotateY(0deg)`;
        });
    }

    // 7. Toast function
    function showToast(msg) {
        const toast = document.getElementById("pdpToast");
        const toastMsg = document.getElementById("toastMessage");
        if (toast && toastMsg) {
            toastMsg.textContent = msg;
            toast.classList.remove("hidden");
            setTimeout(() => {
                toast.classList.add("hidden");
            }, 3000);
        }
    }

    // 8. Countdown Timer Ticker
    const countdownTimer = document.getElementById("countdownTimer");
    if (countdownTimer) {
        let totalSeconds = 2 * 3600 + 15 * 60 + 32; // 2h 15m 32s
        setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                const h = Math.floor(totalSeconds / 3600);
                const m = Math.floor((totalSeconds % 3600) / 60);
                const s = totalSeconds % 60;
                countdownTimer.textContent = `${h}h ${m}m ${s}s`;
            }
        }, 1000);
    }
});
