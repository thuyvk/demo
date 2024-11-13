const jsonObject = require("./cc3.json");

function RemoveUnuseText() {
  let arrString = jsonObject.fullTextAnnotation.text.split("\n");
  let newArray = [];
  for (let i = 0; i < arrString.length; i++) {
    if (
      arrString[i].indexOf("CỘNG HÒA XÃ HỘI") === -1 &&
      arrString[i].indexOf("Độc lập") === -1 &&
      arrString[i].indexOf("SOCIALIST REPUBLIC OF") === -1 &&
      arrString[i].indexOf("Independence") === -1 &&
      arrString[i].indexOf("CĂN CƯỚC CÔNG") === -1 &&
      arrString[i].indexOf("Citizen Identity") === -1 &&
      arrString[i].indexOf("Có giá trị") === -1 &&
      arrString[i].indexOf("Date of expiry") === -1 &&
      arrString[i].indexOf("Không thời hạn") === -1
    ) {
      newArray.push(arrString[i]);
    }
  }
  return newArray;
}

let validArray = RemoveUnuseText();

function getIdentityNumber() {
  try {
    let identityText = "";
    for (let i = 0; i < validArray.length; i++) {
      if (validArray[i].indexOf("No.:") !== -1) {
        identityText = validArray[i];
      }
    }
    return identityText.split(":")[1].trim();
  } catch {
    return "";
  }
}

function getFullName() {
  try {
    let fullName = "";
    for (let i = 0; i < validArray.length; i++) {
      if (validArray[i].indexOf("Full name") !== -1) {
        fullName = validArray[i + 1];
      }
    }
    return fullName;
  } catch {
    return "";
  }
}

function getDateOfBirth() {
  try {
    let dateOfBirth = "";
    for (let i = 0; i < validArray.length; i++) {
      if (validArray[i].indexOf("Date of birth") !== -1) {
        dateOfBirth = validArray[i];
      }
    }
    return dateOfBirth.split(":")[1].trim();
  } catch {
    return "";
  }
}

function getNationality() {
  try {
    let nationality = "";
    for (let i = 0; i < validArray.length; i++) {
      if (validArray[i].indexOf("Nationality") !== -1) {
        nationality = validArray[i];
      }
    }
    return nationality.split(":")[nationality.split(":").length - 1].trim();
  } catch {
    return "";
  }
}

console.log("*************");
console.log("NO: ", getIdentityNumber());
console.log("NAME: ", getFullName());
console.log("DATE: ", getDateOfBirth());
console.log("NATIONALITY: ", getNationality());
console.log("*************");

//console.log(validArray);
