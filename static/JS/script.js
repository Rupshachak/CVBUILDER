// Resume Live Preview JavaScript with Step Navigation
// Enhanced for professional resume templates

// ========================================
// STEP NAVIGATION VARIABLES
// ========================================
let currentStep = 1;
const totalSteps = 5;

// Step descriptions and titles for each form section
const stepTitles = {
  1: "Personal Information",
  2: "Contact Details",
  3: "Education",
  4: "Work Experience",
  5: "Skills & Expertise"
};

const stepDescriptions = {
  1: "Let's start with your personal information",
  2: "How can employers reach you?",
  3: "Tell us about your educational background",
  4: "Share your work experience",
  5: "What are your key skills?"
};

// ========================================
// STEP NAVIGATION FUNCTIONS
// ========================================

/**
 * Change to next or previous step
 * @param {number} direction - 1 for next, -1 for previous
 */
function changeStep(direction) {
  const newStep = currentStep + direction;
  
  // Validate step range
  if (newStep < 1 || newStep > totalSteps) return;
  
  // Hide current step
  const currentStepEl = document.getElementById(`form-step-${currentStep}`);
  if (currentStepEl) {
    currentStepEl.classList.add('hidden');
  }
  
  // Show new step
  currentStep = newStep;
  const newStepEl = document.getElementById(`form-step-${currentStep}`);
  if (newStepEl) {
    newStepEl.classList.remove('hidden');
  }
  
  // Update UI elements
  updateProgressIndicator();
  updateStepDescription();
  updateNavigationButtons();
  
  // Scroll to top of form for better UX
  const form = document.getElementById('resumeForm');
  if (form) {
    form.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

/**
 * Update the progress indicator (circles and lines)
 */
function updateProgressIndicator() {
  // Update step number and percentage text
  const currentStepEl = document.getElementById('currentStep');
  const progressPercentEl = document.getElementById('progressPercent');
  const progressBar = document.getElementById('progressBar');
  
  if (currentStepEl) currentStepEl.textContent = currentStep;
  
  const percentage = Math.round((currentStep / totalSteps) * 100);
  if (progressPercentEl) progressPercentEl.textContent = percentage;
  if (progressBar) progressBar.style.width = percentage + '%';
  
  // Update step labels
  for (let i = 1; i <= totalSteps; i++) {
    const label = document.getElementById(`label-${i}`);
    if (!label) continue;
    
    if (i < currentStep) {
      label.classList.remove('text-gray-400', 'text-blue-600');
      label.classList.add('text-green-600', 'font-medium');
    } else if (i === currentStep) {
      label.classList.remove('text-gray-400', 'text-green-600');
      label.classList.add('text-blue-600', 'font-medium');
    } else {
      label.classList.remove('text-blue-600', 'text-green-600', 'font-medium');
      label.classList.add('text-gray-400');
    }
  }
}

/**
 * Update the step description text
 */
function updateStepDescription() {
  const descEl = document.getElementById('stepDescription');
  const titleEl = document.getElementById('stepTitle');
  
  if (descEl && stepDescriptions[currentStep]) {
    descEl.textContent = stepDescriptions[currentStep];
  }
  
  if (titleEl && stepTitles[currentStep]) {
    titleEl.textContent = stepTitles[currentStep];
  }
}

/**
 * Update navigation button states
 */
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  
  // Disable Previous button on first step
  if (prevBtn) {
    prevBtn.disabled = currentStep === 1;
  }
  
  // Show Submit button on last step, Next button otherwise
  if (nextBtn && submitBtn) {
    if (currentStep === totalSteps) {
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    }
  }
}

// ========================================
// LIVE PREVIEW FUNCTIONS
// ========================================

/**
 * Update the live preview with current form data
 * Called on every input change
 */
function updatePreview() {
  updatePreviewName();
  updatePreviewTitle();
  updatePreviewContact();
  updatePreviewEducation();
  updatePreviewExperience();
  updatePreviewSkills();
}

/**
 * Update name in preview header
 */
function updatePreviewName() {
  const nameInput = document.getElementById('name');
  if (!nameInput) return;
  
  const name = nameInput.value.trim() || 'YOUR NAME';
  const previewName = document.getElementById(`previewName-${templateStyle}`);
  if (previewName) {
    previewName.textContent = name.toUpperCase();
  }
}

/**
 * Update professional title in preview header
 */
function updatePreviewTitle() {
  const titleInput = document.getElementById('title');
  if (!titleInput) return;
  
  const title = titleInput.value.trim();
  const previewTitle = document.getElementById(`previewTitle-${templateStyle}`);
  if (previewTitle) {
    previewTitle.textContent = title;
    // Show/hide based on whether title is entered
    previewTitle.style.display = title ? 'block' : 'none';
  }
}

/**
 * Update contact information in preview header
 */
function updatePreviewContact() {
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phone');
  const locationInput = document.getElementById('location');
  const linkedinInput = document.getElementById('linkedin');
  
  const email = emailInput?.value.trim() || 'email@example.com';
  const phone = phoneInput?.value.trim() || '(555) 123-4567';
  const location = locationInput?.value.trim() || '';
  const linkedin = linkedinInput?.value.trim() || '';
  
  // Update based on template style
  if (templateStyle === 'creative') {
    // Creative template has separate fields in sidebar
    const previewEmail = document.getElementById(`previewEmail-${templateStyle}`);
    const previewPhone = document.getElementById(`previewPhone-${templateStyle}`);
    const previewLocation = document.getElementById(`previewLocation-${templateStyle}`);
    const previewLinkedIn = document.getElementById(`previewLinkedIn-${templateStyle}`);
    
    if (previewEmail) previewEmail.textContent = email;
    if (previewPhone) previewPhone.textContent = phone;
    if (previewLocation) {
      previewLocation.textContent = location;
      previewLocation.style.display = location ? 'block' : 'none';
    }
    if (previewLinkedIn) {
      previewLinkedIn.textContent = linkedin;
      previewLinkedIn.style.display = linkedin ? 'block' : 'none';
    }
  } else {
    // Modern and Simple templates have inline contact
    const previewContact = document.getElementById(`previewContact-${templateStyle}`);
    if (previewContact) {
      let contactParts = [email, phone];
      if (location) contactParts.push(location);
      if (linkedin) contactParts.push(linkedin);
      previewContact.innerHTML = contactParts.join(' <span class="mx-2">|</span> ');
    }
  }
}

/**
 * Update education section in preview
 */
function updatePreviewEducation() {
  const educationList = document.getElementById(`educationList-${templateStyle}`);
  if (!educationList) return;
  
  educationList.innerHTML = '';
  
  // Get all education degree fields
  const degreeFields = document.querySelectorAll('input[name="education_degree[]"]');
  const schoolFields = document.querySelectorAll('input[name="education_school[]"]');
  const yearFields = document.querySelectorAll('input[name="education_year[]"]');
  
  let hasEducation = false;
  
  for (let i = 0; i < degreeFields.length; i++) {
    const degree = degreeFields[i]?.value.trim();
    const school = schoolFields[i]?.value.trim();
    const year = yearFields[i]?.value.trim();
    
    if (degree || school || year) {
      hasEducation = true;
      
      const educationItem = document.createElement('div');
      educationItem.className = 'education-item mb-4';
      
      // Create education entry based on template style
      if (degree) {
        const degreeEl = document.createElement('div');
        degreeEl.className = templateStyle === 'modern' ? 'job-title text-gray-900' : 
                           templateStyle === 'creative' ? 'job-title' : 'job-title';
        degreeEl.textContent = degree;
        educationItem.appendChild(degreeEl);
      }
      
      if (school || year) {
        const schoolEl = document.createElement('div');
        schoolEl.className = templateStyle === 'modern' ? 'company-name text-gray-600' : 
                           templateStyle === 'creative' ? 'company-name' : 'company-name';
        
        let schoolText = school;
        if (year) {
          schoolText += schoolText ? ` • ${year}` : year;
        }
        schoolEl.textContent = schoolText;
        educationItem.appendChild(schoolEl);
      }
      
      educationList.appendChild(educationItem);
    }
  }
  
  // Show placeholder if no education entered
  if (!hasEducation) {
    educationList.innerHTML = '<p class="text-gray-400 italic text-sm">Your education details will appear here...</p>';
  }
}

/**
 * Update experience section in preview
 */
function updatePreviewExperience() {
  const experienceList = document.getElementById(`experienceList-${templateStyle}`);
  if (!experienceList) return;
  
  experienceList.innerHTML = '';
  
  // Get all experience fields
  const titleFields = document.querySelectorAll('input[name="experience_title[]"]');
  const companyFields = document.querySelectorAll('input[name="experience_company[]"]');
  const dateFields = document.querySelectorAll('input[name="experience_date[]"]');
  const descriptionFields = document.querySelectorAll('textarea[name="experience_description[]"]');
  
  let hasExperience = false;
  
  for (let i = 0; i < titleFields.length; i++) {
    const title = titleFields[i]?.value.trim();
    const company = companyFields[i]?.value.trim();
    const date = dateFields[i]?.value.trim();
    const description = descriptionFields[i]?.value.trim();
    
    if (title || company || date || description) {
      hasExperience = true;
      
      const experienceItem = document.createElement('div');
      experienceItem.className = 'experience-item mb-4';
      
      // Job title and date in a row
      if (title || date) {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'flex justify-between items-start mb-1';
        
        if (title) {
          const titleEl = document.createElement('div');
          titleEl.className = 'job-title';
          titleEl.textContent = title;
          headerDiv.appendChild(titleEl);
        }
        
        if (date) {
          const dateEl = document.createElement('div');
          dateEl.className = 'date-range';
          dateEl.textContent = date;
          headerDiv.appendChild(dateEl);
        }
        
        experienceItem.appendChild(headerDiv);
      }
      
      // Company name
      if (company) {
        const companyEl = document.createElement('div');
        companyEl.className = 'company-name mb-2';
        companyEl.textContent = company;
        experienceItem.appendChild(companyEl);
      }
      
      // Description with bullet points
      if (description) {
        const lines = description.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          const bulletEl = document.createElement('div');
          bulletEl.className = 'bullet-point';
          // Remove existing bullet if present
          const cleanLine = line.replace(/^[•\-\*]\s*/, '');
          bulletEl.textContent = cleanLine;
          experienceItem.appendChild(bulletEl);
        });
      }
      
      experienceList.appendChild(experienceItem);
    }
  }
  
  // Show placeholder if no experience entered
  if (!hasExperience) {
    experienceList.innerHTML = '<p class="text-gray-400 italic text-sm">Your work experience will appear here...</p>';
  }
}

