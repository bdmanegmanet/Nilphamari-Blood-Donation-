import React, { useState, useEffect } from 'react';
import { X, Droplet, Send, AlertTriangle, Hospital, Phone, User, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { BloodGroup, UrgencyLevel } from '../types';
import { BANGLADESH_DISTRICTS } from '../data/initialData';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface QuickEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const QuickEmergencyModal: React.FC<QuickEmergencyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    requesterName: '',
    contact: '',
    alternateContact: '',
    bloodGroup: 'A+' as BloodGroup,
    hospital: '',
    district: 'নীলফামারী সদর (Nilphamari Sadar)',
    urgency: 'high' as UrgencyLevel,
    unitsNeeded: 1,
    patientProblem: '',
    donationDateNeeded: new Date().toISOString().split('T')[0]
  });

  const [submitted, setSubmitted] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaNum1, setCaptchaNum1] = useState(3);
  const [captchaNum2, setCaptchaNum2] = useState(2);
  const [errorMessage, setErrorMessage] = useState('');

  // Lock body scroll and generate fresh captcha when modal opens
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCaptchaNum1(Math.floor(Math.random() * 5) + 3);
      setCaptchaNum2(Math.floor(Math.random() * 4) + 1);
      setCaptchaAnswer('');
      setErrorMessage('');
      setSubmitted(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.requesterName.trim() || !formData.contact.trim() || !formData.hospital.trim()) {
      setErrorMessage('অনুগ্রহ করে নাম, মোবাইল নম্বর এবং হাসপাতালের নাম সঠিকভাবে পূরণ করুন।');
      return;
    }

    if (parseInt(captchaAnswer, 10) !== captchaNum1 + captchaNum2) {
      setErrorMessage(`স্প্যাম প্রতিরোধ: ক্যাপচা উত্তর সঠিক নয় (${captchaNum1} + ${captchaNum2} = ?)`);
      return;
    }

    // Save blood request
    storageService.createRequest({
      requesterName: formData.requesterName,
      contact: formData.contact,
      alternateContact: formData.alternateContact,
      bloodGroup: formData.bloodGroup,
      hospital: formData.hospital,
      district: formData.district,
      urgency: formData.urgency,
      unitsNeeded: Number(formData.unitsNeeded) || 1,
      patientProblem: formData.patientProblem,
      donationDateNeeded: formData.donationDateNeeded,
      status: 'approved'
    });

    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    } catch {}

    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
      setSubmitted(false);
    }, 2200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-xs flex justify-center items-start p-2.5 sm:p-4 pt-12 sm:pt-8 pb-20 sm:pb-12"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative bg-white w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto sm:my-0 animate-in fade-in zoom-in-95 duration-200 max-h-[calc(100vh-4rem)] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed at Top of Modal */}
        <div className="bg-gradient-to-r from-[#B71C1C] via-[#990000] to-[#600000] p-4 sm:p-6 text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="ফর্ম বন্ধ করুন"
            className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 active:scale-95 text-white flex items-center justify-center transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3 pr-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <Droplet className="w-6 h-6 sm:w-7 sm:h-7 fill-red-700 text-red-700" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-950/70 text-amber-300 text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>জরুরি আবেদন ফর্ম</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold leading-tight">রক্তের জরুরি আবেদন</h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-red-100 mt-1.5 sm:mt-2">
            ফর্মটি পূরণ করার সাথে সাথে লাইভ বোর্ডে প্রকাশিত হবে এবং ডোনারদের দৃষ্টিগোচর হবে।
          </p>
        </div>

        {/* Content Body - Fully Scrollable with Comfortable Spacing */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 overscroll-contain">
          {submitted ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-800">অনুরোধ সফলভাবে জমা হয়েছে!</h3>
              <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                আপনার রক্তের আবেদনটি অনুমোদিত হয়েছে এবং লাইভ বোর্ডে প্রকাশিত হয়েছে। ডোনারগণ অতি দ্রুত আপনার দেওয়া নম্বরে যোগাযোগ করতে পারবেন।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Blood Group & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    রক্তের গ্রুপ (Blood Group) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as BloodGroup })}
                    className="w-full px-3.5 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-hidden text-base sm:text-sm min-h-[44px]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    কত ব্যাগ রক্ত প্রয়োজন? <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.unitsNeeded}
                    onChange={(e) => setFormData({ ...formData, unitsNeeded: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-hidden text-base sm:text-sm font-semibold min-h-[44px]"
                    required
                  />
                </div>
              </div>

              {/* 2. Requester Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  রোগীর নাম / আবেদনকারীর নাম <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 sm:top-2.5" />
                  <input
                    type="text"
                    placeholder="যেমন: রোগীর ভাই কামরুল"
                    value={formData.requesterName}
                    onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-hidden text-base sm:text-sm min-h-[44px]"
                    required
                  />
                </div>
              </div>

              {/* 3. Contact Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    মোবাইল নম্বর (যোগাযোগ) <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 sm:top-2.5" />
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-hidden text-base sm:text-sm font-mono min-h-[44px]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    বিকল্প মোবাইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="tel"
                    placeholder="018XXXXXXXX"
                    value={formData.alternateContact}
                    onChange={(e) => setFormData({ ...formData, alternateContact: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-hidden text-base sm:text-sm font-mono min-h-[44px]"
                  />
                </div>
              </div>

              {/* 4. Hospital & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    হাসপাতালের নাম ও স্থান <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Hospital className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 sm:top-2.5" />
                    <input
                      type="text"
                      placeholder="যেমন: জেনারেল হাসপাতাল, নীলফামারী"
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-hidden text-base sm:text-sm min-h-[44px]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    উপজেলা / থানা (Upazila) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-hidden text-base sm:text-sm min-h-[44px]"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Urgency & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    জরুরি অবস্থা (Urgency)
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as UrgencyLevel })}
                    className="w-full px-3.5 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-semibold focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-hidden text-base sm:text-sm min-h-[44px]"
                  >
                    <option value="high">🚨 অতি জরুরি (High Priority - Immediate)</option>
                    <option value="medium">⚠️ মাঝারি জরুরি (Medium - within 24h)</option>
                    <option value="low">📅 সাধারণ (Low - Planned Surgery)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    রক্তদানের কাঙ্ক্ষিত তারিখ <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 sm:top-2.5" />
                    <input
                      type="date"
                      value={formData.donationDateNeeded}
                      onChange={(e) => setFormData({ ...formData, donationDateNeeded: e.target.value })}
                      className="w-full pl-10 pr-3.5 py-2.5 sm:py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-hidden text-base sm:text-sm min-h-[44px]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 6. Patient Problem */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  রোগীর সমস্যা / বিস্তারিত কারণ
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    placeholder="যেমন: রোগীর সিজারিয়ান অপারেশন, হিমোগ্লোবিন ৫.২, জরুরি রক্ত প্রয়োজন..."
                    value={formData.patientProblem}
                    onChange={(e) => setFormData({ ...formData, patientProblem: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-hidden text-base sm:text-sm"
                  />
                </div>
              </div>

              {/* 7. Anti-spam Captcha */}
              <div className="p-3 sm:p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="font-bold text-stone-800 text-center sm:text-left">
                  রোবট প্রতিরোধ: {captchaNum1} + {captchaNum2} = কত?
                </span>
                <input
                  type="number"
                  placeholder="উত্তর লিখুন"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  className="w-full sm:w-32 px-3 py-2 bg-white border border-amber-300 rounded-lg text-center font-bold text-stone-900 focus:ring-2 focus:ring-red-500 text-base sm:text-sm min-h-[40px]"
                  required
                />
              </div>

              {/* 8. Action Buttons */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-sm transition-colors text-center"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] hover:from-[#8B0000] hover:to-[#B71C1C] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>আবেদন জমা দিন (Submit)</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
