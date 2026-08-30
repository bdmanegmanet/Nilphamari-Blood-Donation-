import React, { useState, useEffect, useRef } from 'react';
import { BloodRequest, SiteConfig, User } from '../types';
import { 
  Droplet, 
  PhoneCall, 
  MessageSquare, 
  Download, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  AlertCircle, 
  Share2, 
  Clock, 
  Hospital, 
  MapPin, 
  User as UserIcon,
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';
import { 
  downloadBloodRequestImage, 
  generateBloodRequestShareText, 
  copyToClipboard, 
  copyShareLink 
} from '../utils/shareUtils';
import { storageService } from '../services/storageService';

interface UrgentRequestsTopSliderProps {
  requests: BloodRequest[];
  siteConfig?: SiteConfig;
  currentUser?: User | null;
  onRefresh: () => void;
  onOpenEmergencyModal: () => void;
  onNavigateToRequests: () => void;
}

export const UrgentRequestsTopSlider: React.FC<UrgentRequestsTopSliderProps> = ({
  requests,
  siteConfig,
  currentUser,
  onRefresh,
  onOpenEmergencyModal,
  onNavigateToRequests
}) => {
  // Filter active requests (approved or pending)
  const activeRequests = requests.filter(r => r.status === 'approved' || r.status === 'pending');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [linkCopiedId, setLinkCopiedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Auto rotate every exactly 5 seconds (5000ms)
  useEffect(() => {
    if (activeRequests.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeRequests.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeRequests.length, isPaused]);

  if (activeRequests.length === 0) {
    return null;
  }

  const currentReq = activeRequests[currentIndex] || activeRequests[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeRequests.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeRequests.length) % activeRequests.length);
  };

  const handleCopyText = async (req: BloodRequest) => {
    const text = generateBloodRequestShareText(
      req, 
      siteConfig?.siteName, 
      siteConfig?.hotlineNumber || siteConfig?.contactPhone
    );
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(req.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleCopyLink = async (req: BloodRequest) => {
    const res = await copyShareLink('requests', { id: req.id, group: req.bloodGroup });
    if (res.success) {
      setLinkCopiedId(req.id);
      setTimeout(() => setLinkCopiedId(null), 2500);
    }
  };

  const handleDownload = async (req: BloodRequest, format: 'png' | 'jpeg') => {
    setIsExporting(req.id + format);
    try {
      await downloadBloodRequestImage(
        req, 
        format, 
        siteConfig
      );
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsExporting(null), 800);
    }
  };

  // Strict Permission Check: Only Admin OR Authenticated Logged-in User who owns this request can delete
  const canDeleteCurrent = (): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;

    // Check if user's phone or email matches the requester
    const userPhoneNorm = (currentUser.phone || '').replace(/[^0-9]/g, '');
    const reqPhoneNorm = (currentReq.contact || '').replace(/[^0-9]/g, '');
    
    const phoneMatch = userPhoneNorm.length >= 10 && reqPhoneNorm.length >= 10 && 
      (userPhoneNorm.endsWith(reqPhoneNorm.slice(-10)) || reqPhoneNorm.endsWith(userPhoneNorm.slice(-10)));
      
    const emailMatch = currentUser.email && (currentReq as any).email && 
      currentUser.email.toLowerCase() === (currentReq as any).email.toLowerCase();

    const nameMatch = currentUser.name && currentReq.requesterName && 
      currentUser.name.trim().toLowerCase() === currentReq.requesterName.trim().toLowerCase();

    return Boolean(phoneMatch || emailMatch || nameMatch);
  };

  const handleDeleteRequest = (req: BloodRequest) => {
    if (!currentUser) {
      alert('আবেদনটি মুছতে প্রথমে আপনার অ্যাকাউন্টে লগইন করুন। শুধুমাত্র আবেদনকারী বা অ্যাডমিন আবেদন মুছতে পারবেন।');
      return;
    }

    if (!canDeleteCurrent()) {
      alert('শুধুমাত্র এই আবেদনটি যিনি তৈরি করেছেন তিনি লগইন অবস্থায় অথবা অ্যাডমিন এটি মুছতে পারবেন।');
      return;
    }

    if (window.confirm(`আপনি কি নিশ্চিত যে "${req.requesterName}" এর ${req.bloodGroup} রক্তের আবেদনটি সমাপ্ত বা অপসারণ করতে চান?`)) {
      storageService.deleteRequest(req.id);
      onRefresh();
      if (currentIndex >= activeRequests.length - 1) {
        setCurrentIndex(Math.max(0, activeRequests.length - 2));
      }
    }
  };

  const isUserAllowedToDelete = canDeleteCurrent();

  return (
    <div 
      className="relative rounded-3xl overflow-hidden shadow-lg border border-stone-200 bg-white text-stone-900 transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Banner Bar (Clean Crimson Header) */}
      <div className="bg-[#B71C1C] px-5 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-white border-b border-red-700">
        <div className="flex items-center space-x-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-sm sm:text-base font-bold text-white tracking-wide">
              জরুরি রক্তের আবেদন
            </span>
            <span className="text-xs bg-black/30 px-2.5 py-0.5 rounded-full text-amber-300 font-mono font-bold">
              {currentIndex + 1} / {activeRequests.length}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenEmergencyModal}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 flex items-center space-x-1.5 cursor-pointer"
          >
            <Droplet className="w-3.5 h-3.5 fill-stone-950" />
            <span>নতুন আবেদন দিন</span>
          </button>
        </div>
      </div>

      {/* Main Slide Card Content - Pure White Background & Large Clean Font */}
      <div className="p-6 sm:p-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Blood Group & Urgency Details */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
            <div className="flex items-center space-x-4">
              {/* Blood Group Display Pill */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#B71C1C] to-[#8E0000] text-white flex flex-col items-center justify-center font-black shadow-md border-2 border-red-600">
                <span className="text-3xl sm:text-4xl leading-none font-sans font-bold">{currentReq.bloodGroup}</span>
                <span className="text-xs font-bold text-amber-300 mt-1">
                  {currentReq.unitsNeeded} ব্যাগ
                </span>
              </div>

              <div className="space-y-1">
                <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  currentReq.urgency === 'high' 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}>
                  {currentReq.urgency === 'high' ? '🚨 অতি জরুরি' : '⚠️ জরুরি'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                  {currentReq.requesterName}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-[#B71C1C]" />
                  <span>তারিখ: <strong className="text-stone-900 font-bold">{currentReq.donationDateNeeded || 'আজই জরুরি'}</strong></span>
                </p>
              </div>
            </div>

            {/* Quick Action Dial Buttons */}
            <div className="grid grid-cols-2 gap-2.5 w-full pt-1">
              <a
                href={`tel:${currentReq.contact}`}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>কল দিন</span>
              </a>
              <a
                href={`https://wa.me/${currentReq.contact.replace(/[^0-9]/g, '')}?text=জরুরি%20রক্তদানের%20আবেদনে%20যোগাযোগ%20করছি`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-1.5 shadow-xs transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>হোয়াটসঅ্যাপ</span>
              </a>
            </div>
          </div>

          {/* Middle Column: Pure Patient Essential Data with Large Legible Fonts */}
          <div className="lg:col-span-5 bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-3">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Hospital className="w-5 h-5 text-[#B71C1C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-stone-500 block">হাসপাতাল / রক্তদানের স্থান:</span>
                  <span className="text-base sm:text-lg font-bold text-stone-900">{currentReq.hospital}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-stone-500 block">উপজেলা / জেলা:</span>
                  <span className="text-sm sm:text-base font-bold text-stone-800">{currentReq.district}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <UserIcon className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-stone-500 block">যোগাযোগ নম্বর:</span>
                  <span className="text-base sm:text-lg font-mono font-bold text-[#B71C1C]">
                    {currentReq.contact}
                  </span>
                  {currentReq.alternateContact && (
                    <span className="text-xs text-stone-600 font-mono ml-2">({currentReq.alternateContact})</span>
                  )}
                </div>
              </div>

              {currentReq.patientProblem && (
                <div className="pt-2 border-t border-stone-200 text-xs sm:text-sm text-stone-700">
                  <span className="font-semibold text-stone-500">রোগীর সমস্যা: </span>
                  <span className="italic">"{currentReq.patientProblem}"</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Clean Actions & Controlled Deletion */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-3 bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider text-center">
              ডাউনলোড ও শেয়ার
            </span>

            {/* PNG/JPG Social Graphic Downloads */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDownload(currentReq, 'png')}
                disabled={isExporting !== null}
                className="py-2 px-2 bg-[#B71C1C] hover:bg-[#8E0000] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="সোশ্যাল মিডিয়া পোস্টের জন্য HD PNG কার্ড ডাউনলোড করুন"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting === currentReq.id + 'png' ? '...' : 'PNG কার্ড'}</span>
              </button>

              <button
                onClick={() => handleDownload(currentReq, 'jpeg')}
                disabled={isExporting !== null}
                className="py-2 px-2 bg-stone-700 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="JPG ফরম্যাটে ডাউনলোড করুন"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                <span>JPG কার্ড</span>
              </button>
            </div>

            {/* Copy Text & Link */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCopyText(currentReq)}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all border ${
                  copiedId === currentReq.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                }`}
                title="পোস্ট করার জন্য সাজানো টেক্সট কপি করুন"
              >
                {copiedId === currentReq.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span>কপি হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#B71C1C]" />
                    <span>টেক্সট কপি</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleCopyLink(currentReq)}
                className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 transition-all border ${
                  linkCopiedId === currentReq.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                }`}
                title="আবেদনের সরাসরি লিংক কপি করুন"
              >
                {linkCopiedId === currentReq.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-200" />
                    <span>লিংক কপি!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>লিংক কপি</span>
                  </>
                )}
              </button>
            </div>

            {/* Only Render/Enable Delete Button if user is logged-in Admin or the Authenticated Owner */}
            {isUserAllowedToDelete && (
              <button
                onClick={() => handleDeleteRequest(currentReq)}
                className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-red-200 transition-colors cursor-pointer"
                title="আবেদন সমাপ্ত বা মুছুন"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>{currentUser?.role === 'admin' ? 'আবেদনটি ডিলিট করুন' : 'আমার আবেদন সমাপ্ত/মুছুন'}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Bar with Auto Controls, Dots, and "সব দেখুন" Action Button */}
      <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
        {/* Previous / Next Controls and Dots */}
        <div className="flex items-center space-x-3">
          {activeRequests.length > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-xl bg-white hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors cursor-pointer shadow-xs"
                aria-label="আগের আবেদন"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center space-x-1.5">
                {activeRequests.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-6 bg-[#B71C1C]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`স্লাইড ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-1.5 rounded-xl bg-white hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors cursor-pointer shadow-xs"
                aria-label="পরের আবেদন"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action Button: "সব দেখুন" (View All Requests) */}
        <button
          onClick={onNavigateToRequests}
          className="px-5 py-2 bg-[#B71C1C] hover:bg-[#8E0000] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all duration-200 flex items-center space-x-2 cursor-pointer"
        >
          <span>সব আবেদন দেখুন ({activeRequests.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
