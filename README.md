# CareFlow — Hospital Management

Standalone hospital product. The BusinessSuite app catalog (CRM, sales, inventory, HRM, finance, and the rest) is not offered on the CareFlow portal.

**This repository is a separate product.**  
The original project stays at `~/Documents/ERP` (BusinessSuite) and is unchanged.

## Apps on the portal

- **CareFlow** — hospital workspace (patients, OPD/IPD, EMR, pharmacy, lab, billing)
- **Administration** — users, roles, and access

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
pnpm install
pnpm dev                     # http://127.0.0.1:3000
pnpm check                   # types, brand, and clinical ledger
```

Supabase is optional. With no `SUPABASE_SECRET_KEY`, sign in locally:

- Email `admin@demo.com`
- Password `Demo@12345`
- Tenant `alpha`

After sign-in, **Apps** lists CareFlow and Administration only. CareFlow includes a local demo chart (two patients, one admission, a partial clinical invoice) when Supabase is not configured.

To use your own database, copy `.env.example` to `.env.local` and set Supabase keys. Do not copy production secrets blindly.

### Database

```bash
npm run db:push              # apply migrations
npm run db:seed:healthcare   # demo data for Alpha Trading LLC tenant
```

## Demo notes

- Sign in with your configured demo users (e.g. `admin@demo.com`) on tenant **alpha**
- Open **Apps**, then **CareFlow** for the hospital workspace
- MFA: if you lose the authenticator, use **Lost authenticator?** on `/login/mfa`

## Relation to BusinessSuite ERP

| Project | Path | Purpose |
|---------|------|---------|
| BusinessSuite ERP | `/Users/kamran/Documents/ERP` | Original product |
| **CareFlow** | `/Users/kamran/Documents/CareFlow-HMS` | Hospital product only (plus Administration) |

Code was copied; CareFlow has its **own git history**. Do not push CareFlow commits to the BusinessSuite remote.
