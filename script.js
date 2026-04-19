// ===== BOOT SEQUENCE =====
window.addEventListener('load', () => {
    const bootOverlay = document.getElementById('boot-sequence');
    
    // Hide initial boot overlay
    setTimeout(() => {
        bootOverlay.style.display = 'none';
        startHeroBootSequence();
    }, 4000);
});

// ===== HERO BOOT SEQUENCE =====
function startHeroBootSequence() {
    const bootLines = document.getElementById('boot-lines');
    const heroContent = document.getElementById('hero-content');
    
    const bootMessages = [
        { text: '> Booting learning environment...', delay: 500 },
        { text: '> Loading educational modules... [OK]', delay: 800 },
        { text: '> Initializing practice labs... [OK]', delay: 1200 },
        { text: '> Loading security resources... [OK]', delay: 1600 },
        { text: '> Establishing learning connection... [OK]', delay: 2000 },
        { text: '> Verifying student credentials... [OK]', delay: 2400 },
        { text: '> Authenticating user...', delay: 2800 },
        { text: '> Identity verified: Cybersecurity Enthusiast', delay: 3200, highlight: true },
        { text: '> System ready. Keep learning!', delay: 3600, highlight: true }
    ];
    
    bootMessages.forEach((msg, index) => {
        setTimeout(() => {
            const line = document.createElement('p');
            line.className = 'boot-line';
            if (msg.highlight) {
                line.style.color = 'var(--accent-cyan)';
                line.style.textShadow = '0 0 10px var(--glow-cyan)';
            }
            line.textContent = msg.text;
            bootLines.appendChild(line);
            
            // Type effect
            typeWriter(line, msg.text, 30);
            
            // Show hero content after last message
            if (index === bootMessages.length - 1) {
                setTimeout(() => {
                    bootLines.style.display = 'none';
                    heroContent.style.display = 'block';
                }, 1000);
            }
        }, msg.delay);
    });
}

function typeWriter(element, text, speed) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== SMOOTH SCROLLING =====
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

