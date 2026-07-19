// Load and render the page content from JSON
async function loadContent() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderPage(data);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function renderPage(data) {
    // Update meta tags
    document.title = data.meta.title;
    document.querySelector('meta[name="description"]').content = data.meta.description;

    // Render header
    renderHeader(data.header);

    // Render about me section
    renderAboutMe(data.aboutMe);

    // Render core expertise
    renderCoreExpertise(data.coreExpertise);

    // Render featured project
    renderFeaturedProject(data.featuredProject);

    // Render leadership & community
    renderLeadershipCommunity(data.leadershipCommunity);

    // Render talks & keynotes
    renderTalksKeynotes(data.talksKeynotes);

    // Render professional timeline
    renderProfessionalTimeline(data.professionalTimeline);

    // Render personal facts
    renderPersonalFacts(data.personalFacts);

    // Render impressions
    renderImpressions(data.impressions);

    // Render footer
    renderFooter(data.contact, data.footer);
}

function renderHeader(header) {
    const headerEl = document.getElementById('header-content');
    headerEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 3rem; flex-wrap: wrap; margin-bottom: 2rem;">
            <img src="${header.image.src}" alt="${header.image.alt}" 
                 style="width: ${header.image.width}; height: ${header.image.height}; border-radius: ${header.image.borderRadius}; object-fit: cover; border: 3px solid white;">
            <div style="flex: 1; min-width: 300px;">
                <h1 style="margin-bottom: 0.5rem;">${header.name}</h1>
                <p class="subtitle">${header.subtitle}</p>
            </div>
        </div>
        <p style="font-size: 1.1rem; line-height: 1.7; color: var(--gray-light);">
            ${header.introduction}
        </p>
    `;
}

function renderAboutMe(aboutMe) {
    const aboutMeEl = document.getElementById('about-me-content');
    aboutMeEl.innerHTML = aboutMe.paragraphs.map(p => `<p>${p}</p>`).join('');
}

function renderCoreExpertise(expertise) {
    const expertiseEl = document.getElementById('core-expertise-content');
    
    const cards = [
        { key: 'appliedCryptography', data: expertise.appliedCryptography },
        { key: 'industrialSecurity', data: expertise.industrialSecurity },
        { key: 'iotConnectivity', data: expertise.iotConnectivity },
        { key: 'softwareEngineering', data: expertise.softwareEngineering }
    ];

    expertiseEl.innerHTML = cards.map(({ data }) => `
        <div class="card">
            <h3>${data.title}</h3>
            <ul>
                ${data.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

function renderFeaturedProject(project) {
    const projectEl = document.getElementById('featured-project-content');
    projectEl.innerHTML = `
        <h3 style="color: var(--black); border-bottom: 3px solid var(--black); padding-bottom: 0.75rem; margin-bottom: 1.5rem; font-size: 2rem;">
            ${project.title}
        </h3>
        <p style="color: var(--gray-dark); font-size: 1.1rem; line-height: 1.7; margin-bottom: 1.5rem;">
            ${project.description.replace(/Trustpoint/g, '<strong><a href="' + project.githubUrl + '" target="_blank" style="color: var(--black); border-bottom: 2px solid var(--black);">Trustpoint</a></strong>')}
        </p>
        <img src="${project.image.src}" alt="${project.image.alt}" 
             style="width: 100%; max-width: 1000px; margin: 2rem auto; display: block;">
        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 2rem;">
            ${project.links.map((link, index) => `
                <a href="${link.url}" target="_blank" 
                   style="display: inline-block; padding: 12px 24px; 
                          background: ${index === 0 ? 'var(--black)' : 'transparent'}; 
                          color: ${index === 0 ? 'var(--white)' : 'var(--black)'}; 
                          font-weight: 600; border: 2px solid var(--black); text-decoration: none;">
                    ${link.text}
                </a>
            `).join('')}
        </div>
    `;
}

function renderLeadershipCommunity(leadership) {
    const leadershipEl = document.getElementById('leadership-community-content');
    
    const sections = [
        { data: leadership.technicalLeadership, hasLink: false },
        { data: leadership.teachingPublicSpeaking, hasLink: true, linkUrl: leadership.trainingPdf },
        { data: leadership.communityEvents, hasLink: false }
    ];

    leadershipEl.innerHTML = sections.map(({ data, hasLink, linkUrl }) => {
        let itemsHtml = data.items.map(item => {
            if (hasLink && item.includes('📄 Applied Cryptography Training')) {
                return `<li>Industrial security trainings & workshops (<a href="${linkUrl}" target="_blank">📄 Applied Cryptography Training</a>)</li>`;
            }
            return `<li>${item}</li>`;
        }).join('');

        return `
            <div class="card">
                <h3>${data.title}</h3>
                <ul>${itemsHtml}</ul>
            </div>
        `;
    }).join('');
}

function renderTalksKeynotes(talks) {
    const talksEl = document.getElementById('talks-keynotes-content');
    talksEl.innerHTML = `
        <ul>
            ${talks.map(talk => `
                <li><strong>${talk.title}</strong> — ${talk.event}, ${talk.date}</li>
            `).join('')}
        </ul>
    `;
}

function renderProfessionalTimeline(timeline) {
    const timelineEl = document.getElementById('professional-timeline-content');
    
    const workExperienceHtml = timeline.workExperience.map(job => `
        <div style="margin-bottom: 2.5rem; position: relative;">
            <div style="position: absolute; left: -2.4rem; top: 0.3rem; width: 1rem; height: 1rem; background: var(--black); border-radius: 50%;"></div>
            <p style="margin: 0; color: var(--gray-medium); font-size: 0.9rem;">${job.period}</p>
            <h4 style="margin: 0.5rem 0; font-size: 1.3rem;">${job.position}</h4>
            <p style="margin: 0.25rem 0; color: var(--gray-dark);">${job.company}</p>
        </div>
    `).join('');

    const educationHtml = timeline.education.map(edu => `
        <div style="margin-bottom: 2.5rem; position: relative;">
            <div style="position: absolute; left: -2.4rem; top: 0.3rem; width: 1rem; height: 1rem; background: var(--black); border-radius: 50%;"></div>
            <p style="margin: 0; color: var(--gray-medium); font-size: 0.9rem;">${edu.period}</p>
            <h4 style="margin: 0.5rem 0; font-size: 1.3rem;">${edu.degree}</h4>
            <p style="margin: 0.25rem 0; color: var(--gray-dark);">${edu.institution}</p>
        </div>
    `).join('');

    timelineEl.innerHTML = `
        <h3 style="color: var(--black); margin-top: 2rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--black); padding-bottom: 0.5rem;">Work Experience</h3>
        <div style="border-left: 3px solid var(--black); padding-left: 2rem; margin-left: 1rem;">
            ${workExperienceHtml}
        </div>
        <h3 style="color: var(--black); margin-top: 3rem; margin-bottom: 1.5rem; border-bottom: 2px solid var(--black); padding-bottom: 0.5rem;">Education</h3>
        <div style="border-left: 3px solid var(--black); padding-left: 2rem; margin-left: 1rem;">
            ${educationHtml}
        </div>
    `;
}

function renderPersonalFacts(facts) {
    const factsEl = document.getElementById('personal-facts-content');
    factsEl.innerHTML = `
        <ul>
            ${facts.map(fact => `<li>${fact}</li>`).join('')}
        </ul>
    `;
}

function renderImpressions(impressions) {
    const impressionsEl = document.getElementById('impressions-content');
    impressionsEl.innerHTML = impressions.map(img => `
        <div style="border: 3px solid var(--black); overflow: hidden; aspect-ratio: 4/3;">
            <img src="${img.src}" alt="${img.alt}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
    `).join('');
}

function renderFooter(contact, footer) {
    const footerEl = document.getElementById('footer-content');
    footerEl.innerHTML = `
        <p style="text-align: left; max-width: 600px; margin: 0 auto 2rem;">
            <strong>Phone:</strong> <a href="${contact.phoneUrl}">${contact.phone}</a><br>
            <strong>Email:</strong> <a href="${contact.emailUrl}">${contact.email}</a><br>
            <strong>LinkedIn:</strong> <a href="${contact.linkedinUrl}" target="_blank">${contact.linkedin}</a>
        </p>
        <hr style="border: none; border-top: 1px solid var(--gray-medium); margin: 2rem auto; max-width: 600px;">
        <p style="font-size: 0.9rem;">${footer.copyright}</p>
    `;
}

// Load content when DOM is ready
document.addEventListener('DOMContentLoaded', loadContent);
