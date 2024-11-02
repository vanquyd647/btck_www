import React, { useState } from 'react';
import '../component/css/CategorySelect.css';

const CategorySelect = () => {
    const [activeCategory, setActiveCategory] = useState('');

    const showCategory = (categoryId) => {
        setActiveCategory(categoryId);
    };

    return (
        <div className="category-select-container">
            <div>
                <ul className="category-selection-bar">
                    <li
                        onClick={() => showCategory('nam')}
                        className={activeCategory === 'nam' ? 'active-link' : ''}
                    >
                        <a>NAM</a>
                    </li>
                    <li
                        onClick={() => showCategory('nu')}
                        className={activeCategory === 'nu' ? 'active-link' : ''}
                    >
                        <a>NỮ</a>
                    </li>
                    <li
                        onClick={() => showCategory('betrai')}
                        className={activeCategory === 'betrai' ? 'active-link' : ''}
                    >
                        <a>BÉ TRAI</a>
                    </li>
                    <li
                        onClick={() => showCategory('begai')}
                        className={activeCategory === 'begai' ? 'active-link' : ''}
                    >
                        <a>BÉ GÁI</a>
                    </li>
                    <li
                        onClick={() => showCategory('phukien')}
                        className={activeCategory === 'phukien' ? 'active-link' : ''}
                    >
                        <a>PHỤ KIỆN</a>
                    </li>
                    <li
                        onClick={() => showCategory('moibestseller')}
                        className={activeCategory === 'moibestseller' ? 'active-link' : ''}
                    >
                        <a>MỚI & BESTSELLER</a>
                    </li>
                </ul>
            </div>

            <div>
                {/* NAM Category */}
                <ul id="nam" className={`category-selection-row ${activeCategory === 'nam' ? 'active' : ''}`}>
                    <li>
                        <a href="http://localhost:8080/collections/dep-nam">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/dep-nam.svg?v=4605" className="category-img" alt="dep-nam" />
                            Dép
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/giay-the-thao-nam">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/hunter-nam.svg?v=4605" className="category-img" alt="giay-the-thao" />
                            Giày Thể thao
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/giay-tay">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/giay-tay-nam.svg?v=4605" className="category-img" alt="giay-tay" />
                            Giày Tây
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/giay-da-bong">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/giay-da-banh.svg?v=4605" className="category-img" alt="giay-da-banh" />
                            Giày Đá Banh
                        </a>
                    </li>
                </ul>

                {/* NỮ Category */}
                <ul id="nu" className={`category-selection-row ${activeCategory === 'nu' ? 'active' : ''}`}>
                    <li>
                        <a href="http://localhost:8080/collections/dep-nu">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/dep-nu.svg?v=4605" className="category-img" alt="dep-nu" />
                            Dép
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/giay-the-thao-nu">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/hunter-nam.svg?v=4605" className="category-img" alt="giay-the-thao" />
                            Giày Thể thao
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/giay-cao-got">
                            Giày cao gót
                        </a>
                    </li>
                </ul>

                {/* BÉ TRAI Category */}
                <ul id="betrai" className={`category-selection-row ${activeCategory === 'betrai' ? 'active' : ''}`}>
                    <li>
                        <a href="http://localhost:8080/collections/dep-be-trai">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/dep-be-trai.svg?v=4605" className="category-img" alt="dep-be-trai" />
                            Dép
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/giay-the-theo-be-trai">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/giay-the-thao-be-trai.svg?v=4605" className="category-img" alt="giay-the-thao" />
                            Giày Thể thao
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/sandal-be-trai">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/sandal-be-trai.svg?v=4605" className="category-img" alt="sandal-be-trai" />
                            Sandal
                        </a>
                    </li>
                </ul>

                {/* BÉ GÁI Category */}
                <ul id="begai" className={`category-selection-row ${activeCategory === 'begai' ? 'active' : ''}`}>
                    <li>
                        <a href="http://localhost:8080/collections/dep-be-gai">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/dep-be-gai.svg?v=4605" className="category-img" alt="dep-be-gai" />
                            Dép
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/giay-the-thao-be-gai">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/giay-the-thao-be-gai.svg?v=4605" className="category-img" alt="giay-the-thao" />
                            Giày Thể thao
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/sandal-be-gai">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/sandal-be-gai.svg?v=4605" className="category-img" alt="sandal-be-gai" />
                            Sandal
                        </a>
                    </li>
                </ul>

                {/* PHỤ KIỆN Category */}
                <ul id="phukien" className={`category-selection-row ${activeCategory === 'phukien' ? 'active' : ''}`}>
                    <li>
                        <a href="http://localhost:8080/collections/balo">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/balo-tui-xach.svg?v=4606" className="category-img" alt="balo-tui-xach" />
                            Balo
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/ao-thun">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/ao-thun.svg?v=4606" className="category-img" alt="ao-thun" />
                            Áo Thun
                        </a>
                    </li>
                    <li>
                        <a href="http://localhost:8080/collections/tui-xach">
                            <img src="//theme.hstatic.net/1000230642/1001205219/14/tui-xach.svg?v=4606" className="category-img" alt="tui-xach" />
                            Túi Xách
                        </a>
                    </li>
                </ul>

                {/* MỚI & BESTSELLER Category */}
                <ul id="moibestseller" className={`category-selection-row ${activeCategory === 'moibestseller' ? 'active' : ''}`}>
                    <li>Sản phẩm mới</li>
                    <li>Sản phẩm bán chạy</li>
                </ul>
            </div>
        </div>
    );
};

export default CategorySelect;
