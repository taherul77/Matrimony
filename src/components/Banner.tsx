 'use client';

import React from 'react';
import Link from 'next/link';

import ThreeDCarousel from './ThreeDCarousel';

type BannerProps = {
  isLoggedIn: boolean;
};

export default function Banner({ isLoggedIn }: BannerProps) {
  return (
    <section className="py-28 px-4 md:py-32">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          {/* Left: Text content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 mb-6">
              Find Your
              <span className="block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Perfect Match</span>
            </h1>

            <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl">
              Join millions of people who have found their life partners through our trusted matrimonial
              platform. Discover compatible matches with advanced filters and verified profiles.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4">
              {isLoggedIn ? (
                <Link href="/profile" className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                  Go to Dashboard
                </Link>
              ) : (
                <Link href="/register" className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all">
                  Start Your Journey
                </Link>
              )}

              <Link href="/search" className="inline-flex items-center justify-center border-2 border-pink-200 text-pink-600 px-6 py-3 rounded-2xl text-base font-medium hover:bg-pink-50 transition-all">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right: Decorative illustration */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md mx-auto">
              <div className="rounded-3xl shadow-xl">
                <div className="w-full h-64 md:h-84 rounded-xl overflow-hidden">
                  {/* Use a 3D carousel for a more impressive effect. Falls back to simple carousel if three.js not available. */}
                  <ThreeDCarousel
                    images={['/uploads/bg/image.jpg', '/uploads/bg/image1.webp', '/uploads/bg/image2.jpg', '/uploads/bg/image3.jpg', '/uploads/bg/image4.jpg', '/uploads/bg/image5.jpg', '/uploads/bg/image6.jpg']}
                    // Make rotation much slower for a calmer, premium feel
                    autoRotateSpeed={0.002}
                  />
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
