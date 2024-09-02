// Utility function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Get the blogId from the URL
const blogId = getUrlParameter('blogid');
var mainurl = 'http://localhost:3000/api/';
// Format date function
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Fetch and display main blog content
async function fetchBlogContent(id) {
    const apiUrl = `${mainurl}magazinepage/${id}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Blog not found');
        }
        const data = await response.json();
        
        document.getElementById('blog-title').textContent = data.title;
        document.getElementById('blog-content').innerHTML = data.content;
        document.getElementById('blog-date').textContent = formatDate(data.createdat);
        document.getElementById('blog-img-main').style.backgroundImage = `url(${data.image})`;
    } catch (error) {
        console.error('Error fetching blog content:', error);
    }
}

// Fetch and display top blogs
async function fetchAndDisplayTopBlogs() {
    try {
        const response = await fetch(mainurl + 'top-blogs');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blogs = await response.json();

        const topPartExplore = document.querySelector('.top-part-explore');
        topPartExplore.innerHTML = ''; // Clear existing content

        blogs.forEach((blog, index) => {
            const exploreCard = document.createElement('div');
            exploreCard.className = 'explore-card';

            exploreCard.innerHTML = `
                <section class="left">
                    <!-- Image will be set as background -->
                </section>
                <section class="right">
                    <p id="explore-title-${index}" class="explore-title-class">
                        ${blog.title}
                    </p>
                    <p id="explore-date-${index}" class="explore-date-class">
                        <i class="fa-solid fa-calendar-days"></i>
                        ${formatDate(blog.createdat)}
                    </p>
                </section>
            `;

            const leftSection = exploreCard.querySelector('.left');
            if (blog.image) {
                leftSection.style.backgroundImage = `url(${blog.image})`;
                leftSection.style.backgroundSize = 'cover';
                leftSection.style.backgroundPosition = 'center';
            }

            exploreCard.addEventListener('click', () => {
                window.location.href = `/cultureblogs/magazine.html?blogid=${blog.id}`;
            });

            topPartExplore.appendChild(exploreCard);
        });

    } catch (error) {
        console.error('Error fetching top blogs:', error);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchBlogContent(blogId);
    fetchAndDisplayTopBlogs();
});