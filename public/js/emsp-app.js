// eMSP App JavaScript functionality

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
});

// Screen management
function showScreen(screen) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    
    // Show selected screen
    const targetScreen = document.getElementById(`${screen}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    // Update navigation
    const navButtons = document.querySelectorAll('.nav-btn, a[onclick*="showScreen"]');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Update the navigation button colors
    const activeNav = document.querySelector(`a[onclick*="'${screen}'"]`);
    if (activeNav) {
        // Reset all nav buttons
        document.querySelectorAll('#nav-map, #nav-charge, #nav-account').forEach(nav => {
            const icon = nav.querySelector('.w-10');
            const text = nav.querySelector('.text-xs');
            if (icon && text) {
                icon.className = 'w-10 h-10 rounded-xl flex items-center justify-center mb-1 bg-slate-100 group-hover:bg-blue-100';
                icon.querySelector('i').className = icon.querySelector('i').className.replace('text-blue-600', 'text-slate-500');
                text.className = 'text-xs font-medium text-slate-500 group-hover:text-blue-600';
            }
        });
        
        // Set active styles for selected nav
        const selectedNav = document.getElementById(`nav-${screen}`);
        if (selectedNav) {
            const icon = selectedNav.querySelector('.w-10');
            const text = selectedNav.querySelector('.text-xs');
            if (icon && text) {
                icon.className = 'w-10 h-10 rounded-xl flex items-center justify-center mb-1 bg-blue-100 group-hover:bg-blue-200';
                icon.querySelector('i').className = icon.querySelector('i').className.replace('text-slate-500', 'text-blue-600');
                text.className = 'text-xs font-medium text-blue-600 group-hover:text-blue-700';
            }
        }
    }
}

// QR Scanner functionality
function showQRScanner() {
    const modal = document.getElementById('qr-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeQRScanner() {
    const modal = document.getElementById('qr-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function simulateQRScan() {
    // Simulate QR scanning success
    closeQRScanner();
    showChargingSession();
}

// RFID Simulator
function showRFIDSimulator() {
    alert('RFID/NFC simulation: Please tap your card or phone to the charging station.');
    showChargingSession();
}

// Ad-hoc payment
function showAdHocPortal() {
    alert('Redirecting to payment portal for ad-hoc charging session...');
    showChargingSession();
}

// Show active charging session
function showChargingSession() {
    const activeSession = document.getElementById('active-session');
    if (activeSession) {
        activeSession.classList.remove('hidden');
        
        // Start session simulation
        simulateChargingProgress();
    }
}

// Simulate charging progress
function simulateChargingProgress() {
    let progress = 0;
    let energy = 0;
    let duration = 0;
    let power = Math.floor(Math.random() * 30) + 20; // 20-50 kW
    let cost = 0;
    
    const progressCircle = document.getElementById('progress-circle');
    const progressText = document.getElementById('session-progress-text');
    const energyEl = document.getElementById('session-energy');
    const durationEl = document.getElementById('session-duration');
    const powerEl = document.getElementById('session-power');
    const costEl = document.getElementById('session-cost');
    
    const interval = setInterval(() => {
        progress += Math.random() * 3;
        energy += (power / 60) * 0.1; // kWh per 6 seconds
        duration += 0.1; // minutes
        cost = energy * 0.35; // €0.35 per kWh
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
        }
        
        // Update progress circle
        if (progressCircle) {
            const circumference = 2 * Math.PI * 50;
            const offset = circumference - (progress / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
        
        // Update text values
        if (progressText) progressText.textContent = Math.floor(progress) + '%';
        if (energyEl) energyEl.textContent = energy.toFixed(1) + ' kWh';
        if (durationEl) durationEl.textContent = Math.floor(duration);
        if (powerEl) powerEl.textContent = power;
        if (costEl) costEl.textContent = '€' + cost.toFixed(2);
        
    }, 1000);
}

// Stop charging session
function stopCharging() {
    const activeSession = document.getElementById('active-session');
    if (activeSession) {
        if (confirm('Are you sure you want to stop the charging session?')) {
            activeSession.classList.add('hidden');
            alert('Charging session stopped. Receipt sent to your email.');
        }
    }
}

// Mock charging stations data
const mockStations = [
    {
        id: 1,
        name: 'Downtown Mall',
        address: '123 Main Street',
        distance: '0.2 km',
        available: 3,
        total: 4,
        price: '€0.35/kWh',
        type: 'DC Fast',
        power: '150 kW'
    },
    {
        id: 2,
        name: 'Airport Terminal',
        address: '456 Airport Blvd',
        distance: '1.8 km',
        available: 2,
        total: 6,
        price: '€0.32/kWh',
        type: 'AC',
        power: '22 kW'
    },
    {
        id: 3,
        name: 'Shopping Center',
        address: '789 Commerce Way',
        distance: '3.2 km',
        available: 5,
        total: 8,
        price: '€0.30/kWh',
        type: 'Mixed',
        power: '50 kW'
    }
];

// Populate stations list
function populateStationsList() {
    const container = document.getElementById('stations-list');
    if (!container) return;
    
    container.innerHTML = mockStations.map(station => `
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="font-semibold text-slate-900 mb-1">${station.name}</h3>
                    <p class="text-sm text-slate-600 mb-2">${station.address}</p>
                    <div class="flex items-center space-x-4 text-xs text-slate-500">
                        <span class="flex items-center">
                            <i data-lucide="map-pin" class="w-3 h-3 mr-1"></i>
                            ${station.distance}
                        </span>
                        <span class="flex items-center">
                            <i data-lucide="zap" class="w-3 h-3 mr-1"></i>
                            ${station.type}
                        </span>
                        <span class="flex items-center">
                            <i data-lucide="gauge" class="w-3 h-3 mr-1"></i>
                            ${station.power}
                        </span>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-lg font-bold text-emerald-600">${station.price}</p>
                    <p class="text-xs text-slate-500">${station.available}/${station.total} available</p>
                </div>
            </div>
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    ${Array.from({length: station.total}, (_, i) => `
                        <div class="w-3 h-3 rounded-full ${i < station.available ? 'bg-emerald-500' : 'bg-slate-300'}"></div>
                    `).join('')}
                </div>
                <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Navigate
                </button>
            </div>
        </div>
    `).join('');
    
    // Reinitialize icons
    lucide.createIcons();
}

// Profile Management
function openProfileMenu() {
    const menu = `
        <div id="profileDropdown" class="absolute right-0 top-12 bg-white rounded-xl border border-slate-200 shadow-lg py-2 w-48 z-50">
            <button onclick="viewProfile()" class="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center space-x-3">
                <i data-lucide="user" class="w-4 h-4 text-slate-600"></i>
                <span class="text-sm text-slate-900">View Profile</span>
            </button>
            <button onclick="showScreen('account')" class="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center space-x-3">
                <i data-lucide="settings" class="w-4 h-4 text-slate-600"></i>
                <span class="text-sm text-slate-900">Account Settings</span>
            </button>
            <div class="border-t border-slate-200 my-1"></div>
            <button onclick="showNotifications()" class="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center space-x-3">
                <i data-lucide="bell" class="w-4 h-4 text-slate-600"></i>
                <span class="text-sm text-slate-900">Notifications</span>
            </button>
            <button onclick="showHelp()" class="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center space-x-3">
                <i data-lucide="help-circle" class="w-4 h-4 text-slate-600"></i>
                <span class="text-sm text-slate-900">Help & Support</span>
            </button>
        </div>
    `;
    
    // Remove existing dropdown
    const existing = document.getElementById('profileDropdown');
    if (existing) {
        existing.remove();
        return;
    }
    
    // Add dropdown
    const profileBtn = document.getElementById('profileBtn');
    profileBtn.style.position = 'relative';
    profileBtn.insertAdjacentHTML('afterend', menu);
    lucide.createIcons();
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!e.target.closest('#profileBtn') && !e.target.closest('#profileDropdown')) {
                const dropdown = document.getElementById('profileDropdown');
                if (dropdown) dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

function viewProfile() {
    alert('👤 Profile:\n\nName: John Doe\nEmail: john.doe@example.com\nMember since: January 2023\nTotal sessions: 12\nTotal spent: €45.60');
    document.getElementById('profileDropdown')?.remove();
}

function showNotifications() {
    alert('🔔 Recent Notifications:\n\n• Charging session completed at Downtown Mall\n• New station available near your location\n• Monthly usage summary ready\n• Payment method expires soon');
    document.getElementById('profileDropdown')?.remove();
}

function showHelp() {
    alert('❓ Help & Support:\n\n• Call: +1 (555) 123-4567\n• Email: support@evcharge.com\n• Live chat available 24/7\n• FAQ: www.evcharge.com/faq');
    document.getElementById('profileDropdown')?.remove();
}

// Search Functionality
function handleSearch(query) {
    if (query.length < 2) {
        // Reset to show all stations
        populateStationsList();
        return;
    }
    
    // Filter stations based on search query
    const filteredStations = mockStations.filter(station => 
        station.name.toLowerCase().includes(query.toLowerCase()) ||
        station.address.toLowerCase().includes(query.toLowerCase()) ||
        station.type.toLowerCase().includes(query.toLowerCase())
    );
    
    populateFilteredStations(filteredStations, query);
}

function populateFilteredStations(stations, query) {
    const container = document.getElementById('stations-list');
    if (!container) return;
    
    if (stations.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-slate-500">
                <i data-lucide="search" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                <p class="text-lg font-medium mb-2">No stations found</p>
                <p class="text-sm opacity-75">Try searching for a different location or station name</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    container.innerHTML = `
        <div class="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <p class="text-sm text-blue-700">
                <i data-lucide="search" class="w-4 h-4 inline mr-1"></i>
                Found ${stations.length} station${stations.length !== 1 ? 's' : ''} matching "${query}"
            </p>
        </div>
    ` + stations.map(station => createStationHTML(station)).join('');
    
    lucide.createIcons();
}

function createStationHTML(station) {
    return `
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="font-semibold text-slate-900 mb-1">${station.name}</h3>
                    <p class="text-sm text-slate-600 mb-2">${station.address}</p>
                    <div class="flex items-center space-x-4 text-xs text-slate-500">
                        <span class="flex items-center">
                            <i data-lucide="map-pin" class="w-3 h-3 mr-1"></i>
                            ${station.distance}
                        </span>
                        <span class="flex items-center">
                            <i data-lucide="zap" class="w-3 h-3 mr-1"></i>
                            ${station.type}
                        </span>
                        <span class="flex items-center">
                            <i data-lucide="gauge" class="w-3 h-3 mr-1"></i>
                            ${station.power}
                        </span>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-lg font-bold text-emerald-600">${station.price}</p>
                    <p class="text-xs text-slate-500">${station.available}/${station.total} available</p>
                </div>
            </div>
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    ${Array.from({length: station.total}, (_, i) => `
                        <div class="w-3 h-3 rounded-full ${i < station.available ? 'bg-emerald-500' : 'bg-slate-300'}"></div>
                    `).join('')}
                </div>
                <button onclick="navigateToStation(${station.id})" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Navigate
                </button>
            </div>
        </div>
    `;
}

// Location Services
function useCurrentLocation() {
    if ('geolocation' in navigator) {
        // Show loading state
        const searchInput = document.getElementById('searchInput');
        const originalPlaceholder = searchInput.placeholder;
        searchInput.placeholder = 'Getting your location...';
        searchInput.disabled = true;
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Mock reverse geocoding
                searchInput.value = 'Current Location (Mock Address)';
                searchInput.placeholder = originalPlaceholder;
                searchInput.disabled = false;
                
                // Show nearby stations
                showNearbyStations();
                
                alert(`📍 Location found!\nLatitude: ${lat.toFixed(6)}\nLongitude: ${lng.toFixed(6)}\n\nShowing nearby charging stations.`);
            },
            function(error) {
                searchInput.placeholder = originalPlaceholder;
                searchInput.disabled = false;
                
                let errorMessage = 'Unable to get your location. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please enable location permissions.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out.';
                        break;
                }
                alert('📍 ' + errorMessage);
            }
        );
    } else {
        alert('📍 Geolocation is not supported by this browser.');
    }
}

function showNearbyStations() {
    // Mock showing nearest stations
    const nearbyStations = mockStations.map(station => ({
        ...station,
        distance: (Math.random() * 0.5).toFixed(1) + ' km' // Randomize to show as "nearby"
    }));
    
    populateFilteredStations(nearbyStations, 'nearby stations');
}

// Navigation
function navigateToStation(stationId) {
    const station = mockStations.find(s => s.id === stationId);
    if (station) {
        alert(`🧭 Navigation to ${station.name}\n\nAddress: ${station.address}\nDistance: ${station.distance}\n\nOpening navigation app...`);
        
        // In a real app, this would open the device's navigation app
        // window.open(`maps://maps.google.com/maps?daddr=${station.address}`);
    }
}

