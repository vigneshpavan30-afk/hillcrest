// Copied verbatim from design/Site Page.dc.html (services, groups, articles, topics).
export const SERVICES = [
  { id:'preventive', name:'Preventive Dental Care', short:'preventive care', cat:'Preventive & Family',
    dek:'Twice-yearly visits that catch problems while they are still small and cheap to fix.',
    paras:[
      'Almost everything expensive in dentistry began as something small. A stained groove becomes a cavity; bleeding gums become bone loss. Preventive care exists to interrupt that sequence, and it is the single highest-return appointment on our schedule.',
      'Your hygiene visit includes a full periodontal charting, digital X-rays on the schedule your risk actually calls for, an oral cancer screening, and time to talk about what we saw on the intraoral camera. You will see your own teeth on the screen — that tends to make the plan obvious.'
    ],
    includes:['Exam with intraoral camera photos','Periodontal charting and risk scoring','Digital X-rays as indicated','Fluoride varnish and sealants for kids'],
    facts:[{k:'Visit length',v:'50–60 minutes'},{k:'How often',v:'Every 6 months'},{k:'Typical PPO cost',v:'Covered at 100%'}],
    faqs:[
      {q:'Do I really need X-rays every visit?',a:'No. We take them on a risk-based schedule — often every 18 to 24 months for a low-risk adult, more frequently if you have active decay or gum disease.'},
      {q:'My gums bleed when I floss. Is that normal?',a:'It is common, but it is not normal. Bleeding is inflammation. Tell us at your visit and we will look for the cause instead of just recommending harder brushing.'}
    ]},
  { id:'cleanings', name:'Dental Cleanings', short:'a cleaning', cat:'Preventive & Family',
    dek:'A thorough hygiene appointment with a hygienist who is given enough time to be gentle.',
    paras:[
      'A cleaning removes the hardened plaque that a toothbrush cannot reach, above and just below the gumline. We use ultrasonic scaling followed by hand instruments, then polish and, if you want it, fluoride varnish.',
      'If charting shows deeper pockets or bone loss, a standard cleaning is not the right treatment and we will say so. Scaling and root planing is done by quadrant with local anesthetic, and we will quote it in writing before we begin.'
    ],
    includes:['Ultrasonic and hand scaling','Stain polishing','Fluoride varnish on request','Home-care coaching for your specific trouble spots'],
    facts:[{k:'Visit length',v:'45–60 minutes'},{k:'Anesthetic',v:'Rarely needed'},{k:'Follow-up',v:'6 months'}],
    faqs:[
      {q:'Will it hurt?',a:'For most healthy mouths, no. If your gums are inflamed or your roots are sensitive, we can apply topical anesthetic before we start — just ask.'},
      {q:'How long since my last cleaning is too long?',a:'There is no point at which we will lecture you. Many of our patients arrive after five or more years away. We start where you are.'}
    ]},
  { id:'pediatric', name:'Pediatric Dentistry', short:'your child\u2019s visit', cat:'Preventive & Family',
    dek:'First visits built around a child\u2019s attention span, with a parent in the room the whole time.',
    paras:[
      'We recommend a first visit around the first birthday — mostly so the child learns that this room is boring and safe rather than alarming. Early appointments are short: a lap exam, a count of the teeth, a fluoride varnish, and a conversation with you about bottles, cups and brushing.',
      'For older kids we use tell-show-do: every instrument is named and demonstrated on a finger before it goes near a tooth. Sealants go on the permanent molars as soon as they erupt, which is the cheapest cavity prevention that exists.'
    ],
    includes:['Lap exams for toddlers','Sealants on erupting molars','Fluoride varnish','Habit and diet coaching for parents'],
    facts:[{k:'First visit',v:'Age 1'},{k:'Visit length',v:'30 minutes'},{k:'Parent present',v:'Always'}],
    faqs:[
      {q:'My child is terrified. What then?',a:'We schedule a free happy visit: no instruments, no treatment. They sit in the chair, ride it up and down, and go home with a toothbrush. It works more often than you would think.'},
      {q:'Are baby teeth worth treating?',a:'Yes. A decayed primary molar can hurt, can abscess, and holds space for the adult tooth behind it. Losing it early often means orthodontics later.'}
    ]},
  { id:'root-canals', name:'Root Canals', short:'root canal treatment', cat:'Restorative',
    dek:'The treatment that ends the pain, done under a microscope in one or two visits.',
    paras:[
      'A root canal treats infection inside the tooth. The nerve tissue is removed, the canals are shaped and disinfected, and the space is sealed. The tooth stays in your mouth and keeps doing its job — which is why it beats extraction whenever the tooth is restorable.',
      'The procedure has a reputation it no longer deserves. With modern anesthetic and rotary instrumentation, the appointment is usually less eventful than a deep filling. What hurt was the infection; the treatment is what stops it.'
    ],
    includes:['Digital diagnosis and vitality testing','Local anesthesia and rubber dam isolation','Microscope-assisted canal shaping','Crown planning to protect the tooth afterward'],
    facts:[{k:'Visits',v:'1–2'},{k:'Visit length',v:'60–90 minutes'},{k:'Success rate',v:'Over 90%'}],
    faqs:[
      {q:'Root canal or extraction?',a:'If the tooth has enough sound structure left, save it — nothing replaces a natural root for free. We will show you the X-ray and the cost of both paths before you decide.'},
      {q:'Do I need a crown afterward?',a:'Usually yes, on back teeth. A treated molar is brittle and a crown prevents the fracture that would cost you the tooth.'}
    ]},
  { id:'crowns-bridges', name:'Crowns & Bridges', short:'crowns and bridges', cat:'Restorative',
    dek:'Rebuilding a broken tooth, or closing a gap, with restorations shaped from a digital scan.',
    paras:[
      'A crown caps a tooth that has cracked, worn down, or lost too much structure to hold a filling. A bridge spans a gap by anchoring to the teeth on either side. Both begin with an intraoral scan — no impression putty — so the fit is right the first time.',
      'We use zirconia or layered porcelain depending on where the tooth sits and how hard you grind. Front teeth get the material that handles light like enamel; molars get the one that survives a bite force of two hundred pounds.'
    ],
    includes:['Digital intraoral scanning','Temporary crown while the lab works','Shade matching to adjacent teeth','Bite adjustment at delivery'],
    facts:[{k:'Visits',v:'2'},{k:'Lab time',v:'About 2 weeks'},{k:'Lifespan',v:'10–15 years+'}],
    faqs:[
      {q:'Crown or bridge or implant?',a:'If the neighbouring teeth are healthy, an implant usually preserves more tooth structure than a bridge. If they already need crowns, a bridge does two jobs at once. We price all options.'},
      {q:'Will it look like a real tooth?',a:'On a front tooth we take shade photographs and, when it matters, have you visit the lab technician. Matching a single central incisor is the hardest thing in dentistry and we treat it that way.'}
    ]},
  { id:'implants', name:'Dental Implants', short:'dental implants', cat:'Restorative',
    dek:'A titanium root that replaces a missing tooth without touching the teeth beside it.',
    paras:[
      'An implant is a small titanium post placed in the jawbone, which the bone grows onto over a few months. A custom abutment and crown go on top. The result is a tooth you clean with a toothbrush and floss, not a partial you take out at night.',
      'Planning starts with a CT scan so we know exactly where the bone and nerves are before anything is placed. If there is not enough bone, grafting is part of the plan and part of the quote — not a surprise added later.'
    ],
    includes:['CT scan and guided surgical planning','Implant placement under local anesthetic','Custom abutment and crown','Bone grafting when indicated'],
    facts:[{k:'Total timeline',v:'3–6 months'},{k:'Surgery',v:'60–90 minutes'},{k:'Survival at 10 yrs',v:'Around 95%'}],
    faqs:[
      {q:'Is the surgery painful?',a:'The placement itself is done with local anesthetic and most patients describe it as easier than an extraction. Ibuprofen usually covers the following day.'},
      {q:'Can I get the crown the same day?',a:'Sometimes. If the bone is dense and the site is clean, immediate temporization is possible. If not, waiting three months is what makes it last twenty years.'}
    ]},
  { id:'complete-dentures', name:'Complete Dentures', short:'dentures', cat:'Restorative',
    dek:'Full upper and lower dentures fitted over several appointments so the bite is actually right.',
    paras:[
      'A denture that was rushed is a denture that lives in a drawer. We take the time the process needs: impressions, a bite registration, a wax try-in you can look at in a mirror and veto, and only then the finished appliance.',
      'For patients who have worn a loose lower denture for years, two implants can convert it into something that snaps in and stays. It is the single most life-changing upgrade we offer, and it costs far less than a full arch of implants.'
    ],
    includes:['Custom impressions and bite registration','Wax try-in and shade approval','Delivery with adjustment appointments included','Implant-retained options discussed'],
    facts:[{k:'Visits',v:'4–5'},{k:'Timeline',v:'6–8 weeks'},{k:'Adjustments',v:'Included'}],
    faqs:[
      {q:'How long until I can eat normally?',a:'Two to six weeks of learning. Start with soft food cut small, chew on both sides at once, and expect your tongue to need practice.'},
      {q:'Will anyone be able to tell?',a:'Not if the teeth are set the way real teeth sit — slightly irregular, with age-appropriate shade. Perfectly uniform white teeth are what look false.'}
    ]},
  { id:'wisdom-teeth', name:'Wisdom Teeth Extractions', short:'wisdom tooth removal', cat:'Surgical',
    dek:'Assessment and removal of third molars, with a clear answer on whether they need to go at all.',
    paras:[
      'Not every wisdom tooth needs to come out. If it has erupted upright, has room, and you can clean it, we will monitor it. Removal is for teeth that are impacted, decaying, crowding, or repeatedly infected.',
      'When they do come out, planning matters more than speed. A CT scan shows the relationship to the nerve and the sinus. Most extractions are done here under local anesthetic; complex cases are referred to an oral surgeon we trust.'
    ],
    includes:['CT imaging and nerve proximity assessment','Local anesthetic, sedation options discussed','Written aftercare and a follow-up call','Referral for complex impactions'],
    facts:[{k:'Visit length',v:'45–75 minutes'},{k:'Recovery',v:'3–5 days'},{k:'Age window',v:'17–25 is easiest'}],
    faqs:[
      {q:'Should I have all four out at once?',a:'If all four need removal, doing them in one appointment means one recovery instead of two. If only one is a problem, we take one.'},
      {q:'What about dry socket?',a:'Avoid straws, smoking and vigorous rinsing for three days. If pain climbs on day three instead of falling, call us — it is quick to treat.'}
    ]},
  { id:'cosmetic', name:'Cosmetic Dentistry', short:'a smile consultation', cat:'Cosmetic',
    dek:'A plan for your smile that starts with photographs and your own words, not a catalogue.',
    paras:[
      'Cosmetic work goes wrong when it starts with a procedure instead of a goal. Our consultation begins with photographs, a mirror, and a question: what specifically bothers you? Sometimes the answer is whitening and a single bonded edge, not ten veneers.',
      'Once we agree on the goal we can show you a digital preview before anything irreversible happens. You will see the proposed shape and shade on your own face, and you can say no.'
    ],
    includes:['Photographic smile analysis','Digital preview of the proposed result','Staged plan with costs per phase','Conservative options presented first'],
    facts:[{k:'Consultation',v:'45 minutes'},{k:'Preview',v:'Before treatment'},{k:'Approach',v:'Least tooth removed'}],
    faqs:[
      {q:'How much does a smile makeover cost?',a:'It depends entirely on how many teeth are involved and what each one needs. We quote in phases so you can start with the visit that matters most and stop whenever you like.'},
      {q:'Is it covered by insurance?',a:'Purely cosmetic work usually is not. Where a tooth also needs restoration for health reasons, part of it often is — we will check before you commit.'}
    ]},
  { id:'whitening', name:'Teeth Whitening', short:'whitening', cat:'Cosmetic',
    dek:'In-office and custom take-home whitening, with an honest prediction of your result.',
    paras:[
      'Whitening works on the natural tooth and does nothing to crowns, veneers or fillings. That is the first thing to know, because it determines whether whitening alone will get you where you want to go, or whether it needs to be followed by replacing an old front filling.',
      'In-office treatment takes about ninety minutes and gives you the fastest change. Custom trays worn at home for two weeks reach a similar place more gently and are easier to top up later. Many patients do one of each.'
    ],
    includes:['Shade record before and after','Gum isolation for in-office treatment','Custom-fitted take-home trays','Desensitizing protocol for sensitive teeth'],
    facts:[{k:'In-office',v:'90 minutes'},{k:'Take-home',v:'10–14 nights'},{k:'Typical change',v:'4–8 shades'}],
    faqs:[
      {q:'Will it make my teeth sensitive?',a:'Temporarily, for some people. We use a potassium nitrate desensitizer and can drop the gel concentration or shorten wear time if you are sensitive.'},
      {q:'How long does it last?',a:'One to three years depending on coffee, tea, red wine and tobacco. A few nights of trays once a year keeps it where you like it.'}
    ]},
  { id:'veneers', name:'Veneers', short:'veneers', cat:'Cosmetic',
    dek:'Thin porcelain facings for chipped, worn or permanently discolored front teeth.',
    paras:[
      'A veneer covers the front of a tooth to change its shape, shade or alignment. Done well, very little enamel is removed and the result is indistinguishable from a healthy tooth. Done badly, it is obvious from across a room.',
      'We plan veneers from photographs and a wax-up, and we mock the proposed shape directly onto your teeth in composite before we prepare anything. You get to live with the new shape for an afternoon and approve it.'
    ],
    includes:['Photographic and wax-up planning','Trial smile mocked onto your teeth','Minimal-preparation technique where possible','Lab technician shade verification'],
    facts:[{k:'Visits',v:'2–3'},{k:'Timeline',v:'3–4 weeks'},{k:'Lifespan',v:'10–15 years'}],
    faqs:[
      {q:'Do you have to grind my teeth down?',a:'Far less than you have read. Where the tooth is already worn or tipped back, some cases need almost no reduction. We only remove what the final shape requires.'},
      {q:'Veneers or orthodontics?',a:'If the teeth are the right shape but in the wrong place, move them — it is cheaper and keeps your enamel. Veneers are for teeth whose shape or colour is the problem.'}
    ]},
  { id:'invisalign', name:'Invisalign', short:'Invisalign', cat:'Orthodontics & Specialty',
    dek:'Clear aligners for crowding, spacing and relapse — with a free consultation to see if you qualify.',
    paras:[
      'Age is not a barrier to straightening teeth. Roughly a third of our aligner patients are over forty, most of them correcting a relapse from braces they wore as teenagers. What matters is bone health and case complexity, not birthdate.',
      'At your consultation we scan your teeth and show you a simulation of the projected outcome before you commit to anything. If your case is better served by fixed braces or by a specialist, we will tell you that instead of selling you aligners.'
    ],
    includes:['Free consultation and digital scan','Outcome simulation before you start','Aligners plus refinement trays','Retainers and a retention plan'],
    facts:[{k:'Typical length',v:'6–18 months'},{k:'Wear time',v:'20–22 hrs/day'},{k:'Consultation',v:'Free'}],
    faqs:[
      {q:'Can people tell I am wearing them?',a:'Rarely at conversational distance. You will notice them far more than anyone else does, and they come out to eat.'},
      {q:'What if I am not a candidate?',a:'Severe crowding, certain bite problems and some rotations need fixed appliances. We say so at the consultation, at no cost.'}
    ]},
  { id:'tmj-botox', name:'TMJ Treatment with Botox', short:'TMJ treatment', cat:'Orthodontics & Specialty',
    dek:'For jaw pain, clenching and grinding that a night guard alone has not resolved.',
    paras:[
      'Chronic jaw pain usually comes from muscles working harder than they should. The first line of treatment is conservative: a properly adjusted night guard, a look at the bite, and habit awareness. For many patients that is enough.',
      'When it is not, small doses of botulinum toxin placed in the masseter and temporalis reduce the force those muscles can generate. Relief typically arrives within two weeks and lasts three to four months. It is used alongside a guard, not instead of one.'
    ],
    includes:['Muscle and joint examination','Custom night guard if not already worn','Targeted injections by Dr. Skaf','Two-week review of symptom change'],
    facts:[{k:'Appointment',v:'30 minutes'},{k:'Onset of relief',v:'3–14 days'},{k:'Duration',v:'3–4 months'}],
    faqs:[
      {q:'Will it change how my face looks?',a:'Doses aimed at clenching are lower than cosmetic doses. Long-term treatment can slim a heavily overdeveloped masseter, which most patients consider a bonus.'},
      {q:'Is it covered by insurance?',a:'Sometimes, when it is documented as treatment for bruxism or TMD rather than cosmetics. We will submit a pre-authorisation for you.'}
    ]}
];

