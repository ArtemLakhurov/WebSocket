const ws = new WebSocket('ws://localhost:3000');
const online = document.querySelector('.show-online');
const inputName = document.querySelector('.name');
const submitButton = document.querySelector('.submit-button');

let setStatus = status => {
  online.innerHTML = status;
}
// !change all relevant objects to irrelevant
let setRelevant = data => {
  if (data.relevant != undefined) {
    data.relevant = false;
  } else {
    for (key in data) {
      setRelevant(data[key]);
    }
  }
  return data;
}
// !Search all relevant objects
let searchRelevantData = data => {
  if (data.relevant != undefined) {
      data.relevant ? console.log(data) : null;
  } else {
    for (key in data) {
      searchRelevantData(data[key]);
    }
  }
}
//! WebSocket ---------------------------------------------
ws.onopen = () => setStatus('ONLINE');
ws.onmessage = response =>  {
  console.log(response.data);

  submitButton.addEventListener('click', () => {
    let newData = setRelevant(JSON.parse(response.data));
    newData[Object.keys(newData).length + 1] = {
      "name": inputName.value,
      "relevant": true
    };
    searchRelevantData(newData);
    ws.send(JSON.stringify(newData));
  });
}
ws.onclose = () => setStatus('OFFLINE');
//! -------------------------------------------------------