/**
 * Update skills section in preview
 */
function updatePreviewSkills() {
  const skillsList = document.getElementById(`skillsList-${templateStyle}`);
  if (!skillsList) return;
  
  skillsList.innerHTML = '';
  
  const skillsFields = document.querySelectorAll('input[name="skills[]"]');
  
  let allSkills = [];
  skillsFields.forEach(field => {
    if (field.value.trim()) {
      // Split by comma and trim each skill
      const skills = field.value.split(',').map(s => s.trim()).filter(s => s);
      allSkills = allSkills.concat(skills);
    }
  });
  
  if (allSkills.length > 0) {
    if (templateStyle === 'creative') {
      // Creative template shows skills in sidebar with bullets
      allSkills.forEach(skill => {
        const skillEl = document.createElement('div');
        skillEl.className = 'text-sm mb-1';
        skillEl.textContent = `• ${skill}`;
        skillsList.appendChild(skillEl);
      });
    } else {
      // Modern and Simple templates show skills inline
      const skillsContainer = document.createElement('div');
      skillsContainer.className = 'flex flex-wrap gap-2';
      
      allSkills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill;
        skillsContainer.appendChild(skillTag);
      });
      
      skillsList.appendChild(skillsContainer);
    }
  } else {
    skillsList.innerHTML = '<p class="text-gray-400 italic text-sm">Your skills will appear here...</p>';
  }
}

