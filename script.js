/* LocalLink Pro — single page with features
   - Tries backend (http://localhost:5000), falls back to SAMPLE if unavailable
   - Booking sends to backend if available, otherwise stores in localStorage
   - Adds map animation, WhatsApp, login/signup (frontend-only)
*/

const BACKEND = "http://localhost:5000"; // change if your backend is on a different port

// SAMPLE fallback data (rich)
const SAMPLE = {
  attractions: {
    jaipur: [
      {
        id: "a1",
        name: "Hawa Mahal",
        img: "https://media.istockphoto.com/id/1027216080/photo/hawa-mahal-palace-of-the-winds-jaipur-rajasthan.jpg?s=612x612&w=0&k=20&c=KrPAx2DsH8COKUK-cMKIzZfe987iuCpxoVQUNiHktkU=",
        desc: "Iconic latticed palace.",
      },
      {
        id: "a2",
        name: "Amber Fort",
        img: "https://s7ap1.scene7.com/is/image/incredibleindia/amber-fort-jaipur-rajasthan-1-attr-hero?qlt=82&ts=1742157903972",
        desc: "Hilltop fort with panoramic views.",
      },

      {
        id: "a3",
        name: "City Palace",
        img: "https://accidentallywesanderson.com/wp-content/uploads/2020/04/City-Palace-India-scaled.jpg",
        desc: "Royal residence & museums.",
      },
    ],
    udaipur: [
      {
        id: "u1",
        name: "Lake Pichola",
        img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=60",
        desc: "Romantic lake & boat rides.",
      },
    ],
  },
  guides: {
    jaipur: [
      {
        id: "g1",
        name: "Asha Devi",
        rating: 4.9,
        experience: "12 yrs",
        language: "Hindi, English",
        price: 1500,
        bio: "Historian & storyteller.",
      },
      {
        id: "g2",
        name: "Rohit Kumar",
        rating: 4.7,
        experience: "8 yrs",
        language: "Hindi, English, French",
        price: 1700,
        bio: "Food & photo walks.",
      },
      {
        id: "g3",
        name: "Sunita Meena",
        rating: 4.6,
        experience: "6 yrs",
        language: "Rajasthani, Hindi",
        price: 1100,
        bio: "Craft visits specialist.",
      },
      {
        id: "g4",
        name: "Aman Patel",
        rating: 4.5,
        experience: "4 yrs",
        language: "English, Hindi",
        price: 1300,
        bio: "Local stories & markets.",
      },
    ],
    udaipur: [
      {
        id: "g5",
        name: "Meera Patel",
        rating: 4.8,
        experience: "9 yrs",
        language: "English, Hindi",
        price: 1600,
        bio: "Palace tours & boat rides.",
      },
    ],
  },
  plans: {
    jaipur: {
      title: "Heritage Luxe Day — Jaipur",
      schedule: [
        "09:00 Amber Fort",
        "11:30 City Palace",
        "14:00 Traditional Lunch",
        "16:00 Hawa Mahal & Bazaar",
      ],
    },
    udaipur: {
      title: "Romantic Udaipur Day",
      schedule: [
        "08:00 Lake Pichola",
        "10:30 City Palace",
        "13:00 Lakeside Lunch",
        "17:00 Sunset Cruise",
      ],
    },
  },
};

// state
let backendAvailable = false;
let loadedGuides = []; // for paging
let guidePage = 0;
const PAGE_SIZE = 3;

// elements (will be null if DOM not ready — ensure script included at end of body)
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const attractionList = document.getElementById("attractionList");
const guideList = document.getElementById("guideList");
const guideCount = document.getElementById("guideCount");
const loadMoreBtn = document.getElementById("loadMoreGuides");
const itineraryContent = document.getElementById("itineraryContent");
const mapFrame = document.getElementById("mapFrame");
const quickGuideSelect = document.getElementById("quickGuideSelect");
const bookBtn = document.getElementById("bookBtn");
const saveLocalBtn = document.getElementById("saveLocalBtn");
const bookMsg = document.getElementById("bookMsg");
const estPrice = document.getElementById("estPrice");
const estDays = document.getElementById("estDays");
const calcBtn = document.getElementById("calcBtn");
const estResult = document.getElementById("estResult");
const daysSelect = document.getElementById("daysSelect");

