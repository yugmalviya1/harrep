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

let app, auth, db;

let allReports = [];
let currentFilters = {
    status: 'all',
    type: 'all'
};
let isLoggedIn = false;

// Initialize Firebase
async function initFirebase() {
    if (FIREBASE_ENABLED) {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getAuth, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        
        // Auth state observer
        onAuthStateChanged(auth, (user) => {
            if (user) {
                isLoggedIn = true;
                document.getElementById('loginSection').style.display = 'none';
                document.getElementById('dashboardSection').style.display = 'block';
                loadReports();
            } else {
                isLoggedIn = false;
                document.getElementById('loginSection').style.display = 'flex';
                document.getElementById('dashboardSection').style.display = 'none';
            }
        });
    } else {
        // Demo mode - show login
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('dashboardSection').style.display = 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
});

// Login
document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');

    if (FIREBASE_ENABLED && auth) {
        try {
            const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
            await signInWithEmailAndPassword(auth, email, password);
            errorEl.textContent = '';
            console.log('✅ Login successful!');
        } catch (error) {
            errorEl.textContent = 'Invalid credentials. Please try again.';
            console.error('❌ Login error:', error.message);
        }
    } else {
        // Demo mode - simple password check
        if (email === 'admin@demo.com' && password === 'demo123') {
            isLoggedIn = true;
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('dashboardSection').style.display = 'block';
            loadReports();
            errorEl.textContent = '';
        } else {
            errorEl.textContent = 'Demo credentials: admin@demo.com / demo123';
        }
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (FIREBASE_ENABLED && auth) {
        const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
        await signOut(auth);
        console.log('✅ Logged out');
    } else {
        isLoggedIn = false;
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('dashboardSection').style.display = 'none';
    }
});

// Load reports
async function loadReports() {
    if (FIREBASE_ENABLED && db) {
        const { collection, query, orderBy, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const q = query(collection(db, 'reports'), orderBy('timestamp', 'desc'));
        
        onSnapshot(q, (snapshot) => {
            allReports = [];
            snapshot.forEach((doc) => {
                allReports.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            console.log('✅ Loaded', allReports.length, 'reports from Firebase');
            updateStats();
            displayReports();
        });
    } else {
        // Load from localStorage for demo
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        allReports = reports.map((report, index) => ({
            id: `local-${index}`,
            ...report
        }));
        updateStats();
        displayReports();
    }
}

// Update statistics
function updateStats() {
    const total = allReports.length;
    const newReports = allReports.filter(r => r.status === 'new').length;
    const inProgress = allReports.filter(r => r.status === 'in-progress').length;
    const resolved = allReports.filter(r => r.status === 'resolved').length;

    document.getElementById('totalReports').textContent = total;
    document.getElementById('newReports').textContent = newReports;
    document.getElementById('inProgressReports').textContent = inProgress;
    document.getElementById('resolvedReports').textContent = resolved;
}

// Display reports
function displayReports() {
    const reportsList = document.getElementById('reportsList');
    
    let filteredReports = allReports;
    
    if (currentFilters.status !== 'all') {
        filteredReports = filteredReports.filter(r => r.status === currentFilters.status);
    }
    
    if (currentFilters.type !== 'all') {
        filteredReports = filteredReports.filter(r => 
            r.harassmentType && r.harassmentType.includes(currentFilters.type)
        );
    }

    if (filteredReports.length === 0) {
        reportsList.innerHTML = '<p class="loading">No reports found</p>';
        return;
    }

    reportsList.innerHTML = filteredReports.map(report => `
        <div class="report-card" onclick="window.showReportDetails('${report.id}')">
            <div class="report-header">
                <span class="report-id">${report.reportId}</span>
                <span class="status-badge status-${report.status}">${report.status}</span>
            </div>
            <div class="report-meta">
                <span>📅 ${report.date || 'No date provided'}</span>
                <span>📝 ${report.reportType === 'file' ? 'Formal Report' : 'Talk Only'}</span>
                <span>⏰ ${formatTimestamp(report.timestamp)}</span>
            </div>
            <div class="harassment-types">
                ${report.harassmentType.map(type => `<span class="type-tag">${type}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// Format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown';
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString();
    } catch (e) {
        return 'Unknown';
    }
}

// Show report details in modal
window.showReportDetails = (reportId) => {
    const report = allReports.find(r => r.id === reportId);
    if (!report) return;

    const modal = document.getElementById('reportModal');
    const detailsDiv = document.getElementById('reportDetails');

    detailsDiv.innerHTML = `
        <h2>${report.reportId}</h2>
        
        <div class="detail-section">
            <h3>Status</h3>
            <span class="status-badge status-${report.status}">${report.status}</span>
        </div>

        <div class="detail-section">
            <h3>Report Type</h3>
            <p>${report.reportType === 'file' ? 'Formal Report' : 'Talk Only'}</p>
        </div>

        <div class="detail-section">
            <h3>Harassment Types</h3>
            <div class="harassment-types">
                ${report.harassmentType.map(type => `<span class="type-tag">${type}</span>`).join('')}
            </div>
        </div>

        <div class="detail-section">
            <h3>Description</h3>
            <p>${report.description || 'No description provided'}</p>
        </div>

        <div class="detail-section">
            <h3>Incident Date</h3>
            <p>${report.date || 'No date provided'}</p>
        </div>

        <div class="detail-section">
            <h3>Contact Information</h3>
            <p>Email: ${report.contact?.email || 'Not provided'}</p>
            <p>Phone: ${report.contact?.phone || 'Not provided'}</p>
        </div>

        <div class="detail-section">
            <h3>Submitted</h3>
            <p>${formatTimestamp(report.timestamp)}</p>
        </div>

        <div class="status-actions">
            <button class="btn-new" onclick="window.updateReportStatus('${report.id}', 'new')">Mark as New</button>
            <button class="btn-progress" onclick="window.updateReportStatus('${report.id}', 'in-progress')">Mark as In Progress</button>
            <button class="btn-resolved" onclick="window.updateReportStatus('${report.id}', 'resolved')">Mark as Resolved</button>
        </div>
    `;

    modal.style.display = 'block';
};

// Update report status
window.updateReportStatus = async (reportId, newStatus) => {
    try {
        if (FIREBASE_ENABLED && db) {
            const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
            await updateDoc(doc(db, 'reports', reportId), {
                status: newStatus
            });
            console.log('✅ Status updated to:', newStatus);
        } else {
            // Update in localStorage for demo
            const reports = JSON.parse(localStorage.getItem('reports') || '[]');
            const index = parseInt(reportId.replace('local-', ''));
            if (reports[index]) {
                reports[index].status = newStatus;
                localStorage.setItem('reports', JSON.stringify(reports));
                loadReports();
            }
        }
        document.getElementById('reportModal').style.display = 'none';
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Error updating status');
    }
};

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('reportModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('reportModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Filters
document.getElementById('statusFilter').addEventListener('change', (e) => {
    currentFilters.status = e.target.value;
    displayReports();
});

document.getElementById('typeFilter').addEventListener('change', (e) => {
    currentFilters.type = e.target.value;
    displayReports();
});
