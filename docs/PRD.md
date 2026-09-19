PROTECTION PASSPORT
Complete Business Plan • Product Requirements • Technical Architecture • MVP • GTM
India | Working Founder Document | September 2026
CORE THESISPeople do not necessarily need another insurance-selling app. They need a trustworthy way to discover, verify, understand and operationalize the financial protection they and their families already have.
“Know what protects you.”

1. Executive Summary
Protection Passport is a Personal Protection Intelligence Platform for Indian households. It consolidates evidence of life, health, accident, disability, employer/group, bank-linked, card-linked and government/social protection into one understandable household view.
The core question is: “If something happens to me tomorrow, what financial protection can my family actually identify, verify and claim?”
The market is not empty. Bima Central, insurance repositories, policy-management products, employee-benefit platforms and Account Aggregator-enabled services already cover important pieces.
The differentiation should therefore be a cross-source Protection Graph: person → source → benefit/policy → eligibility → evidence → nominee → claim route → verification state.
The MVP should be document-first and mock-data-first. Deep Account Aggregator integration follows validation and legal/regulatory architecture.
Every protection item must have an evidence state. Weak signals must never be presented as confirmed coverage.
The strongest long-term extension is authorized Family Emergency Mode, followed by B2B employer distribution and a Protection Intelligence API.
DECISION GATEBefore significant investment, run a 50–100 household study to measure previously unknown protection, verification accuracy, trust and willingness to pay.
2. Problem Definition
Indian households can have fragmented protection across individual policies, employer benefits, bank products, cards, government/social schemes, repositories and documents. The pain is informational as much as financial: a person may have protection but not know what it covers, whether it is active, who the nominee is or how a family member would claim it.
2.1 Correcting the original assumption
Do not build the company around “every Indian automatically has insurance.” Eligibility is conditional. PMJJBY and PMSBY require enrolment/consent and auto-debit; employer and card benefits depend on product and eligibility conditions.
Source type
Product rule
PMJJBY
Detect only with supporting evidence; distinguish enrolment/status from merely having a bank account.
PMSBY
A relevant debit/enrolment record is evidence to investigate, not automatic proof of current coverage.
Employer group cover
Read the actual benefit document and eligibility conditions.
Credit-card benefits
Identify the exact card/product and verify current terms.
ESI
Present statutory/social medical protection separately from private health insurance.
Individual policy
Use authoritative policy evidence and track dates, nominee and coverage.
2.2 User pain points
Multiple bank accounts/cards but no protection view.
Insurance documents use technical language.
Employer cover may sit inside HR portals or benefit PDFs.
Bank/card benefits can be conditional and product-specific.
Family members may not know policies, nominees or claim instructions.
A policy list does not equal emergency readiness.
“Not detected” must never be interpreted as “does not exist.”
3. Market and Competitive Landscape
The opportunity should not be described as an empty market. Existing products cover policy aggregation, policy management, insurance analysis, employee benefits and financial data aggregation.
Category
Existing capability
Opportunity
Insurance portfolio/repository
Policy access, portfolio management, reminders, documents
Cross-source household protection intelligence
Policy audit/management
Policy summaries, analysis, gaps/overlaps
Discovery across bank/card/employer/government sources
Employee benefits
Employer group health/life servicing
Household-wide protection beyond employer
Account Aggregator
Consent-based financial-data exchange
Application-layer protection interpretation
Insurance marketplace
Product discovery and distribution
Neutral view of what user already owns
CAMS describes Bima Central as an insurance portfolio-management platform and currently reports 10.5 million e-Insurance accounts and ~14+ million e-policies under service on its insurance-services page. This means “insurance locker” is not a sufficient differentiation.
Sahamati describes Account Aggregators as consent managers enabling secure financial-data exchange, and its ecosystem pages describe participation by regulated entities including banks and insurance entities. The ecosystem is live and actively maintained.
COMPETITIVE CONCLUSIONDo not compete on document storage alone. Compete on cross-source discovery, evidence verification, household mapping and emergency readiness.
4. Product Definition
Working name: Protection Passport
Category: Personal Protection Intelligence Platform
One-line promise: “Discover, verify and explain the financial protection you and your family already have.”
4.1 Protection Graph
Person
Household
Financial source
Account/card/employer
Benefit or policy
Coverage
Eligibility/conditions
Evidence
Verification
Nominee
Claim route
Consent
Emergency authorization
This graph allows the product to answer who is protected, by what, under which conditions, based on what evidence and what a family member should do next.
4.2 Product boundaries
Build
Do not imply
Protection inventory
Guaranteed coverage
Evidence/explanation
Claim outcome
Household map
Insurance advice without regulatory review
Emergency readiness
Bank/card credential collection
Future partner integrations
Fake live integrations in demo
5. Portal / UX Specification
Dashboard
Hero: Know what protects you.
Life, Accident, Health, Critical Illness and Disability cards.
Family Protection Matrix.
Attention-needed items.
Recently verified items.
Emergency readiness.
Protection Inventory
Filter by type/source.
Open evidence panel.
Show amount, source, conditions, nominee, last verified date and claim route.
Use explicit verification badges.
Add Protection
Upload policy PDF.
Upload employer benefits PDF.
Upload bank/card statement.
Manual entry.
Never request passwords, PINs, CVVs or OTPs.
Family
Primary user, spouse, children and authorized dependants.
Protection view per person.
Nominee readiness.
Emergency authorization.
Emergency Mode
Only explicitly authorized information.
Separate verified from potentially claimable.
Show nominee/provider/claim documents where supported.
Audit access.
Settings
Consent management.
Family access.
Documents.
Retention/deletion.
Security.
Account deletion.
6. Evidence and Verification Engine
NON-NEGOTIABLEA transaction, card name or keyword is evidence of a possibility—not automatically proof of active insurance coverage.
State
Meaning
VERIFIED
Authoritative/current evidence supports the benefit.
USER CONFIRMED
User explicitly confirmed it; independent evidence incomplete.
NEEDS VERIFICATION
Evidence suggests a benefit but status/eligibility incomplete.
UNKNOWN
Insufficient evidence to conclude.
NOT DETECTED
No evidence found in available sources; not proof of absence.
Preferred pipeline: Source → OCR/extraction → structured fields → deterministic validation/rules → evidence record → Protection Graph → explanation/UI.
LLMs may assist extraction and plain-language explanation, but structured rules/evidence should control final coverage status.
7. Data Model
Entity
Core fields
User
id, name, contact, consent
Household
id, owner, members
Person
id, household, relationship
FinancialAccount
institution, type, masked identifier
CreditCard
issuer, variant, network, masked identifier
Employer
employer, employee reference
Benefit
type, source, eligibility, conditions
InsurancePolicy
insurer, masked policy number, product, dates
Coverage
type, amount, conditions
Nominee
person, relationship, evidence
Evidence
source, document, extracted fields, hash, timestamp
Verification
state, reason, verifier, timestamp
ClaimRoute
provider, contact, required documents, source
Consent
purpose, scope, provider, grant/revoke
EmergencyAccess
authorized person, scope, expiry, audit
Document
storage reference, type, checksum, retention
8. Technical Architecture
Layer
Recommendation
Reason
Web
Next.js + TypeScript + Tailwind
Fast responsive product development
API
Python + FastAPI
Good fit for data/document processing
DB
PostgreSQL
Strong relational core + JSON support
Documents
Encrypted S3-compatible object storage
Sensitive evidence
OCR
Managed document AI initially
Speed/accuracy
Rules
Python rules engine
Deterministic verification
LLM
Provider abstraction
Extraction/explanation without lock-in
Auth
Secure OIDC/passkey/OTP approach
Account security
Observability
Audit logs + structured events
Traceability
8.1 API contract
Method
Endpoint
Purpose
GET
/api/dashboard
Protection summary
GET
/api/protections
Protection inventory
GET
/api/protections/{id}
Detail/evidence
POST
/api/protections
Manual entry
POST
/api/documents
Document upload
GET
/api/family
Household
POST
/api/family
Add member
GET
/api/emergency
Emergency summary
POST
/api/emergency/access
Authorize access
GET
/api/evidence/{id}
Evidence record
8.2 Repository
protection-passport/├── apps/web/              # Next.js├── services/api/          # FastAPI├── packages/domain/       # contracts/types├── packages/ui/           # reusable UI├── data/demo/             # deterministic mock data├── docs/                  # PRD/security/data model└── tests/                 # unit + E2E
9. Security, Privacy and Regulatory Architecture
Never request bank passwords, card PINs, CVVs or OTPs.
Encrypt data in transit and at rest.
Mask/tokenize identifiers.
Use purpose-specific consent.
Maintain access and change audit logs.
Minimize raw-document retention.
Provide deletion/revocation mechanisms.
Require explicit emergency/family authorization.
Separate evidence from interpretation and future recommendations.
MeitY has published the Digital Personal Data Protection Rules, 2025 and an enforcement timeline. Production architecture should be reviewed against the applicable DPDP Act/Rules.
IRDAI regulates insurance web aggregators and other insurance intermediaries. If the platform moves into insurance comparison, solicitation, distribution or regulated advice, the legal/regulatory model must be reviewed before launch.
LEGAL NOTEThis is a product/business document, not legal advice. Obtain Indian counsel covering IRDAI, RBI/AA, DPDP and insurance distribution before production integrations.
10. Account Aggregator Strategy
AA is strategically important because it provides consent-based financial-data exchange. It should be a later integration, not a prerequisite for MVP.
Validate consumer value with document-first workflows.
Map which desired protection data is actually available from supported FIPs.
Select an appropriate compliant AA ecosystem partner/route.
Obtain legal assessment of FIU/partner eligibility and data-use purpose.
Build consent-driven ingestion with provenance.
Use dummy/sandbox data before production.
Add production integrations only after required compliance/certification.
Sahamati's current ecosystem guidance states that FIUs/FIPs must meet regulatory eligibility and technical participation requirements, and its sandbox guidance emphasizes dummy data for UAT.
11. Business Model
Model
Illustrative hypothesis
Value
Consumer Free
Acquisition
Basic map, limited sources
Family
₹299/year test price
Household map, reminders, emergency mode
Premium
₹999/year test price
Advanced analysis and claim readiness
Employer B2B
₹50/employee/year example
Employee benefits/protection passport
Protection API
Contract pricing
Normalized protection intelligence for partners
These prices are hypotheses, not market-validated figures.
Illustrative arithmetic: 100,000 paid households × ₹299 = ₹2.99 crore/year. This is a scenario, not a forecast.
12. Go-To-Market
12.1 Initial segment
Start with urban salaried Indians approximately 25–45 who have multiple financial products and family responsibilities.
Technology employees
Corporate professionals
Small-business owners
Families with multiple policies
Employees with group insurance
12.2 Channels
Employer pilots
HR/benefits partnerships
Financial-literacy communities
CA/financial-planning professional partnerships
User-to-spouse/parent referrals
Content about protection discovery and claim readiness
POSITIONING“We don't start by selling you insurance. We help you understand what you already have.”
13. Validation Plan
Recruit 50–100 households.
Collect voluntary policies, employer benefit documents and statements.
Build protection maps manually/semi-automatically.
Measure previously unknown or misunderstood benefits.
Measure verification accuracy and false positives.
Test emergency-mode usefulness.
Test willingness to pay.
Interview for trust/privacy objections.
Metric
Definition
Verified Protection Discovered / Household
Meaningful protection items newly identified and verified
Unknown→Known conversion
Previously unknown items that become verified
Verification accuracy
Correctness of evidence/status classification
Profile completion
Households reaching a usable map
Emergency readiness
Nominee + claim information + authorized access
Retention
6/12-month return usage
Willingness to pay
Share accepting a paid plan
14. Roadmap
Phase
Timing
Output
0 — Validation
0–6 weeks
50–100 household study and evidence model
1 — MVP
6–12 weeks
Portal, documents, evidence, graph, family view
2 — Product tests
3–6 months
Multilingual, reminders, emergency mode, assisted workflows
3 — Ecosystem
6–12 months
AA partner route, repositories, employer pilots
4 — Platform
12–24 months
B2B API and enterprise/regulatory partnerships
15. Risk Register
Risk
Impact
Mitigation
False coverage inference
Very high
Evidence-first rules and verification states
Regulatory perimeter
Very high
Legal review before distribution/AA/regulated activity
Data access
High
Document-first MVP; partner later
Existing competitors
High
Protection Graph + emergency readiness
Low willingness to pay
High
Validate before deep build; B2B2C
Security breach
Very high
Minimization, encryption, audit, no credentials
Stale terms
High
Source + last verified timestamp
User distrust
High
Neutral positioning and no hidden sales funnel
LLM hallucination
High
LLM cannot determine final coverage
16. MVP Build Instructions for Claude
Create Next.js + TypeScript + Tailwind application.
Implement Dashboard, Protection, Family, Emergency, Documents and Settings.
Use mock APIs and visibly labelled demo data.
Create typed models for User, Person, Policy, Coverage, Evidence and Verification.
Build reusable VerificationBadge, ProtectionCard, EvidencePanel and FamilyMatrix.
Keep API boundaries clean for later FastAPI integration.
Do not build fake bank/AA integrations.
Create deterministic demo data.
Add unit tests for protection-state logic.
Add E2E tests for the main journey.
The accompanying Claude build pack contains CLAUDE_CONTEXT.md, PRODUCT_BUILD_SPEC.md, README.md and index.html.
17. Demo Scope
Standalone responsive HTML prototype.
Dashboard with Life/Accident/Health/Critical Illness/Disability cards.
Family Protection Matrix.
Protection Inventory with evidence/verification badges.
Family view.
Emergency Mode.
Document upload simulation.
Privacy/security screen.
All displayed financial values are fictional demo data.
18. Long-Term Product Vision
Protection Passport → Protection Graph → Family Emergency Operating System
The long-term platform can expand beyond insurance into an authorized family financial continuity layer: insurance, nominees, investments, loans, EPF/pension, ESI, property records, important documents, emergency contacts and claim workflows. This should only happen after the core protection problem is validated.
19. Primary Sources Checked
CAMS — Bima Central / insurance services — https://www.camsonline.com/InvestorServices/InvOnline/i_Login.aspx
Sahamati — Account Aggregators — https://sahamati.org.in/account-aggregators/
Sahamati — What is Account Aggregator? — https://sahamati.org.in/what-is-account-aggregator/
Sahamati — Certified Entities — https://sahamati.org.in/certified-entities-in-the-account-aggregator-ecosystem/
Sahamati — FIPs &amp; FIUs — https://sahamati.org.in/fip-fiu-in-account-aggregators-ecosystem/
Sahamati — FIP requirements — https://sahamati.org.in/financial-information-provider-fip/
Sahamati — Joining AA network — https://sahamati.org.in/how-to-join-the-account-aggregator-network-to-share-and-access-financial-data/
IRDAI — Insurance Web Aggregators — https://irdai.gov.in/insurance-web-aggregators
IRDAI — Consolidated regulations — https://irdai.gov.in/consolidated-gazette-notified-regulations
Ministry of Finance — PMSBY — https://www.financialservices.gov.in/pmsby
Ministry of Finance — PMJJBY — https://financialservices.gov.in/pmjjby
ESIC — FAQ / benefits — https://esic.gov.in/Publications/FAQ_ESIC_181210.pdf
MeitY — DPDP Rules 2025 — https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa
20. Limitations / What Is Not Confirmed
I cannot confirm that no private or unindexed company in India provides the exact same end-to-end combination. The market is dynamic and adjacent products overlap.
AA availability varies by financial institution and information type.
Pricing, conversion and revenue scenarios are hypotheses.
Coverage must always be verified against current authoritative evidence for the specific person/product.
Regulatory classification must be confirmed by qualified Indian counsel before production.
BOTTOM LINEThe viable company is not another insurance app. It is a trusted protection-intelligence layer that turns fragmented financial evidence into a verified household protection map and an emergency-ready family record.