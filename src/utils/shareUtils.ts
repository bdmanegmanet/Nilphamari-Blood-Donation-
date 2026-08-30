/**
 * Share utilities: Universal link generation, formatted text copying, and image export (PNG/JPG)
 */

import QRCode from 'qrcode';
import { BloodRequest, NoticeItem, ArticleItem, SiteConfig } from '../types';

export function generateShareUrl(page: string, params?: Record<string, string>): string {
  try {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('page', page);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
      });
    }
    return url.toString();
  } catch {
    let query = `?page=${encodeURIComponent(page)}`;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) query += `&${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
      });
    }
    return window.location.origin + query;
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Clipboard error:', err);
    return false;
  }
}

export async function copyShareLink(
  page: string,
  params?: Record<string, string>
): Promise<{ success: boolean; url: string }> {
  const url = generateShareUrl(page, params);
  const success = await copyToClipboard(url);
  return { success, url };
}

export function generateBloodRequestShareText(
  req: BloodRequest,
  siteName = 'নীলফামারী সেন্ট্রাল ব্লাড ব্যাংক',
  hotline = '01712-345678'
): string {
  const shareUrl = generateShareUrl('requests', { id: req.id, group: req.bloodGroup });
  return `🚨 জরুরি রক্তের প্রয়োজন 🚨

🩸 রক্তের গ্রুপ: ${req.bloodGroup}
📦 পরিমাণ: ${req.unitsNeeded} ব্যাগ
🏥 হাসপাতাল: ${req.hospital}
📍 স্থান/উপজেলা: ${req.district}
📅 তারিখ: ${req.donationDateNeeded || 'আজই জরুরি'}
${req.patientProblem ? `📝 কারণ: ${req.patientProblem}\n` : ''}👤 রোগী/আবেদনকারী: ${req.requesterName}
📞 যোগাযোগ নম্বর: ${req.contact}${req.alternateContact ? ` / ${req.alternateContact}` : ''}

🔗 অনলাইনে বিস্তারিত ও রক্তদান করতে ক্লিক করুন:
${shareUrl}

🌐 ${siteName} | জরুরি হটলাইন: ${hotline}
(দয়া করে পোস্টটি শেয়ার করে রোগীর জীবন বাঁচাতে সহায়তা করুন 🙏)`;
}

export function generateNoticeShareText(notice: NoticeItem, siteName = 'নীলফামারী সেন্ট্রাল ব্লাড ব্যাংক'): string {
  const shareUrl = generateShareUrl('notice', { id: notice.id });
  return `📢 জরুরি নোটিশ / ঘোষণা 📢
📌 ${notice.title}
📅 তারিখ: ${notice.publishDate}

${notice.content}

🔗 সম্পূর্ণ নোটিস দেখতে ক্লিক করুন:
${shareUrl}

🏛️ ${siteName}`;
}

export function generateArticleShareText(art: ArticleItem, siteName = 'নীলফামারী সেন্ট্রাল ব্লাড ব্যাংক'): string {
  const shareUrl = generateShareUrl('blog', { id: art.id });
  const pubDate = art.publishedDate || art.date || '';
  return `📖 স্বাস্থ্য বার্তা: ${art.title}
✍️ লেখক: ${art.author || art.authorName || 'অ্যাডমিন'} ${pubDate ? `| 📅 ${pubDate}` : ''}

${art.excerpt || art.content.slice(0, 150) + '...'}

🔗 সম্পূর্ণ লেখাটি পড়তে ক্লিক করুন:
${shareUrl}

