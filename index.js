const currentTime = document.querySelector("#current-time");
const setHours = document.querySelector("#hours");
const setMinutes = document.querySelector("#minutes");
const setSeconds = document.querySelector("#seconds");
const setAmPm = document.querySelector("#am-pm");
const setAlarmButton = document.querySelector("#submitButton");
const alarmContainer = document.querySelector("#alarms-container");
let audio; // Declare the audio variable outside the play function

// Adding Hours, Minutes, Seconds in DropDown Menu
window.addEventListener("DOMContentLoaded", (event) => {
  dropDownMenu(1, 12, setHours);
  dropDownMenu(0, 59, setMinutes);
  dropDownMenu(0, 59, setSeconds);

  setInterval(getCurrentTime, 1000);
  fetchAlarm();
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getInput);

function dropDownMenu(start, end, element) {
  for (let i = start; i <= end; i++) {
    const dropDown = document.createElement("option");
    dropDown.value = i < 10 ? "0" + i : i;
    dropDown.innerHTML = i < 10 ? "0" + i : i;
    element.appendChild(dropDown);
  }
}

function getCurrentTime() {
  let time = new Date();
  time = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
  currentTime.innerHTML = time;

  return time;
}

function getInput(e) {
  e.preventDefault();
  const hourValue = setHours.value;
  const minuteValue = setMinutes.value;
  const secondValue = setSeconds.value;
  const amPmValue = setAmPm.value;

  const alarmTime = convertToTime(hourValue, minuteValue, secondValue, amPmValue);
  setAlarm(alarmTime);
}

// Converting time to 24 hour format
function convertToTime(hour, minute, second, amPm) {
  return `${parseInt(hour)}:${minute}:${second} ${amPm}`;
}

function setAlarm(time, fetching = false) {
  const alarm = setInterval(() => {
    if (time === getCurrentTime()) {
      
      play(); // Call the play function to play the alarm sound
      
      clearInterval(alarm); // Clear the interval after the alarm is triggered
      
    }
    console.log("running");
  }, 500);

  addAlaramToDom(time, alarm);
  if (!fetching) {
    saveAlarm(time);
  }
}

function play() {
  window.alert("Alarm Ringing");
  audio = new Audio("./Alarm.mp3");
  audio.play();
}

// Alarms set by user displayed in HTML
function addAlaramToDom(time, intervalId) {
  const alarm = document.createElement("div");
  alarm.classList.add("alarm", "mb", "d-flex");
  alarm.innerHTML = `
    <div class="time">${time}</div>
    <button class="btn delete-alarm" data-id=${intervalId}>Delete</button>
  `;
  const deleteButton = alarm.querySelector(".delete-alarm");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e, time, intervalId));

  alarmContainer.prepend(alarm);
}

// Are alarms saved in Local Storage?
function checkAlarms() {
  let alarms = [];
  const isPresent = localStorage.getItem("alarms");
  if (isPresent) alarms = JSON.parse(isPresent);

  return alarms;
}

// Save alarm to local storage
function saveAlarm(time) {
  const alarms = checkAlarms();

  alarms.push(time);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

// Fetch alarms from local storage
function fetchAlarm() {
  const alarms = checkAlarms();

  alarms.forEach((time) => {
    setAlarm(time, true);
  });
}

function deleteAlarm(event, time, intervalId) {
  const self = event.target;

  clearInterval(intervalId);

  const alarm = self.parentElement;
  console.log(time);

  deleteAlarmFromLocal(time);
  alarm.remove();
}

function deleteAlarmFromLocal(time) {
  const alarms = checkAlarms();

  const index = alarms.indexOf(time);
  alarms.splice(index, 1);
  localStorage.setItem("alarms", JSON.stringify(alarms));
}
