const createPost = document.querySelector('#createPost');
const deletePost = document.querySelector('#delete');
const popupNew = document.querySelector('#popupnew');
const cancel = document.querySelector('#cancel');
const submit = document.querySelector('#submit');
const imag = document.querySelector('#imag');
let popupNewStatus = false;

let user = [];

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

const createTicketDom = (id, usernamepost , image , description, ispost ) => {
    const post = document.createElement('div');
    post.classList.add('ticket');
    post.id = id ;
    post.innerHTML = `
            <h1>${usernamepost}</h1>
            <img src="${image}" alt="image">
            <p>${description}</p>
        `;
    if (ispost) {
        post.addEventListener('click', async (e) => {
            await fetch(`http://localhost:3000/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            });

            location.reload();
        });
    }
    return post;
}

(
    async function () {
        try {
            const UNdata = await fetch('http://localhost:3000/api/posts');
            user = await UNdata.json();

            user.data.forEach((task) => {
                imag.append(createTicketDom(task.id, task.usernamepost, task.image , task.description, true));
                
            });
        } catch (err) {
            console.error(err.message);
        }
    }
)(user,createTicketDom);

const submitEvent = async () => {
    const dataname = popupnew.querySelector('#username').value;
    const dataimg = popupnew.querySelector('#img-url').value;
    const datadesc = popupnew.querySelector('#description').value;
    await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usernamepost : dataname , image : dataimg , description : datadesc })
    });

    location.reload();
}

submit.addEventListener('click', async () => {
    await submitEvent();
});