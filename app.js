// Remote debugging helper: display any JavaScript errors on screen
window.addEventListener('error', (event) => {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.bottom = '10px';
    errorDiv.style.left = '10px';
    errorDiv.style.right = '10px';
    errorDiv.style.background = '#fee2e2';
    errorDiv.style.color = '#991b1b';
    errorDiv.style.border = '2px solid #ef4444';
    errorDiv.style.padding = '14px';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.zIndex = '99999';
    errorDiv.style.fontFamily = 'monospace';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
    errorDiv.innerHTML = `<strong>JS Error:</strong> ${event.message} <br> <em>at ${event.filename}:${event.lineno}:${event.colno}</em>`;
    document.body.appendChild(errorDiv);
});

// Invoice State
let state = {
    invoiceTitle: 'INVOICE',
    invoiceNumber: 'INV-2026-001',
    invoiceDate: '',
    invoiceDueDate: '',
    invoicePo: '',
    
    fromName: 'Your Business Name',
    fromFields: [
        { id: 'email', label: 'Email Address', value: 'billing@yourbusiness.com' },
        { id: 'phone', label: 'Phone Number', value: '+91 98765 43210' },
        { id: 'address', label: 'Address', value: '123 Business Square, Suite 400\nMumbai, Maharashtra, 400001', type: 'textarea' },
        { id: 'tax', label: 'GSTIN', value: '27AAAAA1111A1Z1' }
    ],
    
    toName: 'Acme Corporation',
    toFields: [
        { id: 'email', label: 'Email Address', value: 'finance@acme.com' },
        { id: 'phone', label: 'Phone Number', value: '+91 99999 88888' },
        { id: 'address', label: 'Address', value: '456 Corporate Towers, 12th Floor\nBangalore, Karnataka, 560001', type: 'textarea' },
        { id: 'tax', label: 'GSTIN', value: '29BBBBB2222B2Z2' }
    ],
    
    currency: 'INR',
    currencySymbol: '₹',
    
    taxEnabled: true,
    taxType: 'GST', // GST, IGST, VAT
    defaultTaxRate: 18,
    
    discountType: 'percentage', // none, percentage, flat, per-item
    globalDiscountValue: 10, // 10% or flat currency amount
    
    shippingEnabled: true,
    shippingCost: 250,
    
    bankEnabled: true,
    bankName: 'HDFC Bank',
    bankAccount: '50100234567890',
    bankIfsc: 'HDFC0000123',
    bankBranch: 'Kharghar, Navi Mumbai',
    
    upiEnabled: true,
    upiId: 'yourbusiness@ybl',
    
    notesEnabled: true,
    notes: '1. Payment should be made within 15 days of invoice date.\n2. Goods once sold will not be taken back or exchanged.\n3. Thank you for choosing Billed!',
    
    amountPaid: 15000,
    
    theme: 'theme-blue',
    fontFamily: 'font-jakarta',
    logoBase64: '',
    
    items: [
        { id: 1, name: 'Premium Web Design Services', description: 'Custom responsive design, interactive animations, and dark mode configuration.', quantity: 1, rate: 45000, taxRate: 18, discountRate: 5 },
        { id: 2, name: 'Cloud Server Architecture Deployment', description: 'Setting up AWS ECS, RDS cluster, and CloudFront CDN for global caching.', quantity: 2, rate: 12000, taxRate: 18, discountRate: 0 }
    ]
};

// Initial State (Default empty sheet)
const DEFAULT_STATE = {
    invoiceTitle: 'INVOICE',
    invoiceNumber: 'INV-2026-001',
    invoiceDate: '',
    invoiceDueDate: '',
    invoicePo: '',
    fromName: '',
    fromFields: [
        { id: 'email', label: 'Email Address', value: '' },
        { id: 'phone', label: 'Phone Number', value: '' },
        { id: 'address', label: 'Address', value: '', type: 'textarea' },
        { id: 'tax', label: 'GSTIN', value: '' }
    ],
    toName: '',
    toFields: [
        { id: 'email', label: 'Email Address', value: '' },
        { id: 'phone', label: 'Phone Number', value: '' },
        { id: 'address', label: 'Address', value: '', type: 'textarea' },
        { id: 'tax', label: 'GSTIN', value: '' }
    ],
    currency: 'INR',
    currencySymbol: '₹',
    taxEnabled: true,
    taxType: 'GST',
    defaultTaxRate: 18,
    discountType: 'none',
    globalDiscountValue: 0,
    shippingEnabled: false,
    shippingCost: 0,
    bankEnabled: false,
    bankName: '',
    bankAccount: '',
    bankIfsc: '',
    bankBranch: '',
    upiEnabled: false,
    upiId: '',
    notesEnabled: true,
    notes: 'Thank you for your business!',
    amountPaid: 0,
    theme: 'theme-blue',
    fontFamily: 'font-jakarta',
    logoBase64: '',
    items: [
        { id: Date.now(), name: '', description: '', quantity: 1, rate: 0, taxRate: 18, discountRate: 0 }
    ]
};

