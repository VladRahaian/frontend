const API_URL = "https://jsonplaceholder.typicode.com/posts";

const list = document.querySelector("#posts-list");
const status = document.querySelector("#status");
const form = document.querySelector("#post-form");
const formError = document.querySelector("#form-error");
const submitBtn = document.querySelector("#submit-btn");

// afișează un mesaj în locul listei (încărcare / eroare / listă goală)
// dacă text e gol, ascunde mesajul
function showStatus(text) {
  status.textContent = text;
  status.hidden = text === "";
}

function showFormError(text) {
  formError.textContent = text;
  formError.hidden = text === "";
}

// creează un <li> pentru o postare
function createPostItem(post) {
  const li = document.createElement("li");
  li.classList.add("post");
  li.dataset.id = post.id;

  const title = document.createElement("h3");
  title.textContent = post.title;

  const body = document.createElement("p");
  body.textContent = post.body;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Șterge";
  deleteBtn.classList.add("delete-btn");

  li.append(title, body, deleteBtn);
  return li;
}

// GET - încarcă lista la deschiderea paginii
async function loadPosts() {
  showStatus("Se încarcă...");

  try {
    const response = await fetch(API_URL + "?_limit=10");
    if (!response.ok) {
      showStatus("Eroare de la server: " + response.status);
      return;
    }

    const posts = await response.json();

    if (posts.length === 0) {
      showStatus("Nu există nicio postare.");
      return;
    }

    showStatus("");
    posts.forEach(function (post) {
      list.append(createPostItem(post));
    });
  } catch (error) {
    showStatus("Nu am putut încărca postările. Verifică conexiunea la internet.");
  }
}

// citește mesajul de eroare trimis de server (dacă există)
async function getServerMessage(response) {
  try {
    const data = await response.json();
    return data.message || data.error || response.statusText;
  } catch (error) {
    return response.statusText || "Eroare necunoscută";
  }
}

// POST - trimite formularul ca JSON
async function handleSubmit(event) {
  event.preventDefault();
  showFormError("");

  const data = Object.fromEntries(new FormData(form));
  data.userId = Number(data.userId);

  submitBtn.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (response.status === 201) {
      const newPost = await response.json();
      showStatus("");
      list.prepend(createPostItem(newPost)); // fără re-fetch
      form.reset();
    } else if (response.status >= 400 && response.status < 500) {
      const message = await getServerMessage(response);
      showFormError("Eroare " + response.status + ": " + message);
    } else {
      showFormError("Ceva nu a mers la server (" + response.status + ").");
    }
  } catch (error) {
    // fetch aruncă eroare doar când nu merge rețeaua
    showFormError("Eroare de rețea. Încearcă din nou.");
  } finally {
    submitBtn.disabled = false;
  }
}

// DELETE - un singur listener pe listă (delegarea evenimentelor)
async function handleListClick(event) {
  if (!event.target.classList.contains("delete-btn")) {
    return;
  }

  const li = event.target.closest(".post");
  const id = li.dataset.id;

  try {
    const response = await fetch(API_URL + "/" + id, { method: "DELETE" });
    if (!response.ok) {
      alert("Nu am putut șterge postarea (" + response.status + ").");
      return;
    }

    li.remove();
    if (list.children.length === 0) {
      showStatus("Nu există nicio postare.");
    }
  } catch (error) {
    alert("Eroare de rețea la ștergere.");
  }
}

form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleListClick);
loadPosts();
