import React from 'react';
import { 
  Droplet, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  MessageSquare,
  Share2,
  Facebook,
  Users,
  Youtube,
  Send,
  Instagram,
  Music,
  Twitter,
  Linkedin
} from 'lucide-react';
import { SiteConfig } from '../types';
import { storageService } from '../services/storageService';
import { formatDriveImageUrl } from '../utils/imageUtils';

interface FooterProps {
  setCurrentPage: (page: string) => void;
  onOpenEmergencyModal: () => void;
  siteConfig?: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onOpenEmergencyModal, siteConfig: propConfig }) => {
  const config = propConfig || storageService.getSiteConfig();

  // Extract all social links
  const social = {
    facebook: config.facebookUrl || config.socialLinks?.facebook,
    facebookGroup: config.facebookGroupUrl || config.socialLinks?.facebookGroup,
    whatsappGroup: config.whatsappCommunityUrl || config.socialLinks?.whatsappGroup,
    whatsappNumber: config.whatsappNumber || config.socialLinks?.whatsappNumber,
    youtube: config.youtubeUrl || config.socialLinks?.youtube,
    telegram: config.telegramUrl || config.socialLinks?.telegram,
    instagram: config.instagramUrl || config.socialLinks?.instagram,
    tiktok: config.tiktokUrl || config.socialLinks?.tiktok,
    twitter: config.twitterUrl || config.socialLinks?.twitter,
    linkedin: config.linkedinUrl || config.socialLinks?.linkedin,
  };

  const hasAnySocial = Object.values(social).some(val => Boolean(val && val.trim()));

  return (
    <footer className="bg-[#070D1E] text-slate-300 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Emergency CTA Row (Royal Crimson to Deep Dark Navy) */}
      <div className="bg-gradient-to-r from-[#991B1B] via-[#7F1D1D] to-[#0F172A] text-white py-7 px-4 sm:px-6 lg:px-8 border-b border-red-950/60 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-1.5">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="bg-amber-400 text-stone-950 text-xs font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                জরুরি রক্ত সেবা ২৪/৭
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                আপনার কি জরুরি রক্তের প্রয়োজন?
              </h3>
            </div>
            <p className="text-red-100 text-sm max-w-xl">
              এক ক্লিকে রক্তের জরুরি আবেদন করুন, আমাদের ভেরিফাইড রক্তদাতা ও ভলান্টিয়ার টিম দ্রুত পাশে দাঁড়াবে।
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={onOpenEmergencyModal}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-6 py-3 rounded-xl transition-all shadow-md flex items-center space-x-2 text-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <Droplet className="w-4 h-4 fill-current text-red-700" />
              <span>জরুরি রক্তের আবেদন করুন</span>
            </button>
            <a
              href={`tel:${config.emergencyPhone || config.contactPhone}`}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-xl border border-white/20 transition-all flex items-center space-x-2 text-sm backdrop-blur-xs"
            >
              <Phone className="w-4 h-4 text-amber-300" />
              <span>হটলাইনে কল করুন</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand Info & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {config.logoUrl ? (
                <img 
                  src={formatDriveImageUrl(config.logoUrl)} 
                  alt={config.siteName} 
                  className="w-11 h-11 rounded-xl object-contain bg-white/10 p-1 border border-amber-400/30 shadow-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-md border border-amber-400/40">
                  <Droplet className="w-6 h-6 fill-white" />
                </div>
              )}
              <div>
                <span className="text-lg sm:text-xl font-black text-white tracking-tight block">
                  {config.siteName}
                </span>
                {config.siteNameEn && (
                  <span className="text-[11px] text-slate-400 tracking-wider font-medium">
                    {config.siteNameEn}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {config.footerText || config.siteSlogan}
            </p>

            <div className="p-3 bg-[#0E1A38] rounded-xl border border-blue-900/40 flex items-center space-x-3 text-xs text-amber-300 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-medium">{config.siteSlogan}</span>
            </div>

            {/* Social Media Channels Row */}
            {hasAnySocial && (
              <div className="pt-2 space-y-2.5">
                <p className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>সোশ্যাল মিডিয়া ও কমিউনিটি</span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {social.facebook && (
                    <a
                      href={social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="ফেসবুক পেইজ"
                      aria-label="Facebook Page"
                      className="w-9 h-9 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-blue-500/25"
                    >
                      <Facebook className="w-4.5 h-4.5 fill-current" />
                    </a>
                  )}
                  {social.facebookGroup && (
                    <a
                      href={social.facebookGroup}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="ফেসবুক রক্তদান গ্রুপ"
                      aria-label="Facebook Blood Donation Group"
                      className="w-9 h-9 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-indigo-500/25"
                    >
                      <Users className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {social.whatsappGroup && (
                    <a
                      href={social.whatsappGroup}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="হোয়াটসঅ্যাপ গ্রুপ"
                      aria-label="WhatsApp Community Group"
                      className="w-9 h-9 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-emerald-500/25"
                    >
                      <MessageSquare className="w-4.5 h-4.5 fill-current" />
                    </a>
                  )}
                  {social.whatsappNumber && (
                    <a
                      href={`https://wa.me/${social.whatsappNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`হোয়াটসঅ্যাপ ডিরেক্ট চ্যাট (${social.whatsappNumber})`}
                      aria-label="WhatsApp Chat"
                      className="w-9 h-9 rounded-xl bg-[#128C7E] hover:bg-[#0e7468] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-teal-500/25"
                    >
                      <Phone className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {social.youtube && (
                    <a
                      href={social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="ইউটিউব চ্যানেল"
                      aria-label="YouTube Channel"
                      className="w-9 h-9 rounded-xl bg-[#FF0000] hover:bg-[#e60000] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-red-500/25"
                    >
                      <Youtube className="w-4.5 h-4.5 fill-current" />
                    </a>
                  )}
                  {social.telegram && (
                    <a
                      href={social.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="টেলিগ্রাম চ্যানেল"
                      aria-label="Telegram Channel"
                      className="w-9 h-9 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm hover:shadow-sky-500/25"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </a>
                  )}
                  {social.instagram && (
                    <a
                      href={social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="ইনস্টাগ্রাম"
                      aria-label="Instagram"
                      className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    >
                      <Instagram className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {social.tiktok && (
                    <a
                      href={social.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="টিকটক"
                      aria-label="TikTok"
                      className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-black border border-stone-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    >
                      <Music className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {social.twitter && (
                    <a
                      href={social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="টুইটার / এক্স (X)"
                      aria-label="Twitter / X"
                      className="w-9 h-9 rounded-xl bg-stone-900 hover:bg-black border border-stone-700 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    >
                      <Twitter className="w-4.5 h-4.5 fill-current" />
                    </a>
                  )}
                  {social.linkedin && (
                    <a
                      href={social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="লিঙ্কডইন"
                      aria-label="LinkedIn"
                      className="w-9 h-9 rounded-xl bg-[#0A66C2] hover:bg-[#08559e] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    >
                      <Linkedin className="w-4.5 h-4.5 fill-current" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-xs"></span>
              <span>প্রয়োজনীয় লিংক</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:text-amber-400 transition-colors text-left">
                  হোমপেজ
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('requests')} className="hover:text-amber-400 transition-colors text-left flex items-center space-x-1.5">
                  <span>চলমান রক্তের অনুরোধসমূহ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('donors')} className="hover:text-amber-400 transition-colors text-left">
                  ডোনার তালিকা ও সন্ধান
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('gallery')} className="hover:text-amber-400 transition-colors text-left">
                  কার্যক্রম ও স্মৃতি গ্যালারি
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('apply')} className="hover:text-amber-300 transition-colors text-amber-400 font-semibold text-left">
                  স্বেচ্ছাসেবী / ক্যাম্প আবেদন
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="hover:text-amber-400 transition-colors text-left">
                  আমাদের সম্পর্কে ও নীতিমালা
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="hover:text-amber-400 transition-colors text-left">
                  যোগাযোগ ও হেল্পডেস্ক
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Upazila List */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-xs"></span>
              <span>নীলফামারী উপজেলা সমূহ</span>
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-300">
              <span className="py-1.5 px-3 bg-[#0E1A38]/90 rounded-lg border border-blue-900/30 flex items-center justify-between">
                <span>📍 নীলফামারী সদর</span>
                <span className="text-[10px] text-slate-400">Sadar</span>
              </span>
              <span className="py-1.5 px-3 bg-[#0E1A38]/90 rounded-lg border border-blue-900/30 flex items-center justify-between">
                <span>📍 সৈয়দপুর উপজেলা</span>
                <span className="text-[10px] text-slate-400">Saidpur</span>
              </span>
              <span className="py-1.5 px-3 bg-[#0E1A38]/90 rounded-lg border border-blue-900/30 flex items-center justify-between">
                <span>📍 ডোমার উপজেলা</span>
                <span className="text-[10px] text-slate-400">Domar</span>
              </span>
              <span className="py-1.5 px-3 bg-[#0E1A38]/90 rounded-lg border border-blue-900/30 flex items-center justify-between">
                <span>📍 ডিমলা উপজেলা</span>
                <span className="text-[10px] text-slate-400">Dimla</span>
              </span>
              <span className="py-1.5 px-3 bg-[#0E1A38]/90 rounded-lg border border-blue-900/30 flex items-center justify-between">
                <span>📍 জলঢাকা উপজেলা</span>
                <span className="text-[10px] text-slate-400">Jaldhaka</span>
              </span>
              <span className="py-1.5 px-3 bg-[#0E1A38]/90 rounded-lg border border-blue-900/30 flex items-center justify-between">
                <span>📍 কিশোরগঞ্জ উপজেলা</span>
                <span className="text-[10px] text-slate-400">Kishoreganj</span>
              </span>
            </div>
          </div>

          {/* Column 4: Contact & Control Room */}
          <div className="space-y-3.5">
            <h4 className="text-white font-bold text-base mb-4 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs"></span>
              <span>নীলফামারী কন্ট্রোল রুম</span>
            </h4>
            
            <div className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300">
              <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <span>{config.officeAddress || 'হাসপাতাল রোড, নীলফামারী সদর'}</span>
            </div>

            <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-300">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <a 
                href={`tel:${config.emergencyPhone || config.contactPhone}`} 
                className="hover:text-amber-300 font-semibold transition-colors"
              >
                {config.emergencyPhone || config.contactPhone}
              </a>
            </div>

            {config.emergencyEmail && (
              <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-300">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">{config.emergencyEmail}</span>
              </div>
            )}

            {social.whatsappNumber && (
              <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-300">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${social.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors"
                >
                  WhatsApp: {social.whatsappNumber}
                </a>
              </div>
            )}

            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-slate-300 leading-relaxed">
              <span className="text-amber-400 font-semibold">📌 জরুরি পরামর্শ:</span> যেকোনো অপারেশনের পূর্বে রোগীর রক্তের ক্রস-ম্যাচিং নিশ্চিত করুন।
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="text-center sm:text-left">{config.copyrightText || `© ২০২৬ ${config.siteName}। সর্বস্বত্ব সংরক্ষিত।`}</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 text-slate-300 font-medium">
              <span>মানবতার সেবায় নিবেদিত</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
