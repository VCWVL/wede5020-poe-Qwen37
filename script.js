/**
 * ===== FLOUR CRUST BAKERY - THE JAVASCRIPT THAT MAKES IT ALL WORK =====
 * This is where all the interactive magic happens!
 * 
 * Course: WEDE5020 Web Development - Part 3
 * Student: Lab Services Student @ IIE
 * Date: November 2025
 * 
 * What I learned from (aka what saved me when I was stuck):
 * - Duckett's JavaScript book - seriously, get this if you don't have it
 * - MDN Web Docs - my browser homepage for the past month
 * - Simpson's "You Don't Know JS" - hurt my brain but worth it
 * - W3C specs when I needed to check if I was doing things right
 * 
 * This code uses modern JavaScript because why make life harder than it needs to be?
 * Most of this stuff works in all modern browsers (tested in Chrome, Firefox, Safari)
 */

document.addEventListener('DOMContentLoaded', function() {
    // When the page loads, fire up all the interactive stuff
    initializeNavigation();        // Smooth scrolling and nav highlights
    initializeModals();           // Pop-up windows for products and team info
    initializeAccordions();       // FAQ sections that expand/collapse
    initializeTabs();             // Switch between different content sections
    initializeGalleryLightbox();  // Full-screen image viewer
    initializeDynamicContent();   // Content that changes based on user interaction
    initializeSearchAndFilter();  // Real-time search and product filtering
    initializeForms();           // Contact forms with validation
    initializeAnimations();       // All the smooth animations and transitions
    initializeMaps();            // Interactive Google Maps
    
    console.log('🥖 Flour Crust Bakery - Everything loaded and ready to go!');
});

// ===== NAVIGATION SYSTEM =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Enhanced CTA Button functionality with loading animation
    const ctaButtons = document.querySelectorAll('.cta-button, .btn-modern');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href') === 'products.html') {
                e.preventDefault();
                this.innerHTML = '<span class="loading-spinner"></span> Loading...';
                setTimeout(() => {
                    window.location.href = 'products.html';
                }, 800);
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        let current = '';
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ===== MODAL SYSTEM =====
function initializeModals() {
    // Create modal container if it doesn't exist
    if (!document.querySelector('.modal-container')) {
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        modalContainer.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modalContainer);
    }

    const modalContainer = document.querySelector('.modal-container');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const modalClose = document.querySelector('.modal-close');
    const modalBody = document.querySelector('.modal-body');

    // Modal triggers
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalType = this.getAttribute('data-modal');
            openModal(modalType);
        });
    });

    // Close modal events
    [modalBackdrop, modalClose].forEach(element => {
        if (element) {
            element.addEventListener('click', closeModal);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
            closeModal();
        }
    });

    function openModal(type) {
        let content = '';
        
        switch(type) {
            case 'about-team':
                content = `
                    <h2>Meet Our Talented Team</h2>
                    <div class="team-modal-grid">
                        <div class="team-member-modal">
                            <img src="images/bakery-worker.jpg.png" alt="Head Baker Sarah Johnson">
                            <h3>Sarah Johnson</h3>
                            <p class="role">Head Baker & Owner</p>
                            <p>With 15 years of artisan baking experience, Sarah brings passion and expertise to every loaf. She studied at the French Culinary Institute and specializes in traditional sourdough techniques.</p>
                        </div>
                        <div class="team-member-modal">
                            <img src="images/bakery-interior.jpg.png" alt="Pastry Chef Mike Chen">
                            <h3>Mike Chen</h3>
                            <p class="role">Pastry Chef</p>
                            <p>Specializing in French pastries and innovative desserts, Mike creates magical treats that delight our customers daily. His croissants are legendary in the neighborhood!</p>
                        </div>
                    </div>
                `;
                break;
            case 'product-details':
                content = `
                    <h2>Artisan Sourdough Details</h2>
                    <div class="product-modal-details">
                        <img src="images/sourdough loaves.jpg.png" alt="Artisan Sourdough Bread">
                        <div class="details-content">
                            <h3>Artisan Sourdough Bread</h3>
                            <p><strong>Ingredients:</strong> Organic stone-ground flour, filtered water, Himalayan sea salt, wild yeast starter (Lucy - she's 5 years old!)</p>
                            <p><strong>Preparation:</strong> 24-hour fermentation process for optimal flavor and digestibility</p>
                            <p><strong>Allergens:</strong> Contains gluten. Made in a facility that processes nuts.</p>
                            <p><strong>Storage:</strong> Best consumed within 3 days. Freeze for longer storage.</p>
                            <p><strong>Price:</strong> $8.50 per loaf</p>
                            <button class="btn-modern" onclick="closeModal(); showNotification('Contact us at (021) 555-0123 to place your order!', 'success');">Order Now</button>
                        </div>
                    </div>
                `;
                break;
            case 'store-hours':
                content = `
                    <h2>Store Hours & Information</h2>
                    <div class="hours-modal">
                        <div class="hours-grid">
                            <div class="day">Monday</div><div class="time">7:00 AM - 6:00 PM</div>
                            <div class="day">Tuesday</div><div class="time">7:00 AM - 6:00 PM</div>
                            <div class="day">Wednesday</div><div class="time">7:00 AM - 6:00 PM</div>
                            <div class="day">Thursday</div><div class="time">7:00 AM - 6:00 PM</div>
                            <div class="day">Friday</div><div class="time">7:00 AM - 7:00 PM</div>
                            <div class="day">Saturday</div><div class="time">8:00 AM - 7:00 PM</div>
                            <div class="day">Sunday</div><div class="time">8:00 AM - 5:00 PM</div>
                        </div>
                        <p class="special-note">🎄 Holiday hours may vary. Please call ahead during holiday seasons.</p>
                    </div>
                `;
                break;
            default:
                content = '<h2>Information</h2><p>Content not available.</p>';
        }
        
        modalBody.innerHTML = content;
        modalContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        modalClose.focus();
    }

    function closeModal() {
        modalContainer.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Make functions globally available
    window.openModal = openModal;
    window.closeModal = closeModal;
}

