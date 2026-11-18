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
  github: 'github.com/aravin012',
};

const summary = 'Associate Technical Lead with 9+ years of experience building enterprise Java applications across insurance and fintech. Lead full-stack modernization with Spring Boot, Apache Karaf (OSGi), and React; combine hands-on delivery with technical design, code review, and mentoring. Designed a governed multi-agent engineering framework for evidence-checked migration and in-place software changes.';

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
      'Developed a codebase indexer and hybrid RAG retrieval for contextual eApp code Q&A using Neo4j and pgvector.',
      'Define module boundaries and API contracts, review code, and mentor engineers during full-stack delivery.',
      'Contributed to the MinionBot AI platform and its agent-based engineering workflows.',
      'Promoted to Software Engineer III in July 2025 after delivering key module milestones.',
    ],
  },
  {
    title: 'Module Lead', company: 'EbixCash', period: 'Aug 2021 – Mar 2024',
    bullets: [
      'Led delivery of fintech and insurance workflow modules, from planning through implementation.',
      'Designed and implemented Spring Boot REST APIs for downstream web and mobile clients.',
      'Coordinated technical decisions, task ownership, and delivery across a team of developers.',
    ],
  },
  {
    title: 'Programmer Analyst', company: 'Cognizant Technology Solutions', period: 'Jun 2019 – Aug 2021',
    bullets: [
      'Developed and supported insurance platform features for Lincoln Financial Group using Java, Spring Boot, and MS SQL Server.',
      'Participated in requirements analysis and technical design for insurance workflows.',
      'Maintained software documentation and investigated production issues through debugging.',
    ],
  },
  {
    title: 'Software Engineer', company: 'Ebix Software India Pvt. Ltd.', period: 'May 2017 – Jun 2019',
    bullets: [
      'Enhanced policy-processing workflows for Desjardins using Java, Spring, JSP, Struts, and MS SQL Server.',
      'Built XML/XSLT request-response integrations for American Family Insurance.',
      'Collaborated with a 20+ engineer migration team and supervised two team members.',
    ],
  },
];

const projects = [
  {
    title: 'Governed multi-agent engineering framework',
    description: 'Designed a reusable PowerShell controller that dispatches scoped specialist agents, validates cited evidence and schema-bound artifacts, runs build/test gates, and records decisions in a hash-chained audit ledger. A method-level Java code graph supports dependency-aware migration planning; in-place work-item flows were tested on a sample project with simulated agents.',
  },
  {
    title: 'eApp AI indexer & RAG chat',
    description: 'Indexed Java classes, business rules, database schemas, and UI context into Neo4j. Developed hybrid retrieval with pgvector semantic search, graph traversal, and reranking for contextual code Q&A.',
  },
  {
    title: 'Insurance application modernization',
    description: 'Led full-stack migration planning and module delivery across TPP, eApp, and iHub, moving legacy Spring MVC/JSP workflows toward Spring Boot REST APIs and React. Defined module boundaries and API contracts while mentoring engineers through the transition.',
  },
];

const education = 'B.E. Mechatronics, Robotics & Automation Engineering — SNS College of Technology, 2016';
const palettes = {
  navy: { accent: '25536B', ink: '1D2D38', muted: '52616B', rule: 'CCD6DB', tint: 'EDF3F6' },
  sage: { accent: '356F63', ink: '243B36', muted: '536760', rule: 'C6D5CE', tint: 'EDF3EF' },
  graphite: { accent: '44464C', ink: '24272D', muted: '555B61', rule: 'CDD0D2', tint: 'F0F0EF' },
};

function section(title, items) { return { title, items }; }
function text(value) { return { type: 'text', value }; }
function skill(label, value) { return { type: 'skill', label, value }; }
function job(item, count) { return { type: 'job', ...item, bullets: item.bullets.slice(0, count) }; }
function project(item) { return { type: 'project', ...item }; }

function onePageSections() {
  return {
    lead: section('Profile', [text(summary)]),
    left: [section('Professional experience', [job(jobs[0], 5), job(jobs[1], 3), job(jobs[2], 2), job(jobs[3], 2)])],
    right: [
      section('Technical expertise', skills.map(([label, value]) => skill(label, value))),
      section('Selected engineering work', [project(projects[0]), project(projects[1])]),
      section('Education', [text(education)]),
      section('Recognition', [text('Values in Action award at Zinnia; Best Employee of the Year 2020 at Cognizant.')]),
    ],
  };
}

