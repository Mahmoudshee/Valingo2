// DOM Elements
const typingForm = document.querySelector(".typing-form");
const chatContainer = document.querySelector(".chat-list");
const chatbotContainer = document.querySelector(".chatbot-container");
const openChatbotButton = document.querySelector("#open-chatbot");
const closeChatbotButton = document.querySelector("#close-chatbot");

// State Variables
let userMessage = null;
let isResponseGenerating = false;
let isChatOpen = false;
let userLanguage = 'en'; // Assume English for now (This can be dynamically set based on the user)

// API Configuration
const GEMINI_API_KEY = "AIzaSyDt08K4c2pt0sJSOfDuNAHep7Hp-Qt1P0o"; // Your Gemini API key here
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

const VAMBO_API_URL = "https://vambo-api.com/translate"; // Example Vambo API URL for translation
const VAMBO_API_KEY = "vai-Noa6y13ipzD194bLWyzaVhRY7spxC84F"; // Replace with your actual Vambo API key

/* =====================================
   UI FUNCTIONS
===================================== */

// Toggle chatbot visibility
const toggleChatbot = () => {
  isChatOpen = !isChatOpen;
  chatbotContainer.style.display = isChatOpen ? "flex" : "none";
  openChatbotButton.style.display = isChatOpen ? "none" : "block";
};

// Show typing effect by displaying words one by one
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      localStorage.setItem("saved-chats", chatContainer.innerHTML); // Save chats to local storage
    }

    chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom
  }, 75);
};

// Show loading animation while waiting for the API response
const showLoadingAnimation = () => {
  const html = `
    <div class="message-content">
     <img class="" src="" alt="">
      <p class="text"></p>
      <div class="loading-indicator">
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
        <div class="loading-bar"></div>
      </div>
    </div>`;

  const incomingMessageDiv = document.createElement("div");
  incomingMessageDiv.classList.add("message", "incoming", "loading");
  incomingMessageDiv.innerHTML = html;

  chatContainer.appendChild(incomingMessageDiv);
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom

  generateAPIResponse(incomingMessageDiv);
};

/* =====================================
   API FUNCTIONS
===================================== */

// Translate message using Vambo AI
const translateMessage = async (message, targetLang) => {
  try {
    const response = await fetch(VAMBO_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${VAMBO_API_KEY}`,
      },
      body: JSON.stringify({
        text: message,
        target_lang: targetLang,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    return data.translated_text; // Return the translated message
  } catch (error) {
    console.error("Error translating message:", error);
    return message; // In case of error, return the original message
  }
};

// Translate response from Gemini AI
const translateResponse = async (responseText, targetLang) => {
  return await translateMessage(responseText, targetLang);
};

// Fetch response from the Gemini API based on user message
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text");

  try {
    // Translate user message to English (or target language for Gemini)
    const translatedMessage = await translateMessage(userMessage, 'en'); // Example translating to 'en'

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: translatedMessage }] }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');

    // Translate Gemini's response back to the user's language
    const translatedResponse = await translateResponse(apiResponse, userLanguage);
    showTypingEffect(translatedResponse, textElement, incomingMessageDiv);

  } catch (error) {
    isResponseGenerating = false;
    textElement.innerText = error.message;
    textElement.parentElement.closest(".message").classList.add("error");
  }
};

/* =====================================
   EVENT LISTENERS
===================================== */

// Handle outgoing chat message
const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if (!userMessage || isResponseGenerating) return;

  isResponseGenerating = true;

  const html = `
    <div class="message-content">
      <img class="" src="" alt="">
      <p class="text"></p>
    </div>`;

  const outgoingMessageDiv = document.createElement("div");
  outgoingMessageDiv.classList.add("message", "outgoing");
  outgoingMessageDiv.innerHTML = html;
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;

  chatContainer.appendChild(outgoingMessageDiv);
  typingForm.reset(); // Clear input
  chatContainer.scrollTo(0, chatContainer.scrollHeight); // Scroll to the bottom

  setTimeout(showLoadingAnimation, 500); // Show loading animation
};

// Open and close chatbot
openChatbotButton.addEventListener("click", toggleChatbot);
closeChatbotButton.addEventListener("click", toggleChatbot);

// Form submit handler
typingForm.addEventListener("submit", e => {
  e.preventDefault();
  handleOutgoingChat();
});
