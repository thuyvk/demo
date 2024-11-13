const video = document.getElementById("video");

const constraints = {
  video: {
    focusMode: "auto",
    width: { ideal: 600 },
    height: { ideal: 355 }
  }
};

// Request access to the camera
navigator.mediaDevices
  //.getUserMedia({ video: true })
  .getUserMedia(constraints)
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    console.error("Error accessing the camera:", error);
    //alert("Error accessing the camera");
  });

const canvas = document.getElementById("canvas");
const captureButton = document.getElementById("capture");
const photo = document.getElementById("photo");

captureButton.addEventListener("click", () => {
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert canvas to image data URL and display it in an <img> element
  photo.src = canvas.toDataURL("image/png");

  //const base64Image = canvas.toDataURL().split(',')[1];

  photo.style.display = "block";
});

//*************************************** */
function RemoveUnuseText(responseText) {
  let arrString = responseText.split("\n");
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

function getIdentityNumber(validArray) {
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

function getFullName(validArray) {
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

function getDateOfBirth(validArray) {
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

function getNationality(validArray) {
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
//*************************************** */

const recognitionTextButton = document.getElementById("RecognitionText");
recognitionTextButton.addEventListener("click", () => {
  const base64Image = canvas.toDataURL().split(',')[1];
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: "TEXT_DETECTION",
          },
        ],
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDw3lCD1ZopT-18Ftcj9Jlv2EIWXFKDyYY",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      try {
        const { textAnnotations } = result.responses[0];
        const { description } = textAnnotations[0];

        let validArray = RemoveUnuseText(description);
        console.log("===>", validArray);
        document.getElementById("No").innerText = getIdentityNumber(validArray);
        document.getElementById("Name").innerText = getFullName(validArray);
        document.getElementById("BirthDate").innerText =
          getDateOfBirth(validArray);
        document.getElementById("Nationality").innerText =
          getNationality(validArray);
      }
      catch {
        alert('Invalid CCCD!');
      }

    })
    .catch((error) => console.error(error));
});
