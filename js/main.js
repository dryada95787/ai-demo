/* ============================================
   AI Demo Website - Interactive Logic
   ============================================ */

// ============================================
// State Management
// ============================================
const state = {
    currentCase: 0,
    totalCases: 6,
    completedCases: new Set(),
    sliderDragging: false
};

// ============================================
// DOM Elements
// ============================================
let elements = {};

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    elements = {
        progressBar: document.querySelector('.progress-fill'),
        currentCaseDisplay: document.getElementById('currentCase'),
        startBtn: document.getElementById('startBtn'),
        restartBtn: document.getElementById('restartDemo')
    };
    initLanguageSwitcher();
    initNavigation();
    initSlider();
    initMaintenanceDemo();
    initServiceDemo();
    initOfficeDemo();
    initSalesDemo();
    initHRGenDemo();
    initSummary();
    initWhyAINow();
    initROIDashboard();
    initHITLProtocol();

    // Observe sections for progress tracking
    observeSections();
});

// ============================================
// Language Switcher
// ============================================
function initLanguageSwitcher() {
    const switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    const langBtns = switcher.querySelectorAll('[data-lang-btn]');
    const savedLang = localStorage.getItem('ai-demo-lang') || 'zh';

    setLanguage(savedLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.langBtn;
            setLanguage(lang);
            localStorage.setItem('ai-demo-lang', lang);
        });
    });
}

function setLanguage(lang) {
    const html = document.documentElement;
    html.setAttribute('data-lang', lang);

    // Update button states
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.langBtn === lang);
    });

    // Update page title
    const title = document.querySelector('title');
    if (title) {
        title.textContent = lang === 'zh' ? title.dataset.zh : title.dataset.en;
    }

    // Update simple bilingual text elements
    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
        el.textContent = lang === 'zh' ? el.dataset.zh : el.dataset.en;
    });

    // Update input values with data-value attributes
    const inputs = document.querySelectorAll('input[data-value-zh]');
    inputs.forEach(input => {
        const val = lang === 'zh' ? input.getAttribute('data-value-zh') : input.getAttribute('data-value-en');
        if (val) input.value = val;
    });

    // Toggle visibility for complex HTML blocks
    document.querySelectorAll('.lang-zh').forEach(el => {
        if (lang === 'zh') {
            el.classList.remove('hidden');
            el.style.display = '';
        } else {
            el.classList.add('hidden');
            el.style.display = 'none';
        }
    });

    document.querySelectorAll('.lang-en').forEach(el => {
        if (lang === 'en') {
            el.classList.remove('hidden');
            el.style.display = '';
        } else {
            el.classList.add('hidden');
            el.style.display = 'none';
        }
    });
}

// ============================================
// Why AI Now Section
// ============================================
function initWhyAINow() {
    const section = document.getElementById('whyAINow');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add('visible');
                // Animate stat cards
                section.querySelectorAll('.why-stat-card').forEach((card, i) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, i * 200);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(section);
}

// ============================================
// ROI Dashboard Section
// ============================================
function initROIDashboard() {
    const section = document.getElementById('roiDashboard');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate ROI table rows
                section.querySelectorAll('.roi-row').forEach((row, i) => {
                    setTimeout(() => {
                        row.classList.add('animate-in');
                    }, i * 300);
                });

                // Animate bottom line stat
                setTimeout(() => {
                    const bottomLine = section.querySelector('.roi-bottom-line');
                    if (bottomLine) {
                        bottomLine.classList.add('animate-in');
                    }
                }, 1200);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(section);
}

// ============================================
// HITL Protocol Section
// ============================================
function initHITLProtocol() {
    const section = document.getElementById('hitlProtocol');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate protocol steps
                section.querySelectorAll('.hitl-step').forEach((step, i) => {
                    setTimeout(() => {
                        step.classList.add('animate-in');
                    }, i * 400);
                });

                // Show connecting lines after steps appear
                setTimeout(() => {
                    section.querySelectorAll('.hitl-connector').forEach(connector => {
                        connector.classList.add('animate-in');
                    });
                }, 1600);

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(section);
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    // Start button
    elements.startBtn?.addEventListener('click', () => {
        document.getElementById('whyAINow')?.scrollIntoView({ behavior: 'smooth' });
    });

    // Next case buttons
    document.querySelectorAll('.next-case-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextId = btn.dataset.next;
            document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Restart button
    elements.restartBtn?.addEventListener('click', () => {
        resetAllDemos();
        document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
    });
}

function updateProgress() {
    // Progress based on CURRENT VIEWED PAGE (scroll position)
    // Formula: (Current Index + 1) / Total Sections * 100
    const sections = document.querySelectorAll('section');
    const total = sections.length;
    // Find current active section index
    let currentIndex = 0;
    sections.forEach((sec, index) => {
        if (sec.classList.contains('active-section')) {
            currentIndex = index;
        }
    });

    // Update total count display
    const totalDisplay = document.getElementById('totalCases');
    if (totalDisplay) totalDisplay.textContent = total;

    const progress = ((currentIndex + 1) / total) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.currentCaseDisplay.textContent = currentIndex + 1;
}

function observeSections() {
    // Observe ALL sections to track "page" progress
    const allSections = document.querySelectorAll('section');
    const totalDisplay = document.getElementById('totalCases');
    if (totalDisplay) totalDisplay.textContent = allSections.length;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Mark current section as active
                allSections.forEach(s => s.classList.remove('active-section'));
                entry.target.classList.add('active-section');

                // Update progress immediately
                updateProgress();
            }
        });
    }, { threshold: 0.2 }); // Low threshold to catch section entry early

    allSections.forEach(section => {
        observer.observe(section);
    });
}

