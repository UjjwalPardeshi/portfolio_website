import Fuse from 'fuse.js';
import './style.css';

// ══════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ══════════════════════════════════════════════════════════════

interface FAQItem {
    question: string[];
    keywords: string[];
    answer: string;
}

type MessageSender = 'user' | 'bot';

// ══════════════════════════════════════════════════════════════
// FAQ DATA (comprehensive from resume)
// ══════════════════════════════════════════════════════════════

const FAQ: FAQItem[] = [
    // ── About / Introduction ────────────────────────────────────
    {
        question: [
            "Who is Ujjwal?", "bio", "who are you", "about Ujjwal",
            "Can you introduce yourself?", "profile", "tell me about yourself",
            "introduction", "about"
        ],
        keywords: ["bio", "about", "who", "introduction", "profile", "ujjwal"],
        answer: "Ujjwal Surajkumar Pardeshi is a Computer Science undergraduate at SRM Institute of Science & Technology (2022–2026, CGPA: 7.5) specializing in AI/ML, deep learning, and backend development. He's interned at Samsung R&D, published at IEEE CONNECT 2025, and leads R&D at IEEE SRM."
    },

    // ── Education ───────────────────────────────────────────────
    {
        question: [
            "Tell me about his education", "college", "university",
            "where does he study?", "education background?", "degree",
            "what is his CGPA?", "SRM", "B.Tech"
        ],
        keywords: ["education", "college", "srm", "degree", "university", "cgpa", "btech", "iot"],
        answer: "Ujjwal is pursuing <b>B.Tech in Computer Science (IoT)</b> at SRM Institute of Science & Technology, Chennai (Sept 2022 – May 2026) with a <b>CGPA of 7.5</b>."
    },

    // ── Experience / Internships ────────────────────────────────
    {
        question: [
            "Internships?", "What internships has he done?", "Samsung?",
            "Research experience?", "Show internships", "work experience",
            "where has he worked?", "experience"
        ],
        keywords: ["intern", "internship", "samsung", "research", "experience", "work", "job"],
        answer: "🏢 <b>Research Intern – Samsung Research Institute, Bangalore</b> (Jan–June 2025): Worked on emoji-based sentiment analysis with a 2,700+ custom dataset, benchmarked BERT, LightGBM, and ensemble models (86.18% accuracy), and submitted findings to IEEE CONNECT 2025.<br><br>🔬 <b>Undergraduate Researcher – SRM</b> (Aug 2024–Jan 2025): Built the Smart Lift Occupancy System using OpenVINO + Next.js + Firebase + Raspberry Pi. Won \"Best Innovative Solution\" at AIOT Expo 2024 and secured ₹80K in funding."
    },

    // ── Projects ────────────────────────────────────────────────
    {
        question: [
            "What projects has Ujjwal done?", "major projects",
            "List his major projects", "What all projects does he have",
            "What are his major projects?", "Which projects has he completed?",
            "show projects", "portfolio"
        ],
        keywords: ["projects", "major project", "project", "portfolio", "work samples"],
        answer: "Ujjwal's key projects include:<br>🤖 <b>RAG-Based AI Chatbot</b> – Context-aware chatbot with ChromaDB, WebSockets, SendGrid, Firebase<br>🌊 <b>Underwater Reflection Removal</b> – YOLOv8 + MiDaS pipeline (presented at AI FOR OCEANS)<br>🚗 <b>AutoSense</b> – Vehicle detection with DeepLabV3 (96% accuracy)<br>🏋️ <b>Fitmon</b> – AI fitness game with Godot 4.3 + TensorFlow.js<br>✈️ <b>Aircraft/Drone Detection</b> – YOLO-based aerial detection<br>🌍 <b>Exoplanet Detection</b> – NASA Kepler/TESS data analysis<br>✋ <b>Gesture Authentication</b> – ML-based gesture security<br>🛗 <b>Smart Lift System</b> – IoT-based elevator optimization"
    },

    // ── RAG Chatbot specifically ────────────────────────────────
    {
        question: [
            "Tell me about the RAG chatbot", "RAG project", "chatbot project",
            "AI chatbot project"
        ],
        keywords: ["rag", "chatbot project", "chromadb", "websocket"],
        answer: "The <b>RAG-Based AI Chatbot</b> features context-aware responses using ChromaDB, real-time WebSocket messaging, automated lead capture & email via SendGrid, and persistent storage using Firebase Firestore. Built with FastAPI, LangChain, ChromaDB, Sockets, and SendGrid."
    },

    // ── Underwater Vision ───────────────────────────────────────
    {
        question: [
            "underwater project", "vision based", "reflection removal",
            "depth estimation", "AI for oceans"
        ],
        keywords: ["underwater", "reflection", "depth", "yolov8", "midas", "oceans"],
        answer: "The <b>Vision-Based Underwater Reflection Removal, Detection and Depth Estimation</b> project is a hybrid deep learning and sensor-fusion pipeline using YOLOv8, MiDaS, and OpenCV for underwater reflection removal, object detection, and depth-based localization. It was presented at <b>AI FOR OCEANS</b> national research conference."
    },

    // ── Fitmon ──────────────────────────────────────────────────
    {
        question: [
            "fitmon", "fitness game", "godot project", "exercise tracking"
        ],
        keywords: ["fitmon", "fitness", "godot", "exercise", "game"],
        answer: "<b>Fitmon</b> is an AI-powered fitness game built with Godot 4.3, TensorFlow.js, and JavaScriptBridge for real-time webcam-based exercise tracking. It supports multiple movements and runs natively in the browser via Godot HTML5."
    },

    // ── Publications ────────────────────────────────────────────
    {
        question: [
            "Publications?", "Has he published research?", "IEEE paper?",
            "Any research papers?", "Show publications", "PINNTO",
            "emojis paper", "research papers"
        ],
        keywords: ["publication", "publications", "paper", "research", "ieee", "pinnto", "emojis"],
        answer: "📄 <b>PINNTO – Physics Informed Neural Networks for Trading Options</b> (Dec 2025, B.Tech Major Project) – With Mehul Ashra, currently under review.<br><br>📄 <b>Emojis as Emotional Markers: A Computational Approach to Sentiment Analysis</b> (June 2025) – Published at IEEE CONNECT 2025. Uses BERT + Emoji2Vec on a custom 2,700+ emoji-sentiment dataset."
    },

    // ── Leadership ──────────────────────────────────────────────
    {
        question: [
            "Leadership?", "Club?", "IEEE leader?", "Astrophilia?",
            "Head of R&D?", "leadership roles", "clubs",
            "what clubs is he in?"
        ],
        keywords: ["leadership", "club", "ieee", "astrophilia", "head", "convener", "board"],
        answer: "🎯 <b>Head of R&D – IEEE SRM</b> (April 2023–June 2025): Led 30 students, submitted journal on Autism Spectrum Disorder Detection (ML), conducted KT sessions on Neural Networks/ML/SSL, presented 4 research posters at intl. conference SDGs'23.<br><br>⭐ <b>Convener [Board Member] – Astrophilia</b> (Sept 2022–Sept 2024): Liaison between club and administration, conducted Astronomy sessions, awarded by SRMIST Directors for exemplary leadership."
    },

    // ── Certifications ──────────────────────────────────────────
    {
        question: [
            "Show me his certifications", "List of certifications",
            "What certificates does he hold?", "certifications", "certificates",
            "how many certifications?"
        ],
        keywords: ["certification", "certified", "certificate", "certificates", "certifications"],
        answer: "Ujjwal holds <b>11+ certifications</b>:<br>☁️ Oracle Cloud Infrastructure 2025 – AI Foundations Associate<br>☁️ Oracle Fusion Cloud Applications ERP<br>📊 Supervised ML: Regression & Classification<br>🔶 AWS Academy – ML Foundations<br>🔷 Classify Images with TensorFlow (Google Cloud)<br>🤖 Artificial Intelligence Fundamentals<br>💾 Data Fundamentals<br>🔍 Attention Mechanism<br>✨ Introduction to Generative AI<br>📝 Introduction to Large Language Models<br>☁️ Data Transformation in the Cloud"
    },

    // ── Skills ──────────────────────────────────────────────────
    {
        question: [
            "What are his skills?", "skills", "tech stack", "languages",
            "technologies", "what programming languages?"
        ],
        keywords: ["skills", "tech stack", "languages", "technology", "programming", "backend", "cloud", "ml", "deep learning"],
        answer: "💻 <b>Languages:</b> Python, C++, C, JavaScript, Node.js, SQL<br>🛠️ <b>Frameworks:</b> FastAPI, Flask, React, Next.js, LangChain, Postman, JWT<br>🧠 <b>AI/ML:</b> PyTorch, TensorFlow, Keras, OpenCV, Hugging Face, YOLOv8, MiDaS, OpenVINO<br>☁️ <b>Cloud & DevOps:</b> AWS, GCP, Docker, Git, CI/CD, Linux, Nvidia A100<br>💾 <b>Databases:</b> Firebase, Supabase, ChromaDB, WebSockets, SendGrid"
    },

    // ── Awards ──────────────────────────────────────────────────
    {
        question: [
            "How many awards has Ujjwal won?", "List of awards",
            "What all awards has he won", "How many recognitions",
            "Has he won awards?", "Achievements list"
        ],
        keywords: ["awards", "award", "honor", "recognition", "achievement"],
        answer: "🏆 <b>\"Best Innovative Solution\"</b> – AIOT Project Expo 2024 (with ₹80K funding)<br>🏆 <b>IEEE CONNECT 2025</b> – Author distinction for published research<br>🏆 <b>SRMIST Director's Award</b> – For exemplary leadership at Astrophilia club<br>🏆 4 research posters presented at the 2nd International Conference on SDGs'23"
    },

    // ── Contact ─────────────────────────────────────────────────
    {
        question: [
            "Contact details?", "how can I contact Ujjwal?", "Email",
            "LinkedIn?", "connect", "reach", "mail", "phone number",
            "website"
        ],
        keywords: ["contact", "connect", "email", "linkedin", "mail", "phone", "website"],
        answer: "📧 Email: <a href='mailto:ujjwalpardeshi@gmail.com'>ujjwalpardeshi@gmail.com</a><br>📱 Phone: +91-8976131401<br>🔗 LinkedIn: <a href='https://linkedin.com/in/ujjwalpardeshi' target='_blank'>linkedin.com/in/ujjwalpardeshi</a><br>🌐 Website: <a href='https://ujjwalpardeshi.vercel.app' target='_blank'>ujjwalpardeshi.vercel.app</a>"
    },

    // ── GitHub ──────────────────────────────────────────────────
    {
        question: [
            "GitHub?", "github profile", "Where can I see his code?",
            "Show repositories"
        ],
        keywords: ["github", "repo", "repositories", "code"],
        answer: "Check out his code at <a href='https://github.com/UjjwalPardeshi' target='_blank'>github.com/UjjwalPardeshi</a> 🐙"
    },

    // ── Resume ──────────────────────────────────────────────────
    {
        question: [
            "Resume?", "CV?", "Get his resume", "Download CV",
            "Can I download your resume?"
        ],
        keywords: ["resume", "cv", "download"],
        answer: "📄 Download his resume: <a href='https://drive.google.com/file/d/1KjQhVFWBTl9Ivi1mHQL9mya4LfkotWCw/view?usp=sharing' target='_blank'>Google Drive Link</a>"
    },

    // ── Greeting ────────────────────────────────────────────────
    {
        question: [
            "hi", "hello", "hey", "heyy", "greetings",
            "good morning", "good afternoon", "good job", "cool"
        ],
        keywords: ["hi", "hello", "hey", "greetings", "job", "thanks", "cool"],
        answer: "Hey there! 👋 I know all about Ujjwal. Try asking about his <b>skills</b>, <b>projects</b>, <b>experience</b>, <b>publications</b>, <b>certifications</b>, <b>leadership</b>, or <b>resume</b>!"
    },

    // ── Blogs ───────────────────────────────────────────────────
    {
        question: [
            "blogs", "what blogs has he written", "any blogs?",
            "any writeups?", "medium articles"
        ],
        keywords: ["writeups", "blog", "blogs", "medium", "articles"],
        answer: "✍️ Ujjwal writes on Medium! Check out his blogs:<br>🔭 <a href='https://medium.com/srm-astrophilia/solving-the-energy-crisis-exploring-the-dyson-sphere-939f25932270' target='_blank'>Solving the Energy Crisis: Exploring the Dyson Sphere</a><br>🌍 <a href='https://medium.com/srm-astrophilia/tracing-planetary-shadows-discovering-exoplanets-through-light-curve-analysis-53d9f6074ded' target='_blank'>Tracing Planetary Shadows: Discovering Exoplanets</a><br><br>Or visit the <a href='blog.html'>Blog page</a> for more!"
    }
];

