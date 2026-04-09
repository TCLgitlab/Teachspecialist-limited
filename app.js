const TOKEN_ENDPOINT = "https://fa64327063b1ee6cb6ac5ab348f9f9.01.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr86a_robinaIntelligenceGuide/directline/token?api-version=2022-03-01-preview";
// const TOKEN_ENDPOINT = "https://fa64327063b1ee6cb6ac5ab348f9f9.01.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr86a_websiteQA/directline/token?api-version=2022-03-01-preview";

const elToggle = document.getElementById("tsChatToggle");
const elPanel = document.getElementById("tsChatPanel");
const elClose = document.getElementById("tsChatClose");
const elWidget = document.getElementById("tsChatWidget");
const elIntro = document.getElementById("tsChatIntro");
const webchatRoot = document.getElementById("webchat");

let webChatRendered = false;
let directLineInstance = null;
let storeInstance = null;
let introHidden = false;
let userHasStartedChat = false;

async function fetchToken() {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "GET",
    headers: { Accept: "application/json" }
  });

  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

function hideIntro() {
  if (!elIntro || introHidden) return;
  introHidden = true;
  elIntro.classList.add("hidden");
}

function markUserStartedChat() {
  if (userHasStartedChat) return;
  userHasStartedChat = true;
  hideIntro();
}

function dispatchInitialMessage(message) {
  if (!message || !storeInstance) return;

  markUserStartedChat();

  storeInstance.dispatch({
    type: "WEB_CHAT/SEND_MESSAGE",
    payload: { text: message }
  });
}

async function renderWebChat(initialMessage = "") {
  if (webChatRendered) {
    if (initialMessage) {
      dispatchInitialMessage(initialMessage);
    }
    return;
  }

  const tokenPayload = await fetchToken();
  const token =
    tokenPayload.token ||
    tokenPayload.conversationToken ||
    tokenPayload.directLineToken;

  if (!token) {
    throw new Error("No Direct Line token returned by the token endpoint.");
  }

  directLineInstance = window.WebChat.createDirectLine({ token });

  storeInstance = window.WebChat.createStore(
    {},
    ({ dispatch }) => next => action => {
      if (action.type === "DIRECT_LINE/CONNECT_FULFILLED" && initialMessage) {
        markUserStartedChat();
        dispatch({
          type: "WEB_CHAT/SEND_MESSAGE",
          payload: { text: initialMessage }
        });
      }

      // Hide intro ONLY when the user sends a message
      if (action.type === "WEB_CHAT/SEND_MESSAGE") {
        markUserStartedChat();
      }

      return next(action);
    }
  );

  const styleOptions = {
    hideUploadButton: true,

    botAvatarImage: "https://res.cloudinary.com/daqmbfctv/image/upload/c_crop,g_north_west,h_2206,w_2696/tbs_7274jpg_gmfio2_68362b.jpg",
    userAvatarInitials: "You",
    botAvatarBackgroundColor: "#0d1f3c",
    userAvatarBackgroundColor: "#2563eb",

    bubbleBorderRadius: 14,
    bubbleFromUserBorderRadius: 14,

    bubbleBackground: "#ffffff",
    bubbleBorderWidth: 1,
    bubbleBorderColor: "rgba(13,31,60,0.10)",

    bubbleFromUserBackground: "#1a4faa",
    bubbleFromUserBorderWidth: 0,
    bubbleFromUserBorderColor: "transparent",

    bubbleTextColor: "#0d1f3c",
    bubbleFromUserTextColor: "#ffffff",

    suggestedActionBackground: "#ffffff",
    suggestedActionBorderColor: "rgba(37,99,235,0.22)",
    suggestedActionBorderRadius: 8,
    suggestedActionBorderWidth: 1,
    suggestedActionTextColor: "#1a4faa",
    suggestedActionBackgroundColorOnHover: "#eef3ff",
    suggestedActionBorderColorOnHover: "rgba(37,99,235,0.40)",

    sendBoxBackground: "#ffffff",
    sendBoxBorderTop: "1px solid rgba(13,31,60,0.09)",
    sendBoxTextColor: "#0d1f3c",
    sendBoxPlaceholderColor: "#8a9ab5",
    sendBoxButtonColor: "#2563eb",
    sendBoxButtonColorOnHover: "#1a4faa",
    sendBoxHeight: 54,

    timestampColor: "#8a9ab5",
    primaryFont: "DM Sans, system-ui, -apple-system, sans-serif",

    rootHeight: "100%",
    rootWidth: "100%",

    bubbleMinHeight: 32,
    avatarSize: 38,
    messageActivityWordBreak: "break-word"
  };

  window.WebChat.renderWebChat(
    {
      directLine: directLineInstance,
      store: storeInstance,
      styleOptions
    },
    webchatRoot
  );

  webChatRendered = true;
}

async function openChat(initialMessage = "") {
  elPanel.classList.add("open");
  elPanel.setAttribute("aria-hidden", "false");
  elToggle.setAttribute("aria-expanded", "true");
  elToggle.style.display = 'none'; // Hide the launcher when chat is open

  try {
    await renderWebChat(initialMessage);
  } catch (err) {
    console.error("[TechSpecialist Copilot]", err);
    alert(
      "The chat assistant could not be loaded.\nPlease check the Direct Line token endpoint and web channel settings."
    );
  }
}

function closeChat() {
  elPanel.classList.remove("open");
  elPanel.setAttribute("aria-hidden", "true");
  elToggle.setAttribute("aria-expanded", "false");
  elToggle.style.display = 'block'; // Show the launcher when chat is closed
}

elToggle.addEventListener("click", () => {
  if (elPanel.classList.contains("open")) {
    closeChat();
  } else {
    openChat();
  }
});

elClose.addEventListener("click", () => closeChat());

document.addEventListener("click", event => {
  if (elPanel.classList.contains("open") && !elWidget.contains(event.target)) {
    closeChat();
  }
});

document.querySelectorAll(".ts-starter").forEach(btn => {
  btn.addEventListener("click", async () => {
    const message = btn.getAttribute("data-message") || "";
    await openChat(message);
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && elPanel.classList.contains("open")) {
    closeChat();
    elToggle.focus();
  }
});