// ============================================
// Case 1: Reconciliation Challenge (Redesigned)
// ============================================
let reconciliationTimer = null;
let reconciliationSeconds = 0;

function initSlider() {
    // This function now initializes the reconciliation demo instead of slider
    initReconciliationDemo();
}

function initReconciliationDemo() {
    const giveUpBtn = document.getElementById('giveUpBtn');
    const manualChallenge = document.getElementById('manualChallenge');
    const aiSolution = document.getElementById('aiSolution');
    const reconciliationResult = document.getElementById('reconciliationResult');
    const timerDisplay = document.getElementById('manualTimer');
    const nextCase1Btn = document.getElementById('nextCase1Btn');

    if (!giveUpBtn) return;

    // Timer removed - now focus on speed/accuracy comparison

    // Give up button click
    // Give up button click
    giveUpBtn.addEventListener('click', () => {
        // Stop timer
        if (typeof reconciliationTimer !== 'undefined') clearInterval(reconciliationTimer);

        // Hide challenge, show AI solution
        if (manualChallenge) manualChallenge.classList.add('hidden');
        if (aiSolution) aiSolution.classList.remove('hidden');

        // Animate comparison count
        const countElZh = document.getElementById('comparisonCount');
        const countElEn = document.getElementById('comparisonCountEn');
        let count = 0;
        const target = 2847;
        const duration = 1500; // 1.5 seconds
        const intervalTime = 30;
        const steps = duration / intervalTime;
        const increment = Math.ceil(target / steps);

        const countInterval = setInterval(() => {
            count += increment;
            // Add some "jitter" for realism
            count += Math.floor(Math.random() * 50) - 25;

            if (count >= target) {
                count = target;
                clearInterval(countInterval);

                // Update text one last time
                if (countElZh) countElZh.textContent = count.toLocaleString();
                if (countElEn) countElEn.textContent = count.toLocaleString();

                // Show result after AI "finishes"
                setTimeout(() => {
                    if (aiSolution) aiSolution.classList.add('hidden');
                    if (reconciliationResult) reconciliationResult.classList.remove('hidden');

                    // Show next button
                    const nextBtn = document.getElementById('nextCase1Btn');
                    if (nextBtn) nextBtn.classList.remove('hidden');

                    // Mark case as completed
                    if (state && state.completedCases) {
                        state.completedCases.add(1);
                        updateProgress();
                    }

                    // Play success sound
                    playSound('complete');
                }, 500);
            } else {
                // Formatting
                if (countElZh) countElZh.textContent = count.toLocaleString();
                if (countElEn) countElEn.textContent = count.toLocaleString();
            }
        }, intervalTime);
    });
}

function startReconciliationTimer(display) {
    reconciliationSeconds = 0;
    reconciliationTimer = setInterval(() => {
        reconciliationSeconds++;
        display.textContent = formatTime(reconciliationSeconds);

        const lang = document.documentElement.getAttribute('data-lang') || 'zh';

        // Update hint after certain time
        if (reconciliationSeconds === 15) {
            const hint = document.getElementById('challengeHint');
            if (hint) {
                if (lang === 'zh') {
                    hint.innerHTML = '⏰ 已經 15 秒了...還沒找到嗎？要不要讓 AI 幫忙？';
                } else {
                    hint.innerHTML = '⏰ 15 seconds passed... Still looking? Want AI help?';
                }
                hint.style.background = 'rgba(255, 107, 107, 0.1)';
            }
        }

        if (reconciliationSeconds === 30) {
            const hint = document.getElementById('challengeHint');
            if (hint) {
                if (lang === 'zh') {
                    hint.innerHTML = '😰 30 秒了！真實情況是 2,847 筆交易...這樣對一個月要花 40 小時！';
                } else {
                    hint.innerHTML = '😰 30 seconds! Real case: 2,847 records... That takes 40 hours/month!';
                }
                hint.style.color = 'var(--danger)';
            }
        }
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function showSavings(element, caseNum) {
    element.classList.add('visible');
    const counter = element.querySelector('.amount-value');
    if (counter) {
        animateCounter(counter);
    }
    state.completedCases.add(caseNum);
    updateProgress();

    // Confetti effect
    createConfetti(element);
}


// ============================================
// Case 2: Resume Demo
// ============================================
function initResumeDemo() {
    const uploadZone = document.getElementById('resumeUpload');
    const sampleBtn = document.getElementById('useSampleResume');
    const processing = document.getElementById('resumeProcessing');
    const result = document.getElementById('resumeResult');

    if (!uploadZone || !sampleBtn) return;

    const startDemo = () => {
        uploadZone.classList.add('hidden');
        processing.classList.remove('hidden');

        setTimeout(() => {
            processing.classList.add('hidden');
            result.classList.remove('hidden');

            // Animate cards appearing
            const cards = result.querySelectorAll('.resume-card');
            cards.forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    if (card.classList.contains('best-match')) {
                        card.style.transform = 'scale(1.05)';
                        playSound('success');
                    }
                }, i * 200);
            });

            state.completedCases.add(2);
            updateProgress();
        }, 2000);
    };

    sampleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startDemo();
    });

    uploadZone.addEventListener('click', startDemo);
}

