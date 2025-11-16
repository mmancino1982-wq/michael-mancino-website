// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
```

---

## **NOW - THE IMAGES:**

You need to create a folder called `images` and put two files in it:

1. **Broken_Creed_Cover_HighRes.png** - Your book cover (you already have this)
2. **author-photo.png** - Your headshot (you already have this)

Just rename them to match exactly what I put above.

---

## **FOLDER STRUCTURE:**

Your final folder should look like this:
```
michael-mancino-author-site/
├── index.html
├── about.html
├── book.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/
    ├── Broken_Creed_Cover_HighRes.png
    └── author-photo.png