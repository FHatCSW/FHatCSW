// Load and render CV content from JSON
async function loadContent() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderCV(data);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function renderCV(data) {
    const cvContent = document.getElementById('cv-content');
    
    // Check if we have private data
    const hasPrivateData = data.contact.address || data.personalInfo;
    
    // Build contact info - only show in main header if no private data
    let contactInfo = '';
    if (!hasPrivateData) {
        contactInfo = `
            <strong>Phone:</strong> ${data.contact.phone} &nbsp;|&nbsp;
            <strong>Email:</strong> <a href="${data.contact.emailUrl}">${data.contact.email}</a> &nbsp;|&nbsp;
            <strong>LinkedIn:</strong> <a href="${data.contact.linkedinUrl}" target="_blank">${data.contact.linkedin}</a>
        `;
    }
    
    // Add private contact section if data exists
    let privateContactSection = '';
    if (hasPrivateData) {
        privateContactSection = '<div class="private-contact-info">';
        
        // Address
        if (data.contact.address) {
            privateContactSection += `
                <div>
                    <strong>Address:</strong><br>
                    ${data.contact.address.street}<br>
                    ${data.contact.address.postalCode} ${data.contact.address.city}<br>
                    ${data.contact.address.country}
                </div>
            `;
        }
        
        // Personal Info
        if (data.personalInfo) {
            privateContactSection += '<div>';
            if (data.personalInfo.dateOfBirth) {
                privateContactSection += `<strong>Date of Birth:</strong> ${data.personalInfo.dateOfBirth}<br>`;
            }
            if (data.personalInfo.placeOfBirth) {
                privateContactSection += `<strong>Place of Birth:</strong> ${data.personalInfo.placeOfBirth}<br>`;
            }
            if (data.personalInfo.nationality) {
                privateContactSection += `<strong>Nationality:</strong> ${data.personalInfo.nationality}`;
            }
            privateContactSection += '</div>';
        }
        
        // Contact info (only shown in private section when private data exists)
        privateContactSection += `
            <div>
                <strong>Phone:</strong> ${data.contact.phone}<br>
                <strong>Email:</strong> ${data.contact.email}<br>
                <strong>LinkedIn:</strong> ${data.contact.linkedin}
            </div>
        `;
        
        privateContactSection += '</div>';
    }
    
    cvContent.innerHTML = `
        <!-- Page 1 -->
        <div class="cv-header">
            <h1>${data.header.name}</h1>
            <p class="subtitle">${data.header.subtitle}</p>
            <div class="contact-info">
                ${contactInfo}
            </div>
            ${privateContactSection}
        </div>

        <div class="summary">
            ${data.header.introduction}
        </div>

        <h2>Core Expertise</h2>
        <div class="two-column">
            <div class="skill-box">
                <h3>${data.coreExpertise.appliedCryptography.title}</h3>
                <ul>
                    ${data.coreExpertise.appliedCryptography.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="skill-box">
                <h3>${data.coreExpertise.industrialSecurity.title}</h3>
                <ul>
                    ${data.coreExpertise.industrialSecurity.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="two-column">
            <div class="skill-box">
                <h3>${data.coreExpertise.iotConnectivity.title}</h3>
                <ul>
                    ${data.coreExpertise.iotConnectivity.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="skill-box">
                <h3>${data.coreExpertise.softwareEngineering.title}</h3>
                <ul>
                    ${data.coreExpertise.softwareEngineering.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        </div>

        <h2>Featured Project</h2>
        <div class="featured-project">
            <h3>Trustpoint – Open Source Trust Anchor</h3>
            <p>Co-created and technically led the development of <strong>Trustpoint</strong>, an open-source trust anchor and PKI platform. Trustpoint manages digital machine identities and certificate lifecycles in industrial environments, supporting secure device onboarding, certificate issuance, renewal, revocation, and decommissioning. It operates locally in segmented, offline, or air-gapped OT networks.</p>
            <p><strong>GitHub:</strong> github.com/Trustpoint-Project/trustpoint</p>
        </div>

        <h2>Professional Experience</h2>
        ${data.professionalTimeline.workExperience.map(job => `
            <div class="timeline-item">
                <div class="period">${job.period}</div>
                <div class="title">${job.position}</div>
                <div class="organization">${job.company}</div>
            </div>
        `).join('')}

        <h2>Education</h2>
        ${data.professionalTimeline.education.map(edu => `
            <div class="timeline-item">
                <div class="period">${edu.period}</div>
                <div class="title">${edu.degree}</div>
                <div class="organization">${edu.institution}</div>
            </div>
        `).join('')}

        <h2>Leadership & Community</h2>
        <div class="two-column">
            <div>
                <h3>${data.leadershipCommunity.technicalLeadership.title}</h3>
                <ul style="font-size: 9pt;">
                    ${data.leadershipCommunity.technicalLeadership.items.slice(0, 5).map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div>
                <h3>${data.leadershipCommunity.teachingPublicSpeaking.title}</h3>
                <ul style="font-size: 9pt;">
                    ${data.leadershipCommunity.teachingPublicSpeaking.items.map(item => `<li>${item.replace('📄 Applied Cryptography Training', 'Applied Cryptography Training')}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div style="margin-top: 10px;">
            <h3>${data.leadershipCommunity.communityEvents.title}</h3>
            <ul style="font-size: 9pt;">
                ${data.leadershipCommunity.communityEvents.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>

        <h2>Selected Talks & Keynotes</h2>
        <ul class="talks-list">
            ${data.talksKeynotes.slice(0, 15).map(talk => `
                <li><strong>${talk.title}</strong> — ${talk.event}, ${talk.date}</li>
            `).join('')}
        </ul>

        <h2>About Me</h2>
        <ul style="font-size: 9pt;">
            ${data.aboutMe.paragraphs.map(p => `<li>${p}</li>`).join('')}
            ${data.personalFacts.map(fact => `<li>${fact}</li>`).join('')}
        </ul>
    `;
}

// Load content when DOM is ready
document.addEventListener('DOMContentLoaded', loadContent);
