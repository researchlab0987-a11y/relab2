import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account using readFileSync instead of import
const serviceAccount = JSON.parse(
  readFileSync(resolve(__dirname, "serviceAccount.json"), "utf-8"),
);

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();
const authAdmin = getAuth();

async function seed() {
  console.log("🌱 Starting Firestore seed...\n");

  // ── 1. Theme ──────────────────────────────────────────────────
  await db.doc("theme/settings").set({
    primaryColor: "#1e3a5f",
    secondaryColor: "#2563eb",
    accentColor: "#f59e0b",
    backgroundColor: "#f8fafc",
    navbarColor: "#1e3a5f",
    footerColor: "#111827",
    fontFamily: "'Inter', sans-serif",
    headingFont: "'Inter', sans-serif",
  });
  console.log("✅ Theme seeded");

  // ── 2. Site Content ───────────────────────────────────────────
  const content: Record<string, string> = {
    "home.heroTitle": "Rahman Research Lab",
    "home.heroSubtitle":
      "Advancing the frontiers of artificial intelligence, signal processing, and data science at BUET.",
    "home.heroCta": "Explore Research Ideas",
    "home.bannerUrl":
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1600&q=80",
    "home.introTitle": "About the Lab",
    "home.introText":
      "We are an interdisciplinary research group at the Bangladesh University of Engineering and Technology (BUET), dedicated to pushing the boundaries of artificial intelligence and data science.\n\nOur work spans machine learning, natural language processing, computer vision, and signal processing — with a strong focus on real-world applications relevant to Bangladesh and the developing world.\n\nWe collaborate with industry partners, government agencies, and international universities to translate research into impact.",
    "home.announcementsTitle": "Latest Updates",
    "home.statsLabel1": "Collaborators",
    "home.statsLabel2": "Publications",
    "home.statsLabel3": "Ongoing Projects",
    "home.statsLabel4": "Research Ideas",

    "about.pageTitle": "About the Lab",
    "about.pageSubtitle":
      "Learn about our history, mission, and the values that drive our research.",
    "about.section1Title": "Our History",
    "about.section1Text":
      "The Rahman Research Lab was established in 2015 at the Department of Computer Science and Engineering, Bangladesh University of Engineering and Technology (BUET). Founded by Prof. Dr. Md. Rafiqul Islam Rahman, the lab began as a small group of four graduate students working on machine learning for low-resource languages.\n\nOver the years, the lab has grown into one of the most productive AI research groups in Bangladesh, with alumni working at Google, Microsoft, MIT, and leading universities across the globe.",
    "about.section2Title": "Research Focus",
    "about.section2Text":
      "Our research spans multiple disciplines at the intersection of artificial intelligence, engineering, and social impact:\n\n• Natural Language Processing — Bangla NLP, multilingual models, machine translation\n• Computer Vision — Remote sensing, medical imaging, document analysis\n• Signal Processing — IoT sensing, wireless communications, edge AI\n• AI for Development — Flood prediction, agriculture, healthcare in low-resource settings",
    "about.section3Title": "People & Culture",
    "about.section3Text":
      "We believe great research comes from diverse perspectives and collaborative spirit. Our lab currently hosts 6 PhD students, 10 MS students, and over 15 undergraduate researchers. We maintain an open-door policy and encourage students at all levels to engage with research.",
    "about.missionTitle": "Our Mission",
    "about.missionText":
      "To conduct world-class research in artificial intelligence and related fields that creates measurable positive impact for Bangladesh and the global scientific community.",
    "about.visionTitle": "Our Vision",
    "about.visionText":
      "To become the leading AI research lab in South Asia — renowned for rigorous science, inclusive collaboration, and transformative applications.",

    "collaborators.pageTitle": "Our Collaborators",
    "collaborators.pageSubtitle":
      "Meet the brilliant researchers and academics driving our work forward.",
    "collaborators.requestTitle": "Become a Collaborator",
    "collaborators.requestSubtitle":
      "Are you a researcher or academic interested in joining our network? Submit a request with your profile details. Our admin team will review your application.",
    "collaborators.requestCta": "Submit Collaborator Request",

    "publications.pageTitle": "Publications",
    "publications.pageSubtitle":
      "Our contributions to the scientific community — from ongoing projects to peer-reviewed publications.",
    "publications.ongoingTitle": "Ongoing Research",
    "publications.ongoingSubtitle":
      "Active projects currently under development or under review.",
    "publications.publishedTitle": "Published Research",
    "publications.publishedSubtitle":
      "Peer-reviewed papers and conference proceedings.",

    "ideas.pageTitle": "Research Ideas",
    "ideas.pageSubtitle":
      "Open research questions and ideas shared by our collaborators. Explore, discuss, and collaborate.",
    "ideas.postCta": "+ Post Idea",
    "ideas.emptyText": "No research ideas posted yet. Check back soon!",

    "contact.pageTitle": "Contact Us",
    "contact.pageSubtitle":
      "We'd love to hear from researchers, students, and industry partners.",
    "contact.formTitle": "Send a Message",
    "contact.address":
      "Department of CSE, BUET\nPalashi, Dhaka-1205\nBangladesh",
    "contact.email": "rahman.lab@cse.buet.ac.bd",
    "contact.phone": "+880-2-9665650",
    "contact.mapEmbed": "",
    "contact.successMessage":
      "Thank you for reaching out! We'll get back to you within 2–3 business days.",
  };

  const batch = db.batch();
  for (const [key, value] of Object.entries(content)) {
    batch.set(db.doc(`siteContent/${key}`), { value });
  }
  await batch.commit();
  console.log("✅ Site content seeded");

  // ── 3. Admin user ─────────────────────────────────────────────
  try {
    const adminRecord = await authAdmin.createUser({
      email: "admin@rahmanlab.com",
      password: "Admin@1234",
      displayName: "Admin Rahman",
    });
    await db.doc(`users/${adminRecord.uid}`).set({
      email: "admin@rahmanlab.com",
      name: "Admin Rahman",
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    console.log("✅ Admin created: admin@rahmanlab.com / Admin@1234");
  } catch (e: any) {
    if (e.code === "auth/email-already-exists") {
      console.log("ℹ️  Admin already exists — skipping");
    } else throw e;
  }

  // ── 4. Sample Collaborators ───────────────────────────────────
  const collabData = [
    {
      name: "Dr. Ayesha Siddiqui",
      email: "ayesha@cse.buet.ac.bd",
      password: "Collab@1234",
      designation: "Associate Professor",
      affiliation: "BUET, Dept. of CSE",
      bio: "Expert in machine learning and computer vision. Has published over 30 papers in top-tier venues including NeurIPS, CVPR, and IEEE TGRS.",
      photo: "https://i.pravatar.cc/300?img=47",
      researchInterests: [
        "Machine Learning",
        "Computer Vision",
        "Remote Sensing",
      ],
      linkedin: "https://linkedin.com",
      orcid: "https://orcid.org",
      scholar: "https://scholar.google.com",
      researchgate: "https://researchgate.net",
      facebook: "",
      publications: [
        {
          id: "1",
          title: "Deep Learning for Remote Sensing Image Classification",
          journal: "IEEE TGRS",
          year: 2023,
          url: "#",
        },
        {
          id: "2",
          title: "Attention-Based CNNs for Medical Imaging",
          journal: "Nature Machine Intelligence",
          year: 2022,
          url: "#",
        },
      ],
    },
    {
      name: "Prof. Karim Hossain",
      email: "karim@iut.ac.bd",
      password: "Collab@1234",
      designation: "Professor",
      affiliation: "Islamic University of Technology",
      bio: "Specializes in signal processing and embedded systems. Visiting researcher at MIT CSAIL. IEEE Senior Member.",
      photo: "https://i.pravatar.cc/300?img=12",
      researchInterests: ["Signal Processing", "IoT", "Embedded Systems"],
      linkedin: "https://linkedin.com",
      orcid: "",
      scholar: "https://scholar.google.com",
      researchgate: "",
      facebook: "",
      publications: [
        {
          id: "3",
          title: "Adaptive Signal Processing in IoT Sensor Networks",
          journal: "IEEE IoT Journal",
          year: 2023,
          url: "#",
        },
        {
          id: "4",
          title: "Energy-Efficient Edge Computing Architectures",
          journal: "ACM Computing Surveys",
          year: 2022,
          url: "#",
        },
      ],
    },
    {
      name: "Dr. Nusrat Jahan",
      email: "nusrat@du.ac.bd",
      password: "Collab@1234",
      designation: "Assistant Professor",
      affiliation: "University of Dhaka, Dept. of Applied Mathematics",
      bio: "Applied mathematician focused on optimization and graph theory. Received the Young Scientist Award from Bangladesh Academy of Sciences in 2022.",
      photo: "https://i.pravatar.cc/300?img=23",
      researchInterests: [
        "Optimization",
        "Graph Theory",
        "Scientific Computing",
      ],
      linkedin: "https://linkedin.com",
      orcid: "https://orcid.org",
      scholar: "",
      researchgate: "",
      facebook: "",
      publications: [
        {
          id: "5",
          title: "Graph Neural Networks for Combinatorial Optimization",
          journal: "SIAM Journal on Computing",
          year: 2023,
          url: "#",
        },
        {
          id: "6",
          title: "Stochastic Gradient Methods for Large-Scale Optimization",
          journal: "JMLR",
          year: 2022,
          url: "#",
        },
      ],
    },
  ];

  let order = 1;
  for (const collab of collabData) {
    const { email, password, ...profileData } = collab;
    try {
      const userRecord = await authAdmin.createUser({
        email,
        password,
        displayName: collab.name,
      });
      await db.doc(`users/${userRecord.uid}`).set({
        email,
        name: collab.name,
        role: "collaborator",
        createdAt: new Date().toISOString(),
      });
      await db.collection("collaborators").add({
        uid: userRecord.uid,
        email,
        ...profileData,
        isActive: true,
        order: order++,
        createdAt: new Date().toISOString(),
      });
      console.log(`✅ Collaborator created: ${email} / ${password}`);
    } catch (e: any) {
      if (e.code === "auth/email-already-exists") {
        console.log(`ℹ️  ${email} already exists — skipping`);
      } else throw e;
    }
  }

  // ── 5. Publications ───────────────────────────────────────────
  await db.collection("publications").add({
    title:
      "AI-Driven Flood Prediction System for Bangladesh Using Satellite Imagery",
    authors: "Rahman, M.R., Siddiqui, A., Hossain, K.",
    journal: "NeurIPS 2024 (Under Review)",
    year: 2024,
    abstract:
      "We present a deep learning pipeline combining satellite imagery, weather data, and hydrological models to predict flooding events in Bangladesh with 72-hour advance notice.",
    url: "",
    doi: "",
    type: "ongoing",
    tags: ["Flood Prediction", "Deep Learning", "Bangladesh"],
    createdAt: new Date().toISOString(),
  });

  await db.collection("publications").add({
    title: "BanglaBERT: A Pre-trained Language Model for Bangla",
    authors: "Rahman, M.R., Jahan, N., Islam, T.",
    journal: "ACL 2023",
    year: 2023,
    abstract:
      "We introduce BanglaBERT, the first large-scale pre-trained transformer model for the Bangla language, trained on 18GB of Bangla text.",
    url: "https://aclanthology.org",
    doi: "10.18653/v1/2023.acl-long.100",
    type: "published",
    tags: ["NLP", "Bangla", "Language Model"],
    createdAt: new Date().toISOString(),
  });
  console.log("✅ Publications seeded");

  // ── 6. Announcements ──────────────────────────────────────────
  await db.collection("announcements").add({
    content:
      "🎉 Our flood prediction paper has been accepted at NeurIPS 2024! Congratulations to the entire team.",
    order: 1,
    createdAt: new Date().toISOString(),
  });
  await db.collection("announcements").add({
    content:
      "📢 We are recruiting 2 PhD students for Fall 2025. Strong background in ML/DL required. Contact us!",
    order: 2,
    createdAt: new Date().toISOString(),
  });
  await db.collection("announcements").add({
    content:
      "🏆 Dr. Ayesha Siddiqui received the BUET Young Researcher Award 2024. Heartiest congratulations!",
    order: 3,
    createdAt: new Date().toISOString(),
  });
  console.log("✅ Announcements seeded");

  // ── 7. Research Ideas ─────────────────────────────────────────
  await db.collection("researchIdeas").add({
    title: "Federated Learning for Privacy-Preserving Healthcare Data Analysis",
    shortDescription:
      "Exploring federated learning to train AI models across distributed hospital networks without centralising sensitive patient records.",
    fullDescription:
      "Bangladesh has over 600 hospitals spread across 64 districts, each collecting valuable patient data. However, privacy concerns prevent centralising this data for AI model training.\n\nThis research proposes a federated learning framework tailored for low-bandwidth hospital networks in Bangladesh. Key challenges include communication efficiency, non-IID data distribution, and differential privacy guarantees.",
    tags: ["Federated Learning", "Privacy", "Healthcare", "AI"],
    authorId: "seed",
    authorName: "Dr. Ayesha Siddiqui",
    authorPhoto: "https://i.pravatar.cc/300?img=47",
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await db.collection("researchIdeas").add({
    title: "Low-Resource Bangla Dialect NLP",
    shortDescription:
      "Developing NLP models for regional Bengali dialects using transfer learning with minimal labelled data.",
    fullDescription:
      "Bangla is spoken by over 230 million people, but most NLP research focuses on Standard Bangla. Regional dialects — Sylheti, Chittagonian, Rangpuri — remain largely unstudied.\n\nThis project aims to build annotated corpora for 4 major Bangla dialects and develop dialect identification and translation models using transfer learning from Standard Bangla.",
    tags: ["NLP", "Bangla", "Low-Resource", "Transfer Learning"],
    authorId: "seed",
    authorName: "Dr. Nusrat Jahan",
    authorPhoto: "https://i.pravatar.cc/300?img=23",
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  console.log("✅ Research ideas seeded");

  console.log("\n🌱 Seed complete!\n");
  console.log("Admin:         admin@rahmanlab.com  /  Admin@1234");
  console.log("Collaborator:  ayesha@cse.buet.ac.bd  /  Collab@1234");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