🏛️ ${siteName}`;
}

// Helper to safely load an image from URL
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Generates an ultra-crisp 1080x1080 social media graphic canvas for Blood Requests.
 * Typography: Google Noto Serif Bengali
 * Features:
 * - Header: Site Name + Logo + Urgent notice banner
 * - Round profile highlighted Blood Group badge
 * - Spacious Patient Information Card with proper padding and contrast
 * - Footer: Automatic dynamic QR Code linking to online request profile
 */
export async function generateBloodRequestCanvas(
  req: BloodRequest,
  configOrName?: SiteConfig | string,
  hotlineOverride?: string
): Promise<HTMLCanvasElement> {
  let siteName = 'নীলফামারী সেন্ট্রাল ব্লাড ব্যাংক';
  let logoUrl: string | undefined = undefined;
  let hotline = hotlineOverride || '০১৭০০-০০০০০০';
  let slogan = 'এক ফোঁটা রক্ত, একটি নতুন জীবন';

  if (typeof configOrName === 'string' && configOrName.trim()) {
    siteName = configOrName.trim();
  } else if (typeof configOrName === 'object' && configOrName !== null) {
    if (configOrName.siteName) siteName = configOrName.siteName;
    if (configOrName.logoUrl) logoUrl = configOrName.logoUrl;
    if (configOrName.siteSlogan) slogan = configOrName.siteSlogan;
    if (!hotlineOverride) {
      hotline = configOrName.emergencyPhone || configOrName.contactPhone || '০১৭০০-০০০০০০';
    }
  }

  const shareUrl = generateShareUrl('requests', { id: req.id, group: req.bloodGroup });

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Ensure Google Noto Serif Bengali font is ready
  try {
    if (document.fonts) {
      await document.fonts.load('600 32px "Noto Serif Bengali"');
      await document.fonts.load('800 80px "Noto Serif Bengali"');
    }
  } catch (e) {
    // Font loading fallback
  }

  // Define Primary Serif font family
  const FONT_SERIF = '"Noto Serif Bengali", "Hind Siliguri", "Cinzel", Georgia, serif';

  // 1. PURE WHITE CANVAS BACKGROUND (সাদা ব্যাকগ্রাউন্ড)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 1080, 1080);

  // Outer Crisp Borders (Crimson & Soft Amber on White)
  ctx.strokeStyle = '#B71C1C';
  ctx.lineWidth = 5;
  ctx.strokeRect(24, 24, 1032, 1032);

  ctx.strokeStyle = '#FCA5A5';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(34, 34, 1012, 1012);

  // Subtle Corner Accents
  const cornerSize = 20;
  ctx.fillStyle = '#B71C1C';
  [[38, 38], [1042 - cornerSize, 38], [38, 1042 - cornerSize], [1042 - cornerSize, 1042 - cornerSize]].forEach(([cx, cy]) => {
    ctx.fillRect(cx, cy, cornerSize, cornerSize);
  });

  // -------------------------------------------------------------
  // 2. HEADER: AUTO DATA (Site Logo, Site Name, Emergency Banner)
  // -------------------------------------------------------------
  const headerGrad = ctx.createLinearGradient(54, 50, 1026, 145);
  headerGrad.addColorStop(0, '#B71C1C');
  headerGrad.addColorStop(0.5, '#991B1B');
  headerGrad.addColorStop(1, '#831843');
  ctx.fillStyle = headerGrad;

  ctx.beginPath();
  ctx.roundRect(54, 48, 972, 116, 20);
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Try to load site logo or render a custom emblem
  let logoLoaded = false;
  if (logoUrl) {
    try {
      const logoImg = await loadImage(logoUrl);
      ctx.save();
      ctx.beginPath();
      ctx.arc(115, 106, 38, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, 77, 68, 76, 76);
      ctx.restore();
      
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(115, 106, 39, 0, Math.PI * 2);
      ctx.stroke();
      logoLoaded = true;
    } catch {
      logoLoaded = false;
    }
  }

  if (!logoLoaded) {
    // Elegant Droplet Emblem
    ctx.fillStyle = '#FEF2F2';
    ctx.beginPath();
    ctx.arc(115, 106, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Red droplet inside
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(115, 82);
    ctx.bezierCurveTo(100, 102, 92, 116, 100, 126);
    ctx.bezierCurveTo(108, 136, 122, 136, 130, 126);
    ctx.bezierCurveTo(138, 116, 130, 102, 115, 82);
    ctx.fill();

    // Plus inside droplet
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(112, 108, 6, 16);
    ctx.fillRect(107, 113, 16, 6);
  }

  // Header Titles (Website Name & Sub-badge)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 32px ${FONT_SERIF}`;
  ctx.fillText(siteName, 175, 92);

  ctx.fillStyle = '#FDE68A';
  ctx.font = `600 20px ${FONT_SERIF}`;
  ctx.fillText('🚨 জরুরি রক্তের আবেদন • URGENT BLOOD REQUEST', 175, 128);

  // Top-right Date badge
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.roundRect(834, 66, 172, 80, 12);
  ctx.fill();
  ctx.strokeStyle = 'rgba(253, 230, 138, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FCD34D';
  ctx.font = `bold 16px ${FONT_SERIF}`;
  ctx.fillText('রক্তদানের তারিখ', 920, 96);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold 18px ${FONT_SERIF}`;
  ctx.fillText(req.donationDateNeeded || 'আজই জরুরি', 920, 126);

  // -------------------------------------------------------------
  // 3. ROUND PROFILE BLOOD GROUP SECTION (গোল প্রোফাইল টাইপ রাউন্ড)
  // -------------------------------------------------------------
  ctx.fillStyle = '#FFF8F8';
  ctx.beginPath();
  ctx.roundRect(54, 180, 972, 215, 24);
  ctx.fill();
  ctx.strokeStyle = '#FECACA';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Round Profile Outer Glowing Rings
  const circleCenterX = 180;
  const circleCenterY = 287;
  const circleRadius = 82;

  // Outer ambient glow ring
  ctx.strokeStyle = '#FEE2E2';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(circleCenterX, circleCenterY, circleRadius + 7, 0, Math.PI * 2);
  ctx.stroke();

  // Golden Ring
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Radial Blood Red fill inside profile circle
  const bloodCircleGrad = ctx.createRadialGradient(
    circleCenterX - 18, circleCenterY - 22, 10,
    circleCenterX, circleCenterY, circleRadius
  );
  bloodCircleGrad.addColorStop(0, '#EF4444');
  bloodCircleGrad.addColorStop(0.7, '#B91C1C');
  bloodCircleGrad.addColorStop(1, '#7F1D1D');
  ctx.fillStyle = bloodCircleGrad;
  ctx.beginPath();
  ctx.arc(circleCenterX, circleCenterY, circleRadius - 3, 0, Math.PI * 2);
  ctx.fill();

  // Highlight Blood Group Name (Large & Bold in Round Badge)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 68px ${FONT_SERIF}`;
  ctx.fillText(req.bloodGroup, circleCenterX, circleCenterY + 22);

  // Tiny "রক্তের গ্রুপ" label inside badge bottom
  ctx.fillStyle = '#FDE68A';
  ctx.font = `bold 13px ${FONT_SERIF}`;
  ctx.fillText('রক্তের গ্রুপ', circleCenterX, circleCenterY + 48);

  // Content Next to Profile Badge
  ctx.textAlign = 'left';
  
  // Units Needed text
  ctx.fillStyle = '#991B1B';
  ctx.font = `bold 36px ${FONT_SERIF}`;
  ctx.fillText(`🩸 ${req.unitsNeeded} ব্যাগ রক্ত প্রয়োজন`, 295, 240);

  // Urgency & Status
  ctx.fillStyle = '#DC2626';
  ctx.font = `bold 23px ${FONT_SERIF}`;
  const urgencyText = req.urgency === 'high' 
    ? '🚨 জরুরিতা: অতি জরুরি (Immediate Priority)' 
    : '⚠️ জরুরিতা: জরুরি (Urgent Priority)';
  ctx.fillText(urgencyText, 295, 282);

  // Slogan / Encouragement line
  ctx.fillStyle = '#475569';
  ctx.font = `500 20px ${FONT_SERIF}`;
  ctx.fillText(`“${slogan}”`, 295, 324);

  // Status tag pill
  ctx.fillStyle = '#FEE2E2';
  ctx.beginPath();
  ctx.roundRect(295, 342, 200, 32, 8);
  ctx.fill();
  ctx.strokeStyle = '#EF4444';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#991B1B';
  ctx.font = `bold 15px ${FONT_SERIF}`;
  ctx.fillText('🔴 সরাসরি রোগী সহায়তা', 310, 364);

  // -------------------------------------------------------------
  // 4. PATIENT INFORMATION CARD (রোগীর ইনফরমেশন - Clean White Box)
  // -------------------------------------------------------------
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(54, 412, 972, 420, 24);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Header for Info Card
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.roundRect(54, 412, 972, 52, [24, 24, 0, 0]);
  ctx.fill();
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#991B1B';
  ctx.font = `bold 18px ${FONT_SERIF}`;
  ctx.fillText('📋 রোগীর প্রয়োজনীয় তথ্যাবলি (Patient Details)', 84, 445);

  let currentY = 502;
  const labelX = 84;
  const valueX = 330;

  // 1. Hospital (হাসপাতাল)
  ctx.fillStyle = '#64748B';
  ctx.font = `600 24px ${FONT_SERIF}`;
  ctx.fillText('🏥  হাসপাতাল / স্থান :', labelX, currentY);
  ctx.fillStyle = '#B71C1C';
  ctx.font = `bold 26px ${FONT_SERIF}`;
  ctx.fillText(req.hospital.slice(0, 36), valueX, currentY);

  // 2. Upazila / District (উপজেলা / জেলা)
  currentY += 48;
  ctx.fillStyle = '#64748B';
  ctx.font = `600 24px ${FONT_SERIF}`;
  ctx.fillText('📍  উপজেলা / জেলা :', labelX, currentY);
  ctx.fillStyle = '#0F172A';
  ctx.font = `bold 25px ${FONT_SERIF}`;
  ctx.fillText(req.district, valueX, currentY);

  // 3. Patient / Requester Name (রোগী / আবেদনকারী)
  currentY += 48;
  ctx.fillStyle = '#64748B';
  ctx.font = `600 24px ${FONT_SERIF}`;
  ctx.fillText('👤  রোগী / আবেদনকারী :', labelX, currentY);
  ctx.fillStyle = '#0F172A';
  ctx.font = `bold 25px ${FONT_SERIF}`;
  ctx.fillText(req.requesterName, valueX, currentY);

  // 4. Patient Condition / Problem (রোগীর সমস্যা/কারণ)
  if (req.patientProblem) {
    currentY += 46;
    ctx.fillStyle = '#64748B';
    ctx.font = `600 22px ${FONT_SERIF}`;
    ctx.fillText('📝  সমস্যা / রোগ :', labelX, currentY);
    ctx.fillStyle = '#334155';
    ctx.font = `italic 21px ${FONT_SERIF}`;
    const truncatedProb = req.patientProblem.length > 42 
      ? req.patientProblem.slice(0, 42) + '...' 
      : req.patientProblem;
    ctx.fillText(`"${truncatedProb}"`, valueX, currentY);
  }

  // 5. Contact Phone Box (হাইলাইটেড যোগাযোগ বাক্স)
  currentY += (req.patientProblem ? 48 : 56);
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.roundRect(76, currentY - 32, 928, 68, 16);
  ctx.fill();
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#38BDF8';
  ctx.font = `bold 24px ${FONT_SERIF}`;
  ctx.fillText('📞  জরুরি যোগাযোগ :', 100, currentY + 11);

  ctx.fillStyle = '#FDE047';
  ctx.font = `bold 32px ${FONT_SERIF}`;
  const phoneText = `${req.contact}${req.alternateContact ? `  |  ${req.alternateContact}` : ''}`;
  ctx.fillText(phoneText, 340, currentY + 11);

  // -------------------------------------------------------------
  // 5. FOOTER: DYNAMIC QR CODE & SCAN INSTRUCTIONS
  // -------------------------------------------------------------
  const footerGrad = ctx.createLinearGradient(54, 848, 1026, 1020);
  footerGrad.addColorStop(0, '#B71C1C');
  footerGrad.addColorStop(1, '#991B1B');
  ctx.fillStyle = footerGrad;
  ctx.beginPath();
  ctx.roundRect(54, 848, 972, 172, 22);
  ctx.fill();
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Generate QR Code dynamically linking to the online request
  try {
    const qrDataUrl = await QRCode.toDataURL(shareUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#18181B',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    const qrImg = await loadImage(qrDataUrl);
    
    // QR Code Frame
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(74, 864, 140, 140, 14);
    ctx.fill();
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.drawImage(qrImg, 80, 870, 128, 128);

    // Text beside QR Code
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 25px ${FONT_SERIF}`;
    ctx.fillText('📱 অনলাইন আবেদন দেখতে কিউআর কোড স্ক্যান করুন', 238, 898);

    ctx.fillStyle = '#FECACA';
    ctx.font = `600 18px ${FONT_SERIF}`;
    ctx.fillText('স্মার্টফোনের ক্যামেরা দিয়ে স্ক্যান করলেই রোগীর প্রোফাইল ও রক্তদান লিংক ওপেন হবে।', 238, 930);

    ctx.fillStyle = '#FDE68A';
    ctx.font = `bold 20px ${FONT_SERIF}`;
    ctx.fillText(`🏛️ ${siteName}  •  হটলাইন: ${hotline}`, 238, 970);

    ctx.fillStyle = '#FEF3C7';
    ctx.font = `500 16px ${FONT_SERIF}`;
    ctx.fillText('দয়া করে ছবিটি শেয়ার করে মুমূর্ষু রোগীর পাশে দাঁড়ান 🙏', 238, 998);

  } catch (err) {
    // QR Code fallback
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 30px ${FONT_SERIF}`;
    ctx.fillText(`🌐 ${siteName}`, 540, 915);
    ctx.fillStyle = '#FDE68A';
    ctx.font = `600 22px ${FONT_SERIF}`;
    ctx.fillText(`জরুরি হটলাইন: ${hotline}  •  শেয়ার করে রোগীর পাশে দাঁড়ান`, 540, 960);
  }

  return canvas;
}

/**
 * Downloads a high resolution image (PNG or JPEG) of the Blood Request card.
 */
export async function downloadBloodRequestImage(
  req: BloodRequest,
  format: 'png' | 'jpeg' = 'png',
  configOrName?: SiteConfig | string,
  hotlineOverride?: string
): Promise<void> {
  const canvas = await generateBloodRequestCanvas(req, configOrName, hotlineOverride);
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
  const dataUrl = canvas.toDataURL(mimeType, 0.95);

  const safeBg = req.bloodGroup.replace('+', 'pos').replace('-', 'neg');
  const filename = `blood-request-${safeBg}-${req.id || 'emergency'}.${format === 'jpeg' ? 'jpg' : 'png'}`;

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

