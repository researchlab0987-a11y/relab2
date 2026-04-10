# Rahman Research Lab — Full Stack Website

A complete research lab website built with **React + TypeScript + Firebase + Cloudinary**.

---

## Tech Stack

| Layer    | Technology                     |
| -------- | ------------------------------ |
| Frontend | React 18, TypeScript, Vite     |
| Styling  | Tailwind CSS + CSS Variables   |
| Database | Firebase Firestore             |
| Auth     | Firebase Authentication        |
| Media    | Cloudinary (drag & drop + URL) |
| Routing  | React Router v6                |
| Hosting  | Firebase Hosting (recommended) |

---

## Project Structure

```
rahmanlab/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── firestore.rules
├── .env.example
├── README.md
├── scripts/
│   └── firestore-seed.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── index.ts
    ├── firebase/
    │   ├── config.ts
    │   └── hooks.ts
    ├── context/
    │   ├── AuthContext.tsx
    │   └── ThemeContext.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   ├── CollaboratorCard.tsx
    │   ├── IdeaCard.tsx
    │   ├── CommentSection.tsx
    │   ├── PublicationCard.tsx
    │   ├── ContactForm.tsx
    │   ├── CloudinaryUpload.tsx
    │   └── ProtectedRoute.tsx
    ├── pages/
    │   ├── Home.tsx
    │   ├── About.tsx
    │   ├── Collaborators.tsx
    │   ├── Publications.tsx
    │   ├── ResearchIdeas.tsx
    │   ├── IdeaDetail.tsx
    │   ├── Contact.tsx
    │   └── Login.tsx
    ├── portals/
    │   ├── AdminDashboard.tsx
    │   └── CollaboratorPortal.tsx
    └── admin/
        ├── ContentEditor.tsx
        ├── ThemeControl.tsx
        ├── CollaboratorRequests.tsx
        ├── ManageCollaborators.tsx
        ├── ManagePublications.tsx
        └── AdminSections.tsx
```

---

## Quick Start

### 1. Unzip and install

Unzip the downloaded `rahman-research-lab.zip`, open the `rahmanlab` folder in your terminal, then run:

```bash
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) → **Create a project**
2. Enable **Authentication** → Sign-in method → **Email/Password**
3. Enable **Firestore Database** → Start in **production mode**
4. Register a **Web App** → Copy the config keys
5. Deploy Firestore security rules:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 3. Set up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com) → Create a free account
2. Dashboard → **Settings** → **Upload** → **Add upload preset**
3. Set the preset mode to **Unsigned**
4. Note down your **Cloud Name** and **Upload Preset name**

### 4. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-unsigned-preset
```

### 5. Seed the database

This step creates the admin account, sample collaborators, publications, research ideas, announcements, and all default site content in your Firestore database.

```bash
# Install ts-node
npm install -D ts-node

# Download your Firebase service account key:
# Firebase Console → Project Settings → Service Accounts → Generate New Private Key
# Save the downloaded JSON file as:  scripts/serviceAccount.json

npx ts-node --esm scripts/firestore-seed.ts
```

After seeding, your login credentials are:

| Account        | Email                   | Password      |
| -------------- | ----------------------- | ------------- |
| Admin          | `admin@rahmanlab.com`   | `Admin@1234`  |
| Collaborator 1 | `ayesha@cse.buet.ac.bd` | `Collab@1234` |
| Collaborator 2 | `karim@iut.ac.bd`       | `Collab@1234` |
| Collaborator 3 | `nusrat@du.ac.bd`       | `Collab@1234` |

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## User Roles & Access

| Role             | Login    | Capabilities                                                              |
| ---------------- | -------- | ------------------------------------------------------------------------- |
| **Admin**        | `/login` | Full dashboard — content, theme, users, publications, ideas, messages     |
| **Collaborator** | `/login` | Edit own profile, post research ideas, comment on ideas                   |
| **Visitor**      | —        | Browse all public pages, submit contact form, submit collaborator request |

---

## Key URLs

