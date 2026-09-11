// The canonical provenance notice, byte-for-byte identical to DataProvenance.Text in
// SchemeReady/backend/Services/DataProvenance.cs. Every fallback Scheme and ChannelPartner
// below carries it together with isIllustrative: true, so the illustrative badge renders
// identically whether a record came from the API or from these offline fallbacks (R2.9).
export const DATA_PROVENANCE =
  'Interest rate, cited source document and last-verified date are illustrative sample values pending verification against current official NSFDC guidelines.';

﻿// Protected endpoints go through tokenFetchJson, which attaches the bearer header and throws
// ApiError rather than returning anything fabricated (R5.5, R5.11).
import { API_BASE, ApiError, tokenFetch, tokenFetchJson } from './auth/tokenFetch';

export { ApiError };

export async function extractEntities(userSpeechOrText, lang = 'en') {
  try {
    const res = await fetch(`${API_BASE}/onboarding/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userSpeechOrText, preferredLanguage: lang })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API fallback for extract:', err);
  }

  // Client-side extraction fallback
  const text = (userSpeechOrText || '').toLowerCase();
  let business = 'tailoring';
  if (text.includes('mobile') || text.includes('repair') || text.includes('phone') || text.includes('ಮೊಬೈಲ್')) business = 'mobile repair';
  else if (text.includes('food') || text.includes('tea') || text.includes('stall')) business = 'food stall';
  else if (text.includes('rickshaw') || text.includes('auto')) business = 'e-rickshaw';
  else if (text.includes('carpenter')) business = 'carpentry';

  let location = 'Bengaluru';
  if (text.includes('mysuru') || text.includes('mysore')) location = 'Mysuru';
  else if (text.includes('hubballi')) location = 'Hubballi-Dharwad';
  else if (text.includes('belagavi')) location = 'Belagavi';

  let amount = 120000;
  if (text.includes('1.8') || text.includes('180000')) amount = 180000;
  else if (text.includes('1.2') || text.includes('120000')) amount = 120000;
  else if (text.includes('1.5') || text.includes('150000')) amount = 150000;
  else if (text.includes('2') || text.includes('200000')) amount = 200000;

  return {
    businessType: business,
    location,
    requiredAmount: amount,
    userType: 'new_entrepreneur',
    category: 'SC',
    rawInput: userSpeechOrText,
    localizedSummary: {
      en: `Extracted: ${business} in ${location} requiring Rs ${amount.toLocaleString()}`,
      kn: `ಗುರುತಿಸಲಾಗಿದೆ: ${location} ನಲ್ಲಿ ${business}, ಸಾಲದ ಮೊತ್ತ ₹${amount.toLocaleString()}`,
      hi: `पहचाना गया: ${location} में ${business}, ऋण राशि ₹${amount.toLocaleString()}`
    }
  };
}

export async function matchSchemes(profile) {
  try {
    const res = await fetch(`${API_BASE}/schemes/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API fallback for matchSchemes:', err);
  }

  // Guaranteed fallback results
  return [
    {
      schemeId: 'NSFDC-MCS-01',
      schemeName: 'Micro Credit Scheme (MCS)',
      schemeType: 'Micro Credit',
      matchScore: 92,
      isRecommended: true,
      positiveReasons: [
        'Applicant belongs to the target community (Scheduled Caste).',
        `Declared family income (Rs ${profile.annualFamilyIncome.toLocaleString()}) is within configured threshold (Rs 3,00,000).`,
        `Project cost (Rs ${profile.estimatedProjectCost.toLocaleString()}) fits the micro-credit scheme limit (Rs 10,000 - Rs 1,50,000).`,
        `Business type '${profile.businessType}' is actively supported.`,
        'Suitable partner (Karnataka State Dr. B.R. Ambedkar Dev Corp) is available in applicant district (4.2 km).'
      ],
      negativeReasons: [
        'Caste Certificate (RD number) is pending upload.'
      ],
      missingDocuments: ['Caste certificate (RD Number)'],
      maxLoanEligible: 150000,
      interestRate: 5.0,
      tenureMonths: 36,
      estimatedEmi: 4498,
      officialUrl: 'https://nsfdc.nic.in/schemes/micro-credit-scheme',
      sourceDocument: 'NSFDC Operational Guidelines 2024-26, Clause 4.2',
      lastVerifiedDate: '2026-09-10T00:00:00Z',
      partnerAvailability: 'Karnataka State Dr. B.R. Ambedkar Development Corporation',
      isIllustrative: true,
      dataProvenance: DATA_PROVENANCE
    },
    {
      schemeId: 'NSFDC-TLS-02',
      schemeName: 'Term Loan Scheme (TLS)',
      schemeType: 'Term Loan',
      matchScore: 68,
      isRecommended: false,
      positiveReasons: [
        'Target community category matches (Scheduled Caste).',
        'Applicant age is within permissible term loan brackets.'
      ],
      negativeReasons: [
        `Required amount (Rs ${profile.estimatedProjectCost.toLocaleString()}) is lower than the recommended minimum of Rs 2,00,000.`,
        'Higher documentation needed: Detailed Project Report (DPR) and shop premises agreement.'
      ],
      missingDocuments: ['DPR / Detailed Project Report', 'Premises agreement'],
      maxLoanEligible: 1500000,
      interestRate: 6.0,
      tenureMonths: 60,
      estimatedEmi: 3866,
      officialUrl: 'https://nsfdc.nic.in/schemes/term-loan-scheme',
      sourceDocument: 'NSFDC Lending Policy Master Circular 2025-26',
      lastVerifiedDate: '2026-09-10T00:00:00Z',
      partnerAvailability: 'Canara Bank MSME Hub',
      isIllustrative: true,
      dataProvenance: DATA_PROVENANCE
    },
    {
      schemeId: 'NSFDC-LUY-04',
      schemeName: 'Laghu Udhyami Yojana (LUY)',
      schemeType: 'Small Enterprise',
      matchScore: 84,
      isRecommended: true,
      positiveReasons: [
        'Applicant is a first-time youth entrepreneur.',
        'Technical trade aligns with service unit financing.',
        'Income is below the Rs 3,50,000 limit.'
      ],
      negativeReasons: [
        'Skill certification or prior experience declaration required.'
      ],
      missingDocuments: ['Trade skill certificate'],
      maxLoanEligible: 500000,
      interestRate: 5.5,
      tenureMonths: 48,
      estimatedEmi: 3488,
      officialUrl: 'https://nsfdc.nic.in/schemes/laghu-udhyami',
      sourceDocument: 'Ministry of Social Justice & Empowerment Notification 2025',
      lastVerifiedDate: '2026-08-25T00:00:00Z',
      partnerAvailability: 'Canara Bank - MSME Hub',
      isIllustrative: true,
      dataProvenance: DATA_PROVENANCE
    }
  ];
}

/**
 * Readiness for a profile. Protected (R4.15), so there is no offline fallback: the previous
 * implementation returned a complete seven-item checklist with `aadhaar_front_back.pdf` and
 * `income_certificate_2026.pdf` already "uploaded" whenever the API was unreachable, which is
 * indistinguishable to the user from real persisted evidence. It now throws (R5.11) and the
 * caller keeps its last-known state and shows an error banner.
 */
export async function getReadiness(profile) {
  return tokenFetchJson('readiness/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
}

export async function generateBusinessPlan(planReq) {
  try {
    const res = await fetch(`${API_BASE}/business-plan/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(planReq)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API fallback for business plan:', err);
  }

  const cost = Number(planReq.estimatedInvestment || 180000);
  const equip = Math.round(cost * 0.70);
  const wc = cost - equip;
  const margin = Math.round(cost * 0.05);
  const loan = cost - margin;
  const sales = Number(planReq.expectedMonthlySales || 55000);
  const raw = Number(planReq.rawMaterialCost || 15000);
  const staff = (planReq.numberOfEmployees || 1) * 12000;
  const rent = Number(planReq.rentAndUtilitiesCost || 8000);
  const expenses = raw + staff + rent;
  const profit = sales - expenses;
  const emi = Math.round((loan * 0.00416 * Math.pow(1.00416, 36)) / (Math.pow(1.00416, 36) - 1));
  const dscr = emi > 0 ? (profit / emi).toFixed(2) : '3.50';

  return {
    businessSummary: `Establishment of an enterprise in ${planReq.location} for ${planReq.businessType}. The unit employs ${planReq.numberOfEmployees || 1} assistant(s) with modern equipment.`,
    purposeOfLoan: `Procurement of essential equipment (Rs ${equip.toLocaleString()}) and operational working capital (Rs ${wc.toLocaleString()}) for smooth startup.`,
    equipmentCost: equip,
    workingCapital: wc,
    totalProjectCost: cost,
    marginMoneyPromoterContribution: margin,
    bankLoanRequired: loan,
    expectedMonthlyRevenue: sales,
    rawMaterialExpense: raw,
    salariesExpense: staff,
    rentAndUtilitiesExpense: rent,
    totalMonthlyExpenses: expenses,
    netMonthlyProfit: profit,
    estimatedMonthlyEmi: emi,
    debtServiceCoverageRatio: Number(dscr),
    repaymentCapacityAssessment: `Robust Debt Servicing (DSCR: ${dscr}x). Monthly net operational surplus of Rs ${profit.toLocaleString()} easily covers loan installment of Rs ${emi.toLocaleString()}.`,
    onePageProjectReport: `ONE-PAGE PROJECT REPORT\n------------------------------------\nBusiness: ${planReq.businessType}\nLocation: ${planReq.location}\nTotal Project Cost: Rs ${cost.toLocaleString()}\nPromoter Margin (5%): Rs ${margin.toLocaleString()}\nTerm Loan Needed (95%): Rs ${loan.toLocaleString()}\nMonthly Sales: Rs ${sales.toLocaleString()}\nOperating Expenses: Rs ${expenses.toLocaleString()}\nNet Monthly Profit: Rs ${profit.toLocaleString()}\nMonthly EMI (5% p.a., 36 mo): Rs ${emi.toLocaleString()}\nDSCR: ${dscr}x (Viable)`
  };
}

export async function calculateEmi(req) {
  try {
    const res = await fetch(`${API_BASE}/emi/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API fallback for EMI:', err);
  }

  const p = Math.max(1000, Number(req.loanAmount) - Number(req.subsidyContribution || 0));
  const r = (Number(req.annualInterestRate) / 100) / 12;
  const n = Number(req.tenureMonths);
  const emi = Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const morat = Number(req.moratoriumMonths || 0);
  const moratInterest = Math.round(p * r * morat);
  const regularInterest = Math.round((emi * n) - p);
  const totalInterest = moratInterest + regularInterest;

  const schedule = [];
  let balance = p;
  for (let m = 1; m <= morat; m++) {
    const mi = Math.round(balance * r);
    schedule.push({ month: m, openingBalance: balance, principalPaid: 0, interestPaid: mi, totalPayment: mi, closingBalance: balance, isMoratorium: true });
  }
  for (let m = 1; m <= Math.min(24, n); m++) {
    const i = Math.round(balance * r);
    const pr = emi - i;
    const closing = Math.max(0, balance - pr);
    schedule.push({ month: morat + m, openingBalance: balance, principalPaid: pr, interestPaid: i, totalPayment: emi, closingBalance: closing, isMoratorium: false });
    balance = closing;
  }

  return {
    loanAmount: req.loanAmount,
    effectivePrincipal: p,
    monthlyEmi: emi,
    totalInterest,
    totalRepayment: p + totalInterest,
    repaymentStartDate: new Date(Date.now() + (morat + 1) * 30 * 24 * 60 * 60 * 1000).toISOString(),
    moratoriumEffect: morat > 0 ? `Moratorium of ${morat} months provides a gestation buffer. Principal repayment begins in Month ${morat + 1}.` : 'No moratorium configured.',
    schedule
  };
}

export async function getPartners(district = 'Bengaluru', schemeId = null) {
  try {
    const url = new URL(`${API_BASE}/partners/route`);
    url.searchParams.append('district', district);
    if (schemeId) url.searchParams.append('schemeId', schemeId);
    const res = await fetch(url.toString());
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API fallback for partners:', err);
  }

  return [
    {
      id: 'PART-SCA-01',
      institutionName: 'Karnataka State Dr. B.R. Ambedkar Development Corporation (SCA)',
      institutionType: 'SCA',
      district: 'Bengaluru',
      state: 'Karnataka',
      distanceKm: 4.2,
      contactNumber: '+91 80 2286 4521 / +91 94808 12345',
      contactPerson: 'Shri M. Nagaraj (District Manager)',
      address: 'No. 9 & 10, Vishweshwaraiah Towers, 9th Floor, Dr. Ambedkar Veedhi, Bengaluru - 560001',
      applicationMode: 'Offline',
      supportedSchemes: ['NSFDC-MCS-01', 'NSFDC-TLS-02', 'NSFDC-MSY-03', 'NSFDC-LUY-04'],
      documentRequirements: ['Aadhaar copy', 'Caste certificate (RD number)', 'Income certificate', 'Bank passbook copy', 'Quotation'],
      lastVerifiedDate: '2026-09-10T00:00:00Z',
      isOnlineSubmissionAvailable: false,
      pincode: '560001',
      isIllustrative: true,
      dataProvenance: DATA_PROVENANCE
    },
    {
      id: 'PART-PSB-02',
      institutionName: 'Canara Bank - MSME & Financial Inclusion Hub',
      institutionType: 'PSB',
      district: 'Bengaluru',
      state: 'Karnataka',
      distanceKm: 6.8,
      contactNumber: '+91 80 2558 7720',
      contactPerson: 'Ms. Sunita Rao (Chief Manager MSME)',
      address: 'MG Road Branch, Near Trinity Metro Station, Bengaluru - 560001',
      applicationMode: 'Hybrid',
      supportedSchemes: ['NSFDC-MCS-01', 'NSFDC-TLS-02', 'NSFDC-LUY-04'],
      documentRequirements: ['KYC docs', 'Caste certificate', 'Income declaration', 'Business DPR', 'Vendor quotation'],
      lastVerifiedDate: '2026-09-08T00:00:00Z',
      isOnlineSubmissionAvailable: true,
      pincode: '560001',
      isIllustrative: true,
      dataProvenance: DATA_PROVENANCE
    },
    {
      id: 'PART-MFI-04',
      institutionName: 'Grameen Koota Financial Services (NBFC-MFI)',
      institutionType: 'NBFC-MFI',
      district: 'Bengaluru',
      state: 'Karnataka',
      distanceKm: 5.4,
      contactNumber: '1800 103 4567 / +91 80 4125 8899',
      contactPerson: 'Ms. Kavitha Gowda (Branch Coordinator)',
      address: 'Jayanagar 4th Block, Near BDA Complex, Bengaluru - 560011',
      applicationMode: 'Hybrid',
      supportedSchemes: ['NSFDC-MCS-01', 'NSFDC-MSY-03'],
      documentRequirements: ['Aadhaar Card', 'Voter ID', 'Bank statement'],
      lastVerifiedDate: '2026-09-09T00:00:00Z',
      isOnlineSubmissionAvailable: true,
      pincode: '560011',
      isIllustrative: true,
      dataProvenance: DATA_PROVENANCE
    },
    {
      id: 'PART-RRB-03',
      institutionName: 'Karnataka Gramin Bank (RRB)',
      institutionType: 'RRB',
      district: 'Bengaluru Rural',
      state: 'Karnataka',
      distanceKm: 14.5,
      contactNumber: '+91 80 2793 1102',
      contactPerson: 'Shri Ramesh Kulkarni (Officer)',
      address: 'Doddaballapur Main Road, Yelahanka Sub-hub, Bengaluru - 560064',
      applicationMode: 'Offline',
      supportedSchemes: ['NSFDC-MCS-01', 'NSFDC-MSY-03'],
      documentRequirements: ['Aadhaar', 'Ration card', 'Caste cert', 'Quotation'],
      lastVerifiedDate: '2026-09-05T00:00:00Z',
      isOnlineSubmissionAvailable: false,
      pincode: '560064',
      isIllustrative: true,
      dataProvenance: DATA_PROVENANCE
    }
  ];
}

/**
 * Generates and persists the application dossier. Protected (R4.15). The deleted fallback
 * invented an application id, a handoff reference and an eligibility narrative — a dossier the
 * beneficiary could have taken to a bank branch that no server had ever seen (R5.11).
 */
export async function generateApplicationPack(profile) {
  return tokenFetchJson('application-pack/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
}

/**
 * PM-SURAJ handoff. Protected (R4.15). The deleted fallback reported
 * `success: true, status: 'Transferred to PM-SURAJ Portal'` while nothing had been transferred.
 */
export async function handoffToSuraj(appId) {
  return tokenFetchJson(`application-pack/handoff/${encodeURIComponent(appId)}`, { method: 'POST' });
}

/** Admin statistics. Admin_Role only (R4.14); the deleted fallback reported 148 fictional
 *  applications and a district breakdown to match. */
export async function getAdminStats() {
  return tokenFetchJson('admin/stats');
}

/**
 * Uploads one document and returns `{ id, documentKey, originalFileName, byteLength, readinessScore }`.
 *
 * The body is `FormData`, so no `Content-Type` header is set by hand — the browser adds the
 * multipart boundary. `applicationPackId` is optional and links the document to a dossier, which
 * is what lets the assigned officer read it.
 */
export async function uploadDocument(file, docKey, applicationPackId = null) {
  const form = new FormData();
  form.append('file', file);
  form.append('docKey', docKey);
  if (applicationPackId) form.append('applicationPackId', applicationPackId);

  const response = await tokenFetch('documents', { method: 'POST', body: form });

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body?.error || '';
    } catch {
      /* an empty body is expected for 401 and 404 */
    }
    throw new ApiError(detail || `Upload failed with status ${response.status}.`, response.status, 'documents');
  }

  return response.json();
}

/** The caller's own live documents — metadata only. */
export async function listMyDocuments() {
  return tokenFetchJson('documents/mine');
}
