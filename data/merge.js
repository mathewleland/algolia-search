const fs = require('fs');
const list = require('./restaurants_list');
const info = require('./restaurantInfo');

let final = [];

list.forEach(function(rest1) {
  let completeInfo = Object.assign({}, rest1);
  
  info.forEach(function(rest2) {
    if (rest2["objectID"] === rest1["objectID"]) {
      Object.assign(completeInfo, rest2);
      return;
    }
  });

  final.push(completeInfo);
});

let obj = JSON.stringify(final, null, 2);
// console.log(final[0]);

fs.writeFile('./data/finalData.json', obj, (err) => {console.log(err)});
