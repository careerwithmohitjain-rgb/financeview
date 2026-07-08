/**
 * FINANCEVIEW - Main Application Script
 * Handles single-page routing, loan calculator, credit card compare drawer,
 * brokerage savings calculator, modals, and toast alerts.
 */

// State variables for tracking lead applications and course enrollments
let userApplications = [];
let enrolledCourses = [];
let servicesList = [];
let currentCustomService = null;

const ICON_MAP = {
  loan: {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="12" y1="10" x2="12" y2="18"></line><line x1="8" y1="14" x2="16" y2="14"></line></svg>`,
    cssClass: 'icon-loan'
  },
  card: {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>`,
    cssClass: 'icon-card'
  },
  demat: {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="18" y2="20"></line><polyline points="8 8 12 4 16 8"></polyline></svg>`,
    cssClass: 'icon-demat'
  },
  bank: {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 22h18M6 18V9M10 18V9M14 18V9M18 18V9M12 2L2 7v2h20V7L12 2z"></path></svg>`,
    cssClass: 'icon-bank'
  },
  insurance: {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
    cssClass: 'icon-insurance'
  },
  ipo: {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`,
    cssClass: 'icon-ipo'
  },
  custom: {
    svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    cssClass: 'icon-custom'
  }
};

const DEFAULT_SERVICES = [
  {
    id: 'personal-loan',
    title: 'Personal Loan',
    subtitle: 'Personal Loan Portal',
    description: 'Calculate EMIs dynamically and compare interest rates across top commercial banks.',
    badge: 'Rates from 10.25%',
    badgeType: 'primary',
    iconType: 'loan',
    targetTab: 'personal-loan',
    active: true
  },
  {
    id: 'credit-cards',
    title: 'Credit Cards',
    subtitle: 'Credit Card Compare Engine',
    description: 'Filter by Rewards, Cashback, or Travel and compare premium features side-by-side.',
    badge: 'Top Deals',
    badgeType: 'secondary',
    iconType: 'card',
    targetTab: 'credit-cards',
    active: true
  },
  {
    id: 'insurance',
    title: 'Insurance',
    subtitle: 'Insurance Plans Hub',
    description: 'Explore available plans across Health, Life, Term, Motor, and Fire insurance models.',
    badge: 'Top Plans',
    badgeType: 'cyan',
    iconType: 'insurance',
    targetTab: 'insurance',
    active: true
  },
  {
    id: 'bank-account',
    title: 'Bank Accounts',
    subtitle: 'High-Yield Bank Accounts',
    description: 'Check minimum balance thresholds and explore high interest savings options.',
    badge: 'Interest up to 7.2%',
    badgeType: 'warning',
    iconType: 'bank',
    targetTab: 'bank-account',
    active: true
  },
  {
    id: 'demat-account',
    title: 'Demat Account',
    subtitle: 'Stockbrokers & Demat',
    description: 'Compare brokerage fees and annual maintenance charges of India\'s leading stockbrokers.',
    badge: 'Save Brokerage',
    badgeType: 'success',
    iconType: 'demat',
    targetTab: 'demat-account',
    active: true
  },
  {
    id: 'ipo-review',
    title: 'IPO Review',
    subtitle: 'IPO Reviews & Analyst Verdicts',
    description: 'Get in-depth analysis, valuations, GMP updates, and subscription suggestions.',
    badge: 'Active Now',
    badgeType: 'success',
    iconType: 'ipo',
    targetTab: 'ipo-review',
    active: true
  }
];

document.addEventListener('DOMContentLoaded', () => {
  initServicesManagement();
  initRouting();
  initLoanCalculator();
  initCreditCardCompare();
  initDematCalculator();
  initModals();
  initInsuranceCalculators();
  initPersonalAccount();
  initCourses();
  initBlogs();
  initContactPage();
  initChatbot();
  initIPOReview();
});

// Tab switching logic
function switchTab(tabId) {
  if (!tabId) return;
  
  const navList = document.getElementById('nav-links');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Close mobile menu if open
  if (navList) {
    navList.classList.remove('open');
  }
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update active nav-link
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('data-tab') === tabId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Update active tab-content
  tabContents.forEach(content => {
    if (content.id === tabId) {
      content.classList.add('active');
      // Trigger page-specific update/load animations
      if (tabId === 'personal-loan') {
        if (typeof updateLoanEMI === 'function') updateLoanEMI();
      } else if (tabId === 'demat-account') {
        if (typeof calculateDematSavings === 'function') calculateDematSavings();
      } else if (tabId === 'personal-account') {
        if (typeof renderApplicationHistory === 'function') renderApplicationHistory();
        if (typeof updateCreditScoreGauge === 'function') updateCreditScoreGauge();
      }
    } else {
      content.classList.remove('active');
    }
  });
}

function switchInsuranceSubTab(subTabId) {
  switchTab(subTabId);
}

// ==========================================
// 1. SPA ROUTING & MOBILE NAVIGATION
// ==========================================
function initRouting() {
  const navLinks = document.querySelectorAll('.nav-link, .logo-wrapper, footer a[data-tab]');
  const dropdownLinks = document.querySelectorAll('.dropdown-link');
  const tabContents = document.querySelectorAll('.tab-content');
  const menuToggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-links');

  // Attach click events to nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // If it has dropdown menu and we're on mobile, toggle dropdown instead of routing
      if (link.parentNode.classList.contains('dropdown') && window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        link.parentNode.classList.toggle('open');
        return;
      }
      
      e.preventDefault();
      const tabId = link.getAttribute('data-tab') || 'dashboard';
      switchTab(tabId);
    });
  });

  // Attach click events to dropdown sub-links
  dropdownLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const tabId = link.getAttribute('data-tab');
      const subTab = link.getAttribute('data-sub');
      switchTab(tabId);
      if (subTab) {
        switchInsuranceSubTab(subTab);
      }
    });
  });

  // Home Hero CTA trigger
  const heroCta = document.querySelector('.hero button');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      switchTab('personal-loan');
    });
  }

  // Dynamic Cards on Home grid trigger via event delegation
  const homeGrid = document.getElementById('home-services-grid');
  if (homeGrid) {
    homeGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.service-card');
      if (!card) return;
      const tabId = card.getAttribute('data-tab');
      const customId = card.getAttribute('data-custom-id');
      
      if (tabId === 'custom-generic' && customId) {
        openCustomPortal(customId);
      } else {
        switchTab(tabId);
      }
    });
  }

  // Dynamic Cards on Services page directory grid trigger via event delegation
  const dirGrid = document.getElementById('dir-services-grid');
  if (dirGrid) {
    dirGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.service-dir-card');
      if (!card) return;
      
      const tabId = card.getAttribute('data-tab');
      const customId = card.getAttribute('data-custom-id');
      
      if (tabId === 'custom-generic' && customId) {
        openCustomPortal(customId);
      } else {
        switchTab(tabId);
      }
    });
  }

  // Mobile menu toggle
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      navList.classList.toggle('open');
    });
  }

  // Expose switchTab globally so other components can trigger navigation
  window.switchTab = switchTab;
  window.switchInsuranceSubTab = switchInsuranceSubTab;
}


// ==========================================
// 2. PERSONAL LOAN EMI CALCULATOR
// ==========================================
function initLoanCalculator() {
  const amountSlider = document.getElementById('loan-amount-slider');
  const amountNum = document.getElementById('loan-amount-num');
  const rateSlider = document.getElementById('loan-rate-slider');
  const rateNum = document.getElementById('loan-rate-num');
  const tenureSlider = document.getElementById('loan-tenure-slider');
  const tenureNum = document.getElementById('loan-tenure-num');

  if (!amountSlider) return;

  // Double binding logic (sliders <--> numeric inputs)
  setupDoubleBinding(amountSlider, amountNum, updateLoanEMI);
  setupDoubleBinding(rateSlider, rateNum, updateLoanEMI);
  setupDoubleBinding(tenureSlider, tenureNum, updateLoanEMI);

  // Initialize
  updateLoanEMI();
}

function setupDoubleBinding(slider, numField, callback) {
  slider.addEventListener('input', () => {
    numField.value = slider.value;
    callback();
  });

  numField.addEventListener('change', () => {
    // Validate bounds
    let val = parseFloat(numField.value);
    const min = parseFloat(numField.min);
    const max = parseFloat(numField.max);

    if (isNaN(val)) val = min;
    if (val < min) val = min;
    if (val > max) val = max;

    numField.value = val;
    slider.value = val;
    callback();
  });
}

function updateLoanEMI() {
  const P = parseFloat(document.getElementById('loan-amount-num').value) || 0;
  const annualRate = parseFloat(document.getElementById('loan-rate-num').value) || 0;
  const N_years = parseFloat(document.getElementById('loan-tenure-num').value) || 0;

  const r = (annualRate / 12) / 100; // Monthly interest rate
  const n = N_years * 12;            // Total months

  // EMI Calculation: P * r * (1 + r)^n / ((1 + r)^n - 1)
  let emi = 0;
  if (r > 0 && n > 0) {
    emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  } else if (n > 0) {
    emi = P / n;
  } else {
    emi = 0;
  }

  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;

  // Format currency output in Indian numbering system
  const formattedEmi = formatCurrency(Math.round(emi));
  const formattedPrincipal = formatCurrency(P);
  const formattedInterest = formatCurrency(Math.round(totalInterest));
  const formattedTotal = formatCurrency(Math.round(totalPayment));

  // Update DOM elements
  document.getElementById('emi-output').textContent = formattedEmi;
  document.getElementById('breakdown-principal').textContent = formattedPrincipal;
  document.getElementById('breakdown-interest').textContent = formattedInterest;
  document.getElementById('breakdown-total').textContent = formattedTotal;

  // Update SVG Progress Ring
  const ring = document.getElementById('emi-chart-fill');
  const percentageText = document.getElementById('chart-percentage-text');
  
  if (ring && percentageText) {
    const principalPercent = Math.round((P / totalPayment) * 100);
    percentageText.textContent = `${principalPercent}%`;
    
    // Dasharray is 440 (circumference of r=70 circle is ~439.8)
    const offset = 440 - (440 * principalPercent) / 100;
    ring.style.strokeDashoffset = offset;
  }

  // Render advanced graphics
  renderAmortizationChart(P, annualRate, N_years);
  renderBankEMIComparison(P, N_years);
}

function formatCurrency(num) {
  // Simple Indian style currency formatting (e.g. 5,00,000)
  const str = num.toString();
  let lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return '₹' + res;
}


// ==========================================
// 3. CREDIT CARD COMPARE ENGINE
// ==========================================
// Database of card details to populate comparison table modal
const CARD_DB = {
  'cc-au-lit': {
    name: 'AU LIT Credit Card',
    brand: 'AU Small Finance Bank',
    reward: '10X/5X Rewards or 5% Cashback on groceries/dining',
    joining: '₹0 (Lifetime Free)',
    annual: '₹0 (Lifetime Free)',
    lounges: 'Complimentary Domestic Lounges (Optional add-on)',
    milestones: 'Flexible custom milestones configured via AU app',
    rating: '4.7 / 5'
  },
  'cc-sbi-simplyclick': {
    name: 'SBI SimplyCLICK Card',
    brand: 'SBI Card',
    reward: '10X Points on Amazon, Swiggy, Lenskart, Netmeds; 5X on others',
    joining: '₹499',
    annual: '₹499 (waived off on spending ₹1 Lakh annually)',
    lounges: 'None',
    milestones: '₹2,000 e-voucher on hitting ₹1 Lakh annual spending',
    rating: '4.5 / 5'
  },
  'cc-axis-myzone': {
    name: 'Axis Bank My Zone Card',
    brand: 'Axis Bank',
    reward: '1-Year SonyLIV Premium, BOGO BookMyShow movie tickets',
    joining: '₹500',
    annual: '₹500 (waived off on spending ₹1.5 Lakhs annually)',
    lounges: '4 Complimentary domestic lounge visits per year',
    milestones: 'Flat ₹120 discount on Swiggy twice monthly',
    rating: '4.4 / 5'
  },
  'cc-hdfc-tataneu': {
    name: 'HDFC Tata Neu Plus Card',
    brand: 'HDFC Bank',
    reward: '2% NeuCoins back on Tata brands, 1% on others',
    joining: '₹499',
    annual: '₹499 (waived off on spending ₹1 Lakh annually)',
    lounges: '4 Complimentary domestic airport lounge visits annually',
    milestones: '499 NeuCoins welcome gift on card activation',
    rating: '4.3 / 5'
  },
  'cc-idfc-classic': {
    name: 'IDFC First Classic Card',
    brand: 'IDFC FIRST Bank',
    reward: '10X points on spends > ₹20K, never-expiring points',
    joining: '₹0 (Lifetime Free)',
    annual: '₹0 (Lifetime Free)',
    lounges: 'Complimentary domestic airport lounge visits quarterly',
    milestones: 'Low interest rates (9% to 36% p.a.)',
    rating: '4.6 / 5'
  },
  'cc-indusind-legend': {
    name: 'IndusInd Legend Card',
    brand: 'IndusInd Bank',
    reward: '1 Reward point weekday, 2 points weekend spends',
    joining: '₹0 (Special Offer)',
    annual: '₹0 (Special Offer)',
    lounges: 'Complimentary domestic airport lounge visits quarterly',
    milestones: 'Buy 1 Get 1 free movie tickets on BookMyShow monthly',
    rating: '4.8 / 5'
  }
};

let compareTray = []; // Stores card IDs

function initCreditCardCompare() {
  const ccGrid = document.getElementById('cc-grid');
  const compareDrawer = document.getElementById('compare-drawer');
  const compareItemsList = document.getElementById('compare-items-list');
  const clearCompareBtn = document.getElementById('clear-compare-btn');
  const compareNowBtn = document.getElementById('compare-now-btn');
  
  // Card category filtering
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle tabs visual class
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');
      
      document.querySelectorAll('.cc-card').forEach(card => {
        const categories = card.getAttribute('data-categories').split(',');
        if (category === 'all' || categories.includes(category)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Compare Checkboxes Toggling
  if (ccGrid) {
    ccGrid.addEventListener('change', (e) => {
      if (e.target.classList.contains('cc-compare-toggle')) {
        const cardId = e.target.getAttribute('data-card-id');
        const cardName = e.target.getAttribute('data-card-name');
        
        if (e.target.checked) {
          if (compareTray.length >= 3) {
            // Revert checkbox check
            e.target.checked = false;
            showToast('You can compare a maximum of 3 cards.', 'warning');
            return;
          }
          compareTray.push({ id: cardId, name: cardName });
        } else {
          compareTray = compareTray.filter(item => item.id !== cardId);
        }
        
        updateCompareDrawer();
      }
    });
  }

  // Update UI Drawer state
  function updateCompareDrawer() {
    if (compareTray.length > 0) {
      compareDrawer.classList.add('open');
      
      // Inject tags
      compareItemsList.innerHTML = `<span style="font-weight:600; margin-right: 8px;">Compare Tray (${compareTray.length}/3):</span>`;
      compareTray.forEach(item => {
        const tag = document.createElement('div');
        tag.className = 'compare-item-tag';
        tag.innerHTML = `${item.name} <span data-id="${item.id}">×</span>`;
        
        // Add delete handler to the small cross button in the tray tag
        tag.querySelector('span').addEventListener('click', () => {
          removeCardFromCompare(item.id);
        });
        
        compareItemsList.appendChild(tag);
      });
    } else {
      compareDrawer.classList.remove('open');
    }
  }

  // Helper to remove card from comparison tray
  function removeCardFromCompare(cardId) {
    compareTray = compareTray.filter(item => item.id !== cardId);
    
    // Find checkbox in card element and uncheck it
    const checkbox = document.querySelector(`.cc-compare-toggle[data-card-id="${cardId}"]`);
    if (checkbox) checkbox.checked = false;
    
    updateCompareDrawer();
  }

  // Clear button click
  if (clearCompareBtn) {
    clearCompareBtn.addEventListener('click', () => {
      // Uncheck all boxes
      document.querySelectorAll('.cc-compare-toggle').forEach(chk => chk.checked = false);
      compareTray = [];
      updateCompareDrawer();
    });
  }

  // Compare Now button click - show comparative grid in modal
  if (compareNowBtn) {
    compareNowBtn.addEventListener('click', () => {
      if (compareTray.length < 2) {
        showToast('Please select at least 2 cards to compare.', 'warning');
        return;
      }
      
      const modal = document.getElementById('compare-modal');
      const grid = document.getElementById('compare-modal-grid');
      
      // Construct comparisons content
      grid.innerHTML = '';
      
      compareTray.forEach(item => {
        const data = CARD_DB[item.id];
        if (!data) return;
        
        const col = document.createElement('div');
        col.className = 'compare-col';
        col.innerHTML = `
          <h4 style="font-size:1.15rem; color:var(--secondary); margin-bottom: 20px; font-family:var(--font-heading);">${data.name}</h4>
          
          <div class="compare-feature">
            <div class="compare-feature-label">Bank Provider</div>
            <div class="compare-feature-value">${data.brand}</div>
          </div>
          <div class="compare-feature">
            <div class="compare-feature-label">Primary Benefit</div>
            <div class="compare-feature-value" style="color:var(--success);">${data.reward}</div>
          </div>
          <div class="compare-feature">
            <div class="compare-feature-label">Lounge Benefits</div>
            <div class="compare-feature-value">${data.lounges}</div>
          </div>
          <div class="compare-feature">
            <div class="compare-feature-label">Joining / Annual Charge</div>
            <div class="compare-feature-value">${data.joining} / ${data.annual}</div>
          </div>
          <div class="compare-feature">
            <div class="compare-feature-label">Milestone Rewards</div>
            <div class="compare-feature-value">${data.milestones}</div>
          </div>
          <div class="compare-feature">
            <div class="compare-feature-label">User Rating</div>
            <div class="compare-feature-value" style="color:var(--warning);">${data.rating}</div>
          </div>
          <button class="btn btn-primary btn-sm apply-cc-btn" style="width:100%; margin-top:20px;" data-card="${data.name}">Apply Now</button>
        `;
        
        // Re-bind apply button click inside comparison modal
        col.querySelector('.apply-cc-btn').addEventListener('click', () => {
          modal.classList.remove('open');
          showApplyModal(data.name);
        });

        grid.appendChild(col);
      });
      
      modal.classList.add('open');
    });
  }

  // Close modal button
  const modalClose = document.getElementById('compare-modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      document.getElementById('compare-modal').classList.remove('open');
    });
  }
}


// ==========================================
// 4. DEMAT BROKERAGE SAVINGS CALCULATOR
// ==========================================
function initDematCalculator() {
  const tradesInput = document.getElementById('monthly-trades');
  const valueInput = document.getElementById('avg-trade-value');
  const brokerageSelect = document.getElementById('trad-brokerage');

  if (!tradesInput) return;

  tradesInput.addEventListener('input', calculateDematSavings);
  valueInput.addEventListener('input', calculateDematSavings);
  brokerageSelect.addEventListener('change', calculateDematSavings);

  // Initial calculation
  calculateDematSavings();
}

function calculateDematSavings() {
  const N_trades = parseInt(document.getElementById('monthly-trades').value) || 0;
  const V_trade = parseFloat(document.getElementById('avg-trade-value').value) || 0;
  const pctBrokerage = parseFloat(document.getElementById('trad-brokerage').value) || 0;

  // Traditional Brokerage = Monthly Trades * Avg Trade Value * Pct
  const tradMonthlyBrokerage = N_trades * V_trade * pctBrokerage;

  // Discount Brokerage (Flat ₹20 per trade order executed)
  const discountMonthlyBrokerage = N_trades * 20;

  // Savings
  let monthlySavings = tradMonthlyBrokerage - discountMonthlyBrokerage;
  if (monthlySavings < 0) monthlySavings = 0; // Avoid negative values
  
  const yearlySavings = monthlySavings * 12;

  // Update display
  document.getElementById('demat-savings-output').textContent = formatCurrency(Math.round(yearlySavings));
}


// ==========================================
// 5. LEAD MODALS & FORM SUBMISSIONS
// ==========================================
function initModals() {
  const applyModal = document.getElementById('apply-modal');
  const applyModalClose = document.getElementById('apply-modal-close');
  const applyCancelBtn = document.getElementById('apply-cancel-btn');
  const leadForm = document.getElementById('lead-generation-form');
  
  // Attach loan click listeners (dynamically loaded)
  document.querySelectorAll('.apply-loan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bank = btn.getAttribute('data-bank');
      showApplyModal(`Personal Loan from ${bank}`);
    });
  });

  // Attach card apply buttons
  document.querySelectorAll('.apply-cc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.getAttribute('data-card');
      showApplyModal(`Credit Card: ${card}`);
    });
  });

  // Attach bank account apply buttons
  document.querySelectorAll('.apply-bank-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bank = btn.getAttribute('data-bank');
      showApplyModal(`Bank Account: ${bank}`);
    });
  });

  // Attach IPO subscribe buttons
  document.querySelectorAll('.apply-ipo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ipo = btn.getAttribute('data-ipo');
      showApplyModal(`IPO Subscription: ${ipo}`);
    });
  });

  // Close buttons
  if (applyModalClose) {
    applyModalClose.addEventListener('click', () => applyModal.classList.remove('open'));
  }
  if (applyCancelBtn) {
    applyCancelBtn.addEventListener('click', () => applyModal.classList.remove('open'));
  }

  // Close on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === applyModal) {
      applyModal.classList.remove('open');
    }
    const compareModal = document.getElementById('compare-modal');
    if (e.target === compareModal) {
      compareModal.classList.remove('open');
    }
  });

  // Handle Form Submission
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const serviceName = document.getElementById('apply-service-name').value;
      const applicantName = document.getElementById('apply-name').value;
      
      // Track this lead dynamically
      addApplication(serviceName, applicantName);
      
      // Close modal
      applyModal.classList.remove('open');
      
      // Clear inputs
      leadForm.reset();
      
      // Show Success Toast Notification
      showToast(`Thank you, ${applicantName}! Your request for ${serviceName} has been submitted. Our executive will call you within 24 hours.`, 'success');
    });
  }
}

// Global modal helper function
function showApplyModal(serviceName) {
  const modal = document.getElementById('apply-modal');
  const title = document.getElementById('apply-modal-title');
  const hiddenInput = document.getElementById('apply-service-name');
  const incomeWrapper = document.getElementById('form-income-wrapper');

  if (!modal) return;

  // Set titles
  title.textContent = `Apply for ${serviceName}`;
  hiddenInput.value = serviceName;

  // Conditional field layouts
  if (serviceName.includes('IPO') || serviceName.includes('Demat')) {
    incomeWrapper.style.display = 'none'; // Not mandatory for broker/IPO leads
    document.getElementById('apply-income').removeAttribute('required');
  } else {
    incomeWrapper.style.display = 'block';
    document.getElementById('apply-income').setAttribute('required', 'true');
  }

  modal.classList.add('open');
}


// ==========================================
// 6. TOAST ALERTS SYSTEM
// ==========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  // Set border color based on type
  if (type === 'warning') {
    toast.style.borderLeftColor = 'var(--warning)';
  } else if (type === 'danger') {
    toast.style.borderLeftColor = 'var(--danger)';
  } else {
    toast.style.borderLeftColor = 'var(--success)';
  }

  toast.innerHTML = `
    <span>${message}</span>
    <span class="toast-close">×</span>
  `;

  // Close triggers
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => toast.remove(), 300);
  });

  container.appendChild(toast);

  // Auto remove
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}

// ==========================================
// 7. NEW INSURANCE PORTAL EXTENSIONS
// ==========================================
const INSURANCE_PLAN_DB = {
  'Star Family Health Optima': {
    provider: 'Star Health Insurance',
    badge: 'Cashless Claims',
    badgeClass: 'badge-secondary',
    bannerGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
    csr: '99.04%',
    hospitals: '14,000+ cashless hospitals',
    sumInsured: '₹1 Lakh to ₹25 Lakhs',
    eligibility: 'Adults: 18 - 65 Years. Dependent children: 16 days to 25 Years.',
    features: [
      'Floater plan covering self, spouse, and up to 3 dependent children.',
      'Auto-restoration of the sum insured by 100% on complete exhaustion.',
      'Newborn cover starting from the 16th day of birth up to 10% of sum insured.',
      'Compassionate travel costs and emergency domestic air ambulance coverage.'
    ],
    exclusions: [
      'Pre-existing disease waiting period of 36 months.',
      'Cataract, hernia, joint replacements have a 24-month waiting period.',
      'Cosmetic surgery, weight control treatments, and self-inflicted injuries.'
    ],
    claimProcess: 'Show health card at desk of cashless network hospital to initiate pre-authorization within 2 hours. For non-network, submit claims within 30 days post-discharge.',
    verdict: 'Best suited for families seeking budget-friendly cover options with extensive hospital networks across semi-urban and urban centers.'
  },
  'Care Health Advantage': {
    provider: 'Care Health Insurance',
    badge: 'Cashless Claims',
    badgeClass: 'badge-success',
    bannerGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(13, 148, 136, 0.2))',
    csr: '98.20%',
    hospitals: '11,500+ cashless hospitals',
    sumInsured: '₹5 Lakhs to ₹1 Crore',
    eligibility: 'Minimum Age: 91 days. Maximum Age: No Limit (Lifetime renewability).',
    features: [
      'No Claim Bonus up to 150% (50% increase in sum insured per claim-free year).',
      'Unlimited automatic recharge of sum insured for multiple related/unrelated claims.',
      'Annual health check-up included for all insured members from year 1.',
      'Consumables cover (gloves, masks, etc.) available as a smart optional rider.'
    ],
    exclusions: [
      '30-day initial waiting period (except for accidental injuries).',
      'Pre-existing conditions excluded for the first 36-48 months.',
      'Alternative treatments like acupressure or naturopathy.'
    ],
    claimProcess: 'Notify insurer 48 hours prior to planned hospitalizations. For emergencies, notify within 24 hours of admission. Complete cashless settlement via TPA.',
    verdict: 'Excellent choice for young families seeking higher sum insured options with strong bonus progression and zero co-payment requirements.'
  },
  'HDFC Ergo Optima Secure': {
    provider: 'HDFC Ergo General Insurance',
    badge: 'Cashless Claims',
    badgeClass: 'badge-primary',
    bannerGradient: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(99, 102, 241, 0.2))',
    csr: '98.90%',
    hospitals: '12,000+ cashless hospitals',
    sumInsured: '₹5 Lakhs to ₹2 Crores',
    eligibility: 'Adults: 18 - 65 Years. Children: 91 days to 25 Years.',
    features: [
      'Secure Benefit: Instantly doubles (2X) your base sum insured from Day 1.',
      'Plus Benefit: Increases sum insured by 50% at year 1, and up to 100% by year 2, regardless of claims.',
      'Restore Benefit: 100% automatic cover restoration if sum insured gets depleted.',
      'Protect Benefit: Fully covers non-medical/consumable charges (masks, PPEs, sanitizers).'
    ],
    exclusions: [
      'Pre-existing disease waiting period of 36 months.',
      'Specific procedures (cataract, joint surgery) have a 2-year waiting period.',
      'Adventure sports, cosmetic treatments, and hormone therapies.'
    ],
    claimProcess: 'Insurer pre-approves cashless authorization within 2 hours. Cashless claims resolved directly between HDFC Ergo and hospital TPAs.',
    verdict: 'Policybazaar Hot Buy. Provides the most comprehensive features (effectively 4X cover) for modern urban families concerned with rising healthcare inflation.'
  },
  'Niva Bupa ReAssure 2.0': {
    provider: 'Niva Bupa Health Insurance',
    badge: 'Cashless Claims',
    badgeClass: 'badge-warning',
    bannerGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
    csr: '98.05%',
    hospitals: '10,000+ cashless hospitals',
    sumInsured: '₹5 Lakhs to ₹1 Crore',
    eligibility: 'Minimum Entry Age: 91 days. Maximum Entry Age: 65 Years.',
    features: [
      'Lock-the-Premium: Pay the same premium corresponding to your entry age until a claim is filed.',
      'ReAssure Forever: Unlimited restorations of sum insured that trigger after the first claim.',
      'Booster Benefit: Unclaimed sum insured rolls over up to 5X (500% expansion).',
      'No room rent capping: Get single private room, suite or ICU cover without sub-limits.'
    ],
    exclusions: [
      '30-day initial waiting period for diseases (except accidents).',
      'Pre-existing illnesses excluded for 36 months.',
      'Addiction treatment, genetic disorders, and gender enhancement procedures.'
    ],
    claimProcess: 'Submit pre-auth request via hospital desk. Niva Bupa guarantees cashless decisions in 10 minutes, making it one of the fastest claim handlers.',
    verdict: 'Highly recommended for individuals purchasing health cover at an early age to lock-in low premiums and build massive cumulative balances.'
  },
  'LIC Bima Jyoti Plan': {
    provider: 'Life Insurance Corporation of India',
    badge: 'Guaranteed Return',
    badgeClass: 'badge-danger',
    bannerGradient: 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(244, 63, 94, 0.2))',
    csr: '98.62%',
    hospitals: 'N/A (Sovereign Guarantee)',
    sumInsured: 'Minimum: ₹1 Lakh. Maximum: No Limit.',
    eligibility: 'Minimum Age: 90 days. Maximum Age: 60 Years. Policy Term: 15-20 Years.',
    features: [
      'Guaranteed Addition: Earn ₹50 per ₹1,000 of sum assured added to policy at the end of each year.',
      'Limited Premium Payment: Premium paying term is 5 years less than the selected policy term.',
      'Sovereign Guarantee: Fully backed by the Government of India, ensuring absolute security.',
      'Loan facility: Access up to 90% of surrender value after completing 2 full premium years.'
    ],
    exclusions: [
      'Suicide exclusion: Nominee receives 80% of premiums paid if suicide occurs within 12 months.',
      'Rider-specific exclusions apply (e.g. self-inflicted injuries under accident rider).'
    ],
    claimProcess: 'Submit discharge form and original policy bond at the home branch for maturity payout. For death claims, submit death certificate and claimant identity.',
    verdict: 'A safe, conservative savings option with guaranteed payouts, ideal for individuals seeking wealth protection with zero exposure to market volatility.'
  },
  'HDFC Life Sanchay Plus': {
    provider: 'HDFC Life Insurance',
    badge: 'Guaranteed Income',
    badgeClass: 'badge-primary',
    bannerGradient: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(59, 130, 246, 0.2))',
    csr: '99.39%',
    hospitals: 'N/A (Life Protection)',
    sumInsured: 'Dependent on premium size. Minimum annual premium: ₹30,000.',
    eligibility: 'Entry Age: 5 - 60 Years. Payout option terms from 10 to 40 Years.',
    features: [
      'Guaranteed Income: Receive fixed, tax-free annual payouts for up to 30 years.',
      'Guaranteed Maturity return of 100% of all premiums paid at the end of payout term.',
      'Life cover protection runs concurrently throughout the policy term.',
      'Flexibility: Select between Guaranteed Income, Life Long Income, or Endowment options.'
    ],
    exclusions: [
      'Suicide: 80% of surrendering premiums returned if suicide within the first year of policy.'
    ],
    claimProcess: 'Register online via HDFC Life portal or visit nearby branch. Payouts credited directly to registered bank account via NEFT/NACH.',
    verdict: 'One of the best performing guaranteed tax-free return plans, providing predictable cashflows for child education milestones or retirement planning.'
  },
  'SBI Life Smart Platina': {
    provider: 'SBI Life Insurance',
    badge: 'Guaranteed Savings',
    badgeClass: 'badge-secondary',
    bannerGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(13, 148, 136, 0.2))',
    csr: '99.20%',
    hospitals: 'N/A (Life Protection)',
    sumInsured: 'Minimum: ₹1.5 Lakhs. Maximum: No Limit.',
    eligibility: 'Entry Age: 7 - 60 Years. Maturity Age: Max 75 Years.',
    features: [
      'Guaranteed Additions of up to 5.5% added to base sum assured annually.',
      'Limited Payment: Pay premiums for 7 or 10 years for a policy term of 12 or 15 years.',
      'Completely tax-free maturity payouts under Section 10(10D).',
      'Additional death benefit covers up to 10X annual premium in case of emergencies.'
    ],
    exclusions: [
      'Suicide within 12 months from policy inception reduces payout to 80% of paid premiums.'
    ],
    claimProcess: 'Submit death claim form along with medical reports to SBI Life central office. Maturity claims settled automatically on the due date.',
    verdict: 'Highly secure endowment option from India\'s largest public banking brand, perfect for risk-averse savers seeking stable capital appreciation.'
  },
  'SBI Life Smart Platina Plus': {
    provider: 'SBI Life Insurance',
    badge: 'Guaranteed Income',
    badgeClass: 'badge-secondary',
    bannerGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(13, 148, 136, 0.2))',
    csr: '99.20%',
    hospitals: 'N/A (Life Protection)',
    sumInsured: 'Dependent on premium. Minimum premium: ₹50,000/yr.',
    eligibility: 'Entry Age: 3 - 60 Years. Payout periods available for 15, 20, 25 or 30 Years.',
    features: [
      'Guaranteed Income payout of up to 110% of annual premium, starting right after policy term.',
      'Option to receive income as annual, semi-annual, quarterly or monthly cash flows.',
      'Get 100% refund of all premium deposits at the end of the selected income term.',
      'Whole life cover option provides protection cover up to the age of 99 years.'
    ],
    exclusions: [
      'Suicide exclusion clause applies for the first 12 months of coverage.'
    ],
    claimProcess: 'Maturity/Income payouts are disbursed directly to bank account via ECS on annual anniversaries. Nominees file physical claim docs for death payouts.',
    verdict: 'Tailored for senior citizens or salary earners seeking long-term regular pocket payouts that are completely immune to interest rate fluctuations.'
  },
  'SBI Life Shubh Nivesh': {
    provider: 'SBI Life Insurance',
    badge: 'Whole Life Cover',
    badgeClass: 'badge-secondary',
    bannerGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(13, 148, 136, 0.2))',
    csr: '99.20%',
    hospitals: 'N/A (Life Protection)',
    sumInsured: 'Minimum: ₹75,000. Maximum: No Limit.',
    eligibility: 'Entry Age: 18 - 60 Years. Whole life cover option extends cover up to age 100.',
    features: [
      'Whole Life Option: Get maturity payout at term end, while life cover continues up to age 100.',
      'Participating Plan: Earn annual bonuses and terminal bonuses declared by SBI Life.',
      'Deferred Payouts: Convert maturity returns into regular monthly income stream.',
      'Three optional riders: Accidental death, preferred term, and critical illness.'
    ],
    exclusions: [
      'Surrenders or suicide within 1 year from risk start reduces benefits in line with terms.'
    ],
    claimProcess: 'Maturity benefits require submitting policy surrender discharge forms. Death claims verified within 30 days of filing.',
    verdict: 'A versatile hybrid product combining traditional savings bonuses with a perpetual life cover, making it a stellar inheritance tool.'
  },
  'SBI Life eWealth Plus': {
    provider: 'SBI Life Insurance',
    badge: 'ULIP (Wealth Creator)',
    badgeClass: 'badge-secondary',
    bannerGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(13, 148, 136, 0.2))',
    csr: '99.20%',
    hospitals: 'N/A (Market-linked)',
    sumInsured: '10X of annual premium size.',
    eligibility: 'Entry Age: 0 - 50 Years. Policy Term: 10, 15 or 20 Years.',
    features: [
      'Market-linked returns: Choose between debt, equity, or balanced investment funds.',
      'Automatic Asset Allocation (AAA) feature balances equity/debt mix as maturity nears.',
      'No administration fees or premium allocation charges, maximizing fund value growth.',
      'Partial withdrawals allowed after completing a 5-year lock-in period.'
    ],
    exclusions: [
      'Suicide within 1 year: Payout equal to fund value on date of death notification.'
    ],
    claimProcess: 'Manage fund switching online via SBI Life customer portal. Redemption values credited automatically upon maturity of policy.',
    verdict: 'Ideal for tech-savvy investors wanting direct exposure to equity markets with secondary tax exemptions under 80C and 10(10D).'
  },
  'SBI Life Smart Guaranteed Savings Plan': {
    provider: 'SBI Life Insurance',
    badge: 'Guaranteed Savings',
    badgeClass: 'badge-secondary',
    bannerGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(13, 148, 136, 0.2))',
    csr: '99.20%',
    hospitals: 'N/A (Life Protection)',
    sumInsured: 'Minimum: ₹2.5 Lakhs. Dependent on premium payouts.',
    eligibility: 'Entry Age: 8 - 50 Years. Policy Term: 10 Years.',
    features: [
      'Guaranteed Addition rates between 5.5% to 6.0% depending on premium brackets.',
      'Single premium or short 5-year premium payment options available.',
      'Fully tax-free maturity proceeds under Section 10(10D).',
      'Life cover of 10X annualized premium starts instantly from policy approval.'
    ],
    exclusions: [
      'Standard 1-year suicide exclusion limits liability to surrender value.'
    ],
    claimProcess: 'Maturity benefits disbursed instantly via online bank mandate. Death claims routed through local branches for verification.',
    verdict: 'Best short-term savings product for salary earners who want to lock in a guaranteed return over a fixed 10-year horizon.'
  },
  'Tata AIA Maha Raksha Supreme': {
    provider: 'Tata AIA Life Insurance',
    badge: 'Pure Term Cover',
    badgeClass: 'badge-primary',
    bannerGradient: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(236, 72, 153, 0.2))',
    csr: '99.01%',
    hospitals: 'N/A (Pure Protection)',
    sumInsured: 'Minimum: ₹50 Lakhs. Maximum: No Limit (subject to underwriting).',
    eligibility: 'Minimum Age: 18 Years. Maximum Age: 70 Years. Cover term up to 85 Years.',
    features: [
      'Highly affordable premium rates with special discounts for non-smokers and female lives.',
      'Accelerator Rider: Pay out up to 50% of sum assured upon diagnosis of terminal illness.',
      'Life Stage Option: Increase cover amount upon marriage or childbirth without medical re-tests.',
      'Surrender Value benefit available even under standard pure term configurations.'
    ],
    exclusions: [
      'Suicide within 12 months: Nominee receives 80% of paid premiums. No coverage for illegal activities.'
    ],
    claimProcess: 'File death claims online or via WhatsApp. Tata AIA features dedicated claim helper service to assist family nominees directly at home.',
    verdict: 'Top-tier term coverage, highly recommended for its customizable sum assured enhancements and customer-friendly claim assistance systems.'
  },
  'ICICI Pru iProtect Smart': {
    provider: 'ICICI Prudential Life Insurance',
    badge: 'Pure Term Cover',
    badgeClass: 'badge-secondary',
    bannerGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(236, 72, 153, 0.2))',
    csr: '99.17%',
    hospitals: 'N/A (Pure Protection)',
    sumInsured: 'Minimum: ₹50 Lakhs. Maximum: Underwriting dependent.',
    eligibility: 'Entry Age: 18 - 65 Years. Coverage options up to 99 Years (Whole Life Term).',
    features: [
      'Comprehensive 4-in-1 Cover: Life cover, Accidental Death, Critical Illness, and Waiver of Premium.',
      'Critical Illness Cover: Pays lump sum on diagnosis of any of 34 covered critical conditions.',
      'Special Exit Option: Cancel policy in specific years and receive all paid premiums back.',
      'Tax Savings: Claims and premium payments qualify under Section 80C and 80D.'
    ],
    exclusions: [
      'Suicide within 1 year. Critical illness claims exclude conditions diagnosed within first 90 days.'
    ],
    claimProcess: 'Submit claims online or via ICICI Pru app. Features a "Claim Guarantee" process ensuring settlement within 1 day for eligible terms.',
    verdict: 'A premium, highly flexible term policy. The special exit option makes it virtually free if you survive past retirement ages.'
  },
  'Max Life Smart Secure Plus': {
    provider: 'Max Life Insurance',
    badge: 'Pure Term Cover',
    badgeClass: 'badge-warning',
    bannerGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2))',
    csr: '99.65%',
    hospitals: 'N/A (Pure Protection)',
    sumInsured: 'Minimum: ₹50 Lakhs. Maximum: No Limit.',
    eligibility: 'Entry Age: 18 - 65 Years. Coverage duration up to 85 Years.',
    features: [
      'Increasing Cover: Base sum assured automatically grows by 5% annually to adjust for inflation.',
      'Flexible Payouts: Choose lump sum, monthly income, or combination payout to the nominee.',
      'Premium Break: Option to skip premium payment for 1 year after completing 10 policy years.',
      'Return of Premium (ROP) option available, refunding 100% of base premiums at maturity.'
    ],
    exclusions: [
      'Suicide exclusion applies within first 12 months. Excludes hazardous sports unless declared.'
    ],
    claimProcess: 'Dedicated Max Life "Claim Relationship Officer" assigned to each family to manage documentation and ensure quick approval.',
    verdict: 'Policybazaar Gold Standard. Max Life boasts the highest claim settlement ratio (99.65%) in the industry, making it the most reliable term cover.'
  },
  'SBI Life eShield Next': {
    provider: 'SBI Life Insurance',
    badge: 'Pure Term Cover',
    badgeClass: 'badge-secondary',
    bannerGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(13, 148, 136, 0.2))',
    csr: '99.20%',
    hospitals: 'N/A (Pure Protection)',
    sumInsured: 'Minimum: ₹50 Lakhs. Maximum: No Limit.',
    eligibility: 'Entry Age: 18 - 65 Years. Coverage up to age 85 or 100 (Whole Life).',
    features: [
      'Three Plan options: Level Cover, Increasing Cover, and Level Cover with Future Proofing.',
      'Terminal Illness Benefit: Entire sum assured is paid immediately upon terminal diagnosis.',
      'Better Half Benefit: Life cover automatically starts for the spouse in case of policyholder\'s demise.',
      'Premium payment frequencies: Yearly, half-yearly, quarterly, monthly, or single pay.'
    ],
    exclusions: [
      'Suicide within 12 months. Accidental benefits exclude self-injury or alcohol-induced accidents.'
    ],
    claimProcess: 'Submit claims at any local SBI branch or central online portal. Verified and approved within 15 working days.',
    verdict: 'Extremely dependable brand trust. The Better Half Benefit provides a comprehensive safety net for the spouse under a single policy.'
  },
  'ICICI Lombard Car Shield': {
    provider: 'ICICI Lombard General Insurance',
    badge: 'Cashless Garages',
    badgeClass: 'badge-success',
    bannerGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))',
    csr: '97.80%',
    hospitals: '6,500+ Partner Cashless Garages',
    sumInsured: 'Based on vehicle IDV (Insured Declared Value).',
    eligibility: 'Any registered vehicle owner with valid RC and driving license.',
    features: [
      'Comprehensive cover protecting against accidents, thefts, fire, and third-party liability.',
      'Zero Depreciation Add-on: Get full claim amount for replaced parts (plastic, rubber, metal).',
      'Roadside Assistance (RSA): 24/7 towing, flat tire change, key retrieval, and fuel support.',
      'Engine Protect: Covers damages to the engine caused by water ingression or oil leakage.'
    ],
    exclusions: [
      'Normal wear & tear, electrical/mechanical breakdowns not caused by accidents.',
      'Driving without a valid license, or driving under the influence of alcohol.',
      'Tires and tubes damaged without a concurrent vehicle accident (50% cover applies).'
    ],
    claimProcess: 'Initiate claims on ICICI Lombard app. Take photos of vehicle damage and upload for instant self-approval, or get towing to nearest cashless garage.',
    verdict: 'Excellent digital interface. Highly recommended for new car owners seeking fast, app-based survey approvals and extensive garage network support.'
  },
  'Bajaj Allianz Drive Assure': {
    provider: 'Bajaj Allianz General Insurance',
    badge: 'Cashless Garages',
    badgeClass: 'badge-warning',
    bannerGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2))',
    csr: '98.10%',
    hospitals: '5,200+ Partner Cashless Garages',
    sumInsured: 'Based on vehicle IDV.',
    eligibility: 'Registered vehicle owners in India.',
    features: [
      'Drive Assure Add-on: Zero Depreciation, Engine Protector, and 24x7 spot assistance.',
      'Lock & Key Cover: Compensation for cost of replacing car keys and lock transmitters.',
      'Personal Baggage Cover: Covers loss or damage to personal items inside the vehicle.',
      'Consumables Cover: Reimburses costs for nuts, bolts, engine oil, and lubricants in claims.'
    ],
    exclusions: [
      'Consequential damages arising out of delays or commercial vehicle utilization.',
      'Driving under toxic substances or using the vehicle for racing/speed testing.',
      'Depreciation on parts if Zero-Dep premium add-on is not selected.'
    ],
    claimProcess: 'Call 1800-209-5858 or register claim on portal. Surveyor inspects vehicle at garage, approvals delivered within 4 hours of report.',
    verdict: 'Top-tier vehicle package. Drive Assure is the benchmark for comprehensive add-on shields, ideal for premium and luxury cars.'
  },
  'Tata AIG AutoSecure': {
    provider: 'Tata AIG General Insurance',
    badge: 'Cashless Garages',
    badgeClass: 'badge-secondary',
    bannerGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(13, 148, 136, 0.2))',
    csr: '98.50%',
    hospitals: '5,800+ Partner Cashless Garages',
    sumInsured: 'Based on vehicle IDV.',
    eligibility: 'Registered vehicle owners.',
    features: [
      'Return to Invoice Cover: Get original buying invoice value of car (including taxes) if stolen or totaled.',
      'NCB Protect: Keep your No Claim Bonus discount (up to 50%) even if you make up to 1 claim.',
      'Tyre Secure Add-on: Reimburses replacement cost of damaged tires due to cuts, bursts, or bulges.',
      'Daily Allowance: Reimburses taxi expenses while your vehicle is undergoing accident repairs.'
    ],
    exclusions: [
      'Accidents outside India. Damages during war or nuclear hazards.',
      'Stolen parts (like stereo/accessories) unless the entire vehicle is stolen or damaged.',
      'Driver driving without a valid driving license category matching vehicle description.'
    ],
    claimProcess: 'Notify Tata AIG. Book cashless service at partner garage. Share RC, DL, and claim forms. Garage receives payment directly after repair completion.',
    verdict: 'Best value for brand-new car owners due to the return-to-invoice and NCB protection features which preserve your investment.'
  },
  'Tata AIG Bharat Griha Raksha': {
    provider: 'Tata AIG General Insurance',
    badge: 'Property Cover',
    badgeClass: 'badge-danger',
    bannerGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2))',
    csr: '98.50%',
    hospitals: 'N/A (Property Surveyor)',
    sumInsured: 'Based on reconstruction cost of the property structure.',
    eligibility: 'Home owners, building landlords, or tenants living in rented structures.',
    features: [
      'Bharat Griha Raksha standard policy covering building structure and home contents.',
      'Covers damages from fires, earthquakes, floods, storms, lightning, and land slides.',
      'Automatic cover for general home contents up to 20% of building sum insured (max ₹10L).',
      'Covers expenses for removal of debris, and architect/surveyor service fees.'
    ],
    exclusions: [
      'Loss or damage caused by normal wear and tear, settling, or gradual cracking.',
      'War, invasion, civil commotions, and nuclear contamination.',
      'Loss of money, bullion, stamps, manuscript securities unless specifically scheduled.'
    ],
    claimProcess: 'Notify central helpline. Submit list of damaged items with estimated values and bills. Surveyor visits the site to assess damages and files report.',
    verdict: 'Standard Government-regulated home policy. Highly recommended for home-owners seeking robust structural security against natural calamities.'
  },
  'ICICI Lombard Home Shield': {
    provider: 'ICICI Lombard General Insurance',
    badge: 'Property Cover',
    badgeClass: 'badge-danger',
    bannerGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2))',
    csr: '97.80%',
    hospitals: 'N/A (Property Surveyor)',
    sumInsured: 'Covers up to ₹50 Crores depending on property size.',
    eligibility: 'Flat owners, society members, bungalow owners, and commercial shops.',
    features: [
      'Multi-year cover available for up to 15 years, locking in premium rates.',
      'Alternate Accommodation Rent Cover: Pays for temporary rent if your home becomes uninhabitable.',
      'Covers structural loss, content damage, burglary, and electrical breakdown of home appliances.',
      'Terrorism Cover: Includes property loss or damages caused by acts of terrorism.'
    ],
    exclusions: [
      'Pre-existing structural defects. Depreciated electronics beyond 10 years.',
      'Loss due to illegal construction, building collapse due to poor maintenance.',
      'Loss of valuables (jewellery, paintings) unless stored in locker and declared.'
    ],
    claimProcess: 'Register claim online. Upload photos/videos of damage. ICICI Lombard surveys and approves payouts within 10-15 working days.',
    verdict: 'One of the most comprehensive private home policies. The alternate rent cover provides massive peace of mind in high-density urban areas.'
  },
  'HDFC Ergo Home Secure': {
    provider: 'HDFC Ergo General Insurance',
    badge: 'Property Cover',
    badgeClass: 'badge-danger',
    bannerGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.2))',
    csr: '98.90%',
    hospitals: 'N/A (Property Surveyor)',
    sumInsured: 'Flexible based on property carpet area and valuation.',
    eligibility: 'Property owners and tenants.',
    features: [
      'Comprehensive Home Insurance covering structure, home contents, and precious jewelry.',
      'Jewelry & Valuables Cover: Special protection for ornaments, watches, and works of art.',
      'Public Liability: Covers legal costs if a third-party is injured or their property is damaged in your home.',
      'Pedigreed Pet Cover: Reimburses costs associated with accidental death of registered house pets.'
    ],
    exclusions: [
      'Losses where the home has been unoccupied for more than 30 consecutive days (unless declared).',
      'War risks, deliberate destruction of property under government orders.',
      'Losses of electronic data, computer programs, or paper records.'
    ],
    claimProcess: 'Submit claim form with FIR (for burglary) or fire department reports (for fire). Claims processed with fast-track survey settlements.',
    verdict: 'Perfect option for luxury homeowners who want comprehensive, high-limit protection for valuable interior designs, jewelry, and paintings.'
  }
};

function showInsuranceDetails(policyName) {
  const policy = INSURANCE_PLAN_DB[policyName];
  if (!policy) {
    showToast(`Details for ${policyName} are currently unavailable.`, 'warning');
    return;
  }

  const modal = document.getElementById('insurance-details-modal');
  if (!modal) return;

  // Set header details
  document.getElementById('ins-details-title').textContent = policyName;
  document.getElementById('ins-details-provider').textContent = policy.provider;
  document.getElementById('ins-details-csr').textContent = policy.csr;
  
  // Set badge
  const badgeEl = document.getElementById('ins-details-badge');
  badgeEl.textContent = policy.badge;
  badgeEl.className = `badge ${policy.badgeClass}`;

  // Set Banner Gradient
  document.getElementById('ins-details-banner').style.background = policy.bannerGradient;

  // Set features
  const featuresList = document.getElementById('ins-details-features');
  featuresList.innerHTML = policy.features.map(f => `<li>${f}</li>`).join('');

  // Set exclusions
  const exclusionsList = document.getElementById('ins-details-exclusions');
  exclusionsList.innerHTML = policy.exclusions.map(e => `<li>${e}</li>`).join('');

  // Set criteria
  document.getElementById('ins-details-sum-insured').textContent = policy.sumInsured;
  document.getElementById('ins-details-eligibility').textContent = policy.eligibility;

  // Set claim process & verdict
  document.getElementById('ins-details-claims').textContent = policy.claimProcess;
  document.getElementById('ins-details-verdict').textContent = policy.verdict;

  // Track the Policy in Apply Button's data attribute
  document.getElementById('ins-details-apply-btn').setAttribute('data-policy', policyName);

  modal.classList.add('open');
}

function initInsuranceCalculators() {
  // Bind cards clicks on Insurance Hub
  document.querySelectorAll('.insurance-hub-grid .ins-hub-card').forEach(card => {
    const btn = card.querySelector('button');
    const tabId = card.getAttribute('data-tab');
    
    card.addEventListener('click', (e) => {
      switchTab(tabId);
    });
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        switchTab(tabId);
      });
    }
  });

  // Connect apply insurance buttons to the modal
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('apply-insurance-btn')) {
      const policyName = e.target.getAttribute('data-policy');
      showApplyModal(`Insurance Policy: ${policyName}`);
    }
  });

  // Connect view details buttons to the details modal
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-insurance-details-btn')) {
      const policyName = e.target.getAttribute('data-policy');
      showInsuranceDetails(policyName);
    }
  });

  // Close details modal listeners
  const closeBtn1 = document.getElementById('ins-details-modal-close');
  const closeBtn2 = document.getElementById('ins-details-close-btn');
  const detailsModal = document.getElementById('insurance-details-modal');

  if (closeBtn1) {
    closeBtn1.addEventListener('click', () => detailsModal.classList.remove('open'));
  }
  if (closeBtn2) {
    closeBtn2.addEventListener('click', () => detailsModal.classList.remove('open'));
  }

  // Backdrop click closes details modal
  window.addEventListener('click', (e) => {
    if (e.target === detailsModal) {
      detailsModal.classList.remove('open');
    }
  });

  // Apply button inside details modal click handler
  const detailsApplyBtn = document.getElementById('ins-details-apply-btn');
  if (detailsApplyBtn) {
    detailsApplyBtn.addEventListener('click', () => {
      const policyName = detailsApplyBtn.getAttribute('data-policy');
      detailsModal.classList.remove('open');
      showApplyModal(`Insurance Policy: ${policyName}`);
    });
  }
}

// ==========================================
// 8. NEW PERSONAL ACCOUNT INTERACTIVE Logic
// ==========================================
function initPersonalAccount() {
  const refreshBtn = document.getElementById('refresh-credit-score-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', handleRefreshCreditScore);
  }
  
  updateCreditScoreGauge();
  renderApplicationHistory();
  renderEnrolledCourses();
}

function addApplication(serviceName, applicantName) {
  const refId = 'FV-' + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  
  userApplications.push({
    id: refId,
    service: serviceName,
    applicant: applicantName,
    date: dateStr,
    status: 'In Review'
  });
  
  renderApplicationHistory();
}

function renderApplicationHistory() {
  const body = document.getElementById('application-tracker-body');
  const badge = document.getElementById('app-count-badge');
  if (!body) return;
  
  if (userApplications.length === 0) {
    body.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; color:var(--text-secondary); padding: 30px;">
          No active applications submitted yet. Apply for a loan, card, bank account, or insurance policy to track it here.
        </td>
      </tr>
    `;
    if (badge) badge.textContent = "0 Pending";
    return;
  }
  
  if (badge) badge.textContent = `${userApplications.length} Pending`;
  
  body.innerHTML = userApplications.map(app => {
    let badgeClass = 'badge-warning';
    if (app.status === 'Approved') badgeClass = 'badge-success';
    else if (app.status === 'Verification Pending') badgeClass = 'badge-primary';
    
    return `
      <tr>
        <td style="font-family: monospace; font-weight:600; color:var(--text-primary);">${app.id}</td>
        <td>${app.service}</td>
        <td>${app.applicant}</td>
        <td>${app.date}</td>
        <td><span class="badge ${badgeClass}">${app.status}</span></td>
      </tr>
    `;
  }).join('');
}