// Account Management
function editProfile() {
    const newName = prompt('Edit your name:', 'John Doe');
    if (newName) {
        alert(`✅ Profile updated!\nName changed to: ${newName}`);
    }
}

function addNewContract() {
    const contractTypes = ['Personal', 'Business', 'Fleet'];
    const selectedType = contractTypes[Math.floor(Math.random() * contractTypes.length)];
    alert(`📋 Adding new ${selectedType} contract...\n\nThis will redirect you to our contract management portal to complete the setup process.`);
}

function addPaymentMethod() {
    const cardNumber = prompt('Enter your card number (demo):', '**** **** **** 5678');
    if (cardNumber) {
        alert(`💳 Payment method added successfully!\n\nCard: ${cardNumber}\nYour new card is now available for charging payments.`);
    }
}

// Professional Features - Roaming Networks
function openRoamingNetworks() {
    const modalContent = `
        <div id="roamingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <i data-lucide="globe" class="w-6 h-6 text-orange-600"></i>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-slate-900">Roaming Networks</h2>
                                <p class="text-slate-600">Access charging stations across Europe</p>
                            </div>
                        </div>
                        <button onclick="closeModal('roamingModal')" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <i data-lucide="x" class="w-6 h-6 text-slate-500"></i>
                        </button>
                    </div>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- Network Coverage Map -->
                    <div class="bg-slate-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Network Coverage</h3>
                        <div class="bg-gradient-to-br from-blue-100 to-emerald-100 rounded-xl h-64 flex items-center justify-center">
                            <div class="text-center text-slate-600">
                                <i data-lucide="map" class="w-12 h-12 mx-auto mb-4 opacity-50"></i>
                                <p class="font-medium">European Roaming Coverage Map</p>
                                <p class="text-sm opacity-75">28 countries • 250,000+ charging points</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Active Networks -->
                    <div class="grid md:grid-cols-3 gap-4">
                        <!-- Hubject -->
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <i data-lucide="network" class="w-5 h-5 text-white"></i>
                                </div>
                                <div class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                                    <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                    Active
                                </div>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 mb-2">Hubject intercharge</h3>
                            <p class="text-slate-600 text-sm mb-4">Europe's largest roaming network</p>
                            <div class="space-y-2 text-xs text-slate-500">
                                <p>• 25 countries coverage</p>
                                <p>• 180,000+ charging points</p>
                                <p>• Real-time availability</p>
                                <p>• Transparent pricing</p>
                            </div>
                        </div>
                        
                        <!-- EIPA -->
                        <div class="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                                    <i data-lucide="zap" class="w-5 h-5 text-white"></i>
                                </div>
                                <div class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                                    <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                    Active
                                </div>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 mb-2">EIPA Network</h3>
                            <p class="text-slate-600 text-sm mb-4">European e-Invoice Platform</p>
                            <div class="space-y-2 text-xs text-slate-500">
                                <p>• 15 countries coverage</p>
                                <p>• 50,000+ charging points</p>
                                <p>• Digital invoicing</p>
                                <p>• B2B fleet solutions</p>
                            </div>
                        </div>
                        
                        <!-- GIREVE -->
                        <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                                    <i data-lucide="link" class="w-5 h-5 text-white"></i>
                                </div>
                                <div class="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                                    <div class="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                                    Available
                                </div>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 mb-2">GIREVE</h3>
                            <p class="text-slate-600 text-sm mb-4">French national roaming hub</p>
                            <div class="space-y-2 text-xs text-slate-500">
                                <p>• France & Belgium</p>
                                <p>• 35,000+ charging points</p>
                                <p>• Government backed</p>
                                <p>• Public infrastructure</p>
                            </div>
                            <button onclick="enableGIREVE()" class="w-full mt-4 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                                Enable Access
                            </button>
                        </div>
                    </div>
                    
                    <!-- Roaming Statistics -->
                    <div class="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Your Roaming Activity</h3>
                        <div class="grid md:grid-cols-4 gap-4">
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">15</p>
                                <p class="text-sm text-slate-600">Countries Visited</p>
                            </div>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">47</p>
                                <p class="text-sm text-slate-600">Roaming Sessions</p>
                            </div>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">€127.50</p>
                                <p class="text-sm text-slate-600">Total Roaming</p>
                            </div>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">€0.42</p>
                                <p class="text-sm text-slate-600">Avg. Price/kWh</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    lucide.createIcons();
}

// OCPI Direct Payment Integration
function openOCPIPayments() {
    const modalContent = `
        <div id="ocpiModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <i data-lucide="credit-card" class="w-6 h-6 text-emerald-600"></i>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-slate-900">OCPI Direct Payment</h2>
                                <p class="text-slate-600">Seamless cross-network billing</p>
                            </div>
                        </div>
                        <button onclick="closeModal('ocpiModal')" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <i data-lucide="x" class="w-6 h-6 text-slate-500"></i>
                        </button>
                    </div>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- Payment Methods -->
                    <div class="bg-slate-50 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Direct Payment Methods</h3>
                        <div class="grid md:grid-cols-2 gap-4">
                            <div class="bg-white border border-slate-200 rounded-xl p-4">
                                <div class="flex items-center space-x-3 mb-3">
                                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i data-lucide="smartphone" class="w-5 h-5 text-blue-600"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-slate-900">Mobile Wallet</h4>
                                        <p class="text-sm text-slate-600">Apple Pay, Google Pay</p>
                                    </div>
                                </div>
                                <div class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                                    <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                    Active
                                </div>
                            </div>
                            
                            <div class="bg-white border border-slate-200 rounded-xl p-4">
                                <div class="flex items-center space-x-3 mb-3">
                                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <i data-lucide="credit-card" class="w-5 h-5 text-purple-600"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-slate-900">Direct Debit</h4>
                                        <p class="text-sm text-slate-600">SEPA Direct Debit</p>
                                    </div>
                                </div>
                                <button onclick="setupDirectDebit()" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                    Setup Now
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Billing Settings -->
                    <div class="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Billing Configuration</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-slate-900">Auto-Settlement</p>
                                    <p class="text-sm text-slate-600">Automatic charging session settlement</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked class="sr-only peer">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                            
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-slate-900">Real-time Pricing</p>
                                    <p class="text-sm text-slate-600">Get live pricing before charging</p>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" checked class="sr-only peer">
                                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    lucide.createIcons();
}

