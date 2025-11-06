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
  const loading = useRef<HTMLDivElement>(null);
  const landingPageRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle refresh - always redirect to home (menu)
  useEffect(() => {
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, []); // Only run on mount (refresh)

  useGSAP(
    () => {
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
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
      
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
    { scope: loading }
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

