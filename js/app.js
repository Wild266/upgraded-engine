// DOM Elements
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const profileSection = document.getElementById("profileSection");
const reviewForm = document.getElementById("reviewForm");
const submitReviewButton = document.getElementById("submitReview");
const mediaList = document.getElementById("mediaList");
const profilePicture = document.getElementById("profilePicture");
const usernameDisplay = document.getElementById("username");

let currentUser = null;

// Utility to show messages
function showMessage(message, type) {
  const messageBox = document.createElement("div");
  messageBox.textContent = message;
  messageBox.className = type === "success" ? "success" : "error";
  document.body.appendChild(messageBox);

  setTimeout(() => messageBox.remove(), 3000);
}

// Firebase Authentication - Login & Logout
loginButton.addEventListener("click", () => {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password:");

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      currentUser = userCredential.user;
      profileSection.classList.remove("hidden");
      usernameDisplay.textContent = currentUser.email;
      loadUserProfile(currentUser);
      loadMediaItems();
      showMessage("Login successful! Welcome back.", "success");
    })
    .catch(error => {
      showMessage("Login failed: " + error.message, "error");
    });
});

logoutButton.addEventListener("click", () => {
  auth.signOut().then(() => {
    currentUser = null;
    profileSection.classList.add("hidden");
    reviewForm.classList.add("hidden");
    showMessage("You have logged out.", "success");
  });
});

// Load User Profile and Media
function loadUserProfile(user) {
  const userRef = database.ref("users/" + user.uid);
  userRef.once("value").then(snapshot => {
    const userData = snapshot.val();
    profilePicture.src = userData ? userData.profilePic || "default.jpg" : "default.jpg";
  });
}

function loadMediaItems() {
  const mediaRef = database.ref("media");
  mediaRef.once("value").then(snapshot => {
    const mediaItems = snapshot.val();
    mediaList.innerHTML = "";
    for (const id in mediaItems) {
      const mediaItem = mediaItems[id];
      const mediaDiv = document.createElement("div");
      mediaDiv.innerHTML = `
        <h3>${mediaItem.title}</h3>
        <button onclick="showReviewForm('${id}')">Rate this</button>
      `;
      mediaList.appendChild(mediaDiv);
    }
  });
}

function showReviewForm(mediaId) {
  reviewForm.classList.remove("hidden");
  submitReviewButton.onclick = () => submitReview(mediaId);
}

function submitReview(mediaId) {
  const reviewText = document.getElementById("reviewText").value;
  const rating = document.getElementById("rating").value;

  if (rating < 1 || rating > 5) {
    showMessage("Rating must be between 1 and 5.", "error");
    return;
  }

  const reviewData = {
    username: currentUser.email,
    reviewText,
    rating,
    timestamp: new Date().toISOString(),
  };

  const reviewsRef = database.ref("reviews/" + mediaId);
  reviewsRef
    .push(reviewData)
    .then(() => {
      showMessage("Review submitted!", "success");
      reviewForm.classList.add("hidden");
    })
    .catch(error => showMessage("Failed to submit review: " + error.message, "error"));
}