// Enhanced Contract Management
function openContractManagement() {
    const modalContent = `
        <div id="contractModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <i data-lucide="file-text" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-slate-900">Contract Management</h2>
                                <p class="text-slate-600">B2C & B2B charging contracts</p>
                            </div>
                        </div>
                        <button onclick="closeModal('contractModal')" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <i data-lucide="x" class="w-6 h-6 text-slate-500"></i>
                        </button>
                    </div>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- Active Contracts -->
                    <div class="grid md:grid-cols-2 gap-6">
                        <!-- B2C Personal -->
                        <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                                    <i data-lucide="user" class="w-5 h-5 text-white"></i>
                                </div>
                                <div class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-200 text-emerald-800 text-sm font-medium">
                                    <div class="w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                                    Active
                                </div>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 mb-2">Personal Contract</h3>
                            <p class="text-slate-600 text-sm mb-4">B2C Individual Plan</p>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-slate-600">Rate:</span>
                                    <span class="font-medium text-slate-900">€0.35/kWh</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600">Monthly Fee:</span>
                                    <span class="font-medium text-slate-900">€0.00</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600">Status:</span>
                                    <span class="text-emerald-600 font-medium">Active</span>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Available B2B -->
                        <div class="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
                            <div class="flex items-center justify-between mb-4">
                                <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <i data-lucide="building" class="w-5 h-5 text-white"></i>
                                </div>
                                <div class="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                                    Available
                                </div>
                            </div>
                            <h3 class="text-lg font-semibold text-slate-900 mb-2">Business Fleet</h3>
                            <p class="text-slate-600 text-sm mb-4">B2B Corporate Plan</p>
                            <div class="space-y-2 text-sm mb-4">
                                <div class="flex justify-between">
                                    <span class="text-slate-600">Rate:</span>
                                    <span class="font-medium text-slate-900">€0.28/kWh</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600">Monthly Fee:</span>
                                    <span class="font-medium text-slate-900">€25.00</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-slate-600">Benefits:</span>
                                    <span class="text-blue-600 font-medium">Priority Support</span>
                                </div>
                            </div>
                            <button onclick="requestB2BContract()" class="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                Request Contract
                            </button>
                        </div>
                    </div>
                    
                    <!-- Contract Analytics -->
                    <div class="bg-white border border-slate-200 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Usage Analytics</h3>
                        <div class="grid md:grid-cols-4 gap-4">
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">342</p>
                                <p class="text-sm text-slate-600">Total Sessions</p>
                            </div>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">1,247</p>
                                <p class="text-sm text-slate-600">kWh Consumed</p>
                            </div>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">€436.45</p>
                                <p class="text-sm text-slate-600">Total Spent</p>
                            </div>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">€0.35</p>
                                <p class="text-sm text-slate-600">Avg. Rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    lucide.createIcons();
}

// Orlen Charge Integration
function openOrlenIntegration() {
    const modalContent = `
        <div id="orlenModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <i data-lucide="fuel" class="w-6 h-6 text-red-600"></i>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-slate-900">Orlen Charge</h2>
                                <p class="text-slate-600">Premium charging network access</p>
                            </div>
                        </div>
                        <button onclick="closeModal('orlenModal')" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <i data-lucide="x" class="w-6 h-6 text-slate-500"></i>
                        </button>
                    </div>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- Network Overview -->
                    <div class="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                        <h3 class="text-lg font-semibold text-slate-900 mb-4">Network Overview</h3>
                        <div class="grid md:grid-cols-3 gap-4">
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">450+</p>
                                <p class="text-sm text-slate-600">Charging Stations</p>
                            </div>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">1,200+</p>
                                <p class="text-sm text-slate-600">Charging Points</p>
                            </div>
                            <div class="text-center">
                                <p class="text-2xl font-bold text-slate-900 mb-1">350kW</p>
                                <p class="text-sm text-slate-600">Max Power</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Orlen Benefits -->
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="bg-white border border-slate-200 rounded-xl p-4">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="zap" class="w-4 h-4 text-emerald-600"></i>
                                </div>
                                <h4 class="font-semibold text-slate-900">Ultra-Fast Charging</h4>
                            </div>
                            <p class="text-sm text-slate-600">Up to 350kW DC charging at highway locations</p>
                        </div>
                        
                        <div class="bg-white border border-slate-200 rounded-xl p-4">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="shield-check" class="w-4 h-4 text-blue-600"></i>
                                </div>
                                <h4 class="font-semibold text-slate-900">Reliable Network</h4>
                            </div>
                            <p class="text-sm text-slate-600">99.2% uptime with 24/7 monitoring</p>
                        </div>
                        
                        <div class="bg-white border border-slate-200 rounded-xl p-4">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="gift" class="w-4 h-4 text-purple-600"></i>
                                </div>
                                <h4 class="font-semibold text-slate-900">Loyalty Program</h4>
                            </div>
                            <p class="text-sm text-slate-600">Earn points and get discounts on charging</p>
                        </div>
                        
                        <div class="bg-white border border-slate-200 rounded-xl p-4">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <i data-lucide="coffee" class="w-4 h-4 text-amber-600"></i>
                                </div>
                                <h4 class="font-semibold text-slate-900">Premium Amenities</h4>
                            </div>
                            <p class="text-sm text-slate-600">Coffee shops, restaurants, and WiFi</p>
                        </div>
                    </div>
                    
                    <!-- Integration Status -->
                    <div class="bg-slate-50 rounded-xl p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-slate-900">Integration Status</h3>
                            <div class="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                                <div class="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                Connected
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-slate-600">Account Linked</span>
                                <i data-lucide="check-circle" class="w-5 h-5 text-emerald-500"></i>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-slate-600">Payment Method</span>
                                <i data-lucide="check-circle" class="w-5 h-5 text-emerald-500"></i>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-slate-600">Loyalty Points</span>
                                <span class="text-slate-900 font-medium">1,247 points</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    lucide.createIcons();
}

