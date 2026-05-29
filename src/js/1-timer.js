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

window.onload = function () {
  const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      onFlatpickrClose(selectedDates);
    },
  };

  const dateTimeInput = document.querySelector('#datetime-picker');
  const fp = flatpickr(dateTimeInput, options);

  const startBtn = document.querySelector('[data-start]');

  let userSelectedDate = null;

  if (!userSelectedDate) {
    startBtn.disabled = true;
  }

  const onStartBtnClick = () => {
    if (!userSelectedDate) {
      return;
    }

    startTimer(userSelectedDate);
  };

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

  startBtn.addEventListener('click', onStartBtnClick);

  function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }

  function updateTimerDisplay(days, hours, minutes, seconds) {
    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
  }

  function startTimer(endTime) {
    startBtn.disabled = true;
    dateTimeInput.disabled = true;

    const timerId = setInterval(() => {
      const currentTime = new Date();
      const timeLeft = endTime - currentTime;

      if (timeLeft <= 0) {
        clearInterval(timerId);
        updateTimerDisplay(0, 0, 0, 0);
        dateTimeInput.disabled = false;
        userSelectedDate = null;

        return;
      }

      const { days, hours, minutes, seconds } = convertMs(timeLeft);
      updateTimerDisplay(days, hours, minutes, seconds);
    }, 1000);
  }
};
