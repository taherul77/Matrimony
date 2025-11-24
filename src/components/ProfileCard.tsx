'use client';

import { useState, useId } from 'react';
import Link from 'next/link';
import { FiHeart, FiMapPin, FiBriefcase, FiBookOpen, FiStar } from 'react-icons/fi';
import InterestButton from './InterestButton';
import { Lens } from '@/components/ui/lens';
import { cn } from "@/lib/utils";
interface ProfileCardProps {
  profile: {
    id: string;
    userId?: string;
    name: string;
    age: number;
    bio?: string;
    profile?: {
      location?: string;
      occupation?: string;
      education?: string;
      photos?: string[];
      religion?: string;
      caste?: string;
    };
    location?: string;
    occupation?: string;
    education?: string;
    photos?: string[];
    religion?: string;
    caste?: string;
    isVip?: boolean;
    isFeatured?: boolean;
    hasProfileHighlight?: boolean;
    priorityLevel?: number;
    packageName?: string;
  };
  currentUserId?: string;
}

const ProfileCard = ({ profile, currentUserId }: ProfileCardProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [hovering, setHovering] = useState(false);

  const photos = profile.profile?.photos || profile.photos || [];
  const location = profile.profile?.location || profile.location || '';
  const occupation = profile.profile?.occupation || profile.occupation || '';
  const education = profile.profile?.education || profile.education || '';
  const religion = profile.profile?.religion || profile.religion || '';
  const caste = profile.profile?.caste || profile.caste || '';

  const nextPhoto = () => {
    if (photos.length > 1) setCurrentPhotoIndex((p) => (p + 1) % photos.length);
  };
  const prevPhoto = () => {
    if (photos.length > 1) setCurrentPhotoIndex((p) => (p - 1 + photos.length) % photos.length);
  };

  // Decorative SVGs (copied/adapted from demo) — use unique IDs to avoid collisions
  const uid = useId().replace(/[:]/g, '');
  // Exact SVG overlays from NewCard
  const Beams = () => (
    <svg
      width="380"
      height="315"
      viewBox="0 0 380 315"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full pointer-events-none"
    >
      <g filter="url(#filter0_f_120_7473)"><circle cx="34" cy="52" r="114" fill="#6925E7" /></g>
      <g filter="url(#filter1_f_120_7473)"><circle cx="332" cy="24" r="102" fill="#8A4BFF" /></g>
      <g filter="url(#filter2_f_120_7473)"><circle cx="191" cy="53" r="102" fill="#802FE3" /></g>
      <defs>
        <filter id="filter0_f_120_7473" x="-192" y="-174" width="452" height="452" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="56" result="effect1_foregroundBlur_120_7473" /></filter>
        <filter id="filter1_f_120_7473" x="70" y="-238" width="524" height="524" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="80" result="effect1_foregroundBlur_120_7473" /></filter>
        <filter id="filter2_f_120_7473" x="-71" y="-209" width="524" height="524" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="80" result="effect1_foregroundBlur_120_7473" /></filter>
      </defs>
    </svg>
  );

  const Rays = ({ className }: { className?: string }) => (
    <svg
      width="380"
      height="397"
      viewBox="0 0 380 397"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute left-0 top-0 pointer-events-none z-[1]", className)}
    >
      <g filter="url(#filter0_f_120_7480)"><path d="M-37.4202 -76.0163L-18.6447 -90.7295L242.792 162.228L207.51 182.074L-37.4202 -76.0163Z" fill="url(#paint0_linear_120_7480)" /></g>
      <g style={{ mixBlendMode: "plus-lighter" }} opacity="0.3" filter="url(#filter1_f_120_7480)"><path d="M-109.54 -36.9027L-84.2903 -58.0902L178.786 193.228L132.846 223.731L-109.54 -36.9027Z" fill="url(#paint1_linear_120_7480)" /></g>
      <g style={{ mixBlendMode: "plus-lighter" }} opacity="0.86" filter="url(#filter2_f_120_7480)"><path d="M-100.647 -65.795L-69.7261 -92.654L194.786 157.229L139.51 197.068L-100.647 -65.795Z" fill="url(#paint2_linear_120_7480)" /></g>
      <g style={{ mixBlendMode: "plus-lighter" }} opacity="0.31" filter="url(#filter3_f_120_7480)"><path d="M163.917 -89.0982C173.189 -72.1354 80.9618 2.11525 34.7334 30.1553C-11.495 58.1954 -106.505 97.514 -115.777 80.5512C-125.048 63.5885 -45.0708 -3.23233 1.15763 -31.2724C47.386 -59.3124 154.645 -106.061 163.917 -89.0982Z" fill="#8A50FF" /></g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter4_f_120_7480)"><path d="M34.2031 13.2222L291.721 269.534" stroke="url(#paint3_linear_120_7480)" /></g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter5_f_120_7480)"><path d="M41 -40.9331L298.518 215.378" stroke="url(#paint4_linear_120_7480)" /></g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter6_f_120_7480)"><path d="M61.3691 3.8999L317.266 261.83" stroke="url(#paint5_linear_120_7480)" /></g>
      <g style={{ mixBlendMode: "plus-lighter" }} filter="url(#filter7_f_120_7480)"><path d="M-1.46191 9.06348L129.458 145.868" stroke="url(#paint6_linear_120_7480)" strokeWidth="2" /></g>
      <defs>
        <filter id="filter0_f_120_7480" x="-49.4199" y="-102.729" width="304.212" height="296.803" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur_120_7480" /></filter>
        <filter id="filter1_f_120_7480" x="-115.54" y="-64.0903" width="300.326" height="293.822" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="3" result="effect1_foregroundBlur_120_7480" /></filter>
        <filter id="filter2_f_120_7480" x="-111.647" y="-103.654" width="317.434" height="311.722" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="5.5" result="effect1_foregroundBlur_120_7480" /></filter>
        <filter id="filter3_f_120_7480" x="-212.518" y="-188.71" width="473.085" height="369.366" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="48" result="effect1_foregroundBlur_120_7480" /></filter>
        <filter id="filter4_f_120_7480" x="25.8447" y="4.84521" width="274.234" height="273.065" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="4" result="effect1_foregroundBlur_120_7480" /></filter>
        <filter id="filter5_f_120_7480" x="32.6416" y="-49.3101" width="274.234" height="273.065" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="4" result="effect1_foregroundBlur_120_7480" /></filter>
        <filter id="filter6_f_120_7480" x="54.0078" y="-3.47461" width="270.619" height="272.68" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="3.5" result="effect1_foregroundBlur_120_7480" /></filter>
        <filter id="filter7_f_120_7480" x="-9.2002" y="1.32812" width="146.396" height="152.275" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /><feGaussianBlur stdDeviation="3.5" result="effect1_foregroundBlur_120_7480" /></filter>
        <linearGradient id="paint0_linear_120_7480" x1="-57.5042" y1="-134.741" x2="403.147" y2="351.523" gradientUnits="userSpaceOnUse"><stop offset="0.214779" stopColor="#AF53FF" /><stop offset="0.781583" stopColor="#B253FF" stopOpacity="0" /></linearGradient>
        <linearGradient id="paint1_linear_120_7480" x1="-122.154" y1="-103.098" x2="342.232" y2="379.765" gradientUnits="userSpaceOnUse"><stop offset="0.214779" stopColor="#AF53FF" /><stop offset="0.781583" stopColor="#9E53FF" stopOpacity="0" /></linearGradient>
        <linearGradient id="paint2_linear_120_7480" x1="-106.717" y1="-138.534" x2="359.545" y2="342.58" gradientUnits="userSpaceOnUse"><stop offset="0.214779" stopColor="#9D53FF" /><stop offset="0.781583" stopColor="#A953FF" stopOpacity="0" /></linearGradient>
        <linearGradient id="paint3_linear_120_7480" x1="72.701" y1="54.347" x2="217.209" y2="187.221" gradientUnits="userSpaceOnUse"><stop stopColor="#AF81FF" /><stop offset="1" stopColor="#C081FF" stopOpacity="0" /></linearGradient>
        <linearGradient id="paint4_linear_120_7480" x1="79.4978" y1="0.191681" x2="224.006" y2="133.065" gradientUnits="userSpaceOnUse"><stop stopColor="#AF81FF" /><stop offset="1" stopColor="#C081FF" stopOpacity="0" /></linearGradient>
        <linearGradient id="paint5_linear_120_7480" x1="79.6568" y1="21.8377" x2="234.515" y2="174.189" gradientUnits="userSpaceOnUse"><stop stopColor="#B981FF" /><stop offset="1" stopColor="#CF81FF" stopOpacity="0" /></linearGradient>
        <linearGradient id="paint6_linear_120_7480" x1="16.119" y1="27.6966" x2="165.979" y2="184.983" gradientUnits="userSpaceOnUse"><stop stopColor="#A981FF" /><stop offset="1" stopColor="#CB81FF" stopOpacity="0" /></linearGradient>
      </defs>
    </svg>
  );

  return (
    <div className="w-full h-[520px]">
      <div className="relative rounded-3xl overflow-hidden my-4 h-full">
        <div className="relative p-1 h-full">
            {/* inner dark card with purple ray overlay */}
           <div className="bg-gradient-to-r from-[#1D2235] to-[#121318] rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
            {/* NewCard-style overlays */}
            <Rays />
            <Beams />
            <div className="relative z-10">

            {/* image (fixed height) */}
            <div className="rounded-xl overflow-hidden bg-black/10 flex-shrink-0">
              <Lens hovering={hovering} setHovering={setHovering}>
                <img
                  src={photos[currentPhotoIndex] || '/placeholder-avatar.jpg'}
                  alt={profile.name}
                  className={`w-full h-64 object-cover transition-transform duration-500 ${hovering ? 'scale-105' : 'scale-100'}`}
                />
              </Lens>
            </div>

            {/* Title and description (flex-grow, fixed area) */}
            <div className="mt-4 text-left text-white flex-1 flex flex-col">
              {/* Info area blur animation on lens hover */}
              <div
                style={{ filter: hovering ? 'blur(2px)' : 'blur(0px)', transition: 'filter 0.3s' }}
              >
                <div>
                  <h2 className="text-white text-2xl font-bold">{profile.name}</h2>
                  <p className="text-neutral-300 mt-2 flex items-center gap-3 text-sm">
                    <span className="font-medium">{profile.age} yrs</span>
                    <span className="opacity-60">•</span>
                    <span className="flex items-center gap-1 text-neutral-300">
                      <FiMapPin className="w-4 h-4 text-neutral-400" aria-hidden />
                      <span>{location || 'Unknown'}</span>
                    </span>
                  </p>
                  <div className="text-neutral-400 mt-2 text-sm space-x-2">
                    {occupation && <span>{occupation}</span>}
                    {occupation && education && <span>•</span>}
                    {education && <span>{education}</span>}
                    {(occupation || education) && (religion || caste) && <span>•</span>}
                    {religion && <span>{religion}</span>}
                    {religion && caste && <span>•</span>}
                    {caste && <span>{caste}</span>}
                  </div>
                </div>
                <p className="text-neutral-400 mt-4 line-clamp-4 flex-1">{profile.bio}</p>

                {/* bottom row with actions */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="relative">
                    <Link href={`/profile/${profile.userId || profile.id}`} className="inline-block">
                      <button
                        className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-8 py-3 rounded-full shadow-lg font-semibold transition duration-200 hover:scale-105 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-pink-500"
                      >
                        View Profile
                      </button>
                    </Link>
                  </div>
                  <div>
                    <InterestButton targetUserId={profile.id} currentUserId={currentUserId || ''} />
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