// ============================================
// Case 3: Maintenance Demo
// ============================================
// ============================================
// Case 3: Maintenance Demo (Enhanced)
// ============================================
function initMaintenanceDemo() {
    const searchInput = document.getElementById('errorSearchInput');
    const searchBtn = document.getElementById('searchSolutionBtn');
    const result = document.getElementById('knowledgeResult');

    if (!searchBtn) return;

    searchBtn.addEventListener('click', () => {
        searchBtn.disabled = true;
        const lang = document.documentElement.getAttribute('data-lang') || 'zh';
        searchBtn.innerHTML = lang === 'zh' ? '搜尋中...' : 'Searching...';

        const currentLang = document.documentElement.getAttribute('data-lang') || 'zh';

        setTimeout(() => {
            result.classList.remove('hidden');
            result.style.animation = 'fadeInUp 0.5s ease';

            // Set content with correct visibility classes initially
            searchBtn.innerHTML = `
                <span class="lang-zh${currentLang === 'zh' ? '' : ' hidden'}">搜尋完成</span>
                <span class="lang-en${currentLang === 'en' ? '' : ' hidden'}">Search Complete</span>
            `;

            state.completedCases.add(2);
            updateProgress();
            playSound('ping');
        }, 800);
    });
}

// ============================================
// Case 4: Invoice Demo (renumbered to Case 8)
// ============================================

// FUNCTION 1: Scan Animation (CSS-based)
function startScanAnimation(scanLine, duration = 2500) {
    return new Promise(resolve => {
        if (scanLine) {
            scanLine.style.animation = 'none';
            scanLine.offsetHeight; // Trigger reflow
            scanLine.style.animation = `scanDownFull ${duration / 1000}s ease-in-out forwards`;
        }
        setTimeout(resolve, duration);
    });
}

// FUNCTION 2: Label Display Logic
function showRecognitionLabels(resultContainer, callback) {
    const boxes = resultContainer.querySelectorAll('.recog-box');
    const dataValues = resultContainer.querySelectorAll('.data-value');
    const lang = document.documentElement.getAttribute('data-lang') || 'zh';

    // Clear any previous glow effects
    const existingGlows = resultContainer.querySelectorAll('.svg-text-glow');
    existingGlows.forEach(el => el.classList.remove('svg-text-glow'));

    // Hide all recognition boxes initially
    boxes.forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'scale(0.5)';
        box.style.transition = 'none';
    });

    // Labels appear sequentially with staggered animation
    const LABEL_DELAY = 300;  // First label delay
    const LABEL_STAGGER = 500; // Time between labels

    boxes.forEach((box, i) => {
        setTimeout(() => {
            box.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            box.style.opacity = '1';
            box.style.transform = 'scale(1)';

            // Trigger SVG Text Highlighting
            const targetId = box.dataset.target;
            if (targetId) {
                if (targetId === 'invoice-item') {
                    // Highlight logic for multiple items
                    const items = resultContainer.querySelectorAll('.invoice-item');
                    items.forEach(item => item.classList.add('svg-text-glow'));
                } else {
                    // Highlight logic for specific ID
                    const targetEl = resultContainer.querySelector(`#${targetId}`);
                    if (targetEl) targetEl.classList.add('svg-text-glow');
                }
            }

            playSound('ping');
        }, LABEL_DELAY + (i * LABEL_STAGGER));
    });

    // Typewriter effect for extracted data - starts after all boxes appear
    const boxesDelay = LABEL_DELAY + (boxes.length * LABEL_STAGGER);

    dataValues.forEach((el, i) => {
        let text = el.dataset.text;
        if (el.dataset.textZh && el.dataset.textEn) {
            text = lang === 'zh' ? el.dataset.textZh : el.dataset.textEn;
        }
        el.textContent = '';
        setTimeout(() => {
            typewriterEffect(el, text);
        }, boxesDelay + (i * 400));
    });

    // Callback after all animations complete
    const totalDuration = boxesDelay + (dataValues.length * 400) + 500;
    setTimeout(callback, totalDuration);
}

function initInvoiceDemo() {
    const dropZone = document.getElementById('invoiceDropZone');
    const sampleBtn = document.getElementById('useSampleInvoice');
    const processing = document.getElementById('invoiceProcessing');
    const result = document.getElementById('invoiceResult');

    if (!dropZone || !sampleBtn) return;

    const startDemo = async () => {
        dropZone.parentElement.classList.add('hidden');
        processing.classList.remove('hidden');

        const scanLine = processing.querySelector('.scan-line');

        // PHASE 1: Run scan animation
        await startScanAnimation(scanLine, 2500);

        // PHASE 2: Show result page after scan completes
        processing.classList.add('hidden');
        result.classList.remove('hidden');

        // PHASE 3: Show recognition labels
        showRecognitionLabels(result, () => {
            state.completedCases.add(8);
            updateProgress();
        });
    };

    sampleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startDemo();
    });

    // Drag and drop visual feedback
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--accent)';
        dropZone.style.background = 'rgba(78, 205, 196, 0.1)';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '';
        dropZone.style.background = '';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        startDemo();
    });
}