// Helper functions for new features
function enableGIREVE() {
    alert('🔗 GIREVE Network Access\n\nActivating GIREVE network access...\n\nYou now have access to 35,000+ charging points in France and Belgium!');
    closeModal('roamingModal');
}

function setupDirectDebit() {
    alert('🏦 SEPA Direct Debit Setup\n\nRedirecting to secure banking portal...\n\nOnce setup is complete, your charging sessions will be automatically debited from your account.');
}

function requestB2BContract() {
    alert('🏢 B2B Contract Request\n\nYour business contract request has been submitted.\n\nOur fleet team will contact you within 24 hours to discuss your requirements.');
    closeModal('contractModal');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Global map variables
let evMap = null;
let userLocationMarker = null;
let markerClusterGroup = null;
let routingControl = null;
let userLocation = null;

// Charging station data
const chargingStations = [
    {
        id: 1,
        name: "Fast Charger - City Center",
        lat: 52.2297,
        lng: 21.0122,
        type: "DC Fast",
        power: "50kW",
        price: "€0.39/kWh",
        network: "Public",
        status: "available",
        available: 3,
        total: 4,
        address: "Marszałkowska 123, Warsaw"
    },
    {
        id: 2,
        name: "Ultra Charger - Highway",
        lat: 52.2500,
        lng: 21.0300,
        type: "DC Ultra Fast",
        power: "150kW",
        price: "€0.45/kWh",
        network: "Hubject",
        status: "available",
        available: 2,
        total: 2,
        address: "Highway A2, Exit 15"
    },
    {
        id: 3,
        name: "Orlen Charge Station",
        lat: 52.2000,
        lng: 20.9800,
        type: "DC Ultra Fast",
        power: "350kW",
        price: "€0.42/kWh",
        network: "Orlen",
        status: "available",
        available: 4,
        total: 6,
        address: "Orlen Station, ul. Okopowa 45"
    },
    {
        id: 4,
        name: "Shopping Mall Charger",
        lat: 52.2100,
        lng: 21.0500,
        type: "AC Standard",
        power: "22kW",
        price: "€0.28/kWh",
        network: "EIPA",
        status: "busy",
        available: 1,
        total: 3,
        address: "Westfield Shopping Center"
    },
    {
        id: 5,
        name: "Business District DC",
        lat: 52.2400,
        lng: 21.0100,
        type: "DC Fast",
        power: "75kW",
        price: "€0.41/kWh",
        network: "Public",
        status: "offline",
        available: 0,
        total: 2,
        address: "Financial District, ul. Emilii Plater"
    },
    
    // Berlin, Germany
    {
        id: 6,
        name: "IONITY Berlin Hub",
        lat: 52.5200,
        lng: 13.4050,
        type: "DC Ultra Fast",
        power: "350kW",
        price: "€0.79/kWh",
        network: "IONITY",
        status: "available",
        available: 4,
        total: 6,
        address: "Brandenburg Gate Area, Berlin"
    },
    {
        id: 7,
        name: "Tesla Supercharger",
        lat: 52.5000,
        lng: 13.3500,
        type: "DC Fast",
        power: "120kW",
        price: "€0.52/kWh",
        network: "Tesla",
        status: "available",
        available: 8,
        total: 12,
        address: "Potsdamer Platz, Berlin"
    },
    {
        id: 8,
        name: "EnBW Quick Charger",
        lat: 52.4800,
        lng: 13.4200,
        type: "DC Fast",
        power: "50kW",
        price: "€0.45/kWh",
        network: "EnBW",
        status: "occupied",
        available: 1,
        total: 4,
        address: "Kreuzberg District, Berlin"
    },
    
    // Paris, France
    {
        id: 9,
        name: "Belib' Paris Central",
        lat: 48.8566,
        lng: 2.3522,
        type: "AC Fast",
        power: "43kW",
        price: "€0.35/kWh",
        network: "Belib'",
        status: "available",
        available: 2,
        total: 4,
        address: "Châtelet-Les Halles, Paris"
    },
    {
        id: 10,
        name: "GIREVE Network Hub",
        lat: 48.8700,
        lng: 2.3100,
        type: "DC Fast",
        power: "75kW",
        price: "€0.42/kWh",
        network: "GIREVE",
        status: "available",
        available: 3,
        total: 3,
        address: "La Défense, Paris"
    },
    {
        id: 11,
        name: "Total Energies Station",
        lat: 48.8400,
        lng: 2.3700,
        type: "DC Fast",
        power: "50kW",
        price: "€0.39/kWh",
        network: "Total",
        status: "maintenance",
        available: 0,
        total: 2,
        address: "République Area, Paris"
    },
    
    // Amsterdam, Netherlands
    {
        id: 12,
        name: "Allego Amsterdam",
        lat: 52.3676,
        lng: 4.9041,
        type: "DC Fast",
        power: "50kW",
        price: "€0.59/kWh",
        network: "Allego",
        status: "available",
        available: 2,
        total: 4,
        address: "Centraal Station, Amsterdam"
    },
    {
        id: 13,
        name: "Fastned Highway",
        lat: 52.3500,
        lng: 4.8500,
        type: "DC Ultra Fast",
        power: "300kW",
        price: "€0.69/kWh",
        network: "Fastned",
        status: "available",
        available: 5,
        total: 6,
        address: "A10 Ring Road, Amsterdam"
    },
    
    // Vienna, Austria
    {
        id: 14,
        name: "SMATRICS Vienna",
        lat: 48.2082,
        lng: 16.3738,
        type: "DC Fast",
        power: "50kW",
        price: "€0.36/kWh",
        network: "SMATRICS",
        status: "available",
        available: 1,
        total: 2,
        address: "Stephansplatz, Vienna"
    },
    {
        id: 15,
        name: "Wien Energie Hub",
        lat: 48.1800,
        lng: 16.3400,
        type: "AC Normal",
        power: "22kW",
        price: "€0.28/kWh",
        network: "Wien Energie",
        status: "occupied",
        available: 0,
        total: 3,
        address: "Schönbrunn Area, Vienna"
    },
    
    // Prague, Czech Republic
    {
        id: 16,
        name: "CEZ Prague Central",
        lat: 50.0755,
        lng: 14.4378,
        type: "DC Fast",
        power: "50kW",
        price: "€0.33/kWh",
        network: "CEZ",
        status: "available",
        available: 2,
        total: 3,
        address: "Old Town Square, Prague"
    },
    {
        id: 17,
        name: "PRE Fast Charger",
        lat: 50.0800,
        lng: 14.4200,
        type: "DC Fast",
        power: "75kW",
        price: "€0.38/kWh",
        network: "PRE",
        status: "available",
        available: 1,
        total: 2,
        address: "Wenceslas Square, Prague"
    },
    
    // Copenhagen, Denmark
    {
        id: 18,
        name: "Clever Copenhagen",
        lat: 55.6761,
        lng: 12.5683,
        type: "DC Fast",
        power: "50kW",
        price: "€0.55/kWh",
        network: "Clever",
        status: "available",
        available: 3,
        total: 4,
        address: "City Hall Square, Copenhagen"
    },
    {
        id: 19,
        name: "Ørsted Green Hub",
        lat: 55.6900,
        lng: 12.5500,
        type: "DC Ultra Fast",
        power: "150kW",
        price: "€0.65/kWh",
        network: "Ørsted",
        status: "occupied",
        available: 1,
        total: 6,
        address: "Ørestad, Copenhagen"
    },
    
    // Stockholm, Sweden
    {
        id: 20,
        name: "Vattenfall Stockholm",
        lat: 59.3293,
        lng: 18.0686,
        type: "DC Fast",
        power: "50kW",
        price: "€0.49/kWh",
        network: "Vattenfall",
        status: "available",
        available: 2,
        total: 3,
        address: "Gamla Stan, Stockholm"
    }
];

// Initialize Full Leaflet Map with Mobile Optimization
function initializeEnhancedMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Clear existing content and setup map container
    mapElement.innerHTML = '';
    
    // Responsive height based on screen size
    const screenHeight = window.innerHeight;
    const isMobile = window.innerWidth <= 768;
    const mapHeight = isMobile ? Math.min(screenHeight * 0.4, 320) : 300;
    
    mapElement.style.height = `${mapHeight}px`;
    mapElement.style.borderRadius = '1rem';
    mapElement.style.overflow = 'hidden';
    
    // Initialize Leaflet map
    evMap = L.map('map').setView([52.2297, 21.0122], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(evMap);
    
    // Initialize marker clustering
    // Mobile-optimized clustering settings
    const clusterRadius = isMobile ? 60 : 50;
    const clusterIconSize = isMobile ? 35 : 40;
    
    markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: clusterRadius,
        disableClusteringAtZoom: isMobile ? 14 : 16,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: !isMobile, // Disable on mobile for performance
        zoomToBoundsOnClick: true,
        iconCreateFunction: function(cluster) {
            const count = cluster.getChildCount();
            return L.divIcon({
                html: `<div class="cluster-marker">${count}</div>`,
                className: 'custom-cluster-icon',
                iconSize: L.point(clusterIconSize, clusterIconSize)
            });
        }
    });
    
    // Add clustering to map
    evMap.addLayer(markerClusterGroup);
    
    // Add charging station markers
    addChargingStationMarkers();
    
    // Add search control
    addSearchControl();
    
    // Add custom controls
    addCustomControls();
    
    // Get user location
    getUserLocation();
    
    // Add map event listeners
    setupMapEvents();
    
    console.log('✅ Leaflet map initialized successfully');
}

