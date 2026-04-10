import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../firebase/hooks';

const Footer: React.FC = () => {
  const { content } = useSiteContent();

  return (
    <footer
      style={{ background: 'var(--color-footer)', color: 'rgba(255,255,255,0.75)' }}
      className="mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="text-white font-black text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            <span style={{ color: 'var(--color-accent)' }}>Rahman</span> Research Lab
          </div>
          <p className="text-sm leading-relaxed">
            {content['home.introText']?.substring(0, 120) ?? 'Advancing the frontiers of science and technology at BUET.'}...
          </p>
        </div>

        {/* Navigation */}
        <div>
          <div className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Navigation</div>
          <div className="flex flex-col gap-2">
            {[
              ['/', 'Home'],
              ['/about', 'About'],
              ['/collaborators', 'Collaborators'],
              ['/publications', 'Publications'],
              ['/research-ideas', 'Research Ideas'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="text-sm no-underline hover:text-white transition-colors"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <div className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Contact</div>
          <div className="text-sm flex flex-col gap-2">
            {content['contact.address'] && <p>{content['contact.address']}</p>}
            {content['contact.email'] && (
              <a href={`mailto:${content['contact.email']}`} className="no-underline hover:text-white" style={{ color: 'var(--color-accent)' }}>
                {content['contact.email']}
              </a>
            )}
            {content['contact.phone'] && <p>{content['contact.phone']}</p>}
          </div>
        </div>
      </div>

      <div className="border-t text-center text-xs py-4" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
        © {new Date().getFullYear()} Rahman Research Lab — Bangladesh University of Engineering and Technology
      </div>
    </footer>
  );
};

export default Footer;
