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
const elements = {
    progressBar: document.querySelector('.progress-fill'),
    currentCaseDisplay: document.getElementById('currentCase'),
    startBtn: document.getElementById('startBtn'),
    restartBtn: document.getElementById('restartDemo'),
    contactBtn: document.getElementById('contactExpert'),
    contactModal: document.getElementById('contactModal'),
    closeModalBtn: document.getElementById('closeModal'),
    contactForm: document.getElementById('contactForm')
};

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSlider();
    initResumeDemo();
    initMaintenanceDemo();
    initInvoiceDemo();
    initQualityDemo();
    initServiceDemo();
    initSummary();
    initModal();

    // Observe sections for progress tracking
    observeSections();
});

// ============================================
// Navigation
// ============================================
function initNavigation() {
    // Start button
    elements.startBtn?.addEventListener('click', () => {
        document.getElementById('case1')?.scrollIntoView({ behavior: 'smooth' });
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
    const progress = (state.completedCases.size / state.totalCases) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.currentCaseDisplay.textContent = state.completedCases.size;
}

function observeSections() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const caseNum = entry.target.dataset.case;
                if (caseNum) {
                    state.currentCase = parseInt(caseNum);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.case-section').forEach(section => {
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

    // Start timer when section is visible
    const case1Section = document.getElementById('case1');
    const timerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !reconciliationTimer) {
                startReconciliationTimer(timerDisplay);
            }
        });
    }, { threshold: 0.5 });

    if (case1Section) {
        timerObserver.observe(case1Section);
    }

    // Give up button click
    giveUpBtn.addEventListener('click', () => {
        // Stop timer
        clearInterval(reconciliationTimer);
        const finalTime = formatTime(reconciliationSeconds);

        // Hide challenge, show AI solution
        manualChallenge.classList.add('hidden');
        aiSolution.classList.remove('hidden');

        // Animate comparison count
        const comparisonCount = document.getElementById('comparisonCount');
        let count = 0;
        const countInterval = setInterval(() => {
            count += Math.floor(Math.random() * 50) + 20;
            if (count >= 2847) {
                count = 2847;
                clearInterval(countInterval);

                // Show result after AI "finishes"
                setTimeout(() => {
                    aiSolution.classList.add('hidden');
                    reconciliationResult.classList.remove('hidden');

                    // Update user's time in result
                    document.getElementById('yourTimeResult').textContent = finalTime;

                    // Show next button
                    nextCase1Btn?.classList.remove('hidden');

                    // Mark case as completed
                    state.completedCases.add(1);
                    updateProgress();

                    // Play success sound
                    playSound('complete');
                }, 800);
            }
            comparisonCount.textContent = count.toLocaleString();
        }, 50);
    });
}