// ============================================
// Case 5: Quality Inspection Demo
// ============================================
function initQualityDemo() {
    const startBtn = document.getElementById('startInspection');
    const productItems = document.querySelectorAll('.product-item');
    const result = document.getElementById('inspectionResult');

    if (!startBtn) return;

    startBtn.addEventListener('click', () => {
        startBtn.disabled = true;
        const lang = document.documentElement.getAttribute('data-lang') || 'zh';
        startBtn.textContent = lang === 'zh' ? '檢測中...' : 'Inspecting...';

        // Animate scanning each product
        let delay = 0;
        productItems.forEach((item, i) => {
            setTimeout(() => {
                item.classList.add('scanned');
                item.style.transition = 'all 0.3s ease';

                // Check if defect
                const hasDefect = item.dataset.defect === 'true';
                if (hasDefect) {
                    setTimeout(() => {
                        item.classList.add('defect-found');
                        const marker = item.querySelector('.defect-marker');
                        if (marker) {
                            marker.classList.remove('hidden');
                            const pos = item.dataset.defectPos?.split(',') || ['50', '50'];
                            marker.style.left = `${pos[0]}%`;
                            marker.style.top = `${pos[1]}%`;
                        }
                        playSound('alert');
                    }, 200);
                } else {
                    playSound('ping');
                }
            }, delay);
            delay += 400;
        });

        // Show results
        setTimeout(() => {
            result.classList.remove('hidden');
            result.style.animation = 'fadeInUp 0.5s ease';
            const currentLang = document.documentElement.getAttribute('data-lang') || 'zh';
            startBtn.innerHTML = `
                <span class="lang-zh${currentLang === 'zh' ? '' : ' hidden'}">檢測完成 ✓</span>
                <span class="lang-en${currentLang === 'en' ? '' : ' hidden'}">Complete ✓</span>
            `;

            state.completedCases.add(5);
            updateProgress();
        }, delay + 500);
    });
}

