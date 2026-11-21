/**
 * Content extracted from the WebEaz reference pages (about-us, our-vision,
 * clients, our-teams). Kept verbatim — these strings are the source of truth
 * for the four corresponding routes and are not rewritten marketing copy.
 */

export const ABOUT = {
  heroTitle: "A Team of Creative Designers, Technologists and Digital Marketing Experts",
  heroEyebrow: "WE ARE WEBEAZIAN",
  whoTitle: "WHO WE ARE",
  who: [
    "We are a Digital Transformation Company with more than twenty years of seasoned experience in digital services. We provide end-to-end digital services and advisory solutions for your business.",
  ],
  quote: "We don’t just sell businesses; we help your business sell prominently.",
  methodologyTitle: "OUR METHODOLOGY",
  methodology: [
    'Our Business Methodology has two aspects- “Innovation & Strategy” Innovation is our motto; strategy is our procedure in the prominent technical sphere, so we like to be addressed as "technologists," "creators," "thought leaders," "strategists," and the "go-to persons" for any of your requirements related to web and mobile application development, E-commerce, digital marketing, and social media promotion.',
  ],
  influenceTitle: "OUR INFLUENCE",
  influence: [
    "Influence is scalable, not by the extent of the surface it covers but by the actions it emphasizes Geographically, though we are in Bangalore, India, the influence of our competency is worldwide, which has brought us a huge global client base. Every time, we endeavour to meet or exceed the all-encompassing standards & ethics.",
  ],
  whatTitle: "WHAT WE DO",
  what: [
    "We don’t just make ideas; we shape ideas to come into being! We believe that our innovative ideas are the ones that broaden and prosper the Marketing Industry. We do ERP Software, Website & Mobile Application Development, eCommerce Development, Digital Marketing Service, Social Media Promotions.",
    "We are a transparent firm to claim honestly that, what we assure to do any company else can do but the entity what has made us stand-alone from the market is, “how we do our work”. It is not that significant “what we do”, “how we do your job” matters a lot!",
  ],
  howTitle: "HOW WE DO",
  how: [
    "Our Ideology is driven by our passion to deliver excellence! 'Webeaz Technologies' has created a solid foundation for its employees to always go the extra mile.",
    "Ours is a dedicated team of technologists and creative marketers who are always enthusiasts for thorough know-how in working for various industries like E-commerce, Education, IT Software &, Hardware, Retail, Travel, Finance, Manufacturing, Automotive, and whatnot.",
    "Every professional is committed to going above and beyond to exceed the customers’ expectations. The framework for the functional values with which our decisions, behaviours, and activities are based upon.",
    "We guarantee on-time completion, thorough expertise, one-of-a-kind service, and a cost-effective approach to any of your assigned projects. Failure never defeats us because we are focused on customer satisfaction rather than business success!",
  ],
  steps: [
    { title: "SITUATION ANALYSIS", subtitle: "Analysing The Current Situation Of The Business.", body: "We arrange an in-person meeting or phone call as soon as you contact us so that we can better understand your business requirements. We Take Note Of Your Pain Points, And The Business Barriers So That Our Experts Can Create A Robust Solution For Your Business Growth All Within Your Budget." },
    { title: "OBJECTIVE SETTING", subtitle: "Setting actionable objectives by understanding what our client wants to achieve.", body: "Here, we understand our clients’ vision, what they want to achieve, and their short- and long-term goals so that we can plan our strategy accordingly. Objectives can include creating a mobile app or a website for your business, brand awareness for your product or services, lead generation for your business, promoting your products or services through social media channels, etc." },
    { title: "STRATEGIES", subtitle: "Designing a strategy based on the client’s objectives.", body: "Our strategists plan strategies while keeping in mind what our clients want to accomplish. We devise strategies based on their requirements and objectives. For example, if your company's goal is to increase brand awareness and lead generation, we will devise a strategy that includes activities like SEO, SEM, mobile app marketing, social media promotion, and so on." },
    { title: "TACTICS", subtitle: "Implementing each strategy in different steps - how we will do it, with what, our motto for each tactic aligned to the main objectives and how that will be measured?", body: "Here, we plan how we are going to implement our strategy and the channels and tools that we will be using to achieve the desired result." },
    { title: "ACTION", subtitle: "Making things happen in the right direction.", body: "We never make compromises on our deliverables or quality. In order to ensure our clients get the best service from us, we create measurable KPIs to align with our objectives and stay on track. We create weekly and monthly reports to gauge our team’s performance." },
    { title: "CONTROL", subtitle: "Control is nothing but actions.", body: "We will break it down into different tasks and assign it among the team members. Throughout this process, we check that everything happens in accordance with the strategies and tactics chosen, the instructions issued, and the established principles. We will evaluate the status of the projects at our weekly and monthly review meetings, and we must immediately take corrective action if there are any differences between actual performance and the set objectives." },
  ],
};

