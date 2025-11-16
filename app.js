// Firebase configuration
const FIREBASE_ENABLED = true; // Firebase is now enabled!

const firebaseConfig = {
    apiKey: "AIzaSyCbXwNaCapvIbnn-qEmRFMFtkkBbwWgjmU",
    authDomain: "harrep.firebaseapp.com",
    projectId: "harrep",
    storageBucket: "harrep.firebasestorage.app",
    messagingSenderId: "361793270798",
    appId: "1:361793270798:web:207ccb69cfd11de53af85f"
};

const appState = {
    step: 1,
    reportType: null,
    harassmentType: [],
    description: '',
    date: '',
    contact: {
        email: '',
        phone: ''
    }
};

function render() {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = getStepHTML();
}

function getStepHTML() {
    switch(appState.step) {
        case 1:
            return `
                <h1>👋 Hi, I'm here to listen</h1>
                <p class="subtitle">You can share what happened — anonymously and safely.</p>
                <div class="button-group">
                    <button onclick="window.nextStep()">Continue</button>
                </div>
            `;
        
        case 2:
            return `
                <h1>How would you like to proceed?</h1>
                <p class="subtitle">Choose what feels right for you</p>
                <div class="button-group">
                    <button onclick="window.selectReportType('file')">File a report</button>
                    <button class="secondary" onclick="window.selectReportType('talk')">Just talk</button>
                </div>
            `;
        
        case 3:
            return `
                <div class="step-indicator">Step 1 of 5</div>
                <h1>What kind of harassment did you experience?</h1>
                <p class="subtitle">Select all that apply</p>
                <div class="button-group">
                    <button class="type-button ${appState.harassmentType.includes('verbal') ? 'selected' : ''}" 
                            onclick="window.toggleType('verbal')">Verbal</button>
                    <button class="type-button ${appState.harassmentType.includes('physical') ? 'selected' : ''}" 
                            onclick="window.toggleType('physical')">Physical</button>
                    <button class="type-button ${appState.harassmentType.includes('online') ? 'selected' : ''}" 
                            onclick="window.toggleType('online')">Online</button>
                    <button class="type-button ${appState.harassmentType.includes('workplace') ? 'selected' : ''}" 
                            onclick="window.toggleType('workplace')">Workplace</button>
                    <button class="type-button ${appState.harassmentType.includes('other') ? 'selected' : ''}" 
                            onclick="window.toggleType('other')">Other</button>
                </div>
                <div class="button-group" style="margin-top: 30px;">
                    <button onclick="window.nextStep()" ${appState.harassmentType.length === 0 ? 'disabled' : ''}>Continue</button>
                </div>
            `;
        
        case 4:
            return `
                <div class="step-indicator">Step 2 of 5</div>
                <h1>Please describe what happened</h1>
                <p class="subtitle">Share as much or as little as you're comfortable with</p>
                <textarea id="description" placeholder="Describe the incident in your own words...">${appState.description}</textarea>
                <a href="#" class="skip-link" onclick="window.skipStep(); return false;">Skip this question</a>
                <div class="button-group">
                    <button onclick="window.saveDescription()">Continue</button>
                </div>
            `;
        
        case 5:
            return `
                <div class="step-indicator">Step 3 of 5</div>
                <h1>When did this happen?</h1>
                <p class="subtitle">Approximate date is fine</p>
                <input type="date" id="date" value="${appState.date}" max="${new Date().toISOString().split('T')[0]}">
                <a href="#" class="skip-link" onclick="window.skipStep(); return false;">Skip this question</a>
                <div class="button-group">
                    <button onclick="window.saveDate()">Continue</button>
                </div>
            `;
        
        case 6:
            return `
                <div class="step-indicator">Step 4 of 5</div>
                <h1>Contact Information</h1>
                <p class="subtitle">Would you like to provide contact information? <span class="optional-label">(Optional)</span></p>
                <p class="subtitle">A support team may reach out to offer help</p>
                <input type="email" id="email" placeholder="Email address (optional)" value="${appState.contact.email}">
                <input type="tel" id="phone" placeholder="Phone number (optional)" value="${appState.contact.phone}">
                <a href="#" class="skip-link" onclick="window.skipStep(); return false;">Skip this question</a>
                <div class="button-group">
                    <button onclick="window.saveContact()">Continue</button>
                </div>
            `;
        
        case 7:
            return `
                <div class="step-indicator">Step 5 of 5</div>
                <h1>Thank you for trusting us</h1>
                <div class="report-id">
                    <h2>Your Report ID</h2>
                    <div class="report-id-code">${appState.reportId}</div>
                    <p style="margin-top: 10px; color: #16a34a;">Save this ID if you need to contact us later</p>
                </div>
                ${getResourcesHTML()}
                <div class="button-group">
                    <button onclick="window.location.reload()">Submit Another Report</button>
                </div>
            `;
        
        default:
            return '<h1>Error</h1>';
    }
}

function getResourcesHTML() {
    return `
        <div class="resources">
            <h3>🆘 Emergency Resources</h3>
            <ul>
                <li><strong>National Domestic Violence Hotline:</strong> <a href="tel:1-800-799-7233">1-800-799-7233</a></li>
                <li><strong>Crisis Text Line:</strong> Text HOME to <a href="sms:741741">741741</a></li>
                <li><strong>RAINN National Sexual Assault Hotline:</strong> <a href="tel:1-800-656-4673">1-800-656-HOPE (4673)</a></li>
                <li><strong>Emergency Services:</strong> <a href="tel:911">911</a></li>
            </ul>
        </div>
    `;
}

function generateReportId() {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `#H${dateStr}-${random}`;
}

async function submitReport() {
    try {
        const reportData = {
            reportId: appState.reportId,
            reportType: appState.reportType,
            harassmentType: appState.harassmentType,
            description: appState.description,
            date: appState.date,
            contact: appState.contact,
            timestamp: new Date().toISOString(),
            status: 'new'
        };

        if (FIREBASE_ENABLED) {
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
            const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            
            const app = initializeApp(firebaseConfig);
            const db = getFirestore(app);
            
            await addDoc(collection(db, 'reports'), {
                ...reportData,
                timestamp: serverTimestamp()
            });
            console.log('✅ Report submitted to Firebase successfully!');
        } else {
            // Store locally for demo purposes
            const reports = JSON.parse(localStorage.getItem('reports') || '[]');
            reports.push(reportData);
            localStorage.setItem('reports', JSON.stringify(reports));
            console.log('Report saved locally (Firebase not configured)');
            console.log('Report data:', reportData);
        }
    } catch (error) {
        console.error('Error submitting report:', error);
    }
}

// Global functions
window.nextStep = () => {
    appState.step++;
    render();
};

window.selectReportType = (type) => {
    appState.reportType = type;
    appState.step++;
    render();
};

window.toggleType = (type) => {
    const index = appState.harassmentType.indexOf(type);
    if (index > -1) {
        appState.harassmentType.splice(index, 1);
    } else {
        appState.harassmentType.push(type);
    }
    render();
};

window.saveDescription = () => {
    appState.description = document.getElementById('description').value;
    appState.step++;
    render();
};

window.saveDate = () => {
    appState.date = document.getElementById('date').value;
    appState.step++;
    render();
};

window.saveContact = async () => {
    appState.contact.email = document.getElementById('email').value;
    appState.contact.phone = document.getElementById('phone').value;
    
    appState.reportId = generateReportId();
    await submitReport();
    
    appState.step++;
    render();
};

window.skipStep = () => {
    appState.step++;
    render();
};

// Initialize app
render();
