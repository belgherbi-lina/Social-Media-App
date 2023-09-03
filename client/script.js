const createPost = document.querySelector('#createPost');
const popupNew = document.querySelector('#popupnew');
const cancel = document.querySelector('#cancel');
const submit = document.querySelector('#submit');
const imag = document.querySelector('#post');
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

function createCommentElement(usernamecomment, commentText) {
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comment');
  commentDiv.innerHTML = `
      <strong>${usernamecomment}:</strong> ${commentText}
  `;
  return commentDiv;
}

const CreatePOST = (id, usernamepost, image, description, ispost) => {
    const post = document.createElement('div');
    post.classList.add('post');
    post.id = id; 
    post.innerHTML = `
        <div class="head">
            <h1>${usernamepost}</h1>
            <button id="update">Update</button>
            <button id="delete">Delete</button>
        </div>
        <img src="${image}" alt="image">
        <p>${description}</p>
        <div class="react">
            <button>Like</button>
            <div id="comment-div">
            <input class="comment-input" type="text" placeholder="Add a comment">
            <button id="comment-button">Add</button>
            </div>
        </div>
        <div class="comments-section"></div>`;
    
    // Update Button
    const updateButton = post.querySelector('#update');
    updateButton.addEventListener('click', () => {
        const UpdatedUsername = prompt('Enter the updated username:', usernamepost);
        const UpdatedImage = prompt('Enter the updated image URL:', image);
        const UpdatedDescription = prompt('Enter the updated description:', description);

        if (UpdatedUsername !== null && UpdatedImage !== null && UpdatedDescription !== null) {
            // Send a PUT request to update the post
            usernamepost = UpdatedUsername ;
            image = UpdatedImage ;
            description = UpdatedDescription ;
            updatePost(id, usernamepost, image, description);
        }
    });
    // Delete button
    const deleteButton = post.querySelector('#delete');
    deleteButton.addEventListener('click', async () => {
      // Send a DELETE request to your backend to delete the post by ID
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          // Post successfully deleted, update your UI as needed
          console.log(`Post with ID ${id} deleted successfully`);
          post.remove(); // Remove the deleted post from the UI
        } else {
          console.error('Failed to delete the post');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    });
    if (ispost) {
      post.addEventListener('click', async (e) => {
        await fetch('http://localhost:3000/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        });
        
      });
    }
  
    return post;
  };
    
  async function updatePost(postId, usernamepost, image, description) {
    try {
        const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usernamepost,
                image,
                description,
            }),
        });

        if (response.ok) {
            // Post updated successfully, you can update your UI as needed
            console.log(`Post with ID ${postId} updated successfully`);
        } else {
            // Handle the case where the update failed, e.g., display an error message
            console.error('Failed to update the post');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

(
    async function () {
        try {
            const UNdata = await fetch('http://localhost:3000/api/posts');
            user = await UNdata.json();

            user.data.forEach((task) => {
                imag.append(CreatePOST(task.id, task.usernamepost, task.image , task.description ,true));
                
            });
            
        } catch (err) {
            console.error(err.message);
        }
    }
)(user,CreatePOST);

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

