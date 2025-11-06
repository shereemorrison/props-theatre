import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../components/Menu';

interface LandingPageProps {
  showMenu?: boolean;
}

function LandingPage({ showMenu = true }: LandingPageProps) {
  const navigate = useNavigate();

  const handlePageClick = (pageIndex: number) => {
    const routes = [
      '/day/monday-24th', 
      '/day/tuesday-25th', 
      '/day/wednesday-26th', 
      '/day/thursday-27th', 
      '/acknowledgements', 
      '/contact'
    ];
    if (pageIndex >= 0 && pageIndex < routes.length) {
      navigate(routes[pageIndex]);
    }
  };

  return (
    <div className="wrapper">
      {showMenu && (
        <Menu 
          onPageClick={handlePageClick} 
          isVisible={true}
          skipAnimation={false}
        />
      )}
    </div>
  );
}

export default LandingPage;

