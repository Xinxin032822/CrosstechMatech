  import React from 'react'
  import { useState } from 'react'
  import "../Styles/Product.css"
  import FilterCategory from '../Component/FilterCategory/FilterCategory'
  import ProductPageCards from '../Component/ProductPageCards/ProductPageCards'
  function Products() {
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortOption, setSortOption] = useState('sortByPrice');
    return (
      <div>

        <div className='products-page-container-header'>
          <p className='products-page-header'>Our Equipment Catalog</p>
          <p className='products-page-subheader'>Browse our comprehensive collection of heavy equipment and machinery. From <br />excavators to bulldozers, find the perfect equipment for your construction needs.</p>
        </div>

        <div className='products-page-container-body'>
            <div className='products-page-body-item-header'>
              <div className='filterCategory'>
                <FilterCategory
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </div>
              <div className='filterSorter'>
                <select 
                  className='filterSorter-select'
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="sortByPrice">Sort by Price</option>
                  <option value="sortByName">Sort by Name</option>
                </select>
              </div>
            </div>
            <div className='products-page-body-item'>
              <ProductPageCards 
                activeCategory={activeCategory} 
                sortOption={sortOption}
              />
            </div>
            <div></div>
        </div>

      </div>
    )
  }

  export default Products