// ===== SKILL BARS ANIMATION =====
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.bar-fill');
            bars.forEach(bar => {
                const level = bar.getAttribute('data-level');
                bar.style.setProperty('--fill-width', level + '%');
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// ===== NETWORK VISUALIZATION =====
const canvas = document.getElementById('networkCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('skillTooltip');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initializeNodes();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Skill data
    const skills = [
        {
            name: 'Cybersecurity Enthusiast',
            level: 100,
            experience: 'Core Identity',
            tags: ['Learning', 'Growing', 'Passionate'],
            isCenter: true,
            color: '#00d4ff',
            size: 12
        },
        {
            name: 'Web Security',
            level: 65,
            experience: 'Learning | OWASP Top 10',
            tags: ['XSS', 'SQLi', 'CSRF', 'Burp Suite'],
            color: '#00e676',
            size: 8
        },
        {
            name: 'Network Basics',
            level: 55,
            experience: 'Learning | TCP/IP, Wireshark',
            tags: ['Packet Analysis', 'Protocols', 'Nmap'],
            color: '#00e676',
            size: 8
        },
        {
            name: 'Linux & CLI',
            level: 70,
            experience: 'Practicing | Kali Linux',
            tags: ['Bash', 'Command Line', 'Scripting'],
            color: '#00e676',
            size: 8
        },
        {
            name: 'CTF Challenges',
            level: 50,
            experience: 'Active | TryHackMe, HackTheBox',
            tags: ['Problem Solving', 'Practice', 'Learning'],
            color: '#9c27ff',
            size: 8
        },
        {
            name: 'Programming',
            level: 60,
            experience: 'Learning | Python, JavaScript',
            tags: ['Python', 'Automation', 'Web Dev'],
            color: '#9c27ff',
            size: 8
        },
        {
            name: 'Security Tools',
            level: 45,
            experience: 'Exploring | Burp, Metasploit',
            tags: ['Burp Suite', 'Nmap', 'Wireshark'],
            color: '#00e676',
            size: 8
        },
        {
            name: 'Cryptography',
            level: 40,
            experience: 'Studying | Basics',
            tags: ['Encryption', 'Hashing', 'SSL/TLS'],
            color: '#9c27ff',
            size: 8
        },
        {
            name: 'Home Lab',
            level: 55,
            experience: 'Built | VirtualBox Setup',
            tags: ['VMs', 'Practice', 'Testing'],
            color: '#9c27ff',
            size: 8
        }
    ];
    
    let nodes = [];
    let particles = [];
    let hoveredNode = null;
    
    // Node class
    class SkillNode {
        constructor(skill, x, y) {
            this.skill = skill;
            this.x = x;
            this.y = y;
            this.targetX = x;
            this.targetY = y;
            this.vx = 0;
            this.vy = 0;
            this.radius = skill.size;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.connections = [];
        }
        
        update() {
            // Smooth movement towards target
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            this.vx += dx * 0.02;
            this.vy += dy * 0.02;
            this.vx *= 0.9;
            this.vy *= 0.9;
            this.x += this.vx;
            this.y += this.vy;
            
            // Pulse animation
            this.pulsePhase += 0.03;
        }
        
        draw() {
            const pulseSize = Math.sin(this.pulsePhase) * 2;
            const currentRadius = this.radius + pulseSize;
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, currentRadius * 3
            );
            gradient.addColorStop(0, this.skill.color + '40');
            gradient.addColorStop(0.5, this.skill.color + '20');
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, currentRadius * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Main node
            ctx.fillStyle = this.skill.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.skill.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Highlight if hovered
            if (hoveredNode === this) {
                ctx.strokeStyle = this.skill.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, currentRadius + 5, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Label
            ctx.fillStyle = '#e0e0e0';
            ctx.font = this.skill.isCenter ? 'bold 14px Courier New' : '12px Courier New';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const labelY = this.y + currentRadius + 20;
            ctx.fillText(this.skill.name, this.x, labelY);
        }
        
        isHovered(mouseX, mouseY) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            return Math.sqrt(dx * dx + dy * dy) < this.radius + 10;
        }
    }
    
    // Particle class for data flow
    class DataParticle {
        constructor(from, to) {
            this.from = from;
            this.to = to;
            this.progress = 0;
            this.speed = 0.005 + Math.random() * 0.01;
            this.size = 2;
            this.color = from.skill.color;
        }
        
        update() {
            this.progress += this.speed;
            if (this.progress > 1) {
                this.progress = 0;
            }
        }
        
        draw() {
            const x = this.from.x + (this.to.x - this.from.x) * this.progress;
            const y = this.from.y + (this.to.y - this.from.y) * this.progress;
            
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(x, y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
    
    // Initialize nodes
    function initializeNodes() {
        nodes = [];
        particles = [];
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.3;
        
        // Create center node
        const centerSkill = skills.find(s => s.isCenter);
        const centerNode = new SkillNode(centerSkill, centerX, centerY);
        nodes.push(centerNode);
        
        // Create surrounding nodes in a circle
        const otherSkills = skills.filter(s => !s.isCenter);
        const angleStep = (Math.PI * 2) / otherSkills.length;
        
        otherSkills.forEach((skill, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const node = new SkillNode(skill, x, y);
            node.connections.push(centerNode);
            nodes.push(node);
            
            // Create particles for this connection
            for (let i = 0; i < 2; i++) {
                particles.push(new DataParticle(centerNode, node));
            }
        });
    }
    
    // Mouse interaction
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        hoveredNode = null;
        for (const node of nodes) {
            if (node.isHovered(mouseX, mouseY)) {
                hoveredNode = node;
                showTooltip(node, e.clientX, e.clientY);
                canvas.style.cursor = 'pointer';
                break;
            }
        }
        
        if (!hoveredNode) {
            hideTooltip();
            canvas.style.cursor = 'default';
        }
    });
    
    canvas.addEventListener('mouseleave', () => {
        hoveredNode = null;
        hideTooltip();
        canvas.style.cursor = 'default';
    });
    
    // Tooltip functions
    function showTooltip(node, x, y) {
        const skill = node.skill;
        
        tooltip.innerHTML = `
            <div class="tooltip-title">${skill.name}</div>
            <div class="tooltip-level">Proficiency Level: ${skill.level}%</div>
            <div class="tooltip-bar">
                <div class="tooltip-bar-fill" style="width: ${skill.level}%"></div>
            </div>
            <div class="tooltip-experience">${skill.experience}</div>
            <div class="tooltip-tags">
                ${skill.tags.map(tag => `<span class="tooltip-tag">${tag}</span>`).join('')}
            </div>
        `;
        
        tooltip.style.left = (x + 20) + 'px';
        tooltip.style.top = (y - 50) + 'px';
        tooltip.classList.add('active');
    }
    
    function hideTooltip() {
        tooltip.classList.remove('active');
    }
    
    // Animation loop
    function animate() {
        // Clear with fade effect
        ctx.fillStyle = 'rgba(18, 18, 18, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw connections
        nodes.forEach(node => {
            node.connections.forEach(connectedNode => {
                const dx = connectedNode.x - node.x;
                const dy = connectedNode.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Connection line
                const gradient = ctx.createLinearGradient(
                    node.x, node.y,
                    connectedNode.x, connectedNode.y
                );
                gradient.addColorStop(0, node.skill.color + '60');
                gradient.addColorStop(0.5, node.skill.color + '30');
                gradient.addColorStop(1, connectedNode.skill.color + '60');
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = hoveredNode === node || hoveredNode === connectedNode ? 2 : 1;
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(connectedNode.x, connectedNode.y);
                ctx.stroke();
            });
        });
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Update and draw nodes
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Start animation when section is visible
    const networkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initializeNodes();
                animate();
                networkObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const networkViz = document.querySelector('.network-viz');
    if (networkViz) {
        networkObserver.observe(networkViz);
    }
}

// ===== DECRYPT TEXT EFFECT =====
const decryptObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const decryptElements = entry.target.querySelectorAll('.decrypt-text');
            decryptElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.animation = `decrypt 0.5s ease forwards`;
                }, index * 200);
            });
            decryptObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const aboutSection = document.querySelector('.about-section');
