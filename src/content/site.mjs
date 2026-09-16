// Site-wide content, URLs, images and redirects. Page copy comes from the redesign (design/Site Page.dc.html).
import { SERVICES, GROUPS, POSTS, TOPICS } from './design-data.mjs';

export { SERVICES, GROUPS, POSTS, TOPICS };

export const SITE_URL = 'https://hillcrestdentalstudio.com';

export const PRACTICE = {
  name: 'Hillcrest Dental Studio',
  doctor: 'Dr. Rana Skaf, DDS',
  street: '2130 Grand Ave H',
  city: 'Chino Hills',
  region: 'CA',
  zip: '91709',
  phone: '(909) 927-5333',
  phoneRaw: '9099275333',
  email: 'info@hillcrestdentalstudio.com',
  mapsUrl: 'https://maps.app.goo.gl/j4k7NZ6YykXjggPt8',
  mapEmbed: 'https://www.google.com/maps?q=Hillcrest+Dental+Studio,+2130+Grand+Ave+H,+Chino+Hills,+CA+91709&output=embed',
  facebook: 'https://www.facebook.com/hillcrestdentalstudio/',
  instagram: 'https://www.instagram.com/hillcrestdentalstudio/',
};

// --- URLs (kept identical to the existing WordPress site for SEO) ----------------

export const PAGE_PATHS = {
  home: '/',
  services: '/dental-services-chino-hills/',
  appointments: '/appointments/',
  'new-patients': '/new-patients/',
  insurance: '/insurances-accepted/',
  about: '/about/',
  doctors: '/our-doctors/',
  difference: '/the-difference/',
  gallery: '/gallery/',
  testimonials: '/testimonials/',
  blog: '/category/blog/',
  contact: '/contact/',
  forms: '/online-forms/',
  sitemap: '/site-map/',
  accessibility: '/accessibility/',
  thanks: '/thank-you/',
};

export const SERVICE_PATHS = {
  preventive: '/preventive-dental-care-chino-hills/',
  cleanings: '/dental-cleanings-chino-hills/',
  pediatric: '/pediatric-dentistry-chino-hills/',
  'root-canals': '/root-canals-chino-hills/',
  'crowns-bridges': '/crowns-bridges/',
  implants: '/dental-implants/',
  'complete-dentures': '/complete-dentures-chino-hills/',
  'wisdom-teeth': '/wisdom-teeth-extractions-chino-hills/',
  cosmetic: '/cosmetic-dentistry-chino-hills/',
  whitening: '/teeth-whitening-chino-hills/',
  veneers: '/veneers-chino-hills/',
  invisalign: '/invisalign-chino-hills/',
  'tmj-botox': '/tmj-treatment-with-botox-chino-hills/',
};

export const POST_SLUGS = {
  'emergency-what-counts': 'what-counts-as-a-dental-emergency',
  'emergency-kids': 'child-chipped-a-tooth',
  'implant-failure': 'why-dental-implants-fail',
  'bridge-materials': 'dental-bridge-materials-compared',
  'whitening-truth': 'teeth-whitening-what-works',
  'veneers-vs-braces': 'veneers-or-orthodontics',
  'kids-first-visit': 'preparing-a-nervous-child-for-the-dentist',
  'sugar-teeth': 'sugar-frequency-and-cavities',
  'bad-breath': 'persistent-bad-breath-causes',
  'gingivitis-vs-perio': 'gingivitis-vs-periodontitis',
  'aligner-adults': 'straightening-teeth-after-forty',
  'braces-care': 'oral-health-during-orthodontic-treatment',
};

export const pagePath = (page) => PAGE_PATHS[page];
export const servicePath = (id) => SERVICE_PATHS[id];
export const postPath = (id) => `/${POST_SLUGS[id]}/`;

