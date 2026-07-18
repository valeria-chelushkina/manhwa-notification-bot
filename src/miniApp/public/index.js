window.Telegram.WebApp.ready();

const usernameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const statusMsg = document.getElementById("status-message");
const signInBtn = document.getElementById("sign-in-btn");
const field = document.getElementById("field");

console.log("I am here!!!!")

field.addEventListener("submit", async function(event) {
    console.log("I am here!")
  event.preventDefault();
  const usernameValue = document.getElementById("username").value;
  const passwordValue = document.getElementById("password").value;
  const tgId =
    window.Telegram.WebApp.initDataUnsafe?.user?.id || "unknown_test_user";

  statusMsg.innerText = "Sending data to server...";

  await getLoginData(usernameValue, passwordValue, tgId);
});

async function getLoginData(username, password, tgId) {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: password,
        telegramId: tgId,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    const result = await response.json();
    if (result.success) {
      console.log("Data posted to api successfully.");
      statusMsg.innerText = "Success! Closing app...";

      setTimeout(() => {
        window.Telegram.WebApp.close();
      }, 1500);
    } else {
      statusMsg.innerText = "Error logging in.";
    }
  } catch (err) {
    console.error("Error connecting to server: ", err);
    statusMsg.innerText = "Failed to connect to server.";
  }
}