// Add charging station markers
function addChargingStationMarkers() {
    chargingStations.forEach(station => {
        const marker = createStationMarker(station);
        markerClusterGroup.addLayer(marker);
    });
}

// Create custom marker for charging station
function createStationMarker(station) {
    const statusColors = {
        available: '#10B981', // Green
        busy: '#F59E0B',      // Yellow
        offline: '#EF4444'    // Red
    };
    
    const networkColors = {
        'Orlen': '#FF6B00',
        'Hubject': '#0066CC', 
        'EIPA': '#8B5CF6',
        'Public': '#6B7280'
    };
    
    const color = statusColors[station.status] || '#6B7280';
    const networkColor = networkColors[station.network] || '#6B7280';
    
    // Custom marker HTML
    const markerHtml = `
        <div class="charging-station-marker" style="
            width: 32px; 
            height: 32px; 
            background-color: ${color}; 
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            position: relative;
        ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                ${station.network === 'Orlen' ? 
                    '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>' :  // Lightning bolt for Orlen
                    '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'    // Lightning bolt for others
                }
            </svg>
            <div style="
                position: absolute;
                bottom: -5px;
                right: -5px;
                width: 12px;
                height: 12px;
                background-color: ${networkColor};
                border: 2px solid white;
                border-radius: 50%;
            "></div>
        </div>
    `;
    
    const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-charging-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });
    
    const marker = L.marker([station.lat, station.lng], { icon: customIcon });
    
    // Create popup content
    const popupContent = createStationPopup(station);
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });
    
    // Store station data in marker
    marker.stationData = station;
    
    return marker;
}

