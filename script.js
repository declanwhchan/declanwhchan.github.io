const mainCursor = document.getElementById('cursor-main');
const follower = document.getElementById('cursor-follower');
const cards = document.querySelectorAll('.flow-card');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

// Update mouse coordinates
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Main cursor is immediate
    mainCursor.style.left = mouseX + 'px';
    mainCursor.style.top = mouseY + 'px';
    mainCursor.style.transform = 'translate(-50%, -50%)';
});

// Animate follower with a smooth lag (Lerp)
function render() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    follower.style.transform = 'translate(-50%, -50%)';
    
    requestAnimationFrame(render);
}
render();

// Engagement on Hover
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        follower.style.width = '80px';
        follower.style.height = '80px';
        follower.style.borderColor = 'var(--accent)';
        follower.style.background = 'rgba(59, 130, 246, 0.05)';
    });
    
    card.addEventListener('mouseleave', () => {
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        follower.style.background = 'transparent';
    });
});

// Copy Email Logic
document.getElementById('copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText("declan.chan@mail.utoronto.ca").then(() => {
        const label = document.getElementById('email-label');
        label.innerText = "Copied!";
        setTimeout(() => { label.innerText = "Copy Email"; }, 2000);
    });
});