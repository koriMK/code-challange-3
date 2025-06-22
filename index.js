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

        document.addEventListener('DOMContentLoaded', main);
        
        function main() {
            displayPosts();
            setupEventListeners();
        }
        async function displayPosts() {
            try {
                const response = await fetch(API_URL);
                posts = await response.json();
                 postCountElement.textContent = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;
                  renderPostList(posts);

                if (posts.length > 0) {
                    handlePostClick(posts[0]);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
        function renderPostList(posts) {
            postList.innerHTML = '';
            
            if (posts.length === 0) {
                postList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-file-alt"></i>
                        <h3>No Posts Found</h3>
                        <p>Create your first post to get started</p>
                    </div>
                `;
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