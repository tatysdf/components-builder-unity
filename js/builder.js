// builder.js
export function initBuilder() {
  const components = document.querySelectorAll(".component-item");
  const canvasZone = document.getElementById("canvas-area");
  const canvasContents = document.getElementById("canvas-contents");

  // Vérifier que la page builder est bien chargée
  if (!components.length || !canvasZone || !canvasContents) {
    console.warn(
      "[builder] DOM incomplet – vérifie que project-builder.html est chargé."
    );
    return;
  }

  // Drag depuis la palette
  components.forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("type", e.target.dataset.type);
    });
  });

  // Autoriser le drop sur la zone
  canvasZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    canvasZone.classList.add("dragover"); // Feedback visuel
  });

  canvasZone.addEventListener("dragleave", () => {
    canvasZone.classList.remove("dragover");
  });

  // Drop : créer un nouveau composant
  canvasZone.addEventListener("drop", (e) => {
    e.preventDefault();
    canvasZone.classList.remove("dragover");

    const type = e.dataTransfer.getData("type");

    const newDiv = document.createElement("div");
    newDiv.classList.add("dropped-component");
    newDiv.textContent = type === "button" ? "Cliquez-moi" : "Texte";

    // Ajout dans la zone de construction
    canvasContents.appendChild(newDiv);
  });
}
