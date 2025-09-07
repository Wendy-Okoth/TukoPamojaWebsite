// main.js - simple site JS: nav toggle, projects, modal, forms
document.addEventListener('DOMContentLoaded', () => {
    // set footer years
    document.querySelectorAll('[id^="year"]').forEach(el => el.textContent = new Date().getFullYear());
  
    // mobile nav toggles (works for each header)
    document.querySelectorAll('.nav-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const nav = btn.nextElementSibling || document.querySelector('#main-nav');
        if (!nav) return;
        const visible = nav.style.display === 'flex';
        nav.style.display = visible ? '' : 'flex';
        if (!visible) nav.style.flexDirection = 'column';
      });
    });
  
    // Mock project data (in production load via server or IPFS CIDs)
    const projects = [
      {
        id: 'p1',
        title: 'Riverwood Short Film Series',
        desc: 'A collection of short films celebrating local storytellers.',
        image: 'images/project1.jpg',
        owner: 'Alice',
        contributions: 37,
        raised: 125000 // KSh
      },
      {
        id: 'p2',
        title: 'Afrobeat EP Recording',
        desc: 'Studio sessions and distribution for a rising artist.',
        image: 'images/project2.jpg',
        owner: 'Benson',
        contributions: 82,
        raised: 300000
      },
      {
        id: 'p3',
        title: 'Community Mural Project',
        desc: 'Public art across Nairobi neighbourhoods.',
        image: 'images/project3.jpg',
        owner: 'Community Collective',
        contributions: 21,
        raised: 45000
      }
    ];
  
    // Render a subset on homepage
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
      projects.slice(0,3).forEach(p => projectsGrid.appendChild(makeProjectCard(p)));
    }
  
    // Render all projects on projects page
    const allGrid = document.getElementById('all-projects');
    if (allGrid) {
      projects.forEach(p => allGrid.appendChild(makeProjectCard(p, true)));
    }
  
    // Search on projects page
    const search = document.getElementById('search');
    if (search && allGrid) {
      search.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        allGrid.innerHTML = '';
        projects.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
                .forEach(p => allGrid.appendChild(makeProjectCard(p, true)));
      });
    }
  
    // Modal controls
    const modal = document.getElementById('contribute-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const contribForm = document.getElementById('contribute-form');
    const contribResult = document.getElementById('contrib-result');
  
    function openModal(projectId){
      modal.setAttribute('aria-hidden','false');
      modal.dataset.project = projectId;
      contribResult.textContent = '';
      document.getElementById('amount').value = '';
    }
    function closeModal(){
      modal.setAttribute('aria-hidden','true');
      delete modal.dataset.project;
    }
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCancel) modalCancel.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  
    if (contribForm) {
      contribForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = Number(document.getElementById('amount').value);
        if (!amount || amount <= 0) {
          contribResult.textContent = 'Please enter a valid amount in KSh';
          return;
        }
        // Simulated contribution flow
        const pid = modal.dataset.project || 'unknown';
        contribResult.textContent = `Thanks — simulated contribution of KSh ${amount.toLocaleString()} to project ${pid}. (In production, open wallet and send mCUSD.)`;
        setTimeout(closeModal, 2200);
      });
    }
  
    // contact form with basic validation (no back-end)
    const contactForm = document.getElementById('contact-form');
    const contactResult = document.getElementById('contact-result');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const message = contactForm.message.value.trim();
        if (!name || !email || !message) {
          contactResult.textContent = 'Please fill all fields.';
          return;
        }
        contactResult.textContent = 'Thanks! Message sent (simulated). We will reach out to you at ' + email + '.';
        contactForm.reset();
      });
    }
  
    // helper to create card DOM
    function makeProjectCard(p, showOwner=false){
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}">
        <div class="card-body">
          <h3>${p.title}</h3>
          <p class="muted">${p.desc}</p>
          <p><strong>Raised:</strong> KSh ${Number(p.raised).toLocaleString()} • <strong>Contributors:</strong> ${p.contributions}</p>
          <div style="margin-top:0.75rem;">
            <button class="btn btn-small contribute-btn" data-id="${p.id}">Contribute</button>
            <a href="#" class="btn btn-outline" style="margin-left:8px">View</a>
          </div>
        </div>
      `;
      // hook
      setTimeout(() => {
        const btn = card.querySelector('.contribute-btn');
        if (btn) btn.addEventListener('click', () => openModal(p.id));
      }, 0);
      return card;
    }
  });
  