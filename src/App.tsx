import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DayPage from "./pages/DayPage";
import StagePage from "./pages/StagePage";
import Credits from "./pages/Credits";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";

// Import curtain image - bundled with app for immediate availability
// @ts-ignore - Image import handled by Vite
import curtainImage from "./assets/images/curtains.jpg";

function App() {
  const [showMainPage, setShowMainPage] = useState(true);
  const [loadingHidden, setLoadingHidden] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [curtainImageReady, setCurtainImageReady] = useState(false);
  const [isPageRefresh, setIsPageRefresh] = useState(false);
  const loading = useRef<HTMLDivElement>(null);
  const landingPageRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Detect if this is a page refresh vs initial load
  useEffect(() => {
    // Check if page was loaded via refresh
    let refreshDetected = false;
    
    try {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const navType = navigationEntries[0].type;
        // 'reload' means page was refreshed
        refreshDetected = navType === 'reload';
      } else {
        // Fallback for older browsers
        // @ts-ignore - performance.navigation exists in older browsers
        const navType = performance.navigation?.type;
        // Type 1 = TYPE_RELOAD
        refreshDetected = navType === 1;
      }
    } catch (e) {
      // If Performance API is not available, default to false (show animation)
      refreshDetected = false;
    }
    
    setIsPageRefresh(refreshDetected);
    
    // If it's a refresh, skip the curtain animation
    if (refreshDetected) {
      setLoadingHidden(true);
      setShowMenu(true);
    }
  }, []);

  // Preload curtain image first, before anything else
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      // Image is loaded and ready
      setCurtainImageReady(true);
    };
    img.onerror = () => {
      // Even if image fails to load, proceed (fallback)
      setCurtainImageReady(true);
    };
    img.src = curtainImage;
  }, []);

  useGSAP(
    () => {
      // Skip animation if this is a page refresh
      if (isPageRefresh) return;
      
      // Wait for curtain image to be ready before starting animation
      if (!curtainImageReady) return;

      // Initialize curtain elements
      const leftCurtain = document.querySelector(".loadings-left");
      const rightCurtain = document.querySelector(".loadings-right");
      
      if (leftCurtain && rightCurtain) {
        gsap.set(".loadings-left", { x: "0%", opacity: 1, display: "block" });
        gsap.set(".loadings-right", { x: "0%", opacity: 1, display: "block" });
      }

      // Show menu immediately so it's ready when curtains open (but it stays behind curtains initially)
      setShowMenu(true);

      // Simplified timeline: curtains open onto the menu
      const curtainDuration = 2.5;
      const imageReadyDelay = 0.2; // 0.2s delay after image is ready before splitting
      const tl = gsap.timeline({ 
        defaults: { ease: "power2.inOut" },
        delay: imageReadyDelay // Delay after image is ready
      });
      
      // Keep menu behind curtains initially, then bring it forward after curtains finish
      // The menu will have lower z-index initially via CSS, then we'll raise it
      tl.to(".loadings-left", {
        x: "-100%",
        duration: curtainDuration,
        ease: "power3.inOut",
      })
      .to(".loadings-right", {
        x: "100%",
        duration: curtainDuration,
        ease: "power3.inOut",
      }, "<") // Start at same time as left curtain
      .to(".loadings", {
        backgroundColor: "rgba(0, 0, 0, 0)",
        duration: 0.2,
        ease: "power2.out",
      }, "<") // Start at same time as curtains
      .set(".loadings", {
        zIndex: -1,
      }, curtainDuration)
      .to(".loadings", {
        opacity: 0,
        duration: 0.1,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(".loadings", { display: "none" });
          setLoadingHidden(true);
          // Ensure menu is on top after curtains are gone
          const menuElement = document.querySelector(".impressive-menu") as HTMLElement;
          if (menuElement) {
            gsap.set(menuElement, { zIndex: 100 });
          }
        }
      }, curtainDuration);
    },
    { scope: loading, dependencies: [curtainImageReady, isPageRefresh] }
  );

  return (
    <>
      {/* Loading screen with curtains - keep mounted until curtain animation completes */}
      {!loadingHidden && (
        <div className="contain">
          <div className="loadings" ref={loading}>
            {/* Curtain elements for split animation */}
            <div 
              className="loadings-left"
              style={{ backgroundImage: `url(${curtainImage})` }}
            ></div>
            <div 
              className="loadings-right"
              style={{ backgroundImage: `url(${curtainImage})` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* App routes */}
      {showMainPage && (
        <div ref={landingPageRef}>
          <Routes>
            <Route path="/" element={<LandingPage showMenu={showMenu} />} />
            <Route path="/day/:dayId" element={<DayPage />} />
            <Route path="/stage/:stageId" element={<StagePage />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/acknowledgements" element={<Credits />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;

