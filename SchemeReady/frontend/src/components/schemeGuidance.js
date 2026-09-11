// Scheme guidance used by the voice assistant. Values mirror the current NSFDC
// scheme summary and are intentionally presented as preliminary guidance; final
// eligibility, sanction, and partner requirements are verified by the authorised agency.
export const CURRENT_NSFDC_GUIDANCE = {
  common: {
    category: 'SC',
    annualFamilyIncomeMax: 500000,
    channelRoute: 'PM-SURAJ or an authorised State/other Channelising Agency',
    directApplication: false
  },
  schemes: [
    {
      id: 'mfs',
      name: 'Micro Finance Scheme (MFS)',
      projectCostMax: 140000,
      loanMax: 125000,
      beneficiaryInterest: 6.5,
      tenureMonths: 36,
      moratoriumMonths: 3,
      channel: 'SCAs/CAs'
    },
    {
      id: 'amy',
      name: 'Aajeevika Micro-Finance Yojana (AMY)',
      projectCostMax: 140000,
      loanMax: 125000,
      beneficiaryInterest: 15,
      tenureMonths: 36,
      moratoriumMonths: 3,
      channel: 'Selected NBFC-MFIs'
    },
    {
      id: 'term',
      name: 'Term Loan',
      projectCostMin: 140001,
      projectCostMax: 5000000,
      loanMax: 4500000,
      beneficiaryInterest: 8,
      tenureMonths: 84,
      moratoriumMonths: 6,
      channel: 'SCAs/CAs'
    },
    {
      id: 'uny',
      name: 'Udyam Nidhi Yojana (UNY)',
      projectCostMax: 500000,
      loanMax: 450000,
      beneficiaryInterestRange: '13–15',
      tenureMonths: 60,
      moratoriumMonths: 3,
      channel: 'Co-operative Societies/Banks or Small Finance Banks'
    }
  ]
};

export function localSchemeMatches(profile = {}) {
  const category = String(profile.category || '').toUpperCase();
  const income = Number(profile.annualFamilyIncome || profile.householdAnnualIncome || 0);
  const cost = Number(profile.estimatedProjectCost || 0);
  if (category !== 'SC' || income <= 0 || income > CURRENT_NSFDC_GUIDANCE.common.annualFamilyIncomeMax || cost <= 0) return [];

  return CURRENT_NSFDC_GUIDANCE.schemes.filter(s =>
    (s.projectCostMin == null || cost >= s.projectCostMin) &&
    (s.projectCostMax == null || cost <= s.projectCostMax)
  );
}
