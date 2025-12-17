const content = document.getElementById('content');
const popularList = document.getElementById('popular-posts');

const titles = [
    "The Future of AI is Here and It's Laggy",
    "10 Ways to Slow Down Your Workflow",
    "Why 60FPS is Overrated",
    "Exploring the Depths of the DOM",
    "CSS Filters: A Love Story",
    "Javascript: The Good, The Bad, and The Blocking",
    "How to Cook a CPU with One Tab",
    "Memory Leaks for Beginners",
    "The Art of Layout Thrashing",
    "Understanding the Event Loop by Breaking It"
];

const images = [
    'assets/thumb1.png',
    'assets/thumb2.png',
    'assets/thumb3.png'
];

// Function to generate heavy DOM structure
function createPost(id) {
    const article = document.createElement('article');
    article.className = 'post';
    
    // Create a massive nested structure wrapper
    // This is invisible but adds depth to the DOM tree
    let container = article;
    for(let i=0; i<30; i++) {
        const div = document.createElement('div');
        // Add some styles that might trigger recalc
        div.style.display = 'block';
        div.style.position = 'relative';
        container.appendChild(div);
        container = div;
    }

    // Actual Content Structure
    const contentWrapper = document.createElement('div');
    container.appendChild(contentWrapper);

    // Image
    const imgContainer = document.createElement('div');
    imgContainer.className = 'post-image-container';
    const img = document.createElement('img');
    img.src = images[id % images.length];
    img.alt = "Blog Image";
    imgContainer.appendChild(img);
    contentWrapper.appendChild(imgContainer);

    // Text Content
    const textContent = document.createElement('div');
    textContent.className = 'post-content';
    
    const meta = document.createElement('div');
    meta.className = 'post-meta';
    meta.innerHTML = `<span>Dec 14, 2025</span> <span>By <strong>LagMaster</strong></span> <span>${Math.floor(Math.random() * 100)} Comments</span>`;
    textContent.appendChild(meta);

    const title = document.createElement('h2');
    title.textContent = titles[id % titles.length];
    textContent.appendChild(title);

    const p = document.createElement('p');
    p.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ".repeat(5);
    textContent.appendChild(p);

    const btn = document.createElement('button');
    btn.className = 'cta-button';
    btn.style.fontSize = '14px';
    btn.style.padding = '10px 20px';
    btn.textContent = 'Read Article';
    textContent.appendChild(btn);

    contentWrapper.appendChild(textContent);

    // Add invisible heavy elements that animate
    const heavy = document.createElement('div');
    heavy.className = 'heavy-particle';
    heavy.style.width = '50px';
    heavy.style.height = '50px';
    heavy.style.top = '10px';
    heavy.style.right = '10px';
    contentWrapper.appendChild(heavy);

    return article;
}

// Generate 50 posts (reduced from 200 to make it visually manageable but still heavy due to nesting)
// 50 posts * 30 nested divs = 1500 nodes just for structure + content nodes
console.time('DOM Generation');
for (let i = 0; i < 50; i++) { 
    content.appendChild(createPost(i));
    
    // Populate sidebar too
    if (i < 5) {
        const li = document.createElement('li');
        li.style.marginBottom = '15px';
        li.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
        li.style.paddingBottom = '10px';
        li.innerHTML = `<a href="#" style="color:#fff; text-decoration:none; font-weight:bold;">${titles[i]}</a><br><span style="color:#888; font-size:12px;">Trending now</span>`;
        popularList.appendChild(li);
    }
}
console.timeEnd('DOM Generation');

// Layout Thrashing on Scroll - The Silent Killer
window.addEventListener('scroll', () => {
    const posts = document.querySelectorAll('.post');
    
    // Force layout thrashing by interleaving reads and writes
    posts.forEach((post, index) => {
        // READ
        const top = post.getBoundingClientRect().top;
        
        // WRITE (Invalidates layout)
        // Subtle parallax effect that is very expensive
        post.style.transform = `translateY(${top * 0.05}px)`;
        
        // READ again (Forces synchronous layout recalc)
        const height = post.offsetHeight;
        
        // WRITE again
        if (top < window.innerHeight && top + height > 0) {
            post.style.opacity = Math.min(1, (window.innerHeight - top) / 500);
            // Add a text shadow update which is expensive
            post.style.boxShadow = `0 ${Math.abs(top/10)}px 30px rgba(0,0,0,0.5)`;
        }
    });

    // Heavy computation loop to block main thread during scroll
    let result = 0;
    for(let j=0; j<500000; j++) {
        result += Math.sqrt(j) * Math.sin(j);
    }
});

// Mousemove thrashing
window.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero-content');
    if(hero) {
        // 3D tilt effect - expensive
        const x = (window.innerWidth / 2 - e.clientX) / 20;
        const y = (window.innerHeight / 2 - e.clientY) / 20;
        hero.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
    }

    // Create garbage to trigger GC
    const arr = [];
    for(let i=0; i<5000; i++) {
        arr.push({x: e.clientX, y: e.clientY, data: new Array(100).fill('junk')});
    }
});

// Memory Leak
const leaks = [];
setInterval(() => {
    leaks.push(document.createElement('div')); // Detached DOM nodes
    if (leaks.length % 100 === 0) console.log('Leaking nodes...', leaks.length);
}, 1000);

// Cumulative Layout Shift (CLS) Generators
function injectAdBanner() {
    const banner = document.createElement('div');
    banner.className = 'ad-banner';
    banner.innerHTML = '<img src="https://via.placeholder.com/50" alt="Ad"> <span>🔥 HOT DEAL: 90% OFF RAM DOWNLOADS! 🔥</span>';
    
    // Insert at the top of main content to push everything down
    const main = document.querySelector('.main-content');
    if (main) {
        main.insertBefore(banner, main.firstChild);
    }
}

// Inject multiple banners at random times to keep shifting layout
setTimeout(injectAdBanner, 1500); // After initial paint
setTimeout(injectAdBanner, 3000); // When user starts reading
setTimeout(injectAdBanner, 5500); // Just to be annoying

// Inject a banner in the navbar pushes the whole page down
setTimeout(() => {
    const nav = document.querySelector('.navbar');
    const topBanner = document.createElement('div');
    topBanner.style.background = 'red';
    topBanner.style.color = 'white';
    topBanner.style.textAlign = 'center';
    topBanner.style.padding = '10px';
    topBanner.innerText = '⚠️ SYSTEM CRITICAL: UPDATE ADOBE FLASH PLAYER NOW';
    
    // Pushing the whole body down by inserting before navbar
    document.body.insertBefore(topBanner, document.body.firstChild);
    // And shift the navbar down manually because it is fixed
    nav.style.top = '40px'; 
}, 4500);