// ============================================
// Case 6: Customer Service Demo (renumbered to Case 9)
// ============================================
function initServiceDemo() {
    const generateBtn = document.getElementById('generateReply');
    const replyDisplay = document.getElementById('replyDisplay');
    const replyContent = document.getElementById('replyContent');
    const toneBtns = document.querySelectorAll('#case6 .tone-btn');
    const approveBtn = document.querySelector('#case6 .reply-action-btn.approve');
    const editBtn = document.querySelector('#case6 .reply-action-btn.edit');
    const replyToneLabel = document.querySelector('#case6 .reply-tone');

    let currentTone = 'professional';
    let hasGenerated = false;
    let isGenerating = false;

    // Reply content templates by tone
    const replies = {
        professional: {
            zh: `親愛的顧客您好：

非常感謝您聯繫我們，對於產品使用上遇到的問題，我們深感抱歉。

我們非常重視您的反饋，並已記錄您的情況。根據公司政策，您可以選擇以下方案：

✓ 方案一：免費更換全新產品
✓ 方案二：全額退款

請您回覆偏好的處理方式，我們將在 24 小時內完成處理。

再次為造成的不便致歉，感謝您的諒解與支持。

服務專員 敬上`,
            en: `Dear Customer,

Thank you for reaching out. We sincerely apologize for the issues you've experienced.

We value your feedback. Per our policy, you may choose:

✓ Option 1: Free Replacement
✓ Option 2: Full Refund

Please reply with your preference. We will process within 24 hours.

Customer Service Team`
        },
        friendly: {
            zh: `嗨～您好！

收到您的訊息了！真的很抱歉讓您遇到這麼不愉快的經驗 😢

別擔心，我們會全力幫您處理！您可以選擇：
🔄 換新品（免費！）
💰 或全額退費

只需回覆告訴我您想要哪個方案，我們馬上為您安排！

有任何問題隨時找我們 💪

您的小幫手 敬上`,
            en: `Hi there!

Got your message! So sorry you had this experience 😢

Don't worry, we've got you! Choose:
🔄 Free replacement
💰 Or full refund

Just reply with your choice and we'll get it done ASAP!

Cheers,
Your Support Buddy`
        },
        concise: {
            zh: `您好，

已收到退款申請。處理方案如下：
• 選項 A：換新
• 選項 B：退款

請回覆選擇，24 小時內完成。

客服部`,
            en: `Hello,

Request received. Options:
• A: Replacement
• B: Refund

Reply with choice. Done in 24h.

Support`
        }
    };

    // Tone labels
    const toneLabels = {
        professional: { zh: '語氣：專業正式', en: 'Tone: Professional' },
        friendly: { zh: '語氣：親切熱情', en: 'Tone: Friendly' },
        concise: { zh: '語氣：簡潔有力', en: 'Tone: Concise' }
    };

    // Core generate function - reusable for both button and tone switch
    function generateReply(showLoadingDelay = true) {
        if (isGenerating) return;
        isGenerating = true;

        const lang = document.documentElement.getAttribute('data-lang') || 'zh';

        // Show loading state
        if (generateBtn) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = lang === 'zh'
                ? '<span class="btn-icon">⏳</span> AI 正在分析...'
                : '<span class="btn-icon">⏳</span> AI Analyzing...';
        }

        // Add loading state to reply content
        if (hasGenerated) {
            replyContent.style.opacity = '0.5';
            replyContent.innerHTML = lang === 'zh' ? '<em>切換語氣中...</em>' : '<em>Switching tone...</em>';
        }

        const delay = showLoadingDelay ? (hasGenerated ? 800 : 1500) : 300;

        setTimeout(() => {
            replyDisplay.classList.remove('hidden');
            replyContent.style.opacity = '1';

            // Update tone label
            if (replyToneLabel) {
                replyToneLabel.innerHTML = `
                    <span class="lang-zh">${toneLabels[currentTone].zh}</span>
                    <span class="lang-en">${toneLabels[currentTone].en}</span>
                `;
            }

            const replyText = replies[currentTone][lang];

            typewriterEffect(replyContent, replyText, () => {
                if (generateBtn) {
                    generateBtn.innerHTML = lang === 'zh'
                        ? '<span class="btn-icon">✓</span> 回覆已生成'
                        : '<span class="btn-icon">✓</span> Reply Generated';
                    generateBtn.disabled = false;
                }
                hasGenerated = true;
                isGenerating = false;
                state.completedCases.add(6);
                updateProgress();
            }, 15);

        }, delay);
    }

    // Tone button click handlers - AUTO REGENERATE on switch
    toneBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newTone = btn.dataset.tone;
            if (newTone === currentTone) return; // No change needed

            // Update active state
            toneBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTone = newTone;

            // If content was already generated, regenerate with new tone
            if (hasGenerated) {
                generateReply(true);
            }
        });
    });

    if (!generateBtn) return;

    // Main generate button click
    generateBtn.addEventListener('click', () => {
        generateReply(true);
    });

    // Copy button handler
    approveBtn?.addEventListener('click', () => {
        const text = replyContent.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const lang = document.documentElement.getAttribute('data-lang') || 'zh';
            const originalHTML = approveBtn.innerHTML;
            approveBtn.innerHTML = lang === 'zh' ? '<span>✓</span> 已複製' : '<span>✓</span> Copied';
            setTimeout(() => {
                approveBtn.innerHTML = originalHTML;
            }, 2000);
        });
    });

    // Edit button handler
    editBtn?.addEventListener('click', () => {
        replyContent.setAttribute('contenteditable', 'true');
        replyContent.focus();
        replyContent.style.border = '2px solid var(--accent)';
        replyContent.style.padding = 'var(--space-md)';
        replyContent.style.borderRadius = 'var(--radius-md)';

        const lang = document.documentElement.getAttribute('data-lang') || 'zh';
        editBtn.innerHTML = lang === 'zh' ? '<span>✎</span> 編輯中...' : '<span>✎</span> Editing...';
    });
}

// ============================================
// Summary Page with Dynamic Calculation
// ============================================

// BENCHMARK CONSTANTS - Industry average standards
const BENCHMARKS = {
    // Time savings per case type (hours saved per month)
    caseSavings: {
        1: { hours: 40, name: 'Reconciliation' },      // 對帳
        2: { hours: 8, name: 'Maintenance Search' },   // 維修搜尋
        3: { hours: 30, name: 'Office Documents' },    // 辦公文書
        4: { hours: 15, name: 'Sales Email' },         // 業務郵件
        5: { hours: 15, name: 'HR Content' },          // HR 文案
        6: { hours: 20, name: 'Customer Service' }     // 客服回信
    },
    // Cost calculation
    hourlyRate: 600,           // NT$ per hour (average office worker)
    aiToolCost: 2000,          // NT$ per month for AI tools
    errorReductionBase: 95     // Base error reduction percentage
};

let summaryAnimated = false;

// Calculate dynamic savings based on completed cases
function calculateSavings() {
    const completedCases = Array.from(state.completedCases);
    let totalHours = 0;

    // Sum up hours for each completed case
    completedCases.forEach(caseNum => {
        if (BENCHMARKS.caseSavings[caseNum]) {
            totalHours += BENCHMARKS.caseSavings[caseNum].hours;
        }
    });

    // If no cases completed, show potential total
    if (totalHours === 0) {
        totalHours = Object.values(BENCHMARKS.caseSavings)
            .reduce((sum, c) => sum + c.hours, 0);
    }

    const costSaved = totalHours * BENCHMARKS.hourlyRate - BENCHMARKS.aiToolCost;
    const errorReduction = Math.min(BENCHMARKS.errorReductionBase + (completedCases.length * 0.5), 99);

    return {
        hours: totalHours,
        cost: Math.max(costSaved, 0),
        errorReduction: Math.round(errorReduction)
    };
}

function triggerSummaryCounters() {
    if (summaryAnimated) return;
    summaryAnimated = true;

    const summarySection = document.getElementById('summary');
    if (!summarySection) return;

    // Use static percentages from HTML


    const counters = summarySection.querySelectorAll('.counter');
    counters.forEach(counter => {
        animateCounter(counter);
    });
}