// DOM Cache
const dom = {
    // App Shell
    body: document.body,
    
    // Sidebar Controls
    themeBtns: document.querySelectorAll('.theme-btn'),
    fontFamilySelect: document.getElementById('font-family-select'),
    currencySelect: document.getElementById('currency-select'),
    toggleTax: document.getElementById('toggle-tax'),
    taxDetailsSection: document.getElementById('tax-details-section'),
    taxTypeSelect: document.getElementById('tax-type-select'),
    defaultTaxRateInput: document.getElementById('default-tax-rate'),
    discountTypeSelect: document.getElementById('discount-type-select'),
    discountValueSection: document.getElementById('discount-value-section'),
    discountValLabel: document.getElementById('discount-val-label'),
    globalDiscountValueInput: document.getElementById('global-discount-value'),
    toggleShipping: document.getElementById('toggle-shipping'),
    toggleBank: document.getElementById('toggle-bank'),
    toggleUpi: document.getElementById('toggle-upi'),
    toggleNotes: document.getElementById('toggle-notes'),
    btnPrint: document.getElementById('btn-print'),
    btnLoadSample: document.getElementById('btn-load-sample'),
    btnReset: document.getElementById('btn-reset'),
    
    // Logo Upload
    logoInput: document.getElementById('logo-input'),
    logoDropzone: document.getElementById('logo-dropzone'),
    logoPlaceholder: document.getElementById('logo-placeholder'),
    logoImg: document.getElementById('logo-img'),
    btnRemoveLogo: document.getElementById('btn-remove-logo'),
    
    // Invoice Meta
    invoiceTitle: document.getElementById('invoice-title'),
    invNumber: document.getElementById('inv-number'),
    invDate: document.getElementById('inv-date'),
    invDueDate: document.getElementById('inv-due-date'),
    invPo: document.getElementById('inv-po'),
    
    // Addresses
    fromName: document.getElementById('from-name'),
    fromFieldsList: document.getElementById('from-fields-list'),
    btnAddFromField: document.getElementById('btn-add-from-field'),
    
    toName: document.getElementById('to-name'),
    toFieldsList: document.getElementById('to-fields-list'),
    btnAddToField: document.getElementById('btn-add-to-field'),
    
    // Items Table
    itemsTbody: document.getElementById('items-tbody'),
    btnAddItem: document.getElementById('btn-add-item'),
    thTax: document.getElementById('th-tax'),
    thDiscount: document.getElementById('th-discount'),
    
    // Bottom Panels
    blockBank: document.getElementById('block-bank'),
    bankName: document.getElementById('bank-name'),
    bankAccount: document.getElementById('bank-account'),
    bankIfsc: document.getElementById('bank-ifsc'),
    bankBranch: document.getElementById('bank-branch'),
    
    blockUpi: document.getElementById('block-upi'),
    upiId: document.getElementById('upi-id'),
    
    blockNotes: document.getElementById('block-notes'),
    invoiceNotes: document.getElementById('invoice-notes'),
    
    // Totals Math Display
    valSubtotal: document.getElementById('val-subtotal'),
    rowDiscount: document.getElementById('row-discount'),
    lblDiscount: document.getElementById('lbl-discount'),
    valDiscount: document.getElementById('val-discount'),
    rowSingleTax: document.getElementById('row-single-tax'),
    lblSingleTax: document.getElementById('lbl-single-tax'),
    valSingleTax: document.getElementById('val-single-tax'),
    rowCgst: document.getElementById('row-cgst'),
    lblCgst: document.getElementById('lbl-cgst'),
    valCgst: document.getElementById('val-cgst'),
    rowSgst: document.getElementById('row-sgst'),
    lblSgst: document.getElementById('lbl-sgst'),
    valSgst: document.getElementById('val-sgst'),
    rowIgst: document.getElementById('row-igst'),
    lblIgst: document.getElementById('lbl-igst'),
    valIgst: document.getElementById('val-igst'),
    rowShipping: document.getElementById('row-shipping'),
    shippingCost: document.getElementById('shipping-cost'),
    valTotal: document.getElementById('val-total'),
    amountPaid: document.getElementById('amount-paid'),
    valBalanceDue: document.getElementById('val-balance-due'),
};

// Initialize dates if empty
function initializeDates() {
    if (!state.invoiceDate) {
        const today = new Date();
        state.invoiceDate = today.toISOString().split('T')[0];
        
        const nextMonth = new Date(today);
        nextMonth.setDate(today.getDate() + 30);
        state.invoiceDueDate = nextMonth.toISOString().split('T')[0];
    }
}

// Generate random PO number
function generateRandomPONumber() {
    return 'PO-' + Math.floor(10000 + Math.random() * 90000);
}

// Initialize PO number if empty
function initializePO() {
    if (!state.invoicePo) {
        state.invoicePo = generateRandomPONumber();
    }
}

