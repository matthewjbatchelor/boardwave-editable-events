// Guest Data from PDF
const guests = [
    {
        name: "Achim Weick",
        title: "Founder & CEO",
        company: "EQS Group",
        bio: "Achim is the founder of EQS Group, established in 2000 in Munich. Under his leadership, the company has grown to around 600 professionals with offices in major financial markets worldwide. EQS Group is a leading international cloud provider focused on corporate compliance, investor relations, and ESG. Through its solutions, thousands of companies meet regulatory requirements, manage risk, and communicate business performance and societal impact with transparency and trust.",
        image: "images/guests/achim-weick.jpg",
        badge: null
    },
    {
        name: "Andreas Maslo",
        title: "Co-founder, Managing Director",
        company: "VERSO Group GmbH",
        bio: "Andreas is a sustainability pioneer and digital entrepreneur dedicated to advancing the sustainable transformation of SMEs. In 2010, he founded VERSO, one of the world's first SaaS solutions for sustainability and ESG management. As Co-founder, he is responsible for Strategy, M&A, and R&D. Andreas has also worked as an entrepreneur and honorary speaker, studied partly at Harvard University, was a candidate for the European Parliament, and received multiple start-up awards.",
        image: "images/guests/andreas-maslo.jpg",
        badge: null
    },
    {
        name: "Beatrice Meadowcroft",
        title: "Marketing Manager",
        company: "Canaccord Genuity",
        bio: "",
        image: "images/guests/beatrice-meadowcroft.jpg",
        badge: "PARTNER"
    },
    {
        name: "Christian Knoll",
        title: "CEO",
        company: "twenytreasons business solutions GmbH",
        bio: "Christian spent 14 years at SAP before founding his own software company. He leads the development of SpiceCRM, an open-source CRM solution used by organizations such as A1 Telekom, ÖAMTC, and the Red Cross. Christian works with global partners who resell and implement the platform, offering an open-source alternative to established CRM vendors including Salesforce, HubSpot, and Microsoft.",
        image: "images/guests/christian-knoll.jpg",
        badge: null
    },
    {
        name: "Claudia Hansen",
        title: "Managing Partner",
        company: "HIEC",
        bio: "Claudia is a Managing Partner at H.I. Executive Consulting (H.I.E.C) and a founding member of the firm. She brings expertise across technology and software, private equity, and business and professional services, supported by an academic background in political science and organizational psychology. Claudia works closely with private equity investors, focusing on securing C-level executives for key leadership roles. Before H.I.E.C, she gained experience at global executive search firms including Egon Zehnder International and Heidrick & Struggles.",
        image: "images/guests/claudia-hansen.jpg",
        badge: null
    },
    {
        name: "Dirk Röhrborn",
        title: "CEO",
        company: "Communardo Group GmbH",
        bio: "Dirk holds a degree in business informatics. During his studies, he worked at PriceWaterhouse Management Consultants and IBM. Starting in 1997, he was a consultant for Multimedia Software GmbH Dresden (Deutsche Telekom Group), later heading the Knowledge Management practice unit. Dirk co-founded Communardo Software GmbH, serving as Managing Director since 2001 and CEO of the Communardo Group since 2022. He is also an executive committee member for the digital association Bitkom e.V. and Silicon Saxony e.V.",
        image: "images/guests/dirk-rohrborn.jpg",
        badge: null
    },
    {
        name: "Dr. Franz-Josef Seidensticker",
        title: "NED",
        company: "ProALPHA",
        bio: "Franz-Josef is an accomplished executive with over 30 years of global experience in management, board roles, and strategy consulting. During his three decades at Bain & Company, he served in senior positions including Member of the Global Board of Directors, Managing Director of Germany/CH, and Chairman of EMEA Emerging Markets. He helped reposition the firm in the German and Swiss markets, driving significant growth. Known as a trusted advisor to CEOs and boards, Franz-Josef specializes in strategic transformations and growth in software, technology, telecommunications, and industrial tech.",
        image: "images/guests/franz-josef-seidensticker.jpg",
        badge: "PATRON"
    },
    {
        name: "Etienne Geser",
        title: "Senior Vice President",
        company: "ProSiebenSat.1 Media SE",
        bio: "Etienne heads the Transformation Office at ProSiebenSat.1 Media SE, overseeing the Target Operating Model and driving the group-wide digitalisation strategy. His focus is effective change and transformation management to integrate new processes and technologies. Previously, he served as Co-CEO of ProSiebenSat.1's venture marktguru, leading sales, business development, marketing, finance, legal and HR. Under his leadership, marktguru became a strong #2 challenger in the consumer and advertising market, leveraging an innovative cross-platform strategy across mobile, digital and TV, and building a high-performance sales organisation for direct clients and media agencies.",
        image: "images/guests/etienne-geser.jpg",
        badge: null
    },
    {
        name: "Holger Ensslin",
        title: "Director DACH, Investor",
        company: "Content Bay",
        bio: "Holger has more than 20 years of experience in the media industry and served as Managing Director of Sky Deutschland for 12 years. During this time, he established strategic distribution partnerships, created digital products, and launched streaming services in Austria and Switzerland. He is the founder of ContentBay, a content marketplace startup, and an investor in Sportway Media Group, an AI-driven sports production company. Holger also works with Commercial Sport Media AB, a sports rights and marketing firm investing in sport tech companies.",
        image: "images/guests/holger-ensslin.jpg",
        badge: null
    },
    {
        name: "Kim Nilsson",
        title: "COO",
        company: "Devanthro",
        bio: "Kim is a start-up operator and serial founder with more than 10 years of experience in AI and tech businesses. She holds a PhD in Astrophysics and an MBA.",
        image: "images/guests/kim-nilsson.jpg",
        badge: null
    },
    {
        name: "Lukas Kappelsberger",
        title: "CEO",
        company: "PATOFFICE",
        bio: "Lukas is an innovation and technology enthusiast focused on raising the patent industry to the next level. As CEO of PATOffice, he is transforming the company's 70-year legacy in intellectual property management into a modern, software-driven enterprise. He leads the shift from traditional methods to a SaaS model that makes patent information accessible and user-friendly. Lukas believes that technology and innovation drive improvement, sustainable growth, and positive change across industries.",
        image: "images/guests/lukas-kappelsberger.jpg",
        badge: null
    },
    {
        name: "Mathias Stiefel",
        title: "CEO",
        company: "8SELECT GmbH",
        bio: "Mathias studied law, business administration, and philosophy in Bayreuth, Regensburg, and Birmingham. During his studies, he founded an internet agency with friends and sold it at graduation, confirming his path in the e-commerce and software sector. After completing his studies, he built the legal department at the Omniga Group and later joined its management board. Mathias then founded 8SELECT, initially focused on curated shopping and later pivoted to product recommendation software for online stores, serving leading retailers and brands in the German-speaking fashion, sports, and family sectors.",
        image: "images/guests/mathias-stiefel.jpg",
        badge: null
    },
    {
        name: "Megan Bingham-Walker",
        title: "Founder & CEO",
        company: "Anansi Technology Ltd",
        bio: "Megan is the Founder and CEO of Anansi, a digital insurance broker that helps retailers and their logistics partners stay competitive, improve operational efficiency, enhance customer satisfaction, and drive profitability through greater accountability. She brings 14 years of experience in fintech, high-growth SMEs, machine learning, and data science. Megan was inspired to co-found Anansi after her own experience setting up an e-commerce business.",
        image: "images/guests/megan-bingham-walker.jpg",
        badge: null
    },
    {
        name: "Oliver Mauss",
        title: "Chairman",
        company: "easybill",
        bio: "Oliver is a business leader with 25+ years experience in IT, software, and telecoms. He has been CEO of leading European tech companies such as 1 Internet (Ionos), plusserver and netgo with teams across Europe and North America. He currently serves as non-executive director in several PE-backed software companies. He is chairman of easybill, a SaaS-leader for SMB invoicing and billing solutions. Oliver holds a Ph.D. from Aachen University of Technology and is an active start-up mentor. He is co-founder of 2 European cloud technology initiatives.",
        image: "images/guests/oliver-mauss.jpg",
        badge: null
    },
    {
        name: "Philipp Lenz",
        title: "Co-Founder & CEO",
        company: "cap-on",
        bio: "Philipp is Co-Founder and CEO of cap-on, a fintech platform enabling machine and plant manufacturers to build digital business models such as Asset-as-a-Service, IoT-based financing, and predictive maintenance. He previously served as a project manager at Süddeutsche Leasing AG, where he laid the foundation for cap-on. Philipp is also Co-Founder of the impact startup ClimateGrid and an active shareholder in Lenz&Gomez, a company with more than 30 years of experience in HR services. His focus is on strategic growth, scalable platform models, and sustainable, technology-driven businesses.",
        image: "images/guests/philipp-lenz.jpg",
        badge: null
    },
    {
        name: "Patrick Strunkmann-Meister",
        title: "Founder & CEO",
        company: "Bao Solutions",
        bio: "Patrick is the CEO of bao.ai, a SaaS platform that co-pilots sales conversations in real time. He holds a PhD in Business Administration and brings 20 years of professional experience, including roles at BMW, Strategy Engineers, and Vocatus AG. Patrick is also a three-time founder.",
        image: "images/guests/patrick-strunkmann-meister.jpg",
        badge: null
    },
    {
        name: "Philipp Nastaly",
        title: "Co-Founder & CEO",
        company: "curly",
        bio: "Philipp is the Co-Founder and CEO of curly, leading the development of AI-driven, voice-led interviews that deliver deep customer insights at scale. With more than 13 years of experience across consulting, media, and technology, including co-founding CHAPTR, he focuses on helping teams replace assumptions with real-time customer understanding. Philipp's work centers on enabling organizations to make smarter, data-backed decisions through accessible, customer-centric intelligence.",
        image: "images/guests/philipp-nastaly.jpg",
        badge: null
    },
    {
        name: "Rob Pankow",
        title: "CEO, Founder",
        company: "simplyblock",
        bio: "Rob is the co-founder and CEO of simplyblock, a cloud infrastructure start-up developing innovative data storage technology that enables companies to run databases and AI workloads more efficiently in the cloud and in their own data centers. Before founding simplyblock, Rob spent nearly a decade scaling e-commerce and food delivery start-ups, including leadership roles at Delivery Hero and portfolio companies within Rocket Internet.",
        image: "images/guests/rob-pankow.jpg",
        badge: null
    },
    {
        name: "Robert Horndasch",
        title: "CEO",
        company: "cxomni GmbH",
        bio: "Robert is a computer scientist with extensive experience in telecommunications, consulting, and connected services. He has led transformation and technology initiatives for major media, automotive, and manufacturing organizations. With a background spanning management consulting and strategic technology advisory, he specializes in bridging business strategy and digital innovation. Robert joined cxomni as CEO to accelerate the company's growth and expand its international presence, focusing on strengthening its position as a leading provider of customer experience solutions.",
        image: "images/guests/robert-horndasch.jpg",
        badge: null
    },
    {
        name: "Roland Zelles",
        title: "CEO",
        company: "Zelles Ventures",
        bio: "Roland is the former Chief Revenue Officer of Autodesk, where he led global Go-To-Market sales segments and drove predictable revenue growth. Known for strong sales leadership and commitment to developing diverse teams, he has consistently delivered impactful business strategies and customer outcomes. Over his 25-year Autodesk career, Roland held senior roles including VP of Global Sales Operations and VP of Industry Sales. He holds an Engineering degree, a PhD in Management, and a postgraduate diploma in Global Business, and continues to teach entrepreneurship at the University of Munich.",
        image: "images/guests/roland-zelles.jpg",
        badge: null
    },
    {
        name: "Sabrina Flunkert-Glinzer",
        title: "CEO & Managing Director",
        company: "Ratepay GmbH",
        bio: "Sabrina is a finance and technology leader with a background in investment banking and private equity. Since 2019, she has been part of Ratepay's growth, first as CFO and, since 2024, as CEO. She has led more than 15 acquisitions and exits, including IPOs and carve-outs, structured financing lines, built and scaled cross-functional teams, advanced digitalization and strategy initiatives, and established robust risk management systems. Sabrina is known for driving transformation and scaling high-growth technology organizations.",
        image: "images/guests/sabrina-flunkert-glinzer.jpg",
        badge: "PARTNER"
    },
    {
        name: "Sebastian Krause",
        title: "Independent",
        company: "Independent",
        bio: "Sebastian recently concluded his tenure as IBM's Senior Vice President and Chief Revenue Officer. He reflects with gratitude on his experiences, the relationships he built, and the accomplishments achieved during his time at the company. Contributing to IBM's transformation and helping reshape and implement its go-to-market strategy were defining moments in his career. After working at the forefront of technology innovation with clients, partners, and colleagues, Sebastian now looks forward to new opportunities, continued connection to the technology field, and exploring what comes next.",
        image: "images/guests/sebastian-krause.jpg",
        badge: null
    },
    {
        name: "Sebastian Priebe",
        title: "Partner",
        company: "OC&C Strategy Consultants",
        bio: "Sebastian is a Partner with OC&C Strategy Consultants, having joined the firm in 2025. He was previously a Partner with EY-Parthenon since 2023. Sebastian focuses on commercial due diligence and strategic value creation for technology businesses, including those in software, IT services, and tech-enabled services.",
        image: "images/guests/sebastian-priebe.jpg",
        badge: "PARTNER"
    },
    {
        name: "Sebastian Schwarz",
        title: "Country Head, Germany",
        company: "Liberty Corporate Finance",
        bio: "Sebastian joined Liberty in 2023 and leads the firm's advisory services in the DACH region. He has more than 15 years of experience providing corporate finance advice to corporates, management teams, and business owners. His work includes leading financing projects across senior financing, equity financing, and IPOs. Sebastian's passion lies in capital markets, with a focus on business valuations. He trained as a bank clerk and studied business administration at the University of Augsburg, earning diplomas in finance, accounting, and business law.",
        image: "images/guests/sebastian-schwarz.jpg",
        badge: "PARTNER"
    },
    {
        name: "Stefan Witte",
        title: "Emerging Growth M&A, PE & VC Lawyer",
        company: "A&O Shearman LLP",
        bio: "Stefan advises corporate clients, private equity and venture capital funds, strategic investors, and listed companies on national and cross-border transactions. He focuses on tech and growth M&A, including private equity investments and venture capital, and also advises on general corporate and capital markets matters. At A&O Shearman, he supports high-growth technology companies and their investors across all stages, from early funding to scaling, M&A, IPOs, and long-term market leadership.",
        image: "images/guests/stefan-witte.jpg",
        badge: "PARTNER"
    },
    {
        name: "Sung Ha",
        title: "Partner",
        company: "OC&C Strategy Consultants",
        bio: "Sung Ha is a Partner at OC&C Strategy Consultants with over 20 years of strategy consulting experience. His primary focus is on the TMT and Private Equity sectors. He has extensive experience serving national and international clients by developing growth and digital strategies and executing digital transformation. Prior to re-joining OC&C Strategy Consultants, he was a Partner at EY-Parthenon and Manager of Strategy Development at Deutsche Telekom Group Strategy.",
        image: "images/guests/sung-ha.jpg",
        badge: "PARTNER"
    },
    {
        name: "Thomas Artmann",
        title: "Director",
        company: "Five Arrows",
        bio: "Thomas worked in the private equity teams at Silverfleet and Astorg before joining Five Arrows in 2021, following earlier experience in investment banking at Rothschild & Co. He currently serves on the boards of Radiologie Holding and Solvares. Thomas graduated from the Technical University of Munich with a Diploma in Finance and Engineering.",
        image: "images/guests/thomas-artmann.jpg",
        badge: "PARTNER"
    },
    {
        name: "Ulrich Boeckmann",
        title: "Head of DACH",
        company: "Jamieson Corporate Finance",
        bio: "Ulrich is an advisor to CEOs and management teams with 30 years of investment banking experience. He joined Jamieson as Head of DACH in 2025 after serving as Head of DACH Investment Banking Coverage at Jefferies from 2019 to 2025. Before that, he was Managing Director for Germany at Barclays and held senior roles at Lehman Brothers and Nomura following the Lehman Europe acquisition.",
        image: "images/guests/ulrich-boeckmann.jpg",
        badge: "PARTNER"
    },
    {
        name: "Veronika Gamper",
        title: "CEO",
        company: "WeDaVinci GmbH",
        bio: "Veronika is the founder and CEO of WeDaVinci, a generative-AI innovation platform using natural language processing and AI to support human–AI co-creation in developing new products and services. With a PhD in Computer Science from TU Munich, including a research stay at UC Berkeley, she combines deep technical expertise with strategic experience gained at The Boston Consulting Group and in the media industry, where she served as Interim Director at RTL and built its B2C data products department. Veronika also teaches AI at TU Munich.",
        image: "images/guests/veronika-gamper.jpg",
        badge: null
    },
    {
        name: "Wolfgang Faisst",
        title: "CEO",
        company: "ValueWorks",
        bio: "Wolfgang is Co-Founder and CEO of ValueWorks.ai and a Senior Advisor at Cadence Growth Capital. Previously, he spent 14 years at SAP in leading product development roles and co-founded innovations such as SAP Store, SAP XM, SAP S/4HANA, and Intelligent ERP. He also has a background in top management consulting, having co-founded Bain & Company's IT practice in Germany and Switzerland. Wolfgang lectures on enterprise software at the Universities of Bamberg and Bayreuth and serves as a working group lead in the German AI initiative operated by AcaTech.",
        image: "images/guests/wolfgang-faisst.jpg",
        badge: null
    }
];

// Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Populate Guests
function populateGuests() {
    const guestsContainer = document.getElementById('guests-container');
    if (!guestsContainer) return;

    guests.forEach(guest => {
        const guestCard = document.createElement('div');
        guestCard.className = 'guest-card';

        let badgeHTML = '';
        if (guest.badge) {
            badgeHTML = `<div class="guest-badge">${guest.badge}</div>`;
        }

        guestCard.innerHTML = `
            ${badgeHTML}
            <div class="profile-image">
                <img src="${guest.image}" alt="${guest.name}" onerror="this.src='images/placeholder-profile.svg'">
            </div>
            <h3>${guest.name}</h3>
            <p class="profile-title">${guest.title}<br>${guest.company}</p>
            ${guest.bio ? `<p class="profile-bio">${guest.bio}</p>` : ''}
        `;

        guestsContainer.appendChild(guestCard);
    });
}

// Active Navigation Highlight on Scroll
function highlightNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateGuests();
    window.addEventListener('scroll', highlightNavigation);
});

// Fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.profile-card, .guest-card, .timeline-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