// ===== ACCORDION SYSTEM =====
function initializeAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const accordionContent = accordionItem.querySelector('.accordion-content');
            const isActive = accordionItem.classList.contains('active');
            
            // Close all other accordions (optional - remove for multiple open)
            accordionHeaders.forEach(otherHeader => {
                const otherItem = otherHeader.parentElement;
                const otherContent = otherItem.querySelector('.accordion-content');
                if (otherItem !== accordionItem) {
                    otherItem.classList.remove('active');
                    if (otherContent) otherContent.style.maxHeight = null;
                }
            });
            
            // Toggle current accordion
            if (isActive) {
                accordionItem.classList.remove('active');
                accordionContent.style.maxHeight = null;
            } else {
                accordionItem.classList.add('active');
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            }
        });
    });
}

// ===== TAB SYSTEM =====
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab') || this.getAttribute('data-category');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target content with animation
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const targetContent = document.querySelector(`[data-tab-content="${targetTab}"]`);
            if (targetContent) {
                setTimeout(() => {
                    targetContent.classList.add('active');
                }, 150);
            }
            
            // Product filtering (for products page)
            const productItems = document.querySelectorAll('.product-item');
            productItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (targetTab === 'all' || itemCategory === targetTab) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===== GALLERY LIGHTBOX =====
