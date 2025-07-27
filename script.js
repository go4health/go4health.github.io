// Go4Health Global - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.custom-navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'contact');
        });
    }

    // Consultation form handling
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'consultation');
        });
    }

    // Form submission handler
    function handleFormSubmission(form, type) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Close modal if it's a consultation form
            if (type === 'consultation') {
                const modal = bootstrap.Modal.getInstance(document.getElementById('consultationModal'));
                if (modal) {
                    modal.hide();
                }
            }
        }, 2000);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : '#3B82F6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            hideNotification(notification);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                hideNotification(notification);
            }
        }, 5000);
    }

    function hideNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    }

    // Consultation modal trigger
    document.querySelectorAll('a[href="#consultation"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = new bootstrap.Modal(document.getElementById('consultationModal'));
            modal.show();
        });
    });

    // Chatbot functionality
    const chatFab = document.getElementById('chatFab');
    const chatbot = document.getElementById('chatbot');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    let chatbotOpen = false;

    // Toggle chatbot
    function toggleChatbot() {
        chatbotOpen = !chatbotOpen;
        if (chatbotOpen) {
            chatbot.style.display = 'flex';
            chatFab.classList.add('hidden');
            chatbotInput.focus();
        } else {
            chatbot.style.display = 'none';
            chatFab.classList.remove('hidden');
        }
    }

    chatFab.addEventListener('click', toggleChatbot);
    chatbotToggle.addEventListener('click', toggleChatbot);

    // Send message
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatbotInput.value = '';

        // Simulate bot response
        setTimeout(() => {
            const response = generateBotResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${currentTime}</div>
        `;

        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Generate bot responses
    function generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! Welcome to Go4Health Global. I'm here to help you with your medical tourism needs. How can I assist you today?";
        }
        
        if (message.includes('price') || message.includes('cost') || message.includes('affordable')) {
            return "Our pricing varies depending on the treatment and destination. We offer transparent pricing and flexible payment options. Would you like to schedule a free consultation to discuss your specific needs?";
        }
        
        if (message.includes('country') || message.includes('destination') || message.includes('where')) {
            return "We operate in Africa, North America, Europe, and the Middle East. Our partner hospitals are located in countries like UK, Germany, USA, Canada, UAE, Jordan, South Africa, and Morocco. Which region interests you most?";
        }
        
        if (message.includes('treatment') || message.includes('surgery') || message.includes('medical')) {
            return "We facilitate various treatments including cardiac care, oncology, orthopedic surgery, cosmetic procedures, fertility treatments, and more. What type of treatment are you considering?";
        }
        
        if (message.includes('consultation') || message.includes('appointment')) {
            return "I'd be happy to help you schedule a free consultation! You can click the 'Free Consultation' button on our website or provide me with your contact details, and our team will reach out to you within 24 hours.";
        }
        
        if (message.includes('insurance') || message.includes('payment')) {
            return "We work with various insurance providers and offer flexible payment plans. Our team can help coordinate with your insurance company and provide detailed cost estimates upfront.";
        }

        if (message.includes('emergency') || message.includes('urgent')) {
            return "For urgent medical needs, please contact our 24/7 emergency hotline at +44 20 7123 4567. Our medical coordinators are available around the clock to assist with emergency cases.";
        }

        if (message.includes('language') || message.includes('translation')) {
            return "We provide professional medical translation and interpretation services in multiple languages. Our multilingual support team ensures clear communication throughout your healthcare journey.";
        }
        
        // Default response
        const defaultResponses = [
            "Thank you for your question! For detailed information about your specific needs, I recommend scheduling a free consultation with our medical coordinators.",
            "That's a great question! Our expert team can provide you with personalized information. Would you like to speak with one of our medical tourism specialists?",
            "I'd be happy to help you with that! For the most accurate information, please contact our support team at info@go4healthglobal.com or use our consultation form.",
            "Our team of medical tourism experts can provide you with detailed information about this. Would you like to schedule a call to discuss your specific requirements?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Counter animation for statistics
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-item h3');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, 40);
        });
    }

    // Trigger counter animation when hero section is visible
    const heroSection = document.querySelector('.hero-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateCounters, 1000);
                observer.unobserve(entry.target);
            }
        });
    });

    if (heroSection) {
        observer.observe(heroSection);
    }

    // Form validation
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });

        // Email validation
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            if (field.value && !isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        });

        // Phone validation
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            if (field.value && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        });

        return isValid;
    }

    function showFieldError(field, message) {
        clearFieldError(field);
        field.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Add form validation to existing forms
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                handleFormSubmission(this, 'contact');
            }
        });
    }

    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                handleFormSubmission(this, 'consultation');
            }
        });
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Service worker registration for PWA (if needed)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Analytics tracking (replace with your analytics code)
    function trackEvent(eventName, eventData = {}) {
        // Google Analytics 4 example
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Alternative analytics platforms can be added here
        console.log('Event tracked:', eventName, eventData);
    }

    // Track important user interactions
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
            trackEvent('cta_click', {
                button_text: btn.textContent.trim(),
                page_location: window.location.href
            });
        });
    });

    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            trackEvent('form_submit', {
                form_type: form.id || 'unknown',
                page_location: window.location.href
            });
        });
    });

    // Performance monitoring
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                trackEvent('page_load_time', {
                    load_time: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                    dom_content_loaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)
                });
            }
        }, 0);
    });

    console.log('Go4Health Global website initialized successfully!');
});

// Additional utility functions
window.Go4Health = {
    // Public API for external integrations
    openConsultationModal: function() {
        const modal = new bootstrap.Modal(document.getElementById('consultationModal'));
        modal.show();
    },
    
    openChatbot: function() {
        const chatbot = document.getElementById('chatbot');
        const chatFab = document.getElementById('chatFab');
        chatbot.style.display = 'flex';
        chatFab.classList.add('hidden');
    },
    
    showNotification: function(message, type = 'info') {
        // This function is already defined above
        showNotification(message, type);
    }
};