// Create station popup content
function createStationPopup(station) {
    const statusBadge = station.status === 'available' ? 
        `<span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Available</span>` :
        station.status === 'busy' ?
        `<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Busy</span>` :
        `<span class="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Offline</span>`;
    
    const distance = userLocation ? 
        calculateDistance(userLocation.lat, userLocation.lng, station.lat, station.lng) : 'N/A';
    
    return `
        <div class="p-4 min-w-64">
            <div class="flex items-start justify-between mb-3">
                <h3 class="text-lg font-semibold text-gray-900 pr-2">${station.name}</h3>
                ${statusBadge}
            </div>
            
            <div class="space-y-2 mb-4">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Type:</span>
                    <span class="font-medium">${station.type}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Power:</span>
                    <span class="font-medium">${station.power}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Price:</span>
                    <span class="font-medium">${station.price}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Network:</span>
                    <span class="font-medium">${station.network}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Available:</span>
                    <span class="font-medium">${station.available}/${station.total} ports</span>
                </div>
                ${distance !== 'N/A' ? `
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Distance:</span>
                    <span class="font-medium">${distance} km</span>
                </div>
                ` : ''}
            </div>
            
            <div class="text-xs text-gray-500 mb-4">
                📍 ${station.address}
            </div>
            
            <div class="flex space-x-2">
                <button onclick="navigateToStation(${station.id})" 
                        class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    🧭 Navigate
                </button>
                <button onclick="reserveStation(${station.id})" 
                        class="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                    ⚡ Charge
                </button>
            </div>
        </div>
    `;
}

// Get user's current location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Add user location marker
                if (userLocationMarker) {
                    evMap.removeLayer(userLocationMarker);
                }
                
                const userIcon = L.divIcon({
                    html: `<div style="
                        width: 20px;
                        height: 20px;
                        background-color: #EF4444;
                        border: 3px solid white;
                        border-radius: 50%;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7.5V9M15 11.5V16H13V11.5H11V16H9V11.5C9 10.1 10.1 9 11.5 9H13.5C14.9 9 16 10.1 16 11.5M7 16H5V14H7V12H5V10H7V8H5V6H7V4H3V20H7V16Z"/>
                        </svg>
                    </div>`,
                    className: 'user-location-marker',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
                
                userLocationMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                    .addTo(evMap)
                    .bindPopup("📍 Your Location");
                
                // Center map on user location
                evMap.setView([userLocation.lat, userLocation.lng], 13);
                
                console.log('✅ User location found and centered');
            },
            function(error) {
                console.warn('⚠️ Could not get user location:', error.message);
                // Keep default view on Warsaw
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    }
}

