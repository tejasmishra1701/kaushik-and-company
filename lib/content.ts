// ================================================================
// FIRM CONTENT — Sandeep Kaushik & Company
// Source: Official Firm Profile (ProfileSKC.pdf)
// ================================================================

// ── Interfaces ───────────────────────────────────────────────────

export interface FirmDetails {
  name: string;
  tagline: string;
  established: string;
  address: string;
  phone: string;
  mobile: string;
  whatsapp: string;
  email: string;
  website: string;
  mapUrl: string;
  mission: string;
  vision: string;
  about: string;
  bciDisclaimer: string;
}

export interface TeamMember {
  name: string;
  designation: string;
  enrolment: string;
  qualifications: string;
  bio: string;
  courts: string[];
}

export interface PracticeArea {
  id: string;
  title: string;
  description: string;
  courts: string[];
}

export interface Credential {
  year: number;
  title: string;
  description: string;
}

export interface NavLink {
  label: string;
  href: string;
}

// ── Firm ─────────────────────────────────────────────────────────

export const FIRM: FirmDetails = {
  name: "Kaushik & Company",
  tagline: "Advocates, Attorneys & Corporate Consultants",
  established: "Established 2006",
  address: "421/7/16, Near ESI Office, Civil Lines, Gurugram – 122001, Haryana",
  phone: "0124-2222343 / 0124-2225343",
  mobile: "09873343404",
  whatsapp: "+91-9873343404",
  email: "advocate.kaushik@kaushikandcompany.com",
  website: "www.kaushikandcompany.com",
  mapUrl: "https://maps.google.com/?q=421/7/16+Civil+Lines+Gurugram",
  mission:
    "The firm provides workable advice and cost-effective assistance to our clients. The client's benefit is our foremost aim. The approach of the firm is to provide clear, concise and practical advice with time bound deliverables to support Client's business objectives. The firm focuses on problem avoidance and not just on problem solving.",
  vision:
    "We are committed to provide high-end Legal consultancy services to our esteemed clients. We are developed on a tradition to specialize in listening, even the unsaid word, and understand your business requirements. We strive hard to defend the honour of our profession by adopting the highest degree of professionalism, craftsman and preservation of much valued client secrets including act with fairness, integrity, ethics, diligence and social responsibility.",
  about:
    "Kaushik & Company (SKC) has been operating in the field of legal advisory since 2006 with its head office situated at Gurugram, Haryana. The firm gives the benefit of a single window service to ensure a comprehensive full-service offering to deal with all kinds of matters pertaining to the company across the country under one umbrella. The firm represents a large number of business houses across the country including Automobile, Medical, Garment, Healthcare, Real Estate, IT industries, Education institutes, Telecommunication, Manufacturers, NGOs and more.",
  bciDisclaimer:
    "As per the rules of the Bar Council of India, advocates are not permitted to solicit work or advertise. This website has been created only for informational purposes and is not intended to be an advertisement, solicitation, or invitation of any kind. The information provided on this website does not constitute legal advice and should not be relied upon as such. Sandeep Kaushik & Company does not claim to be the best or topmost law firm in any respect.",
};

// ── Team ─────────────────────────────────────────────────────────

