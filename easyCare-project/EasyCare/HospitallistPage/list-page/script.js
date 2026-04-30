import hospitals from "../../info/info.js";

const ROWS_PER_PAGE = 10;
let currentPage = 1;
let currentFilter = "all";
let searchTerm = "";

// FILTER BUTTONS
function setFilter(f, el) {
  currentFilter = f;
  currentPage = 1;
  document.querySelectorAll(".filter-dot").forEach(d => d.classList.remove("selected"));
  el.classList.add("selected");
  render();
}

// SEARCH
function filterTable() {
  searchTerm = document.getElementById("searchInput").value.toLowerCase();
  currentPage = 1;
  render();
}

// STATUS BADGE
function badgeHTML(status) {
  const classes = { Normal: "badge-normal", Busy: "badge-busy", Critical: "badge-critical" };
  return `<span class="badge ${classes[status]}">${status}</span>`;
}

// FILTER DATA
function getFiltered() {
  const allData = JSON.parse(localStorage.getItem("allHospitalData")) || {};
  return hospitals.filter(h => {
    const updatedStatus = allData[h.name]?.status || h.status;
    const matchFilter = currentFilter === "all" || updatedStatus === currentFilter;
    const matchSearch = !searchTerm ||
      h.name.toLowerCase().includes(searchTerm) ||
      h.area.toLowerCase().includes(searchTerm);
    return matchFilter && matchSearch;
  });
}

// RENDER TABLE
function render() {
  const allData = JSON.parse(localStorage.getItem("allHospitalData")) || {};
  const filtered = getFiltered();
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));
  const start = (currentPage - 1) * ROWS_PER_PAGE;
  const page = filtered.slice(start, start + ROWS_PER_PAGE);

  // COUNT STATISTICS
  let normal = 0, busy = 0, critical = 0;
  hospitals.forEach(h => {
    const status = allData[h.name]?.status || h.status;
    if (status === "Normal") normal++;
    else if (status === "Busy") busy++;
    else if (status === "Critical") critical++;
  });

  document.getElementById("totalCount").textContent = hospitals.length;
  document.getElementById("normalCount").textContent = normal;
  document.getElementById("busyCount").textContent = busy;
  document.getElementById("criticalCount").textContent = critical;

  // TABLE ROWS
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = page.map(h => {
    const updated = allData[h.name];
    let beds = h.beds;
    let icu = h.icu;
    let status = h.status;
    if (updated) {
      beds = `${updated.availableBeds}/${updated.totalBeds}`;
      icu = `${updated.availableICU}/${updated.totalICU}`;
      status = updated.status;
    }
    return `
      <tr>
        <td><span class="hosp-name">${h.name}</span>${h.sub ? ` <span class="hosp-sub">${h.sub}</span>` : ""}</td>
        <td>${h.area}</td>
        <td>${beds}</td>
        <td>${icu}</td>
        <td>${badgeHTML(status)}</td>
        <td><button class="btn-view" onclick="viewList(${h.id})">View Details</button></td>
      </tr>
    `;
  }).join("");

  // PAGINATION
  const pg = document.getElementById("pagination");
  let btns = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage===1?'disabled':''}>← Prev</button>`;
  for (let i = 1; i <= totalPages; i++) {
    btns += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
  }
  btns += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage===totalPages?'disabled':''}>Next →</button>`;
  pg.innerHTML = btns;
}

// CHANGE PAGE
function goPage(p) {
  const filtered = getFiltered();
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  render();
}

// LISTEN FOR STORAGE CHANGES (cross-tab — admin updates list page in real time)
window.addEventListener('storage', (e) => {
  if (e.key === 'allHospitalData') {
    render();
  }
});

// NAVIGATION
window.viewList = id => window.location.href = `../view-list-details/index.html?id=${id}`;
window.setFilter = setFilter;
window.filterTable = filterTable;
window.goPage = goPage;

// INITIAL RENDER
render();