import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { 
  Calculator, 
  Sparkles, 
  Info, 
  ArrowRight, 
  Clock, 
  TrendingDown, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { calculateEmi } from '../api';

export default function EmiSimulator({ 
  lang = 'en', 
  profile, 
  selectedScheme, 
  onProceedToPack 
}) {
  const t = translations[lang] || translations.en;
  const isHindi = lang === 'hi';

  const [loanAmount, setLoanAmount] = useState(profile.requiredLoanAmount || 150000);
  const [interestRate, setInterestRate] = useState(selectedScheme?.interestRate || 5.0);
  const [tenureMonths, setTenureMonths] = useState(selectedScheme?.maximumTenureMonths || 36);
  const [moratoriumMonths, setMoratoriumMonths] = useState(selectedScheme?.moratoriumMonths || 3);
  const [subsidy, setSubsidy] = useState(15000);
  const [result, setResult] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculate = async () => {
    const res = await calculateEmi({
      loanAmount,
      annualInterestRate: interestRate,
      tenureMonths,
      moratoriumMonths,
      subsidyContribution: subsidy
    });
    setResult(res);
  };

  useEffect(() => {
    calculate();
  }, [loanAmount, interestRate, tenureMonths, moratoriumMonths, subsidy]);

  const loadPreset = (pLoan, pRate, pTenure, pMorat) => {
    setLoanAmount(pLoan);
    setInterestRate(pRate);
    setTenureMonths(pTenure);
    setMoratoriumMonths(pMorat);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>{isHindi ? 'सुविधा 7: EMI एवं पुनर्भुगतान सिम्युलेटर' : 'Feature 7: EMI & Repayment Simulator'}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t.emi.title}</h2>
          <p className="text-sm text-slate-600 mt-1">{t.emi.subtitle}</p>
        </div>

        {/* Scheme Presets */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => loadPreset(150000, 5.0, 36, 3)}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
          >
            {isHindi ? 'MCS प्रीसेट (5%, 36 माह)' : 'MCS Preset (5%, 36mo)'}
          </button>
          <button
            onClick={() => loadPreset(500000, 6.0, 60, 6)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
          >
            {isHindi ? 'TLS प्रीसेट (6%, 60 माह)' : 'TLS Preset (6%, 60mo)'}
          </button>
          <button
            onClick={() => loadPreset(140000, 4.0, 42, 4)}
            className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
          >
            {isHindi ? 'MSY महिला (4%, 42 माह)' : 'MSY Women (4%, 42mo)'}
          </button>
        </div>
      </div>

      {/* Main Grid: Controls vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Area (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            {isHindi ? 'कॉन्फ़िगर करने योग्य वित्तीय पैरामीटर' : 'Configurable Parameters'}
          </h3>

          {/* Loan Amount */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">{isHindi ? 'ऋण राशि (P):' : 'Loan Amount (P):'}</span>
              <span className="text-emerald-700 font-mono text-sm">₹{loanAmount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="1500000"
              step="10000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹20,000</span>
              <span>₹5,00,000</span>
              <span>₹15,00,000</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">{isHindi ? 'वार्षिक ब्याज दर (r):' : 'Annual Interest Rate (r):'}</span>
              <span className="text-emerald-700 font-mono text-sm">{interestRate}% {isHindi ? 'वार्षिक' : 'p.a.'}</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="12.0"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{isHindi ? '3% (रियायती)' : '3% (Subsidized)'}</span>
              <span>{isHindi ? '6% (मानक)' : '6% (Standard)'}</span>
              <span>{isHindi ? '12% (वाणिज्यिक)' : '12% (Commercial)'}</span>
            </div>
          </div>

          {/* Tenure Months */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">{isHindi ? 'पुनर्भुगतान अवधि (n):' : 'Repayment Tenure (n):'}</span>
              <span className="text-emerald-700 font-mono text-sm">
                {isHindi 
                  ? `${tenureMonths} माह (${(tenureMonths/12).toFixed(1)} वर्ष)` 
                  : `${tenureMonths} Months (${(tenureMonths/12).toFixed(1)} yrs)`}
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="84"
              step="6"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{isHindi ? '12 माह' : '12 Months'}</span>
              <span>{isHindi ? '36 माह' : '36 Months'}</span>
              <span>{isHindi ? '84 माह' : '84 Months'}</span>
            </div>
          </div>

          {/* Moratorium Period */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">{isHindi ? 'मोरेटोरियम / प्रारंभिक राहत अवधि:' : 'Moratorium / Gestation Buffer:'}</span>
              <span className="text-emerald-700 font-mono text-sm">
                {isHindi ? `${moratoriumMonths} माह` : `${moratoriumMonths} Months`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={moratoriumMonths}
              onChange={(e) => setMoratoriumMonths(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>{isHindi ? '0 (तत्काल)' : '0 (Immediate)'}</span>
              <span>{isHindi ? '3 माह' : '3 Months'}</span>
              <span>{isHindi ? '12 माह' : '12 Months'}</span>
            </div>
          </div>

          {/* Government Subsidy */}
          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-700">{isHindi ? 'सरकारी सब्सिडी / प्रमोटर अंशदान:' : 'Government Subsidy / Promoter Contribution:'}</span>
              <span className="text-emerald-700 font-mono text-sm">₹{subsidy.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              value={subsidy}
              onChange={(e) => setSubsidy(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Results Card (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
          {result ? (
            <>
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    {isHindi ? 'पुनर्भुगतान प्रक्षेपण' : 'Repayment Projection'}
                  </h3>
                  <span className="text-xs text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded">
                    {isHindi ? 'सत्यापित सूत्र' : 'Formula Verified'}
                  </span>
                </div>

                {/* Primary EMI Stat */}
                <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-md text-center">
                  <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold block">
                    {isHindi ? 'गणना की गई मासिक किस्त (EMI)' : 'Calculated Monthly Installment (EMI)'}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white my-1">
                    ₹{result.monthlyEmi.toLocaleString()}
                  </div>
                  <span className="text-xs text-emerald-300">
                    {isHindi ? 'प्रभावी मूलधन:' : 'Effective Principal:'} ₹{result.effectivePrincipal.toLocaleString()}
                  </span>
                </div>

                {/* Breakdown Tiles */}
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <span className="text-slate-500 font-medium block">
                      {isHindi ? 'देय कुल ब्याज' : 'Total Interest Payable'}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">₹{result.totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <span className="text-slate-500 font-medium block">
                      {isHindi ? 'कुल चुकाई जाने वाली राशि' : 'Total Amount Repaid'}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">₹{result.totalRepayment.toLocaleString()}</span>
                  </div>
                </div>

                {/* Moratorium Detail */}
                <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">
                      {isHindi ? 'मोरेटोरियम का प्रभाव:' : 'Effect of Moratorium:'}
                    </strong>
                    <span>
                      {isHindi 
                        ? `शुरुआती ${moratoriumMonths} महीनों के दौरान केवल साधारण ब्याज देय होता है, जिससे व्यवसाय को स्थिर होने का समय मिलता है।`
                        : result.moratoriumEffect}
                    </span>
                  </div>
                </div>

                {/* Formula Display Box */}
                <div className="mt-4 bg-slate-900 text-slate-200 p-3 rounded-xl text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold block mb-1">
                    {isHindi ? 'मानक बैंकिंग ऋण परिशोधन सूत्र:' : 'Standard Banking Amortization Formula:'}
                  </span>
                  <span>EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ - 1]</span>
                  <span className="block text-[10px] text-slate-400 mt-1">
                    {isHindi ? 'P = मूलधन, r = मासिक ब्याज दर, n = महीने' : 'P = Principal, r = Monthly Interest Rate, n = Months'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                >
                  {showSchedule 
                    ? (isHindi ? 'परिशोधन तालिका छुपाएं' : 'Hide Amortization Table')
                    : (isHindi ? 'मासिक ऋण परिशोधन तालिका देखें' : 'View Monthly Amortization Table')}
                </button>

                <button
                  onClick={onProceedToPack}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center space-x-2 cursor-pointer"
                >
                  <span>{isHindi ? 'आवेदन पैक तैयार करें' : 'Generate Application Pack'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Amortization Table Toggle */}
      {showSchedule && result && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h4 className="text-sm font-bold text-slate-900">
            {isHindi ? 'मासिक परिशोधन अनुसूची (पहले 24 महीने)' : 'Monthly Amortization Schedule (First 24 Months)'}
          </h4>
          <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 sticky top-0 text-slate-700 font-bold">
                <tr>
                  <th className="p-2.5">{isHindi ? 'माह' : 'Month'}</th>
                  <th className="p-2.5">{isHindi ? 'प्रारंभिक शेष (₹)' : 'Opening (₹)'}</th>
                  <th className="p-2.5">{isHindi ? 'मूलधन (₹)' : 'Principal (₹)'}</th>
                  <th className="p-2.5">{isHindi ? 'ब्याज (₹)' : 'Interest (₹)'}</th>
                  <th className="p-2.5">{isHindi ? 'कुल ईएमआई (₹)' : 'Total EMI (₹)'}</th>
                  <th className="p-2.5">{isHindi ? 'अंतिम शेष (₹)' : 'Closing (₹)'}</th>
                  <th className="p-2.5">{isHindi ? 'प्रकार' : 'Type'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {result.schedule.map((row) => (
                  <tr key={row.month} className={row.isMoratorium ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                    <td className="p-2.5 font-bold">{row.month}</td>
                    <td className="p-2.5">₹{row.openingBalance.toLocaleString()}</td>
                    <td className="p-2.5 text-emerald-700">₹{row.principalPaid.toLocaleString()}</td>
                    <td className="p-2.5 text-rose-700">₹{row.interestPaid.toLocaleString()}</td>
                    <td className="p-2.5 font-bold">₹{row.totalPayment.toLocaleString()}</td>
                    <td className="p-2.5">₹{row.closingBalance.toLocaleString()}</td>
                    <td className="p-2.5">
                      {row.isMoratorium ? (
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-sans">
                          {isHindi ? 'मोरेटोरियम' : 'Moratorium'}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-sans">
                          {isHindi ? 'नियमित EMI' : 'Regular EMI'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