// ══════════════════════════════════════════════════════════════
// FUSE.JS SEARCH
// ══════════════════════════════════════════════════════════════

const fuse = new Fuse<FAQItem>(FAQ, {
    isCaseSensitive: false,
    includeScore: true,
    keys: ['question', 'keywords'],
    threshold: 0.37
});

// ══════════════════════════════════════════════════════════════
// CHATBOT LOGIC
// ══════════════════════════════════════════════════════════════

function getBotReply(msg: string): string {
    msg = msg.trim().toLowerCase();
    let result = fuse.search(msg);

    if (result.length === 0) {
        const mainWords = msg.match(/\w+/g);
        if (mainWords) {
            result = fuse.search(mainWords.join(" "));
        }
    }

    if (result.length > 0 && result[0].score !== undefined && result[0].score < 0.55) {
        return result[0].item.answer;
    }

    return "I can answer about Ujjwal's <b>skills</b>, <b>projects</b>, <b>publications</b>, <b>experience</b>, <b>certifications</b>, <b>leadership</b>, <b>education</b>, <b>awards</b>, and <b>resume</b>.<br><br>Try things like:<br>• What are his major projects?<br>• Tell me about his internships<br>• Show me his certifications<br>• What research has he published?<br>• What awards has he won?<br>• Can I download his resume?";
}