// modal & auth elements
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

// popup elements
const popup = document.getElementById("popup");
const popupConfirm = document.getElementById("popupConfirm");
const popupCancel = document.getElementById("popupCancel");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");

// guard: if script accidentally loaded before DOM, wait
if (!cityInput) {
  console.error(
    "DOM elements not found — ensure <script src='script.js'> is placed at end of body."
  );
}

// check backend quickly
async function pingBackend() {
  try {
    const res = await fetch(`${BACKEND}/api/guides/jaipur`, {
      method: "GET",
      mode: "cors",
    });
    if (res.ok) {
      backendAvailable = true;
      console.log("Backend available");
    }
  } catch (e) {
    backendAvailable = false;
    console.log("Backend not available; using fallback data.");
  }
}
pingBackend();

// search handler
if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const city = (cityInput.value || "").trim().toLowerCase();
    if (!city) return alert("Enter a city (e.g., Jaipur)");
    guidePage = 0;
    loadCity(city);
  });
}

// Load city: attractions, guides, itinerary, map
async function loadCity(city) {
  attractionList.innerHTML = "<p class='muted'>Loading attractions...</p>";
  guideList.innerHTML = "<p class='muted'>Loading guides...</p>";
  itineraryContent.innerHTML = "<p class='muted'>Loading itinerary...</p>";
  quickGuideSelect.innerHTML = '<option value="">Select guide</option>';
  bookMsg.textContent = "";

  // Attractions
  try {
    if (backendAvailable) {
      const aRes = await fetch(`${BACKEND}/api/attractions/${city}`);
      const aJson = await aRes.json();
      populateAttractions(aJson.data || aJson || []);
    } else {
      populateAttractions(SAMPLE.attractions[city] || []);
    }
  } catch (e) {
    populateAttractions(SAMPLE.attractions[city] || []);
  }

  // Guides (paged)
  try {
    if (backendAvailable) {
      const gRes = await fetch(`${BACKEND}/api/guides/${city}`);
      const gJson = await gRes.json();
      loadedGuides = gJson.data || gJson || [];
    } else {
      loadedGuides = SAMPLE.guides[city] || [];
    }
  } catch (e) {
    loadedGuides = SAMPLE.guides[city] || [];
  }
  renderGuidePage();

  // Itinerary
  try {
    if (backendAvailable) {
      const pRes = await fetch(`${BACKEND}/api/itinerary/${city}`);
      const pJson = await pRes.json();
      populateItinerary(
        pJson.data || pJson || { title: "No plan", schedule: [] }
      );
    } else {
      populateItinerary(
        SAMPLE.plans[city] || { title: "No plan", schedule: [] }
      );
    }
  } catch (e) {
    populateItinerary(SAMPLE.plans[city] || { title: "No plan", schedule: [] });
  }

  // Map - animated embed (no API key)
  const q = encodeURIComponent(city + " tourist places");
  mapFrame.src = `https://www.google.com/maps?q=${q}&output=embed`;
}

// populate attractions
function populateAttractions(list) {
  attractionList.innerHTML = "";
  if (!list || !list.length) {
    attractionList.innerHTML = "<p class='muted'>No attractions found.</p>";
    return;
  }
  list.forEach((a) => {
    const div = document.createElement("div");
    div.className = "attraction";
    div.innerHTML = `<img src="${a.img}" alt="${a.name}"><h4>${a.name}</h4><p class="muted">${a.desc}</p>`;
    attractionList.appendChild(div);
  });
}