// ========================================
// DYNAMIC FIELD FUNCTIONS
// ========================================

/**
 * Add a new education entry
 */
function addEducationField() {
  const section = document.getElementById('education-section');
  if (!section) return;
  
  const wrapper = document.createElement('div');
  wrapper.className = "border rounded-lg p-4 bg-gray-50 relative";
  
  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'space-y-3';
  
  // Degree field
  const degreeInput = document.createElement('input');
  degreeInput.name = 'education_degree[]';
  degreeInput.type = 'text';
  degreeInput.placeholder = 'Degree (e.g., Master of Business Administration)';
  degreeInput.className = 'w-full p-2 border rounded focus:ring-2 focus:ring-green-400 education-field';
  degreeInput.addEventListener('input', updatePreview);
  
  // School field
  const schoolInput = document.createElement('input');
  schoolInput.name = 'education_school[]';
  schoolInput.type = 'text';
  schoolInput.placeholder = 'School/University Name';
  schoolInput.className = 'w-full p-2 border rounded focus:ring-2 focus:ring-green-400 education-field';
  schoolInput.addEventListener('input', updatePreview);
  
  // Year field
  const yearInput = document.createElement('input');
  yearInput.name = 'education_year[]';
  yearInput.type = 'text';
  yearInput.placeholder = 'Year (e.g., 2024 or 2020-2024)';
  yearInput.className = 'w-full p-2 border rounded focus:ring-2 focus:ring-green-400 education-field';
  yearInput.addEventListener('input', updatePreview);
  
  // Delete button
  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.innerHTML = '✖';
  delBtn.className = 'absolute top-2 right-2 text-red-500 hover:text-red-700 font-semibold';
  delBtn.onclick = () => {
    wrapper.remove();
    updatePreview();
  };
  
  fieldsContainer.appendChild(degreeInput);
  fieldsContainer.appendChild(schoolInput);
  fieldsContainer.appendChild(yearInput);
  
  wrapper.appendChild(delBtn);
  wrapper.appendChild(fieldsContainer);
  section.appendChild(wrapper);
}