// ══════════════════════════════════════════════════════════════
// CHAT UI (IMPROVED)
// ══════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", (): void => {
    const chatWindow = document.getElementById("chat-window");
    const chatInput = document.getElementById("chat-input") as HTMLInputElement | null;
    const sendBtn = document.getElementById("send-btn");
    const suggestionsContainer = document.getElementById("chat-suggestions");

    function appendMessage(text: string, sender: MessageSender): void {
        if (!chatWindow) return;
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message");
        msgDiv.classList.add(sender === "user" ? "user" : "bot");
        msgDiv.innerHTML = sender === "bot" ? text : text.replace(/</g, "&lt;");
        chatWindow.appendChild(msgDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function showTypingIndicator(): HTMLDivElement | null {
        if (!chatWindow) return null;
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("typing-indicator");
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatWindow.appendChild(typingDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return typingDiv;
    }

    function sendMessage(message: string): void {
        if (!message.trim()) return;
        appendMessage(message, "user");

        // Show typing indicator
        const typingEl = showTypingIndicator();

        // Simulate a short delay for natural feel
        setTimeout((): void => {
            if (typingEl && chatWindow) {
                chatWindow.removeChild(typingEl);
            }
            const botReply = getBotReply(message);
            appendMessage(botReply, "bot");
        }, 600 + Math.random() * 400);

        if (chatInput) chatInput.value = "";
    }

    // Send button click
    if (sendBtn) {
        sendBtn.onclick = (): void => {
            if (!chatInput) return;
            sendMessage(chatInput.value);
        };
    }

    // Enter key
    if (chatInput && sendBtn) {
        chatInput.addEventListener("keypress", (e: KeyboardEvent): void => {
            if (e.key === "Enter") {
                sendMessage(chatInput.value);
            }
        });
    }

    // Suggestion chips
    if (suggestionsContainer) {
        suggestionsContainer.querySelectorAll<HTMLButtonElement>('.suggestion-chip').forEach((chip: HTMLButtonElement): void => {
            chip.addEventListener('click', (): void => {
                const msg = chip.getAttribute('data-msg');
                if (msg) {
                    sendMessage(msg);
                }
            });
        });
    }

    // Welcome message on load
    setTimeout((): void => {
        appendMessage(
            "👋 Hi! I'm Ujjwal's portfolio assistant. Ask me anything about his <b>skills</b>, <b>projects</b>, <b>experience</b>, <b>publications</b>, <b>certifications</b>, or <b>resume</b>!",
            "bot"
        );
    }, 800);
});

// ══════════════════════════════════════════════════════════════
// MOBILE MENU & NAVIGATION
// ══════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", (): void => {
    const mobileMenuBtn = document.querySelector<HTMLButtonElement>('.mobile-menu-btn');
    const nav = document.querySelector<HTMLElement>('nav');

    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function (this: HTMLButtonElement): void {
            nav.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor: HTMLAnchorElement): void => {
        anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event): void {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href) return;
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    if (mobileMenuBtn) {
                        const icon = mobileMenuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.add('fa-bars');
                            icon.classList.remove('fa-times');
                        }
                    }
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions: IntersectionObserverInit = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]): void => {
        entries.forEach((entry: IntersectionObserverEntry): void => {
            if (entry.isIntersecting) {
                (entry.target as HTMLElement).style.animationPlayState = 'running';
            }
        });
    }, observerOptions);

    document.querySelectorAll<HTMLElement>('.fade-in').forEach((el: HTMLElement): void => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
});
