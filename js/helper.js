const loadFromStorage = (key, defaultValue = null) => {
 const data = localStorage.getItem(key);
  
  try {
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error("Erreur JSON mal formé dans localStorage :", e);
    return defaultValue;
  }
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const loadProjects = () => {
  return loadFromStorage("projects", []);
};

const saveProjects = (projects) => {
  saveToStorage("projects", projects);
};

const addProjects = (project) => {
  const projects = loadProjects();
  projects.push(project);
  saveProjects(projects);
};

const deleteProjects = (technicalName) => {
  const projects = loadProjects();
  const newProjects = projects.filter((p) => p.technicalName !== technicalName);
  saveProjects(newProjects);

  const currentPoject = getCurrentProject();
  if (currentPoject === technicalName) {
    localStorage.removeItem("currentProject");
  }
};

const setCurrentProject = (technicalName) => {
  localStorage.setItem("currentProject", technicalName);
};
const getCurrentProject = () => {
  return localStorage.getItem("currentProject");
};

const getCurrentProjectData = () => {
  const technicalName = getCurrentProject();
  const projects = loadProjects();
  return projects.find((p) => p.technicalName === technicalName) || null;
};

const generateTechnicalName = (userName) => {
  const changed = userName.toLowerCase().replace(/[^a-z0-9]/g, "");
  let nameChanged = changed;
  let index = 1;

  const projects = loadProjects();
  const exist = (name) => projects.some((p) => p.technicalName === name);
  while (exist(nameChanged)) {
    nameChanged = `${nameChanged}_${index}`;
    index++;
  }
  return nameChanged;
};

const createProjectStructure = (name, technicalName) => {
  return {
    name: name,
    technicalName: technicalName,
    createdAt: new Date().toISOString(),
    components: [],
  };
};

window.loadFromStorage = loadFromStorage;
window.saveToStorage = saveToStorage;
window.loadProjects = loadProjects;
window.saveProjects = saveProjects;
window.addProjects = addProjects;
window.deleteProjects = deleteProjects;
window.setCurrentProject = setCurrentProject;
window.getCurrentProject = getCurrentProject;
window.generateTechnicalName = generateTechnicalName;
window.createProjectStructure = createProjectStructure;
