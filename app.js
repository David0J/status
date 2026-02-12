const servers = [
  {
    name: "Nadzaura Minecraft Server",
    address: "nadzaura.aternos.me",
    port: 35842
  }
];

const container = document.getElementById("servers");

servers.forEach(server => {
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

  fetch(`https://api.mcsrvstat.us/2/${server.address}:${server.port}`)
    .then(res => res.json())
    .then(data => {
      if (data.online) {
        statusEl.textContent = `ONLINE (${data.players.online}/${data.players.max})`;
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
