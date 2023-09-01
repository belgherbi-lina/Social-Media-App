const createPost = document.querySelector('#createPost');
const popupNew = document.querySelector('#popup-new');
const cancel = document.querySelector('#cancel');
const submit = document.querySelector('#submit');
let popupNewStatus = false;



createPost.addEventListener('click', () => {
    if (popupNewStatus) {
        popupNew.style.display = 'none';
    } else {
        popupNew.style.display = 'block';
    }
    popupNewStatus = !popupNewStatus;
});

cancel.addEventListener('click', () => {
    popupNew.style.display = 'none';
    popupNewStatus = !popupNewStatus;
});