// Old WordPress URLs -> closest page in the redesign (301).
export const REDIRECTS = {
  '/services/': PAGE_PATHS.services,
  '/sitemap/': PAGE_PATHS.sitemap,
  '/blog/': PAGE_PATHS.blog,
  '/root-canals/': SERVICE_PATHS['root-canals'],
  '/cosmetic-dentistry/': SERVICE_PATHS.cosmetic,
  '/preventive-dental-care/': SERVICE_PATHS.preventive,
  '/invisalign/': SERVICE_PATHS.invisalign,
  '/complete-dentures/': SERVICE_PATHS['complete-dentures'],
  '/complete-and-partial-dentures/': SERVICE_PATHS['complete-dentures'],
  '/pediatric-dentistry/': SERVICE_PATHS.pediatric,
  '/implants/': SERVICE_PATHS.implants,
  '/preventative-dentistry-chino-hills/': SERVICE_PATHS.preventive,
  '/is-root-canal-treatment-necessary/': SERVICE_PATHS['root-canals'],
  '/root-canal-treatment-at-woodcrest-dental-studio/': SERVICE_PATHS['root-canals'],
  '/root-canal-vs-tooth-removal/': SERVICE_PATHS['root-canals'],
  '/benefits-of-dental-braces/': postPath('braces-care'),
  '/caring-for-your-mouth-with-orthodontic-treatment/': postPath('braces-care'),
  '/different-types-of-materials-used-for-dental-bridges/': postPath('bridge-materials'),
  '/significant-facts-about-bridges-and-dental-crowns/': postPath('bridge-materials'),
  '/are-you-aware-of-emergency-dentistry/': postPath('emergency-what-counts'),
  '/everything-you-need-to-know-about-dental-emergency/': postPath('emergency-what-counts'),
  '/best-emergency-dental-care-services-in-california/': postPath('emergency-what-counts'),
  '/our-24-hours-dentist-service-to-keep-your-teeth-healthy/': postPath('emergency-what-counts'),
  '/exclusive-emergency-dental-care-for-kids/': postPath('emergency-kids'),
  '/come-out-of-misconceptions-about-dental-veneers/': postPath('veneers-vs-braces'),
  '/difference-between-periodontitis-and-gingivitis/': postPath('gingivitis-vs-perio'),
  '/never-consume-any-food-items-that-have-too-much-sugar/': postPath('sugar-teeth'),
  '/dental-hygiene-to-get-rid-of-bad-breath/': postPath('bad-breath'),
  '/the-best-approach-for-removing-a-failed-dental-implant/': postPath('implant-failure'),
  '/celebrate-the-month-of-february-for-dental-care/': PAGE_PATHS.blog,
  '/maintain-a-healthy-smile-and-have-a-good-life/': SERVICE_PATHS.preventive,
  '/preventive-dental-care-for-a-positive-experience/': SERVICE_PATHS.preventive,
  '/essential-tips-to-keep-your-teeth-healthy/': SERVICE_PATHS.preventive,
  '/caring-for-your-teeth/': SERVICE_PATHS.cleanings,
  '/cosmetic-dentistry-one-stop-solution-for-a-better-smile/': SERVICE_PATHS.cosmetic,
  '/capture-a-stunning-smile-to-make-your-face-vibrant/': SERVICE_PATHS.cosmetic,
  '/get-the-smile-you-have-always-wanted-in-woodcrest-dental-studio/': SERVICE_PATHS.cosmetic,
  '/popular-cosmetic-dentistry-treatments/': SERVICE_PATHS.cosmetic,
  '/the-best-cosmetic-dentist-in-riverside/': SERVICE_PATHS.cosmetic,
  '/want-to-restore-your-teeth-with-dental-implants/': SERVICE_PATHS.implants,
  '/woodcrest-dental-studio-helping-you-to-return-your-smile-by-the-service-of-dental-implant/': SERVICE_PATHS.implants,
  '/effective-dental-implant-in-riverside-ca/': SERVICE_PATHS.implants,
  '/caring-instructions-for-your-dentures/': SERVICE_PATHS['complete-dentures'],
  '/full-dentures-for-a-whole-new-smile/': SERVICE_PATHS['complete-dentures'],
  '/best-pediatric-dentistry-at-woodcrest-dental-studio/': SERVICE_PATHS.pediatric,
};

// Prefix redirects (e.g. old blog pagination).
export const REDIRECT_PREFIXES = [['/category/blog/page/', PAGE_PATHS.blog]];

// --- Images (photos reused from the current site, see archive/wordpress-mirror) --