export const TEAM: TeamMember[] = [
  {
    name: "Mr. Sandeep Kaushik",
    designation: "Founder & Senior Partner",
    enrolment: "Bar Council of Punjab & Haryana",
    qualifications: "Corporate Lawyer | 20+ Years Experience",
    bio: "Mr. Sandeep Kaushik is founder and heads the Law firm. He is a Corporate Lawyer with deep understanding of Indian Labour Laws and around 20 years of professional experience in representing clients in various corporate matters including Industrial disputes, Labour Laws, Union matters, Closure, Due Diligence and IR matters. His solution-centric subject knowledge is widely sought by multinational and Indian companies.",
    courts: [
      "Punjab & Haryana High Court",
      "Labour Court",
      "Industrial Tribunal",
      "District Courts – Gurugram",
    ],
  },
  {
    name: "Mr. Brajesh Mishra",
    designation: "Senior Advocate",
    enrolment: "Bar Council of Punjab & Haryana",
    qualifications: "Specialist – Labour Court & Industrial Disputes",
    bio: "Mr. Brajesh Mishra is a senior advocate and head of the team handling Labour Court matters. He brings abundant experience in labour law, particularly in conducting domestic enquiries. He is well-versed in the procedures and legal framework under the Industrial Disputes Act 1947, covering strikes, lockouts, retrenchment, layoffs, dismissals, and trade union matters.",
    courts: ["Labour Court", "Industrial Tribunal", "District Courts – Gurugram"],
  },
  {
    name: "Mr. Sunil Kaushik",
    designation: "Senior Advocate",
    enrolment: "Bar Council of Punjab & Haryana",
    qualifications: "Specialist – Civil & Union Matters",
    bio: "Mr. Sunil Kaushik is a senior advocate and head of the team managing Civil and Union matters. He possesses extensive expertise in civil litigation, labour law, and industrial disputes. His professional strengths include civil drafting — bonds, agreements, MoU and deeds — and the vetting of the same.",
    courts: [
      "Punjab & Haryana High Court",
      "District Courts – Gurugram",
      "District Courts – Faridabad",
    ],
  },
  {
    name: "Ms. Anisha",
    designation: "Advocate",
    enrolment: "Bar Council of Punjab & Haryana",
    qualifications: "LLM – Labour Law",
    bio: "Ms. Anisha is an accomplished advocate with a Master's degree in Labour Law and extensive experience in both law and management. She oversees administrative functions and specialises in drafting, legal research, and organisational governance. She is also well versed with The Sexual Harassment of Women at Workplace (Prevention, Prohibition & Redressal) Act, 2013.",
    courts: ["District Courts – Gurugram", "Consumer Forums – Haryana"],
  },
  {
    name: "Compliance Team",
    designation: "Compliance & Regulatory Specialists",
    enrolment:
      "Led by Mr. Bijender Singh, Mr. Bhupender Kumar & Mr. Mahender Kumar",
    qualifications: "Labour Law Compliance | Statutory Registrations | Payroll",
    bio: "The dedicated compliance team specialises in obtaining Licenses and Registrations under various Labour laws and their renewal. The team represents clients before ESIC, Labour, Factory Departments and the Office of the Regional PF Commissioner, and maintains statutory registers, forms, returns, and compliances under all applicable Labour laws.",
    courts: [
      "ESIC",
      "Labour Department – Haryana",
      "Factory Inspectorate",
      "PF Commissioner's Office",
    ],
  },
  {
    name: "CA Associates",
    designation: "Chartered Accountants",
    enrolment: "CA Umesh Sharma & CA Narender Lamba",
    qualifications: "Statutory Audits | Taxation | Corporate Law",
    bio: "CA Umesh Sharma and CA Narender Lamba are associated with the firm and bring more than 10 years of experience in the field of Statutory audits, Taxation and Corporate Law, providing comprehensive financial and compliance support to clients.",
    courts: ["Income Tax Appellate Tribunal", "Corporate Law Advisory"],
  },
];

