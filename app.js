const servers = {
  minecraft: [
    {
      name: "NadzAura Server",
      address: "nadzaura.aternos.me",
      port: 35842,
      type: "java",
    }
  ],
  other: [
    {
      name: "Custom Game Server",
      address: "example.com",
      port: 12345,
      type: "custom"
    }
  ]
};

const container = document.getElementById("servers");
const categorySelect = document.getElementById("categorySelect");

async function checkMinecraftServer(server, statusEl) {
  const apiUrl =
    server.type === "bedrock"
      ? `https://api.mcsrvstat.us/bedrock/2/${server.address}:${server.port}?_=${Date.now()}`
      : `https://api.mcsrvstat.us/2/${server.address}:${server.port}?_=${Date.now()}`;

  statusEl.textContent = "Checking...";
  statusEl.className = "status";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    const data = await res.json();

    // REAL ONLINE
    if (data.online === true) {
      const players =
        data.players && typeof data.players.online === "number"
          ? ` (${data.players.online}/${data.players.max})`
          : "";

      statusEl.textContent = `ONLINE${players}`;
      statusEl.classList.add("online");
      return;
    }

    // Aternos ping blocked but not hard error
    if (!data.debug || !data.debug.error) {
      statusEl.textContent = "UNKNOWN (Ping Blocked)";
      statusEl.style.color = "#facc15";
      return;
    }

    // Real offline
    statusEl.textContent = "OFFLINE";
    statusEl.classList.add("offline");

  } catch (err) {
    // Timeout / blocked / fetch failure
    statusEl.textContent = "UNKNOWN (Connection Blocked)";
    statusEl.style.color = "#facc15";
  }
}

function renderCategory(category) {
  container.innerHTML = "";

  servers[category].forEach(server => {
    const card = document.createElement("div");
    card.className = "server";

    card.innerHTML = `
      <div>
        <div class="server-name">${server.name}</div>
        <div class="server-info">${server.address}:${server.port}</div>
      </div>
      <div class="status">Checking...</div>
    `;

    container.appendChild(card);

    const statusEl = card.querySelector(".status");

    if (server.type === "java" || server.type === "bedrock") {
      checkMinecraftServer(server, statusEl);
    } else {
      statusEl.textContent = "Not supported yet";
      statusEl.classList.add("offline");
    }
  });
}

// Initial load
renderCategory(categorySelect.value);

// Change category
categorySelect.addEventListener("change", () => {
  renderCategory(categorySelect.value);
});
