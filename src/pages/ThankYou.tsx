import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ThankYou() {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    if (!titleRef.current || !section1Ref.current || !section2Ref.current || !containerRef.current) {
      return;
    }

    // Get section elements
    const section1Heading = section1Ref.current.querySelector('h2');
    const section1Paragraphs = section1Ref.current.querySelectorAll('p');
    const section2Heading = section2Ref.current.querySelector('h2');
    const section2Paragraphs = section2Ref.current.querySelectorAll('p');

    // Set initial state for all elements
    gsap.set([titleRef.current, section1Heading, ...section1Paragraphs, section2Heading, ...section2Paragraphs], {
      opacity: 0,
      y: 20
    });

    // Create timeline for sequential top-to-bottom animation
    const tl = gsap.timeline();

    // Animate title first
    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Then animate first section heading and paragraphs sequentially
    tl.to(section1Heading, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3'); // Start slightly before previous animation ends

    tl.to(section1Paragraphs, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.2');

    // Then animate second section heading and paragraphs
    tl.to(section2Heading, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2');

    tl.to(section2Paragraphs, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    }, '-=0.2');

    return () => {
      tl.kill();
    };
  }, { scope: containerRef });
  
  return (
    <div className="detail-page" ref={containerRef}>
      <button 
        className="back-button" 
        onClick={() => navigate('/')}
      >
        ← Back
      </button>
      <div className="detail-content" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'clamp(2rem, 5vh, 4rem) clamp(1rem, 3vw, 2rem)',
        textAlign: 'left'
      }}>
        <h1 
          ref={titleRef}
          style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            marginBottom: 'clamp(2rem, 4vh, 3rem)',
            fontFamily: 'var(--font-heading)',
            width: '100%',
            textAlign: 'center'
          }}
        >
          Thank You
        </h1>
        
        <section ref={section1Ref} style={{ marginBottom: 'clamp(2rem, 4vh, 3rem)' }}>
          <h2 style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            color: '#ffd700',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
          }}>
            Dear Props Theatre Staff,
          </h2>
          <div style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.7
          }}>
            <p style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
              As we close another season together, I want to take a moment to express my deepest gratitude for everything you bring to Props Theatre. Your genuine care for our students, your support of their families, and your continued love for your craft—and for one another—are at the heart of what makes this place so special.
            </p>
            <p style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
              Each of you plays an essential role in creating an environment where young performers feel safe, inspired, and encouraged to grow. Your dedication doesn't go unnoticed: parents speak highly of your kindness and professionalism, and our students flourish under your guidance, creativity, and passion.
            </p>
            <p style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
              We strive every year to raise our standards, to challenge ourselves, and to model the excellence we hope to inspire in our students. Thank you for meeting that challenge with enthusiasm, teamwork, and heart. Because of you, Props Theatre remains a place where artistry, community, and possibility thrive.
            </p>
            <p>
              I am grateful for all you do, and I'm excited for all we will continue to accomplish together.
            </p>
          </div>
        </section>

        <section ref={section2Ref}>
          <h2 style={{
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            color: '#ffd700',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            marginBottom: 'clamp(1rem, 2vh, 1.5rem)'
          }}>
            To Our Props Theatre Parents,
          </h2>
          <div style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.7
          }}>
            <p style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
              Thank you for showing up for your amazing young creatives—week after week, event after event, performance after performance. Your support is the foundation of everything we do.
            </p>
            <p style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
              To those who filled a whole row of seats just to cheer on your one performer—wonderful! Moments like that remind us how powerful your encouragement is. Your enthusiasm not only lifts your children, but it also supports Props Theatre as a whole.
            </p>
            <p style={{ marginBottom: 'clamp(1rem, 2vh, 1.5rem)' }}>
              Whether you've been with us for 2, 5, or even 10 years, please know that your dedication, trust, and belief in what we do never go unnoticed. You are an essential part of our community and our success. Without you, none of this works.
            </p>
            <p>
              Thank you for being our partners, our cheerleaders, and the heart of Props Theatre.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
