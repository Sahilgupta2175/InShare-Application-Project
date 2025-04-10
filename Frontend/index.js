const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#file-input');
const browseBtn = document.querySelector('.browse-btn');
const progressContainer = document.querySelector('.progress-container');
const bgProgress = document.querySelector('.bg-progress');
const progressBar = document.querySelector('.progress-bar');
const precentDiv = document.querySelector('#percent');
const fileURLInput = document.querySelector('#fileURL');
const sharingContainer = document.querySelector(".sharing-container");
const copyBtn = document.querySelector("#copy-btn");
const emailForm = document.querySelector("#email-form");

const host = "";
const uploadURL = `/api/files`;
const emailURL = `/api/files/send`;

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    if(!dropZone.classList.contains("dragged")) {
        dropZone.classList.add("dragged");
    }
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragged");
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragged");
    const files = event.dataTransfer.files;
    // console.table(files);
    if(files.length) {
        fileInput.files = files;
        uploadFile();
    }
});

fileInput.addEventListener("change", () => {
    uploadFile();
});

browseBtn.addEventListener("click", () => {
    fileInput.click();
});

copyBtn.addEventListener("click", () => {
    fileURLInput.select();
    document.execCommand("copy");
});

function uploadFile() {
    progressContainer.style.display = "block";
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response);
            onUploadSuccess(JSON.parse(xhr.response));
        }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.open("POST", uploadURL);
    xhr.send(formData);
}

const updateProgress = (event) => {
    const percent = Math.round((event.loaded / event.total) * 100); 
    // console.log(percent);
    bgProgress.style.width = `${percent}%`;
    precentDiv.innerText = percent;
    progressBar.style.transform = `scaleX(${percent / 100})`;
}

const onUploadSuccess = ({ file: url }) => {
    console.log(url);
    fileInput.value = "";
    emailForm[2].removeAttribute("disabled");
    progressContainer.style.display = "none";
    sharingContainer.style.display = "block";
    fileURLInput.value = url;
}

emailForm.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("Submit form");
    const url = fileURLInput.value;

    const formData = {
        uuid: url.split("/").slice(-1)[0],
        emailTo: emailForm.elements["to-email"].value,
        emailFrom: emailForm.elements["from-email"].value,
    };
    console.table(formData);

    emailForm[2].setAttribute("disabled", "true");

    fetch(emailURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    }).then((res) => {
        return res.json();
    }).then((success) => {
        // console.log(data);

        if (success) {
            sharingContainer.style.display = "none";
        }
    });
});