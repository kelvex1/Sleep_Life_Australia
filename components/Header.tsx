'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Facebook, Instagram, Menu, X, Phone, Mail } from 'lucide-react';
import { HeaderMusicPlayer } from '@/components/HeaderMusicPlayer';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const event = new Event('logo-click');
    window.dispatchEvent(event);
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
  };

  const closeMenu = () => setIsMenuOpen(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-6 md:px-8 py-4 md:py-6 gap-8">
        <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer flex-shrink-0">
          <Image
            src="/Screenshot 2025-11-22 210245.png"
            alt="Sleep Life Australia"
            width={312}
            height={104}
            className="h-12 md:h-16 w-auto transition-transform hover:scale-105"
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-6 flex-1 justify-end whitespace-nowrap">
          <Link href="/" className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium">
            Home
          </Link>
          <Link href="/#sleep-studies" className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium">
            Sleep Studies
          </Link>
          <Link href="/#cpap-therapy" className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium">
            CPAP Therapy
          </Link>
          <Link href="/faq" className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium">
            FAQ
          </Link>
          <Link href="/quiz" className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium">
            Sleep Quiz
          </Link>
          <Link href="/privacy-policy" className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium">
            Privacy Policy
          </Link>
          <Link href="/referral" className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium">
            Referral Form
          </Link>

          <Link href="/book">
            <Button className="bg-brand-blue-light hover:bg-brand-blue text-white font-semibold">
              Book Appointment
            </Button>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 flex-shrink-0">
          <div className="flex flex-col gap-1.5">
            <a href="tel:0861179339" className="flex items-center gap-2 text-brand-blue-light hover:text-brand-blue transition-colors font-semibold">
              <Phone className="w-4 h-4" />
              <span className="text-sm">08 6117 9339</span>
            </a>
            <a href="mailto:reception@sleeplifeaustralia.com.au" className="flex items-center gap-2 text-brand-blue-light hover:text-brand-blue transition-colors font-semibold">
              <Mail className="w-4 h-4" />
              <span className="text-sm">reception@sleeplifeaustralia.com.au</span>
            </a>
          </div>
          <div className="w-px h-14 bg-slate-300"></div>
          <HeaderMusicPlayer />
          <Link
            href="https://www.facebook.com/sleeplifeaustralia/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Facebook page"
            className="text-brand-blue-light hover:text-brand-blue transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </Link>
          <Link
            href="https://www.instagram.com/sleeplifeaustralia/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit our Instagram page"
            className="text-brand-blue-light hover:text-brand-blue transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <HeaderMusicPlayer />

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-brand-gray hover:text-brand-blue-light"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-bold text-brand-blue-light">Menu</h2>
                </div>

                <nav className="flex flex-col space-y-4 flex-1">
                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium text-lg py-2"
                  >
                    Home
                  </Link>
                  <Link
                    href="/#sleep-studies"
                    onClick={closeMenu}
                    className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium text-lg py-2"
                  >
                    Sleep Studies
                  </Link>
                  <Link
                    href="/#cpap-therapy"
                    onClick={closeMenu}
                    className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium text-lg py-2"
                  >
                    CPAP Therapy
                  </Link>
                  <Link
                    href="/faq"
                    onClick={closeMenu}
                    className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium text-lg py-2"
                  >
                    FAQ
                  </Link>
                  <Link
                    href="/quiz"
                    onClick={closeMenu}
                    className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium text-lg py-2"
                  >
                    Sleep Quiz
                  </Link>
                  <Link
                    href="/privacy-policy"
                    onClick={closeMenu}
                    className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium text-lg py-2"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/referral"
                    onClick={closeMenu}
                    className="text-brand-gray hover:text-brand-blue-light transition-colors font-medium text-lg py-2"
                  >
                    Referral Form
                  </Link>

                  <div className="pt-4">
                    <Link href="/book" onClick={closeMenu}>
                      <Button className="w-full bg-brand-blue-light hover:bg-brand-blue text-white font-semibold">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </nav>

                <div className="border-t border-slate-200 pt-6 mt-6">
                  <a href="tel:0861179339" className="flex items-center gap-2 text-brand-blue-light hover:text-brand-blue transition-colors font-semibold mb-3 text-lg">
                    <Phone className="w-5 h-5" />
                    <span>08 6117 9339</span>
                  </a>
                  <a href="mailto:reception@sleeplifeaustralia.com.au" className="flex items-center gap-2 text-brand-blue-light hover:text-brand-blue transition-colors font-semibold mb-4 text-sm">
                    <Mail className="w-5 h-5" />
                    <span>reception@sleeplifeaustralia.com.au</span>
                  </a>
                  <p className="text-sm text-slate-600 mb-4">Follow Us</p>
                  <div className="flex items-center gap-4">
                    <Link
                      href="https://www.facebook.com/sleeplifeaustralia/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit our Facebook page"
                      className="text-brand-blue-light hover:text-brand-blue transition-colors"
                    >
                      <Facebook className="w-6 h-6" />
                    </Link>
                    <Link
                      href="https://www.instagram.com/sleeplifeaustralia/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Visit our Instagram page"
                      className="text-brand-blue-light hover:text-brand-blue transition-colors"
                    >
                      <Instagram className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