/**
 * Add a new experience entry
 */
function addExperienceField() {
  const section = document.getElementById('experience-section');
  if (!section) return;
  
  const wrapper = document.createElement('div');
  wrapper.className = "border rounded-lg p-4 bg-gray-50 relative";
  
  const fieldsContainer = document.createElement('div');
  fieldsContainer.className = 'space-y-3';
  
  // Job title field
  const titleInput = document.createElement('input');
  titleInput.name = 'experience_title[]';
  titleInput.type = 'text';
  titleInput.placeholder = 'Job Title (e.g., Marketing Manager)';
  titleInput.className = 'w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400 experience-field';
  titleInput.addEventListener('input', updatePreview);
  
  // Company field
  const companyInput = document.createElement('input');
  companyInput.name = 'experience_company[]';
  companyInput.type = 'text';
  companyInput.placeholder = 'Company Name';
  companyInput.className = 'w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400 experience-field';
  companyInput.addEventListener('input', updatePreview);
  
  // Date field
  const dateInput = document.createElement('input');
  dateInput.name = 'experience_date[]';
  dateInput.type = 'text';
  dateInput.placeholder = 'Date Range (e.g., Jan 2022 - Present)';
  dateInput.className = 'w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400 experience-field';
  dateInput.addEventListener('input', updatePreview);
  
  // Description field
  const descriptionInput = document.createElement('textarea');
  descriptionInput.name = 'experience_description[]';
  descriptionInput.rows = 4;
  descriptionInput.placeholder = 'Key achievements and responsibilities (one per line):\nIncreased sales by 50%\nLed team of 8 professionals\nImplemented new marketing strategy';
  descriptionInput.className = 'w-full p-2 border rounded focus:ring-2 focus:ring-yellow-400 experience-field';
  descriptionInput.addEventListener('input', updatePreview);
  
  // Delete button
  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.innerHTML = '✖';
  delBtn.className = 'absolute top-2 right-2 text-red-500 hover:text-red-700 font-semibold';
  delBtn.onclick = () => {
    wrapper.remove();
    updatePreview();
  };
  
  fieldsContainer.appendChild(titleInput);
  fieldsContainer.appendChild(companyInput);
  fieldsContainer.appendChild(dateInput);
  fieldsContainer.appendChild(descriptionInput);
  
  wrapper.appendChild(delBtn);
  wrapper.appendChild(fieldsContainer);
  section.appendChild(wrapper);
}

