document.addEventListener("DOMContentLoaded", () => {
  // Default today's date
  const d = document.getElementById("issueDate");
  if (d) d.value = new Date().toISOString().split("T")[0];

  document.getElementById("issueForm").addEventListener("submit", function(e) {
    e.preventDefault();
    if (validate()) {
      this.style.display = "none";
      const box = document.getElementById("successBox");
      box.style.display = "block";
      document.getElementById("refNo").textContent = "HMS-" + Date.now().toString().slice(-6);
    }
  });

  // Live clear errors
  document.querySelectorAll("input, select, textarea").forEach(el => {
    el.addEventListener("input", () => {
      el.classList.remove("invalid");
      const err = document.getElementById("err-" + el.id);
      if (err) err.classList.remove("show");
    });
  });
  document.querySelectorAll('input[name="severity"]').forEach(r => {
    r.addEventListener("change", () => {
      document.getElementById("err-severity").classList.remove("show");
    });
  });
});

function validate() {
  let ok = true;
  const required = ["reporterName","hospitalName","area","issueCategory","description","issueDate"];
  required.forEach(id => {
    const el = document.getElementById(id);
    const err = document.getElementById("err-" + id);
    if (!el.value.trim()) {
      el.classList.add("invalid");
      if (err) err.classList.add("show");
      ok = false;
    } else {
      el.classList.remove("invalid");
      if (err) err.classList.remove("show");
    }
  });

  // Severity
  if (!document.querySelector('input[name="severity"]:checked')) {
    document.getElementById("err-severity").classList.add("show");
    ok = false;
  }

  // Declaration
  const dec = document.getElementById("declare");
  const errDec = document.getElementById("err-declare");
  if (!dec.checked) { errDec.classList.add("show"); ok = false; }
  else errDec.classList.remove("show");

  return ok;
}

function resetForm() {
  const form = document.getElementById("issueForm");
  form.reset();
  form.style.display = "block";
  document.getElementById("successBox").style.display = "none";
  form.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
  form.querySelectorAll(".err.show").forEach(el => el.classList.remove("show"));
  const d = document.getElementById("issueDate");
  if (d) d.value = new Date().toISOString().split("T")[0];
}