| URL                    | Description                                   |
| ---------------------- | --------------------------------------------- |
| `/`                    | Home page                                     |
| `/about`               | About the lab                                 |
| `/collaborators`       | Collaborator grid + request form              |
| `/publications`        | Publications (ongoing + published)            |
| `/research-ideas`      | Research ideas list                           |
| `/research-ideas/:id`  | Idea detail + comments                        |
| `/contact`             | Contact form                                  |
| `/login`               | Admin & collaborator login                    |
| `/admin`               | Admin dashboard (admin only)                  |
| `/collaborator-portal` | Collaborator self-service (collaborator only) |

---

## Admin Dashboard Sections

| Section              | What you can do                                                                         |
| -------------------- | --------------------------------------------------------------------------------------- |
| **Content Editor**   | Edit every text on every tab — Home, About, Collaborators, Publications, Ideas, Contact |
| **Theme Control**    | Change colors and fonts with live preview; 5 preset palettes included                   |
| **Announcements**    | Add/remove homepage announcements                                                       |
| **Collab Requests**  | View pending requests, expand full profile, approve or reject                           |
| **Collaborators**    | Edit any profile, toggle visibility, remove                                             |
| **Publications**     | Add/edit/delete ongoing and published research entries                                  |
| **Research Ideas**   | View all ideas, expand comments, delete any comment or idea                             |
| **Contact Messages** | Read messages, mark read, reply via email, delete                                       |

---

## Collaborator Request Flow

1. Visitor goes to `/collaborators` → clicks **Submit Collaborator Request**
2. Fills the form: name, email, password, photo (Cloudinary upload), affiliation, designation, bio, research interests, social links, publications
3. Request is saved to Firestore `pendingRequests` collection
4. Admin sees it in **Collab Requests** section of the dashboard
5. Admin clicks **Approve** → Firebase Auth account is created + collaborator profile appears in the Collaborators tab
6. Collaborator can now log in at `/login` → redirected to `/collaborator-portal`

---

## Deployment (Firebase Hosting)

```bash
npm run build

firebase init hosting
# When asked:
#   Public directory → dist
#   Single-page app  → Yes
#   Overwrite index.html → No

firebase deploy
```

---

## Firestore Collections

| Collection        | Description                                                             |
| ----------------- | ----------------------------------------------------------------------- |
| `siteContent`     | Key-value store for all editable text (key = field key, value = string) |
| `theme`           | Single document `settings` with all CSS variable values                 |
| `users`           | uid → { name, email, role }                                             |
| `collaborators`   | Collaborator profiles including publications array                      |
| `publications`    | Lab publications with type: `ongoing` or `published`                    |
| `researchIdeas`   | Ideas posted by collaborators                                           |
| `comments`        | Comments on research ideas                                              |
| `announcements`   | Homepage announcement items                                             |
| `pendingRequests` | Collaborator join requests awaiting admin review                        |
| `contactMessages` | Contact form submissions                                                |

---

## Environment Variables Reference

All variables are prefixed with `VITE_` so Vite exposes them to the browser.

| Variable                            | Where to get it                                       |
| ----------------------------------- | ----------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase Console → Project Settings → Your Apps → Web |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Same as above                                         |
| `VITE_FIREBASE_PROJECT_ID`          | Same as above                                         |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Same as above                                         |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same as above                                         |
| `VITE_FIREBASE_APP_ID`              | Same as above                                         |
| `VITE_CLOUDINARY_CLOUD_NAME`        | Cloudinary Dashboard → top-right corner               |
| `VITE_CLOUDINARY_UPLOAD_PRESET`     | Cloudinary → Settings → Upload → Upload Presets       |

---

## Customisation Tips

- **Edit site text**: Admin Dashboard → **Content Editor** → select tab → edit field → Save
- **Change theme**: Admin Dashboard → **Theme Control** → pick a preset or use color pickers → Apply
- **Add a new content field**: Add the key to `FIELD_GROUPS` in `src/admin/ContentEditor.tsx`, then read it in the relevant page with `content['your.key']`
- **Add a new page**: Create the file in `src/pages/`, add the route in `App.tsx`, add the nav link in `Navbar.tsx`, add content fields in `ContentEditor.tsx`
- **Change default theme colors**: Update the `:root` block in `src/index.css`