function initSummary() {
    const summarySection = document.getElementById('summary');
    if (!summarySection) return;

    // Method 1: IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                triggerSummaryCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(summarySection);

    // Method 2: Also trigger when clicking "查看總結" button
    document.querySelectorAll('.next-case-btn').forEach(btn => {
        if (btn.dataset.next === 'summary') {
            btn.addEventListener('click', () => {
                // Trigger after scroll animation completes
                setTimeout(triggerSummaryCounters, 800);
            });
        }
    });

    // Method 3: Fallback - check scroll position periodically
    const checkSummaryVisible = () => {
        const rect = summarySection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            triggerSummaryCounters();
        }
    };

    window.addEventListener('scroll', checkSummaryVisible);

    // Method 4: Also trigger on hash change
    window.addEventListener('hashchange', () => {
        if (window.location.hash === '#summary') {
            setTimeout(triggerSummaryCounters, 500);
        }
    });
}

// ============================================
// Case 7: Office Document Demo
// ============================================
function initOfficeDemo() {
    const btn = document.getElementById('processDocBtn');
    const result = document.getElementById('docResult');

    if (!btn) return;

    btn.addEventListener('click', () => {
        btn.disabled = true;
        const lang = document.documentElement.getAttribute('data-lang') || 'zh';
        btn.innerHTML = lang === 'zh' ? '處理中...' : 'Processing...';

        setTimeout(() => {
            result.classList.remove('hidden');
            result.style.animation = 'fadeInUp 0.5s ease';
            const currentLang = document.documentElement.getAttribute('data-lang') || 'zh';
            btn.innerHTML = `
                <span class="lang-zh${currentLang === 'zh' ? '' : ' hidden'}">完成 ✓</span>
                <span class="lang-en${currentLang === 'en' ? '' : ' hidden'}">Done ✓</span>
            `;

            state.completedCases.add(3);
            updateProgress();
            playSound('ping');
        }, 1500);
    });
}

// ============================================
// Case 8: Sales Email Demo
// ============================================
function initSalesDemo() {
    const btn = document.getElementById('analyzeSalesBtn');
    const result = document.getElementById('salesResult');
    const draftContent = document.getElementById('salesDraft');

    if (!btn) return;

    btn.addEventListener('click', () => {
        btn.disabled = true;
        const lang = document.documentElement.getAttribute('data-lang') || 'zh';
        btn.innerHTML = lang === 'zh' ? '分析中...' : 'Analyzing...';

        setTimeout(() => {
            result.classList.remove('hidden');

            let draft = '';
            if (lang === 'zh') {
                draft = `您好，收到您的需求。\n\n根據您的預算(500萬)與上線時間(下個月)，我們推薦「A-500 自動化模組」。\n\n附件為同業成功案例，請參考。我們能否約明天下午 2 點電話討論細節？`;
            } else {
                draft = `Hi,\n\nBased on your budget (5M) and timeline (next month), we recommend 'A-500 Module'.\n\nAttached is a case study. Can we discuss tomorrow at 2 PM?`;
            }

            typewriterEffect(draftContent, draft, () => {
                const currentLang = document.documentElement.getAttribute('data-lang') || 'zh';
                btn.innerHTML = `
                    <span class="lang-zh${currentLang === 'zh' ? '' : ' hidden'}">完成 ✓</span>
                    <span class="lang-en${currentLang === 'en' ? '' : ' hidden'}">Done ✓</span>
                `;
                state.completedCases.add(4);
                updateProgress();
            });
        }, 1000);
    });
}

// ============================================
// Case 9: Meeting Summary Demo
// ============================================
function initMeetingDemo() {
    const btn = document.getElementById('summarizeMeetingBtn');
    const result = document.getElementById('meetingResult');

    if (!btn) return;

    btn.addEventListener('click', () => {
        btn.disabled = true;
        const lang = document.documentElement.getAttribute('data-lang') || 'zh';
        btn.innerHTML = lang === 'zh' ? '生成中...' : 'Generating...';

        setTimeout(() => {
            result.classList.remove('hidden');
            result.style.animation = 'fadeInUp 0.5s ease';
            const currentLang = document.documentElement.getAttribute('data-lang') || 'zh';
            btn.innerHTML = `
                <span class="lang-zh${currentLang === 'zh' ? '' : ' hidden'}">完成 ✓</span>
                <span class="lang-en${currentLang === 'en' ? '' : ' hidden'}">Done ✓</span>
            `;

            state.completedCases.add(9);
            updateProgress();
            playSound('ping');
        }, 1200);
    });
}

