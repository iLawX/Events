const eventName = document.querySelector(".event-name");
const eventOrg = document.querySelector(".event-organizer");
const eventDate = document.querySelector(".event-date");
const eventsContainer = document.querySelector(".events");

let timeNow;

let events = [];

if (window.localStorage.getItem("events")) {
  events = JSON.parse(window.localStorage.getItem("events"));
  displayEvents();
}

const alert = Swal.mixin({
  timer: 2000,
  timerProgressBar: true,
  confirmButtonColor: "#007ed9",
  showCloseButton: true,
});

// Convert ISOString to ISOLocao

function toISOLocal(d) {
  var z = (n) => ("0" + n).slice(-2);
  var zz = (n) => ("00" + n).slice(-3);
  var off = d.getTimezoneOffset();
  var sign = off > 0 ? "-" : "+";
  off = Math.abs(off);

  return (
    d.getFullYear() +
    "-" +
    z(d.getMonth() + 1) +
    "-" +
    z(d.getDate()) +
    "T" +
    z(d.getHours()) +
    ":" +
    z(d.getMinutes()) +
    ":" +
    z(d.getSeconds()) +
    "." +
    zz(d.getMilliseconds()) +
    sign +
    z((off / 60) | 0) +
    ":" +
    z(off % 60)
  );
}
function setMinDate() {
  setInterval(() => {
    timeNow = toISOLocal(new Date()).split(".")[0];
    eventDate.min = timeNow;
  }, 1000);
  eventDate.addEventListener("input", () => {
    if (eventDate.value < timeNow) {
      eventDate.value = timeNow;
    }
  });
}
setMinDate();

// Add Events To Local Storage

function saveEvents() {
  window.localStorage.setItem("events", JSON.stringify(events));
}

// Dispaly Events

function displayEvents() {
  eventsContainer.innerHTML = "";
  events.forEach((event) => {
    const dateAndTime = event.date;
    const date = dateAndTime.split("T")[0];
    const time = dateAndTime.split("T")[1];
    const hours = time.split(":")[0];
    const minutes = time.split(":")[1];
    const seconds = time.split(":")[2];
    eventsContainer.innerHTML += `
      <div class="event scale" id="${event.id}">
        <h2>${event.title}</h2>
        <div class="organizer">
          <i class="fa-solid fa-id-badge"></i>
          <span>${event.organizer}</span>
        </div>
        <div class="date">
          <i class="fa-regular fa-calendar-days"></i>
          <span>
            ${date} - ${
      hours === "00"
        ? "12"
        : hours <= 12
        ? `${hours}`
        : `${Math.abs(hours - 12)}`
    }:${minutes}:${seconds || "00"}${
      hours < 12 ? "AM" : hours === 12 ? "PM" : "PM"
    }
          </span>
        </div>
        <div class="timer">
          <i class="fa-solid fa-hourglass-half"></i>
          <span class="remaining-time"></span>
        </div>
        <button onclick="deleteEvent(this)">Delete</button>
      </div>
    `;
  });
}

// Add Event

function addEvent() {
  if (
    eventName.value !== "" &&
    eventOrg.value !== "" &&
    eventDate.value !== ""
  ) {
    const event = {
      id: Date.now(),
      title: eventName.value,
      organizer: eventOrg.value,
      date: eventDate.value,
    };
    events.push(event);
    saveEvents();
    displayEvents();
    alert.fire({
      icon: "success",
      title: "Event Added Successfully!",
      confirmButtonColor: "#198754",
    });
    eventName.value = "";
    eventOrg.value = "";
    eventDate.value = "";
  } else {
    alert.fire({
      icon: "error",
      title: "Fill Out All Fields!",
    });
  }
}

// Delete Event

function deleteEvent(target) {
  events = events.filter((event) => event.id !== +target.parentElement.id);
  saveEvents();
  displayEvents();
  alert.fire({
    icon: "success",
    title: "Event Removed Successfully!",
  });
}

function updateTime() {
  const timers = document.querySelectorAll(".remaining-time");
  events.forEach((event, index) => {
    const timeNow = Date.now();
    const eventDate = new Date(event.date).getTime();
    const remainingTime = eventDate - timeNow;

    const days = parseInt(remainingTime / 1000 / 60 / 60 / 24);
    const hours = parseInt((remainingTime / 1000 / 60 / 60) % 24);
    const minutes = parseInt((remainingTime / 1000 / 60) % 60);
    const seconds = parseInt((remainingTime / 1000) % 60);

    if (remainingTime <= 0) {
      timers[index].parentElement.nextElementSibling.click();
    } else {
      timers[index].innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }
  });
}
setInterval(updateTime, 1000);
