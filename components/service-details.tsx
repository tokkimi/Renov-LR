'use client';

import {useEffect, useId, useRef, useState} from 'react';
import Image from 'next/image';
import {ArrowUpRight, ChevronLeft, ChevronRight, Clock, X} from 'lucide-react';
import type {RenovationService} from './renovation-services';

export default function ServiceDetails({service, onClose, onQuote}: {
  service: RenovationService;
  onClose: () => void;
  onQuote: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const touch = useRef<{x: number; y: number} | null>(null);
  const heading = useId();
  const [slide, setSlide] = useState(0);
  const images = [{src: service.image, alt: service.imageAlt}];
  if (service.secondImage?.preparation) images.unshift(service.secondImage);
  else if (service.secondImage) images.push(service.secondImage);
  const move = (step: number) => setSlide(index => (index + step + images.length) % images.length);
  const photo = images[slide];

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
        <div className="service-sheet-body">
          <figure className="service-sheet-gallery" aria-label="Exemples de travaux"
            onKeyDown={event => {
              if (images.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
              event.preventDefault();
              move(event.key === 'ArrowLeft' ? -1 : 1);
            }}
            onTouchStart={event => {
              const point = event.touches[0];
              touch.current = {x: point.clientX, y: point.clientY};
            }}
            onTouchCancel={() => { touch.current = null; }}
            onTouchEnd={event => {
              const start = touch.current;
              touch.current = null;
              if (!start || images.length < 2) return;
              const point = event.changedTouches[0];
              const dx = point.clientX - start.x;
              if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(point.clientY - start.y)) move(dx < 0 ? 1 : -1);
            }}>
            <Image key={photo.src} src={photo.src} alt={photo.alt} fill
              sizes="(max-width: 760px) 94vw, 740px" loading="eager" draggable={false}/>
            <button type="button" className="service-sheet-control service-sheet-close" onClick={onClose}
              aria-label="Fermer la fiche"><X size={21} aria-hidden="true"/></button>
            {images.length > 1 && <div className="service-sheet-gallery-controls">
              <button type="button" className="service-sheet-control" onClick={() => move(-1)} aria-label="Photo précédente"><ChevronLeft size={19}/></button>
              <button type="button" className="service-sheet-control" onClick={() => move(1)} aria-label="Photo suivante"><ChevronRight size={19}/></button>
            </div>}
            <figcaption aria-live="polite">Exemple {slide + 1}/{images.length}<span className="service-photo-description"> · {photo.alt}</span></figcaption>
          </figure>
          <div className="service-sheet-copy">
            <h2 id={heading}>{service.title}</h2>
            <p className="service-sheet-intro">{service.intro}</p>
            <div className="service-sheet-columns">
              <section>
                <h3>Travaux possibles</h3>
                <ul>{service.works.map(work => <li key={work.title}><strong>{work.title}</strong><p>{work.text}</p></li>)}</ul>
              </section>
              <section>
                <h3>Comment ça se passe</h3>
                <ol>{service.steps.map(step => <li key={step.title}><strong>{step.title}</strong><p>{step.text}</p></li>)}</ol>
              </section>
            </div>
            <p className="service-sheet-duration"><Clock size={18} aria-hidden="true"/><span>
              <strong>Durée indicative</strong> {service.duration} {service.timing}
            </span></p>
          </div>
        </div>
        <footer className="service-sheet-footer">
          <button type="button" className="rl-btn arch-primary" onClick={onQuote}>Réserver<ArrowUpRight size={18} aria-hidden="true"/></button>
        </footer>
      </div>
    </dialog>
  );
}
