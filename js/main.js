import { initBuilder } from "./builder.js";

const pageMap = {
  dashboard: "pages/dashboard.html",
  projects: "pages/projects.html",
  builder: "pages/project-builder.html",
  settings: "pages/settings.html",
  help: "pages/help.html",
};
const contentEl = document.getElementById("content");
const navButtons = Array.from(document.querySelectorAll(".nav-btn"));
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
function setActiveButton(page) {
  navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === page);
    btn.setAttribute(
      "aria-current",
      btn.dataset.page === page ? "page" : "false"
    );
  });
}

async function loadPage(page) {
  const file = pageMap[page];
  if (!file) {
    contentEl.innerHTML = `<div class="card"><p>Page introuvable : ${page}</p></div>`;
    return;
  }
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error("Erreur chargement page: " + res.status);
    const html = await res.text();
    contentEl.innerHTML = html;
    setActiveButton(page);

    window.dispatchEvent(
      new CustomEvent(`${page}-loaded`, { detail: { page } })
    );

    if (page === "dashboard") initDashboardUi();
    if (page === "projects") initProjectsUi();
    if (page === "builder") initBuilderUi();
    if (page === "settings") initSettingsUi();

    contentEl.style.opacity = 0;
    contentEl.style.transform = "translateY(6px)";
    requestAnimationFrame(() => {
      contentEl.style.transition =
        "opacity 320ms ease, transform 360ms cubic-bezier(.2,.9,.3,1)";
      contentEl.style.opacity = 1;
      contentEl.style.transform = "translateY(0)";
    });
  } catch (err) {
    console.error(err);
    contentEl.innerHTML = `<div class="card"><p>Impossible de charger la page.</p></div>`;
  }

  if (window.innerWidth <= 980) {
    sidebar.classList.remove("open");
    hamburger && hamburger.setAttribute("aria-expanded", "false");
  }
}

navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;
    setActiveButton(page);
    loadPage(page);
  });
});

if (hamburger) {
  hamburger.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (!isOpen) contentEl?.focus();
  });
}

(function init() {
  setActiveButton("dashboard");
  loadPage("dashboard");
})();

function initDashboardUi() {
  window.dispatchEvent(new CustomEvent("dashboard-ready", { detail: {} }));
  document
    .getElementById("create-project-btn")
    .addEventListener("click", () => {
      window.UIApp.loadPage("projects");
    });
}
function initProjectsUi() {
  window.dispatchEvent(
    new CustomEvent("render-projects-request", { detail: {} })
  );

  const createBtn = document.getElementById("createProjectConfirm");
  const cancelBtn = document.getElementById("createProjectCancel");
  const projectNameInput = document.getElementById("projectName");
  const modal = document.getElementById("createProjectModal");
  const openModalBtn = document.getElementById("openCreateProjectModal");
  const projectLists = document.getElementById("projectsList");

  if (!openModalBtn) {
    console.error("projects.html n'est pas chargé dans le DOM !");
    return;
  }

  openModalBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
    projectNameInput.value = "";
  });

  createBtn.addEventListener("click", () => {
    const name = projectNameInput.value.trim();
    if (name === "") {
      alert("Entrez un nom de projet svp");
      return;
    }

    const techName = generateTechnicalName(name);
    const project = createProjectStructure(name, techName);
    addProjects(project);
    setCurrentProject(techName);

    modal.style.display = "none";
    projectNameInput.value = "";
    loadAndDisplayProject();
  });

  function loadAndDisplayProject() {
    projectLists.innerHTML = "";
    const projects = loadProjects();

    projects.forEach((p) => {
      const div = document.createElement("div");
      div.className = "project-item";

      div.innerHTML = `
        <div class="project-container">
            <span>${p.name}</span>
            <button class="open-project" data-id="${p.technicalName}">Ouvrir Projet</button>
            <button class="delete-project" data-id="${p.technicalName}">Supprimer Projet</button>
        </div>
      `;

      projectLists.appendChild(div);
    });
  }

  loadAndDisplayProject();

  projectLists.addEventListener("click", (e) => {
    if (e.target.classList.contains("open-project")) {
      const id = e.target.dataset.id;
      setCurrentProject(id);
      window.UIApp.loadPage("builder");
    }

    if (e.target.classList.contains("delete-project")) {
      const id = e.target.dataset.id;
      if (confirm("Vous voulez vraiment suprimer ?")) {
        deleteProjects(id);
        loadAndDisplayProject();
      }
    }
  });
}

async function initBuilderUi() {
  window.dispatchEvent(new CustomEvent("builder-ui-ready", { detail: {} }));
  window.dispatchEvent(new CustomEvent("export-cs-request", { detail: {} }));

  try {
    const { initBuilder } = await import("./builder.js");
    initBuilder();
  } catch (err) {
    console.error("[main] Impossible d'importer builder.js :", err);
  }
}


function initSettingsUi() {
  window.dispatchEvent(new CustomEvent("settings-ready", { detail: {} }));
}

window.UIApp = {
  loadPage,
  setActiveButton,
};