export const GROUPS = [
  { cat:'Preventive & Family', blurb:'The visits that keep everything else off this list.', ids:['preventive','cleanings','pediatric'] },
  { cat:'Restorative', blurb:'Repairing and replacing teeth that are damaged or missing.', ids:['root-canals','crowns-bridges','implants','complete-dentures','wisdom-teeth'] },
  { cat:'Cosmetic', blurb:'Changing shape, shade and alignment — conservatively.', ids:['cosmetic','whitening','veneers'] },
  { cat:'Orthodontics & Specialty', blurb:'Straightening teeth and settling jaw pain.', ids:['invisalign','tmj-botox'] }
];

export const POSTS = [
  { id:'emergency-what-counts', topic:'Emergencies', mins:5, date:'Aug 2026',
    title:'What actually counts as a dental emergency', dek:'Four situations that need a call today, and three that can safely wait until Monday.',
    ctaTitle:'In pain now? Call us first.',
    sections:[
      {h:'Call today', p:'A knocked-out permanent tooth, swelling that is spreading toward the eye or throat, uncontrolled bleeding after an extraction, and pain severe enough to keep you awake are all same-day problems. Swelling in particular is time-sensitive: infection that tracks into the tissues of the face or neck stops being a dental problem and becomes a hospital one.'},
      {h:'Call this week', p:'A cracked tooth that hurts when you bite, a lost crown, a filling that fell out, or a sore that has not healed in two weeks should be seen within days. None of these are dangerous tonight, but all of them get more expensive the longer they wait — an exposed dentine surface can go from a filling to a root canal in a fortnight.'},
      {h:'What to do before you arrive', p:'For a knocked-out tooth, hold it by the crown, rinse it in milk or saline, and either reinsert it or transport it in milk. For swelling, do not apply heat. For pain, ibuprofen outperforms paracetamol for dental inflammation unless you cannot take it. Bring a list of your medications.'}
    ]},
  { id:'emergency-kids', topic:'Emergencies', mins:4, date:'Jul 2026',
    title:'Your child chipped a tooth. Here is the next hour.', dek:'A calm sequence for playground accidents, and why baby teeth are handled differently.',
    ctaTitle:'Bring them in today.',
    sections:[
      {h:'First, assess the head', p:'Dental injuries in children rarely happen alone. Before you look in the mouth, check for loss of consciousness, vomiting, or confusion — those go to urgent care first. Once you are satisfied the head is fine, you can turn to the tooth.'},
      {h:'Baby teeth are not reimplanted', p:'A knocked-out primary tooth is not put back, because the attempt risks damaging the permanent tooth developing above it. Control the bleeding with gauze pressure, keep the child upright, and call us. A knocked-out permanent tooth is the opposite: it goes back in immediately if you can manage it.'},
      {h:'Chips and cracks', p:'Save any fragment in milk — we can often bond it back on and it will match perfectly because it is the child\u2019s own enamel. Soft diet, no biting with the front teeth, and an appointment within a day or two so we can check whether the nerve was involved.'}
    ]},
  { id:'implant-failure', topic:'Implants & Restoration', mins:6, date:'Jun 2026',
    title:'Why dental implants fail, and what happens next', dek:'Failure is uncommon but not mysterious. Here are the causes and the realistic repair path.',
    ctaTitle:'Concerned about an existing implant?',
    sections:[
      {h:'Early failure versus late failure', p:'Early failure happens within the first months and almost always means the bone never integrated — often because of poor initial stability, an infected site, or heavy loading too soon. Late failure is usually peri-implantitis: bacterial inflammation that destroys the bone around a previously solid implant.'},
      {h:'Smoking, diabetes and hygiene', p:'The three strongest risk factors are tobacco, uncontrolled diabetes, and inadequate cleaning around the implant. None of them make you ineligible, but all of them change the odds enough that we discuss them honestly before placement rather than after.'},
      {h:'Removal and replacement', p:'A failed implant is usually removed with a reverse-torque device, which is far less traumatic than it sounds. The site is grafted, given three to six months to heal, and a new implant placed. Success rates on the second attempt are good — typically in the high eighties.'}
    ]},
  { id:'bridge-materials', topic:'Implants & Restoration', mins:5, date:'May 2026',
    title:'Bridge materials, compared without the sales pitch', dek:'Zirconia, layered porcelain, metal-ceramic: what each one is actually good at.',
    ctaTitle:'Get a quote on all three.',
    sections:[
      {h:'Monolithic zirconia', p:'Milled from a single block, extremely strong, and nearly impossible to fracture. Its weakness is optics — it handles light slightly more flatly than enamel. This is the default for molars and for anyone who grinds.'},
      {h:'Layered porcelain on zirconia', p:'A zirconia core for strength with porcelain layered on the visible surface for translucency. This is what goes on front teeth, where matching the way light passes through a natural incisor matters more than surviving a molar bite force.'},
      {h:'Metal-ceramic', p:'The old workhorse: a metal substructure with porcelain fired over it. Reliable and well documented over decades, but the metal margin can show a grey line at the gum over time. Still the right answer for some long-span cases.'}
    ]},
  { id:'whitening-truth', topic:'Cosmetic', mins:5, date:'Jun 2026',
    title:'Whitening: what works, what does not, and what it cannot fix', dek:'Charcoal, whitening strips, in-office gel and the stains that need a different treatment entirely.',
    ctaTitle:'Ask about a shade prediction.',
    sections:[
      {h:'Peroxide is the active ingredient', p:'Every whitening product that works does so by delivering hydrogen peroxide or carbamide peroxide into the tooth, where it breaks down pigmented molecules. Products without it — charcoal pastes, most natural remedies — remove surface stain at best and abrade enamel at worst.'},
      {h:'Concentration versus contact time', p:'In-office gel is strong and works in ninety minutes. Take-home trays are weaker but sit against the tooth for hours a night across two weeks. Both arrive at a similar endpoint; the tray route is gentler on sensitivity and easier to maintain.'},
      {h:'What whitening cannot do', p:'It will not change a crown, a veneer or a filling. It does poorly on grey tetracycline staining and on a single dark tooth that has had root canal treatment — that one needs internal bleaching or a veneer. Knowing this in advance saves disappointment.'}
    ]},
  { id:'veneers-vs-braces', topic:'Cosmetic', mins:5, date:'Apr 2026',
    title:'Veneers or orthodontics? A simple way to decide', dek:'One question sorts most cases: is the problem the shape of the tooth or its position?',
    ctaTitle:'Get both options priced.',
    sections:[
      {h:'Shape versus position', p:'If your teeth are well-formed but crowded, rotated or tipped, move them. Orthodontics is less expensive than porcelain, removes no enamel, and leaves you with your own teeth. If the teeth are in reasonable positions but chipped, worn, short or permanently discolored, veneers address the actual problem.'},
      {h:'The combined case', p:'Frequently the honest answer is both: six months of aligners to get the teeth into position, then two or four veneers to finish the shapes. Done in that order, far less enamel is removed than if porcelain had been used to fake the alignment.'},
      {h:'Questions to ask before you commit', p:'How much enamel is being removed? Can I see a trial smile first? What happens in fifteen years when these need replacing? A clinician who answers all three comfortably is one you can trust with your front teeth.'}
    ]},
  { id:'kids-first-visit', topic:'Kids', mins:4, date:'Jul 2026',
    title:'Preparing a nervous child for a first dental visit', dek:'What to say, what not to say, and why the words you choose matter more than the appointment.',
    ctaTitle:'Book a free happy visit.',
    sections:[
      {h:'Avoid the reassurance trap', p:'“It won\u2019t hurt” introduces the idea of hurt. So does promising a reward for being brave — bravery implies danger. Describe the visit factually instead: someone will count your teeth, take a photo of them, and clean them with a small buzzy brush.'},
      {h:'Timing is half the battle', p:'Book a morning slot, before tiredness. Do not schedule around a nap. Feed them first, because a hungry three-year-old has no patience for anything. And arrive a few minutes early so the waiting room is a discovery rather than a rush.'},
      {h:'Let them come and see nothing happen', p:'Our happy visit exists for this: no instruments, no treatment, five minutes in the chair, and home with a toothbrush. Children who have already sat in the chair once behave completely differently at the appointment that matters.'}
    ]},
  { id:'sugar-teeth', topic:'Kids', mins:5, date:'Mar 2026',
    title:'It is not how much sugar — it is how often', dek:'Frequency, not quantity, drives childhood decay. This changes what you pack in a lunchbox.',
    ctaTitle:'Ask us about sealants.',
    sections:[
      {h:'The acid clock', p:'Every time sugar reaches plaque bacteria, they produce acid for roughly twenty minutes and the tooth surface demineralizes. Saliva then repairs it. A whole chocolate bar eaten at once means one acid cycle. The same bar nibbled across an afternoon means six.'},
      {h:'The worst offenders are not sweets', p:'Sipped juice, sports drinks, sweetened coffee and dried fruit are more damaging than dessert, because they extend contact time. A water bottle at school and sweets kept to mealtimes does more for a child\u2019s teeth than any brand of toothpaste.'},
      {h:'What to do instead', p:'Group sugar with meals, rinse with water afterwards, and do not brush immediately after acidic drinks — wait thirty minutes so you are not scrubbing softened enamel. Sealants on the permanent molars cover the grooves that brushing cannot reach.'}
    ]},
  { id:'bad-breath', topic:'Prevention', mins:5, date:'May 2026',
    title:'Persistent bad breath is a diagnosis, not a hygiene failure', dek:'Most chronic halitosis has a findable cause. Mouthwash is not the treatment.',
    ctaTitle:'Let us find the cause.',
    sections:[
      {h:'Where the smell comes from', p:'Roughly nine cases in ten originate in the mouth: bacteria on the back of the tongue, under the gumline, or in a decayed tooth producing volatile sulphur compounds. Mouthwash masks these for twenty minutes. Removing the source ends them.'},
      {h:'The things people miss', p:'Tongue cleaning, interdental brushing where floss cannot reach, and a dry mouth caused by medication are the three most common overlooked contributors. Antihistamines, antidepressants and blood pressure drugs all reduce saliva, and saliva is your main defence.'},
      {h:'When it is not the mouth', p:'If a thorough dental examination is clean, the cause may be sinus, tonsillar or gastric. We will say so and refer you, rather than selling you another cleaning.'}
    ]},
  { id:'gingivitis-vs-perio', topic:'Prevention', mins:6, date:'Feb 2026',
    title:'Gingivitis versus periodontitis: the line that matters', dek:'One is fully reversible. The other is managed for life. Knowing which you have changes everything.',
    ctaTitle:'Get a periodontal chart.',
    sections:[
      {h:'Gingivitis', p:'Inflammation confined to the gum tissue. Gums are red, puffy and bleed when brushed, but the attachment and bone are intact. With a proper cleaning and two weeks of decent home care it resolves completely, with no lasting damage.'},
      {h:'Periodontitis', p:'Once inflammation reaches the bone, that bone does not come back. Pockets deepen, teeth loosen, and treatment shifts from cure to control: scaling and root planing, tighter recall intervals, sometimes surgery. Stabilization is achievable; reversal is not.'},
      {h:'How we tell the difference', p:'Six measurements per tooth with a periodontal probe, plus X-rays to see bone levels. It takes ten minutes and it is the only way to know which side of the line you are on. If nobody has ever charted your gums, ask why.'}
    ]},
  { id:'aligner-adults', topic:'Orthodontics', mins:5, date:'Apr 2026',
    title:'Straightening teeth after forty', dek:'Why adult orthodontics behaves differently, and what relapse from teenage braces really needs.',
    ctaTitle:'Book a free aligner consultation.',
    sections:[
      {h:'Bone responds more slowly', p:'Adult bone remodels at a slower rate than a teenager\u2019s, so treatment takes somewhat longer and forces are kept lighter. That is the main difference. Gum health matters far more than age: inflamed, receding gums are a contraindication until treated.'},
      {h:'Relapse is the most common case', p:'A large share of adult aligner treatment corrects crowding that returned after braces in adolescence, usually because retainers stopped being worn. These cases are often quick — six to nine months — because the teeth are returning to positions they once held.'},
      {h:'Retention is the whole game', p:'Whatever moved the teeth, something must hold them. Expect a bonded wire behind the front teeth, a removable retainer at night, or both, indefinitely. Patients who treat retention as optional end up back where they started.'}
    ]},
  { id:'braces-care', topic:'Orthodontics', mins:4, date:'Jan 2026',
    title:'Keeping your mouth healthy during orthodontic treatment', dek:'Appliances make plaque easier to accumulate and harder to remove. Here is the routine that works.',
    ctaTitle:'Book a hygiene visit.',
    sections:[
      {h:'Decalcification is the real risk', p:'The white square outlines left behind when brackets come off are permanent enamel damage from plaque that sat undisturbed. They are entirely preventable, and preventing them is the point of every instruction below.'},
      {h:'The tools that matter', p:'An interdental brush for under the archwire, a fluoride mouth rinse at a different time of day from brushing, and floss threaders or a water flosser. Electric brushes help. Brushing after every meal helps more than brushing harder twice a day.'},
      {h:'Aligners have their own rules', p:'Never eat or drink anything but water with them in — sugar trapped under plastic against enamel for hours is the worst possible arrangement. Rinse them every time they come out, clean them daily, and keep the case with you so they do not end up in a napkin.'}
    ]}
];

export const TOPICS = ['All','Emergencies','Implants & Restoration','Cosmetic','Kids','Prevention','Orthodontics'];