function resumePages() {
  return [
    [
      section('Profile', [text(summary)]),
      section('Technical expertise', skills.map(([label, value]) => skill(label, value))),
      section('Professional experience', [job(jobs[0], 6), job(jobs[1], 3)]),
      section('Technical leadership', [
        text('Guide module architecture and API design for insurance application modernization, balancing legacy behavior with a modern Spring Boot and React delivery model.'),
        text('Apply independent code review, evidence-checked validation, and build/test gates to AI-assisted engineering work.'),
        text('Use a method-level Java code graph to plan dependency-aware migration work and make cross-module handoffs explicit.'),
      ]),
    ],
    [
      section('Professional experience · continued', [job(jobs[2], 3), job(jobs[3], 3)]),
      section('Selected engineering work', projects.map(project)),
      section('Education', [text(education)]),
      section('Recognition', [text('Values in Action award at Zinnia for contributions to the MinionBot AI platform; Best Employee of the Year 2020 at Cognizant.')]),
    ],
  ];
}

const preview = document.getElementById('document-preview');
const previewArea = document.querySelector('.preview');
const pageLabel = document.getElementById('page-label');
const letterFields = document.getElementById('letter-fields');
const status = document.getElementById('export-status');
const params = new URLSearchParams(window.location.search);
const requested = params.get('format');
if (['one', 'detailed', 'letter'].includes(requested)) {
  document.querySelector(`input[name="format"][value="${requested}"]`).checked = true;
}
for (const group of ['template', 'palette']) {
  const selected = params.get(group);
  const input = Array.from(document.querySelectorAll(`input[name="${group}"]`)).find(option => option.value === selected);
  if (input) input.checked = true;
}

function currentFormat() { return document.querySelector('input[name="format"]:checked').value; }
function currentTemplate() { return document.querySelector('input[name="template"]:checked').value; }
function currentPalette() { return document.querySelector('input[name="palette"]:checked').value; }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }

function header(continued = false) {
  return `<header class="doc-header"><div class="doc-name">${escapeHtml(profile.name)}</div>
    <div class="doc-role">${escapeHtml(profile.title)}${continued ? ' · Continued' : ''}</div>
    <div class="doc-contact"><span>${escapeHtml(profile.location)}</span><a href="mailto:${profile.email}">${profile.email}</a>
    <span>${escapeHtml(profile.phone)}</span><span>${escapeHtml(profile.linkedin)}</span><span>${escapeHtml(profile.site)}</span><span>${escapeHtml(profile.github)}</span></div></header>`;
}

function renderItem(item) {
  if (item.type === 'text') return `<p>${escapeHtml(item.value)}</p>`;
  if (item.type === 'skill') return `<p class="skill-line"><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.value)}</p>`;
  if (item.type === 'project') return `<div class="doc-row"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p></div>`;
  return `<div class="doc-row"><div class="doc-row-head"><strong>${escapeHtml(item.title)}</strong><time>${escapeHtml(item.period)}</time></div>
    <div class="doc-sub">${escapeHtml(item.company)}</div><ul class="doc-list">${item.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}</ul></div>`;
}

function renderSection(s) {
  return `<section class="doc-section"><h2>${escapeHtml(s.title)}</h2><div class="doc-section-body">${s.items.map(renderItem).join('')}</div></section>`;
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
  const template = currentTemplate();
  const palette = currentPalette();
  previewArea.dataset.template = template;
  previewArea.dataset.palette = palette;
  letterFields.hidden = format !== 'letter';
  previewArea.classList.toggle('compact', format === 'one');
  status.textContent = '';
  if (format === 'letter') {
    const letter = letterContent();
    preview.innerHTML = `<article class="paper">${header()}<div class="letter-date">${escapeHtml(letter.date)}</div>
      <div class="letter-address">${escapeHtml(letter.recipient)}${letter.company ? `<br>${escapeHtml(letter.company)}` : ''}</div>
      <div class="letter-subject">Re: ${escapeHtml(letter.role)}</div>
      <p class="letter-greeting">Dear ${escapeHtml(letter.recipient)},</p>
      <div class="letter-body">${letter.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}</div>
      <div class="letter-close">Yours sincerely,</div><div class="letter-signature">${escapeHtml(profile.name)}</div></article>`;
  } else if (format === 'one') {
    const content = onePageSections();
    preview.innerHTML = `<article class="paper one-page-paper">${header()}${renderSection(content.lead)}
      <div class="one-page-columns"><div class="one-page-main">${content.left.map(renderSection).join('')}</div>
      <div class="one-page-side">${content.right.map(renderSection).join('')}</div></div></article>`;
  } else {
    const pages = resumePages();
    preview.innerHTML = pages.map((sections, index) => `<article class="paper">${header(index > 0)}
      ${sections.map(renderSection).join('')}
      ${pages.length > 1 ? `<div class="doc-page-marker">${escapeHtml(profile.name)} · ${index + 1} / ${pages.length}</div>` : ''}</article>`).join('');
  }
  pageLabel.textContent = format === 'detailed' ? '01 / 02' : '01 / 01';
  document.title = `${profile.name} | ${format === 'letter' ? 'Cover Letter' : format === 'one' ? 'One-page Resume' : 'Detailed Resume'} | ${template} ${palette}`;
}