// ── Practice Areas ───────────────────────────────────────────────

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: "labour",
    title: "Labour Laws & Employment",
    description:
      "Comprehensive Labour Law consultancy including legal opinions on Industrial Disputes, guidance on strikes, lockouts, retrenchment, layoffs and dismissals, trade union negotiations, collective bargaining, and disciplinary proceedings. Representation before Labour Courts and Industrial Tribunals.",
    courts: ["Labour Court", "Industrial Tribunal", "ESIC", "PF Commissioner's Office"],
  },
  {
    id: "litigation",
    title: "Civil & Industrial Litigation",
    description:
      "Full litigation services including briefing management on case merits, drafting petitions and replies, handling court cases, and appearance and representation before courts through to final disposal. Expertise in civil suits, injunctions, and property matters.",
    courts: [
      "Punjab & Haryana High Court",
      "Delhi High Court",
      "District Courts – Gurugram",
      "District Courts – Faridabad",
    ],
  },
  {
    id: "corporate",
    title: "Corporate & Legal Consultancy",
    description:
      "Day-to-day legal, employment and HR consultancy. Oral and written legal opinions, drafting and vetting of Contracts, Agreements, NDA, Legal Notices, and replies. Advisory for businesses on compliance, governance, and corporate law matters.",
    courts: ["NCLT", "Arbitration Tribunals", "District Courts – Gurugram"],
  },
  {
    id: "compliance",
    title: "HR & Statutory Compliance",
    description:
      "End-to-end compliance management under all applicable Labour laws including the Factories Act, EPF Act, ESIC Act, Payment of Bonus Act, Payment of Wages Act, Minimum Wages Act, Maternity Benefit Act, and the Industrial Employment (Standing Order) Act. Maintenance of all statutory registers and periodical reports.",
    courts: [
      "ESIC",
      "Labour Department – Haryana",
      "Factory Inspectorate",
      "PF Commissioner's Office",
    ],
  },
  {
    id: "posh",
    title: "POSH Act Compliance",
    description:
      "Complete compliance under The Sexual Harassment of Women at Workplace (Prevention, Prohibition & Redressal) Act, 2013. Services include policy drafting, Internal Committee formation, quarterly awareness sessions, complaints handling guidance, and preparation of Annual Reports.",
    courts: ["Internal Committee", "District Officer – Haryana"],
  },
  {
    id: "payroll",
    title: "Payroll & HR Audit",
    description:
      "Monthly payroll processing and maintenance of all employee data. Salary verification — input vs output variance analysis and auditing. HR/Compliance audit of companies including audit of statutory records of the company and its vendors to ensure compliance under all applicable Labour laws.",
    courts: ["Labour Department – Haryana", "PF Commissioner's Office"],
  },
];

// ── Courts ───────────────────────────────────────────────────────

export const COURTS: string[] = [
  "Punjab & Haryana High Court",
  "Delhi High Court",
  "Supreme Court of India",
  "District Courts – Gurugram",
  "District Courts – Faridabad",
  "Labour Court – Gurugram",
  "Industrial Tribunal",
  "NCLT / NCLAT",
  "ESIC & PF Authorities",
  "Consumer Forums – Haryana",
  "Factory Inspectorate – Haryana",
  "Arbitration Tribunals",
];

// ── Credentials / Timeline ───────────────────────────────────────

export const CREDENTIALS: Credential[] = [
  {
    year: 2006,
    title: "Firm Established",
    description:
      "Sandeep Kaushik & Company founded in Civil Lines, Gurugram, with a focus on corporate and labour law advisory for businesses across the NCR.",
  },
  {
    year: 2008,
    title: "Labour Law Practice",
    description:
      "Established a dedicated Labour Court practice with representation before the Industrial Tribunal and Labour Courts of Haryana.",
  },
  {
    year: 2012,
    title: "Compliance Division",
    description:
      "Launched a full-service statutory compliance division handling EPF, ESIC, Factories Act and all Labour law registrations and renewals.",
  },
  {
    year: 2015,
    title: "Corporate Clientele",
    description:
      "Expanded corporate client base to include multinational companies across Automobile, Manufacturing, Healthcare and IT sectors operating in the NCR.",
  },
  {
    year: 2019,
    title: "POSH Practice",
    description:
      "Established a dedicated POSH Act compliance practice with Internal Committee advisory, policy drafting and awareness training for corporate clients.",
  },
  {
    year: 2024,
    title: "Two Decades of Service",
    description:
      "Nearly two decades of continuous practice serving businesses, MNCs and individuals from the Civil Lines office in Gurugram, Haryana.",
  },
];