if (aboutSection) {
    decryptObserver.observe(aboutSection);
}

// ===== SECURE TERMINAL CONTACT =====
const terminalInput = document.getElementById('terminalInput');
const terminalOutput = document.getElementById('terminalOutput');
const terminalBody = document.getElementById('terminalBody');

let userEmail = '';
let userName = '';
let isConnected = false;

// Command history
let commandHistory = [];
let historyIndex = -1;

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (command) {
                commandHistory.push(command);
                historyIndex = commandHistory.length;
                processCommand(command);
                terminalInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = '';
            }
        }
    });

    // Keep input focused
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });
}

function addOutput(text, type = 'normal') {
    const line = document.createElement('p');
    line.className = `output-line ${type}`;
    line.textContent = text;
    terminalOutput.appendChild(line);
    scrollToBottom();
}

function addUserInput(command) {
    const line = document.createElement('p');
    line.className = 'output-line user-input';
    line.innerHTML = `<span class="prompt">root@secure-comms:~$</span> ${command}`;
    terminalOutput.appendChild(line);
    scrollToBottom();
}

function scrollToBottom() {
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

async function processCommand(command) {
    addUserInput(command);
    
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    await delay(300);
    
    switch (cmd) {
        case 'help':
            showHelp();
            break;
            
        case 'connect':
            await handleConnect(args);
            break;
            
        case 'send':
            await handleSend(args);
            break;
            
        case 'collab':
        case 'collaborate':
            await handleCollab();
            break;
            
        case 'info':
            showInfo();
            break;
            
        case 'status':
            showStatus();
            break;
            
        case 'clear':
            clearTerminal();
            break;
            
        case 'whoami':
            addOutput('root', 'info-msg');
            break;
            
        case 'exit':
        case 'quit':
            await handleExit();
            break;
            
        default:
            addOutput(`Command not found: ${cmd}`, 'error-msg');
            addOutput(`Type 'help' for available commands.`, 'info-msg');
    }
    
    addOutput(' ');
}

function showHelp() {
    addOutput('═══════════════════════════════════════════════════════', 'system-msg');
    addOutput('AVAILABLE COMMANDS:', 'system-msg');
    addOutput('═══════════════════════════════════════════════════════', 'system-msg');
    addOutput(' ');
    addOutput('  help                    - Display this help message', 'info-msg');
    addOutput('  connect [email]         - Initiate secure connection', 'info-msg');
    addOutput('  send [message]          - Send encrypted message', 'info-msg');
    addOutput('  collab                  - Request collaboration', 'info-msg');
    addOutput('  info                    - Display contact information', 'info-msg');
    addOutput('  status                  - Check connection status', 'info-msg');
    addOutput('  clear                   - Clear terminal output', 'info-msg');
    addOutput('  exit                    - Close connection', 'info-msg');
    addOutput(' ');
    addOutput('═══════════════════════════════════════════════════════', 'system-msg');
}

async function handleConnect(email) {
    if (!email) {
        addOutput('Usage: connect [your-email]', 'error-msg');
        addOutput('Example: connect john@example.com', 'info-msg');
        return;
    }
    
    if (!isValidEmail(email)) {
        addOutput('Invalid email format. Please try again.', 'error-msg');
        return;
    }
    
    addOutput('> Initiating secure handshake...', 'encrypting-text');
    await delay(800);
    addOutput('> Generating RSA-4096 key pair...', 'encrypting-text');
    await delay(1000);
    addOutput('> Exchanging public keys...', 'encrypting-text');
    await delay(800);
    addOutput('> Establishing AES-256-GCM encrypted channel...', 'encrypting-text');
    await delay(1000);
    addOutput('> Verifying digital signature...', 'encrypting-text');
    await delay(700);
    addOutput(' ');
    addOutput(`✓ Secure connection established with ${email}`, 'success-msg');
    addOutput('✓ End-to-end encryption active', 'success-msg');
    addOutput(' ');
    addOutput('You can now send encrypted messages using: send [message]', 'info-msg');
    
    userEmail = email;
    isConnected = true;
}

async function handleSend(message) {
    if (!isConnected) {
        addOutput('Error: No active connection.', 'error-msg');
        addOutput('Please establish a connection first: connect [your-email]', 'info-msg');
        return;
    }
    
    if (!message) {
        addOutput('Usage: send [your-message]', 'error-msg');
        addOutput('Example: send I would like to discuss a security project', 'info-msg');
        return;
    }
    
    addOutput('> Encrypting message with AES-256...', 'encrypting-text');
    await delay(600);
    addOutput('> Generating message authentication code...', 'encrypting-text');
    await delay(500);
    addOutput('> Routing through secure channels...', 'encrypting-text');
    await delay(800);
    addOutput('> Transmitting encrypted payload...', 'encrypting-text');
    await delay(700);
    addOutput('> Awaiting acknowledgment...', 'encrypting-text');
    await delay(600);
    addOutput(' ');
    addOutput('✓ Transmission successful!', 'success-msg');
    addOutput('✓ Message delivered securely', 'success-msg');
    addOutput(' ');
    addOutput('Your message has been encrypted and sent.', 'info-msg');
    addOutput('Expected response time: 24-48 hours', 'info-msg');
    addOutput(' ');
    addOutput(`Message Preview: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`, 'normal');
}

async function handleCollab() {
    if (!isConnected) {
        addOutput('Error: No active connection.', 'error-msg');
        addOutput('Please establish a connection first: connect [your-email]', 'info-msg');
        return;
    }
    
    addOutput('> Preparing collaboration request...', 'encrypting-text');
    await delay(600);
    addOutput('> Encrypting request details...', 'encrypting-text');
    await delay(700);
    addOutput('> Routing to collaboration endpoint...', 'encrypting-text');
    await delay(800);
    addOutput(' ');
    addOutput('✓ Collaboration request sent successfully!', 'success-msg');
    addOutput(' ');
    addOutput('Your collaboration request has been received.', 'info-msg');
    addOutput('Available for:', 'info-msg');
    addOutput('  • Security Consulting', 'normal');
    addOutput('  • Penetration Testing', 'normal');
    addOutput('  • Code Review & Audit', 'normal');
    addOutput('  • Security Training', 'normal');
    addOutput('  • Vulnerability Research', 'normal');
    addOutput(' ');
    addOutput('Response expected within 24 hours.', 'info-msg');
}

function showInfo() {
    addOutput('═══════════════════════════════════════════════════════', 'system-msg');
    addOutput('CONTACT INFORMATION:', 'system-msg');
    addOutput('═══════════════════════════════════════════════════════', 'system-msg');
    addOutput(' ');
    addOutput('EMAIL:     security@specialist.com', 'info-msg');
    addOutput('PGP KEY:   0x1234 5678 90AB CDEF', 'info-msg');
    addOutput('LINKEDIN:  linkedin.com/in/cybersecurity-specialist', 'info-msg');
    addOutput('GITHUB:    github.com/security-specialist', 'info-msg');
    addOutput('TWITTER:   @securityspec', 'info-msg');
    addOutput(' ');
    addOutput('AVAILABILITY: Open for consulting and collaboration', 'success-msg');
    addOutput('TIMEZONE:     UTC-5 (EST)', 'normal');
    addOutput('RESPONSE:     Within 24-48 hours', 'normal');
    addOutput(' ');
    addOutput('═══════════════════════════════════════════════════════', 'system-msg');
}

function showStatus() {
    addOutput('═══════════════════════════════════════════════════════', 'system-msg');
    addOutput('CONNECTION STATUS:', 'system-msg');
    addOutput('═══════════════════════════════════════════════════════', 'system-msg');
    addOutput(' ');
    
    if (isConnected) {
        addOutput(`Status:       ✓ CONNECTED`, 'success-msg');
        addOutput(`Email:        ${userEmail}`, 'info-msg');
        addOutput(`Encryption:   AES-256-GCM`, 'success-msg');
        addOutput(`Auth:         RSA-4096`, 'success-msg');
        addOutput(`Channel:      Secure`, 'success-msg');
    } else {
        addOutput(`Status:       ✗ NOT CONNECTED`, 'warning-msg');
        addOutput(`Use 'connect [email]' to establish secure connection`, 'info-msg');
    }
    
    addOutput(' ');
    addOutput(`Uptime:       ${getUptime()}`, 'normal');
    addOutput(`Protocol:     TLS 1.3`, 'normal');
    addOutput(`Latency:      ${Math.floor(Math.random() * 50 + 10)}ms`, 'normal');
    addOutput(' ');
    addOutput('═══════════════════════════════════════════════════════', 'system-msg');
}

function clearTerminal() {
    terminalOutput.innerHTML = '';
    addOutput('Terminal cleared.', 'info-msg');
    addOutput(' ');
}

async function handleExit() {
    if (isConnected) {
        addOutput('> Closing secure connection...', 'encrypting-text');
        await delay(500);
        addOutput('> Destroying encryption keys...', 'encrypting-text');
        await delay(500);
        addOutput('> Clearing session data...', 'encrypting-text');
        await delay(500);
        addOutput(' ');
        addOutput('✓ Connection closed securely', 'success-msg');
        isConnected = false;
        userEmail = '';
    } else {
        addOutput('No active connection to close.', 'info-msg');
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getUptime() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = now - start;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== GLITCH EFFECT ON HOVER =====
const glitchElements = document.querySelectorAll('.glitch-text, .glitch-reveal');
glitchElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        const currentAnim = el.style.animation;
        el.style.animation = 'none';
        setTimeout(() => {
            el.style.animation = 'glitchAnim 0.3s ease';
            setTimeout(() => {
                el.style.animation = currentAnim;
            }, 300);
        }, 10);
    });
});

