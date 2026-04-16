const jobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    department: "Engineering",
    location: "On-site",
    type: "Full-time",
    description: "Lead the development of scalable microservices architecture and mentor junior developers in modern development practices.",
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "UI/UX Designer",
    department: "Design",
    location: "On-site",
    type: "Full-time",
    description: "Create intuitive user experiences and beautiful interfaces for enterprise software solutions.",
    posted: "1 week ago"
  },
  {
    id: 3,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "On-site",
    type: "Full-time",
    description: "Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure 99.9% uptime for production systems.",
    posted: "3 days ago"
  }
];

const departments = [...new Set(jobs.map(job => job.department))].sort();
const locations = [...new Set(jobs.map(job => job.location))].sort();

function getJobById(id) {
  return jobs.find(job => job.id === parseInt(id));
}

function filterJobs(searchTerm = '', department = '', location = '') {
  return jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = department === '' || job.department === department;
    const matchesLocation = location === '' || job.location === location;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });
}

function renderJobRow(job) {
  return `
    <a href="/careers/${job.id}" class="job-row">
      <div class="job-info">
        <h3 class="job-title">${job.title}</h3>
        <p class="job-description">${job.description}</p>
      </div>
      <div class="job-meta">
        <span class="job-tag">${job.department}</span>
        <span class="job-tag">${job.location}</span>
        <span class="job-tag type-${job.type.toLowerCase().replace(' ', '-')}">${job.type}</span>
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

document.addEventListener('DOMContentLoaded', () => {
  populateFilters();
  renderJobs(jobs);
  
  const searchInput = document.getElementById('search-input');
  const departmentFilter = document.getElementById('department-filter');
  const locationFilter = document.getElementById('location-filter');
  const resetBtn = document.getElementById('reset-btn');
  
  if (searchInput) searchInput.addEventListener('input', handleSearch);
  if (departmentFilter) departmentFilter.addEventListener('change', handleDepartmentChange);
  if (locationFilter) locationFilter.addEventListener('change', handleLocationChange);
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);
});
