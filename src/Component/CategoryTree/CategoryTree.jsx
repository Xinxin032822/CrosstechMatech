import React, { useState } from 'react';
import './CategoryTree.css';

const CategoryTree = ({ categories, onSelectCategory }) => {
  const [expanded, setExpanded] = useState({});

  if (!categories || categories.length === 0) return null;

  const toggleExpand = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderTree = (nodes, path = []) => {
    return (
      <ul className="category-tree">
        {nodes.map((node) => {
          const currentPath = [...path, node.name];
          const key = currentPath.join(' > ');
          const isExpanded = expanded[key];

          return (
            <li key={key}>
              <button
                className="category-btn"
                onClick={() => {
                  toggleExpand(key);
                  onSelectCategory(currentPath);
                }}
              >
                {node.name}
              </button>

              {node.children && isExpanded && renderTree(node.children, currentPath)}
            </li>
          );
        })}
      </ul>
    );
  };

  return <div className="category-tree-container">{renderTree(categories)}</div>;
};

export default CategoryTree;
