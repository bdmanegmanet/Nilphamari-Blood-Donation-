import React, { useState } from 'react';
import { SiteConfig, SocialLinks } from '../../types';
import { storageService } from '../../services/storageService';
import { 
  Share2, 
  Save, 
  CheckCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Globe, 
  MessageSquare, 
  Phone,
  Radio, 
  Sparkles, 
  HelpCircle,
  RefreshCw,
  Eye,
  Facebook,
  Users,
  Youtube,
  Send,
  Instagram,
  Music,
  Twitter,
  Linkedin
} from 'lucide-react';

interface SocialLinksManagerTabProps {
  siteConfig: SiteConfig;
  onUpdateSiteConfig?: () => void;
}

export const SocialLinksManagerTab: React.FC<SocialLinksManagerTabProps> = ({
  siteConfig,
  onUpdateSiteConfig
}) => {
  const currentSocial: SocialLinks = {
    facebook: siteConfig.facebookUrl || siteConfig.socialLinks?.facebook || '',
    facebookGroup: siteConfig.facebookGroupUrl || siteConfig.socialLinks?.facebookGroup || '',
    whatsappGroup: siteConfig.whatsappCommunityUrl || siteConfig.socialLinks?.whatsappGroup || '',
    whatsappNumber: siteConfig.whatsappNumber || siteConfig.socialLinks?.whatsappNumber || '',
    youtube: siteConfig.youtubeUrl || siteConfig.socialLinks?.youtube || '',
    telegram: siteConfig.telegramUrl || siteConfig.socialLinks?.telegram || '',
    instagram: siteConfig.instagramUrl || siteConfig.socialLinks?.instagram || '',
    tiktok: siteConfig.tiktokUrl || siteConfig.socialLinks?.tiktok || '',
    twitter: siteConfig.twitterUrl || siteConfig.socialLinks?.twitter || '',
    linkedin: siteConfig.linkedinUrl || siteConfig.socialLinks?.linkedin || ''
  };

  const [formData, setFormData] = useState<SocialLinks>(currentSocial);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleInputChange = (field: keyof SocialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.updateSiteConfig({
      facebookUrl: formData.facebook?.trim() || '',
      facebookGroupUrl: formData.facebookGroup?.trim() || '',
      whatsappCommunityUrl: formData.whatsappGroup?.trim() || '',
      whatsappNumber: formData.whatsappNumber?.trim() || '',
      youtubeUrl: formData.youtube?.trim() || '',
      telegramUrl: formData.telegram?.trim() || '',
      instagramUrl: formData.instagram?.trim() || '',
      tiktokUrl: formData.tiktok?.trim() || '',
      twitterUrl: formData.twitter?.trim() || '',
      linkedinUrl: formData.linkedin?.trim() || '',
      socialLinks: {
        facebook: formData.facebook?.trim() || '',
        facebookGroup: formData.facebookGroup?.trim() || '',
        whatsappGroup: formData.whatsappGroup?.trim() || '',
        whatsappNumber: formData.whatsappNumber?.trim() || '',
        youtube: formData.youtube?.trim() || '',
        telegram: formData.telegram?.trim() || '',
        instagram: formData.instagram?.trim() || '',
        tiktok: formData.tiktok?.trim() || '',
        twitter: formData.twitter?.trim() || '',
        linkedin: formData.linkedin?.trim() || ''
      }
    });

    if (onUpdateSiteConfig) {
      onUpdateSiteConfig();
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopy = async (text: string, key: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>সোশ্যাল মিডিয়া ও কমিউনিটি চ্যানেল কনফিগারেশন</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              সোশ্যাল মিডিয়া লিংক ম্যানেজমেন্ট
            </h2>
            <p className="text-sm text-blue-200/90 mt-1 max-w-2xl">
              এখানে আপডেটকৃত সকল লিংক সম্পূর্ণ ওয়েবসাইটের ফুটার, হেডার, যোগাযোগ পেজ ও সোশ্যাল শেয়ার অপশনে স্বয়ংক্রিয়ভাবে কার্যকর হবে।
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl shadow-lg transition-all flex items-center space-x-2 text-sm"
            >
              <Save className="w-4 h-4" />
              <span>পরিবর্তন সেভ করুন</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">সোশ্যাল মিডিয়া লিংকসমূহ সফলভাবে সংরক্ষিত হয়েছে!</p>
              <p className="text-xs text-emerald-700">ফুটার, হেডার ও সকল পেজে নতুন লিংক কার্যকর করা হয়েছে।</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2 py-1 bg-emerald-200 text-emerald-900 rounded">Saved</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column (2 spans) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
            
            {/* Facebook Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                  <Facebook className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">ফেসবুক (Facebook)</h3>
                  <p className="text-xs text-stone-500">অফিসিয়াল পেইজ ও স্বেচ্ছাসেবী গ্রুপ লিংক</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    ফেসবুক অফিসিয়াল পেইজ URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.facebook || ''}
                      onChange={e => handleInputChange('facebook', e.target.value)}
                      placeholder="https://facebook.com/bloodbank.nilphamari"
                      className="w-full text-xs py-2.5 px-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {formData.facebook && (
                      <button
                        type="button"
                        onClick={() => handleCopy(formData.facebook || '', 'fb')}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                        title="কপি করুন"
                      >
                        {copiedKey === 'fb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    ফেসবুক রক্তদান গ্রুপ / কমিউনিটি URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.facebookGroup || ''}
                      onChange={e => handleInputChange('facebookGroup', e.target.value)}
                      placeholder="https://facebook.com/groups/bloodbank.nilphamari"
                      className="w-full text-xs py-2.5 px-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {formData.facebookGroup && (
                      <button
                        type="button"
                        onClick={() => handleCopy(formData.facebookGroup || '', 'fbg')}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                        title="কপি করুন"
                      >
                        {copiedKey === 'fbg' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white shadow-xs">
                  <MessageSquare className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">হোয়াটসঅ্যাপ (WhatsApp)</h3>
                  <p className="text-xs text-stone-500">কমিউনিটি গ্রুপ ইনভাইট লিংক ও সরাসরি হটলাইন নম্বর</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    হোয়াটসঅ্যাপ গ্রুপ ইনভাইট লিংক (Invite Link)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.whatsappGroup || ''}
                      onChange={e => handleInputChange('whatsappGroup', e.target.value)}
                      placeholder="https://chat.whatsapp.com/..."
                      className="w-full text-xs py-2.5 px-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                    {formData.whatsappGroup && (
                      <button
                        type="button"
                        onClick={() => handleCopy(formData.whatsappGroup || '', 'wag')}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                      >
                        {copiedKey === 'wag' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    হোয়াটসঅ্যাপ ডিরেক্ট চ্যাট নম্বর (মোবাইল)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.whatsappNumber || ''}
                      onChange={e => handleInputChange('whatsappNumber', e.target.value)}
                      placeholder="+880 1711-000001"
                      className="w-full text-xs py-2.5 px-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube & Telegram */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center text-white shadow-xs">
                  <Youtube className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">ইউটিউব ও টেলিগ্রাম (YouTube & Telegram)</h3>
                  <p className="text-xs text-stone-500">ভিডিও চ্যানেল ও জরুরি নোটিফিকেশন চ্যানেল</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    ইউটিউব চ্যানেল URL (YouTube Channel)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.youtube || ''}
                      onChange={e => handleInputChange('youtube', e.target.value)}
                      placeholder="https://youtube.com/@bloodbank"
                      className="w-full text-xs py-2.5 px-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    টেলিগ্রাম চ্যানেল / গ্রুপ লিংক (Telegram)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.telegram || ''}
                      onChange={e => handleInputChange('telegram', e.target.value)}
                      placeholder="https://t.me/bloodbank_nilphamari"
                      className="w-full text-xs py-2.5 px-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram, TikTok & Other Networks */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-stone-100">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white shadow-xs">
                  <Instagram className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">অন্যান্য সোশ্যাল নেটওয়ার্ক</h3>
                  <p className="text-xs text-stone-500">Instagram, TikTok, Twitter/X, LinkedIn</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    ইনস্টাগ্রাম প্রোফাইল URL (Instagram)
                  </label>
                  <input
                    type="url"
                    value={formData.instagram || ''}
                    onChange={e => handleInputChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/bloodbank"
                    className="w-full text-xs py-2.5 px-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    টিকটক প্রোফাইল URL (TikTok)
                  </label>
                  <input
                    type="url"
                    value={formData.tiktok || ''}
                    onChange={e => handleInputChange('tiktok', e.target.value)}
                    placeholder="https://tiktok.com/@bloodbank"
                    className="w-full text-xs py-2.5 px-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    এক্স / টুইটার URL (X / Twitter)
                  </label>
                  <input
                    type="url"
                    value={formData.twitter || ''}
                    onChange={e => handleInputChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/bloodbank"
                    className="w-full text-xs py-2.5 px-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    লিঙ্কডইন পেইজ URL (LinkedIn)
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin || ''}
                    onChange={e => handleInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/company/bloodbank"
                    className="w-full text-xs py-2.5 px-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <p className="text-xs text-stone-500">
                তথ্য সেভ করার সাথে সাথে ব্রাউজারের সকল ভিজিটরের জন্য পরিবর্তিত লিংক দৃশ্যমান হবে।
              </p>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-2 text-sm"
              >
                <Save className="w-4 h-4" />
                <span>সব লিংক সেভ করুন</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column (1 span) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-stone-900 text-sm">লাইভ প্রিভিউ ও টেস্ট</h3>
              </div>
              <span className="text-[11px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                রিয়েল-টাইম
              </span>
            </div>

            <p className="text-xs text-stone-500">
              নিচের বাটনগুলোতে ক্লিক করে আপনার সোশ্যাল মিডিয়া লিংকগুলো কাজ করছে কিনা সরাসরি চেক করে নিন:
            </p>

            <div className="space-y-2.5">
              {formData.facebook && (
                <a
                  href={formData.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl border border-blue-200/80 flex items-center justify-between transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="w-6 h-6 rounded-md bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <Facebook className="w-3.5 h-3.5 fill-current" />
                    </span>
                    <span className="truncate">ফেসবুক পেইজ ভিজিট</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                </a>
              )}

              {formData.facebookGroup && (
                <a
                  href={formData.facebookGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-xl border border-indigo-200/80 flex items-center justify-between transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">ফেসবুক গ্রুপে যোগ দিন</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
                </a>
              )}

              {formData.whatsappGroup && (
                <a
                  href={formData.whatsappGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200/80 flex items-center justify-between transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="w-6 h-6 rounded-md bg-[#25D366] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    </span>
                    <span className="truncate">হোয়াটসঅ্যাপ কমিউনিটি</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                </a>
              )}

              {formData.whatsappNumber && (
                <a
                  href={`https://wa.me/${formData.whatsappNumber.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200/80 flex items-center justify-between transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="w-6 h-6 rounded-md bg-[#128C7E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">হোয়াটসঅ্যাপ চ্যাট ({formData.whatsappNumber})</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                </a>
              )}

              {formData.youtube && (
                <a
                  href={formData.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-red-50 hover:bg-red-100 text-red-800 rounded-xl border border-red-200/80 flex items-center justify-between transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="w-6 h-6 rounded-md bg-[#FF0000] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <Youtube className="w-3.5 h-3.5 fill-current" />
                    </span>
                    <span className="truncate">ইউটিউব চ্যানেল</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-red-600" />
                </a>
              )}

              {formData.telegram && (
                <a
                  href={formData.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl border border-sky-200/80 flex items-center justify-between transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="w-6 h-6 rounded-md bg-[#229ED9] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <Send className="w-3 h-3 ml-0.5" />
                    </span>
                    <span className="truncate">টেলিগ্রাম চ্যানেল</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-sky-600" />
                </a>
              )}

              {formData.instagram && (
                <a
                  href={formData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-xl border border-pink-200/80 flex items-center justify-between transition-colors text-xs font-semibold"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      <Instagram className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">ইনস্টাগ্রাম প্রোফাইল</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-pink-600" />
                </a>
              )}
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-xs space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-stone-800">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>কোথায় প্রদর্শিত হবে?</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-stone-500 text-[11px]">
                <li>ওয়েবসাইটের মূল নেভিগেশন হেডার ও ফুটার অংশে</li>
                <li>যোগাযোগ ও হেল্পডেস্ক পেজে</li>
                <li>রক্তের আবেদন ও ডোনার শেয়ার অপশনে</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
