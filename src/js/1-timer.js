import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const dateTimeInput = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const daysVal = document.querySelector('[data-days]');
const hoursVal = document.querySelector('[data-hours]');
const minutesVal = document.querySelector('[data-minutes]');
const secondsVal = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

startBtn.disabled = true;

function onFlatpickrClose(selectedDates) {
  userSelectedDate = selectedDates[0];
  const currentDate = new Date();

  if (userSelectedDate <= currentDate) {
    startBtn.disabled = true;
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topCenter',
    });
  } else {
    startBtn.disabled = false;
  }
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    onFlatpickrClose(selectedDates);
  },
};

const fp = flatpickr(dateTimeInput, options);

const onStartBtnClick = () => {
  if (!userSelectedDate) {
    return;
  }

  const currentDate = new Date();

  if (userSelectedDate <= currentDate) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    startBtn.disabled = true;
    return;
  }

  startTimer(userSelectedDate);
};

startBtn.addEventListener('click', onStartBtnClick);

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateTimerDisplay(days, hours, minutes, seconds) {
  daysVal.textContent = addLeadingZero(days);
  hoursVal.textContent = addLeadingZero(hours);
  minutesVal.textContent = addLeadingZero(minutes);
  secondsVal.textContent = addLeadingZero(seconds);
}

function startTimer(endTime) {
  startBtn.disabled = true;
  dateTimeInput.disabled = true;
  fp.set('clickOpens', false);

  runCountdown();

  timerId = setInterval(runCountdown, 1000);

  function runCountdown() {
    const currentTime = new Date();
    const timeLeft = endTime - currentTime;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      updateTimerDisplay(0, 0, 0, 0);

      dateTimeInput.disabled = false;
      fp.set('clickOpens', true);
      fp.clear();

      userSelectedDate = null;

      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    updateTimerDisplay(days, hours, minutes, seconds);
  }
}