/**
 * Add a new skill field
 */
function addSkillField() {
  const section = document.getElementById('skills-section');
  if (!section) return;
  
  const wrapper = document.createElement('div');
  wrapper.className = "flex items-center gap-2";
  
  const skillInput = document.createElement('input');
  skillInput.name = 'skills[]';
  skillInput.type = 'text';
  skillInput.placeholder = 'e.g., Leadership, Data Analysis, Public Speaking';
  skillInput.className = 'w-full p-3 border rounded focus:ring-2 focus:ring-purple-400 skills-field';
  skillInput.addEventListener('input', updatePreview);
  
  const delBtn = document.createElement('button');
  delBtn.type = 'button';
  delBtn.innerHTML = '✖';
  delBtn.className = 'text-red-500 hover:text-red-700 font-semibold';
  delBtn.onclick = () => {
    wrapper.remove();
    updatePreview();
  };
  
  wrapper.appendChild(skillInput);
  wrapper.appendChild(delBtn);
  section.appendChild(wrapper);
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================

function setupEventListeners() {
  // Navigation buttons
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => changeStep(-1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => changeStep(1));
  }
  
  // Add field buttons
  const addEducationBtn = document.getElementById('add-education');
  if (addEducationBtn) {
    addEducationBtn.addEventListener('click', addEducationField);
  }
  
  const addExperienceBtn = document.getElementById('add-experience');
  if (addExperienceBtn) {
    addExperienceBtn.addEventListener('click', addExperienceField);
  }
  
  const addSkillBtn = document.getElementById('add-skill');
  if (addSkillBtn) {
    addSkillBtn.addEventListener('click', addSkillField);
  }
  
  // Attach input listeners to all form fields
  const nameInput = document.getElementById('name');
  const titleInput = document.getElementById('title');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phone');
  const locationInput = document.getElementById('location');
  const linkedinInput = document.getElementById('linkedin');
  
  if (nameInput) nameInput.addEventListener('input', updatePreview);
  if (titleInput) titleInput.addEventListener('input', updatePreview);
  if (emailInput) emailInput.addEventListener('input', updatePreview);
  if (phoneInput) phoneInput.addEventListener('input', updatePreview);
  if (locationInput) locationInput.addEventListener('input', updatePreview);
  if (linkedinInput) linkedinInput.addEventListener('input', updatePreview);
  
  // Attach to initial fields
  document.querySelectorAll('.education-field').forEach(field => {
    field.addEventListener('input', updatePreview);
  });
  document.querySelectorAll('.experience-field').forEach(field => {
    field.addEventListener('input', updatePreview);
  });
  document.querySelectorAll('.skills-field').forEach(field => {
    field.addEventListener('input', updatePreview);
  });
  
  // Keyboard navigation - Press Enter to go to next step
  document.addEventListener('keydown', (e) => {
    // Only trigger on Enter, not in textarea, and not on last step
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && currentStep < totalSteps) {
      e.preventDefault();
      changeStep(1);
    }
  });
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('Professional Resume Form Initialized');
  console.log('Template Style:', templateStyle);
  setupEventListeners();
  updateProgressIndicator();
  updateNavigationButtons();
  updatePreview();
}