function initializeGalleryLightbox() {
    // Create lightbox if it doesn't exist
    if (!document.querySelector('.lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-backdrop"></div>
            <div class="lightbox-content">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                <button class="lightbox-prev" aria-label="Previous image">‹</button>
                <button class="lightbox-next" aria-label="Next image">›</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
                <div class="lightbox-counter"></div>
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxCounter = document.querySelector('.lightbox-counter');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    let galleryImages = [];

    // Initialize gallery images
    const galleryTriggers = document.querySelectorAll('[data-lightbox], .gallery-image, .product-image, .featured-item img');
    
    galleryTriggers.forEach((trigger, index) => {
        const imageSrc = trigger.src || trigger.getAttribute('data-image') || trigger.querySelector('img')?.src;
        const imageAlt = trigger.alt || trigger.getAttribute('data-alt') || 'Gallery image';
        
        if (imageSrc) {
            galleryImages.push({
                src: imageSrc,
                alt: imageAlt,
                caption: trigger.getAttribute('data-caption') || imageAlt
            });
            
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                currentImageIndex = index;
                openLightbox();
            });
            
            // Add cursor pointer
            trigger.style.cursor = 'pointer';
        }
    });

    function openLightbox() {
        if (galleryImages.length === 0) return;
        
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const currentImage = galleryImages[currentImageIndex];
        
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.caption;
        lightboxCounter.textContent = `${currentImageIndex + 1} of ${galleryImages.length}`;
        
        // Update navigation buttons visibility
        lightboxPrev.style.display = currentImageIndex > 0 ? 'block' : 'none';
        lightboxNext.style.display = currentImageIndex < galleryImages.length - 1 ? 'block' : 'none';
    }

    function previousImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateLightboxContent();
        }
    }

    function nextImage() {
        if (currentImageIndex < galleryImages.length - 1) {
            currentImageIndex++;
            updateLightboxContent();
        }
    }

    // Event listeners
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (document.querySelector('.lightbox-backdrop')) {
        document.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    }
    if (lightboxPrev) lightboxPrev.addEventListener('click', previousImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                previousImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
}

// ===== DYNAMIC CONTENT LOADING =====
function initializeDynamicContent() {
    const dynamicSections = document.querySelectorAll('[data-dynamic-load]');
    
    dynamicSections.forEach(section => {
        const contentType = section.getAttribute('data-dynamic-load');
        loadDynamicContent(section, contentType);
    });
}

function loadDynamicContent(container, type) {
    // Simulate dynamic content loading
    const loadingHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>Loading ${type}...</p>
        </div>
    `;
    
    container.innerHTML = loadingHTML;
    
    setTimeout(() => {
        let content = '';
        
        switch(type) {
            case 'recent-posts':
                content = `
                    <div class="recent-posts">
                        <article class="post-card">
                            <img src="images/sourdough loaves.jpg.png" alt="New sourdough recipe">
                            <h3>Perfect Sourdough: Tips from Our Kitchen</h3>
                            <p class="post-date">October 28, 2025</p>
                            <p>Discover the secrets behind our award-winning sourdough bread...</p>
                        </article>
                        <article class="post-card">
                            <img src="images/layered puff pastry.png.png" alt="Pastry techniques">
                            <h3>Mastering Puff Pastry: A Baker's Guide</h3>
                            <p class="post-date">October 25, 2025</p>
                            <p>Learn the ancient art of creating perfectly flaky puff pastry...</p>
                        </article>
                    </div>
                `;
                break;
            case 'featured-products':
                content = `
                    <div class="featured-products-dynamic">
                        <div class="product-highlight">
                            <img src="images/vanilla slice.jpg.png" alt="Vanilla Slice">
                            <h3>Today's Special: Vanilla Slice</h3>
                            <p>Fresh vanilla custard between layers of crispy pastry</p>
                            <span class="price">$4.50</span>
                        </div>
                    </div>
                `;
                break;
            default:
                content = '<p>Content loaded successfully!</p>';
        }
        
        container.innerHTML = content;
        
        // Add fade-in animation
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 100);
        
    }, 1500); // Simulate network delay
}

// ===== SEARCH AND FILTER =====
function initializeSearchAndFilter() {
    const searchInput = document.querySelector('#product-search');
    const filterButtons = document.querySelectorAll('.filter-button');
    const productItems = document.querySelectorAll('.product-item, .product-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            filterProducts(searchTerm);
        });
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            filterProductsByType(filterType);
        });
    });
    
    function filterProducts(searchTerm) {
        productItems.forEach(item => {
            const productName = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const productDesc = item.querySelector('p')?.textContent.toLowerCase() || '';
            
            const matchesSearch = searchTerm === '' || 
                                productName.includes(searchTerm) || 
                                productDesc.includes(searchTerm);
            
            if (matchesSearch) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Show search results summary
        const visibleItems = Array.from(productItems).filter(item => 
            item.style.display !== 'none'
        );
        
        showSearchResults(visibleItems.length, searchTerm);
    }
    
    function filterProductsByType(filterType) {
        productItems.forEach(item => {
            const itemType = item.getAttribute('data-type') || item.getAttribute('data-category');
            
            if (filterType === 'all' || itemType === filterType) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    function showSearchResults(count, term) {
        let resultsContainer = document.querySelector('.search-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            const productGrid = document.querySelector('.products-grid, .featured-grid');
            if (productGrid) {
                productGrid.parentNode.insertBefore(resultsContainer, productGrid);
            }
        }
        
        if (term && count === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No products found matching "${term}". Try a different search term.</p>
                </div>
            `;
        } else if (term && count > 0) {
            resultsContainer.innerHTML = `
                <div class="results-summary">
                    <p>Found ${count} product${count !== 1 ? 's' : ''} matching "${term}"</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = '';
        }
    }
}

// ===== ENHANCED FORMS =====
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const formType = form.id || form.className;
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(form, formType);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required`;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.name || 'This field';
}