// ===== CASE FILE DECRYPT EFFECT =====
const caseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const caseFile = entry.target;
            
            // Trigger decrypt animation on scroll into view
            setTimeout(() => {
                const encryptedTitle = caseFile.querySelector('.encrypted-title');
                const encryptedContent = caseFile.querySelector('.encrypted-content');
                
                if (encryptedTitle) {
                    encryptedTitle.style.filter = 'blur(0)';
                    encryptedTitle.style.opacity = '1';
                }
                
                if (encryptedContent) {
                    setTimeout(() => {
                        encryptedContent.style.filter = 'blur(0)';
                        encryptedContent.style.opacity = '1';
                    }, 200);
                }
            }, 300);
            
            caseObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

// Observe all case files
document.querySelectorAll('.case-file').forEach(caseFile => {
    caseObserver.observe(caseFile);
});

// ===== CASE FILE HOVER EFFECTS =====
const caseFiles = document.querySelectorAll('.case-file');
caseFiles.forEach(caseFile => {
    caseFile.addEventListener('mouseenter', function() {
        const severityBadge = this.querySelector('.severity-badge');
        if (severityBadge) {
            severityBadge.style.transform = 'scale(1.1)';
            severityBadge.style.transition = 'transform 0.3s ease';
        }
        
        // Add glitch effect to case ID
        const caseId = this.querySelector('.case-id');
        if (caseId) {
            caseId.style.animation = 'glitchAnim 0.3s ease';
        }
    });
    
    caseFile.addEventListener('mouseleave', function() {
        const severityBadge = this.querySelector('.severity-badge');
        if (severityBadge) {
            severityBadge.style.transform = 'scale(1)';
        }
        
        const caseId = this.querySelector('.case-id');
        if (caseId) {
            caseId.style.animation = 'none';
        }
    });
});

