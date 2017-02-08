import React from 'react';
import Link from 'gatsby-link';
import typography, { rhythm, scale } from '../utils/typography';
import { merge, media, presets, style } from 'glamor'
//import { sections, basepath } from 'utilities/pages'
//import Sticky from 'react-stickynode'
//import shallowCompare from 'react-addons-shallow-compare'

import menuItems from '../../docs/menu.yaml'
console.log(menuItems)

class Sidebar extends React.Component {
  render() {
    const { pages, location, activeSection } = this.props
    return (
      <nav
        className="sidebar"
        css={{
          ...scale(-1/5),
          lineHeight: typography.options.baseLineHeight,
          marginTop: rhythm(1/4),
          width: '100%',
          [presets.Tablet]: {
            display: 'block',
            position: 'fixed',
            overflowY: 'scroll',
            width: rhythm(10),
            float: 'left',
            paddingRight: rhythm(1),
          },
        }}
      >
        <div>
          {menuItems.map((section) => {
            return (
              <div
                css={{
                  marginBottom: rhythm(1),
                }}
              >
                <h3
                  css={{
                    marginBottom: rhythm(1/2),
                    marginTop: 0,
                  }}
                >
                  {section.title}
                </h3>
                <ul
                  css={{
                    margin: 0,
                    listStyle: 'none',
                  }}
                >
                  {Object.keys(section.links).map((title) => (
                    <Item
                      url={section.links[title]}
                      title={title}
                    />
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </nav>
    )
  };
}

const Item = ({ url, title }) => (
  <li
    style={{
      marginBottom: rhythm(1/2),
      width: '100%',
    }}
  >
    <Link
      onlyActiveOnIndex
      style={{
        paddingBottom: rhythm(1/4),
        textDecoration: 'none',
      }}
      activeStyle={{
        color: 'black',
        textDecoration: 'underline',
      }}
      to={ url }
    >
      { title }
    </Link>
  </li>
);

export default Sidebar;
