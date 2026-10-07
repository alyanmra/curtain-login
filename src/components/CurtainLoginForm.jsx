import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import './CurtainLoginForm.css';

const STAR_COUNT = 18;

const CurtainLoginForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const leftCurtainRef = useRef(null);
  const rightCurtainRef = useRef(null);
  const nightSkyRef = useRef(null);
  const daySkyRef = useRef(null);
  const sunRef = useRef(null);
  const formRef = useRef(null);
  const hintRef = useRef(null);

  // Generate fixed star positions once
  const stars = useRef(
    Array.from({ length: STAR_COUNT }, () => ({
      top: `${Math.random() * 55}%`,
      left: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
    }))
  ).current;

  const handleToggleCurtain = () => {
    const opening = !isOpen;
    setIsOpen(opening);

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const d = reduceMotion ? 0.01 : 1;

    const tl = gsap.timeline();

    if (opening) {
      tl.to(hintRef.current, { opacity: 0, duration: d * 0.3 }, 0)
        .to(nightSkyRef.current, { opacity: 0, duration: d * 1.1 }, 0.1)
        .to(daySkyRef.current, { opacity: 1, duration: d * 1.1 }, 0.1)
        .to(
          leftCurtainRef.current,
          { xPercent: -100, duration: d * 1.1, ease: 'power3.inOut' },
          0.15
        )
        .to(
          rightCurtainRef.current,
          { xPercent: 100, duration: d * 1.1, ease: 'power3.inOut' },
          0.15
        )
        .fromTo(
          sunRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: d * 1.2, ease: 'power2.out' },
          0.3
        )
        .fromTo(
          formRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: d * 0.6, ease: 'power2.out' },
          0.95
        );
    } else {
      tl.to(formRef.current, { y: 20, opacity: 0, duration: d * 0.35 }, 0)
        .to(sunRef.current, { y: 30, opacity: 0, duration: d * 0.5 }, 0)
        .to(
          leftCurtainRef.current,
          { xPercent: 0, duration: d * 0.9, ease: 'power3.inOut' },
          0.1
        )
        .to(
          rightCurtainRef.current,
          { xPercent: 0, duration: d * 0.9, ease: 'power3.inOut' },
          0.1
        )
        .to(daySkyRef.current, { opacity: 0, duration: d * 0.9 }, 0.1)
        .to(nightSkyRef.current, { opacity: 1, duration: d * 0.9 }, 0.1)
        .to(hintRef.current, { opacity: 1, duration: d * 0.4 }, 0.9);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selamat pagi! Masuk sebagai ${formData.email || 'tamu'}.`);
  };

  return (
    <div className={`curtain-login ${isOpen ? 'is-open' : ''}`}>
      <div className="curtain-login__card">
        <div className="curtain-login__window">
          {/* Night layer */}
          <div className="sky sky--night" ref={nightSkyRef}>
            <div className="stars">
              {stars.map((s, i) => (
                <span
                  key={i}
                  className="star"
                  style={{ top: s.top, left: s.left, animationDelay: s.delay }}
                />
              ))}
            </div>
          </div>

          {/* Day layer */}
          <div className="sky sky--day" ref={daySkyRef}>
            <div className="sun" ref={sunRef} />
          </div>

          {/* Login form, revealed once curtains open */}
          <form
            className="curtain-login__form"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <h2>Halo !</h2>
            <p className="curtain-login__sub">Masuk untuk memulai</p>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Kata Sandi
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit">Masuk</button>
          </form>

          {/* Curtain panels sit on top of everything until opened */}
          <div
            className="curtain-login__curtain curtain-login__curtain--left"
            ref={leftCurtainRef}
          />
          <div
            className="curtain-login__curtain curtain-login__curtain--right"
            ref={rightCurtainRef}
          />
        </div>

        <div className="curtain-login__rod" />

        <button
          type="button"
          className="curtain-login__rope"
          onClick={handleToggleCurtain}
          aria-label={isOpen ? 'Tutup gordyn' : 'Buka gordyn'}
        >
          <span className="curtain-login__tassel" />
        </button>

        <p className="curtain-login__hint" ref={hintRef}>
          Tarik tali untuk membuka gordyn
        </p>
      </div>
    </div>
  );
};

export default CurtainLoginForm;