// ============================================
// Case 10: HR GenAI Demo (renumbered to Case 7)
// ============================================
function initHRGenDemo() {
    const btn = document.getElementById('generateHRBtn');
    const result = document.getElementById('hrResult');
    const content = document.getElementById('hrContent');
    const taskBtns = document.querySelectorAll('#caseHRGen .task-btn');
    const input = document.getElementById('hrInput');

    let currentTask = 'activity';

    // Default values for each task type (pre-filled, no user input needed)
    const defaultValues = {
        activity: { zh: '技術交流會', en: 'Tech Meetup' },
        notice: { zh: '新人報到公告', en: 'New Employee Welcome' }
    };

    // Set default value based on language and task
    function setDefaultValue() {
        const lang = document.documentElement.getAttribute('data-lang') || 'zh';
        if (input && defaultValues[currentTask]) {
            input.value = defaultValues[currentTask][lang];
        }
    }

    // Task button click handlers
    taskBtns.forEach(b => {
        b.addEventListener('click', () => {
            taskBtns.forEach(btnItem => btnItem.classList.remove('active'));
            b.classList.add('active');
            currentTask = b.dataset.task;

            // Reset for new task with new default value
            setDefaultValue();
            result.classList.add('hidden');
            content.textContent = '';
            btn.disabled = false;
            const lang = document.documentElement.getAttribute('data-lang') || 'zh';
            const currentLang = document.documentElement.getAttribute('data-lang') || 'zh';
            btn.innerHTML = `
                <span class="btn-icon">✨</span>
                <span class="lang-zh${currentLang === 'zh' ? '' : ' hidden'}">AI 自動生成</span>
                <span class="lang-en${currentLang === 'en' ? '' : ' hidden'}">AI Generate</span>
            `;
        });
    });

    if (!btn) return;

    // Keep the default value from HTML (don't clear it)

    btn.addEventListener('click', () => {
        if (!input.value) return;
        btn.disabled = true;
        result.classList.add('hidden');
        content.textContent = '';

        const lang = document.documentElement.getAttribute('data-lang') || 'zh';
        btn.innerHTML = lang === 'zh' ? '生成中...' : 'Generating...';

        setTimeout(() => {
            result.classList.remove('hidden');
            let text = '';

            // Auto-translate default input if needed
            if (defaultValues[currentTask]) {
                if (lang === 'en' && input.value === defaultValues[currentTask].zh) {
                    input.value = defaultValues[currentTask].en;
                } else if (lang === 'zh' && input.value === defaultValues[currentTask].en) {
                    input.value = defaultValues[currentTask].zh;
                }
            }

            // Content based on task and language
            if (currentTask === 'activity') {
                if (lang === 'zh') text = `【活動提案：${input.value}】\n\n目標：促進團隊技術交流\n形式：下午茶 + Lightning Talk\n預算：$500/人`;
                else text = `[Event: ${input.value}]\n\nGoal: Team technical sharing\nFormat: Tea time + Lightning Talk\nBudget: $20/person`;
            } else {
                if (lang === 'zh') text = `【公告】\n\n主旨：${input.value}\n\n各位同仁，\n\n很高興在此宣布...`;
                else text = `[Notice]\n\nSubject: ${input.value}\n\nDear Team,\n\nWe are thrilled to announce...`;
            }

            typewriterEffect(content, text, () => {
                const currentLang = document.documentElement.getAttribute('data-lang') || 'zh';
                btn.innerHTML = `
                    <span class="lang-zh${currentLang === 'zh' ? '' : ' hidden'}">完成 ✓</span>
                    <span class="lang-en${currentLang === 'en' ? '' : ' hidden'}">Done ✓</span>
                `;
                state.completedCases.add(5);
                updateProgress();
            }, 10);
        }, 1000);
    });
}

// ============================================
// Utility Functions
// ============================================
function typewriterEffect(element, text, callback, speed = 30) {
    element.textContent = '';
    let i = 0;

    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    };

    type();
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeOut);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

