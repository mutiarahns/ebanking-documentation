import React, { useEffect, useState } from 'react';
import './DocumentationNavigation.css';

interface NavItem {
  id: string;
  text: string;
  level: number;
}

interface DocumentationNavigationProps {
  markdown: string;
}

const DocumentationNavigation: React.FC<DocumentationNavigationProps> = ({ markdown }) => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    if (!markdown) return;

    // Extract headings from markdown
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = [...markdown.matchAll(headingRegex)];

    const items: NavItem[] = matches.map((match) => {
      const level = match[1].length; // Number of # symbols
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

      return { id, text, level };
    });

    setNavItems(items);
  }, [markdown]);

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (navItems.length === 0) {
    return null;
  }

  return (
    <div className="documentation-navigation">
      <h3 className="navigation-title">Table of Contents</h3>
      <ul className="navigation-list">
        {navItems.map((item, index) => (
          <li 
            key={index} 
            className={`navigation-item level-${item.level}`}
            onClick={() => handleNavClick(item.id)}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentationNavigation;