// ── Clients ──────────────────────────────────────────────────────

export const CLIENTS: string[] = [
  "Adventist Development and Relief Agency (ADRA)",
  "AM/NS India Ltd.",
  "Ansal Buildwell Ltd.",
  "APL Logistics Vascor Automotive Pvt. Ltd.",
  "Aisan Industry India Pvt. Ltd.",
  "Atotech India Pvt. Ltd.",
  "Auto International India Ltd.",
  "Avaids Technovators Pvt. Ltd.",
  "Ashimori India Private Limited",
  "ADM Agro Industries India Pvt. Ltd.",
  "Bhurji Electroniks Pvt. Ltd.",
  "Bliss Anand Private Limited",
  "Bosch Chassis Systems India Ltd.",
  "BWI Automotive Technology Pvt. Ltd.",
  "BANDO India Pvt. Ltd.",
  "BorgWarner Emissions Systems India Pvt. Ltd.",
  "Dainichi Color India Pvt. Ltd.",
  "Delta Power Solutions India Pvt. Ltd.",
  "Delhi Public School – Sushant Lok",
  "Donaldson India Filter Systems Pvt. Ltd.",
  "Dudhmansagar Dairy (AMUL)",
  "Furukawa Minda Electric Pvt. Ltd.",
  "Guetermann India Pvt. Ltd.",
  "Hella India Automotive Private Limited",
  "Hitachi Automotive System India Pvt. Ltd.",
  "Hitachi Chemical India Pvt. Ltd.",
  "Hitachi Plant Technologies India Pvt. Ltd.",
  "HMC MM Auto Limited",
  "Hollister Medical India Pvt. Ltd.",
  "Hollister Global Business Services India Pvt. Ltd.",
  "IIMPACT (NGO)",
  "Inergy Automotive India Pvt. Ltd.",
  "Inbrew Beverages Pvt. Ltd.",
  "ITC Ltd. – Hotel Division",
  "Joylukkas India Private Limited",
  "Jtekt FujiKiko Automotive India Limited",
  "Kansai Nerolac Paint Ltd.",
  "Korloy India Tooling Pvt. Ltd.",
  "L.G. Balakrishnan & Bros. Limited",
  "Lifelong India Pvt. Ltd.",
  "Louis Dreyfus Company India Private Limited",
  "Mahindra Lifespace Developers Limited",
  "Majestic Auto Components Pvt. Ltd.",
  "Mitsubishi Chemical India Pvt. Ltd.",
  "NGK Spark Plugs India Pvt. Ltd.",
  "Nippon Paint (India) Pvt. Ltd.",
  "Nisshinbo Comprehensive Precision Machining (Gurgaon) Pvt. Ltd.",
  "NSF Safety and Certifications India Private Limited",
  "Oerlikon Balzers Coating India Pvt. Ltd.",
  "RICO Auto Industries Limited",
  "Roop Automotives Ltd.",
  "Rosenberger Electronics Co. India Pvt. Ltd.",
  "RMC Readymix (India) Pvt. Ltd.",
  "Resonac Materials India Private Limited",
  "Sankei Giken India Pvt. Ltd.",
  "Showa Denko Materials (India) Pvt. Ltd.",
  "Stanley Engineered Fastening India Private Limited",
  "Sudhir Power Limited",
  "Supron Schweisstechninak India Limited",
  "Taiyo India Pvt. Ltd.",
  "Takahata Precision India Pvt. Ltd.",
  "Technico Industries Ltd.",
  "UNO Minda Ltd.",
  "Yamaha Music India Pvt. Limited",
  "Yokohama India Private Limited",
  "Zenica Performance Cars Pvt. Ltd.",
];

// ── Navigation ───────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Practice Areas", href: "#practice" },
  { label: "Team", href: "#team" },
  { label: "Timeline", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];
