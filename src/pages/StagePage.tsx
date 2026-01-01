import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { days } from '../data/performances';
import { getPerformersByStageAndDay } from '../data/performers';
import PerformerGrid from '../components/PerformerGrid';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function StagePage() {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  
  const blurbRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const writtenByRef = useRef<HTMLDivElement>(null);
  const performersHeadingRef = useRef<HTMLHeadingElement>(null);
  const awardsHeadingRef = useRef<HTMLHeadingElement>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Find the stage data from all days and also find which day it belongs to
  let stageData: typeof days[0]['stages'][0] | null = null;
  let parentDayId: string | null = null;
  for (const day of days) {
    const found = day.stages.find(s => s.id === stageId);
    if (found) {
      stageData = found;
      parentDayId = day.id;
      break;
    }
  }
  
  if (!stageData) {
    return (
      <div className="detail-page">
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
        <div className="detail-content">
          <h1>Stage not found</h1>
        </div>
      </div>
    );
  }

  // Get performers for this stage and day
  const stagePerformers = parentDayId ? getPerformersByStageAndDay(stageId || '', parentDayId) : [];

  // Split the summary into words
  const words = stageData.summary.split(' ');

  useGSAP(() => {
    // Wait for all refs to be ready
    if (!blurbRef.current || !titleRef.current || !subtitleRef.current || !storyContainerRef.current) {
      return;
    }
    
    const wordElements = blurbRef.current.querySelectorAll('.word');
    if (wordElements.length === 0) return;

    // Get performer cards
    const performersSection = sectionRefs.current[1]; // Performers section
    const performerCards = performersSection ? performersSection.querySelectorAll('.performer-card') : [];
    
    // Get awards section if it exists
    const awardsSection = sectionRefs.current[2];
    const awardsCards = awardsSection ? Array.from(awardsSection.querySelectorAll('.awards-grid > div')) : [];

    // Set initial state for all elements
    gsap.set([
      titleRef.current,
      subtitleRef.current,
      writtenByRef.current,
      performersHeadingRef.current,
      awardsHeadingRef.current,
      ...Array.from(wordElements),
      ...Array.from(awardsCards)
    ], {
      opacity: 0,
      y: 20
    });

    // Set initial state for performer cards with scale
    if (performerCards.length > 0) {
      gsap.set(performerCards, {
        opacity: 0,
        y: 30,
        scale: 0.9
      });
    }

    // Create timeline for sequential top-to-bottom animation
    const tl = gsap.timeline();

    // Header section: Title, subtitle, written by, and blurb - animate tightly together
    tl.fromTo([titleRef.current, subtitleRef.current], 
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out'
      }
    );

    // Written by - tight overlap
    if (writtenByRef.current) {
      tl.to(writtenByRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.3');
    }

    // Blurb words - animate quickly together, tight overlap
    tl.to(wordElements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.01,
      ease: 'power2.out'
    }, '-=0.3');

    // Small gap before performers section starts
    // Performers heading - starts after header section completes
    if (performersHeadingRef.current) {
      tl.to(performersHeadingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.1');
    }

    // Performer cards - animate together with heading
    if (performerCards.length > 0) {
      tl.to(performerCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out'
      }, '-=0.4');
    }

    // Awards heading
    if (awardsHeadingRef.current) {
      tl.to(awardsHeadingRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, '-=0.2');
    }

    // Awards cards
    if (awardsCards.length > 0) {
      tl.to(awardsCards, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.2');
    }

    return () => {
      tl.kill();
    };
  }, { dependencies: [stageData, stagePerformers] });

  return (
    <div className="detail-page">
      
      <button className="back-button" onClick={() => navigate(parentDayId ? `/day/${parentDayId}` : '/')}>← Back</button>
      <div className="detail-content" ref={storyContainerRef}>
        <h1 ref={titleRef}>{stageData.title}</h1>
        <div className="detail-subtitle" ref={subtitleRef}>{stageData.stageNumber}</div>
        {stageData.writtenBy && (
          <div 
            ref={writtenByRef}
            style={{
              fontSize: 'clamp(0.9rem, 2.2vw, 1.1rem)',
              fontFamily: "Oswald, sans-serif",
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              marginTop: 'clamp(0.5rem, 1.5vh, 1rem)',
              marginBottom: 'clamp(1rem, 2vh, 1.5rem)',
              fontStyle: 'italic'
            }}>
            Written by {stageData.writtenBy}
          </div>
        )}
        
        <section className="story-section" ref={el => { sectionRefs.current[0] = el as HTMLDivElement }}>
          <p ref={blurbRef} className="story-blurb">
            {words.map((word, index) => (
              <span key={index} className="word" style={{ display: 'inline-block', marginRight: index < words.length - 1 ? '0.25em' : '0' }}>
                {word}
              </span>
            ))}
          </p>
        </section>

        {/* Performers Grid - replaces Cast and Gallery */}
        <section className="story-section performers-section" ref={el => { sectionRefs.current[1] = el as HTMLDivElement }}>
          <h2 ref={performersHeadingRef}>Performers</h2>
          <PerformerGrid performers={stagePerformers} />
        </section>

        {stageData.awards.length > 0 && (
          <section className="story-section" ref={el => { sectionRefs.current[2] = el as HTMLDivElement }}>
            <h2 ref={awardsHeadingRef}>Awards & Recognition</h2>
            <div className="awards-grid">
              {stageData.awards.map((award, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                  color: '#000000',
                  padding: 'clamp(1rem, 2.5vw, 1.5rem)',
                  borderRadius: 'clamp(10px, 2vw, 15px)',
                  textAlign: 'center',
                  boxShadow: '0 6px 20px rgba(255, 215, 0, 0.3)',
                  border: '2px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)' }}>{award.icon}</div>
                  <div style={{ fontWeight: 'bold', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)', fontFamily: "Oswald, sans-serif" }}>{award.name}</div>
                  <div style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', opacity: 0.8, fontFamily: "Oswald, sans-serif" }}>{award.recipient}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

