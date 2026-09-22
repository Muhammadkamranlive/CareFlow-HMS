# CareFlow — Hospital Management System

Portfolio product: a healthcare-branded Hospital Management System built on Next.js + Supabase.

**This repository is a standalone fork for demos and portfolio.**  
The original multi-module ERP remains at `~/Documents/ERP` (BusinessSuite) and is unchanged.

## Product focus

- Patient registration (MRN), OPD / IPD, EMR / SOAP charting
- Wards, beds, admissions, vitals / MAR, e-prescribing, pharmacy
- Lab, radiology (PACS URL embed), claims, telemedicine, ED / ambulance
- Pharmacy marketplace, clinical billing, compliance (PHI audit, break-glass, MFA)
- Multi-branch, notifications, patient portal stub

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Postgres, Auth/MFA, Storage)
- Stripe helpers for clinical checkout (optional)

## Brand

Configured in `config/product.json`:

- **Product:** CareFlow  
- **Tagline:** Hospital Management  

## Local setup

```bash
cd ~/Documents/CareFlow-HMS
cp .env.example .env.local   # add your own Supabase keys (do not copy production secrets blindly)
pnpm install                 # or npm install
pnpm dev                     # http://127.0.0.1:3000
```

### Database

```bash
npm run db:push              # apply migrations
npm run db:seed:healthcare   # demo data for Alpha Trading LLC tenant
```

## Demo notes

- Sign in with your configured demo users (e.g. `admin@demo.com`) on tenant **alpha**
- Open **Apps → Healthcare** for the clinical module
- MFA: if you lose the authenticator, use **Lost authenticator?** on `/login/mfa`

## Relation to BusinessSuite ERP

| Project | Path | Purpose |
|---------|------|---------|
| BusinessSuite ERP | `/Users/kamran/Documents/ERP` | Full ERP + Healthcare module |
| **CareFlow HMS** | `/Users/kamran/Documents/CareFlow-HMS` | Healthcare-branded portfolio copy |

Code was copied; CareFlow has its **own git history**. Do not push CareFlow commits to the BusinessSuite remote.