function updateCreditScoreGauge() {
  const ring = document.getElementById('credit-score-fill');
  const scoreVal = document.getElementById('credit-score-value');
  const scoreStatus = document.getElementById('credit-score-status');
  
  if (!ring || !scoreVal) return;
  
  const score = parseInt(scoreVal.textContent) || 765;
  const percent = Math.round(((score - 300) / 600) * 100);
  const offset = 440 - (440 * percent) / 100;
  ring.style.strokeDashoffset = offset;
  
  if (score >= 750) {
    scoreStatus.textContent = "EXCELLENT";
    scoreStatus.style.fill = "var(--success)";
    ring.style.stroke = "var(--success)";
  } else if (score >= 680) {
    scoreStatus.textContent = "GOOD";
    scoreStatus.style.fill = "var(--secondary)";
    ring.style.stroke = "var(--secondary)";
  } else if (score >= 550) {
    scoreStatus.textContent = "AVERAGE";
    scoreStatus.style.fill = "var(--warning)";
    ring.style.stroke = "var(--warning)";
  } else {
    scoreStatus.textContent = "POOR";
    scoreStatus.style.fill = "var(--danger)";
    ring.style.stroke = "var(--danger)";
  }
}

function handleRefreshCreditScore() {
  const scoreVal = document.getElementById('credit-score-value');
  const ring = document.getElementById('credit-score-fill');
  if (!scoreVal || !ring) return;
  
  ring.style.transition = 'none';
  ring.style.strokeDashoffset = 440;
  
  const newScore = Math.floor(720 + Math.random() * 130);
  scoreVal.textContent = "...";
  
  setTimeout(() => {
    scoreVal.textContent = newScore;
    ring.style.transition = 'stroke-dashoffset 1s ease-out';
    updateCreditScoreGauge();
    showToast(`Credit Score updated successfully! Current Score: ${newScore}`, 'success');
  }, 800);
}