document.querySelectorAll('input[name="format"], input[name="template"], input[name="palette"]').forEach(input => input.addEventListener('change', render));
letterFields.querySelectorAll('input').forEach(input => input.addEventListener('input', render));
document.getElementById('pdf-button').addEventListener('click', () => window.print());

function createWord() {
  const { Document, Paragraph, TextRun, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType } = window.docx;
  const format = currentFormat();
  const template = currentTemplate();
  const theme = palettes[currentPalette()];
  const compact = format === 'one';
  const editorialDetail = template === 'editorial' && format === 'detailed';
  const bodySize = format === 'letter' ? 22 : compact ? 20 : 21;
  const spacing = compact ? 70 : editorialDetail ? 65 : 95;
  const color = theme.accent;
  const paragraphs = [];
  const normal = value => new Paragraph({ children: [new TextRun(value)], spacing: { after: spacing }, keepTogether: true });
  const heading = value => new Paragraph({ children: [new TextRun({ text: value.toUpperCase(), bold: true, color, size: 19 })],
    spacing: { before: compact ? 140 : editorialDetail ? 110 : 180, after: editorialDetail ? 65 : 95 }, border: { bottom: { color: theme.rule, style: BorderStyle.SINGLE, size: 5, space: 4 } }, keepNext: true });
  const addHeader = (continued = false) => {
    const band = template === 'executive';
    const headerStyle = {
      ...(band ? { shading: { type: ShadingType.CLEAR, fill: color } } : {}),
      ...(template !== 'classic' ? { alignment: AlignmentType.CENTER } : {}),
    };
    const mainColor = band ? 'FFFFFF' : theme.ink;
    const secondaryColor = band ? 'FFFFFF' : color;
    const contactColor = band ? 'F1F5F5' : theme.muted;
    paragraphs.push(new Paragraph({ ...headerStyle, pageBreakBefore: continued, children: [new TextRun({ text: template === 'editorial' ? profile.name.toUpperCase() : profile.name, font: template === 'editorial' ? 'Calibri' : 'Georgia', size: compact ? 44 : 48, color: mainColor })], spacing: { before: band ? 100 : 0, after: 50 }, keepNext: true }));
    paragraphs.push(new Paragraph({ ...headerStyle, children: [new TextRun({ text: profile.title + (continued ? ' · Continued' : ''), bold: true, color: secondaryColor, size: 21 })], spacing: { after: 65 }, keepNext: true }));
    paragraphs.push(new Paragraph({ ...headerStyle, children: [new TextRun({ text: `${profile.location}  |  ${profile.email}  |  ${profile.phone}`, color: contactColor, size: 17 })], spacing: { after: 35 }, keepNext: true }));
    paragraphs.push(new Paragraph({ ...headerStyle, children: [new TextRun({ text: `${profile.linkedin}  |  ${profile.site}  |  ${profile.github}`, color: contactColor, size: 17 })], spacing: { after: compact ? 130 : 180 }, border: { bottom: { color, style: BorderStyle.SINGLE, size: 10, space: 8 } } }));
  };
  const itemParagraphs = s => {
    const target = [];
    s.items.forEach(item => {
      if (item.type === 'text') target.push(normal(item.value));
      if (item.type === 'skill') target.push(new Paragraph({ children: [new TextRun({ text: `${item.label}: `, bold: true }), new TextRun(item.value)], spacing: { after: spacing } }));
      if (item.type === 'project') {
        target.push(new Paragraph({ children: [new TextRun({ text: item.title, bold: true })], spacing: { before: editorialDetail ? 65 : 100, after: 40 }, keepNext: true }));
        target.push(normal(item.description));
      }
      if (item.type === 'job') {
        target.push(new Paragraph({ children: [new TextRun({ text: item.title, bold: true }), new TextRun({ text: `  |  ${item.period}`, color: theme.muted, size: 17 })], spacing: { before: editorialDetail ? 60 : 90, after: 25 }, keepNext: true }));
        target.push(new Paragraph({ children: [new TextRun({ text: item.company, bold: true, color, size: 18 })], spacing: { after: 45 }, keepNext: true }));
        item.bullets.forEach(b => target.push(new Paragraph({ text: b, bullet: { level: 0 }, indent: { left: 290, hanging: 170 }, spacing: { after: compact ? 55 : editorialDetail ? 50 : 75 }, keepTogether: true })));
      }
    });
    return target;
  };
  const addSections = (target, sections) => sections.forEach(s => {
    if (template === 'editorial' && !compact) {
      const noBorder = { style: BorderStyle.NONE };
      target.push(new Table({
        width: { size: 10006, type: WidthType.DXA }, columnWidths: [1850, 8156],
        borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
        rows: [new TableRow({ children: [
          new TableCell({ width: { size: 1850, type: WidthType.DXA }, margins: { left: 0, right: 170, top: 0, bottom: 0 }, children: [heading(s.title)] }),
          new TableCell({ width: { size: 8156, type: WidthType.DXA }, margins: { left: 160, right: 0, top: 0, bottom: 0 }, children: itemParagraphs(s) }),
        ] })],
      }));
      target.push(new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: '', size: 2 })] }));
    } else {
      target.push(heading(s.title), ...itemParagraphs(s));
    }
  });

  if (format === 'letter') {
    const letter = letterContent();
    addHeader();
    paragraphs.push(new Paragraph({ text: letter.date, spacing: { before: 240, after: 220 } }));
    paragraphs.push(normal(letter.recipient));
    if (letter.company) paragraphs.push(normal(letter.company));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: `Re: ${letter.role}`, bold: true, color })], spacing: { before: 180, after: 220 } }));
    paragraphs.push(new Paragraph({ text: `Dear ${letter.recipient},`, spacing: { after: 220 } }));
    letter.paragraphs.forEach(value => paragraphs.push(new Paragraph({ text: value, spacing: { after: 280 }, keepTogether: true })));
    paragraphs.push(new Paragraph({ text: 'Yours sincerely,', spacing: { before: 180, after: 300 } }));
    paragraphs.push(new Paragraph({ children: [new TextRun({ text: profile.name, font: 'Georgia', size: 26 })] }));
  } else if (compact) {
    const content = onePageSections();
    addHeader();
    addSections(paragraphs, [content.lead]);
    const left = [];
    const right = [];
    addSections(left, content.left);
    addSections(right, content.right);
    const noBorder = { style: BorderStyle.NONE };
    const sidebarFirst = template !== 'classic';
    const sidebarCell = new TableCell({ width: { size: 4106, type: WidthType.DXA }, margins: { left: 0, right: 220, top: 0, bottom: 0 },
      ...(template === 'executive' ? { shading: { type: ShadingType.CLEAR, fill: theme.tint } } : {}),
      borders: { right: { style: BorderStyle.SINGLE, color: template === 'executive' ? color : theme.rule, size: 5 } }, children: right });
    const mainCell = new TableCell({ width: { size: 5900, type: WidthType.DXA }, margins: { left: 250, right: 0, top: 0, bottom: 0 }, children: left });
    paragraphs.push(new Table({
      width: { size: 10006, type: WidthType.DXA }, columnWidths: sidebarFirst ? [4106, 5900] : [5900, 4106],
      borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
      rows: [new TableRow({ children: sidebarFirst ? [sidebarCell, mainCell] : [
        new TableCell({ width: { size: 5900, type: WidthType.DXA }, margins: { left: 0, right: 220, top: 0, bottom: 0 }, children: left }),
        new TableCell({ width: { size: 4106, type: WidthType.DXA }, margins: { left: 260, right: 0, top: 0, bottom: 0 },
          borders: { left: { style: BorderStyle.SINGLE, color: theme.rule, size: 5 } }, children: right }),
      ] })],
    }));
  } else {
    resumePages().forEach((page, pageIndex) => {
      addHeader(pageIndex > 0);
      addSections(paragraphs, page);
    });
  }
  return new Document({
    creator: profile.name,
    title: format === 'letter' ? 'Cover Letter' : 'Resume',
    styles: { default: { document: { run: { font: 'Calibri', size: bodySize, color: theme.ink }, paragraph: { spacing: { line: format === 'letter' ? 305 : compact ? 255 : editorialDetail ? 265 : 285 } } } } },
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
    link.download = `Aravindan-Pathirasamy-${suffix}-${currentTemplate()}-${currentPalette()}.docx`;
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