// Format currency display
function formatCurrency(amount) {
    return `${state.currencySymbol}${Number(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

// Load settings into DOM from state
function loadStateToDOM() {
    // Styling
    dom.body.className = state.theme;
    dom.themeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === state.theme);
    });
    
    dom.fontFamilySelect.value = state.fontFamily;
    const paper = document.getElementById('invoice-sheet');
    paper.className = `invoice-paper ${state.fontFamily}`;
    
    // Settings dropdowns
    dom.currencySelect.value = state.currency;
    dom.toggleTax.checked = state.taxEnabled;
    dom.taxDetailsSection.classList.toggle('hidden', !state.taxEnabled);
    dom.taxTypeSelect.value = state.taxType;
    dom.defaultTaxRateInput.value = state.defaultTaxRate;
    dom.discountTypeSelect.value = state.discountType;
    dom.globalDiscountValueInput.value = state.globalDiscountValue;
    
    // Handle global discount visibility
    dom.discountValueSection.classList.toggle('hidden', state.discountType === 'none' || state.discountType === 'per-item');
    if (state.discountType === 'percentage') {
        dom.discountValLabel.textContent = 'Global Discount (%)';
        dom.globalDiscountValueInput.max = 100;
        dom.globalDiscountValueInput.step = 'any';
    } else if (state.discountType === 'flat') {
        dom.discountValLabel.textContent = `Global Discount (${state.currencySymbol})`;
        dom.globalDiscountValueInput.removeAttribute('max');
        dom.globalDiscountValueInput.step = 'any';
    }
    
    dom.toggleShipping.checked = state.shippingEnabled;
    dom.toggleBank.checked = state.bankEnabled;
    dom.toggleUpi.checked = state.upiEnabled;
    dom.toggleNotes.checked = state.notesEnabled;
    
    // Logo render
    if (state.logoBase64) {
        dom.logoImg.src = state.logoBase64;
        dom.logoImg.classList.remove('hidden');
        dom.logoPlaceholder.classList.add('hidden');
        dom.btnRemoveLogo.style.display = 'block';
    } else {
        dom.logoImg.src = '';
        dom.logoImg.classList.add('hidden');
        dom.logoPlaceholder.classList.remove('hidden');
        dom.btnRemoveLogo.style.display = 'none';
    }
    
    // Text values
    dom.invoiceTitle.value = state.invoiceTitle;
    dom.invNumber.value = state.invoiceNumber;
    dom.invDate.value = state.invoiceDate;
    dom.invDueDate.value = state.invoiceDueDate;
    dom.invPo.value = state.invoicePo;
    
    dom.fromName.value = state.fromName;
    renderAddressFields('from');
    
    dom.toName.value = state.toName;
    renderAddressFields('to');
    
    dom.bankName.value = state.bankName;
    dom.bankAccount.value = state.bankAccount;
    dom.bankIfsc.value = state.bankIfsc;
    dom.bankBranch.value = state.bankBranch;
    
    dom.upiId.value = state.upiId;
    dom.invoiceNotes.value = state.notes;
    dom.shippingCost.value = state.shippingCost;
    dom.amountPaid.value = state.amountPaid;
    
    // Block Toggles
    dom.blockBank.classList.toggle('hidden', !state.bankEnabled);
    dom.blockUpi.classList.toggle('hidden', !state.upiEnabled);
    dom.blockNotes.classList.toggle('hidden', !state.notesEnabled);
    dom.rowShipping.classList.toggle('hidden', !state.shippingEnabled);
}

// Render dynamic custom fields for Bill From / Bill To
function renderAddressFields(section) {
    const listEl = dom[`${section}FieldsList`] || document.getElementById(`${section}-fields-list`);
    if (!listEl) return;
    
    listEl.innerHTML = '';
    const fields = state[`${section}Fields`] || [];
    
    fields.forEach(field => {
        const row = document.createElement('div');
        row.className = 'address-field-row';
        row.dataset.id = field.id;
        
        let valHtml = '';
        if (field.type === 'textarea') {
            valHtml = `<textarea class="address-field-val-textarea" placeholder="Street, City, State..." data-type="value">${field.value}</textarea>`;
        } else {
            valHtml = `<input type="text" class="address-field-val-input" value="${field.value}" placeholder="Enter details..." data-type="value">`;
        }
        
        row.innerHTML = `
            <input type="text" class="address-field-label-input" value="${field.label}" placeholder="Label..." data-type="label">:
            ${valHtml}
            <button type="button" class="btn-delete-field no-print" title="Delete Field">&times;</button>
        `;
        
        listEl.appendChild(row);
    });
}

// Render dynamic invoice items table & calculate invoice totals
function renderItemsAndTotals() {
    dom.itemsTbody.innerHTML = '';
    
    // Toggle table columns visibility
    dom.thTax.style.display = state.taxEnabled ? '' : 'none';
    dom.thDiscount.style.display = state.discountType === 'per-item' ? '' : 'none';
    
    let subtotalSum = 0;
    let totalDiscountSum = 0;
    let totalTaxSum = 0;
    
    state.items.forEach((item, index) => {
        const lineSubtotal = item.quantity * item.rate;
        subtotalSum += lineSubtotal;
        
        // Item level discount
        let itemDiscount = 0;
        if (state.discountType === 'per-item') {
            itemDiscount = lineSubtotal * (item.discountRate / 100);
            totalDiscountSum += itemDiscount;
        }
        
        // Item level tax calculation
        let itemTax = 0;
        if (state.taxEnabled) {
            const taxableAmount = lineSubtotal - itemDiscount;
            itemTax = taxableAmount * (item.taxRate / 100);
            totalTaxSum += itemTax;
        }
        
        const lineAmount = lineSubtotal - itemDiscount;
        
        const tr = document.createElement('tr');
        tr.className = 'item-row';
        tr.dataset.id = item.id;
        
        tr.innerHTML = `
            <td class="col-desc">
                <div class="item-desc-cell">
                    <input type="text" class="item-title-input" value="${item.name}" placeholder="Item name / Service description" data-field="name">
                    <textarea class="item-desc-input" placeholder="Additional details..." data-field="description">${item.description}</textarea>
                </div>
            </td>
            <td class="col-qty">
                <input type="number" class="cell-number-input" value="${item.quantity}" min="0" step="any" placeholder="1" data-field="quantity">
            </td>
            <td class="col-rate">
                <input type="number" class="cell-number-input" value="${item.rate}" min="0" step="any" placeholder="0.00" data-field="rate">
            </td>
            <td class="col-tax text-right" style="display: ${state.taxEnabled ? '' : 'none'}">
                <input type="number" class="cell-number-input" value="${item.taxRate}" min="0" max="100" step="any" placeholder="0" data-field="taxRate">%
            </td>
            <td class="col-discount text-right" style="display: ${state.discountType === 'per-item' ? '' : 'none'}">
                <input type="number" class="cell-number-input" value="${item.discountRate}" min="0" max="100" step="any" placeholder="0" data-field="discountRate">%
            </td>
            <td class="col-amount text-right">
                <span class="item-amount-val">${formatCurrency(lineAmount)}</span>
            </td>
            <td class="col-action no-print text-right">
                <button type="button" class="btn-delete-row" title="Delete Row">&times;</button>
            </td>
        `;
        
        dom.itemsTbody.appendChild(tr);
    });
    
    // Global Discount Calculation
    let globalDiscount = 0;
    if (state.discountType === 'percentage') {
        globalDiscount = subtotalSum * (state.globalDiscountValue / 100);
    } else if (state.discountType === 'flat') {
        globalDiscount = Number(state.globalDiscountValue) || 0;
    }
    const finalDiscount = state.discountType === 'per-item' ? totalDiscountSum : globalDiscount;
    
    // Global Tax Calculation (If not calculated per-item, but if tax enabled and discount isn't per-item, we calculate tax based on net total)
    let finalTaxSum = totalTaxSum;
    if (state.taxEnabled && state.discountType !== 'per-item') {
        // Recalculate tax based on subtotal minus global discount
        const netTaxableAmount = subtotalSum - finalDiscount;
        finalTaxSum = 0;
        state.items.forEach(item => {
            // Allocate global discount proportionally or compute item tax directly on its ratio
            const itemShareRatio = subtotalSum > 0 ? (item.quantity * item.rate) / subtotalSum : 0;
            const itemTaxableAmount = (item.quantity * item.rate) - (finalDiscount * itemShareRatio);
            finalTaxSum += Math.max(0, itemTaxableAmount * (item.taxRate / 100));
        });
    }
    
    // Total calculation
    const shipping = state.shippingEnabled ? (Number(state.shippingCost) || 0) : 0;
    const grandTotal = Math.max(0, subtotalSum - finalDiscount + finalTaxSum + shipping);
    
    // Math Display Outputs
    dom.valSubtotal.textContent = formatCurrency(subtotalSum);
    
    // Handle Discounts Row
    if (state.discountType !== 'none') {
        dom.rowDiscount.classList.remove('hidden');
        if (state.discountType === 'percentage') {
            dom.lblDiscount.textContent = `Discount (${state.globalDiscountValue}%)`;
        } else if (state.discountType === 'flat') {
            dom.lblDiscount.textContent = 'Discount';
        } else {
            dom.lblDiscount.textContent = 'Item Discount';
        }
        dom.valDiscount.textContent = `-${formatCurrency(finalDiscount)}`;
    } else {
        dom.rowDiscount.classList.add('hidden');
    }
    
    // Handle Taxes Rows
    dom.rowSingleTax.classList.add('hidden');
    dom.rowCgst.classList.add('hidden');
    dom.rowSgst.classList.add('hidden');
    dom.rowIgst.classList.add('hidden');
    
    if (state.taxEnabled) {
        if (state.taxType === 'GST') {
            // CGST + SGST (50% each)
            const halfTax = finalTaxSum / 2;
            const avgTaxRate = state.items.reduce((acc, it) => acc + Number(it.taxRate), 0) / (state.items.length || 1);
            const displayRate = (avgTaxRate / 2).toFixed(1).replace(/\.0$/, '');
            
            dom.rowCgst.classList.remove('hidden');
            dom.rowSgst.classList.remove('hidden');
            dom.lblCgst.textContent = `CGST (${displayRate}%)`;
            dom.lblSgst.textContent = `SGST (${displayRate}%)`;
            dom.valCgst.textContent = formatCurrency(halfTax);
            dom.valSgst.textContent = formatCurrency(halfTax);
        } else if (state.taxType === 'IGST') {
            const avgTaxRate = state.items.reduce((acc, it) => acc + Number(it.taxRate), 0) / (state.items.length || 1);
            dom.rowIgst.classList.remove('hidden');
            dom.lblIgst.textContent = `IGST (${avgTaxRate.toFixed(1).replace(/\.0$/, '')}%)`;
            dom.valIgst.textContent = formatCurrency(finalTaxSum);
        } else {
            // VAT / Generic Tax
            dom.rowSingleTax.classList.remove('hidden');
            const avgTaxRate = state.items.reduce((acc, it) => acc + Number(it.taxRate), 0) / (state.items.length || 1);
            dom.lblSingleTax.textContent = `Tax / VAT (${avgTaxRate.toFixed(1).replace(/\.0$/, '')}%)`;
            dom.valSingleTax.textContent = formatCurrency(finalTaxSum);
        }
    }
    
    dom.valTotal.textContent = formatCurrency(grandTotal);
    
    // Calculate Balance Due
    const balanceDue = grandTotal - (state.amountPaid || 0);
    dom.valBalanceDue.textContent = formatCurrency(balanceDue);
}

// Sync Form State from Input Field Values
function saveFormInputsToState() {
    state.invoiceTitle = dom.invoiceTitle.value;
    state.invoiceNumber = dom.invNumber.value;
    state.invoiceDate = dom.invDate.value;
    state.invoiceDueDate = dom.invDueDate.value;
    state.invoicePo = dom.invPo.value;
    
    state.fromName = dom.fromName.value;
    state.toName = dom.toName.value;
    
    state.bankName = dom.bankName.value;
    state.bankAccount = dom.bankAccount.value;
    state.bankIfsc = dom.bankIfsc.value;
    state.bankBranch = dom.bankBranch.value;
    
    state.upiId = dom.upiId.value;
    state.notes = dom.invoiceNotes.value;
    state.shippingCost = Number(dom.shippingCost.value) || 0;
    state.amountPaid = Number(dom.amountPaid.value) || 0;
    
    autoSaveToLocalStorage();
}

// Auto Save State in LocalStorage
function autoSaveToLocalStorage() {
    localStorage.setItem('invoify_state', JSON.stringify(state));
}

// Load Cached State from LocalStorage
function loadSavedState() {
    const saved = localStorage.getItem('invoify_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            
            // Migration and safety checks: ensure fields arrays exist and are valid arrays
            if (!parsed.fromFields || !Array.isArray(parsed.fromFields)) {
                parsed.fromFields = [
                    { id: 'email', label: 'Email Address', value: parsed.fromEmail || '' },
                    { id: 'phone', label: 'Phone Number', value: parsed.fromPhone || '' },
                    { id: 'address', label: 'Address', value: parsed.fromAddress || '', type: 'textarea' }
                ];
                if (parsed.fromTaxVal) {
                    parsed.fromFields.push({ id: 'tax', label: parsed.fromTaxLabel || 'GSTIN', value: parsed.fromTaxVal });
                }
            }
            if (!parsed.toFields || !Array.isArray(parsed.toFields)) {
                parsed.toFields = [
                    { id: 'email', label: 'Email Address', value: parsed.toEmail || '' },
                    { id: 'phone', label: 'Phone Number', value: parsed.toPhone || '' },
                    { id: 'address', label: 'Address', value: parsed.toAddress || '', type: 'textarea' }
                ];
                if (parsed.toTaxVal) {
                    parsed.toFields.push({ id: 'tax', label: parsed.toTaxLabel || 'GSTIN', value: parsed.toTaxVal });
                }
            }
            
            state = { ...state, ...parsed };
        } catch (e) {
            console.error("Failed to parse cached invoice state", e);
        }
    }
}

// Event Bindings
function bindEvents() {
    
    // Sidebar theme picks
    dom.themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const themeClass = btn.dataset.theme;
            state.theme = themeClass;
            dom.body.className = themeClass;
            dom.themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            autoSaveToLocalStorage();
        });
    });
    
    // Font picker
    dom.fontFamilySelect.addEventListener('change', (e) => {
        state.fontFamily = e.target.value;
        const paper = document.getElementById('invoice-sheet');
        paper.className = `invoice-paper ${state.fontFamily}`;
        autoSaveToLocalStorage();
    });

    // Currency selector
    dom.currencySelect.addEventListener('change', (e) => {
        const option = e.target.options[e.target.selectedIndex];
        state.currency = e.target.value;
        state.currencySymbol = option.dataset.symbol;
        
        // Update label text for discount input if flat is active
        if (state.discountType === 'flat') {
            dom.discountValLabel.textContent = `Global Discount (${state.currencySymbol})`;
        }
        
        renderItemsAndTotals();
        autoSaveToLocalStorage();
    });

    // Toggles
    dom.toggleTax.addEventListener('change', (e) => {
        state.taxEnabled = e.target.checked;
        dom.taxDetailsSection.classList.toggle('hidden', !state.taxEnabled);
        
        // When enabled, assign taxRate to items if they have none
        if (state.taxEnabled) {
            state.items.forEach(it => {
                if (!it.taxRate) it.taxRate = state.defaultTaxRate;
            });
        }
        
        renderItemsAndTotals();
        autoSaveToLocalStorage();
    });

    dom.taxTypeSelect.addEventListener('change', (e) => {
        state.taxType = e.target.value;
        renderItemsAndTotals();
        autoSaveToLocalStorage();
    });

    dom.defaultTaxRateInput.addEventListener('input', (e) => {
        const rate = Number(e.target.value) || 0;
        state.defaultTaxRate = rate;
        
        // Mass update all items' tax values if the user changes the global tax setting
        state.items.forEach(item => {
            item.taxRate = rate;
        });
        
        renderItemsAndTotals();
        autoSaveToLocalStorage();
    });

    dom.discountTypeSelect.addEventListener('change', (e) => {
        state.discountType = e.target.value;
        dom.discountValueSection.classList.toggle('hidden', state.discountType === 'none' || state.discountType === 'per-item');
        
        if (state.discountType === 'percentage') {
            dom.discountValLabel.textContent = 'Global Discount (%)';
            dom.globalDiscountValueInput.max = 100;
            if (state.globalDiscountValue > 100) state.globalDiscountValue = 10;
            dom.globalDiscountValueInput.value = state.globalDiscountValue;
        } else if (state.discountType === 'flat') {
            dom.discountValLabel.textContent = `Global Discount (${state.currencySymbol})`;
            dom.globalDiscountValueInput.removeAttribute('max');
        }
        
        // Reset per item discounts if switching away from per-item
        if (state.discountType === 'per-item') {
            state.items.forEach(it => {
                if (!it.discountRate) it.discountRate = 0;
            });
        }
        
        renderItemsAndTotals();
        autoSaveToLocalStorage();
    });

    dom.globalDiscountValueInput.addEventListener('input', (e) => {
        state.globalDiscountValue = Number(e.target.value) || 0;
        renderItemsAndTotals();
        autoSaveToLocalStorage();
    });

    dom.toggleShipping.addEventListener('change', (e) => {
        state.shippingEnabled = e.target.checked;
        dom.rowShipping.classList.toggle('hidden', !state.shippingEnabled);
        renderItemsAndTotals();
        autoSaveToLocalStorage();
    });

    dom.toggleBank.addEventListener('change', (e) => {
        state.bankEnabled = e.target.checked;
        dom.blockBank.classList.toggle('hidden', !state.bankEnabled);
        autoSaveToLocalStorage();
    });

    dom.toggleUpi.addEventListener('change', (e) => {
        state.upiEnabled = e.target.checked;
        dom.blockUpi.classList.toggle('hidden', !state.upiEnabled);
        autoSaveToLocalStorage();
    });

    dom.toggleNotes.addEventListener('change', (e) => {
        state.notesEnabled = e.target.checked;
        dom.blockNotes.classList.toggle('hidden', !state.notesEnabled);
        autoSaveToLocalStorage();
    });

    // Logo upload drag-and-drop
    const dropzone = dom.logoDropzone;
    
    dropzone.addEventListener('click', () => dom.logoInput.click());
    
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--primary)';
        dropzone.style.backgroundColor = 'var(--primary-light)';
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--border)';
        dropzone.style.backgroundColor = '#fdfdfd';
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--border)';
        dropzone.style.backgroundColor = '#fdfdfd';
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleLogoFile(e.dataTransfer.files[0]);
        }
    });

    dom.logoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleLogoFile(e.target.files[0]);
        }
    });

    dom.btnRemoveLogo.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering file upload click
        state.logoBase64 = '';
        dom.logoImg.src = '';
        dom.logoImg.classList.add('hidden');
        dom.logoPlaceholder.classList.remove('hidden');
        dom.btnRemoveLogo.style.display = 'none';
        autoSaveToLocalStorage();
    });

    // Add row item
    dom.btnAddItem.addEventListener('click', () => {
        state.items.push({
            id: Date.now(),
            name: '',
            description: '',
            quantity: 1,
            rate: 0,
            taxRate: state.defaultTaxRate,
            discountRate: 0
        });
        renderItemsAndTotals();
        autoSaveToLocalStorage();
    });

    // Delete row (Event delegation)
    dom.itemsTbody.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-row')) {
            const row = e.target.closest('tr');
            const itemId = Number(row.dataset.id);
            
            // Do not delete the last row completely
            if (state.items.length <= 1) {
                alert("An invoice must contain at least one item line.");
                return;
            }
            
            state.items = state.items.filter(it => it.id !== itemId);
            renderItemsAndTotals();
            autoSaveToLocalStorage();
        }
    });

    // Inline inputs changes (Event delegation for performance & binding durability)
    dom.itemsTbody.addEventListener('input', (e) => {
        const target = e.target;
        const row = target.closest('tr');
        if (!row) return;
        
        const itemId = Number(row.dataset.id);
        const field = target.dataset.field;
        if (!field) return;
        
        const item = state.items.find(it => it.id === itemId);
        if (!item) return;
        
        if (field === 'quantity' || field === 'rate' || field === 'taxRate' || field === 'discountRate') {
            item[field] = Number(target.value) || 0;
        } else {
            item[field] = target.value;
        }
        
        // Dynamically update this specific row's amount in display without full re-render
        // to prevent inputs cursor jump/blur on active typing!
        const lineSubtotal = item.quantity * item.rate;
        let itemDiscount = 0;
        if (state.discountType === 'per-item') {
            itemDiscount = lineSubtotal * (item.discountRate / 100);
        }
        const lineAmount = lineSubtotal - itemDiscount;
        row.querySelector('.item-amount-val').textContent = formatCurrency(lineAmount);
        
        // Do debounced or immediate math updates on totals panel
        renderTotalsOnly();
        autoSaveToLocalStorage();
    });

    // Setup input listeners on invoice sheet headers & addresses
    const textFields = [
        dom.invoiceTitle, dom.invNumber, dom.invDate, dom.invDueDate, dom.invPo,
        dom.fromName, dom.toName,
        dom.bankName, dom.bankAccount, dom.bankIfsc, dom.bankBranch,
        dom.upiId, dom.invoiceNotes
    ];
    
    textFields.forEach(field => {
        field.addEventListener('input', saveFormInputsToState);
    });

    // Dynamic Address Fields Events
    ['from', 'to'].forEach(section => {
        const listEl = dom[`${section}FieldsList`] || document.getElementById(`${section}-fields-list`);
        if (!listEl) return;
        
        // Input text / textarea changes
        listEl.addEventListener('input', (e) => {
            const target = e.target;
            const row = target.closest('.address-field-row');
            if (!row) return;
            
            const fieldId = row.dataset.id;
            const dataType = target.dataset.type;
            
            const fields = state[`${section}Fields`] || [];
            const field = fields.find(f => String(f.id) === String(fieldId));
            if (field) {
                if (dataType === 'label') {
                    field.label = target.value;
                } else if (dataType === 'value') {
                    field.value = target.value;
                }
                autoSaveToLocalStorage();
            }
        });
        
        // Delete field
        listEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete-field')) {
                const row = e.target.closest('.address-field-row');
                if (!row) return;
                
                const fieldId = row.dataset.id;
                state[`${section}Fields`] = state[`${section}Fields`].filter(f => String(f.id) !== String(fieldId));
                renderAddressFields(section);
                autoSaveToLocalStorage();
            }
        });
    });

    // Add field buttons
    dom.btnAddFromField.addEventListener('click', () => {
        if (!state.fromFields) state.fromFields = [];
        state.fromFields.push({ id: Date.now(), label: 'Custom Field', value: '' });
        renderAddressFields('from');
        autoSaveToLocalStorage();
    });

    dom.btnAddToField.addEventListener('click', () => {
        if (!state.toFields) state.toFields = [];
        state.toFields.push({ id: Date.now(), label: 'Custom Field', value: '' });
        renderAddressFields('to');
        autoSaveToLocalStorage();
    });

    dom.shippingCost.addEventListener('input', (e) => {
        state.shippingCost = Number(e.target.value) || 0;
        renderItemsAndTotals();
        autoSaveToLocalStorage();
    });

    dom.amountPaid.addEventListener('input', (e) => {
        state.amountPaid = Number(e.target.value) || 0;
        renderTotalsOnly();
        autoSaveToLocalStorage();
    });

    // Action button events
    dom.btnPrint.addEventListener('click', () => {
        window.print();
    });

    dom.btnLoadSample.addEventListener('click', () => {
        loadSampleData();
    });

    dom.btnReset.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear this entire invoice? This action cannot be undone.")) {
            resetForm();
        }
    });
    // Toggle sidebar
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    
    function toggleSidebar() {
        const isMobile = window.innerWidth <= 1024;
        
        if (isMobile) {
            const isExpanded = sidebar.classList.toggle('expanded');
            if (backdrop) {
                backdrop.classList.toggle('active', isExpanded);
            }
            
            // Toggle active state for settings icon in mobile capsule
            const btnCapsuleSettings = document.getElementById('btn-capsule-settings');
            if (btnCapsuleSettings) {
                btnCapsuleSettings.classList.toggle('active-settings', isExpanded);
            }
        } else {
            // Toggle desktop sidebar visibility with a smooth slide
            const container = document.querySelector('.app-container');
            const isHidden = container.classList.toggle('sidebar-hidden');
            
            // Toggle active state for settings icon in desktop capsule
            const btnCapsuleSettings = document.getElementById('btn-capsule-settings');
            if (btnCapsuleSettings) {
                btnCapsuleSettings.classList.toggle('active-settings', isHidden);
            }
        }
    }
    
    function closeSidebar() {
        sidebar.classList.remove('expanded');
        if (backdrop) {
            backdrop.classList.remove('active');
        }
        const btnCapsuleSettings = document.getElementById('btn-capsule-settings');
        if (btnCapsuleSettings) {
            btnCapsuleSettings.classList.remove('active-settings');
        }
    }

    const btnCloseSidebarX = document.getElementById('btn-close-sidebar-x');
    if (btnCloseSidebarX) {
        btnCloseSidebarX.addEventListener('click', closeSidebar);
    }
    
    if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
    }

    // Action Capsule Event Listeners
    const btnCapsuleSettings = document.getElementById('btn-capsule-settings');
    if (btnCapsuleSettings) {
        btnCapsuleSettings.addEventListener('click', toggleSidebar);
    }

    const btnCapsuleLoad = document.getElementById('btn-capsule-load');
    if (btnCapsuleLoad) {
        btnCapsuleLoad.addEventListener('click', () => {
            loadSampleData();
        });
    }

    const btnCapsuleReset = document.getElementById('btn-capsule-reset');
    if (btnCapsuleReset) {
        btnCapsuleReset.addEventListener('click', () => {
            if (confirm("Are you sure you want to clear this entire invoice? This action cannot be undone.")) {
                resetForm();
            }
        });
    }

    const btnCapsulePrint = document.getElementById('btn-capsule-print');
    if (btnCapsulePrint) {
        btnCapsulePrint.addEventListener('click', () => {
            window.print();
        });
    }
}

// Convert uploaded logo file to dataURL base64 string
function handleLogoFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, SVG, WebP)');
        return;
    }
    
    // Check file size (limit to 1MB to avoid local storage overflow)
    if (file.size > 1024 * 1024) {
        alert('Please choose a logo under 1MB to ensure smooth local saving.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        state.logoBase64 = e.target.result;
        dom.logoImg.src = state.logoBase64;
        dom.logoImg.classList.remove('hidden');
        dom.logoPlaceholder.classList.add('hidden');
        dom.btnRemoveLogo.style.display = 'block';
        autoSaveToLocalStorage();
    };
    reader.readAsDataURL(file);
}

// Render totals pane only (avoids redraw of rows when typing inside cell inputs)
function renderTotalsOnly() {
    let subtotalSum = 0;
    let totalDiscountSum = 0;
    let totalTaxSum = 0;
    
    state.items.forEach(item => {
        const lineSubtotal = item.quantity * item.rate;
        subtotalSum += lineSubtotal;
        
        let itemDiscount = 0;
        if (state.discountType === 'per-item') {
            itemDiscount = lineSubtotal * (item.discountRate / 100);
            totalDiscountSum += itemDiscount;
        }
        
        if (state.taxEnabled) {
            const taxableAmount = lineSubtotal - itemDiscount;
            totalTaxSum += taxableAmount * (item.taxRate / 100);
        }
    });
    
    let globalDiscount = 0;
    if (state.discountType === 'percentage') {
        globalDiscount = subtotalSum * (state.globalDiscountValue / 100);
    } else if (state.discountType === 'flat') {
        globalDiscount = Number(state.globalDiscountValue) || 0;
    }
    const finalDiscount = state.discountType === 'per-item' ? totalDiscountSum : globalDiscount;
    
    let finalTaxSum = totalTaxSum;
    if (state.taxEnabled && state.discountType !== 'per-item') {
        finalTaxSum = 0;
        state.items.forEach(item => {
            const itemShareRatio = subtotalSum > 0 ? (item.quantity * item.rate) / subtotalSum : 0;
            const itemTaxableAmount = (item.quantity * item.rate) - (finalDiscount * itemShareRatio);
            finalTaxSum += Math.max(0, itemTaxableAmount * (item.taxRate / 100));
        });
    }
    
    const shipping = state.shippingEnabled ? (Number(state.shippingCost) || 0) : 0;
    const grandTotal = Math.max(0, subtotalSum - finalDiscount + finalTaxSum + shipping);
    
    dom.valSubtotal.textContent = formatCurrency(subtotalSum);
    
    if (state.discountType !== 'none') {
        dom.valDiscount.textContent = `-${formatCurrency(finalDiscount)}`;
    }
    
    if (state.taxEnabled) {
        if (state.taxType === 'GST') {
            const halfTax = finalTaxSum / 2;
            dom.valCgst.textContent = formatCurrency(halfTax);
            dom.valSgst.textContent = formatCurrency(halfTax);
        } else if (state.taxType === 'IGST') {
            dom.valIgst.textContent = formatCurrency(finalTaxSum);
        } else {
            dom.valSingleTax.textContent = formatCurrency(finalTaxSum);
        }
    }
    
    dom.valTotal.textContent = formatCurrency(grandTotal);
    
    const balanceDue = grandTotal - (state.amountPaid || 0);
    dom.valBalanceDue.textContent = formatCurrency(balanceDue);
}

// Reset form to default empty state
function resetForm() {
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    state.items[0].id = Date.now(); // assign unique id
    state.invoicePo = generateRandomPONumber(); // generate auto PO number
    initializeDates();
    loadStateToDOM();
    renderItemsAndTotals();
    autoSaveToLocalStorage();
}

// Populate invoice with high fidelity demonstration data
function loadSampleData() {
    state = {
        invoiceTitle: 'INVOICE',
        invoiceNumber: 'INV-2026-8809',
        invoiceDate: new Date().toISOString().split('T')[0],
        invoiceDueDate: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 15);
            return d.toISOString().split('T')[0];
        })(),
        invoicePo: 'PO-98402',
        
        fromName: 'Pixelflow Studio Pvt. Ltd.',
        fromFields: [
            { id: 'email', label: 'Email Address', value: 'contact@pixelflow.design' },
            { id: 'phone', label: 'Phone Number', value: '+91 80 4092 1122' },
            { id: 'address', label: 'Address', value: 'Block C, Sector 5, HSR Layout\nBangalore, Karnataka, 560102', type: 'textarea' },
            { id: 'tax', label: 'GSTIN', value: '29AAAAA0000A1Z5' }
        ],
        
        toName: 'Apex Innovations LLC',
        toFields: [
            { id: 'email', label: 'Email Address', value: 'accounts@apexinnov.com' },
            { id: 'phone', label: 'Phone Number', value: '+1 (555) 902-8840' },
            { id: 'address', label: 'Address', value: '990 Mission Street, Suite 210\nSan Francisco, California, 94103', type: 'textarea' },
            { id: 'tax', label: 'Tax ID', value: 'US-9930294-B' }
        ],
        
        currency: 'USD',
        currencySymbol: '$',
        
        taxEnabled: true,
        taxType: 'IGST',
        defaultTaxRate: 18,
        
        discountType: 'percentage',
        globalDiscountValue: 10,
        
        shippingEnabled: true,
        shippingCost: 75,
        
        bankEnabled: true,
        bankName: 'ICICI Bank Ltd',
        bankAccount: '000201994850',
        bankIfsc: 'ICIC0000002',
        bankBranch: 'HSR Layout Branch, Bangalore',
        
        upiEnabled: true,
        upiId: 'pixelflow@icici',
        
        notesEnabled: true,
        notes: '1. Please include the Invoice Number in the payment reference.\n2. Payment via UPI or direct wire transfer is accepted.\n3. Custom designs carry a 3-month support warranty. Thank you!',
        
        amountPaid: 1200,
        
        theme: 'theme-indigo',
        fontFamily: 'font-outfit',
        logoBase64: state.logoBase64, // retain logo if already set
        
        items: [
            { id: 101, name: 'SaaS Dashboard Design System', description: 'Complete Figma UI Kit with 200+ components, responsive layouts, and light/dark templates.', quantity: 1, rate: 2500, taxRate: 18, discountRate: 0 },
            { id: 102, name: 'Frontend React Development', description: 'Implementation of the approved high fidelity dashboard UI using React/Next.js (60 hours @ $40/hr).', quantity: 60, rate: 40, taxRate: 18, discountRate: 0 },
            { id: 103, name: 'Copywriting & Content Strategy', description: 'Creation of marketing copy, onboarding flows, and notification templates.', quantity: 1, rate: 650, taxRate: 5, discountRate: 0 }
        ]
    };
    
    loadStateToDOM();
    renderItemsAndTotals();
    autoSaveToLocalStorage();
}

// App Initialization
window.addEventListener('DOMContentLoaded', () => {
    try {
        loadSavedState();
        initializeDates();
        initializePO();
        loadStateToDOM();
        renderItemsAndTotals();
    } catch (error) {
        console.error("Initialization failed, resetting to default state:", error);
        localStorage.removeItem('invoify_state'); // Wipes corrupted storage
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        state.items[0].id = Date.now();
        initializeDates();
        initializePO();
        loadStateToDOM();
        renderItemsAndTotals();
    } finally {
        try {
            bindEvents();
        } catch (e) {
            console.error("Failed to bind event listeners:", e);
        }
    }
});

// Pre-print formatting hooks to handle all input elements without scrollbars, outlines, or cutoffs
window.addEventListener('beforeprint', () => {
    // Set dynamic document title for clean PDF filename (suggested filename on save)
    const billedTo = state.toName ? state.toName.trim() : 'Client';
    const invNo = state.invoiceNumber ? state.invoiceNumber.trim() : '';
    const cleanBilledTo = billedTo.replace(/[\/\\?%*:|"<>]/g, '-');
    const cleanInvNo = invNo.replace(/[\/\\?%*:|"<>]/g, '-');
    
    window._originalDocumentTitle = document.title;
    if (cleanInvNo) {
        document.title = `${cleanBilledTo} - ${cleanInvNo}`;
    } else {
        document.title = cleanBilledTo;
    }

    // For every input, textarea, and select element inside the printable invoice
    document.querySelectorAll('input, textarea, select').forEach(el => {
        // Skip hidden settings fields
        if (el.closest('.no-print') || el.closest('.sidebar')) return;
        
        // Skip hidden inputs (like the logo file input picker)
        if (el.classList.contains('hidden-input') || el.type === 'file') return;
        
        const printText = document.createElement('span');
        printText.className = 'print-input-mirror';
        printText.style.fontSize = window.getComputedStyle(el).fontSize;
        printText.style.fontWeight = window.getComputedStyle(el).fontWeight;
        printText.style.color = window.getComputedStyle(el).color;
        printText.style.fontFamily = window.getComputedStyle(el).fontFamily;
        printText.style.padding = '4px 6px';
        
        // Populate text content
        if (el.tagName === 'SELECT') {
            printText.textContent = el.options[el.selectedIndex]?.text || '';
        } else {
            printText.textContent = el.value || '';
        }
        
        // Format layout for textarea or standard text input
        if (el.tagName === 'TEXTAREA') {
            printText.style.display = 'block';
            printText.style.whiteSpace = 'pre-wrap';
            printText.style.wordBreak = 'break-word';
            printText.style.width = '100%';
        } else {
            printText.style.display = 'inline-block';
            // Align numbers right in the line items table cells
            if (window.getComputedStyle(el).textAlign === 'right') {
                printText.style.width = '100%';
                printText.style.textAlign = 'right';
            }
        }
        
        el.parentNode.insertBefore(printText, el);
        el.classList.add('print-hidden-element');
    });
});

window.addEventListener('afterprint', () => {
    // Restore original document title
    if (window._originalDocumentTitle) {
        document.title = window._originalDocumentTitle;
    }

    // Remove all print spans
    document.querySelectorAll('.print-input-mirror').forEach(mirror => {
        mirror.remove();
    });
    // Show original input elements
    document.querySelectorAll('.print-hidden-element').forEach(el => {
        el.classList.remove('print-hidden-element');
    });
});