// ==========================================
// 9. NEW FINANCE COURSES Logic
// ==========================================
function initCourses() {
  document.querySelectorAll('.syllabus-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseId = btn.getAttribute('data-course');
      const details = document.getElementById(`syllabus-${courseId}`);
      const arrow = btn.querySelector('.arrow');
      
      if (details.style.display === 'none') {
        details.style.display = 'block';
        if (arrow) arrow.textContent = '▲';
      } else {
        details.style.display = 'none';
        if (arrow) arrow.textContent = '▼';
      }
    });
  });

  document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseTitle = btn.getAttribute('data-course-title');
      const price = btn.getAttribute('data-price');
      enrollInCourse(courseTitle, price);
    });
  });
}

function enrollInCourse(courseTitle, price) {
  if (enrolledCourses.includes(courseTitle)) {
    showToast(`You are already enrolled in "${courseTitle}". Check your Personal Account.`, 'warning');
    return;
  }
  
  enrolledCourses.push(courseTitle);
  showToast(`Congratulations! You have enrolled in "${courseTitle}" successfully.`, 'success');
  renderEnrolledCourses();
}

function renderEnrolledCourses() {
  const container = document.getElementById('enrolled-courses-container');
  if (!container) return;
  
  if (enrolledCourses.length === 0) {
    container.innerHTML = `
      <p style="color:var(--text-secondary); font-size:0.9rem; text-align:center; padding: 20px;">
        You haven't enrolled in any educational courses yet. Check out our financial literacy catalog on the Courses page!
      </p>
    `;
    return;
  }
  
  container.innerHTML = enrolledCourses.map(title => `
    <div class="enrolled-course-item">
      <div>
        <h4>${title}</h4>
        <span style="font-size:0.75rem; color:var(--success);">In Progress • 0% Completed</span>
      </div>
      <button class="btn btn-outline-primary btn-sm learn-course-btn" style="padding: 6px 12px; font-size:0.8rem;" onclick="showToast('Loading course modules...', 'success')">Start Class</button>
    </div>
  `).join('');
}

