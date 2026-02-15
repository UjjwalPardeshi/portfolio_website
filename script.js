const FAQ = [
  {
    question: [
      "How many awards has Ujjwal won?", "List of awards", "What all awards has he won", "How many recognitions", "Has he won awards?", "Achievements list"
    ],
    keywords: ["awards", "award", "honor", "recognition", "achievement"],
    answer: "Ujjwal has won several awards including the AIOT Project Expo 2024 and the IEEE Connect 2025 Author distinction."
  },
  {
    question: [
      "Show me his certifications", "List of certifications", "What certificates does he hold?", "certifications", "certificates"
    ],
    keywords: ["certification", "certified", "certificate", "certificates", "certifications", "cloud", "ml", "deep learning"],
    answer: "Ujjwal is certified in Oracle Cloud (AI Foundations), AWS ML Foundations, and Google Deep Learning."
  },
  {
    question: [
      "What projects has Ujjwal done?", "major projects", "List his major projects", "What all projects does he have", "What are his major projects?", "Which projects has he completed?"
    ],
    keywords: ["projects", "major project", "project", "portfolio", "work samples"],
    answer: "Ujjwal's key projects include AutoSense, Exoplanet Detection, Gesture Authentication, Smart Lift Occupancy Detection, and an RAG-based AI Chatbot."
  },
  {
    question: [
      "Who is Ujjwal?", "bio", "who are you", "about Ujjwal", "Can you introduce yourself?", "profile"
    ],
    keywords: ["bio", "about", "who", "introduction", "profile"],
    answer: "Ujjwal Surajkumar Pardeshi is a CS undergraduate specializing in AI/ML, deep learning, and backend development."
  },
  {
    question: [
      "Contact details?", "how can I contact Ujjwal?", "Email", "LinkedIn?", "connect", "reach", "mail"
    ],
    keywords: ["contact", "connect", "email", "linkedin", "mail"],
    answer: "Email: ujjwalpardeshi@gmail.com | LinkedIn: <a href='https://linkedin.com/in/ujjwalpardeshi' target='_blank'>linkedin.com/in/ujjwalpardeshi</a>"
  },
  {
    question: [
      "GitHub?", "github profile", "Where can I see his code?", "Show repositories"
    ],
    keywords: ["github", "repo", "repositories", "code", "project"],
    answer: "You can view his code at github.com/UjjwalPardeshi"
  },
  {
    question: [
      "Resume?", "CV?", "Get his resume", "Download CV", "Can I download your resume?"
    ],
    keywords: ["resume", "cv", "download"],
    answer: "Download his resume from Google Drive: <a href='https://drive.google.com/file/d/1KjQhVFWBTl9Ivi1mHQL9mya4LfkotWCw/view?usp=sharing' target='_blank'>here</a>."
  },
  {
    question: [
      "What are his skills?", "skills", "tech stack", "languages"
    ],
    keywords: ["skills", "tech stack", "languages", "technology", "programming", "backend", "cloud", "ml", "deep learning"],
    answer: "Ujjwal's skills include Python, C++, JavaScript, FastAPI, Docker, PyTorch, TensorFlow, and cloud technologies."
  },
  {
    question: [
      "Tell me about his education", "college", "university", "where does he study?", "education background?"
    ],
    keywords: ["education", "college", "srm", "degree", "university"],
    answer: "Ujjwal is pursuing B.Tech in CS (IoT) at SRM Institute of Science & Technology (2022–2026)."
  },
  {
    question: [
      "Internships?", "What internships has he done?", "Samsung?", "Research experience?", "Show internships"
    ],
    keywords: ["intern", "internship", "samsung", "research"],
    answer: "He interned at Samsung R&D, working on sentiment analysis and deployed ML web services."
  },
  {
    question: [
      "Publications?", "Has he published research?", "IEEE paper?", "Any research papers?", "Show publications"
    ],
    keywords: ["publication", "publications", "paper", "research", "ieee"],
    answer: "His main publication is 'Emojis as Emotional Markers' for IEEE Connect 2025. He has collaborative ML research under review."
  },
  {
    question: [
      "Leadership?", "Club?", "IEEE leader?", "Astrophilia?", "Head of R&D?"
    ],
    keywords: ["leadership", "club", "ieee", "astrophilia", "head"],
    answer: "Leadership: Head of R&D at IEEE SRM, convener of Astrophilia astronomy club."
  },
  {
    question: [
      "hi", "hello", "hey", "heyy", "greetings", "good morning", "good afternoon", "good job", "cool"
    ],
    keywords: ["hi", "hello", "hey", "greetings", "job", "thanks", "cool"],
    answer: "Hey! Ask me about Ujjwal's projects, skills, research, certifications, awards, or resume."
  },
  {
    question: [
      "blogs", "what blogs has he written", "any blogs ?", "any writeups ? ", "other than projects ? "
    ],
    keywords: ["writeups", "blog", "blogss", "blogs"],
    answer: "Hey! Ask me about Ujjwal's projects, skills, research, certifications, awards, or resume."
  }
];

const fuse = new Fuse(FAQ, {
  isCaseSensitive: false,
  includeScore: true,
  keys: ['question', 'keywords'],
  threshold: 0.37
});

function getBotReply(msg) {
  msg = msg.trim().toLowerCase();
  let result = fuse.search(msg);
  // Try again with keywords if first fails
  if (result.length === 0) {
    // try to extract main words and search again
    let mainWords = msg.match(/\w+/g);
    if (mainWords) result = fuse.search(mainWords.join(" "));
  }
  if (result.length > 0 && result[0].score < 0.55) {
    return result[0].item.answer;
  }
  // Otherwise, suggest sample questions as help
  return "I can answer about Ujjwal's <b>skills</b>, <b>projects</b>, <b>publications</b>, <b>achievements</b>, <b>certifications</b>, <b>internships</b>, <b>leadership</b> and <b>resume</b>.<br><br>Try things like:<br>- What are his major projects?<br>- How many awards has he won?<br>- Show me his certifications<br>- Can I download his resume?<br>- What skills does he have?<br>- What research has he published?";
}

document.addEventListener("DOMContentLoaded", function () {
  const chatWindow = document.getElementById("chat-window");
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");

  function appendMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message");
    msgDiv.classList.add(sender === "user" ? "user" : "bot");
    msgDiv.innerHTML = (sender === "bot") ? text : text.replace(/</g, "&lt;");
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  sendBtn.onclick = function () {
    const message = chatInput.value.trim();
    if (!message) return;
    appendMessage(message, "user");
    const botReply = getBotReply(message);
    appendMessage(botReply, "bot");
    chatInput.value = "";
  };

  chatInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendBtn.onclick();
  });
});

// Mobile menu toggle
document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');

  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', function () {
      nav.classList.toggle('active');
      const icon = this.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });
  }

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
        // Close mobile menu after clicking
        if (nav && nav.classList.contains('active')) {
          nav.classList.remove('active');
          const icon = mobileMenuBtn.querySelector('i');
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-times');
        }
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
});
