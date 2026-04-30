import hospitals from "../../info/info.js";

const $ = (id) => document.getElementById(id);

function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

function drawGauge(percent) {
  const canvas = $("gaugeCanvas");
  const ctx = canvas.getContext("2d");
  let current = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const centerY = canvas.height;
    const radius = 80;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.stroke();

    const pct = current / 100;
    let color;
    if (pct < 0.5) {
      color = "#16a34a";
    } else if (pct < 0.75) {
      color = "#d97706";
    } else {
      color = "#dc2626";
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, Math.PI + pct * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.font = "bold 18px Poppins, sans-serif";
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    ctx.fillText(current + "%", centerX, centerY - 18);

    ctx.font = "11px Poppins, sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("Load", centerX, centerY - 4);

    if (current < percent) {
      current++;
      requestAnimationFrame(animate);
    }
  }

  animate();
}

function initMap(hospital, status) {
  const lat = hospital.lat || 19.0760;
  const lng = hospital.lng || 72.8777;

  document.getElementById("mapCoords").textContent = `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
  document.getElementById("mapAddress").textContent = `${hospital.area}, Mumbai`;

  // Google Maps directions — user ki location se hospital tak
  document.getElementById("mapLink").href =
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

  const map = L.map("map", { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);

  const pinColor = status === "Normal" ? "#16a34a" : status === "Busy" ? "#d97706" : "#dc2626";
  const pulseColor = status === "Normal" ? "rgba(22,163,74,0.25)" : status === "Busy" ? "rgba(217,119,6,0.25)" : "rgba(220,38,38,0.25)";

  const icon = L.divIcon({
    className: "",
    html: `<div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:36px;height:36px;border-radius:50%;background:${pulseColor};animation:pulse 2s infinite;"></div>
      <div style="position:relative;width:18px;height:18px;border-radius:50%;background:${pinColor};border:3px solid #fff;box-shadow:0 0 0 2px ${pinColor};z-index:1;"></div>
    </div>
    <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.4);opacity:0.3}}</style>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });

  const popupContent = `
    <div style="font-family:Poppins,sans-serif;min-width:160px;">
      <div style="font-weight:600;font-size:13px;margin-bottom:4px;color:#1e293b;">${hospital.name}</div>
      <div style="font-size:11px;color:#64748b;margin-bottom:6px;">${hospital.area}, Mumbai</div>
      <span style="background:${pinColor}22;color:${pinColor};font-size:11px;font-weight:600;padding:2px 8px;border-radius:10px;">● ${status}</span>
    </div>`;

  L.marker([lat, lng], { icon })
    .addTo(map)
    .bindPopup(popupContent, { maxWidth: 220, closeButton: false })
    .openPopup();

  L.circle([lat, lng], {
    radius: 200,
    color: pinColor,
    fillColor: pinColor,
    fillOpacity: 0.08,
    weight: 1,
  }).addTo(map);
}

function loadDetails() {
  const id = parseInt(getParam("id"));
  const hospital = hospitals.find(h => h.id === id);

  if (!hospital) {
    document.body.innerHTML = `<div style="padding:40px;text-align:center;font-family:Poppins,sans-serif;color:#64748b;">Hospital not found. <a href="../list-page/index.html">Go back</a></div>`;
    return;
  }

  const allData = JSON.parse(localStorage.getItem("allHospitalData")) || {};
  const updated = allData[hospital.name];

  let beds = hospital.beds;
  let icu = hospital.icu;
  let status = hospital.status;
  let reason = hospital.status;
  let percent = 30;

  if (updated) {
    beds = `${updated.availableBeds}/${updated.totalBeds}`;
    icu = `${updated.availableICU}/${updated.totalICU}`;
    status = updated.status;
    reason = updated.reason;

    const usedBeds = updated.totalBeds - updated.availableBeds;
    const usedICU = updated.totalICU - updated.availableICU;
    const bedsPercent = (usedBeds / updated.totalBeds) * 100;
    const icuPercent = (usedICU / updated.totalICU) * 100;
    percent = Math.round((bedsPercent + icuPercent) / 2);
  } else {
    if (status === "Normal") percent = 35;
    else if (status === "Busy") percent = 68;
    else if (status === "Critical") percent = 88;
  }

  $("dName").textContent = hospital.name;
  $("dArea").textContent = hospital.area + ", Mumbai";

  const badge = $("dBadge");
  badge.textContent = status;

  const statusColors = {
    Normal: "background:#dcfce7;color:#15803d",
    Busy:   "background:#fef3c7;color:#b45309",
    Critical: "background:#fee2e2;color:#b91c1c",
  };
  badge.style.cssText = statusColors[status];

  const bedParts = beds.split("/");
  const bedAvail = parseInt(bedParts[0]);
  const bedTotal = parseInt(bedParts[1]);
  const bedBadge = $("dBeds");
  bedBadge.textContent = beds;
  bedBadge.className = "svc-badge " + (bedAvail > bedTotal * 0.4 ? "svc-available" : bedAvail > 0 ? "svc-few" : "svc-full");

  const icuParts = icu.split("/");
  const icuAvail = parseInt(icuParts[0]);
  const icuTotal = parseInt(icuParts[1]);
  const icuBadge = $("dICU");
  icuBadge.textContent = icu;
  icuBadge.className = "svc-badge " + (icuAvail > icuTotal * 0.4 ? "svc-available" : icuAvail > 0 ? "svc-few" : "svc-full");

  $("dReason").textContent = "Reason: " + (reason || status);

  drawGauge(percent);
  initMap(hospital, status);
}

loadDetails();