// ==========================================
// 10. NEW BLOG DETAILS & SEARCH SYSTEM
// ==========================================
const BLOG_DB = {
  'blog-1': {
    title: '5 Crucial Mistakes to Avoid on Personal Loans',
    date: 'July 05, 2026',
    category: 'Loans',
    content: `
      <p>Applying for a personal loan can be a quick and convenient way to finance immediate needs, such as medical emergencies, home renovation, or debt consolidation. However, borrowers often make simple, avoidable mistakes that result in high interest rates or rejection of their loan application.</p>
      <br>
      <h3>1. Not Checking Your Credit Score First</h3>
      <p>Your Credit Score is the primary metrics banks evaluate. A score above 750 gets you lower interest rates. Always review your credit profile and clean up any report discrepancies before applying.</p>
      <br>
      <h3>2. Overlooking Hidden Fees</h3>
      <p>Interest rate is only part of the expense. Always check processing fees (can be 1-3%), pre-payment foreclosure charges, and late payment penalties. Flat rates are often misleading compared to reducing balance calculations.</p>
      <br>
      <h3>3. Applying with Multiple Lenders Simultaneously</h3>
      <p>Every loan inquiry triggers a "hard pull" on your credit history. Multiple hard inquiries in a short period lower your credit score rating. Select the best bank offer first and apply there.</p>
    `
  },
  'blog-2': {
    title: 'How to Maximize Your Credit Card Cashbacks',
    date: 'July 03, 2026',
    category: 'Credit Cards',
    content: `
      <p>Credit cards are excellent utility tools if managed correctly. By aligning your purchases with the best reward card types, you can save significant money on routine monthly expenses.</p>
      <br>
      <h3>1. Use Category-Specific Cards</h3>
      <p>Don't use a single card for all purchases. Use cards that offer 5% on online shopping for Amazon/Flipkart (like Millennia), and dedicated co-branded cards for fuel and grocery bills.</p>
      <br>
      <h3>2. Pay Your Balances in Full</h3>
      <p>Paying only the "minimum due" is a debt trap. Credit card interest rates can range from 36% to 45% p.a. Always pay off the full outstanding balance before the due date to avoid interest penalties.</p>
      <br>
      <h3>3. Utilize Lounge and Milestone Benefits</h3>
      <p>Keep track of complimentary lounge terms (some require spending ₹15,000 in the previous quarter). Set reminders for quarterly milestone goals to redeem vouchers before they expire.</p>
    `
  },
  'blog-3': {
    title: 'IPO Grey Market Premium (GMP) Demystified',
    date: 'June 28, 2026',
    category: 'Investing',
    content: `
      <p>Grey Market Premium (GMP) is the premium price at which IPO shares are traded in an unofficial, unregulated market before they are formally listed on stock exchanges (BSE/NSE).</p>
      <br>
      <h3>Is GMP a Reliable Predictor?</h3>
      <p>GMP reflects demand and supply sentiments among market traders. While a high GMP (e.g. 50%+) often correlates with listing day gains, it is not a legal guarantee. GMP changes daily based on overall market conditions, subscription numbers, and institutional interest.</p>
      <br>
      <h3>How to evaluate IPOs</h3>
      <p>Never invest solely based on GMP. Check core company valuations (P/E ratio vs peers), sales growth, debt levels, and read official draft prospectus guidelines.</p>
    `
  },
  'blog-4': {
    title: 'Health vs Term Life Cover: Which Comes First?',
    date: 'June 25, 2026',
    category: 'Insurance',
    content: `
      <p>Both Health Insurance and Term Life Insurance are critical pillars of sound financial planning, yet they serve entirely distinct risk coverages.</p>
      <br>
      <h3>Health Insurance is for the Living</h3>
      <p>Medical emergencies can wipe out years of savings. Health insurance pays hospital bills directly or reimburses expenditures. Acquire a cover of at least ₹5-10 Lakhs early to avoid higher premium rates as you age.</p>
      <br>
      <h3>Term Life Insurance is for Your Dependents</h3>
      <p>Term life pays a sum assured (e.g. ₹1 Crore) to your beneficiaries in the unfortunate event of your demise. If you have active dependents (parents, kids, spouse) or home loans, term coverage is mandatory. Aim for a sum assured equal to 10-15 times your annual salary.</p>
    `
  }
};

