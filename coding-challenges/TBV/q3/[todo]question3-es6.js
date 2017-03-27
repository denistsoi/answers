// question 3;

const str0 = '>';
const str1 = '^>v<';
const str2 = '^v^v^v^v^v';
const str3 = 'v<v^v>^v<>>^><v>^<>v^>^<>^v^^^v^^>>vv<<^^><^<vvv>^>^^<^>>^^^^^v^<v>vv<>>v^v';
const str4 = '>v';

function findNumberOfUniqueHouses(string) {
  if (string.length == 1) return 2; // moves once;

  var arr = [];
  // convert string element to cartesian point;
  for(var i=0; i<string.length; i++) {
    if (string[i] == '^') {
      arr.push([1,0]);
    } else if (string[i] == '>') {
      arr.push([0,1]);
    } else if (string[i] == 'v') {
      arr.push([-1,0]);
    } else {
      arr.push([0,-1]);
    }
  }

  countX = 0;
  countY = 0;
  arr2 = []; // stores absolute cordinates;
  arr3 = []; // removes duplates from arr2;

  // determine catesian coordinate from direction
  for(var j=0; j<arr.length; j++) {
    countY = countY + arr[j][0];
    countX = countX + arr[j][1];
    arr2.push([countY,countX].toString());
  }

  // filter out duplicate coordinates
  arr3 = arr2.filter((item, pos) => {
    return arr2.indexOf(item) == pos;
  });

  // determine number of unique locations (also account for point of origin)
  if (arr3.indexOf('0,0') == -1) {
    return arr3.length + 1;
  } else {
    return arr3.length;  
  }

  
}

console.log(findNumberOfUniqueHouses(str0));
console.log(findNumberOfUniqueHouses(str1));
console.log(findNumberOfUniqueHouses(str2));
console.log(findNumberOfUniqueHouses(str3));
console.log(findNumberOfUniqueHouses(str4));

// answer is 41 unique houses with one letter