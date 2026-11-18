/* Shared content for the print preview and editable Word downloads. */
'use strict';

const profile = {
  name: 'Aravindan Pathirasamy',
  title: 'Associate Technical Lead | Enterprise Java & AI-Assisted Engineering',
  location: 'Coimbatore, Tamil Nadu, India',
  email: 'aravin012@gmail.com',
  phone: '+91 86680 76545',
  linkedin: 'linkedin.com/in/aravindan-pathirasamy-b56708a7',
  site: 'aravin012.github.io',
};

const summary = 'Associate Technical Lead with 9+ years of experience delivering enterprise Java applications for insurance and fintech. Hands-on expertise in Spring Boot, Apache Karaf (OSGi), React, and legacy modernization. Built a governed multi-agent engineering framework for evidence-checked migration and in-place software changes.';

const skills = [
  ['Core engineering', 'Java 8–17, Spring Boot, Spring MVC, REST APIs, React, JavaScript, SQL'],
  ['Architecture & data', 'Apache Karaf, OSGi, Hibernate/JPA, MS SQL Server, Oracle, PostgreSQL'],
  ['AI & delivery', 'Multi-agent orchestration, RAG, Neo4j, Python, Maven, Git, Docker, JUnit'],
];

const jobs = [
  {
    title: 'Software Engineer III & Associate Technical Lead', company: 'Zinnia', period: 'Apr 2024 – Present',
    bullets: [
      'Lead Spring MVC/JSP to Spring Boot and React modernization across TPP, eApp, and iHub insurance applications.',
      'Built a governed multi-agent engineering framework with controller-scoped tasks, evidence checks, build/test gates, and an audit trail.',
      'Contributed to the MinionBot AI platform and developed hybrid RAG retrieval for contextual eApp code Q&A.',
      'Review code and mentor engineers; promoted to Software Engineer III in July 2025.',
    ],
  },
  {
    title: 'Module Lead', company: 'EbixCash', period: 'Aug 2021 – Mar 2024',
    bullets: [
      'Led delivery of fintech and insurance workflow modules, from planning through implementation.',
      'Designed Spring Boot REST APIs and coordinated technical decisions, task ownership, and delivery.',
    ],
  },
  {
    title: 'Programmer Analyst', company: 'Cognizant Technology Solutions', period: 'Jun 2019 – Aug 2021',
    bullets: [
      'Developed and supported insurance platform features for Lincoln Financial Group using Java, Spring Boot, and MS SQL Server.',
      'Participated in requirements analysis, technical design, documentation, and troubleshooting.',
    ],
  },
  {
    title: 'Software Engineer', company: 'Ebix Software India Pvt. Ltd.', period: 'May 2017 – Jun 2019',
    bullets: [
      'Enhanced policy-processing applications and built XML/XSLT integrations for North American insurers.',
      'Collaborated with a 20+ engineer migration team and supervised two team members.',
    ],
  },
];

const projects = [
  {
    title: 'Governed multi-agent engineering framework',
    description: 'Designed a reusable PowerShell controller that dispatches scoped agents, validates evidence and JSON artifacts, runs builds/tests, and records decisions in a hash-chained ledger. A method-level Java code graph supports dependency-aware migration planning; in-place work-item flows were tested on a sample project with simulated agents.',
  },
  {
    title: 'eApp AI indexer & RAG chat',
    description: 'Indexed code and business context into Neo4j and developed hybrid retrieval with pgvector, graph traversal, and reranking for contextual code Q&A.',
  },
  {
    title: 'Insurance application modernization',
    description: 'Led full-stack migration planning and delivery across TPP, eApp, and iHub, moving legacy Spring MVC/JSP workflows toward Spring Boot APIs and React.',
  },
];

const education = 'B.E. Mechatronics, Robotics & Automation Engineering — SNS College of Technology, 2016';

function section(title, items) { return { title, items }; }
function text(value) { return { type: 'text', value }; }
function skill(label, value) { return { type: 'skill', label, value }; }
function job(item, count) { return { type: 'job', ...item, bullets: item.bullets.slice(0, count) }; }
function project(item) { return { type: 'project', ...item }; }

