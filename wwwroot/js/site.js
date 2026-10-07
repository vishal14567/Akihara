/* ==========================================
   Akihara (秋原) - Interactive Logic & Audio
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // --- State Management ---
    let currentThemeIndex = 0;
    const themes = ["autumn", "sakura", "winter", "dark"];
    const themeNames = ["Autumn", "Sakura", "Winter", "Zen Dark"];

    // --- DOM Elements ---
    const themeBtn = document.getElementById("theme-cycle-btn");
    const themeNameLabel = document.getElementById("theme-name");
    const bodyEl = document.body;

    // --- Theme Switcher ---
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const oldTheme = themes[currentThemeIndex];
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            const newTheme = themes[currentThemeIndex];

            bodyEl.classList.remove(`theme-${oldTheme}`);
            bodyEl.classList.add(`theme-${newTheme}`);
            themeNameLabel.textContent = themeNames[currentThemeIndex];

            // Re-init canvas colors for new season
            initCanvasParticles();
        });
    }

    // --- Quote Reflector ---
    const quotes = [
        { text: "Do not seek to follow in the footsteps of the wise. Seek what they sought.", author: "Matsuo Bashō" },
        { text: "Knock on the sky and listen to the sound.", author: "Zen Proverb" },
        { text: "Flow with whatever may happen, and let your mind be free.", author: "Zhuangzi" },
        { text: "The primary point of Zen is containing yourself, not trying to understand.", author: "Shunryu Suzuki" },
        { text: "No trace of mind remains, only the sound of rain falling on bamboo.", author: "Dōgen Zenji" },
        { text: "Quiet mind, quiet heart. In the midst of activity, remain still within.", author: "Ryōkan Taigu" },
        { text: "Do not get lost in the past or the future; stay anchored in the present moment.", author: "Thich Nhat Hanh" }
    ];

    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    const newQuoteBtn = document.getElementById("new-quote-btn");

    if (newQuoteBtn) {
        newQuoteBtn.addEventListener("click", () => {
            // Fade out
            quoteText.style.opacity = 0;
            quoteAuthor.style.opacity = 0;

            setTimeout(() => {
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                quoteText.textContent = `"${randomQuote.text}"`;
                quoteAuthor.textContent = `— ${randomQuote.author}`;
                // Fade in
                quoteText.style.transition = "opacity 0.5s ease";
                quoteAuthor.style.transition = "opacity 0.5s ease";
                quoteText.style.opacity = 1;
                quoteAuthor.style.opacity = 1;
            }, 300);
        });
    }

    // --- HTML5 Canvas Season Particle System ---
    const canvas = document.getElementById("zen-canvas");
    let ctx = null;
    let particles = [];
    const maxParticles = 35;

    if (canvas) {
        ctx = canvas.getContext("2d");
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height; // Spread initially
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -20;
                this.size = Math.random() * 8 + 4;
                this.speedY = Math.random() * 0.8 + 0.4;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.density = Math.random() * 15 + 2;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 1 - 0.5;
                this.color = getParticleColor();
            }

            update() {
                this.y += this.speedY;
                // Add wave-like movement
                this.x += Math.sin(this.y / 30) * 0.3 + this.speedX;
                this.rotation += this.rotationSpeed;

                if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.fillStyle = this.color;
                
                const theme = themes[currentThemeIndex];
                if (theme === "winter") {
                    // Snowflakes
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (theme === "dark") {
                    // Glowing dust stars
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = this.color;
                    ctx.fill();
                } else {
                    // Leaf / Petal shape
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size);
                    ctx.quadraticCurveTo(this.size, 0, 0, this.size);
                    ctx.quadraticCurveTo(-this.size, 0, 0, -this.size);
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        function getParticleColor() {
            const theme = themes[currentThemeIndex];
            const leafColors = {
                autumn: ["#d97706", "#b45309", "#92400e", "#b91c1c", "#7f1d1d"],
                sakura: ["#f472b6", "#ec4899", "#fbcfe8", "#f43f5e", "#fda4af"],
                winter: ["#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#ffffff"],
                dark: ["#818cf8", "#6366f1", "#c7d2fe", "#4f46e5", "#312e81"]
            };
            const currentColors = leafColors[theme] || leafColors.autumn;
            return currentColors[Math.floor(Math.random() * currentColors.length)];
        }

        function initCanvasParticles() {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        initCanvasParticles();
        animateParticles();
    }


    // --- Web Audio Synthesizer Logic ---
    let audioCtx = null;
    const activeSynths = {
        rain: null,
        wind: null,
        forest: null
    };

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Sound 1: Rain Generator (White Noise + Filter)
    function startRainSynth() {
        const ctx = getAudioContext();
        
        // 1. Noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        // 2. Bandpass filter for rain droplets sound
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 800; // soft rain rumble

        // 3. Peak filter for high frequency dynamic splatters
        const peakFilter = ctx.createBiquadFilter();
        peakFilter.type = "peaking";
        peakFilter.frequency.value = 1600;
        peakFilter.Q.value = 1.0;
        peakFilter.gain.value = 5;

        // 4. LFO to modulate rain intensity (makes it feel alive)
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.08; // very slow cycle (12 seconds)
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 150;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        // 5. Gain Node
        const volumeNode = ctx.createGain();
        volumeNode.gain.value = 0.5;

        // Connections
        noise.connect(peakFilter);
        peakFilter.connect(filter);
        filter.connect(volumeNode);
        volumeNode.connect(ctx.destination);

        // Start
        noise.start(0);
        lfo.start(0);

        return {
            source: noise,
            lfo: lfo,
            volume: volumeNode
        };
    }

    // Sound 2: Wind Generator (Pink/Red Noise + Filter sweep)
    function startWindSynth() {
        const ctx = getAudioContext();
        
        // Pink noise approximation
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            let white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11; // rescue volume
            b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        // Bandpass Filter
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.Q.value = 3.0; // resonant wind whistling
        filter.frequency.value = 400;

        // LFO to sweep wind pitch
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.05; // 20s sweep
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 250;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        // Volume Node
        const volumeNode = ctx.createGain();
        volumeNode.gain.value = 0.4;

        noise.connect(filter);
        filter.connect(volumeNode);
        volumeNode.connect(ctx.destination);

        noise.start(0);
        lfo.start(0);

        return {
            source: noise,
            lfo: lfo,
            volume: volumeNode
        };
    }

    // Sound 3: Zen Forest/Birds (Additive/FM Synthesis bird tweets)
    function startForestSynth() {
        const ctx = getAudioContext();
        const masterVolume = ctx.createGain();
        masterVolume.gain.value = 0.3;
        masterVolume.connect(ctx.destination);

        let activeTimer = null;

        function triggerTweet() {
            if (ctx.state === "closed") return;
            
            const tweetLength = Math.random() * 0.8 + 0.3;
            const now = ctx.currentTime;

            // FM bird tweet synthesis
            const carrier = ctx.createOscillator();
            const modulator = ctx.createOscillator();
            const modGain = ctx.createGain();
            const ampGain = ctx.createGain();

            carrier.type = "sine";
            modulator.type = "sine";

            // Tweet frequencies
            const baseFreq = Math.random() * 1500 + 2000; // high frequency
            carrier.frequency.setValueAtTime(baseFreq, now);
            carrier.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + tweetLength);

            modulator.frequency.value = Math.random() * 80 + 20;
            modGain.gain.value = Math.random() * 300 + 100;

            ampGain.gain.setValueAtTime(0.0001, now);
            ampGain.gain.linearRampToValueAtTime(Math.random() * 0.15 + 0.05, now + 0.05);
            ampGain.gain.exponentialRampToValueAtTime(0.0001, now + tweetLength);

            // Connections
            modulator.connect(modGain);
            modGain.connect(carrier.frequency);
            carrier.connect(ampGain);
            ampGain.connect(masterVolume);

            // Start & Stop
            modulator.start(now);
            carrier.start(now);

            modulator.stop(now + tweetLength);
            carrier.stop(now + tweetLength);

            // Schedule next chirp
            const delay = Math.random() * 4000 + 2000; // every 2-6 seconds
            activeTimer = setTimeout(triggerTweet, delay);
        }

        triggerTweet();

        return {
            volume: masterVolume,
            stop: () => {
                clearTimeout(activeTimer);
            }
        };
    }

    // Sound 4: Temple Chime (Additive Synth bell - One-shot)
    function playTempleChime() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        const mainVolume = ctx.createGain();
        mainVolume.gain.setValueAtTime(0.3, now);
        mainVolume.gain.exponentialRampToValueAtTime(0.0001, now + 8.0); // 8 second long ring

        // Chime Delay Node for spaciousness
        const delayNode = ctx.createDelay();
        delayNode.delayTime.value = 0.4;
        const delayFeedback = ctx.createGain();
        delayFeedback.gain.value = 0.3;

        delayNode.connect(delayFeedback);
        delayFeedback.connect(delayNode);
        mainVolume.connect(delayNode);
        delayNode.connect(ctx.destination);

        mainVolume.connect(ctx.destination);

        // Standard fundamental frequencies for a deep temple bell:
        // Fundamental around 110Hz, with rich unharmonic overtones
        const partials = [110, 165, 220, 275, 330, 440, 550, 660, 770];
        const gains = [1.0, 0.6, 0.4, 0.3, 0.2, 0.1, 0.08, 0.05, 0.03];

        partials.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(gains[idx] * 0.5, now);
            // Higher partials decay much faster
            const decayTime = 8.0 / (idx + 1);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

            osc.connect(gain);
            gain.connect(mainVolume);
            
            osc.start(now);
            osc.stop(now + 8.5);
        });
    }

    // Toggle Audio Buttons Event Listeners
    const toggleBtns = document.querySelectorAll(".sound-toggle-btn");
    toggleBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const type = this.getAttribute("data-sound");
            const slider = this.previousElementSibling;

            if (this.classList.contains("playing")) {
                // STOP SOUND
                this.classList.remove("playing");
                this.textContent = "Start";
                slider.disabled = true;

                if (type === "forest") {
                    if (activeSynths.forest) {
                        activeSynths.forest.stop();
                        activeSynths.forest = null;
                    }
                } else {
                    if (activeSynths[type]) {
                        activeSynths[type].source.stop();
                        activeSynths[type].lfo.stop();
                        activeSynths[type] = null;
                    }
                }
            } else {
                // START SOUND
                this.classList.add("playing");
                this.textContent = "Stop";
                slider.disabled = false;

                if (type === "rain") {
                    activeSynths.rain = startRainSynth();
                    activeSynths.rain.volume.gain.value = parseFloat(slider.value);
                } else if (type === "wind") {
                    activeSynths.wind = startWindSynth();
                    activeSynths.wind.volume.gain.value = parseFloat(slider.value);
                } else if (type === "forest") {
                    activeSynths.forest = startForestSynth();
                    activeSynths.forest.volume.gain.value = parseFloat(slider.value);
                }
            }
        });
    });

    // Volume Sliders Event Listeners
    const sliders = document.querySelectorAll(".sound-volume-slider");
    sliders.forEach((slider) => {
        slider.addEventListener("input", function () {
            const row = this.closest(".sound-control-row");
            const btn = row.querySelector(".sound-toggle-btn");
            const type = btn.getAttribute("data-sound");

            if (activeSynths[type]) {
                activeSynths[type].volume.gain.value = parseFloat(this.value);
            }
        });
    });

    // Chime trigger
    const bellBtn = document.getElementById("play-bell-btn");
    if (bellBtn) {
        bellBtn.addEventListener("click", () => {
            playTempleChime();
        });
    }


    // --- Pomodoro Timer Logic ---
    let timerInterval = null;
    let timerMinutes = 25;
    let timerSeconds = 0;
    let timerTotalSeconds = 25 * 60;
    let isRunning = false;
    let currentMode = "focus"; // focus, short-break, long-break

    const timerDigits = document.getElementById("timer-time");
    const timerStatus = document.getElementById("timer-status");
    const timerProgress = document.getElementById("timer-progress");
    const playPauseBtn = document.getElementById("timer-start-pause");
    const resetBtn = document.getElementById("timer-reset");
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    const presetBtns = document.querySelectorAll(".preset-btn");

    function updateTimerUI() {
        // Digits
        const minsStr = String(timerMinutes).padStart(2, '0');
        const secsStr = String(timerSeconds).padStart(2, '0');
        timerDigits.textContent = `${minsStr}:${secsStr}`;

        // Ring progress
        // Total dasharray = 615.75
        const secondsRemaining = timerMinutes * 60 + timerSeconds;
        const fraction = secondsRemaining / timerTotalSeconds;
        const offset = 615.75 - (615.75 * fraction);
        timerProgress.style.strokeDashoffset = offset;
    }

    function toggleTimer() {
        if (isRunning) {
            // PAUSE
            clearInterval(timerInterval);
            isRunning = false;
            playIcon.classList.remove("d-none");
            pauseIcon.classList.add("d-none");
        } else {
            // START
            // Unlock audio context in case it is blocked
            getAudioContext();

            isRunning = true;
            playIcon.classList.add("d-none");
            pauseIcon.classList.remove("d-none");

            timerInterval = setInterval(() => {
                if (timerSeconds === 0) {
                    if (timerMinutes === 0) {
                        // Timer completed
                        clearInterval(timerInterval);
                        isRunning = false;
                        playIcon.classList.remove("d-none");
                        pauseIcon.classList.add("d-none");
                        
                        // Chime bell on completion
                        playTempleChime();

                        // Auto-toggle to next mode alert (optional)
                        alert(`Time's up! Your ${currentMode.replace('-', ' ')} session has completed.`);
                        resetTimer();
                        return;
                    }
                    timerMinutes--;
                    timerSeconds = 59;
                } else {
                    timerSeconds--;
                }
                updateTimerUI();
            }, 1000);
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        playIcon.classList.remove("d-none");
        pauseIcon.classList.add("d-none");

        if (currentMode === "focus") {
            timerMinutes = 25;
        } else if (currentMode === "short-break") {
            timerMinutes = 5;
        } else {
            timerMinutes = 15;
        }
        timerSeconds = 0;
        timerTotalSeconds = timerMinutes * 60;
        updateTimerUI();
    }

    if (playPauseBtn) playPauseBtn.addEventListener("click", toggleTimer);
    if (resetBtn) resetBtn.addEventListener("click", resetTimer);

    presetBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            presetBtns.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");

            currentMode = this.getAttribute("data-mode");
            const minutes = parseInt(this.getAttribute("data-minutes"));
            
            let label = "Focus Session";
            if (currentMode === "short-break") label = "Short Break";
            if (currentMode === "long-break") label = "Long Break";
            timerStatus.textContent = label;

            timerMinutes = minutes;
            timerSeconds = 0;
            timerTotalSeconds = minutes * 60;
            clearInterval(timerInterval);
            isRunning = false;
            playIcon.classList.remove("d-none");
            pauseIcon.classList.add("d-none");

            updateTimerUI();
        });
    });

    // Initial update
    if (timerDigits) updateTimerUI();


    // --- Zen Garden Task Board AJAX Logic ---
    const addTaskForm = document.getElementById("add-task-form");
    const taskTitleInput = document.getElementById("task-title");
    const taskPrioritySelect = document.getElementById("task-priority");
    const tasksUl = document.getElementById("tasks-ul");
    const completedCountLabel = document.getElementById("completed-count");
    const totalCountLabel = document.getElementById("total-count");

    function updateTaskCounters() {
        const allTasks = tasksUl.querySelectorAll(".task-item");
        const completedTasks = tasksUl.querySelectorAll(".task-item.completed");
        
        const total = allTasks.length;
        const completed = completedTasks.length;

        if (totalCountLabel) totalCountLabel.textContent = total;
        if (completedCountLabel) completedCountLabel.textContent = completed;

        // If list is empty, show empty state message
        const noTasksMsg = tasksUl.querySelector(".no-tasks");
        if (total === 0) {
            if (!noTasksMsg) {
                tasksUl.innerHTML = `
                    <li class="no-tasks">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <p>No tasks remaining. Your garden is clear and tranquil.</p>
                    </li>
                `;
            }
        } else {
            if (noTasksMsg) {
                noTasksMsg.remove();
            }
        }
    }

    if (addTaskForm) {
        addTaskForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const title = taskTitleInput.value.trim();
            const priority = taskPrioritySelect.value;

            if (!title) return;

            const payload = {
                title: title,
                priority: priority,
                isCompleted: false
            };

            fetch("/api/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Failed to add task");
            })
            .then(task => {
                // Add to DOM list
                const li = document.createElement("li");
                li.className = "task-item";
                li.setAttribute("data-id", task.id);
                li.setAttribute("data-priority", task.priority);
                li.style.opacity = 0;
                li.style.transform = "translateY(10px)";
                li.style.transition = "all 0.3s ease";

                li.innerHTML = `
                    <div class="task-main">
                        <label class="custom-checkbox">
                            <input type="checkbox" class="task-toggle">
                            <span class="checkmark"></span>
                        </label>
                        <div class="task-details">
                            <span class="task-text">${task.title}</span>
                            <span class="task-badge badge-${task.priority.toLowerCase()}">${task.priority}</span>
                        </div>
                    </div>
                    <button class="delete-task-btn" title="Delete Task">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                `;

                // Remove "no tasks" message if it exists
                const noTasks = tasksUl.querySelector(".no-tasks");
                if (noTasks) noTasks.remove();

                tasksUl.appendChild(li);
                
                // Trigger entry animation
                setTimeout(() => {
                    li.style.opacity = 1;
                    li.style.transform = "translateY(0)";
                }, 10);

                taskTitleInput.value = "";
                updateTaskCounters();
            })
            .catch(err => console.error("Error creating task:", err));
        });
    }

    // Toggle Task Event Delegation
    if (tasksUl) {
        tasksUl.addEventListener("change", function (e) {
            if (e.target && e.target.classList.contains("task-toggle")) {
                const li = e.target.closest(".task-item");
                const taskId = li.getAttribute("data-id");

                fetch(`/api/task/toggle/${taskId}`, {
                    method: "POST"
                })
                .then(res => {
                    if (res.ok) {
                        li.classList.toggle("completed");
                        updateTaskCounters();
                    } else {
                        e.target.checked = !e.target.checked; // revert
                        console.error("Failed to toggle task");
                    }
                })
                .catch(err => {
                    e.target.checked = !e.target.checked; // revert
                    console.error("Error toggling task:", err);
                });
            }
        });

        // Delete Task Event Delegation
        tasksUl.addEventListener("click", function (e) {
            const deleteBtn = e.target.closest(".delete-task-btn");
            if (deleteBtn) {
                const li = deleteBtn.closest(".task-item");
                const taskId = li.getAttribute("data-id");

                fetch(`/api/task/${taskId}`, {
                    method: "DELETE"
                })
                .then(res => {
                    if (res.ok) {
                        // Exit animation
                        li.style.opacity = 0;
                        li.style.transform = "translateX(30px)";
                        setTimeout(() => {
                            li.remove();
                            updateTaskCounters();
                        }, 300);
                    } else {
                        console.error("Failed to delete task");
                    }
                })
                .catch(err => console.error("Error deleting task:", err));
            }
        });
    }

    // Run counters update initially
    updateTaskCounters();
});