const UP = 'archive/wordpress-mirror/site/wp-content/uploads/';
export const IMAGES = {
  hero: { src: UP + '2024/05/positive-girl-dentist-1.jpg', alt: 'Smiling patient giving a thumbs up in the dental chair' },
  doctor: { src: UP + '2025/10/PHOTO-2025-08-01-15-43-52-1.jpg', alt: 'Dr. Rana Skaf, DDS', position: 'center top' },
  aboutWide: { src: UP + '2024/05/aboutus_img.jpg', alt: 'Inside Hillcrest Dental Studio' },
  gallery: {
    'gal-reception': { src: UP + '2024/08/dentist-visit-2-4.jpg', alt: 'Patient being welcomed for a visit' },
    'gal-waiting': { src: UP + '2024/08/smling-woman.jpg', alt: 'Smiling patient' },
    'gal-operatory': { src: UP + '2024/08/dentistry20-1.jpg', alt: 'Treatment room' },
    'gal-steri': { src: UP + '2024/08/dental-technology.jpg', alt: 'Dental technology' },
    'gal-ct': { src: UP + '2024/05/dental-xray-2-2.jpg', alt: 'Digital dental X-ray imaging' },
    'gal-kids': { src: UP + '2024/05/dentist-visit-pediatric-1.jpg', alt: 'Child at a dental visit' },
  },
  services: {
    preventive: { src: UP + '2024/05/dental-care-2-1.jpg', alt: 'Preventive dental exam' },
    cleanings: { src: UP + '2024/08/Dental-Cleanings.jpg', alt: 'Dental cleaning' },
    pediatric: { src: UP + '2024/05/pediatric-dentistry-1920-3.jpg', alt: 'Child at the dentist' },
    'root-canals': { src: UP + '2024/05/root-canal-therapy-explaination-2.jpg', alt: 'Root canal treatment explained' },
    'crowns-bridges': { src: UP + '2024/08/bridges_img.jpg', alt: 'Dental bridge' },
    implants: { src: UP + '2024/05/dental-implants-4.jpg', alt: 'Dental implant' },
    'complete-dentures': { src: UP + '2024/05/denture-partials-new-1.jpg', alt: 'Dentures' },
    'wisdom-teeth': { src: UP + '2024/08/wisdomteethextractions_img.jpg', alt: 'Wisdom tooth X-ray' },
    cosmetic: { src: UP + '2024/05/cheerful-young-woman-having-dental-examination-clinic.jpg', alt: 'Cosmetic dental consultation' },
    whitening: { src: UP + '2024/08/teethwhitening_img.jpg', alt: 'Teeth whitening' },
    veneers: { src: UP + '2024/08/veneers_img.jpg', alt: 'Porcelain veneers' },
    invisalign: { src: UP + '2024/05/invisalign-1-1.jpg', alt: 'Invisalign clear aligners' },
    'tmj-botox': { src: UP + '2024/08/dental-jaw-botox.jpg', alt: 'Jaw treatment' },
  },
  posts: {
    'emergency-what-counts': { src: UP + '2024/05/dentist-1.jpg', alt: 'Dentist examining a patient' },
    'emergency-kids': { src: UP + '2024/05/active-kids-7-1.jpg', alt: 'Active kids playing' },
    'implant-failure': { src: UP + '2024/05/implant-supported-bridge-1.jpg', alt: 'Implant-supported bridge' },
    'bridge-materials': { src: UP + '2024/05/dental-bridges-1-scaled.jpg', alt: 'Dental bridge materials' },
    'whitening-truth': { src: UP + '2024/05/dentistry_girl_1920-1.jpg', alt: 'Bright smile' },
    'veneers-vs-braces': { src: UP + '2024/08/girl_1920-1.jpg', alt: 'Smiling young woman' },
    'kids-first-visit': { src: UP + '2024/05/dentist-visit-1.jpg', alt: 'Child meeting the dentist' },
    'sugar-teeth': { src: UP + '2024/05/dental-12.jpg', alt: 'Healthy teeth' },
    'bad-breath': { src: UP + '2024/05/dental-19-1.jpg', alt: 'Dental hygiene' },
    'gingivitis-vs-perio': { src: UP + '2024/05/dental-57.jpg', alt: 'Periodontal exam' },
    'aligner-adults': { src: UP + '2024/05/smiling-older-couple-1.jpg', alt: 'Smiling older couple' },
    'braces-care': { src: UP + '2024/05/braces-smiling-10-1.jpg', alt: 'Smiling with braces' },
  },
};