// render guides with paging
function renderGuidePage() {
  guideList.innerHTML = "";
  const start = guidePage * PAGE_SIZE;
  const pageItems = loadedGuides.slice(start, start + PAGE_SIZE);
  if (!loadedGuides || !loadedGuides.length) {
    guideList.innerHTML = "<p class='muted'>No guides found.</p>";
    guideCount.textContent = "";
    return;
  }
  guideCount.textContent = `(${loadedGuides.length})`;
  pageItems.forEach((g) => {
    const div = document.createElement("div");
    div.className = "guide-card";
    div.innerHTML = `<h4>${g.name} <span class="badge">Top</span></h4>
      <p class="muted">${g.bio || ""}</p>
      <p class="small">Languages: ${g.language || g.langs || "—"}</p>
      <p class="small">Experience: ${g.experience || "—"}</p>
      <p class="small">Rating: ⭐ ${g.rating}</p>
      <p class="small">Price: ₹ ${g.price || "—"}</p>
      <div style="margin-top:8px"><button class="btn primary bookNow" data-id="${
        g.id
      }">Book</button></div>`;
    guideList.appendChild(div);

    // add to quick select
    const opt = document.createElement("option");
    opt.value = g.id || g.name;
    opt.textContent = `${g.name} — ₹${g.price}`;
    quickGuideSelect.appendChild(opt);
  });

  // show/hide load more
  const moreExist = (guidePage + 1) * PAGE_SIZE < loadedGuides.length;
  loadMoreBtn.style.display = moreExist ? "block" : "none";

  // attach book handlers
  document.querySelectorAll(".bookNow").forEach((b) => {
    b.addEventListener("click", (ev) => {
      const id = ev.currentTarget.getAttribute("data-id");
      quickGuideSelect.value = id;
      showBookingPopup(id);
    });
  });
}

// load more
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    guidePage++;
    renderGuidePage();
  });
}

// populate itinerary
function populateItinerary(plan) {
  if (!plan || !plan.schedule) {
    itineraryContent.innerHTML = "<p class='muted'>No itinerary available.</p>";
    return;
  }
  itineraryContent.innerHTML = `<h4>${
    plan.title || "Suggested Plan"
  }</h4><ol>${plan.schedule.map((s) => `<li>${s}</li>`).join("")}</ol>`;
  const days = parseInt(daysSelect.value || "1");
  if (days > 1) {
    document.getElementById(
      "multiDayControls"
    ).innerHTML = `<div class="muted small">Multi-day plan: Showing day 1 of ${days}. (Use multi-day feature in extended version.)</div>`;
  } else {
    document.getElementById("multiDayControls").innerHTML = "";
  }
}