function startReconciliationTimer(display) {
    reconciliationSeconds = 0;
    reconciliationTimer = setInterval(() => {
        reconciliationSeconds++;
        display.textContent = formatTime(reconciliationSeconds);

        // Update hint after certain time
        if (reconciliationSeconds === 15) {
            const hint = document.getElementById('challengeHint');
            if (hint) {
                hint.innerHTML = '⏰ 已經 15 秒了...還沒找到嗎？要不要讓 AI 幫忙？';
                hint.style.background = 'rgba(255, 107, 107, 0.1)';
            }
        }

        if (reconciliationSeconds === 30) {
            const hint = document.getElementById('challengeHint');
            if (hint) {
                hint.innerHTML = '😰 30 秒了！真實情況是 2,847 筆交易...這樣對一個月要花 40 小時！';
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
function initMaintenanceDemo() {
    const machineIcon = document.getElementById('machineIcon');
    const faultBtn = document.getElementById('triggerFault');
    const aiAssistant = document.getElementById('aiAssistant');
    const generateBtn = document.getElementById('generateReport');
    const reportOutput = document.getElementById('reportOutput');
    const reportContent = document.getElementById('reportContent');
    const machineStatus = document.querySelector('.machine-status');

    if (!faultBtn) return;

    faultBtn.addEventListener('click', () => {
        // Trigger fault animation
        machineIcon.classList.add('shaking');
        machineIcon.textContent = '⚠️';
        machineStatus.textContent = '故障：馬達異音';
        machineStatus.classList.remove('normal');
        machineStatus.classList.add('fault');

        faultBtn.disabled = true;
        faultBtn.style.opacity = '0.5';

        // Show AI assistant button
        setTimeout(() => {
            aiAssistant.classList.remove('hidden');
        }, 500);
    });

    generateBtn?.addEventListener('click', () => {
        aiAssistant.classList.add('hidden');
        reportOutput.classList.remove('hidden');

        // Typewriter effect for report
        const reportText = `
【故障代碼】M-003

【可能原因】軸承磨損

【建議維修步驟】
1. 立即停機斷電
2. 拆卸馬達護蓋
3. 檢查軸承磨損程度
4. 更換新軸承（型號：SKF6205）
5. 重新組裝並測試

【預估工時】2 小時

【歷史參考】根據 2023/08/12 維修紀錄，
           類似問題更換軸承後運行正常。

【安全提醒】作業前請確認已斷電並掛牌標示。
        `.trim();

        typewriterEffect(reportContent, reportText, () => {
            state.completedCases.add(3);
            updateProgress();
            playSound('complete');
        });
    });
}

// ============================================
// Case 4: Invoice Demo
// ============================================
function initInvoiceDemo() {
    const dropZone = document.getElementById('invoiceDropZone');
    const sampleBtn = document.getElementById('useSampleInvoice');
    const processing = document.getElementById('invoiceProcessing');
    const result = document.getElementById('invoiceResult');

    if (!dropZone || !sampleBtn) return;

    const startDemo = () => {
        dropZone.parentElement.classList.add('hidden');
        processing.classList.remove('hidden');

        setTimeout(() => {
            processing.classList.add('hidden');
            result.classList.remove('hidden');

            // Animate recognition boxes appearing
            const boxes = result.querySelectorAll('.recog-box');
            boxes.forEach((box, i) => {
                box.style.opacity = '0';
                setTimeout(() => {
                    box.style.opacity = '1';
                    playSound('ping');
                }, (i + 1) * 400);
            });

            // Typewriter effect for extracted data
            const dataValues = result.querySelectorAll('.data-value');
            dataValues.forEach((el, i) => {
                const text = el.dataset.text;
                el.textContent = '';
                setTimeout(() => {
                    typewriterEffect(el, text);
                }, 1500 + (i * 500));
            });

            setTimeout(() => {
                state.completedCases.add(4);
                updateProgress();
            }, 3000);

        }, 2500);
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
        startBtn.textContent = '檢測中...';

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
            startBtn.textContent = '檢測完成 ✓';

            state.completedCases.add(5);
            updateProgress();
        }, delay + 500);
    });
}

// ============================================
// Case 6: Customer Service Demo
// ============================================
function initServiceDemo() {
    const generateBtn = document.getElementById('generateReply');
    const replyDisplay = document.getElementById('replyDisplay');
    const replyContent = document.getElementById('replyContent');

    if (!generateBtn) return;

    generateBtn.addEventListener('click', () => {
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="btn-icon">⏳</span> AI 正在分析...';

        setTimeout(() => {
            replyDisplay.classList.remove('hidden');

            const replyText = `親愛的顧客您好：

非常感謝您聯繫我們，對於產品使用上遇到的問題，我們深感抱歉。

我們非常重視您的反饋，並已記錄您的情況。根據公司政策，您可以選擇以下方案：

✓ 方案一：免費更換全新產品
✓ 方案二：全額退款

請您回覆偏好的處理方式，我們將在 24 小時內完成處理。

再次為造成的不便致歉，感謝您的諒解與支持。

服務專員 敬上`;

            typewriterEffect(replyContent, replyText, () => {
                generateBtn.innerHTML = '<span class="btn-icon">✓</span> 回覆已生成';
                state.completedCases.add(6);
                updateProgress();
            }, 20);

        }, 1500);
    });
}

// ============================================
// Summary Page
// ============================================
let summaryAnimated = false;

function triggerSummaryCounters() {
    if (summaryAnimated) return;
    summaryAnimated = true;

    const summarySection = document.getElementById('summary');
    if (!summarySection) return;

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
// Modal
// ============================================
function initModal() {
    elements.contactBtn?.addEventListener('click', () => {
        elements.contactModal.classList.remove('hidden');
    });

    elements.closeModalBtn?.addEventListener('click', () => {
        elements.contactModal.classList.add('hidden');
    });

    elements.contactModal?.addEventListener('click', (e) => {
        if (e.target === elements.contactModal) {
            elements.contactModal.classList.add('hidden');
        }
    });

    elements.contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        console.log('Contact form submitted:', data);

        // Show success message
        elements.contactModal.querySelector('.modal-content').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 64px; margin-bottom: 20px;">✓</div>
                <h3 style="font-size: 28px; color: var(--success); margin-bottom: 16px;">
                    感謝您的諮詢！
                </h3>
                <p style="font-size: 18px; color: var(--text-secondary);">
                    我們的 AI 導入專家將在 24 小時內與您聯繫
                </p>
            </div>
        `;

        setTimeout(() => {
            elements.contactModal.classList.add('hidden');
        }, 3000);
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

    // Reset all demo states
    document.querySelectorAll('.hidden').forEach(el => {
        // Don't unhide elements that should start hidden
    });

    // Reset slider
    const slider = document.getElementById('slider1');
    if (slider) {
        slider.style.left = '50%';
        const track = slider.closest('.slider-track');
        track.querySelector('.left-side').style.flex = '1';
        track.querySelector('.right-side').style.flex = '1';
    }

    // Reset savings
    document.querySelectorAll('.savings-reveal').forEach(el => {
        el.classList.remove('visible');
    });

    // Reset resume demo
    const resumeUpload = document.getElementById('resumeUpload');
    const resumeResult = document.getElementById('resumeResult');
    if (resumeUpload && resumeResult) {
        resumeUpload.classList.remove('hidden');
        resumeResult.classList.add('hidden');
    }

    // Reset maintenance demo
    const machineIcon = document.getElementById('machineIcon');
    if (machineIcon) {
        machineIcon.classList.remove('shaking');
        machineIcon.textContent = '⚙️';
    }
    const machineStatus = document.querySelector('.machine-status');
    if (machineStatus) {
        machineStatus.textContent = '設備運行中';
        machineStatus.className = 'machine-status normal';
    }

    // Reset buttons
    document.querySelectorAll('button').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '';
    });

    // Reset invoice demo
    const invoiceDropZone = document.getElementById('invoiceDropZone');
    const invoiceResult = document.getElementById('invoiceResult');
    if (invoiceDropZone && invoiceResult) {
        invoiceDropZone.parentElement.classList.remove('hidden');
        invoiceResult.classList.add('hidden');
    }

    // Reset quality demo
    document.querySelectorAll('.product-item').forEach(item => {
        item.classList.remove('scanned', 'defect-found');
        item.querySelector('.defect-marker')?.classList.add('hidden');
    });
    const inspectionResult = document.getElementById('inspectionResult');
    inspectionResult?.classList.add('hidden');

    // Reset service demo
    const replyDisplay = document.getElementById('replyDisplay');
    replyDisplay?.classList.add('hidden');

    // Reset report
    const reportOutput = document.getElementById('reportOutput');
    const aiAssistant = document.getElementById('aiAssistant');
    const faultBtn = document.getElementById('triggerFault');
    reportOutput?.classList.add('hidden');
    aiAssistant?.classList.add('hidden');
    if (faultBtn) {
        faultBtn.disabled = false;
        faultBtn.style.opacity = '';
    }
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
