import hospitals from "../info/info.js";

let selectedStatus = "";
let users = {};

// Generate hospital users
hospitals.forEach((h, index) => {
  users["HOS" + (1000 + index)] = {
    password: "admin",
    name: h.name
  };
});

// LOGIN FUNCTION
function login() {
  let id = document.getElementById("hospitalId").value;
  let pass = document.getElementById("password").value;

  if (users[id] && users[id].password === pass) {
    localStorage.setItem("hospital", JSON.stringify(users[id]));

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    document.getElementById("welcomeText").innerHTML =
      "Welcome, <b>" + users[id].name + "</b>";

    loadData();
  } else {
    alert("Invalid login");
  }
}

// SET STATUS
function setStatus(el, status) {
  document.querySelectorAll(".status div")
    .forEach(d => d.classList.remove("active"));

  el.classList.add("active");
  selectedStatus = status;
}

// SAVE DATA
function saveData() {
  let hospital = JSON.parse(localStorage.getItem("hospital"));

  let totalBeds = parseInt(document.getElementById("totalBeds").value);
  let availableBeds = parseInt(document.getElementById("availableBeds").value);
  let totalICU = parseInt(document.getElementById("totalICU").value);
  let availableICU = parseInt(document.getElementById("availableICU").value);

  // VALIDATION
  if (isNaN(totalBeds) || isNaN(availableBeds) || isNaN(totalICU) || isNaN(availableICU)) {
    alert("Enter valid numbers");
    return;
  }
  if (availableBeds > totalBeds || availableICU > totalICU) {
    alert("Available cannot be more than total!");
    return;
  }
  if (!selectedStatus) {
    alert("Please select status!");
    return;
  }

  let allData = JSON.parse(localStorage.getItem("allHospitalData")) || {};

  allData[hospital.name] = {
    status: selectedStatus,
    totalBeds,
    availableBeds,
    totalICU,
    availableICU,
    emergency: document.getElementById("emergency").value,
    reason: document.getElementById("reason").value,
  };

  localStorage.setItem("allHospitalData", JSON.stringify(allData));

  alert("Status Updated Successfully!");
}

// LOAD EXISTING DATA
function loadData() {
  let hospital = JSON.parse(localStorage.getItem("hospital"));
  let allData = JSON.parse(localStorage.getItem("allHospitalData"));

  if (allData && allData[hospital.name]) {
    let data = allData[hospital.name];

    document.getElementById("totalBeds").value = data.totalBeds;
    document.getElementById("availableBeds").value = data.availableBeds;
    document.getElementById("totalICU").value = data.totalICU;
    document.getElementById("availableICU").value = data.availableICU;
    document.getElementById("emergency").value = data.emergency;
    document.getElementById("reason").value = data.reason;

    selectedStatus = data.status;

    document.querySelectorAll(".status div").forEach(div => {
      div.classList.toggle("active", div.innerText.trim() === data.status);
    });
  }
}

// EXPORT FUNCTIONS
window.login = login;
window.setStatus = setStatus;
window.saveData = saveData;