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