function initBlogs() {
  const searchInput = document.getElementById('blog-search');
  const tags = document.querySelectorAll('#blog-tags .filter-tab');
  const container = document.getElementById('blogs-container');
  const modal = document.getElementById('blog-modal');
  const modalClose = document.getElementById('blog-modal-close');
  
  if (!container) return;
  
  // Blog Card Clicks
  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const blogId = card.getAttribute('data-blog-id');
      const blogData = BLOG_DB[blogId];
      if (!blogData) return;
      
      document.getElementById('blog-modal-title').textContent = blogData.title;
      document.getElementById('blog-modal-date').textContent = blogData.date;
      document.getElementById('blog-modal-badge').textContent = blogData.category;
      document.getElementById('blog-modal-content').innerHTML = blogData.content;
      
      modal.classList.add('open');
    });
  });
  
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterBlogs();
    });
  }
  
  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      filterBlogs();
    });
  });
  
  function filterBlogs() {
    const searchVal = searchInput ? searchInput.value.toLowerCase() : '';
    const activeTag = document.querySelector('#blog-tags .filter-tab.active');
    const category = activeTag ? activeTag.getAttribute('data-blog-cat') : 'all';
    
    document.querySelectorAll('.blog-card').forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      const cardCat = card.getAttribute('data-cat');
      
      const matchesSearch = title.includes(searchVal) || desc.includes(searchVal);
      const matchesCat = (category === 'all' || cardCat === category);
      
      if (matchesSearch && matchesCat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

// ==========================================
// 11. NEW CONTACT US MESSAGE Logic
// ==========================================
function initContactPage() {
  const form = document.getElementById('contact-feedback-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value;
    form.reset();
    showToast(`Thank you, ${name}! Your message has been received. We will get back to you shortly.`, 'success');
  });
}

// ==========================================
// 12. DYNAMIC SERVICES SYSTEM
// ==========================================
function initServicesManagement() {
  // Load services from localStorage
  const saved = localStorage.getItem('fv_services');
  if (saved) {
    try {
      servicesList = JSON.parse(saved);
    } catch (e) {
      servicesList = DEFAULT_SERVICES;
    }
  } else {
    servicesList = DEFAULT_SERVICES;
    localStorage.setItem('fv_services', JSON.stringify(servicesList));
  }

  // Render initial services in grids
  renderHomeServices();
  renderDirectoryServices();

  // Bind dynamic custom generic apply button click handler
  const customApplyBtn = document.getElementById('btn-custom-portal-apply');
  if (customApplyBtn) {
    customApplyBtn.addEventListener('click', () => {
      if (currentCustomService) {
        showApplyModal(`Custom Service: ${currentCustomService.title}`);
      }
    });
  }
}

function renderHomeServices() {
  const homeGrid = document.getElementById('home-services-grid');
  if (!homeGrid) return;
  
  const activeServices = servicesList.filter(s => s.active === true);
  
  if (activeServices.length === 0) {
    homeGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-secondary); padding: 40px;">No active services available.</div>`;
    return;
  }
  
  homeGrid.innerHTML = activeServices.map(service => {
    const iconData = ICON_MAP[service.iconType] || ICON_MAP.custom;
    return `
      <div class="glass-card service-card hover-effect" data-tab="${service.targetTab}" data-custom-id="${service.id}">
        <div class="service-card-icon ${iconData.cssClass}">
          ${iconData.svg}
        </div>
        <h3>${service.title}</h3>
        <p>${service.description}</p>
        <span class="badge badge-${service.badgeType}">${service.badge}</span>
      </div>
    `;
  }).join('');
}

function renderDirectoryServices() {
  const dirGrid = document.getElementById('dir-services-grid');
  if (!dirGrid) return;
  
  const activeServices = servicesList.filter(s => s.active === true);
  
  if (activeServices.length === 0) {
    dirGrid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:var(--text-secondary); padding: 40px;">No active services available.</div>`;
    return;
  }
  
  dirGrid.innerHTML = activeServices.map(service => {
    const iconData = ICON_MAP[service.iconType] || ICON_MAP.custom;
    return `
      <div class="glass-card service-dir-card hover-effect" data-tab="${service.targetTab}" data-custom-id="${service.id}">
        <div class="service-dir-icon ${iconData.cssClass}">
          ${iconData.svg}
        </div>
        <h3>${service.subtitle || service.title}</h3>
        <p>${service.description}</p>
        <div class="dir-actions">
          <span class="badge badge-${service.badgeType}">${service.badge}</span>
          <button class="btn btn-outline-primary btn-sm service-go-btn" data-tab="${service.targetTab}" data-custom-id="${service.id}">Go to Portal</button>
        </div>
      </div>
    `;
  }).join('');
}

function openCustomPortal(serviceId) {
  const service = servicesList.find(s => s.id === serviceId);
  if (!service) return;
  
  currentCustomService = service;
  
  document.getElementById('custom-portal-title').textContent = `${service.title} Portal`;
  document.getElementById('custom-portal-subtitle').textContent = service.subtitle || service.description;
  document.getElementById('custom-portal-heading').textContent = `Welcome to the ${service.title} Workspace`;
  document.getElementById('custom-portal-desc').textContent = service.description;
  
  const count = userApplications.filter(app => app.service === `Custom Service: ${service.title}`).length;
  document.getElementById('custom-portal-leads').textContent = `${count} Lead Submissions`;
  
  switchTab('custom-generic');
}

