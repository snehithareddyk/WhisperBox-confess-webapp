let confessions = JSON.parse(localStorage.getItem('confessions')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = null; // To track the logged-in user
const isAdmin = true; // Change this to false for a regular user

window.onload = function () {
    displayConfessions();
};

// Handle the form submission for adding a new confession
document.getElementById('confessionForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!currentUser) {
        alert('Please sign in to add a confession.');
        return;
    }

    const category = document.getElementById('category').value;
    const confession = document.getElementById('confession').value;
    const dateTime = new Date().toLocaleString();

    confessions.push({ category, confession, dateTime, likes: [], comments: [] });
    localStorage.setItem('confessions', JSON.stringify(confessions));

    closeModal();
    displayConfessions();
});


// Sign Up handling
document.getElementById('signUpForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        alert('Username already exists. Please choose another one.');
        return;
    }

    // Add the new user
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Sign up successful! You can now sign in.');
    closeSignUpModal();
});




// Sign In handling
document.getElementById('signInForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    // Check if the user exists and the password is correct
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        currentUser = user.username;
        alert(`Welcome, ${currentUser}!`);
        closeSignInModal();
        displayConfessions();
    } else {
        alert('Invalid username or password. Please try again.');
    }
});

// Function to filter confessions based on category
function filterConfessions(category) {
    if (category === 'all') {
        displayConfessions(confessions);
    } else {
        const filtered = confessions.filter(conf => conf.category === category);
        displayConfessions(filtered);
    }
}

// Display the confessions
// Add this function to your existing script.js
function displayConfessions(filteredConfessions = confessions) {
    const confessionList = document.getElementById('confessions-list');
    confessionList.innerHTML = '';

    if (isAdmin && confessions.length > 0) {
        const clearAllButton = document.getElementById('clear-all');
        clearAllButton.style.display = 'block'; // Show the clear all button for admin
    }

    filteredConfessions.forEach((conf, index) => {
        const confItem = document.createElement('div');
        confItem.className = 'confession-item';
        confItem.innerHTML = `
            <h3>${conf.category}</h3>
            <p>${conf.confession}</p>
            <div class="confession-actions">
                <div class="like-button" onclick="likeConfession(${index})">
                    <i class='bx bx-like' style='color:#8e44ad'  ></i>
                    <span class="like-count">${conf.likes.length}</span>
                </div>
                <button class="comment-btn" onclick="toggleComments(${index})">Comments (${conf.comments.length})</button>
                ${isAdmin ? `<button onclick="deleteConfession(${index})" class="delete-button">Delete</button>` : ''}
            </div>
            <div class="comments-section" id="comments-${index}" style="display: none;">
                ${conf.comments.map(comment => `<div class="comment">${comment.username}: ${comment.text}</div>`).join('')}
                <div class="comment-input">
                    <input type="text" id="comment-input-${index}" placeholder="Add a comment..." />
                    <button onclick="addComment(${index})">Post</button>
                </div>
            </div>
        `;
        confessionList.appendChild(confItem);
    });
}

// Function to like a confession
function likeConfession(index) {
    if (!currentUser) {
        alert('Please sign in to like a confession.');
        return;
    }
    if (!confessions[index].likes.includes(currentUser)) {
        confessions[index].likes.push(currentUser);
        localStorage.setItem('confessions', JSON.stringify(confessions));
        displayConfessions();
    } else {
        alert('You have already liked this confession.');
    }
}

// Function to toggle comments section
function toggleComments(index) {
    const commentsSection = document.getElementById(`comments-${index}`);
    commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
}

// Function to add a comment to a confession
function addComment(index) {
    const commentInput = document.getElementById(`comment-input-${index}`);
    const commentText = commentInput.value.trim();

    if (commentText) {
        confessions[index].comments.push({ username: currentUser, text: commentText });
        localStorage.setItem('confessions', JSON.stringify(confessions));
        displayConfessions();
    }

    commentInput.value = ''; // Clear input
}

// Function to delete a confession
function deleteConfession(index) {
    if (confirm("Are you sure you want to delete this confession?")) {
        confessions.splice(index, 1);
        localStorage.setItem('confessions', JSON.stringify(confessions));
        displayConfessions();
    }
}

// Function to clear all confessions (Admin only)
function clearAllConfessions() {
    if (confirm("Are you sure you want to clear all confessions? This action cannot be undone.")) {
        confessions = [];
        localStorage.setItem('confessions', JSON.stringify(confessions));
        displayConfessions();
    }
}

// Open the modal to add a new confession
function openModal() {
    const modal = document.getElementById('confessionModal');
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.querySelector('.modal-content').classList.add('show');
    }, 10);
}

// Close the modal
function closeModal() {
    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.remove('show');
    setTimeout(() => {
        document.getElementById('confessionModal').style.display = 'none';
    }, 300);
}


// Open/Close Sign Up Modal
function openSignUpModal() {
    // Hide the Sign In modal (if open)
    closeSignInModal();
    
    // Show the Sign Up modal
    document.getElementById('signUpModal').style.display = 'flex';
}

function closeSignUpModal() {
    document.getElementById('signUpModal').style.display = 'none';
}

// Open/Close Sign In Modal
function openSignInModal() {
    // Hide the Sign Up modal (if open)
    closeSignUpModal();
    
    // Show the Sign In modal
    document.getElementById('signInModal').style.display = 'flex';
}

function closeSignInModal() {
    document.getElementById('signInModal').style.display = 'none';
}


// Add this function to your existing script.js
function searchConfessions() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredConfessions = confessions.filter(confession =>
        confession.confession.toLowerCase().includes(searchTerm) ||
        confession.category.toLowerCase().includes(searchTerm)
    );
    displayConfessions(filteredConfessions);
}

// Storing data to google sheets
document.addEventListener('DOMContentLoaded', function() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwuL4TGFfW9sTI3FRl2tH98Ap60V-1r-03vjZCwqvokgSpXlHOgOnEKfbgNj5uXuS17/exec';
    const form = document.forms['sign-up-form'];
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => console.log('Success!', response))
            .catch(error => console.error('Error!', error.message));
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const scriptURL = 'https://script.google.com/macros/s/AKfycby-ZNxW-036AEQ5L4ZJ5AWnwxsioKSoC3qJOeKBzBaAV4q6cdPExfmqzgOu_45PS9Hh/exec';
    const form = document.forms['sign-in-form'];
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => console.log('Success!', response))
            .catch(error => console.error('Error!', error.message));
    });
});


