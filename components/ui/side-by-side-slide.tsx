'use client';

import {useState} from 'react';
import Image from 'next/image';
import {ChevronsLeftRight} from 'lucide-react';
import {motion, useMotionValue, useReducedMotion, useSpring, useTransform} from 'motion/react';

type SideBySideSlideProps = {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
};

/** SideBySideSlide from the supplied example, with a native range control for touch and keyboard. */
export function SideBySideSlide({beforeImage, afterImage, beforeAlt, afterAlt}: SideBySideSlideProps) {
  const [value, setValue] = useState(50);
  const raw = useMotionValue(50);
  const spring = useSpring(raw, {stiffness: 300, damping: 30});
  const reduced = useReducedMotion();
  const position = reduced ? raw : spring;
  const clipPath = useTransform(position, v => `inset(0 ${Math.max(0, Math.min(100, 100 - v))}% 0 0)`);
  const left = useTransform(position, v => `${Math.max(0, Math.min(100, v))}%`);
  const sizes = '(max-width: 700px) 92vw, 55vw';

  return (
    <div className="arch-compare-frame">
      <Image src={afterImage} alt={afterAlt} fill sizes={sizes} draggable={false} />
      <motion.div className="arch-compare-layer" style={{clipPath}}>
        <Image src={beforeImage} alt={beforeAlt} fill sizes={sizes} draggable={false} />
      </motion.div>
      <span className="arch-compare-label before" aria-hidden="true">Avant</span>
      <span className="arch-compare-label after" aria-hidden="true">Après</span>
      <motion.div className="arch-compare-divider" style={{left}} aria-hidden="true"><span><ChevronsLeftRight size={21}/></span></motion.div>
      <input type="range" min="0" max="100" value={value}
        onChange={event => {
          const next = event.currentTarget.valueAsNumber;
          setValue(next);
          raw.set(next);
        }}
        aria-label="Comparateur avant et après"
        aria-valuetext={`${value} % de la vue avant`} />
    </div>
  );
}