// ==========================================
// ADVANCED DYNAMIC GRAPHICS FOR LOANS
// ==========================================
function renderAmortizationChart(P, annualRate, N_years) {
  const container = document.getElementById('amortization-chart-container');
  if (!container) return;

  const r = (annualRate / 12) / 100;
  const n = N_years * 12;

  let emi = 0;
  if (r > 0 && n > 0) {
    emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  } else if (n > 0) {
    emi = P / n;
  }

  const totalPayment = emi * n;

  // Calculate year-by-year outstanding principal and cumulative interest paid
  const dataPoints = [];
  dataPoints.push({
    year: 0,
    outstanding: P,
    interestPaid: 0
  });

  for (let year = 1; year <= N_years; year++) {
    const month = year * 12;
    let outstanding = 0;
    if (r > 0) {
      outstanding = P * (Math.pow(1 + r, n) - Math.pow(1 + r, month)) / (Math.pow(1 + r, n) - 1);
    }
    if (outstanding < 0) outstanding = 0;
    
    const cumulativePayment = emi * month;
    const principalPaid = P - outstanding;
    const interestPaid = Math.max(0, cumulativePayment - principalPaid);

    dataPoints.push({
      year: year,
      outstanding: Math.round(outstanding),
      interestPaid: Math.round(interestPaid)
    });
  }

  const width = 500;
  const height = 200;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(P, totalPayment);

  const getX = (year) => paddingLeft + (year / N_years) * chartWidth;
  const getY = (val) => paddingTop + chartHeight - (val / maxVal) * chartHeight;

  let outstandingPath = `M ${getX(0)} ${getY(dataPoints[0].outstanding)}`;
  for (let i = 1; i < dataPoints.length; i++) {
    outstandingPath += ` L ${getX(dataPoints[i].year)} ${getY(dataPoints[i].outstanding)}`;
  }
  const outstandingAreaPath = outstandingPath + ` L ${getX(N_years)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  let interestPath = `M ${getX(0)} ${getY(dataPoints[0].interestPaid)}`;
  for (let i = 1; i < dataPoints.length; i++) {
    interestPath += ` L ${getX(dataPoints[i].year)} ${getY(dataPoints[i].interestPaid)}`;
  }
  const interestAreaPath = interestPath + ` L ${getX(N_years)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

  let gridLines = '';
  const yTicks = 4;
  for (let i = 0; i <= yTicks; i++) {
    const val = (maxVal / yTicks) * i;
    const y = getY(val);
    gridLines += `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" class="chart-grid-line" />`;
    const formattedVal = val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : `₹${Math.round(val/1000)}K`;
    gridLines += `<text x="${paddingLeft - 8}" y="${y + 3}" text-anchor="end" class="chart-label-text">${formattedVal}</text>`;
  }

  let xLabels = '';
  for (let i = 0; i < dataPoints.length; i++) {
    const x = getX(dataPoints[i].year);
    if (i > 0 && i < dataPoints.length - 1) {
      gridLines += `<line x1="${x}" y1="${paddingTop}" x2="${x}" y2="${height - paddingBottom}" class="chart-grid-line" />`;
    }
    xLabels += `<text x="${x}" y="${height - 8}" text-anchor="middle" class="chart-label-text">Yr ${dataPoints[i].year}</text>`;
  }

  let interactivePoints = '';
  for (let i = 0; i < dataPoints.length; i++) {
    const pt = dataPoints[i];
    const x = getX(pt.year);
    const yOut = getY(pt.outstanding);
    const yInt = getY(pt.interestPaid);

    interactivePoints += `
      <circle cx="${x}" cy="${yOut}" r="3.5" class="chart-interactive-point" stroke="var(--primary)" fill="var(--bg-primary)" data-tooltip="Year ${pt.year}: Bal ${formatCurrency(pt.outstanding)}" />
      <circle cx="${x}" cy="${yInt}" r="3.5" class="chart-interactive-point" stroke="var(--secondary)" fill="var(--bg-primary)" data-tooltip="Year ${pt.year}: Int ${formatCurrency(pt.interestPaid)}" />
    `;
  }

  const svgHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="overflow: visible;">
      <defs>
        <linearGradient id="principal-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="interest-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--secondary)" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="var(--secondary)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      
      <!-- Grid Lines -->
      ${gridLines}
      
      <!-- Area Fills -->
      <path d="${outstandingAreaPath}" fill="url(#principal-grad)" />
      <path d="${interestAreaPath}" fill="url(#interest-grad)" />
      
      <!-- Line Strokes -->
      <path d="${outstandingPath}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" />
      <path d="${interestPath}" fill="none" stroke="var(--secondary)" stroke-width="2.5" stroke-linecap="round" />
      
      <!-- Node Points -->
      ${interactivePoints}
      
      <!-- Axes -->
      <line x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${height - paddingBottom}" class="chart-axis-line" stroke="var(--text-muted)" />
      <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" class="chart-axis-line" stroke="var(--text-muted)" />
      
      <!-- Axis Labels -->
      ${xLabels}
    </svg>
  `;

  container.innerHTML = svgHTML;
}

function renderBankEMIComparison(P, N_years) {
  const container = document.getElementById('bank-bar-chart-container');
  if (!container) return;

  const BANK_PARTNERS = [
    { name: 'IndusInd Bank', minRate: 10.49, maxTenure: 5, colorGrad: ['#4f46e5', '#0d9488'] },
    { name: 'KreditBee', minRate: 12.00, maxTenure: 2, colorGrad: ['#166534', '#0d9488'] },
    { name: 'Fibe', minRate: 12.00, maxTenure: 3, colorGrad: ['#ec4899', '#4f46e5'] },
    { name: 'Nira', minRate: 18.00, maxTenure: 1, colorGrad: ['#e11d48', '#d97706'] },
    { name: 'Cashe', minRate: 15.00, maxTenure: 1.5, colorGrad: ['#7c3aed', '#ec4899'] }
  ];

  const emiList = [];
  BANK_PARTNERS.forEach(bank => {
    const cappedTenure = Math.min(N_years, bank.maxTenure);
    const isCapped = N_years > bank.maxTenure;
    const rBank = (bank.minRate / 12) / 100;
    const nBank = cappedTenure * 12;
    
    let bankEmi = 0;
    if (rBank > 0 && nBank > 0) {
      bankEmi = P * rBank * Math.pow(1 + rBank, nBank) / (Math.pow(1 + rBank, nBank) - 1);
    } else if (nBank > 0) {
      bankEmi = P / nBank;
    }
    
    emiList.push({
      ...bank,
      emi: Math.round(bankEmi),
      tenure: cappedTenure,
      isCapped: isCapped
    });
  });

  const maxEmiVal = Math.max(...emiList.map(item => item.emi));

  const width = 500;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 10;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getBarX = (index) => paddingLeft + (index * (chartWidth / 5)) + (chartWidth / 10);
  const getBarY = (val) => paddingTop + chartHeight - (val / maxEmiVal) * chartHeight;
  const getBarHeight = (val) => (val / maxEmiVal) * chartHeight;

  let grads = '';
  let barsHTML = '';
  let labelsHTML = '';
  let gridLines = '';

  const ticks = 3;
  for (let i = 0; i <= ticks; i++) {
    const val = (maxEmiVal / ticks) * i;
    const y = getBarY(val);
    gridLines += `<line x1="${paddingLeft}" y1="${y}" x2="${width - paddingRight}" y2="${y}" class="chart-grid-line" />`;
    const formattedVal = val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : `₹${Math.round(val/1000)}K`;
    gridLines += `<text x="${paddingLeft - 8}" y="${y + 3}" text-anchor="end" class="chart-label-text">${formattedVal}</text>`;
  }

  emiList.forEach((item, index) => {
    const x = getBarX(index);
    const y = getBarY(item.emi);
    const barH = getBarHeight(item.emi);
    const barWidth = 34;

    const gradId = `bar-grad-${index}`;
    const stopColor1 = item.isCapped ? '#f97316' : item.colorGrad[0];
    const stopColor2 = item.isCapped ? '#ef4444' : item.colorGrad[1];
    
    grads += `
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${stopColor1}" />
        <stop offset="100%" stop-color="${stopColor2}" />
      </linearGradient>
    `;

    const roundedR = 4;
    barsHTML += `
      <rect x="${x - barWidth/2}" y="${y}" width="${barWidth}" height="${barH}" rx="${roundedR}" fill="url(#${gradId})" class="bar-rect" />
    `;

    let cappedText = '';
    if (item.isCapped) {
      barsHTML += `
        <g transform="translate(${x}, ${y - 12})">
          <circle cx="0" cy="0" r="6" fill="#f97316" />
          <text x="0" y="2.5" text-anchor="middle" fill="white" font-size="8" font-weight="bold">!</text>
        </g>
      `;
      cappedText = `<tspan x="${x}" dy="10" fill="#f97316" font-weight="600" font-size="8px">Capped ${item.tenure}Yr</tspan>`;
    } else {
      cappedText = `<tspan x="${x}" dy="10" fill="var(--text-muted)" font-size="8px">${item.tenure} Years</tspan>`;
    }

    const formattedEmiStr = item.emi >= 100000 ? `₹${(item.emi / 100000).toFixed(2)}L` : formatCurrency(item.emi);
    labelsHTML += `
      <text x="${x}" y="${y - (item.isCapped ? 22 : 8)}" text-anchor="middle" class="chart-label-text" font-weight="bold" fill="var(--text-primary)" font-size="9px">${formattedEmiStr}</text>
    `;

    labelsHTML += `
      <text x="${x}" y="${height - 24}" text-anchor="middle" class="chart-label-text" font-weight="600" fill="var(--text-primary)">${item.name}</text>
      <text x="${x}" y="${height - 14}" text-anchor="middle" class="chart-label-text">
        <tspan x="${x}">${item.minRate}% rate</tspan>
        ${cappedText}
      </text>
    `;
  });

  const svgHTML = `
    <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%" style="overflow: visible;">
      <defs>
        ${grads}
      </defs>
      
      <!-- Grid lines -->
      ${gridLines}
      
      <!-- Bar rectangles -->
      ${barsHTML}
      
      <!-- Labels -->
      ${labelsHTML}
      
      <!-- Axes -->
      <line x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${height - paddingBottom}" class="chart-axis-line" stroke="var(--text-muted)" />
      <line x1="${paddingLeft}" y1="${height - paddingBottom}" x2="${width - paddingRight}" y2="${height - paddingBottom}" class="chart-axis-line" stroke="var(--text-muted)" />
    </svg>
  `;

  container.innerHTML = svgHTML;
}

// ==========================================
// 13. FLOATING SERVICE CHATBOT WIDGET CONTROLLER
// ==========================================
let chatState = {
  step: 'WELCOME',
  service: '',
  name: '',
  phone: '',
  email: ''
};

function initChatbot() {
  const trigger = document.getElementById('chatbot-trigger');
  const closeBtn = document.getElementById('chatbot-close');
  const widget = document.getElementById('chatbot-widget');
  const form = document.getElementById('chat-input-form');

  if (!trigger || !widget) return;

  trigger.addEventListener('click', () => {
    widget.classList.toggle('open');
    if (widget.classList.contains('open') && document.getElementById('chat-messages').children.length === 0) {
      startChatConversation();
    }
  });

  closeBtn.addEventListener('click', () => {
    widget.classList.remove('open');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-text-input');
    const val = input.value.trim();
    if (!val) return;

    input.value = '';
    handleChatInput(val);
  });
}

function startChatConversation() {
  chatState = { step: 'WELCOME', service: '', name: '', phone: '', email: '' };
  document.getElementById('chat-messages').innerHTML = '';
  document.getElementById('chat-options-panel').innerHTML = '';
  document.getElementById('chat-input-form').style.display = 'none';

  sendBotReply("Hello! Welcome to FINANCEVIEW. 🤖 I'm your interactive assistant. I can help you instantly generate inquiries for our premium financial services.");
  setTimeout(() => {
    sendBotReply("Which service would you like to explore today? Select an option below:", [
      { text: "Personal Loan", val: "Personal Loan" },
      { text: "Credit Cards", val: "Credit Cards" },
      { text: "Insurance", val: "Insurance" },
      { text: "Demat Account", val: "Demat Account" },
      { text: "Bank Accounts", val: "Bank Accounts" },
      { text: "IPO Review", val: "IPO Review" }
    ]);
  }, 650);
}

function sendBotReply(text, options = null) {
  showTypingIndicator();
  setTimeout(() => {
    hideTypingIndicator();
    appendBubble(text, 'bot');

    const optionsPanel = document.getElementById('chat-options-panel');
    optionsPanel.innerHTML = '';

    if (options && options.length > 0) {
      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'chat-option-btn';
        btn.textContent = opt.text;
        btn.addEventListener('click', () => {
          appendBubble(opt.text, 'user');
          optionsPanel.innerHTML = ''; // Clear options immediately
          handleChatInput(opt.val);
        });
        optionsPanel.appendChild(btn);
      });
    }
  }, 600);
}

function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  if (document.getElementById('typing-indicator-el')) return;

  const el = document.createElement('div');
  el.id = 'typing-indicator-el';
  el.className = 'typing-indicator';
  el.innerHTML = `
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  `;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
  const el = document.getElementById('typing-indicator-el');
  if (el) el.remove();
}

function appendBubble(text, sender) {
  const container = document.getElementById('chat-messages');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function handleChatInput(val) {
  const form = document.getElementById('chat-input-form');
  const textInput = document.getElementById('chat-text-input');

  if (chatState.step === 'WELCOME') {
    if (val === 'Insurance') {
      chatState.step = 'SELECT_INSURANCE';
      sendBotReply("We offer several customized insurance coverage options. Which protection plan do you need?", [
        { text: "Health Insurance", val: "Health Insurance" },
        { text: "Life Insurance", val: "Life Insurance" },
        { text: "Term Plan", val: "Term Plan" },
        { text: "Motor Insurance", val: "Motor Insurance" },
        { text: "Fire Insurance", val: "Fire Insurance" }
      ]);
    } else {
      chatState.service = val;
      chatState.step = 'COLLECT_NAME';
      form.style.display = 'flex';
      textInput.placeholder = "Enter your full name...";
      textInput.type = "text";
      sendBotReply("Excellent choice! Let's get your inquiry registered. Could you please share your **full name**?");
    }
  } else if (chatState.step === 'SELECT_INSURANCE') {
    chatState.service = val;
    chatState.step = 'COLLECT_NAME';
    form.style.display = 'flex';
    textInput.placeholder = "Enter your full name...";
    textInput.type = "text";
    sendBotReply(`Perfect, a ${val} inquiry. Could you please share your **full name**?`);
  } else if (chatState.step === 'COLLECT_NAME') {
    chatState.name = val;
    chatState.step = 'COLLECT_PHONE';
    textInput.placeholder = "Enter 10-digit mobile number...";
    textInput.type = "tel";
    sendBotReply(`Thanks, **${val}**. May I have your **mobile phone number** so our advisor can contact you?`);
  } else if (chatState.step === 'COLLECT_PHONE') {
    // Basic phone validation
    if (!/^[0-9+ \-]{10,15}$/.test(val)) {
      sendBotReply("Please enter a valid mobile number (e.g. 9876543210):");
      return;
    }
    chatState.phone = val;
    chatState.step = 'COLLECT_EMAIL';
    textInput.placeholder = "Enter email address...";
    textInput.type = "email";
    sendBotReply("Great. And lastly, what is your **email address** to send the policy/quote copy?");
  } else if (chatState.step === 'COLLECT_EMAIL') {
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      sendBotReply("Please enter a valid email address:");
      return;
    }
    chatState.email = val;
    chatState.step = 'CONFIRMATION';
    form.style.display = 'none';

    // Submit lead programmatically!
    const fullServiceName = `${chatState.service} (via Chatbot)`;
    addApplication(fullServiceName, chatState.name);
    
    // Retrieve reference ID of the application we just added (last item in array)
    const refId = userApplications.length > 0 ? userApplications[userApplications.length - 1].id : 'FV-CHATBOT';

    sendBotReply(`Perfect! I have generated your service inquiry request successfully.`, null);
    setTimeout(() => {
      sendBotReply(`Inquiry Details:
• **Service**: ${chatState.service}
• **Lead Reference**: ${refId}
• **Applicant**: ${chatState.name}
• **Phone**: ${chatState.phone}

A financial executive will reach out to you within 24 hours. You can review and track this application under your **Personal Account** tab!`, [
        { text: "Create New Inquiry", val: "RESET" }
      ]);
    }, 800);
  } else if (chatState.step === 'CONFIRMATION' && val === 'RESET') {
    startChatConversation();
  }
}

// ==========================================
// 14. IPO TRACKER & ALLOTMENT STATUS CHECKER
// ==========================================

const IPO_DB = [
  {
    id: 'kusumgar',
    name: 'Kusumgar Ltd',
    type: 'mainboard',
    openDate: '2026-07-08',
    closeDate: '2026-07-10',
    allotmentDate: '2026-07-13',
    listingDate: '2026-07-15',
    minPrice: 398,
    maxPrice: 419,
    lotSize: 35,
    issueSize: '₹420 Cr',
    gmp: 168,
    subscriptions: {
      retail: 1.5,
      nii: 1.1,
      qib: 0.8,
      total: 1.2
    },
    registrar: 'Link Intime India Private Ltd',
    verdict: 'apply',
    ratingText: 'Apply for listing gains',
    strengths: [
      'Leading technical textiles manufacturer in India.',
      'Robust EBITDA margins showing consistent growth.',
      'Strong institutional partnerships in defense.'
    ],
    weaknesses: [
      'High dependency on raw material imports.',
      'Concentrated client list with top 5 customers contributing 50% revenue.'
    ],
    status: 'open'
  },
  {
    id: 'laser-power',
    name: 'Laser Power & Infra',
    type: 'mainboard',
    openDate: '2026-07-09',
    closeDate: '2026-07-13',
    allotmentDate: '2026-07-14',
    listingDate: '2026-07-16',
    minPrice: 203,
    maxPrice: 214,
    lotSize: 70,
    issueSize: '₹280 Cr',
    gmp: 22,
    subscriptions: {
      retail: 0.0,
      nii: 0.0,
      qib: 0.0,
      total: 0.0
    },
    registrar: 'KFin Technologies Limited',
    verdict: 'neutral',
    ratingText: 'Neutral / Apply for Long Term Only',
    strengths: [
      'Established track record in electrical infrastructure EPC contracts.',
      'Healthy order book of over ₹1,200 Crores execution pipeline.'
    ],
    weaknesses: [
      'Working capital intensive operations with high receivable days.',
      'Low profit margins compared to key peer sector listing players.'
    ],
    status: 'upcoming'
  },
  {
    id: 'sbi-funds',
    name: 'SBI Funds Management',
    type: 'mainboard',
    openDate: '2026-07-14',
    closeDate: '2026-07-16',
    allotmentDate: '2026-07-17',
    listingDate: '2026-07-21',
    minPrice: 545,
    maxPrice: 575,
    lotSize: 26,
    issueSize: '₹1,500 Cr',
    gmp: 138,
    subscriptions: {
      retail: 0.0,
      nii: 0.0,
      qib: 0.0,
      total: 0.0
    },
    registrar: 'KFin Technologies Limited',
    verdict: 'apply',
    ratingText: 'Highly Recommended / Strong Apply',
    strengths: [
      'Largest asset management company (AMC) in India with unmatched distribution.',
      'Sovereign parentage (SBI brand equity) ensuring trust and reach.',
      'Superb return on equity (ROE > 28%) and debt-free balance sheet.'
    ],
    weaknesses: [
      'Market dependency makes revenues vulnerable to severe equity corrections.',
      'Fee cap regulations from SEBI might impact margins in future quarters.'
    ],
    status: 'upcoming'
  },
  {
    id: 'devson',
    name: 'Devson Catalyst Ltd',
    type: 'sme',
    openDate: '2026-07-09',
    closeDate: '2026-07-13',
    allotmentDate: '2026-07-14',
    listingDate: '2026-07-16',
    minPrice: 112,
    maxPrice: 118,
    lotSize: 1200,
    issueSize: '₹18.5 Cr',
    gmp: 42,
    subscriptions: {
      retail: 0.0,
      nii: 0.0,
      qib: 0.0,
      total: 0.0
    },
    registrar: 'Bigshare Services Pvt Ltd',
    verdict: 'apply',
    ratingText: 'Apply for listing gains (SME Risk)',
    strengths: [
      'High growth chemical catalyst player with strong proprietary formulations.',
      'Export footprint expanding in EU and Southeast Asian countries.'
    ],
    weaknesses: [
      'SME lot size represents high illiquidity post listing.',
      'Regulatory compliance risks relating to environmental pollution.'
    ],
    status: 'upcoming'
  },
  {
    id: 'happy-steels',
    name: 'Happy Steels Ltd',
    type: 'sme',
    openDate: '2026-07-09',
    closeDate: '2026-07-13',
    allotmentDate: '2026-07-14',
    listingDate: '2026-07-16',
    minPrice: 62,
    maxPrice: 66,
    lotSize: 2000,
    issueSize: '₹14.2 Cr',
    gmp: 0,
    subscriptions: {
      retail: 0.0,
      nii: 0.0,
      qib: 0.0,
      total: 0.0
    },
    registrar: 'Skyline Financial Services Pvt Ltd',
    verdict: 'avoid',
    ratingText: 'Avoid / High Valuation',
    strengths: [
      'Niche manufacturer of steel pipes and forgings.'
    ],
    weaknesses: [
      'Flat sales growth over the last three financial years.',
      'High debt-to-equity ratio of 1.65 indicates financial stress.'
    ],
    status: 'upcoming'
  },
  {
    id: 'ic-electricals',
    name: 'IC Electricals Ltd',
    type: 'sme',
    openDate: '2026-07-03',
    closeDate: '2026-07-07',
    allotmentDate: '2026-07-09',
    listingDate: '2026-07-13',
    minPrice: 94,
    maxPrice: 99,
    lotSize: 1200,
    issueSize: '₹22.8 Cr',
    gmp: 48,
    subscriptions: {
      retail: 22.1,
      nii: 18.3,
      qib: 4.2,
      total: 14.8
    },
    registrar: 'Bigshare Services Pvt Ltd',
    verdict: 'apply',
    ratingText: 'Apply / Good demand in Grey Market',
    strengths: [
      'Industrial electrical switchgear supplier with reliable contracts.',
      'Double digit net profit growth margins.'
    ],
    weaknesses: [
      'Raw material prices are highly volatile (copper and aluminum).',
      'Intense competition from organized national brands.'
    ],
    status: 'closed'
  },
  {
    id: 'teja-eng',
    name: 'Teja Engineering Ltd',
    type: 'sme',
    openDate: '2026-06-29',
    closeDate: '2026-07-02',
    allotmentDate: '2026-07-03',
    listingDate: '2026-07-07',
    minPrice: 210,
    maxPrice: 220,
    lotSize: 600,
    issueSize: '₹34.5 Cr',
    gmp: 198,
    subscriptions: {
      retail: 114.2,
      nii: 86.5,
      qib: 32.1,
      total: 78.4
    },
    registrar: 'Link Intime India Private Ltd',
    verdict: 'apply',
    ratingText: 'Bumper Listing gains achieved (90%)',
    strengths: [
      'Precision aerospace parts engineering manufacturer.',
      'Order backlog worth 4x trailing annual revenue.'
    ],
    weaknesses: [
      'Capacity utilization is currently capped at 85%.'
    ],
    status: 'listed',
    listingPrice: 418,
    currentPrice: 438
  },
  {
    id: 'kratikal-tech',
    name: 'Kratikal Tech Ltd',
    type: 'sme',
    openDate: '2026-06-25',
    closeDate: '2026-06-30',
    allotmentDate: '2026-07-01',
    listingDate: '2026-07-06',
    minPrice: 130,
    maxPrice: 135,
    lotSize: 1000,
    issueSize: '₹12.1 Cr',
    gmp: 57,
    subscriptions: {
      retail: 45.2,
      nii: 22.1,
      qib: 8.5,
      total: 25.4
    },
    registrar: 'KFin Technologies Limited',
    verdict: 'apply',
    ratingText: 'Listed at 42.2% premium',
    strengths: [
      'Specialized enterprise cybersecurity threat scanning provider.',
      'SaaS recurring model accounts for 65% of revenue streams.'
    ],
    weaknesses: [
      'High attrition rates of security engineering staff.',
      'Relatively high price-to-earnings multiple.'
    ],
    status: 'listed',
    listingPrice: 192,
    currentPrice: 210
  },
  {
    id: 'waterways',
    name: 'Waterways Leisure Tourism',
    type: 'mainboard',
    openDate: '2026-06-22',
    closeDate: '2026-06-24',
    allotmentDate: '2026-06-27',
    listingDate: '2026-07-01',
    minPrice: 770,
    maxPrice: 808,
    lotSize: 18,
    issueSize: '₹920 Cr',
    gmp: -118,
    subscriptions: {
      retail: 0.8,
      nii: 0.9,
      qib: 1.1,
      total: 0.95
    },
    registrar: 'Link Intime India Private Ltd',
    verdict: 'avoid',
    ratingText: 'Listed at discount (-14.6%)',
    strengths: [
      'Prominent cruise holiday organizer in western India.'
    ],
    weaknesses: [
      'Extremely high capital expenditure requirements for vessel leasing.',
      'Vulnerable to fuel price spikes and maritime licensing guidelines.'
    ],
    status: 'listed',
    listingPrice: 690,
    currentPrice: 712
  },
  {
    id: 'turtlemint',
    name: 'Turtlemint Fintech Ltd',
    type: 'mainboard',
    openDate: '2026-06-18',
    closeDate: '2026-06-22',
    allotmentDate: '2026-06-25',
    listingDate: '2026-06-29',
    minPrice: 144,
    maxPrice: 152,
    lotSize: 95,
    issueSize: '₹680 Cr',
    gmp: -16,
    subscriptions: {
      retail: 1.1,
      nii: 1.3,
      qib: 2.4,
      total: 1.6
    },
    registrar: 'KFin Technologies Limited',
    verdict: 'neutral',
    ratingText: 'Listed at discount (-10.5%)',
    strengths: [
      'Innovative insurance brokerage aggregator platform.',
      'Extensive sub-broker network of 120,000+ points of sale.'
    ],
    weaknesses: [
      'Net profitability is volatile due to high commission marketing spends.',
      'Regulatory compliance risks from IRDAI.'
    ],
    status: 'listed',
    listingPrice: 136,
    currentPrice: 142
  }
];

let activeIpoTab = 'mainboard';

function initIPOReview() {
  const ipoGrid = document.getElementById('ipo-grid-container');
  const allotmentSelect = document.getElementById('allotment-ipo-select');
  const allotmentForm = document.getElementById('ipo-allotment-form');
  const ipoSearch = document.getElementById('ipo-search');
  const ipoStatusFilter = document.getElementById('ipo-status-filter');
  
  if (!ipoGrid) return;

  // Sub-tab button events
  const tabBtns = document.querySelectorAll('.ipo-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeIpoTab = btn.getAttribute('data-ipo-tab');
      renderIpoGrid();
    });
  });

  // Search input events
  if (ipoSearch) {
    ipoSearch.addEventListener('input', renderIpoGrid);
  }

  // Filter select events
  if (ipoStatusFilter) {
    ipoStatusFilter.addEventListener('change', renderIpoGrid);
  }

  // Populate Allotment Checker Select Dropdown
  if (allotmentSelect) {
    allotmentSelect.innerHTML = '<option value="" disabled selected>Choose an IPO...</option>';
    IPO_DB.forEach(ipo => {
      const opt = document.createElement('option');
      opt.value = ipo.id;
      let suffix = '';
      if (ipo.status === 'listed') suffix = ' (Listed)';
      else if (ipo.status === 'closed') suffix = ' (Closed)';
      else if (ipo.status === 'open') suffix = ' (Open Now)';
      else suffix = ' (Upcoming)';
      opt.textContent = ipo.name + suffix;
      allotmentSelect.appendChild(opt);
    });
  }

  // Allotment Form submit event
  if (allotmentForm) {
    allotmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ipoId = allotmentSelect.value;
      const idType = document.getElementById('allotment-id-type').value;
      const queryVal = document.getElementById('allotment-query-val').value.trim();
      
      if (!ipoId) {
        showToast('Please select an IPO from the dropdown.', 'warning');
        return;
      }
      if (!queryVal) {
        showToast('Please enter your details.', 'warning');
        return;
      }

      showAllotmentResult(ipoId, idType, queryVal);
    });
  }

  // Bind close events for modals
  const detailsClose1 = document.getElementById('ipo-details-modal-close');
  const detailsClose2 = document.getElementById('ipo-details-close-btn');
  const detailsModal = document.getElementById('ipo-details-modal');

  if (detailsClose1) detailsClose1.addEventListener('click', () => detailsModal.classList.remove('open'));
  if (detailsClose2) detailsClose2.addEventListener('click', () => detailsModal.classList.remove('open'));

  const allotmentClose1 = document.getElementById('allotment-results-modal-close');
  const allotmentClose2 = document.getElementById('allotment-results-done-btn');
  const allotmentModal = document.getElementById('ipo-allotment-results-modal');

  if (allotmentClose1) allotmentClose1.addEventListener('click', () => allotmentModal.classList.remove('open'));
  if (allotmentClose2) allotmentClose2.addEventListener('click', () => allotmentModal.classList.remove('open'));

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === detailsModal) detailsModal.classList.remove('open');
    if (e.target === allotmentModal) allotmentModal.classList.remove('open');
  });

  // Render initial grid
  renderIpoGrid();
}

function renderIpoGrid() {
  const container = document.getElementById('ipo-grid-container');
  const searchVal = document.getElementById('ipo-search')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('ipo-status-filter')?.value || 'all';

  if (!container) return;

  // Filter IPOs
  const filtered = IPO_DB.filter(ipo => {
    if (ipo.type !== activeIpoTab) return false;
    if (searchVal && !ipo.name.toLowerCase().includes(searchVal)) return false;
    if (statusFilter !== 'all') {
      if (statusFilter === 'open' && ipo.status !== 'open') return false;
      if (statusFilter === 'upcoming' && ipo.status !== 'upcoming') return false;
      if (statusFilter === 'closed' && ipo.status !== 'closed' && ipo.status !== 'listed') return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
        No IPOs found matching the specified filters. Try refining your search query.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(ipo => {
    let listingInfoHtml = '';
    let statusBadgeHtml = '';
    let subInfoHtml = '';
    let btnHtml = '';
    let detailsLinkHtml = `<button class="btn btn-outline-primary btn-sm view-ipo-details-btn" style="flex-grow:1; justify-content:center;" data-ipo-id="${ipo.id}">View Analysis</button>`;

    if (ipo.status === 'open') {
      statusBadgeHtml = `<span class="badge badge-success">OPEN NOW</span>`;
      btnHtml = `<button class="btn btn-primary btn-sm apply-ipo-btn" style="flex-grow:1; justify-content:center;" data-ipo="${ipo.name}">Subscribe</button>`;
    } else if (ipo.status === 'upcoming') {
      statusBadgeHtml = `<span class="badge badge-primary">UPCOMING</span>`;
      btnHtml = `<button class="btn btn-secondary btn-sm" style="flex-grow:1; justify-content:center;" disabled>Upcoming</button>`;
    } else if (ipo.status === 'closed') {
      statusBadgeHtml = `<span class="badge badge-warning">CLOSED</span>`;
      btnHtml = `<button class="btn btn-secondary btn-sm" style="flex-grow:1; justify-content:center;" disabled>Closed</button>`;
    } else if (ipo.status === 'listed') {
      statusBadgeHtml = `<span class="badge badge-secondary">LISTED</span>`;
      btnHtml = `<button class="btn btn-outline-primary btn-sm" style="flex-grow:1; justify-content:center;" onclick="switchTab('demat-account')">Trade Now</button>`;
    }

    if (ipo.status === 'listed') {
      const issuePrice = ipo.maxPrice;
      const listingPrice = ipo.listingPrice;
      const gainVal = listingPrice - issuePrice;
      const gainPct = ((gainVal / issuePrice) * 100).toFixed(1);
      const isProfit = gainVal >= 0;
      
      listingInfoHtml = `
        <div class="gmp-badge-card">
          <span class="ipo-detail-label">Listing Performance</span>
          <span class="${isProfit ? 'gmp-rate-positive' : 'gmp-rate-negative'}">
            ${isProfit ? '▲' : '▼'} ${isProfit ? '+' : ''}${gainPct}% (${formatCurrency(listingPrice)})
          </span>
        </div>
      `;
    } else {
      const issuePrice = ipo.maxPrice;
      const estPrice = issuePrice + ipo.gmp;
      const gmpPct = ((ipo.gmp / issuePrice) * 100).toFixed(1);
      const isPositive = ipo.gmp > 0;
      const isNegative = ipo.gmp < 0;
      
      let gmpClass = 'gmp-rate-neutral';
      let arrow = '';
      if (isPositive) { gmpClass = 'gmp-rate-positive'; arrow = '▲ '; }
      else if (isNegative) { gmpClass = 'gmp-rate-negative'; arrow = '▼ '; }

      listingInfoHtml = `
        <div class="gmp-badge-card">
          <div class="ipo-detail-item">
            <span class="ipo-detail-label">Grey Market GMP</span>
            <span class="${gmpClass}" style="font-size: 0.95rem;">${arrow}${formatCurrency(Math.abs(ipo.gmp))} (${gmpPct}%)</span>
          </div>
          <div class="ipo-detail-item" style="text-align: right;">
            <span class="ipo-detail-label">Est. Listing Price</span>
            <span style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">${formatCurrency(estPrice)}</span>
          </div>
        </div>
      `;
    }

    if (ipo.status !== 'upcoming') {
      const subVal = ipo.subscriptions.total;
      const barWidth = Math.min(100, (subVal / 2) * 100);
      subInfoHtml = `
        <div class="gmp-meter-container">
          <div class="gmp-meter-header">
            <span>Subscription Rate</span>
            <strong style="color:var(--primary);">${subVal}x</strong>
          </div>
          <div class="gmp-meter-bar">
            <div class="gmp-meter-fill" style="width: ${barWidth}%;"></div>
          </div>
        </div>
      `;
    } else {
      subInfoHtml = `
        <div class="gmp-meter-container" style="margin-bottom: 20px;">
          <div class="gmp-meter-header" style="color: var(--text-muted);">
            <span>Subscription Details</span>
            <span>Awaiting Open</span>
          </div>
          <div class="gmp-meter-bar">
            <div class="gmp-meter-fill" style="width: 0%;"></div>
          </div>
        </div>
      `;
    }

    let recClass = 'recommendation-neutral';
    if (ipo.verdict === 'apply') recClass = 'recommendation-apply';
    else if (ipo.verdict === 'avoid') recClass = 'recommendation-avoid';

    const dateLabel = ipo.status === 'listed' ? 'Listed Date:' : 'Closing Date:';
    const dateValue = ipo.status === 'listed' ? formatDateString(ipo.listingDate) : formatDateString(ipo.closeDate);

    return `
      <div class="glass-card ipo-card">
        <div class="ipo-header">
          <div class="ipo-title-group">
            <span class="ipo-type-tag">${ipo.type} IPO</span>
            <h3 style="margin-top: 2px;">${ipo.name}</h3>
          </div>
          ${statusBadgeHtml}
        </div>
        
        <div class="ipo-dates">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${dateLabel} <strong>${dateValue}</strong></span>
        </div>

        <div class="ipo-details-grid">
          <div class="ipo-detail-item">
            <span class="ipo-detail-label">Price Band</span>
            <span class="ipo-detail-value">${formatCurrency(ipo.minPrice)} - ${formatCurrency(ipo.maxPrice)}</span>
          </div>
          <div class="ipo-detail-item">
            <span class="ipo-detail-label">Min Lot Size</span>
            <span class="ipo-detail-value">${ipo.lotSize} shares (${formatCurrency(ipo.lotSize * ipo.maxPrice)})</span>
          </div>
          <div class="ipo-detail-item" style="margin-top: 4px;">
            <span class="ipo-detail-label">Issue Size</span>
            <span class="ipo-detail-value">${ipo.issueSize}</span>
          </div>
          <div class="ipo-detail-item" style="margin-top: 4px;">
            <span class="ipo-detail-label">Registrar Office</span>
            <span class="ipo-detail-value" style="font-size:0.78rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${ipo.registrar}">${ipo.registrar.split(' ')[0]}</span>
          </div>
        </div>

        ${listingInfoHtml}
        ${subInfoHtml}

        <div class="ipo-recommendation ${recClass}">
          <span style="font-size:1.1rem; line-height:1;">✦</span>
          <span>${ipo.ratingText}</span>
        </div>

        <div style="display:flex; gap:12px; margin-top:auto; padding-top:16px; border-top: 1px solid var(--glass-border);">
          ${detailsLinkHtml}
          ${btnHtml}
        </div>
      </div>
    `;
  }).join('');

  // Attach event listeners to dynamic elements
  container.querySelectorAll('.view-ipo-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ipoId = btn.getAttribute('data-ipo-id');
      showIpoDetailsModal(ipoId);
    });
  });

  container.querySelectorAll('.apply-ipo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ipoName = btn.getAttribute('data-ipo');
      showApplyModal(`IPO Subscription: ${ipoName}`);
    });
  });
}

function showIpoDetailsModal(ipoId) {
  const ipo = IPO_DB.find(i => i.id === ipoId);
  if (!ipo) return;

  const modal = document.getElementById('ipo-details-modal');
  if (!modal) return;

  document.getElementById('ipo-details-title').textContent = `${ipo.name} IPO`;
  document.getElementById('ipo-details-subtitle').textContent = `${ipo.type.toUpperCase()} IPO • Price Band: ${formatCurrency(ipo.minPrice)} - ${formatCurrency(ipo.maxPrice)}`;
  
  const statusBadge = document.getElementById('ipo-details-status-badge');
  statusBadge.textContent = ipo.status.toUpperCase();
  statusBadge.className = 'badge';
  if (ipo.status === 'open') {
    statusBadge.classList.add('badge-success');
    statusBadge.textContent = 'OPEN NOW';
  } else if (ipo.status === 'upcoming') {
    statusBadge.classList.add('badge-primary');
  } else if (ipo.status === 'closed') {
    statusBadge.classList.add('badge-warning');
  } else if (ipo.status === 'listed') {
    statusBadge.classList.add('badge-secondary');
  }

  const banner = document.getElementById('ipo-details-banner');
  if (ipo.status === 'open') {
    banner.style.background = 'linear-gradient(135deg, rgba(22, 101, 52, 0.12), rgba(13, 148, 136, 0.12))';
  } else if (ipo.status === 'listed' && ipo.listingPrice >= ipo.maxPrice) {
    banner.style.background = 'linear-gradient(135deg, rgba(22, 101, 52, 0.12), rgba(79, 70, 229, 0.12))';
  } else if (ipo.status === 'listed' && ipo.listingPrice < ipo.maxPrice) {
    banner.style.background = 'linear-gradient(135deg, rgba(153, 27, 27, 0.12), rgba(249, 115, 22, 0.12))';
  } else {
    banner.style.background = 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(13, 148, 136, 0.12))';
  }

  const timelineContainer = document.getElementById('ipo-timeline-container');
  const timelines = [
    { title: 'IPO Opens', date: ipo.openDate, step: 'open' },
    { title: 'IPO Closes', date: ipo.closeDate, step: 'close' },
    { title: 'Allotment Date', date: ipo.allotmentDate, step: 'allotment' },
    { title: 'Refund/Demat credit', date: addDays(ipo.allotmentDate, 1), step: 'refund' },
    { title: 'Listing Date', date: ipo.listingDate, step: 'listing' }
  ];

  const todayStr = '2026-07-08';
  timelineContainer.innerHTML = `
    <div style="position: absolute; left: 6px; top: 8px; bottom: 8px; width: 2px; background: var(--glass-border);"></div>
  ` + timelines.map(t => {
    let stateClass = '';
    let statusText = '';
    
    if (ipo.status === 'listed') {
      stateClass = 'completed';
      statusText = 'Completed';
    } else if (t.step === 'open') {
      stateClass = 'completed';
      statusText = 'Closed';
      if (ipo.status === 'open') {
        stateClass = 'active';
        statusText = 'Active Now';
      }
    } else if (t.step === 'close') {
      if (todayStr > t.date) {
        stateClass = 'completed';
        statusText = 'Closed';
      } else if (ipo.status === 'open') {
        stateClass = 'active';
        statusText = 'Closes soon';
      } else {
        stateClass = 'upcoming';
        statusText = 'Pending';
      }
    } else if (t.step === 'allotment') {
      if (todayStr > t.date) {
        stateClass = 'completed';
        statusText = 'Declared';
      } else if (ipo.status === 'closed') {
        stateClass = 'active';
        statusText = 'Coming Soon';
      } else {
        stateClass = 'upcoming';
        statusText = 'Pending';
      }
    } else if (t.step === 'refund' || t.step === 'listing') {
      if (todayStr >= t.date) {
        stateClass = 'completed';
        statusText = t.step === 'refund' ? 'Disbursed' : 'Listed';
      } else {
        stateClass = 'upcoming';
        statusText = 'Pending';
      }
    }

    let statusStyle = 'color: var(--text-muted); background: var(--bg-secondary);';
    if (stateClass === 'active') {
      statusStyle = 'color: var(--primary); background: var(--primary-glow); border: 1px solid rgba(79, 70, 229, 0.1);';
    } else if (stateClass === 'completed') {
      statusStyle = 'color: var(--success); background: var(--success-glow);';
    }

    return `
      <div class="timeline-item ${stateClass}">
        <div class="timeline-dot"></div>
        <div class="timeline-info">
          <span class="timeline-title">${t.title}</span>
          <span class="timeline-date">${formatDateString(t.date)}</span>
        </div>
        <span class="timeline-status" style="${statusStyle}">${statusText}</span>
      </div>
    `;
  }).join('');

  const subBody = document.getElementById('ipo-subscription-table-body');
  if (ipo.status === 'upcoming') {
    subBody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: center; color: var(--text-muted); padding: 20px;">
          IPO subscription statistics are not available yet. Offering opens on ${formatDateString(ipo.openDate)}.
        </td>
      </tr>
    `;
  } else {
    subBody.innerHTML = `
      <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);">
        <td style="padding: 10px 0; color: var(--text-secondary);">Qualified Institutional (QIB)</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: var(--text-primary);">${ipo.subscriptions.qib}x</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);">
        <td style="padding: 10px 0; color: var(--text-secondary);">Non-Institutional (NII)</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: var(--text-primary);">${ipo.subscriptions.nii}x</td>
      </tr>
      <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);">
        <td style="padding: 10px 0; color: var(--text-secondary);">Retail Individual Investors</td>
        <td style="padding: 10px 0; text-align: right; font-weight: 600; color: var(--text-primary);">${ipo.subscriptions.retail}x</td>
      </tr>
      <tr style="font-weight: 700; background: rgba(79, 70, 229, 0.02);">
        <td style="padding: 12px 6px; color: var(--text-primary);">Total Subscriptions</td>
        <td style="padding: 12px 6px; text-align: right; color: var(--primary);">${ipo.subscriptions.total}x</td>
      </tr>
    `;
  }

  const strengthsList = document.getElementById('ipo-details-strengths');
  const weaknessesList = document.getElementById('ipo-details-weaknesses');

  strengthsList.innerHTML = ipo.strengths.map(s => `<li>${s}</li>`).join('');
  weaknessesList.innerHTML = ipo.weaknesses.map(w => `<li>${w}</li>`).join('');

  document.getElementById('ipo-details-issue-size').textContent = ipo.issueSize;
  document.getElementById('ipo-details-lot-size').textContent = `${ipo.lotSize} shares (${formatCurrency(ipo.lotSize * ipo.maxPrice)})`;
  document.getElementById('ipo-details-registrar').textContent = ipo.registrar;

  const recCard = document.getElementById('ipo-details-recommendation-card');
  let recClass = 'recommendation-neutral';
  let badgeLabel = 'NEUTRAL VERDICT';
  let descriptionText = 'Review metrics and apply based on personal risk allocation thresholds.';
  
  if (ipo.verdict === 'apply') {
    recClass = 'recommendation-apply';
    badgeLabel = 'ANALYST VERDICT: APPLY';
    descriptionText = 'Excellent business fundamentals and attractive valuations. Recommended to subscribe for healthy listing day premium gains.';
  } else if (ipo.verdict === 'avoid') {
    recClass = 'recommendation-avoid';
    badgeLabel = 'ANALYST VERDICT: AVOID';
    descriptionText = 'Valuations are highly stretched or capital reserves carry significant leverage. Concerns over short-term listing performance.';
  }

  recCard.className = `ipo-recommendation ${recClass}`;
  recCard.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:4px;">
      <span style="font-weight: 700; font-size:0.85rem; letter-spacing:0.02em;">${badgeLabel}</span>
      <span style="font-size: 0.8rem; font-weight: 400; line-height: 1.4; color: var(--text-secondary);">${descriptionText}</span>
    </div>
  `;

  // Apply Button binding inside Modal
  const modalApplyBtn = document.querySelector('#ipo-details-modal #ipo-details-apply-btn');
  const modalCloseBtn = document.querySelector('#ipo-details-modal #ipo-details-close-btn');

  // Helper clone function to clear listeners
  const newApplyBtn = modalApplyBtn.cloneNode(true);
  modalApplyBtn.parentNode.replaceChild(newApplyBtn, modalApplyBtn);

  const newCloseBtn = modalCloseBtn.cloneNode(true);
  modalCloseBtn.parentNode.replaceChild(newCloseBtn, modalCloseBtn);
  newCloseBtn.addEventListener('click', () => modal.classList.remove('open'));

  if (ipo.status === 'open') {
    newApplyBtn.style.display = 'block';
    newApplyBtn.textContent = 'Subscribe Now';
    newApplyBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      showApplyModal(`IPO Subscription: ${ipo.name}`);
    });
  } else if (ipo.status === 'listed') {
    newApplyBtn.style.display = 'block';
    newApplyBtn.textContent = 'Trade Now';
    newApplyBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      switchTab('demat-account');
    });
  } else {
    newApplyBtn.style.display = 'none';
  }

  modal.classList.add('open');
}

function showAllotmentResult(ipoId, idType, queryVal) {
  const ipo = IPO_DB.find(i => i.id === ipoId);
  if (!ipo) return;

  const modal = document.getElementById('ipo-allotment-results-modal');
  if (!modal) return;

  const header = document.getElementById('allotment-results-header');
  const icon = document.getElementById('allotment-results-status-icon');
  const statusTitle = document.getElementById('allotment-results-status-title');
  const detailsPan = document.getElementById('allotment-res-pan');
  const detailsStatus = document.getElementById('allotment-res-status');
  const detailsAllotted = document.getElementById('allotment-res-allotted');
  const detailsRefund = document.getElementById('allotment-res-refund');
  const bankRefRow = document.getElementById('allotment-res-bank-ref-row');
  const bankRef = document.getElementById('allotment-res-bank-ref');
  const noteBox = document.getElementById('allotment-res-note-box');

  document.getElementById('allotment-res-ipo-name').textContent = ipo.name;
  
  let queryMasked = queryVal.toUpperCase();
  if (queryMasked.length > 5) {
    queryMasked = queryMasked.substring(0, 3) + '****' + queryMasked.substring(queryMasked.length - 3);
  }
  detailsPan.textContent = `${queryMasked} (${idType.toUpperCase()})`;

  if (ipo.status === 'open' || ipo.status === 'upcoming') {
    header.style.background = 'linear-gradient(135deg, #b45309, #d97706)';
    icon.textContent = '⏳';
    statusTitle.textContent = 'Allotment Pending';
    
    detailsStatus.textContent = 'Awaiting Declaration';
    detailsStatus.style.color = '#b45309';
    document.getElementById('allotment-res-applied').textContent = `${ipo.lotSize} shares (1 Lot)`;
    detailsAllotted.textContent = '0 shares';
    detailsRefund.textContent = '₹0.00';
    bankRefRow.style.display = 'none';

    noteBox.style.borderLeftColor = 'var(--warning)';
    noteBox.style.background = 'rgba(180, 83, 9, 0.04)';
    noteBox.style.color = '#b45309';
    noteBox.innerHTML = `Allotment records for <strong>${ipo.name}</strong> are currently pending. Registrar <strong>${ipo.registrar}</strong> will officially declare results on <strong>${formatDateString(ipo.allotmentDate)}</strong>. Please check back later.`;
    
    modal.classList.add('open');
    return;
  }

  // Simulation: Deterministic based on charcode sum of details entered
  let sum = 0;
  for (let i = 0; i < queryVal.length; i++) {
    sum += queryVal.charCodeAt(i);
  }
  const isAllotted = (sum % 2 === 0);

  if (isAllotted) {
    header.style.background = 'linear-gradient(135deg, #15803d, #10b981)';
    icon.textContent = '🎉';
    statusTitle.textContent = 'IPO Shares Allotted!';
    
    detailsStatus.textContent = 'ALLOTTED (FULL)';
    detailsStatus.style.color = '#15803d';
    document.getElementById('allotment-res-applied').textContent = `${ipo.lotSize} shares (1 Lot)`;
    detailsAllotted.textContent = `${ipo.lotSize} shares (1 Lot)`;
    detailsRefund.textContent = '₹0.00';
    
    bankRefRow.style.display = 'flex';
    const txId = 'TXN' + Math.floor(100000000 + Math.random() * 900000000);
    bankRef.textContent = txId + ' (Demat Cr)';

    noteBox.style.borderLeftColor = 'var(--success)';
    noteBox.style.background = 'rgba(22, 101, 52, 0.04)';
    noteBox.style.color = '#15803d';
    noteBox.innerHTML = `Congratulations! You have been successfully allotted <strong>${ipo.lotSize} shares</strong>. Shares will credit to your Demat Account by listing day. Listing starts on <strong>${formatDateString(ipo.listingDate)}</strong>.`;
  } else {
    header.style.background = 'linear-gradient(135deg, #b91c1c, #f43f5e)';
    icon.textContent = '❌';
    statusTitle.textContent = 'Not Allotted';
    
    detailsStatus.textContent = 'NOT ALLOTTED';
    detailsStatus.style.color = '#b91c1c';
    document.getElementById('allotment-res-applied').textContent = `${ipo.lotSize} shares (1 Lot)`;
    detailsAllotted.textContent = `0 shares`;
    
    const refundAmt = ipo.lotSize * ipo.maxPrice;
    detailsRefund.textContent = formatCurrency(refundAmt);
    
    bankRefRow.style.display = 'flex';
    const utrId = 'UTR' + Math.floor(1000000000 + Math.random() * 9000000000);
    bankRef.textContent = utrId + ' (Refund processed)';

    noteBox.style.borderLeftColor = 'var(--danger)';
    noteBox.style.background = 'rgba(153, 27, 27, 0.04)';
    noteBox.style.color = '#b91c1c';
    noteBox.innerHTML = `We regret to inform you that your application was not selected in the allotment lottery. A full refund of <strong>${formatCurrency(refundAmt)}</strong> has been processed to your bank account under reference: <span style="font-family:monospace; font-weight:600;">${utrId}</span>.`;
  }

  modal.classList.add('open');
}

// Utility Helpers
function formatDateString(dateStr) {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function addDays(dateStr, days) {
  const dateObj = new Date(dateStr);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj.toISOString().split('T')[0];
}




