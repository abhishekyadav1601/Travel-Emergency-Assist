// =======================
// GLOBAL STATE
// =======================

let allHistory = [];

const container = document.getElementById("historyContainer");
const searchInput = document.getElementById("searchInput");


// =======================
// INIT
// =======================

window.onload = function () {
    loadHistory();
};


// =======================
// LOAD HISTORY FROM BACKEND
// =======================

function loadHistory() {

    if (!container) return;

    container.innerHTML = `
        <p style="text-align:center;font-size:18px;color:gray;">
            ⏳ Loading history...
        </p>
    `;

    fetch("http://localhost:5000/history")
        .then(res => res.json())
        .then(data => {

            allHistory = data || [];
            showHistory(allHistory);

        })
        .catch(err => {

            console.log("Error:", err);

            container.innerHTML = `
                <p style="text-align:center;color:red;font-size:18px;">
                    ❌ Unable to load history (Server issue)
                </p>
            `;
        });
}


// =======================
// RENDER HISTORY
// =======================

function showHistory(data) {

    if (!container) return;

    container.innerHTML = "";

    if (!data || data.length === 0) {

        container.innerHTML = `
            <p style="text-align:center;font-size:18px;color:gray;margin-top:30px;">
                📭 No emergency history found
            </p>
        `;
        return;
    }

    data.forEach(item => {

        const dateTime = item.time
            ? new Date(item.time).toLocaleString()
            : "Unknown time";

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <h3>🚨 ${escapeHTML(item.type)}</h3>

            <p><b>📍 Latitude:</b> ${item.latitude}</p>
            <p><b>📍 Longitude:</b> ${item.longitude}</p>

            <p style="color:gray;font-size:13px;margin-top:8px;">
                ⏰ ${dateTime}
            </p>

            <div class="btn-group">
                <button class="map-btn">📍 View Map</button>
                <button class="delete-btn">❌ Delete</button>
            </div>
        `;

        // =======================
        // BUTTON EVENTS
        // =======================

        card.querySelector(".map-btn")
            .addEventListener("click", () => {
                openMap(item.latitude, item.longitude);
            });

        card.querySelector(".delete-btn")
            .addEventListener("click", () => {
                deleteItem(item.id);
            });

        container.appendChild(card);
    });
}


// =======================
// SEARCH FUNCTION
// =======================

function searchHistory() {

    if (!searchInput) return;

    const value = searchInput.value.toLowerCase().trim();

    const filtered = allHistory.filter(item =>
        item.type.toLowerCase().includes(value)
    );

    showHistory(filtered);
}


// =======================
// OPEN GOOGLE MAP
// =======================

function openMap(lat, lon) {

    if (!lat || !lon) return;

    const url = `https://www.google.com/maps?q=${lat},${lon}`;
    window.open(url, "_blank");
}


// =======================
// DELETE SINGLE ITEM
// =======================

function deleteItem(id) {

    if (!confirm("⚠ Are you sure you want to delete this item?")) return;

    fetch(`http://localhost:5000/emergency/${id}`, {
        method: "DELETE"
    })
        .then(res => res.json())
        .then(() => {

            allHistory = allHistory.filter(item => item.id !== id);
            showHistory(allHistory);

            alert("✅ Deleted successfully");
        })
        .catch(() => {
            alert("❌ Delete failed (server issue)");
        });
}


// =======================
// SAFE HTML (XSS protection)
// =======================

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}