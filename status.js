const GRID = document.getElementById("pixel-grid");
const LAST_UPDATED = document.getElementById("last-updated");
const DASHBOARD = "http://localhost:8007";

async function fetchUsers() {
    try {
        const res = await fetch(`${DASHBOARD}/list`);
        if (!res.ok) {
            console.error("Failed to fetch /list:", res.status);
            return;
        }

        const data = await res.json();
        const users = data.users || [];

        console.log("Users from /list:", users);

        renderBoard(users);
        LAST_UPDATED.textContent = "Last update: " + new Date().toLocaleTimeString();
    } catch (err) {
        console.error("Error fetching users:", err);
    }
}

function renderBoard(users) {
    GRID.innerHTML = "";

    if (users.length === 0) {
        const msg = document.createElement("div");
        msg.className = "empty-message";
        GRID.appendChild(msg);
        return;
    }

    // Make grid roughly square
    const cols = Math.ceil(Math.sqrt(users.length));
    GRID.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    users.forEach((user, index) => {
        const cell = document.createElement("div");
        cell.classList.add("pixel-img");  // reuse your existing class

        if (user.status === "online") {
            cell.classList.add("pixel-online");
        } else {
            cell.classList.add("pixel-offline");
        }

        cell.title = `${user.name} ${user.status}`;

        GRID.appendChild(cell);
    });
}

// Initial load
fetchUsers();
setInterval(fetchUsers, 2000);
