// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1151-t0RDGn1bz0GwMr4Uv0uA4E6bnoo",
  authDomain: "techspecialist-careers.firebaseapp.com",
  projectId: "techspecialist-careers",
  storageBucket: "techspecialist-careers.firebasestorage.app",
  messagingSenderId: "68286942864",
  appId: "1:68286942864:web:06748d637d7422f0ccd215"
};

let jobs = [];

function getJobById(id) {
  return jobs.find(job => job.id === id);
}

function filterJobs(searchTerm = '', department = '', location = '') {
  return jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = department === '' || job.department === department;
    const matchesLocation = location === '' || job.location === location;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });
}

function renderJobRow(job) {
  const postedDate = job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently';
  return `
    <a href="/apply?id=${job.id}" class="job-row">
      <div class="job-info">
        <h3 class="job-title">${job.title}</h3>
        <p class="job-description">${job.description || ''}</p>
      </div>
      <div class="job-meta">
        <span class="job-tag">${job.department}</span>
        <span class="job-tag">${job.location}</span>
        <span class="job-tag type-${(job.type || 'full-time').toLowerCase().replace(' ', '-')}">${job.type || 'Full-time'}</span>
      </div>
      <div class="job-arrow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </a>
  `;
}

function renderJobs(filteredJobs) {
  const container = document.getElementById('job-listings');
  const countEl = document.getElementById('job-count');
  
  if (!container) return;
  
  countEl.textContent = filteredJobs.length;
  
  if (filteredJobs.length === 0) {
    container.innerHTML = `
      <div class="no-jobs">
        <p>No positions match your criteria</p>
        <button class="reset-btn" onclick="resetFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filteredJobs.map(renderJobRow).join('');
}

function handleSearch(e) {
  const searchTerm = e.target.value;
  const department = document.getElementById('department-filter')?.value || '';
  const location = document.getElementById('location-filter')?.value || '';
  applyFilters(searchTerm, department, location);
}

function handleDepartmentChange(e) {
  const department = e.target.value;
  const searchTerm = document.getElementById('search-input')?.value || '';
  const location = document.getElementById('location-filter')?.value || '';
  applyFilters(searchTerm, department, location);
}

function handleLocationChange(e) {
  const location = e.target.value;
  const searchTerm = document.getElementById('search-input')?.value || '';
  const department = document.getElementById('department-filter')?.value || '';
  applyFilters(searchTerm, department, location);
}

function applyFilters(searchTerm, department, location) {
  const filtered = filterJobs(searchTerm, department, location);
  renderJobs(filtered);
}

function resetFilters() {
  const searchInput = document.getElementById('search-input');
  const departmentFilter = document.getElementById('department-filter');
  const locationFilter = document.getElementById('location-filter');
  
  if (searchInput) searchInput.value = '';
  if (departmentFilter) departmentFilter.value = '';
  if (locationFilter) locationFilter.value = '';
  
  renderJobs(jobs);
}

function populateFilters() {
  const departmentSelect = document.getElementById('department-filter');
  const locationSelect = document.getElementById('location-filter');
  const departments = [...new Set(jobs.map(job => job.department))].sort();
  const locations = [...new Set(jobs.map(job => job.location))].sort();
  
  if (departmentSelect) {
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept;
      option.textContent = dept;
      departmentSelect.appendChild(option);
    });
  }
  
  if (locationSelect) {
    locations.forEach(loc => {
      const option = document.createElement('option');
      option.value = loc;
      option.textContent = loc;
      locationSelect.appendChild(option);
    });
  }
}

// Load jobs from Firestore
async function loadJobsFromFirestore() {
  try {
    // Dynamic import for Firebase
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js');
    const { getFirestore, collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Fetch only active jobs
    const q = query(collection(db, 'jobs'), where('status', '==', 'active'));
    const snapshot = await getDocs(q);
    
    jobs = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    // Also fetch jobs without status field (for backwards compatibility)
    const allDocs = await getDocs(collection(db, 'jobs'));
    allDocs.docs.forEach(d => {
      const data = d.data();
      if (!data.status || data.status === 'active') {
        if (!jobs.find(j => j.id === d.id)) {
          jobs.push({ id: d.id, ...data });
        }
      }
    });

  } catch (error) {
    console.error('Error loading jobs from Firestore:', error);
    // Fallback to empty array if Firebase fails
    jobs = [];
  }
}

// Update stats on page
function updateStats() {
  const activeJobs = jobs.filter(j => j.status !== 'closed');
  const departments = [...new Set(activeJobs.map(job => job.department).filter(Boolean))];
  const locations = [...new Set(activeJobs.map(job => job.location).filter(Boolean))];
  
  document.getElementById('stat-positions').textContent = activeJobs.length;
  document.getElementById('stat-departments').textContent = departments.length;
  document.getElementById('stat-locations').textContent = locations.length;
}

document.addEventListener('DOMContentLoaded', async () => {
  // Show loading state
  const container = document.getElementById('job-listings');
  if (container) {
    container.innerHTML = '<div class="no-jobs"><p>Loading positions...</p></div>';
  }

  await loadJobsFromFirestore();
  populateFilters();
  renderJobs(jobs);
  updateStats();
  
  const searchInput = document.getElementById('search-input');
  const departmentFilter = document.getElementById('department-filter');
  const locationFilter = document.getElementById('location-filter');
  const resetBtn = document.getElementById('reset-btn');
  
  if (searchInput) searchInput.addEventListener('input', handleSearch);
  if (departmentFilter) departmentFilter.addEventListener('change', handleDepartmentChange);
  if (locationFilter) locationFilter.addEventListener('change', handleLocationChange);
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);
});