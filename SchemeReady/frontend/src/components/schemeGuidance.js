// Current SchemeReady guidance for entrepreneur-facing NSFDC assistance.
// Use as preliminary guidance only; final eligibility, sanction and partner
// requirements are determined by the authorised agency and current guidelines.
export const CURRENT_NSFDC_GUIDANCE = {
  updated: '2026-09-10',
  common: { category: 'SC', annualFamilyIncomeMax: 500000, financingShare: 'up to 90% of project cost', route: 'PM-SURAJ or authorised State/other Channelising Agency', directApplication: false, requiredCoreDocuments: ['Valid SC caste certificate', 'Income proof', 'KYC documents'] },
  schemes: [
    { id: 'mfs', name: 'Micro Finance Scheme (MFS)', projectCostMax: 140000, loanMax: 125000, interest: '6.5% p.a.', tenure: 'up to 3 years', moratorium: '3 months', channel: 'SCAs/CAs', audience: 'small income-generating activities' },
    { id: 'amy', name: 'Aajeevika Micro-Finance Yojana (AMY)', projectCostMax: 140000, loanMax: 125000, interest: '15% p.a.', tenure: 'up to 3 years', moratorium: '3 months', channel: 'selected NBFC-MFIs', audience: 'small income-generating activities' },
    { id: 'term', name: 'Term Loan', projectCostMin: 140001, projectCostMax: 5000000, loanMax: 4500000, interest: '8% p.a.', tenure: 'up to 7 years', moratorium: '6 months', channel: 'SCAs/CAs', audience: 'larger income-generating projects' },
    { id: 'uny', name: 'Udyam Nidhi Yojana (UNY)', projectCostMax: 500000, loanMax: 450000, interest: '13% p.a. through co-operative societies/banks; 15% p.a. through SFBs', tenure: 'up to 5 years', moratorium: '3 months', channel: 'Co-operative Societies/Banks or Small Finance Banks', audience: 'small/micro income-generating activities' }
  ]
};

export function applicableLocalSchemes(profile = {}) {
  const category = String(profile.category || '').toUpperCase();
  const income = Number(profile.annualFamilyIncome || profile.householdAnnualIncome || 0);
  const cost = Number(profile.estimatedProjectCost || 0);
  if (category !== 'SC' || income <= 0 || income > CURRENT_NSFDC_GUIDANCE.common.annualFamilyIncomeMax || cost <= 0) return [];
  return CURRENT_NSFDC_GUIDANCE.schemes.filter(s => (s.projectCostMin == null || cost >= s.projectCostMin) && (s.projectCostMax == null || cost <= s.projectCostMax));
}
