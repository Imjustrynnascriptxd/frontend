const apiBaseUrl = "https://files-vk0v.onrender.com/api/threads"; // Replace with your actual backend URL

// Handle navigation
function showPage(pageId) {
  const pages = document.querySelectorAll(".container");
  pages.forEach(page => page.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
}

// Register user
function registerUser() {
  const username = document.getElementById("username").value.trim();
  if (!username) {
    document.getElementById("registerMessage").textContent = "Username cannot be empty.";
    return;
  }
  localStorage.setItem("user", username);
  document.getElementById("registerMessage").textContent = `Account created successfully! Welcome, ${username}.`;
  document.getElementById("username").value = "";
}

// Toggle visibility of custom topic input
function toggleCustomTopicInput() {
  const topicSelect = document.getElementById("postTopic");
  const customTopicInput = document.getElementById("customTopic");
  if (topicSelect.value === "custom") {
    customTopicInput.classList.remove("hidden");
  } else {
    customTopicInput.classList.add("hidden");
  }
}

// Post thread
async function postThread() {
  const topicSelect = document.getElementById("postTopic");
  const customTopicInput = document.getElementById("customTopic");
  const topic = topicSelect.value === "custom" ? customTopicInput.value.trim() : topicSelect.value;
  const content = document.getElementById("threadContent").value.trim();
  const username = localStorage.getItem("user") || "Anonymous";

  if (!topic || !content) {
    document.getElementById("postMessage").textContent = "Both topic and content are required.";
    return;
  }

  const thread = { author: username, topic, content };

  try {
    const response = await fetch(apiBaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(thread),
    });
    if (response.ok) {
      document.getElementById("postMessage").textContent = "Thread posted successfully!";
      document.getElementById("threadContent").value = "";
      loadThreads();
    } else {
      throw new Error("Failed to post thread");
    }
  } catch (err) {
    console.error(err);
    document.getElementById("postMessage").textContent = "Error posting thread.";
  }
}

// Load threads
async function loadThreads() {
  try {
    const response = await fetch(apiBaseUrl);
    const threads = await response.json();

    const threadList = document.getElementById("threadList");
    threadList.innerHTML = "";

    threads.forEach(thread => {
      const threadDiv = document.createElement("div");
      threadDiv.classList.add("thread");
      threadDiv.innerHTML = `
        <p><strong>${thread.author}:</strong> ${thread.topic}</p>
        <p><small>Posted on: ${new Date(thread.timestamp).toLocaleString()}</small></p>
        <p>${thread.content}</p>
      `;
      threadList.appendChild(threadDiv);
    });
  } catch (err) {
    console.error(err);
    document.getElementById("threadList").textContent = "Error loading threads.";
  }
}

// Load threads on page load
loadThreads();
