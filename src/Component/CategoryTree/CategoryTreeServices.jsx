// src/Component/CategoryTreeServices/CategoryTreeServices.jsx
import React, { useState } from 'react';
import './CategoryTree.css';

const CategoryTreeServices = ({ categories, onSelectCategory, services }) => {
  const [expanded, setExpanded] = useState({});

  if (!categories || categories.length === 0) return null;

  const toggleExpand = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAllClick = () => {
    setExpanded({});
    onSelectCategory(null);
  };

  const getServiceCount = (categoryPath) => {
    const lastCategory = categoryPath[categoryPath.length - 1]?.toLowerCase();

    if (!lastCategory || !services) return 0;

    return services.filter((service) => {
      const matchesCategory = service.category?.toLowerCase() === lastCategory;
      const matchesSubcategory = Array.isArray(service.subcategories)
        ? service.subcategories.some((sub) => sub.toLowerCase() === lastCategory)
        : false;
      return matchesCategory || matchesSubcategory;
    }).length;
  };

  const renderTree = (nodes, path = []) => {
    return (
      <ul className="category-tree">
        {nodes.map((node) => {
          const currentPath = [...path, node.name];
          const key = currentPath.join(' > ');
          const isExpanded = expanded[key];
          const count = getServiceCount(currentPath);

          return (
            <li key={key}>
              <button
                className="category-btn"
                onClick={() => {
                  toggleExpand(key);
                  onSelectCategory(currentPath);
                }}
              >
                {node.name} <span className="category-count">({count})</span>
              </button>

              {node.children && isExpanded && renderTree(node.children, currentPath)}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="category-tree-container">
      <button className="category-btn all-btn" onClick={handleAllClick}>
        All <span className="category-count">({services?.length || 0})</span>
      </button>
      {renderTree(categories)}
    </div>
  );
};

export default CategoryTreeServices;
