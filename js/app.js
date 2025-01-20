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
    })
    .catch(error => alert("Authentication failed: " + error.message));
});

logoutButton.addEventListener("click", () => {
  auth.signOut().then(() => {
    currentUser = null;
    profileSection.classList.add("hidden");
    reviewForm.classList.add("hidden");
    alert("You have logged out.");
  });
});

// Load User Profile and Media
function loadUserProfile(user) {
  const userRef = database.ref('users/' + user.uid);
  userRef.once('value').then(snapshot => {
    const userData = snapshot.val();
    profilePicture.src = userData ? userData.profilePic || "default.jpg" : "default.jpg";
  });
}

function loadMediaItems() {
  const mediaRef = database.ref('media');
  mediaRef.once('value').then(snapshot => {
    const mediaItems = snapshot.val();
    mediaList.innerHTML = '';
    for (const id in mediaItems) {
      const mediaItem = mediaItems[id];
      const mediaDiv = document.createElement('div');
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

  const reviewData = {
    username: currentUser.email,
    reviewText,
    rating,
    timestamp: new Date().toISOString()
  };

  const reviewsRef = database.ref('reviews/' + mediaId);
  reviewsRef.push(reviewData)
    .then(() => {
      alert("Review submitted!");
      reviewForm.classList.add("hidden");
    })
    .catch(error => alert("Failed to submit review: " + error.message));
}
