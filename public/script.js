// YouTube video ID (get this from the YouTube video URL)
const youtubeVideoId = '9L7mZH2u3Qc';

// YouTube player object
let youtubePlayer;

const socket = io();

// ... Existing code ...

// Receive user data from the server
socket.on('user-data', (user) => {
    currentUser = user;
});

// Receive updated user list from the server
socket.on('user-list', (userList) => {
    users = userList;
    updateUserList();
});

// Receive chat messages from the server
socket.on('chat-message', (data) => {
    const { user, message } = data;
    addMessageToChat(user, message);
});

// ... Existing code ...

// Event listener for sending messages
sendButton.addEventListener('click', () => {
    if (isCooldown) return; // Ignore click during cooldown
    const message = messageInput.value.trim();
    if (message !== '') {
        currentUser.messages.push(message);
        addMessageToChat(currentUser, message);
        messageInput.value = '';
        isCooldown = true; // Set cooldown
        setTimeout(() => {
            isCooldown = false; // Reset cooldown after 3 seconds
        }, 3000);
        // Send chat message to the server
        socket.emit('chat-message', message);
    }
});

// ... Existing code ...

// Function to load the YouTube IFrame API and create the player
function onYouTubeIframeAPIReady() {
    youtubePlayer = new YT.Player('background-music', {
        videoId: youtubeVideoId,
        playerVars: {
            autoplay: 1,          // Autoplay the video
            loop: 1,              // Loop the video
            controls: 0,          // Hide player controls
            showinfo: 0,          // Hide video title and uploader info
            modestbranding: 1,    // Hide YouTube logo
            fs: 0,                // Hide fullscreen button
            cc_load_policy: 0,    // Hide closed captions
            iv_load_policy: 3,    // Hide video annotations
            autohide: 0,          // Keep video controls visible
            rel: 0,               // Hide related videos after playback
        },
        events: {
            onReady: onPlayerReady,
        },
    });
}

// Function called when the YouTube player is ready
function onPlayerReady(event) {
    event.target.mute(); // Mute the player to only play audio
}

// Load YouTube IFrame API asynchronously
(function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

// Helper function to generate a random number
function getRandomNumber() {
    return Math.floor(Math.random() * 10000);
}

// Helper function to generate a random color (excluding black)
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
    } while (color === '#000000'); // Avoid black color
    return color;
}

// Create a new anonymous user with a random name and color
function createAnonymousUser() {
    return {
        name: `Anonymous ${getRandomNumber()}`,
        color: getRandomColor(),
        messages: [],
    };
}

// Add a new message to the message list
function addMessageToChat(user, message) {
    const messageList = document.getElementById('message-list');
    const newMessage = document.createElement('div');
    newMessage.className = 'message';
    newMessage.style.backgroundColor = user.color;
    newMessage.innerText = `${user.name}: ${message}`;
    messageList.appendChild(newMessage);
    setTimeout(() => {
        newMessage.remove();
    }, 20 * 60 * 1000); // Remove message after 20 minutes
}

// Main function to handle user interaction
function startChat() {
    const userList = document.getElementById('user-list');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const imageInput = document.getElementById('image-input');

    // Store users and current user
    const users = [createAnonymousUser()];
    let currentUser = users[0];
    let isCooldown = false;

    // Function to update the user list
    function updateUserList() {
        userList.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.innerText = user.name;
            userElement.style.color = user.color;
            userList.appendChild(userElement);
        });
    }

    // Event listener for sending messages
    sendButton.addEventListener('click', () => {
        if (isCooldown) return; // Ignore click during cooldown
        const message = messageInput.value.trim();
        if (message !== '') {
            currentUser.messages.push(message);
            addMessageToChat(currentUser, message);
            messageInput.value = '';
            isCooldown = true; // Set cooldown
            setTimeout(() => {
                isCooldown = false; // Reset cooldown after 3 seconds
            }, 3000);
        }
    });

    // Event listener for sending images
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        // Implement image handling logic here
    });

    // Main loop to reset user after 1 hour
    setInterval(() => {
        currentUser = createAnonymousUser();
        users.push(currentUser);
        updateUserList();
    }, 60 * 60 * 1000); // Reset user after 1 hour

    updateUserList();
}

// Run the chat application
startChat();