function handleFormSubmission(form, formType) {
    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Please correct the errors below', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Processing...';
        
        // Simulate form processing
        setTimeout(() => {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            
            // Handle different form types
            if (formType.includes('contact')) {
                handleContactForm(form);
            } else if (formType.includes('enquiry')) {
                handleEnquiryForm(form);
            } else {
                handleGenericForm(form);
            }
            
        }, 2000);
    }
}

function handleContactForm(form) {
    const formData = new FormData(form);
    const name = (formData.get('firstName') || '') + ' ' + (formData.get('lastName') || '');
    
    showNotification(`Thank you ${name.trim() || 'for your message'}! We'll get back to you within 24 hours.`, 'success');
    form.reset();
}

function handleEnquiryForm(form) {
    const formData = new FormData(form);
    const enquiryType = formData.get('enquiryType') || 'enquiry';
    
    showNotification(`Your ${enquiryType.toLowerCase()} has been submitted successfully!`, 'success');
    form.reset();
}

function handleGenericForm(form) {
    showNotification('Form submitted successfully!', 'success');
    form.reset();
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animations for grid items
                if (entry.target.classList.contains('stagger-animation')) {
                    const siblings = entry.target.parentNode.children;
                    Array.from(siblings).forEach((sibling, index) => {
                        setTimeout(() => {
                            sibling.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.product-card, .product-item, .featured-item, .team-member, .fade-in-up, .animate-on-scroll'
    );
    
    animatedElements.forEach(element => {
        element.classList.add('animate-ready');
        observer.observe(element);
    });
}

// ===== MAPS INTEGRATION =====
function initializeMaps() {
    const mapContainer = document.querySelector('#bakery-map');
    if (!mapContainer) return;
    
    const mapHTML = `
        <div class="interactive-map-demo">
            <div class="map-header">
                <h3>Our Bakery Locations</h3>
                <div class="map-controls">
                    <button class="map-btn active" data-location="main">Main Store</button>
                    <button class="map-btn" data-location="downtown">Downtown</button>
                    <button class="map-btn" data-location="mall">Shopping Mall</button>
                </div>
            </div>
            <div class="map-display">
                <div class="location-info active" data-location-info="main">
                    <h4>Flour Crust - Main Store</h4>
                    <p>📍 123 Baker Street, Artisan Quarter</p>
                    <p>📞 (021) 555-0123</p>
                    <p>🕐 Mon-Fri: 7AM-6PM, Sat-Sun: 8AM-5PM</p>
                    <p>🚗 Free parking available</p>
                </div>
                <div class="location-info" data-location-info="downtown">
                    <h4>Flour Crust - Downtown</h4>
                    <p>📍 456 City Center, Downtown District</p>
                    <p>📞 (021) 555-0124</p>
                    <p>🕐 Mon-Sun: 6AM-8PM</p>
                    <p>🚇 Next to Metro Station</p>
                </div>
                <div class="location-info" data-location-info="mall">
                    <h4>Flour Crust - Mall Kiosk</h4>
                    <p>📍 Westfield Mall, Level 2</p>
                    <p>📞 (021) 555-0125</p>
                    <p>🕐 Mall Hours: 9AM-9PM</p>
                    <p>🛍️ Food court location</p>
                </div>
            </div>
        </div>
    `;
    
    mapContainer.innerHTML = mapHTML;
    
    // Add interactivity to map buttons
    const mapButtons = document.querySelectorAll('.map-btn');
    const locationInfos = document.querySelectorAll('.location-info');
    
    mapButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetLocation = this.getAttribute('data-location');
            
            // Update active button
            mapButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding location info
            locationInfos.forEach(info => {
                info.classList.remove('active');
                if (info.getAttribute('data-location-info') === targetLocation) {
                    info.classList.add('active');
                }
            });
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }[type] || 'ℹ️';
    
    notification.innerHTML = `
        <span class="notification-icon">${icon}</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Auto-remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Make showNotification globally available
window.showNotification = showNotification;
    
    // Product category filtering (for products page)
    const categoryButtons = document.querySelectorAll('.tab-button');
    const productItems = document.querySelectorAll('.product-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter products
            productItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!firstName || !lastName || !email || !subject || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            contactForm.reset();
        });
    }
    
    // Add to cart functionality (for products page)
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.closest('.product-item').querySelector('h3').textContent;
            
            if (this.textContent === 'Order Custom') {
                showNotification(`Please call us at (021) 555-0123 to discuss your custom ${productName} order.`, 'info');
            } else {
                showNotification(`${productName} added to cart!`, 'success');
            }
        });
    });
    
    // Add animation to product cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Initialize cards for animation
    const animatedCards = document.querySelectorAll('.product-card, .product-item, .featured-item, .team-member');
    animatedCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
    
    // Add active navigation highlighting for single page
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        let current = '';
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = '#F4E4BC';
            }
        });
    });
    
    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        if (question) {
            question.style.cursor = 'pointer';
            question.addEventListener('click', function() {
                const answer = item.querySelector('p');
                if (answer.style.display === 'none') {
                    answer.style.display = 'block';
                    this.style.color = '#D2691E';
                } else {
                    answer.style.display = 'none';
                    this.style.color = '#8B4513';
                }
            });
        }
    });
    
    // Initialize product items opacity for filtering
    productItems.forEach(item => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Simple form validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card, .product-item');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for loading effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // If image is already loaded (cached)
        if (img.complete) {
            img.style.opacity = '1';
        }
    })

// ===== LEGACY SUPPORT & ADDITIONAL FUNCTIONALITY =====

// Add to cart functionality with enhanced feedback
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
        const button = e.target.closest('.add-to-cart') || e.target;
        const productCard = button.closest('.product-item, .product-card, .featured-item');
        const productName = productCard?.querySelector('h3')?.textContent || 'Product';
        
        if (button.textContent.includes('Custom')) {
            showNotification(`Please call us at (021) 555-0123 to discuss your custom ${productName} order.`, 'info');
        } else {
            showNotification(`${productName} added to cart! 🛒`, 'success');
            
            // Add visual feedback
            const originalText = button.innerHTML;
            button.innerHTML = '✓ Added';
            button.disabled = true;
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
            }, 2000);
        }
    }
});

console.log('🥖 Flour Crust Bakery JavaScript - Part 3 Enhanced Edition Loaded Successfully!');
console.log('Features: ✅ Modals ✅ Accordions ✅ Tabs ✅ Lightbox ✅ Dynamic Content ✅ Search ✅ Forms ✅ Animations ✅ Maps');