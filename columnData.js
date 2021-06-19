// data for columns

// description object for text-like fields
let fields = [
  { name: 'name',   type: 'text' },
  { name: 'reps',   type: 'number' },
  { name: 'weight', type: 'number' }, 
  { name: 'date',   type: 'date' }
];

// date formatter helper for processEntries
function formatDate(sqlDate) {
  let date = new Date(sqlDate);
  return `${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}`;
};

// convert entries from database format to table string format
function processEntries(entries){
  return entries.map(e => {
    e.unit = (e.lbs)? 'lbs': 'kg';
    e.date = formatDate(e.date);
    return e;
  });
}

// empty entry
let empty = {
  'id': -1,
  'name': '',
  'reps': '',
  'weight': '',
  'date': '',
  'lbs': true
};

// after processing with processEntries, 
// convert date into format that the date input elements like
function textDateToFormDate(entry){
  let [month, day, year] = entry.date.split('-');
  if (month.length === 1){
    month = '0' + month;
  }
  if (day.length === 1){
    day = '0' + day;
  }
  if (year.length > 4){
    year = year.substr(0, 4);
  }
  while (year.length < 4){
    year = '0' + year;
  }
  entry.date = `${year}-${month}-${day}`;
  return entry;
}

// example entries
let entries = [
  {
    'id': 1234,
    'name': 'bob',
    'reps': 2,
    'weight': 3,
    'date': '2021-05-15',
    'lbs': false
  },
  {
    'id': 5678,
    'name': 'ben',
    'reps': 4,
    'weight': 6,
    'date': '2021-05-14',
    'lbs': true
  }
].map(e => {
  e.unit = (e.lbs)? 'lbs': 'kg';
  return e;
});

module.exports = {
  fields: fields,
  empty: empty,
  processEntries: processEntries,
  textDateToFormDate: textDateToFormDate
};