// Add search control
function addSearchControl() {
    const geocoder = L.Control.geocoder({
        defaultMarkGeocode: false,
        placeholder: 'Search location...',
        collapsed: false
    })
    .on('markgeocode', function(e) {
        const bbox = e.geocode.bbox;
        const poly = L.polygon([
            bbox.getSouthEast(),
            bbox.getNorthEast(),
            bbox.getNorthWest(),
            bbox.getSouthWest()
        ]).addTo(evMap);
        evMap.fitBounds(poly.getBounds());
    })
    .addTo(evMap);
}

// Add custom controls
function addCustomControls() {
    // Filter control
    const filterControl = L.control({position: 'topright'});
    filterControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
            <a href="#" class="filter-control" title="Filter Stations" style="
                background: white;
                width: 34px;
                height: 34px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                color: #374151;
            ">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                </svg>
            </a>
        `;
        
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.on(div, 'click', function(e) {
            L.DomEvent.preventDefault(e);
            showFilterModal();
        });
        
        return div;
    };
    filterControl.addTo(evMap);
    
    // Center on user control
    const centerControl = L.control({position: 'bottomright'});
    centerControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
            <a href="#" class="center-control" title="Center on my location" style="
                background: white;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                color: #374151;
            ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                </svg>
            </a>
        `;
        
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.on(div, 'click', function(e) {
            L.DomEvent.preventDefault(e);
            centerMapOnUser();
        });
        
        return div;
    };
    centerControl.addTo(evMap);
}

// Setup map events
function setupMapEvents() {
    evMap.on('zoomend', function() {
        const zoom = evMap.getZoom();
        console.log('Map zoom level:', zoom);
    });
}

// Navigation functions
function navigateToStation(stationId) {
    const station = chargingStations.find(s => s.id === stationId);
    if (!station) return;
    
    if (!userLocation) {
        alert('📍 Please allow location access for navigation');
        return;
    }
    
    // Remove existing route
    if (routingControl) {
        evMap.removeControl(routingControl);
    }
    
    // Add routing
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(userLocation.lat, userLocation.lng),
            L.latLng(station.lat, station.lng)
        ],
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim(),
        addWaypoints: false,
        createMarker: function() { return null; } // Don't create default markers
    }).addTo(evMap);
    
    console.log(`🧭 Navigation started to ${station.name}`);
}

function reserveStation(stationId) {
    const station = chargingStations.find(s => s.id === stationId);
    if (!station) return;
    
    if (station.status === 'offline') {
        alert('❌ This station is currently offline');
        return;
    }
    
    if (station.available === 0) {
        alert('⚠️ No charging ports available at this station');
        return;
    }
    
    alert(`⚡ Starting charging session at ${station.name}\n\nCharger: ${station.type} (${station.power})\nPrice: ${station.price}\nNetwork: ${station.network}`);
}

function centerMapOnUser() {
    if (userLocation) {
        evMap.setView([userLocation.lat, userLocation.lng], 15);
    } else {
        getUserLocation();
    }
}

// Global filter state
let activeFilters = {
    networks: [],
    types: [],
    statuses: [],
    distance: null
};