// BOOKING — send to backend or localStorage
if (bookBtn) {
  bookBtn.addEventListener("click", async () => {
    const name = document.getElementById("touristName").value.trim();
    const contact = document.getElementById("touristContact").value.trim();
    const date = document.getElementById("tourDate").value;
    const guideId = quickGuideSelect.value;
    const notes = document.getElementById("tourNotes").value.trim();
    const city = (cityInput.value || "").trim();

    if (!name || !contact || !guideId)
      return alert("Please enter name, contact and select a guide.");

    const payload = {
      touristName: name,
      contact,
      guideId,
      date,
      city,
      message: notes,
    };

    if (backendAvailable) {
      try {
        const res = await fetch(`${BACKEND}/api/request`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const j = await res.json();
        if (j.success) {
          bookMsg.textContent = "Request sent! Guide/contact will reach out.";
          clearBookingFields();
          return;
        }
      } catch (e) {
        console.warn("Backend request failed, saving locally.");
      }
    }

    // fallback: save to localStorage
    const saved = JSON.parse(
      localStorage.getItem("locallink_requests") || "[]"
    );
    saved.push({
      id: Date.now().toString(),
      ...payload,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem("locallink_requests", JSON.stringify(saved));
    bookMsg.textContent =
      "Saved offline (demo). You can show admin panel to view.";
    clearBookingFields();
  });
}

// show booking popup
function showBookingPopup(guideId) {
  popup.classList.remove("hidden");
  popupTitle.innerText = "Confirm Request";
  popupText.innerText =
    "Proceed to request this guide? We'll try to send to backend, otherwise save offline.";
  popupConfirm.onclick = () => {
    popup.classList.add("hidden");
    bookBtn.click();
  };
  popupCancel.onclick = () => {
    popup.classList.add("hidden");
  };
}

// clear booking fields
function clearBookingFields() {
  document.getElementById("touristName").value = "";
  document.getElementById("touristContact").value = "";
  document.getElementById("tourDate").value = "";
  document.getElementById("tourNotes").value = "";
  quickGuideSelect.value = "";
}

// save offline button
if (saveLocalBtn) {
  saveLocalBtn.addEventListener("click", () => {
    const name = document.getElementById("touristName").value.trim();
    const contact = document.getElementById("touristContact").value.trim();
    const guideId = quickGuideSelect.value;
    if (!name || !contact || !guideId)
      return alert("Name, contact and guide required.");
    const saved = JSON.parse(
      localStorage.getItem("locallink_requests") || "[]"
    );
    saved.push({
      id: Date.now().toString(),
      touristName: name,
      contact,
      guideId,
      city: cityInput.value || "",
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem("locallink_requests", JSON.stringify(saved));
    bookMsg.textContent = "Saved offline (demo).";
  });
}

// calculator
if (calcBtn) {
  calcBtn.addEventListener("click", () => {
    const price = parseFloat(estPrice.value || 0);
    const days = parseInt(estDays.value || 1);
    if (price <= 0 || days <= 0) return alert("Enter valid price and days.");
    const subtotal = price * days;
    const service = Math.round(subtotal * 0.08); // 8% service
    const gst = Math.round((subtotal + service) * 0.18); // 18% GST
    const total = subtotal + service + gst;
    estResult.innerHTML = `<strong>Estimated total: ₹${total}</strong> (Guide ₹${subtotal} + Service ₹${service} + GST ₹${gst})`;
  });
}

// login/signup (frontend only)
if (loginBtn) loginBtn.addEventListener("click", () => showModal("login"));
if (signupBtn) signupBtn.addEventListener("click", () => showModal("signup"));

function showModal(type) {
  modal.classList.remove("hidden");
  if (type === "login") {
    modalBody.innerHTML = `<h3>Login</h3>
      <input id="loginEmail" placeholder="Email" /><input id="loginPass" placeholder="Password" />
      <div style="text-align:right"><button id="doLogin" class="btn primary">Login</button></div>`;
    document.getElementById("doLogin").onclick = () => {
      localStorage.setItem(
        "locallink_user",
        document.getElementById("loginEmail").value
      );
      modal.classList.add("hidden");
      alert("Logged in (demo).");
    };
  } else {
    modalBody.innerHTML = `<h3>Sign up</h3>
      <input id="suName" placeholder="Name" /><input id="suEmail" placeholder="Email" /><input id="suPass" placeholder="Password" />
      <div style="text-align:right"><button id="doSignup" class="btn primary">Create</button></div>`;
    document.getElementById("doSignup").onclick = () => {
      localStorage.setItem(
        "locallink_user",
        document.getElementById("suEmail").value
      );
      modal.classList.add("hidden");
      alert("Account created (demo).");
    };
  }
}
if (modalClose)
  modalClose.addEventListener("click", () => modal.classList.add("hidden"));

// initial quick ping and UI setup
(async function init() {
  await pingBackend();
  estDays.value = daysSelect.value || "1";
})();

// hide popup when clicked outside (keeps simple)
document.addEventListener("click", (e) => {
  if (!popup.classList.contains("hidden")) {
    if (!popup.contains(e.target) && !e.target.classList.contains("bookNow")) {
      // do nothing — popup controlled by buttons
    }
  }
});
loginBtn.addEventListener("click", () => openModal("login"));
signupBtn.addEventListener("click", () => openModal("signup"));

function openModal(type) {
  modal.classList.remove("hidden");

  if (type === "login") {
    document.getElementById("modalTitle").innerText = "Login";
    document.getElementById("modalSubtitle").innerText = "Welcome back!";
    document.getElementById("modalActionBtn").innerText = "Login";
  } else {
    document.getElementById("modalTitle").innerText = "Sign up";
    document.getElementById("modalSubtitle").innerText =
      "Create your LocalLink account";
    document.getElementById("modalActionBtn").innerText = "Create Account";
  }
}

modalClose.addEventListener("click", () => {
  modal.classList.add("hidden");
});
