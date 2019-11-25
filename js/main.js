const ws = new WebSocket('ws://localhost:3000');
const online = document.querySelector('.show-online');
const inputName = document.querySelector('.name');
const submitButton = document.querySelector('.submit-button');

let setStatus = status => {
  online.innerHTML = status;
};
// !change all relevant objects to irrelevant
let setRelevant = data => {
  if (data.relevant != undefined) {
    data.relevant = false;
  } else {
    for (key in data) {
      setRelevant(data[key]);
    }
  }
  return new Promise((res, rej) => {
    res(data);
  });
};
// !Search all relevant objects
let searchRelevantData = data => {
  if (data.relevant != undefined) {
      data.relevant ? console.log(data) : null;
  } else {
    for (key in data) {
      searchRelevantData(data[key]);
    }
  }
  return data;
};
//! WebSocket ---------------------------------------------
ws.onopen = () => setStatus('ONLINE');
ws.onmessage = response =>  {
  let receivedData = JSON.parse(response.data);
  submitButton.addEventListener('click', () => {
    setRelevant(receivedData)
    .then(message => {
      message[Object.keys(message).length + 1] = {
        "name": inputName.value,
        "relevant": true
      }
      return message;
    })
    .then(message => receivedData = message)
    .then(message => searchRelevantData(message))
    .then(message => ws.send(JSON.stringify(message)))
    .catch(() => new Error('Error'));
  });
}
ws.onclose = () => setStatus('OFFLINE');
//! -------------------------------------------------------