function showFilterModal() {
    const modalContent = `
        <div id="filterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white border-b border-slate-200 p-6 rounded-t-2xl">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <i data-lucide="filter" class="w-6 h-6 text-blue-600"></i>
                            </div>
                            <div>
                                <h2 class="text-2xl font-bold text-slate-900">Filter Stations</h2>
                                <p class="text-slate-600">Customize your charging station search</p>
                            </div>
                        </div>
                        <button onclick="closeModal('filterModal')" class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <i data-lucide="x" class="w-6 h-6 text-slate-500"></i>
                        </button>
                    </div>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- Network Filter -->
                    <div class="space-y-3">
                        <h3 class="text-lg font-semibold text-slate-900">Networks</h3>
                        <div class="grid md:grid-cols-2 gap-2">
                            ${['Public', 'Tesla', 'IONITY', 'Orlen', 'Hubject', 'EIPA', 'ChargePoint', 'EnBW', 'Belib\'', 'GIREVE', 'Total', 'Allego', 'Fastned', 'SMATRICS', 'Wien Energie', 'CEZ', 'PRE', 'Clever', 'Ørsted', 'Vattenfall'].map(network => `
                                <label class="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" value="${network}" onchange="updateNetworkFilter(this)" 
                                           ${activeFilters.networks.includes(network) ? 'checked' : ''}
                                           class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                                    <span class="text-sm text-slate-700">${network}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Type Filter -->
                    <div class="space-y-3">
                        <h3 class="text-lg font-semibold text-slate-900">Charging Types</h3>
                        <div class="grid md:grid-cols-2 gap-2">
                            ${['AC Normal', 'AC Standard', 'AC Fast', 'DC Fast', 'DC Ultra Fast'].map(type => `
                                <label class="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" value="${type}" onchange="updateTypeFilter(this)"
                                           ${activeFilters.types.includes(type) ? 'checked' : ''}
                                           class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                                    <span class="text-sm text-slate-700">${type}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Status Filter -->
                    <div class="space-y-3">
                        <h3 class="text-lg font-semibold text-slate-900">Availability Status</h3>
                        <div class="grid md:grid-cols-2 gap-2">
                            ${['available', 'occupied', 'busy', 'maintenance', 'offline'].map(status => `
                                <label class="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" value="${status}" onchange="updateStatusFilter(this)"
                                           ${activeFilters.statuses.includes(status) ? 'checked' : ''}
                                           class="rounded border-gray-300 text-purple-600 focus:ring-purple-500">
                                    <span class="text-sm text-slate-700 capitalize">${status}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Distance Filter -->
                    <div class="space-y-3">
                        <h3 class="text-lg font-semibold text-slate-900">Maximum Distance</h3>
                        <div class="grid grid-cols-4 gap-2">
                            ${[1, 5, 10, 25].map(dist => `
                                <label class="flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${activeFilters.distance === dist ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 hover:border-slate-300'}">
                                    <input type="radio" name="distance" value="${dist}" onchange="updateDistanceFilter(this)"
                                           ${activeFilters.distance === dist ? 'checked' : ''}
                                           class="sr-only">
                                    <span class="text-sm font-medium">${dist}km</span>
                                </label>
                            `).join('')}
                            <label class="flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${activeFilters.distance === null ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-200 hover:border-slate-300'}">
                                <input type="radio" name="distance" value="" onchange="updateDistanceFilter(this)"
                                       ${activeFilters.distance === null ? 'checked' : ''}
                                       class="sr-only">
                                <span class="text-sm font-medium">All</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 rounded-b-2xl">
                    <div class="flex space-x-3">
                        <button onclick="clearAllFilters()" class="flex-1 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                            Clear All
                        </button>
                        <button onclick="applyFilters(); closeModal('filterModal')" class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalContent);
    lucide.createIcons();
}

function updateNetworkFilter(checkbox) {
    const network = checkbox.value;
    if (checkbox.checked) {
        if (!activeFilters.networks.includes(network)) {
            activeFilters.networks.push(network);
        }
    } else {
        activeFilters.networks = activeFilters.networks.filter(n => n !== network);
    }
}

function updateTypeFilter(checkbox) {
    const type = checkbox.value;
    if (checkbox.checked) {
        if (!activeFilters.types.includes(type)) {
            activeFilters.types.push(type);
        }
    } else {
        activeFilters.types = activeFilters.types.filter(t => t !== type);
    }
}

function updateStatusFilter(checkbox) {
    const status = checkbox.value;
    if (checkbox.checked) {
        if (!activeFilters.statuses.includes(status)) {
            activeFilters.statuses.push(status);
        }
    } else {
        activeFilters.statuses = activeFilters.statuses.filter(s => s !== status);
    }
}

function updateDistanceFilter(radio) {
    activeFilters.distance = radio.value ? parseInt(radio.value) : null;
}

function clearAllFilters() {
    activeFilters = {
        networks: [],
        types: [],
        statuses: [],
        distance: null
    };
    
    // Update UI
    const modal = document.getElementById('filterModal');
    if (modal) {
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        const radios = modal.querySelectorAll('input[type="radio"]');
        radios.forEach(r => r.checked = false);
        
        // Check the "All" distance option
        const allDistanceRadio = modal.querySelector('input[value=""]');
        if (allDistanceRadio) allDistanceRadio.checked = true;
    }
}

function applyFilters() {
    if (!evMap || !markersCluster) return;
    
    // Clear existing markers
    markersCluster.clearLayers();
    
    // Filter stations
    let filteredStations = chargingStations;
    
    // Apply network filter
    if (activeFilters.networks.length > 0) {
        filteredStations = filteredStations.filter(station => 
            activeFilters.networks.includes(station.network)
        );
    }
    
    // Apply type filter
    if (activeFilters.types.length > 0) {
        filteredStations = filteredStations.filter(station => 
            activeFilters.types.includes(station.type)
        );
    }
    
    // Apply status filter
    if (activeFilters.statuses.length > 0) {
        filteredStations = filteredStations.filter(station => 
            activeFilters.statuses.includes(station.status)
        );
    }
    
    // Apply distance filter (if user location is available)
    if (activeFilters.distance && userLocation) {
        filteredStations = filteredStations.filter(station => {
            const distance = calculateDistance(
                userLocation.lat, 
                userLocation.lng, 
                station.lat, 
                station.lng
            );
            return distance <= activeFilters.distance;
        });
    }
    
    // Create markers for filtered stations
    filteredStations.forEach(station => {
        const marker = createStationMarker(station);
        markersCluster.addLayer(marker);
    });
    
    // Update stations list
    updateStationsList(filteredStations);
}

function updateStationsList(stations) {
    const stationsList = document.querySelector('.space-y-4');
    if (!stationsList) return;
    
    if (stations.length === 0) {
        stationsList.innerHTML = `
            <div class="text-center p-8">
                <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="search-x" class="w-8 h-8 text-slate-400"></i>
                </div>
                <h3 class="text-lg font-semibold text-slate-600 mb-2">No stations found</h3>
                <p class="text-slate-500">Try adjusting your filters to see more results</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    stationsList.innerHTML = stations.map(station => {
        const statusColor = getStatusColor(station.status);
        const distance = userLocation ? 
            calculateDistance(userLocation.lat, userLocation.lng, station.lat, station.lng) : 
            null;
        
        return `
            <div class="bg-white border border-slate-200 rounded-xl p-4">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <h3 class="font-semibold text-slate-900 mb-1">${station.name}</h3>
                        <p class="text-sm text-slate-600 mb-2">${station.address}</p>
                        ${distance ? `<p class="text-xs text-slate-500">${distance} km away</p>` : ''}
                    </div>
                    <div class="flex flex-col items-end space-y-1">
                        <div class="inline-flex items-center px-2 py-1 rounded-full ${statusColor.bg} ${statusColor.text} text-xs font-medium">
                            <div class="w-2 h-2 ${statusColor.dot} rounded-full mr-1"></div>
                            ${station.status}
                        </div>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-4 text-sm">
                    <div>
                        <p class="text-slate-500">Type</p>
                        <p class="font-medium text-slate-900">${station.type}</p>
                    </div>
                    <div>
                        <p class="text-slate-500">Power</p>
                        <p class="font-medium text-slate-900">${station.power}</p>
                    </div>
                    <div>
                        <p class="text-slate-500">Price</p>
                        <p class="font-medium text-slate-900">${station.price}</p>
                    </div>
                </div>
                
                <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div class="text-sm">
                        <span class="font-medium ${station.available > 0 ? 'text-emerald-600' : 'text-red-600'}">${station.available}</span>
                        <span class="text-slate-500">/${station.total} available</span>
                    </div>
                    <button onclick="navigateToStation(${station.lat}, ${station.lng})" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Navigate
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

// Helper function to get status color classes
function getStatusColor(status) {
    switch (status) {
        case 'available':
            return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' };
        case 'occupied':
        case 'busy':
            return { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' };
        case 'maintenance':
            return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
        case 'offline':
            return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
        default:
            return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' };
    }
}

// Utility function to calculate distance
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c;
    return Math.round(d * 10) / 10; // Round to 1 decimal
}


// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    populateStationsList();
    
    // Initialize enhanced interactive map
    initializeEnhancedMap();
    
    // Handle window resize for mobile responsiveness
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (evMap) {
                // Update map height on resize
                const mapElement = document.getElementById('map');
                if (mapElement) {
                    const isMobile = window.innerWidth <= 768;
                    const screenHeight = window.innerHeight;
                    const mapHeight = isMobile ? Math.min(screenHeight * 0.4, 320) : 300;
                    mapElement.style.height = `${mapHeight}px`;
                    
                    // Invalidate size to refresh map
                    evMap.invalidateSize();
                }
            }
        }, 250); // Debounce resize events
    });
});