// ===== MODULE CARD INTERACTIONS =====
const moduleCards = document.querySelectorAll('.module-card');
moduleCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.module-icon');
        if (icon) {
            icon.style.transform = 'rotate(180deg)';
            icon.style.transition = 'transform 0.5s ease';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.module-icon');
        if (icon) {
            icon.style.transform = 'rotate(0deg)';
        }
    });
});

// ===== TERMINAL INPUT FOCUS EFFECTS =====
const terminalInputs = document.querySelectorAll('.terminal-input');
terminalInputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.3)';
    });
    
    input.addEventListener('blur', function() {
        this.style.boxShadow = 'none';
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = '#00f0ff';
            link.style.textShadow = '0 0 10px rgba(0, 240, 255, 0.5)';
        } else {
            link.style.textShadow = 'none';
        }
    });
});

// ===== ENCRYPTED TEXT HOVER EFFECT =====
const dataValues = document.querySelectorAll('.data-value');
dataValues.forEach(value => {
    const originalText = value.textContent;
    
    value.addEventListener('mouseenter', function() {
        // Create encrypted version
        const encrypted = originalText.split('').map(() => {
            return String.fromCharCode(33 + Math.floor(Math.random() * 94));
        }).join('');
        
        let iterations = 0;
        const maxIterations = 10;
        
        const interval = setInterval(() => {
            this.textContent = originalText.split('').map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return String.fromCharCode(33 + Math.floor(Math.random() * 94));
            }).join('');
            
            iterations += 1;
            
            if (iterations > maxIterations) {
                clearInterval(interval);
                this.textContent = originalText;
            }
        }, 30);
    });
});