function resumePages(format) {
  if (format === 'one') return [[
    section('Profile', [text(summary)]),
    section('Technical expertise', skills.map(([label, value]) => skill(label, value))),
    section('Professional experience', [job(jobs[0], 3), job(jobs[1], 2), job(jobs[2], 1), job(jobs[3], 1)]),
    section('Selected project', [project({
      title: projects[0].title,
      description: 'Built a controller-led AI agent framework for evidence-checked modernization and in-place changes, with independent review, automated build/test gates, and a traceable audit ledger.',
    })]),
    section('Education', [text(education)]),
  ]];
  return [
    [
      section('Profile', [text(summary)]),
      section('Technical expertise', skills.map(([label, value]) => skill(label, value))),
      section('Professional experience', [job(jobs[0], 4), job(jobs[1], 2)]),
    ],
    [
      section('Professional experience · continued', [job(jobs[2], 2), job(jobs[3], 2)]),
      section('Selected engineering work', projects.map(project)),
      section('Education', [text(education)]),
      section('Recognition', [text('Values in Action award at Zinnia for contributions to the MinionBot AI platform; Best Employee of the Year 2020 at Cognizant.')]),
    ],
  ];
}

const preview = document.getElementById('document-preview');
const pageLabel = document.getElementById('page-label');
const letterFields = document.getElementById('letter-fields');
const status = document.getElementById('export-status');
const params = new URLSearchParams(window.location.search);
const requested = params.get('format');
if (['one', 'detailed', 'letter'].includes(requested)) {
  document.querySelector(`input[name="format"][value="${requested}"]`).checked = true;
}

function currentFormat() { return document.querySelector('input[name="format"]:checked').value; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }

function header(continued = false) {
  return `<header class="doc-header"><div class="doc-name">${escapeHtml(profile.name)}</div>
    <div class="doc-role">${escapeHtml(profile.title)}${continued ? ' · Continued' : ''}</div>
    <div class="doc-contact"><span>${escapeHtml(profile.location)}</span><a href="mailto:${profile.email}">${profile.email}</a>
    <span>${escapeHtml(profile.phone)}</span><span>${escapeHtml(profile.linkedin)}</span><span>${escapeHtml(profile.site)}</span></div></header>`;
}

function renderItem(item) {
  if (item.type === 'text') return `<p>${escapeHtml(item.value)}</p>`;
  if (item.type === 'skill') return `<p class="skill-line"><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}</p>`;
  if (item.type === 'project') return `<div class="doc-row"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p></div>`;
  return `<div class="doc-row"><div class="doc-row-head"><strong>${escapeHtml(item.title)}</strong><time>${escapeHtml(item.period)}</time></div>
    <div class="doc-sub">${escapeHtml(item.company)}</div><ul class="doc-list">${item.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul></div>`;
}

function letterContent() {
  const recipient = document.getElementById('recipient').value.trim() || 'Hiring Manager';
  const company = document.getElementById('company').value.trim();
  const role = document.getElementById('role').value.trim() || 'Software Engineering Lead';
  const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  return {
    recipient, company, role, date,
    paragraphs: [
      `I am writing to express my interest in the ${role} position${company ? ` at ${company}` : ''}. With more than nine years of experience developing enterprise Java applications, I bring a combination of hands-on engineering, technical leadership, and practical experience modernizing insurance and fintech platforms.`,
      'At Zinnia, I lead work to modernize legacy Spring MVC and JSP applications using Spring Boot APIs and React. My responsibilities include technical design, implementation, code review, and mentoring engineers across insurance application modules. Earlier roles at EbixCash, Cognizant, and Ebix strengthened my experience in API design, integration, and cross-team delivery.',
      'I have also designed a governed multi-agent engineering framework for codebase modernization and in-place software changes. It combines scoped specialist agents with controller-run evidence validation, build and test gates, and an auditable decision trail. This work reflects my approach to AI-assisted engineering: use automation to improve delivery while keeping technical quality and accountability visible.',
      `I would welcome the opportunity to discuss how my background in enterprise modernization, full-stack delivery, and engineering leadership could contribute${company ? ` to ${company}` : ' to your team'}. Thank you for your time and consideration.`,
    ],
  };
}