// Practice logo: white tooth mark inside a round badge (2101x2100, transparent). The build cuts the mark
// out of the badge and recolors it for the light header, the dark footer and the favicon.
export const LOGO = {
  src: 'archive/wordpress-mirror/site/wp-content/uploads/2024/07/Hillcrest-Dental-Studio_logo_b.png',
  markCrop: { left: 500, top: 500, width: 1100, height: 1100 },
};

// --- Page data (from the redesign's renderVals) -----------------------------------

export const HOURS = [{ d: 'Monday–Friday', t: '10:00 – 6:00' }, { d: 'Saturday', t: 'Closed' }, { d: 'Sunday', t: 'Closed' }];

export const TRUST_BAR = ['133 Google reviews · 4.9 stars', 'Most PPOs, Denti-Cal and IEHP', 'Same-week appointments'];

export const QUICK_REASONS = [
  { label: 'A cleaning and check-up', id: 'preventive' },
  { label: 'Something hurts', id: 'root-canals' },
  { label: 'A missing tooth', id: 'implants' },
  { label: 'Straighter teeth', id: 'invisalign' },
  { label: 'A whiter smile', id: 'whitening' },
  { label: 'My child’s first visit', id: 'pediatric' },
];

export const DIFFERENCES = [
  { num: '01', title: 'Relationships before procedures', body: 'We take time to understand you as a person, then build a plan and a payment arrangement that fits your life.', long: 'Appointments here are scheduled with room to talk. We ask what you want from your teeth over the next ten years before we recommend anything, because the right plan for a twenty-eight-year-old and a sixty-eight-year-old with the same X-ray are not the same plan.' },
  { num: '02', title: 'Technology that changes the diagnosis', body: 'Lasers, an operating microscope, intraoral cameras and scanners, CT imaging and digital X-rays.', long: 'Better images mean earlier, more accurate diagnosis and less guesswork mid-procedure. A CT scan before an implant shows exactly where bone and nerve sit. An intraoral camera means you see what we see, on a screen, rather than taking our word for it. And yes — there is Netflix in every operatory.' },
  { num: '03', title: 'Transparent, written pricing', body: 'The only surprises we like are good ones. You get the cost in writing before treatment begins.', long: 'Every plan leaves this office as a printed estimate with your insurance benefit already applied, broken into phases so you can decide what happens now and what waits. If something changes mid-treatment, we stop and talk to you before we proceed.' },
  { num: '04', title: 'You make the decision', body: 'We educate rather than instruct: all the options, all the questions answered, then your call.', long: 'Our job is to make sure you understand what is happening in your mouth, what each option costs in money and in tooth structure, and what happens if you do nothing. Then you choose. Nobody here is compensated for selling dentistry.' },
];

export const ABOUT_STATS = [
  { n: '20+', l: 'Years of clinical practice for Dr. Skaf' },
  { n: '15', l: 'Years living in Chino Valley' },
  { n: '133', l: 'Google reviews at 4.9 stars' },
  { n: '13', l: 'Services under one roof' },
];

export const CREDENTIALS = [
  { k: 'Doctorate', v: 'Doctor of Dental Surgery, Loma Linda University' },
  { k: 'Specialization', v: 'Periodontics, Damascus University' },
  { k: 'Experience', v: 'Over twenty years in general and periodontal practice' },
  { k: 'Languages', v: 'English, Arabic' },
  { k: 'Community', v: 'Chino Valley resident for fifteen years' },
];

export const GALLERY_SHOTS = [
  { sid: 'gal-reception', caption: 'Reception, looking toward Grand Ave.' },
  { sid: 'gal-waiting', caption: 'Waiting area — coffee, and not much waiting.' },
  { sid: 'gal-operatory', caption: 'A treatment room. There is a screen on the ceiling.' },
  { sid: 'gal-steri', caption: 'Sterilization suite, visible from the hallway on purpose.' },
  { sid: 'gal-ct', caption: 'CT and digital imaging.' },
  { sid: 'gal-kids', caption: 'The corner that makes seven-year-olds cooperative.' },
];

export const HOME_REVIEWS = [
  { name: 'Tom Sanchez', quote: 'Very very good dentist, good and polite staff. Would recommend them to anyone who wants a good dentist.' },
  { name: 'Rosie Chan', quote: 'Nice doctor. Cares about the needs of the patient. A good doctor that you can trust.' },
  { name: 'Karl Baim', quote: 'Excellent service by the receptionist, the nurse and the dentist. Friendly atmosphere and care for clients.' },
];

