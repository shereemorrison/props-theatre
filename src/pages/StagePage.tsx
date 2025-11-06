import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { days } from '../data/performances';
import { getPerformersByStageAndDay } from '../data/performers';
import PerformerGrid from '../components/PerformerGrid';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function StagePage() {
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  
  const blurbRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const storyContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Find the stage data from all days and also find which day it belongs to
  let stageData = null;
  let parentDayId = null;
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

    // Set initial state for performer cards IMMEDIATELY (before any animations)
    const performersSection = sectionRefs.current[1]; // Performers section
    if (performersSection) {
      const performerCards = performersSection.querySelectorAll('.performer-card');
      if (performerCards.length > 0) {
        // Set initial hidden state immediately - no flash
        gsap.set(performerCards, {
          opacity: 0,
          y: 30,
          scale: 0.9
        });
      }
    }

    // Refresh ScrollTrigger to recalculate
    ScrollTrigger.refresh();

    // Title and subtitle - animate immediately
    gsap.fromTo([titleRef.current, subtitleRef.current], 
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

    // Set initial state for words
    gsap.set(wordElements, {
      opacity: 0,
      y: 20
    });

    // Words - animate on scroll with fast stagger so all animate together
    ScrollTrigger.create({
      trigger: blurbRef.current,
      start: 'top 80%',
      toggleActions: 'play none none none',
      onEnter: () => {
        // Create timeline for blurb and performer cards
        const blurbTimeline = gsap.timeline();
        
        // Animate blurb text first
        blurbTimeline.to(wordElements, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.01, // Much faster stagger so all words animate together
          ease: 'power2.out'
        });
        
        // Animate performer cards at the same time as blurb starts
        if (performersSection) {
          const performerCards = performersSection.querySelectorAll('.performer-card');
          
          if (performerCards.length > 0) {
            blurbTimeline.to(performerCards, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.05,
              ease: 'power2.out'
            }, 0); // Start at the same time as blurb (position 0 in timeline)
          }
        }
      }
    });

    // Story sections - animate as they come into view
    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      // Check if section is already in viewport
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      // Set initial state
      gsap.set(section, {
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 50,
        scale: isInView ? 1 : 0.95
      });

      // If already in view, skip animation
      if (isInView) return;

      ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out'
          });
        },
        onEnterBack: () => {
          gsap.to(section, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out'
          });
        }
      });
    });
    
    // Ensure Cast & Crew section is always visible - fallback if ScrollTrigger doesn't fire
    // Check all sections and make sure they're visible if they're in viewport
    // BUT skip performer section (index 1) - it should only animate after blurb
    const ensureSectionsVisible = () => {
      sectionRefs.current.forEach((section, index) => {
        if (!section) return;
        // Skip performer section (index 1) - it animates with blurb timeline
        if (index === 1) return;
        
        const rect = section.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight * 0.5;
        if (isInView) {
          const currentOpacity = gsap.getProperty(section, 'opacity') as number;
          if (currentOpacity === 0 || currentOpacity === undefined) {
            gsap.to(section, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: 'power2.out'
            });
          }
        }
      });
    };

    // Check immediately and after a short delay
    requestAnimationFrame(() => {
      ensureSectionsVisible();
    });
    
    setTimeout(() => {
      ScrollTrigger.refresh();
      ensureSectionsVisible();
    }, 500);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === storyContainerRef.current || 
            trigger.vars.trigger === blurbRef.current ||
            sectionRefs.current.includes(trigger.vars.trigger as HTMLDivElement)) {
          trigger.kill();
        }
      });
    };
  }, { dependencies: [stageData, stagePerformers] });

  return (
    <div className="detail-page">
      
      <button className="back-button" onClick={() => navigate(parentDayId ? `/day/${parentDayId}` : '/')}>← Back</button>
      <div className="detail-content" ref={storyContainerRef}>
        <h1 ref={titleRef}>{stageData.title}</h1>
        <div className="detail-subtitle" ref={subtitleRef}>{stageData.stageNumber}</div>
        {stageData.writtenBy && (
          <div style={{
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
          <h2>Performers</h2>
          <PerformerGrid performers={stagePerformers} />
        </section>

        {stageData.awards.length > 0 && (
          <section className="story-section" ref={el => { sectionRefs.current[2] = el as HTMLDivElement }}>
            <h2>Awards & Recognition</h2>
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
