import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

function onFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const { delay, state } = Object.fromEntries(formData.entries());

  createPromise(Number(delay), state)
    .then(resDelay =>
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${resDelay}ms`,
        position: 'topRight',
      })
    )
    .catch(rejDelay =>
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${rejDelay}ms`,
        position: 'topRight',
      })
    );

  e.target.reset();
}

function shouldResolve(state) {
  return state.toLowerCase() === 'fulfilled';
}

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve(state)) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

form.addEventListener('submit', onFormSubmit);
