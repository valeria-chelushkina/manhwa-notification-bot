const app = window.Telegram.WebApp;
app.ready();

const statusMsg = document.getElementById("status-message");
const field = document.getElementById("field");

field.addEventListener("submit", async function (event) {
  event.preventDefault();

  const cookies = document.getElementById("cookies").value;
  const tgId = app.initDataUnsafe?.user?.id || "unknown_test_user";

  if (!cookies) {
    return;
  }

  statusMsg.innerText = "Verifying cookies...";

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        cookies: cookies,
        telegram_id: tgId,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    const result = await response.json();
    if (result.success) {
      statusMsg.innerText = "Success! Logged in securely.";

      setTimeout(async () => {
        try {
          await fetch("/api/login-success", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: tgId,
            }),
          });

          app.close();
        } catch (err) {
          console.error("Failed to send login success:", err);
        }
      }, 1500);
    } else {
      statusMsg.innerText = "Error: " + (result.message || "Invalid cookies.");
    }
  } catch (err) {
    console.error("Error connecting to server: ", err);
    statusMsg.innerText = "Failed to connect to server.";
  }
});