export const VISION = {
  eyebrow: "VISION",
  title: "Digital Transformation of your Business for Better ROI",
  missionTitle: "OUR MISSION",
  mission: [
    "The mission of our company is to provide innovative and effective WOW factors through our expert and maintenance services. Moreover, webeaz enhances the competitiveness, responsiveness, and agility of your company in the increasingly digital world.",
  ],
  tagline: "INNOVATIVE SOLUTIONS FOR A CONNECTED WORLD",
  companyLinks: [
    { label: "About Us", href: "/about-us" },
    { label: "Our Team", href: "/our-teams" },
    { label: "Works", href: "/clients" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Careers", href: "/contact" },
    { label: "Contact us", href: "/contact" },
  ],
  serviceLinks: [
    "Android App Development", "IOS App Development", "Cross Platform Development",
    "Web Designing", "Web Application", "E-commerce Application",
  ],
  solutionLinks: ["Cloud Solutions", "Web Solution", "E-mail Solutions", "ERP"],
  marketingLinks: ["SEO", "SEM", "SMM", "Online Reputation"],
  contact: { email: "info@webeaz.com", india: "+91 9446234819", uae: "+971 562736690" },
};

export type PortfolioItem = {
  name: string;
  category: "Web Development" | "Mobile App" | "ERP Softwares" | "Social Media Posters";
  image: string;
  href?: string;
};

const cat = (c: string): PortfolioItem["category"] =>
  c === "app" ? "Mobile App" : c === "erp" ? "ERP Softwares" : c === "social" ? "Social Media Posters" : "Web Development";
const img = (n: number) => `/reference/portfolio-${String(n).padStart(2, "0")}.webp`;

export const PORTFOLIO: PortfolioItem[] = [
  { name: "Sanctity Ferme", category: cat("web"), image: img(1), href: "https://sanctityferme.in/" },
  { name: "Finprime Consulting", category: cat("web"), image: img(2), href: "https://www.finprimeconsulting.com/" },
  { name: "Medisouq", category: cat("web"), image: img(3), href: "https://www.medisouq.com/" },
  { name: "Safi-ODL", category: cat("web"), image: img(4), href: "https://odl.safiindia.org/" },
  { name: "Arabcal", category: cat("web"), image: img(5), href: "https://www.arabcal.com/" },
  { name: "Beurer", category: cat("web"), image: img(6), href: "https://www.beurerindia.com/" },
  { name: "Beurer", category: cat("social"), image: img(7) },
  { name: "Zaatar", category: cat("social"), image: img(8) },
  { name: "Britco & Bridco", category: cat("social"), image: img(9) },
  { name: "Feet Fashion", category: cat("social"), image: img(10) },
  { name: "Eatco", category: cat("social"), image: img(11) },
  { name: "Hot Bread", category: cat("social"), image: img(12) },
  { name: "Green Berry", category: cat("social"), image: img(13) },
  { name: "Beurer", category: cat("social"), image: img(14) },
  { name: "RozgarKart", category: cat("social"), image: img(15) },
  { name: "Savoury", category: cat("social"), image: img(16) },
  { name: "Feet Match", category: cat("social"), image: img(17) },
  { name: "Confederate", category: cat("social"), image: img(18) },
  { name: "Green Valley School", category: cat("web"), image: img(19), href: "http://www.greenvalleycampus.com/" },
  { name: "Feet Fashion", category: cat("web"), image: img(20), href: "https://feetfashion.in/" },
  { name: "CROMWELL UK", category: cat("web"), image: img(21), href: "https://cromwelleducation.co.uk/" },
  { name: "Beurer UAE", category: cat("web"), image: img(22) },
  { name: "Medisouq", category: cat("app"), image: img(23) },
  { name: "Eatco Home", category: cat("app"), image: img(24) },
  { name: "Lamit Roof Pvt Ltd", category: cat("app"), image: img(25) },
  { name: "Homely Eat", category: cat("app"), image: img(26) },
  { name: "Lamit Roof India Pvt Ltd", category: cat("erp"), image: img(27) },
  { name: "FinPrime Tax Consultancy LLC", category: cat("erp"), image: img(28) },
  { name: "Webeaz ERP", category: cat("erp"), image: img(29) },
  { name: "Sanctityferm ERP", category: cat("erp"), image: img(30), href: "https://sanctityferme.com/" },
  { name: "Store Generix", category: cat("erp"), image: img(31) },
  { name: "BSOFT Education", category: cat("web"), image: img(32), href: "https://www.bsofteducation.com/" },
  { name: "Buddy Uae", category: cat("web"), image: img(33), href: "https://buddyuae.com" },
  { name: "Gofudy", category: cat("web"), image: img(34), href: "https://gofudy.com" },
  { name: "FutureEducation", category: cat("web"), image: img(35), href: "http://futureeducation.ai" },
  { name: "Federal Public School", category: cat("web"), image: img(36), href: "https://www.federalpublicschool.org/" },
  { name: "GsfinUk", category: cat("web"), image: img(37), href: "https://gsfin.uk/" },
  { name: "FreeLine", category: cat("web"), image: img(38), href: "https://freelineuae.com/" },
];

export const TEAM = {
  title: "OUR TEAMS",
  subtitle: "Dedicated Professionals Driving Innovation and Excellence",
  founderLabel: "Our Founder & CEO",
  founderName: "Fasalurahman Moolayil",
  founderBio: [
    "The Founder & CEO of our business, Mr. Fasalurahman Moolayil, came up with the name “Webeaz” in 2008 with the goal of helping people grow their businesses with technology innovations and digital transformation.",
    "He is a Digital Marketer, Technologist & E-commerce Expert by profession and a business growth expert. He has been working in the field of digital marketing since 2008 and is a passionate specialist. He is a qualified professional with strong technical and marketing skills who works closely with his teams.",
    "He has more than 20+ years of varied experience in B2B and B2C businesses. Also, having a wide range of experience in engineering department with website application development, mobile app development and so on.",
    "He is deeply dedicated to creating innovative approaches for assisting business owners in digitally accelerating the growth of their businesses. Even so, he expresses a strong desire to stay up to date on technological and digital marketing trends. His opulent leadership qualities motivate the Webeaz team to exert their best effort.",
  ],
  meetTitle: "Meet Our Team",
  meetIntro:
    "At Webeaz, our success is driven by a dedicated team of professionals who are passionate about what they do. We take pride in our diverse talent pool, each member bringing a unique set of skills and experiences to the table. Meet the faces behind our company, and discover the expertise that fuels our commitment to excellence.",
  members: [
    { name: "Safeer C P", role: "Operations Manager", image: "/reference/team-safeer.webp" },
    { name: "Sheena Misri", role: "Digital Marketing Manager", image: "/reference/team-sheena.webp" },
    { name: "Akshay Raj V", role: "Web Developer", image: "/reference/team-akshay.webp" },
    { name: "Muhammed Ali K A", role: "Digital Marketing Specialist", image: "/reference/team-ali.webp" },
    { name: "Nahala T T", role: "Software Engineer", image: "/reference/team-nahala.webp" },
    { name: "Chandana P K", role: "Quality Analyst", image: "/reference/team-chandana.webp" },
    { name: "Mohammed Shahim", role: "Project Lead", image: "/reference/team-shahim.webp" },
    { name: "Arjun", role: "Creative Designer", image: "/reference/team-arjun.webp" },
  ],
};

export const CLIENTS_INTRO = {
  title: "Take a Look at What We Have Made",
  subtitle: "We Collaborate with Forward-Thinking Entrepreneurs and Build Awesome Things Together",
  heading: "OUR WORKS",
  filters: ["Web Development", "Mobile App", "ERP Softwares", "Social Media Posters"] as const,
};
