const projects = window.portfolioProjects || [];

const grid = document.getElementById("project-grid");
const modal = document.getElementById("project-modal");
const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalSummary = document.getElementById("modal-summary");
const modalContext = document.getElementById("modal-context");
const modalRole = document.getElementById("modal-role");
const modalChallenges = document.getElementById("modal-challenges");
const modalResults = document.getElementById("modal-results");
const modalTags = document.getElementById("modal-tags");
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("site-menu");

function createTag(text) {
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = text;
  return tag;
}

function createList(items) {
  const list = document.createElement("ul");

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });

  return list;
}

function renderDetailContent(container, content) {
  container.innerHTML = "";

  if (Array.isArray(content)) {
    container.appendChild(createList(content));
    return;
  }

  const paragraph = document.createElement("p");
  paragraph.textContent = content;
  container.appendChild(paragraph);
}

function openModal(projectId) {
  const project = projects.find((item) => item.id === projectId);
  if (!project) {
    return;
  }

  modalCategory.textContent = project.category;
  modalTitle.textContent = project.title;
  modalSummary.textContent = project.summary;
  modalContext.textContent = project.context;
  modalResults.textContent = project.impact;

  modalTags.innerHTML = "";

  renderDetailContent(modalRole, project.role);
  renderDetailContent(modalChallenges, project.challenges);
  project.tags.forEach((tag) => modalTags.appendChild(createTag(tag)));

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function renderProjects() {
  if (!grid) {
    return;
  }

  const fragment = document.createDocumentFragment();

  projects.forEach((project) => {
    const article = document.createElement("article");
    article.className = "project-card";

    const tags = project.tags.slice(0, 3).map(createTag);

    article.innerHTML = `
      <div class="project-cover">
        <div class="project-cover-top">
          <span class="project-badge">${project.category}</span>
        </div>
        <div class="project-cover-bottom">
          <span class="project-divider" aria-hidden="true"></span>
        </div>
      </div>
      <div class="project-content">
        <h3>${project.title}</h3>
        <p class="project-summary">${project.summary}</p>
        <div class="project-footer">
          <div class="tag-list project-tag-row"></div>
          <button class="project-link" type="button" data-project-id="${project.id}">Ver detalhes</button>
        </div>
      </div>
    `;

    const tagList = article.querySelector(".project-tag-row");
    tags.forEach((tag) => tagList.appendChild(tag));
    fragment.appendChild(article);
  });

  grid.appendChild(fragment);
}

function setupMenu() {
  if (!menuToggle || !menu) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.addEventListener("click", (event) => {
  const projectButton = event.target.closest("[data-project-id]");
  const closeButton = event.target.closest("[data-close-modal]");

  if (projectButton) {
    openModal(projectButton.getAttribute("data-project-id"));
  }

  if (closeButton) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

renderProjects();
setupMenu();
