
const siteURL = 'http://localhost:3000'
const cols = ['name', 'reps', 'weight', 'date'];

// ----------------------------------------------------
// The update button sends a request to change an entry,
// then redirects to '/'
// ----------------------------------------------------

// get the update button
let updateButton = document.getElementById('updateButton');
updateButton.addEventListener('click', async event => {
  // this needs to be here at the beginning since the listener is async
  event.preventDefault();

  // build the form JSON
  let formVals = {};
  cols.forEach(col => {
    formVals[col] = document.getElementById(col).value;
  });
  formVals['lbs'] = (document.getElementById('lbs').checked)? true: false;

  formVals['id'] = updateButton.getAttribute('data-id');

  console.log('hello ' + siteURL); // debug

  // send put request to the site
  let response = await fetch(siteURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formVals)
  }).catch(err => console.error(err));

  console.log(response.statusText); // debug
  console.log(response.status); // debug

  // redirect to '/'
  if (response.ok){
    window.location.replace(siteURL);
    // or window.href = siteURL;
  }
});
