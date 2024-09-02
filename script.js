var mainurl = 'http://localhost:3000/api/';
async function fetchAndCreateBlogs(page = 1) {
    try {
        const response = await fetch(`${mainurl}latest-blogs?page=${page}`);
        const blogs = await response.json();
        const allBlogSection = document.querySelector('.all-blog');

        var index = 0;

        blogs.forEach(blog => {
            if(blog.visibility == 'true') {
                
            if(index == 0 && page == 1 ) {
                document.getElementById('hero-blog-title').textContent = blog.title;
                document.getElementById('hero-blog-date').textContent = formatDate(blog.createdat);
                document.getElementById('hero-blog-para').innerHTML = blog.content;
                document.getElementById('hero-blog-category').textContent = blog.category;
                document.getElementById('rightie').style.backgroundImage = `url(${blog.image})`;
                document.getElementById('rightie').addEventListener('click', () => {
                    window.location.href = `/cultureblogs/magazine.html?blogid=${blog.id}`;
                });
            }

            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';

            blogCard.innerHTML = `
                <div id="blog-card-image" style="background-image: url(${blog.image});"></div>
                <div class="category-tag">
                    <span id="category">${blog.category}</span>
                </div>
                <p id="blog-card-title">${blog.title}</p>
                <div class="lower-part-card">
                    <p id="blog-card-date">${formatDate(blog.createdat)}</p>
                </div>
            `;
            
            
            blogCard.addEventListener('click', () => {
                window.location.href = `/cultureblogs/magazine.html?blogid=${blog.id}`;
            });
            
            allBlogSection.appendChild(blogCard);
            index = index + 1;
            }
        });

        // If less than 6 blogs were returned, hide the "See More" button
        if (blogs.length < 6) {
            const seeMoreButton = document.getElementById('see-more-button');
            if (seeMoreButton) {
                seeMoreButton.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
}

async function fetchAndDisplayTopBlogs() {
    try {
        const response = await fetch(mainurl + 'top-blogs');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blogs = await response.json();

        const topPartExplore = document.querySelector('.top-part-explore');
        topPartExplore.innerHTML = '';



        blogs.forEach((blog, index) => {
            if(blog.visibility == 'true') {
                
            const exploreCard = document.createElement('div');
            exploreCard.className = 'explore-card';

            exploreCard.innerHTML = `
                <section class="left">
                    <!-- You can add an image here if available in your API response -->
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
            
            }
        });

    } catch (error) {
        console.error('Error fetching top blogs:', error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}


fetchAndCreateBlogs();
fetchAndDisplayTopBlogs();

const seeMoreButton = document.getElementById('see-more-button');
let currentPage = 1;

if (seeMoreButton) {
    seeMoreButton.addEventListener('click', () => {
        currentPage++;
        fetchAndCreateBlogs(currentPage);
    });
}