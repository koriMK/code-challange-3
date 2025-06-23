const API_URL = 'http://localhost:3001/posts';
const postList = document.getElementById('post-list');
const postDetail = document.getElementById('post-detail');
const newPostForm = document.getElementById('new-post-form');
const editPostForm = document.getElementById('edit-post-form');
const cancelAddBtn = document.getElementById('cancel-add');
const cancelEditBtn = document.getElementById('cancel-edit');
const newPostFormContainer = document.getElementById('new-post-form-container');
const editPostFormContainer = document.getElementById('edit-post-form-container');
const postCountElement = document.getElementById('post-count');

let currentPostId = null;
let posts = [];
document.addEventListener('DOMContentLoaded', () => {
    displayPosts();
    setupEventListeners();
});

async function displayPosts() {
    try {
        const response = await fetch(API_URL);
        posts = await response.json();
        

        postCountElement.textContent = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;
        
        renderPostList(posts);
        if (posts.length > 0) {
            handlePostClick(posts[0]);
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}
function renderPostList(posts) {
    postList.innerHTML = '';

    if (posts.length === 0) {
        showEmptyState();
        return;
    }
    posts.forEach(post => {
        const postItem = document.createElement('div');
        postItem.className = 'post-item';
        if (currentPostId === post.id) {
            postItem.classList.add('active');
        }
        
        postItem.innerHTML = `
            <h3>${post.title}</h3>
            <div class="post-meta">
                <div class="author"><i class="fas fa-user"></i> ${post.author}</div>
                <div class="date"><i class="fas fa-calendar"></i> ${post.date}</div>
            </div>
        `;
        
        postItem.addEventListener('click', () => handlePostClick(post));
        postList.appendChild(postItem);
    });
}
function handlePostClick(post) {
    currentPostId = post.id;
    
    postDetail.innerHTML = `
        <div class="post-detail">
            <h2>${post.title}</h2>
            <div class="post-detail-meta">
                <div class="author"><i class="fas fa-user"></i> ${post.author}</div>
                <div class="date"><i class="fas fa-calendar"></i> ${post.date}</div>
            </div>
            ${post.image ? `<img src="${post.image}" alt="${post.title}">` : ''}
            <div class="post-content">
                <p>${post.content}</p>
            </div>
            <div class="post-actions">
                <button id="edit-btn" class="btn btn-warning"><i class="fas fa-edit"></i> Edit</button>
                <button id="delete-btn" class="btn btn-danger"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `;
    
    document.getElementById('edit-btn').addEventListener('click', () => showEditForm(post));
    document.getElementById('delete-btn').addEventListener('click', () => deletePost(post.id));
    
    renderPostList(posts);
}
function showEmptyState() {
    postList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-file-alt"></i>
            <h3>No Posts Found</h3>
            <p>Create your first post to get started</p>
        </div>
    `;
    
    postDetail.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-file-alt"></i>
            <h3>No Post Selected</h3>
            <p>Select a post from the list to view its content</p>
        </div>
    `;
}
function setupEventListeners() {
    newPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newPost = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            image: document.getElementById('image').value,
            content: document.getElementById('content').value,
            date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        };
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPost)
            });
            
            const createdPost = await response.json();
            newPostForm.reset();
            displayPosts().then(() => handlePostClick(createdPost));
        } catch (error) {
            console.error('Error creating post:', error);
        }
    });
    editPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const updatedPost = {
            title: document.getElementById('edit-title').value,
            content: document.getElementById('edit-content').value
        };
        
        const postId = document.getElementById('edit-id').value;
        
        try {
            const response = await fetch(`${API_URL}/${postId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedPost)
            });
            
            const updated = await response.json();
            editPostFormContainer.classList.add('hidden');
            displayPosts().then(() => handlePostClick(updated));
        } catch (error) {
            console.error('Error updating post:', error);
        }
    });
    cancelAddBtn.addEventListener('click', () => newPostForm.reset());
    cancelEditBtn.addEventListener('click', () => {
        editPostFormContainer.classList.add('hidden');
    });

    function showEditForm(post) {
        document.getElementById('edit-id').value = post.id;
        document.getElementById('edit-title').value = post.title;
        document.getElementById('edit-content').value = post.content;
        editPostFormContainer.classList.remove('hidden');
    }
}

async function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        try {
            await fetch(`${API_URL}/${postId}`, { method: 'DELETE' });
            displayPosts();
            showEmptyState();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    }
}