const servers = [
  {
    name: "NadzAura Minecraft Server",
    address: "nadzaura.aternos.me",
    port: 35842,
    type: "java"
  }

  // Example Bedrock server
  // {
  //   name: "Bedrock Server",
  //   address: "example.com",
  //   port: 19132,
  //   type: "bedrock"
  // }
];

const container = document.getElementById("servers");

servers.forEach(server => {
  const card = document.createElement("div");
  card.className = "server";

  card.innerHTML = `
    <div>
      <div class="server-name">${server.name}</div>
      <div class="server-info">
        ${server.address}:${server.port} • ${server.type.toUpperCase()}
      </div>
    </div>
    <div class="status">Checking...</div>
  `;

  container.appendChild(card);

  const statusEl = card.querySelector(".status");

  const apiUrl =
    server.type === "bedrock"
      ? `https://api.mcsrvstat.us/bedrock/2/${server.address}:${server.port}`
      : `https://api.mcsrvstat.us/2/${server.address}:${server.port}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      if (data.online) {
        const players =
          data.players && typeof data.players.online === "number"
            ? ` (${data.players.online}/${data.players.max})`
            : "";

        statusEl.textContent = `ONLINE${players}`;
        statusEl.classList.add("online");
      } else {
        statusEl.textContent = "OFFLINE";
        statusEl.classList.add("offline");
      }
    })
    .catch(() => {
      statusEl.textContent = "ERROR";
      statusEl.classList.add("offline");
    });
});
