'use client';

import {useEffect, useId, useRef} from 'react';
import Image from 'next/image';
import {ArrowUpRight, Check, Clock, X} from 'lucide-react';
import type {RenovationService} from './renovation-services';
import {WhatsAppIcon} from './whatsapp-contact';

export default function ServiceDetails({service, whatsapp, onClose, onQuote}: {
  service: RenovationService;
  whatsapp: string;
  onClose: () => void;
  onQuote: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useId();
  const Icon = service.icon;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    element.showModal();
    root.style.overflow = 'hidden';
    return () => {
      element.close();
      root.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog ref={dialog} className="service-sheet" aria-labelledby={heading}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="service-sheet-surface">
        <header className="service-sheet-header">
          <div className="service-sheet-title">
            <span className="service-sheet-icon"><Icon size={24} aria-hidden="true"/></span>
            <h2 id={heading}>{service.title}</h2>
          </div>
          <button type="button" className="service-sheet-close" onClick={onClose} aria-label="Fermer la fiche">
            <X size={22} aria-hidden="true"/>
          </button>
        </header>
        <div className="service-sheet-body">
          <div className="service-sheet-photos" data-pair={Boolean(service.secondImage)}>
            <div><Image src={service.image} alt={service.imageAlt} fill sizes="(max-width: 580px) 92vw, 700px"/></div>
            {service.secondImage && <div><Image src={service.secondImage.src} alt={service.secondImage.alt} fill sizes="(max-width: 580px) 42vw, 320px"/></div>}
          </div>
          <p className="service-sheet-intro">{service.intro}</p>
          <section>
            <h3>Les travaux possibles</h3>
            <ul className="service-sheet-works">
              {service.works.map(work => <li key={work.title}><Check size={17} aria-hidden="true"/>
                <div><strong>{work.title}</strong><p>{work.text}</p></div>
              </li>)}
            </ul>
          </section>
          <section>
            <h3>De la conception aux finitions</h3>
            <ol className="service-sheet-steps">
              {service.steps.map((step, index) => <li key={step.title}><span aria-hidden="true">0{index + 1}</span>
                <div><strong>{step.title}</strong><p>{step.text}</p></div>
              </li>)}
            </ol>
          </section>
          <section className="service-sheet-duration">
            <Clock size={21} aria-hidden="true"/>
            <div><h3>Durée indicative des travaux</h3><p>{service.duration}</p><p>{service.timing} Le délai de votre projet se précise après la visite.</p></div>
          </section>
        </div>
        <footer className="service-sheet-footer">
          {whatsapp && <a className="rl-btn arch-outline" href={whatsapp} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon/>Écrire sur WhatsApp
          </a>}
          <button type="button" className="rl-btn arch-primary" onClick={onQuote}>Demander un devis<ArrowUpRight size={18} aria-hidden="true"/></button>
        </footer>
      </div>
    </dialog>
  );
}
