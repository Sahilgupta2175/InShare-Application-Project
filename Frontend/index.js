const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#file-input');
const browseBtn = document.querySelector('.browse-btn');

const host = "";
const uploadURL = `/api/files`;

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

const uploadFile = () => {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("myfile", file);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response);
        }
    };

    xhr.upload.onprogress = updateProgress;

    xhr.open("POST", uploadURL);
    xhr.send(formData);
}

const updateProgress = (event) => {
    const percent = Math.round((event.loaded / event.total) * 100); 
    console.log(event);
}