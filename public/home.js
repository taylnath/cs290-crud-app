
const siteURL = 'http://localhost:3000'
const cols = ['name', 'reps', 'weight', 'date'];

// ----------------------------------------------------
// The add button sends a request to create a new entry
// The response will send back new table data
// ----------------------------------------------------

// find the button
let addButton = document.getElementById('updateButton');
addButton.addEventListener('click', async event => {
  console.log('in add'); // debug
  // this needs to be here at the beginning since the listener is async
  event.preventDefault();

  // build the form value JSON -- alternatively use FormData() and multer
  let formVals = {};
  cols.forEach(col => {
    formVals[col] = document.getElementById(col).value;
  });
  formVals['lbs'] = (document.getElementById('lbs').checked)? true: false;

  if (!formVals.name){
    alert('Please enter in a name.');
    return;
  }

  // send the request via POST
  let response = await fetch(siteURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formVals)
  }).catch(err => console.error(err));

  // TODO: send a message (pop-up?) about the response status

  // receive table data and rebuild table
  if (response.ok){
    let text = await response.text().catch(err => console.error(err));
    document.getElementById('table').innerHTML = text;

    console.log(response); // debug

    // erase old form values
    cols.forEach(col => {
      document.getElementById(col).value = '';
    });
    document.getElementById('lbs').checked = true;
    document.getElementById('kg').checked = false;
  };
});

// ----------------------------------------------------
// The delete buttons send a request to delete an entry
// The request will send back new table data
// ----------------------------------------------------

// this function gets assigned to each button via onclick
// in the display.handlebars partial
async function deleteEntry(id){
  console.log('in delete'); // debug

  // send the delete request
  let response = await fetch(siteURL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id: id})
  }).catch(err => console.error(err));

  // TODO: send a message (pop-up?) about the response status

  // receive table data and rebuild table
  if (response.ok){
    let text = await response.text().catch(err => console.error(err));
    document.getElementById('table').innerHTML = text;
    console.log(response); // debug
  };
};

// --------------------------------------------------------------
// Original button handler code -- issue is the new buttons 
// don't get handlers (changed to onclick in handlebars partial)
// --------------------------------------------------------------

// // get the delete buttons
// let deleteButtons = Array.from(
//   document.getElementsByClassName('deleteButton')
// );
// console.log(deleteButtons); // debug
// deleteButtons.forEach(button => {
//   button.addEventListener('click', async event => {
//     console.log('in delete'); // debug
//     // this needs to be here at the beginning since the listener is async
//     event.preventDefault();

//     // send the delete request
//     let response = await fetch(siteURL, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         id: button.getAttribute('data-id')
//       })
//     }).catch(err => console.error(err));

//     // TODO: send a message (pop-up?) about the response status
//     // receive table data and rebuild table
//     if (response.ok){
//       let text = await response.text().catch(err => console.error(err));
//       document.getElementById('table').innerHTML = text;
//       console.log(response);
//     };
//   });
// });

// -----------------------------------------------------------
// -- SAVE -- (make page refresh table after load)
// -----------------------------------------------------------
// window.onload = async () => {
//   let response = await fetch(siteURL + '/table').then(console.log('hello')).catch(err => console.error(err));
//    if (response.ok){
//      let text = await response.text().catch(err => console.error(err));
//      document.getElementById('table').innerHTML = text;
//      console.log(response);
//    } else {
//      console.log("oops");
//    }
//   let deleteButtons = Array.from(
//     document.getElementsByClassName('deleteButton')
//   );
//   console.log(deleteButtons);
//   deleteButtons.forEach(button => {
//     button.addEventListener('click', async event => {
//       console.log('in delete');
//       event.preventDefault();
//       let response = await fetch(siteURL, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           id: button.getAttribute('data-id')
//           // id: button.dataset.id
//         })
//       }).catch(err => console.error(err));
//     });
// });

// };