function createConfetti(container) {
    const colors = ['#4ECDC4', '#2ECC71', '#FFD93D', '#FF6B6B'];
    const rect = container.getBoundingClientRect();

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${rect.left + rect.width / 2 + (Math.random() - 0.5) * 100}px;
            top: ${rect.top + rect.height / 2}px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            z-index: 9999;
        `;

        document.body.appendChild(confetti);

        // Animate
        const angle = (Math.random() - 0.5) * Math.PI;
        const velocity = 5 + Math.random() * 10;
        let x = 0;
        let y = 0;
        let vy = -velocity;
        let rotation = 0;

        const animate = () => {
            vy += 0.3; // gravity
            x += Math.sin(angle) * 3;
            y += vy;
            rotation += 10;

            confetti.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
            confetti.style.opacity = 1 - y / 500;

            if (y < 500) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };

        setTimeout(() => requestAnimationFrame(animate), i * 20);
    }
}

function playSound(type) {
    // Sound effects (optional - can be enabled with actual audio files)
    // For now, just visual feedback
    if (type === 'success' || type === 'complete') {
        document.body.style.boxShadow = 'inset 0 0 100px rgba(46, 204, 113, 0.2)';
        setTimeout(() => {
            document.body.style.boxShadow = '';
        }, 300);
    } else if (type === 'alert') {
        document.body.style.boxShadow = 'inset 0 0 100px rgba(255, 107, 107, 0.2)';
        setTimeout(() => {
            document.body.style.boxShadow = '';
        }, 300);
    }
}

function resetAllDemos() {
    state.completedCases.clear();
    state.currentCase = 0;
    updateProgress();

    const lang = document.documentElement.getAttribute('data-lang') || 'zh';

    // 1. Reset Reconciliation Demo (Case 1)
    const manualChallenge = document.getElementById('manualChallenge');
    const aiSolution = document.getElementById('aiSolution');
    const reconciliationResult = document.getElementById('reconciliationResult');
    const nextCase1Btn = document.getElementById('nextCase1Btn');

    if (manualChallenge) manualChallenge.classList.remove('hidden');
    if (aiSolution) aiSolution.classList.add('hidden');
    if (reconciliationResult) reconciliationResult.classList.add('hidden');
    if (nextCase1Btn) nextCase1Btn.classList.add('hidden');

    // 2. Reset Maintenance Demo (Case 3)
    const searchBtn = document.getElementById('searchSolutionBtn');
    const knowledgeResult = document.getElementById('knowledgeResult');
    if (searchBtn) {
        searchBtn.disabled = false;
        searchBtn.innerHTML = lang === 'zh' ? '搜尋方案' : 'Search Solution';
    }
    if (knowledgeResult) knowledgeResult.classList.add('hidden');

    // 3. Reset Office Demo (Case Office)
    const processDocBtn = document.getElementById('processDocBtn');
    const docResult = document.getElementById('docResult');
    if (processDocBtn) {
        processDocBtn.disabled = false;
        processDocBtn.innerHTML = `
            <span class="btn-icon">⚡</span>
            <span class="lang-zh${lang === 'zh' ? '' : ' hidden'}">AI 自動分類與摘要</span>
            <span class="lang-en${lang === 'en' ? '' : ' hidden'}">AI Classify & Summarize</span>
        `;
    }
    if (docResult) docResult.classList.add('hidden');

    // 4. Reset Sales Demo (Case Sales)
    const analyzeSalesBtn = document.getElementById('analyzeSalesBtn');
    const salesResult = document.getElementById('salesResult');
    const salesDraft = document.getElementById('salesDraft');
    if (analyzeSalesBtn) {
        analyzeSalesBtn.disabled = false;
        analyzeSalesBtn.innerHTML = `
            <span class="btn-icon">🧠</span>
            <span class="lang-zh${lang === 'zh' ? '' : ' hidden'}">AI 分析與擬稿</span>
            <span class="lang-en${lang === 'en' ? '' : ' hidden'}">Analyze & Draft</span>
        `;
    }
    if (salesResult) salesResult.classList.add('hidden');
    if (salesDraft) salesDraft.innerHTML = '';

    // 5. Reset HR Gen Demo (Case HRGen)
    const generateHRBtn = document.getElementById('generateHRBtn');
    const hrResult = document.getElementById('hrResult');
    const hrContent = document.getElementById('hrContent');
    const hrInput = document.getElementById('hrInput');
    if (generateHRBtn) {
        generateHRBtn.disabled = false;
        generateHRBtn.innerHTML = `
            <span class="btn-icon">✨</span>
            <span class="lang-zh${lang === 'zh' ? '' : ' hidden'}">AI 自動生成</span>
            <span class="lang-en${lang === 'en' ? '' : ' hidden'}">AI Generate</span>
        `;
    }
    if (hrResult) hrResult.classList.add('hidden');
    if (hrContent) hrContent.innerHTML = '';
    if (hrInput) {
        hrInput.value = lang === 'zh' ? hrInput.dataset.valueZh : hrInput.dataset.valueEn;
    }

    // 6. Reset Customer Service Demo (Case 6)
    const generateReplyBtn = document.getElementById('generateReply');
    const replyDisplay = document.getElementById('replyDisplay');
    const replyContent = document.getElementById('replyContent');
    if (generateReplyBtn) {
        generateReplyBtn.disabled = false;
        generateReplyBtn.innerHTML = `
            <span class="btn-icon">🤖</span>
            <span class="lang-zh${lang === 'zh' ? '' : ' hidden'}">AI 助理生成回覆</span>
            <span class="lang-en${lang === 'en' ? '' : ' hidden'}">AI Generate Reply</span>
        `;
    }
    if (replyDisplay) replyDisplay.classList.add('hidden');
    if (replyContent) replyContent.innerHTML = '';

    // Global selector cleanup for any remaining visible elements
    document.querySelectorAll('.savings-reveal').forEach(el => {
        el.classList.remove('visible');
    });

    // Reset all buttons state
    document.querySelectorAll('.action-btn, .search-btn, .next-case-btn').forEach(btn => {
        if (btn.id !== 'nextCase1Btn') { // keep nextCase1Btn hidden
            btn.disabled = false;
            btn.style.opacity = '';
        }
    });
}

// ============================================
// Keyboard Navigation
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        elements.contactModal?.classList.add('hidden');
    }

    // Arrow keys for navigation
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        const sections = document.querySelectorAll('.section');
        const currentIndex = Array.from(sections).findIndex(
            s => s.getBoundingClientRect().top >= 0
        );
        if (currentIndex < sections.length - 1) {
            sections[currentIndex + 1]?.scrollIntoView({ behavior: 'smooth' });
        }
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        const sections = document.querySelectorAll('.section');
        const currentIndex = Array.from(sections).findIndex(
            s => s.getBoundingClientRect().top >= -10
        );
        if (currentIndex > 0) {
            sections[currentIndex - 1]?.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