function render() {
  const format = currentFormat();
  letterFields.hidden = format !== 'letter';
  preview.classList.toggle('compact', format === 'one');
  status.textContent = '';
  if (format === 'letter') {
    const letter = letterContent();
    preview.innerHTML = `<article class="paper">${header()}<div class="letter-date">${escapeHtml(letter.date)}</div>
      <div class="letter-address">${escapeHtml(letter.recipient)}${letter.company ? `<br>${escapeHtml(letter.company)}` : ''}</div>
      <div class="letter-subject">Re: ${escapeHtml(letter.role)}</div>
      <p class="letter-greeting">Dear ${escapeHtml(letter.recipient)},</p>
      <div class="letter-body">${letter.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}</div>
      <div class="letter-close">Yours sincerely,</div><div class="letter-signature">${escapeHtml(profile.name)}</div></article>`;
  } else {
    const pages = resumePages(format);
    preview.innerHTML = pages.map((sections, index) => `<article class="paper">${header(index > 0)}
      ${sections.map(s => `<section class="doc-section"><h2>${escapeHtml(s.title)}</h2>${s.items.map(renderItem).join('')}</section>`).join('')}
      ${pages.length > 1 ? `<div class="doc-page-marker">${escapeHtml(profile.name)} · ${index + 1} / ${pages.length}</div>` : ''}</article>`).join('');
  }
  pageLabel.textContent = format === 'detailed' ? '01 / 02' : '01 / 01';
  document.title = `${profile.name} | ${format === 'letter' ? 'Cover Letter' : format === 'one' ? 'One-page Resume' : 'Detailed Resume'}`;
}

document.querySelectorAll('input[name="format"]').forEach(input => input.addEventListener('change', render));
letterFields.querySelectorAll('input').forEach(input => input.addEventListener('input', render));
document.getElementById('pdf-button').addEventListener('click', () => window.print());

