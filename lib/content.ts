export interface FirmDetails {
  name: string;
  tagline: string;
  established: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  mapUrl: string;
  bciDisclaimer: string;
}

export const FIRM: FirmDetails = {
  name: "Kaushik & Company",
  tagline: "Advocates & Legal Consultants",
  established: "Established 2001",
  address: "421/7/16, Near E.S.I. Office, Civil Lines, Gurugram – 122001, Haryana",
  phone: "0124-2222343 / 0124-2225343",
  whatsapp: "+91-124-2222343",
  email: "advocate.kaushik@kaushikandcompany.com",
  mapUrl: "https://maps.google.com/?q=421/7/16+Civil+Lines+Gurugram",
  bciDisclaimer: "As per the rules of the Bar Council of India, advocates are not permitted to solicit work or advertise. This website has been created only for informational purposes and is not intended to be an advertisement, solicitation, or invitation of any kind. The information provided on this website does not constitute legal advice and should not be relied upon as such. Kaushik & Company does not claim to be the best or topmost law firm in any respect."
};

export interface TeamMember {
  name: string;
  designation: string;
  enrolment: string;
  qualifications: string;
  bio: string;
  courts: string[];
}

export const TEAM: TeamMember[] = [
  {
    name: "Mr. Sandeep Kaushik",
    designation: "Senior Partner",
    enrolment: "Bar Council of Punjab & Haryana – Enrolment No. P&H/2001/XXXX",
    qualifications: "LLB – University of Delhi (2001); LLM – Panjab University (2003)",
    bio: "Mr. Sandeep Kaushik has over two decades of practice before the Punjab & Haryana High Court, Delhi High Court, and District Courts of the NCR, with particular experience in civil, property, and corporate matters.",
    courts: ["Punjab & Haryana High Court", "Delhi High Court", "District Courts – Gurugram"]
  },
  {
    name: "Ms. Priya Sharma",
    designation: "Associate Advocate",
    enrolment: "Bar Council of Punjab & Haryana – Enrolment No. P&H/2014/XXXX",
    qualifications: "LLB – Panjab University (2014)",
    bio: "Ms. Priya Sharma practises primarily before the District Courts of Gurugram and Faridabad, with a focus on matrimonial and family law matters.",
    courts: ["District Courts – Gurugram", "District Courts – Faridabad"]
  }
];

export interface PracticeArea {
  id: string;
  title: string;
  description: string;
  courts: string[];
}

export const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: "civil",
    title: "Civil & Property Law",
    description: "Advisory and representation in property disputes, title verification, possession matters, injunctions, and civil suits before the District Courts and High Court.",
    courts: ["Punjab & Haryana High Court", "District Courts – Gurugram"]
  },
  {
    id: "corporate",
    title: "Corporate & Commercial",
    description: "Legal advisory for businesses, contract drafting and review, partnership matters, and corporate compliance for companies operating in the NCR.",
    courts: ["District Courts – Gurugram", "NCLT"]
  },
  {
    id: "matrimonial",
    title: "Matrimonial & Family Law",
    description: "Representation in divorce proceedings, maintenance, child custody, and matrimonial property disputes before the family courts of Gurugram and Faridabad.",
    courts: ["District Courts – Gurugram", "District Courts – Faridabad"]
  },
  {
    id: "criminal",
    title: "Criminal Law",
    description: "Defence representation in criminal matters, bail applications, anticipatory bail, and criminal appeals before the Sessions Court and High Court.",
    courts: ["Punjab & Haryana High Court", "District Courts – Gurugram"]
  },
  {
    id: "recovery",
    title: "Debt Recovery & Arbitration",
    description: "Representation before the Debt Recovery Tribunal and in arbitration proceedings for recovery of dues, enforcement of awards, and commercial disputes.",
    courts: ["DRT – Delhi", "Arbitration"]
  },
  {
    id: "consumer",
    title: "Consumer & Service Matters",
    description: "Representation before District and State Consumer Disputes Redressal Commissions for consumer grievances against service providers and manufacturers.",
    courts: ["Consumer Forums – Haryana"]
  }
];

export const COURTS: string[] = [
  "Supreme Court of India",
  "Punjab & Haryana High Court",
  "Delhi High Court",
  "District Courts – Gurugram",
  "District Courts – Faridabad",
  "NCLT / NCLAT",
  "DRT – Delhi",
  "Consumer Forums – Haryana",
  "Arbitration Tribunals"
];

export interface Credential {
  year: number;
  title: string;
  description: string;
}

export const CREDENTIALS: Credential[] = [
  {
    year: 2001,
    title: "Firm Established",
    description: "Kaushik & Company founded in Civil Lines, Gurugram, with enrolment at the Bar Council of Punjab & Haryana."
  },
  {
    year: 2004,
    title: "High Court Practice",
    description: "Expanded practice to the Punjab & Haryana High Court at Chandigarh, appearing in civil and property appeals."
  },
  {
    year: 2009,
    title: "NCR Jurisdiction",
    description: "Commenced regular appearances before Delhi High Court and District Courts of Faridabad, extending the firm's NCR footprint."
  },
  {
    year: 2014,
    title: "Associate Joined",
    description: "Ms. Priya Sharma joined the firm, strengthening the matrimonial and family law practice."
  },
  {
    year: 2019,
    title: "Arbitration Practice",
    description: "Established a dedicated arbitration and debt recovery practice with appearances before DRT Delhi."
  },
  {
    year: 2024,
    title: "Two Decades of Practice",
    description: "Over 20 years of continuous practice serving clients across the NCR from the Civil Lines office in Gurugram."
  }
];

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Practice Areas", href: "#practice" },
  { label: "Courts", href: "#courts" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" }
];