// ===== CONSOLE EASTER EGG =====
console.log('%c◈ SECURE SYSTEM ACCESS', 'color: #00f0ff; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to the command center.', 'color: #00ff88; font-size: 14px;');
console.log('%cType "help()" for available commands.', 'color: #a0a0a0; font-size: 12px;');

window.help = function() {
    console.log('%cAvailable Commands:', 'color: #00f0ff; font-weight: bold;');
    console.log('%c- about(): Display system information', 'color: #a0a0a0;');
    console.log('%c- skills(): List security modules', 'color: #a0a0a0;');
    console.log('%c- contact(): Show contact information', 'color: #a0a0a0;');
};

window.about = function() {
    console.log('%cCybersecurity Specialist', 'color: #00ff88; font-weight: bold;');
    console.log('Ethical Hacker | Security Engineer | Penetration Tester');
};

window.skills = function() {
    console.log('%cSecurity Modules:', 'color: #00f0ff; font-weight: bold;');
    console.log('- Penetration Testing: 95%');
    console.log('- Network Security: 92%');
    console.log('- Reverse Engineering: 88%');
    console.log('- OSINT & Reconnaissance: 90%');
    console.log('- Cryptography: 85%');
    console.log('- Cloud Security: 87%');
};

window.contact = function() {
    console.log('%cContact Information:', 'color: #00f0ff; font-weight: bold;');
    console.log('EMAIL: security@specialist.com');
    console.log('PGP: 0x1234 5678 90AB CDEF');
};