function createWord() {
  const { Document, Packer, Paragraph, TextRun, BorderStyle } = window.docx;
  const format = currentFormat();
  const compact = format === 'one';
  const bodySize = compact ? 18 : 20;
  const spacing = compact ? 35 : 65;
  const color = '25536B';
  const paragraphs = [];
  const normal = value => new Paragraph({ children: [new TextRun(value)], spacing: { after: spacing }, keepTogether: true });
  const heading = value => new Paragraph({ children: [new TextRun({ text: value.toUpperCase(), bold: true, color, size: 17 })],
    spacing: { before: compact ? 100 : 150, after: 75 }, border: { bottom: { color: 'CCD6DB', style: BorderStyle.SINGLE, size: 5, space: 4 } }, keepNext: true });
  const addHeader = (continued = false) => {
    paragraphs.push(new Paragraph({ pageBreakBefore: continued, children: [new TextRun({ text: profile.name, font: 'Georgia', size: compact ? 40 : 44, color: '1D2D38' })], spacing: { after: 40 }, keepNext: true }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: profile.title + (continued ? ' · Continued' : ''), bold: true, color, size: 19 })], spacing: { after: 55 }, keepNext: true }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${profile.location}  |  ${profile.email}  |  ${profile.phone}`, color: '52616B', size: 16 })], spacing: { after: 25 }, keepNext: true }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${profile.linkedin}  |  ${profile.site}`, color: '52616B', size: 16 })], spacing: { after: compact ? 105 : 180 }, border: { bottom: { color, style: BorderStyle.SINGLE, size: 10, space: 8 } } }));
  };

  if (format === 'letter') {
    const letter = letterContent();
    addHeader();
    paragraphs.push(new Paragraph({ text: letter.date, spacing: { before: 240, after: 220 } }));
    paragraphs.push(normal(letter.recipient));
    if (letter.company) paragraphs.push(normal(letter.company));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Re: ${letter.role}`, bold: true, color })], spacing: { before: 180, after: 220 } }));
    paragraphs.push(new Paragraph({ text: `Dear ${letter.recipient},`, spacing: { after: 220 } }));
    letter.paragraphs.forEach(value => paragraphs.push(new Paragraph({ text: value, spacing: { after: 230 }, keepTogether: true })));
    paragraphs.push(new Paragraph({ text: 'Yours sincerely,', spacing: { before: 180, after: 300 } }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: profile.name, font: 'Georgia', size: 26 })] }));
  } else {
    resumePages(format).forEach((page, pageIndex) => {
      addHeader(pageIndex > 0);
      page.forEach(s => {
        paragraphs.push(heading(s.title));
        s.items.forEach(item => {
          if (item.type === 'text') paragraphs.push(normal(item.value));
          if (item.type === 'skill') paragraphs.push(new Paragraph({ children: [new TextRun({ text: `${item.label}: `, bold: true }), new TextRun(item.value)], spacing: { after: spacing } }));
          if (item.type === 'project') {
            paragraphs.push(new Paragraph({ children: [new TextRun({ text: item.title, bold: true })], spacing: { before: 80, after: 30 }, keepNext: true }));
            paragraphs.push(normal(item.description));
          }
          if (item.type === 'job') {
            paragraphs.push(new Paragraph({ children: [new TextRun({ text: item.title, bold: true }), new TextRun({ text: `  |  ${item.period}`, color: '52616B', size: 16 })], spacing: { before: 70, after: 20 }, keepNext: true }));
            paragraphs.push(new Paragraph({ children: [new TextRun({ text: item.company, bold: true, color, size: 17 })], spacing: { after: 35 }, keepNext: true }));
            item.bullets.forEach(b => paragraphs.push(new Paragraph({ text: b, bullet: { level: 0 }, indent: { left: 280, hanging: 165 }, spacing: { after: compact ? 24 : 50 }, keepTogether: true })));
          }
        });
      });
    });
  }
  return new Document({
    creator: profile.name,
    title: format === 'letter' ? 'Cover Letter' : 'Resume',
    styles: { default: { document: { run: { font: 'Calibri', size: format === 'letter' ? 21 : bodySize, color: '1D2D38' }, paragraph: { spacing: { line: compact ? 225 : 245 } } } } },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 850, right: 950, bottom: 820, left: 950 } } }, children: paragraphs }],
  });
}

document.getElementById('word-button').addEventListener('click', async event => {
  const button = event.currentTarget;
  if (!window.docx?.Packer || !window.JSZip) {
    status.textContent = 'Word export library could not load. Check your connection and try again.';
    return;
  }
  button.disabled = true;
  status.textContent = 'Preparing Word document…';
  try {
    // docx-js includes directory entries; removing them keeps Word cloud/open workflows compatible.
    const source = await window.JSZip.loadAsync(await window.docx.Packer.toBlob(createWord()));
    const clean = new window.JSZip();
    await Promise.all(Object.values(source.files).filter(file => !file.dir).map(async file => {
      clean.file(file.name, await file.async('uint8array'), { createFolders: false });
    }));
    const blob = await clean.generateAsync({ type: 'blob', compression: 'DEFLATE', createFolders: false });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const suffix = { one: 'One-Page-Resume', detailed: 'Detailed-Resume', letter: 'Cover-Letter' }[currentFormat()];
    link.href = url;
    link.download = `Aravindan-Pathirasamy-${suffix}.docx`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    status.textContent = 'Word document downloaded.';
  } catch (error) {
    console.error('Word export failed:', error);
    status.textContent = 'Word export failed. Please try again.';
  } finally {
    button.disabled = false;
  }
});

render();
if (params.get('print') === '1') window.addEventListener('load', () => setTimeout(() => window.print(), 400));