export const ALL_REVIEWS = [
  ...HOME_REVIEWS,
  { name: 'fkat28', quote: 'Friendly and efficient staff, appointment time was punctual and almost no wait.' },
  { name: 'Eric Chreng', quote: 'Great experience, knowledgeable, and quick. Had concerns with my gums and they explained the options to move forward, consistent with other opinions.' },
  { name: 'Kaushik Taylor', quote: 'The treatment done by the dentist was really good and their team was so co-operative.' },
];

export const HOME_FAQS = [
  { q: 'Do you take my insurance?', a: 'We are in network with nearly every dental PPO, plus Denti-Cal, Medi-Cal and IEHP. On the HMO side we accept DeltaCare and DHS. If your plan is not listed, call — it is often under an umbrella policy we already accept.' },
  { q: 'How soon can I be seen?', a: 'Most new patients are seen within the same week. If you are in pain, call and we will find room today.' },
  { q: 'What happens at a first visit?', a: 'About seventy-five minutes: exam, digital X-rays, periodontal charting, and a written treatment plan with costs before anything is scheduled.' },
  { q: 'Do you see children?', a: 'Yes, from the first birthday onward. We also do free happy visits for nervous kids — no instruments, five minutes in the chair.' },
];

export const FIRST_VISIT = [
  { step: 'Step 1', title: 'Paperwork, done at home', body: 'Fill the health history online and skip the clipboard entirely.', mins: '5 min online' },
  { step: 'Step 2', title: 'Exam and imaging', body: 'Digital X-rays, intraoral photographs, periodontal charting and an oral cancer screening.', mins: '25 min' },
  { step: 'Step 3', title: 'The conversation', body: 'Dr. Skaf walks you through the images on screen and explains every option, including doing nothing.', mins: '20 min' },
  { step: 'Step 4', title: 'Written plan and cost', body: 'You leave with a phased plan, your insurance benefit applied, and no obligation.', mins: '10 min' },
];

export const BRING_LIST = ['Photo ID', 'Your dental insurance card', 'A list of current medications', 'Any recent X-rays from a previous dentist'];

export const COVERAGE = [
  { kind: 'PPO', title: 'Nearly every PPO plan', body: 'We accept all major dental PPOs. If yours is not listed anywhere, it is likely under an umbrella policy with a carrier we already work with — one call confirms it.' },
  { kind: 'HMO', title: 'DeltaCare and DHS', body: 'On the HMO side we accept DeltaCare and DHS only. Other HMO plans can still be seen on a fee-for-service basis.' },
  { kind: 'Government', title: 'Denti-Cal, Medi-Cal and IEHP', body: 'We are in network with Denti-Cal, Medi-Cal and IEHP, for both children and adults.' },
];

// `online` and `pdf` are links to the practice's hosted forms. Until they are set, both buttons
// open an email request to the office so the button still does something useful.
export const FORMS_LIST = [
  { id: 'health-history', name: 'Patient health history', note: 'Medical conditions, medications and allergies. Required before your first visit.', online: null, pdf: null },
  { id: 'hipaa', name: 'HIPAA acknowledgement', note: 'How we handle your health information.', online: null, pdf: null },
  { id: 'consent', name: 'Consent to treatment', note: 'Standard consent for examination and routine care.', online: null, pdf: null },
  { id: 'financial-policy', name: 'Insurance and financial policy', note: 'Billing, assignment of benefits and cancellation terms.', online: null, pdf: null },
  { id: 'child-registration', name: 'Child patient registration', note: 'For patients under eighteen, signed by a parent or guardian.', online: null, pdf: null },
];

export const ACCESS_ITEMS = ['Step-free entry from the parking lot', 'Wheelchair-accessible operatories and restroom', 'Large-print forms and treatment plans on request', 'Arabic spoken in the office'];

