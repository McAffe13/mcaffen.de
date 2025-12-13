const PASSWORD = "Q$x$7dqt";

const postsDiv = document.getElementById("posts");
const newPostBtn = document.getElementById("newPostBtn");
let admin = false;

/* ================= SPEICHERN ================= */
function savePosts() {
    localStorage.setItem("mc_updates", postsDiv.innerHTML);
}
function loadPosts() {
    const data = localStorage.getItem("mc_updates");
    if (data) postsDiv.innerHTML = data;
}
loadPosts();

/* ================= ADMIN HOTKEY ================= */
document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "a") {
        toggleAdmin();
    }
});

/* ================= PASSWORT OVERLAY ================= */
function askPassword(callback) {
    const overlay = document.createElement("div");
    overlay.style = `
        position:fixed; inset:0;
        background:rgba(0,0,0,.6);
        display:flex; align-items:center; justify-content:center;
        z-index:9999;
    `;

    overlay.innerHTML = `
        <div style="background:#fff;padding:25px;border-radius:16px;min-width:260px">
            <h3>Admin Login</h3>
            <input id="pwInput" type="password" placeholder="Passwort"
                style="width:100%;padding:10px;border-radius:10px;border:1px solid #ccc">
            <button id="pwBtn" style="margin-top:10px;width:100%">Login</button>
        </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#pwBtn").onclick = () => {
        const val = overlay.querySelector("#pwInput").value;
        if (val === PASSWORD) {
            overlay.remove();
            callback(true);
        } else {
            alert("Falsches Passwort");
        }
    };
}

/* ================= ADMIN TOGGLE ================= */
function toggleAdmin() {
    if (!admin) {
        askPassword(ok => {
            if (!ok) return;
            admin = true;
            document.body.classList.add("admin");
            newPostBtn.classList.remove("hidden");
        });
    } else {
        admin = false;
        document.body.classList.remove("admin");
        newPostBtn.classList.add("hidden");
        document.querySelectorAll(".post").forEach(p => p.contentEditable = false);
        savePosts();
    }
}

/* ================= NEUER BEITRAG ================= */
function createPost() {
    const wrapper = document.createElement("div");
    wrapper.className = "post-wrapper";

    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";
    toolbar.innerHTML = `
        <button onclick="cmd('bold')">B</button>
        <button onclick="cmd('italic')">I</button>
        <button onclick="cmd('insertUnorderedList')">Liste</button>
        <input type="file" accept="image/*" onchange="uploadImage(this)">
        <button onclick="toggleEdit(this)">✏️</button>
        <button class="move" onclick="moveUp(this)">⬆️</button>
        <button class="move" onclick="moveDown(this)">⬇️</button>
        <button class="delete" onclick="deletePost(this)">🗑️</button>
    `;

    const post = document.createElement("div");
    post.className = "post";
    post.innerHTML = "<h3>Neues Update</h3><p>Text hier eingeben…</p>";

    wrapper.append(toolbar, post);
    postsDiv.prepend(wrapper);
    savePosts();
}

/* ================= BEARBEITEN ================= */
function toggleEdit(btn) {
    const post = btn.parentElement.nextElementSibling;
    post.contentEditable = !post.isContentEditable;
    post.focus();
    savePosts();
}

/* ================= LÖSCHEN ================= */
function deletePost(btn) {
    if (!confirm("Beitrag wirklich löschen?")) return;
    btn.closest(".post-wrapper").remove();
    savePosts();
}

/* ================= BEITRAG VERSCHIEBEN ================= */
function moveUp(btn) {
    const wrapper = btn.closest(".post-wrapper");
    const prev = wrapper.previousElementSibling;
    if (prev) postsDiv.insertBefore(wrapper, prev);
    savePosts();
}

function moveDown(btn) {
    const wrapper = btn.closest(".post-wrapper");
    const next = wrapper.nextElementSibling;
    if (next) postsDiv.insertBefore(next, wrapper);
    savePosts();
}

/* ================= BILD UPLOAD (FIX) ================= */
function uploadImage(input) {
    const file = input.files[0];
    if (!file) return;

    const wrapper = input.closest(".post-wrapper");
    const post = wrapper.querySelector(".post");

    const reader = new FileReader();
    reader.onload = e => {
        const img = document.createElement("img");
        img.src = e.target.result;
        post.appendChild(img);   // ✅ IMMER UNTEN IM BEITRAG
        savePosts();
    };
    reader.readAsDataURL(file);

    input.value = "";
}

/* ================= TEXT TOOLS ================= */
function cmd(command) {
    document.execCommand(command);
    savePosts();
}
