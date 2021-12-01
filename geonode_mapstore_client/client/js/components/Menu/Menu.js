/*
 * Copyright 2021, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';

/**
 * Menu component
 * @name Menu
 * @memberof components.Menu
 * @prop {array} items list of menu item
 * @prop {string} containerClass css class of list container
 * @prop {string} childrenClass css class of item in list
 * @prop {string} query string to build the query url in case of link item
 * @prop {function} formatHref function to format the href in case of link item
 * @example
 *  <Menu items={items} user={user} />
 *
 */


const Menu = ({
    items,
    containerClass,
    childrenClass,
    query,
    formatHref,
    size,
    alignRight
}) => {

    return (
        <ul className={`${containerClass}`}>
            {items
                .map((item, idx) => {
                    return (
                        <li key={idx}>
                            <MenuItem
                                item={{ ...item, id: item.id || idx }}
                                size={size}
                                alignRight={alignRight}
                                menuItemsProps={{
                                    query,
                                    formatHref
                                }}
                                classItem={childrenClass}
                            />
                        </li>
                    );
                })}
        </ul>
    );
};

Menu.propTypes = {
    items: PropTypes.array.isRequired,
    containerClass: PropTypes.string,
    childrenClass: PropTypes.string,
    query: PropTypes.string,
    formatHref: PropTypes.func

};

Menu.defaultProps = {
    items: [],
    query: {},
    user: undefined,
    formatHref: () => '#'
};


export default Menu;