export const SITEMAP_GROUPS = [
  { cat: 'Practice', links: [['Home', 'home'], ['Who We Are', 'about'], ['Meet Dr. Skaf', 'doctors'], ['The Difference', 'difference'], ['Office Gallery', 'gallery'], ['Patient Reviews', 'testimonials']] },
  { cat: 'Patients', links: [['New Patients', 'new-patients'], ['Insurance & Payment', 'insurance'], ['Online Forms', 'forms'], ['Appointments', 'appointments'], ['Contact & Directions', 'contact']] },
  { cat: 'Services', links: [['All Services', 'services']] },
  { cat: 'Library & Legal', links: [['Patient Library', 'blog'], ['Accessibility', 'accessibility'], ['Site Map', 'sitemap']] },
];

export const BOOKING_REASONS = [
  { label: 'Cleaning & check-up', note: 'Routine hygiene visit' },
  { label: 'New patient exam', note: 'First visit, full assessment' },
  { label: 'Tooth pain', note: 'Something hurts' },
  { label: 'Missing or broken tooth', note: 'Implants, crowns, dentures' },
  { label: 'Cosmetic consultation', note: 'Whitening, veneers, alignment' },
  { label: 'My child', note: 'Pediatric visit' },
];

export const BOOKING_TIMES = ['Morning', 'Afternoon', 'Late afternoon'];

// --- SEO -------------------------------------------------------------------------

export const PAGE_META = {
  home: { title: 'Hillcrest Dental Studio | Family Dentist in Chino Hills, CA', description: 'Family dentistry in Chino Hills with Dr. Rana Skaf, DDS. Same-week appointments, transparent pricing, most PPOs, Denti-Cal and IEHP accepted. Call (909) 927-5333.' },
  services: { title: 'Dental Services in Chino Hills | Hillcrest Dental Studio', description: 'Thirteen dental services under one roof: cleanings, pediatric care, root canals, crowns, implants, dentures, whitening, veneers, Invisalign and TMJ treatment.' },
  appointments: { title: 'Request an Appointment | Hillcrest Dental Studio', description: 'Request a visit at Hillcrest Dental Studio in four quick steps. We confirm every request by phone within one business day.' },
  'new-patients': { title: 'New Patients | Hillcrest Dental Studio, Chino Hills', description: 'What to expect at your first visit, what to bring, and how to complete your forms before you arrive.' },
  insurance: { title: 'Insurance & Payment | Hillcrest Dental Studio', description: 'We accept nearly every dental PPO, DeltaCare and DHS HMOs, plus Denti-Cal, Medi-Cal and IEHP. Membership plan and financing available.' },
  about: { title: 'Who We Are | Hillcrest Dental Studio, Chino Hills', description: 'A neighborhood family dental practice serving Chino Hills since 2010 — unhurried appointments and written treatment costs.' },
  doctors: { title: 'Meet Dr. Rana Skaf, DDS | Hillcrest Dental Studio', description: 'Dr. Rana Skaf brings over twenty years of general and periodontal dentistry to Chino Hills families.' },
  difference: { title: 'The Difference | Hillcrest Dental Studio', description: 'Relationships before procedures, modern diagnostic technology, written pricing, and decisions that stay yours.' },
  gallery: { title: 'Office Gallery | Hillcrest Dental Studio', description: 'See Hillcrest Dental Studio before your visit.' },
  testimonials: { title: 'Patient Reviews | Hillcrest Dental Studio', description: '133 Google reviews at 4.9 stars from Chino Hills patients.' },
  blog: { title: 'Patient Library | Hillcrest Dental Studio', description: 'Straight answers on dental emergencies, implants, cosmetic dentistry, kids, prevention and orthodontics.' },
  contact: { title: 'Contact & Directions | Hillcrest Dental Studio, Chino Hills', description: '2130 Grand Ave H, Chino Hills, CA 91709. Call (909) 927-5333. Open Monday–Friday 10:00–6:00.' },
  forms: { title: 'Online Forms | Hillcrest Dental Studio', description: 'Complete your patient paperwork before you arrive.' },
  sitemap: { title: 'Site Map | Hillcrest Dental Studio', description: 'Every page on the Hillcrest Dental Studio website.' },
  accessibility: { title: 'Accessibility | Hillcrest Dental Studio', description: 'Our commitment to an accessible website and office.' },
  thanks: { title: 'Thank You | Hillcrest Dental Studio', description: 'We have received your request.', noindex: true },
  '404': { title: 'Page Not Found | Hillcrest Dental Studio', description: 'That page has moved.', noindex: true },
};
