import Typography from 'typography'
import CodePlugin from 'typography-plugin-code'
import { MOBILE_MEDIA_QUERY } from 'typography-breakpoint-constants'

const theme = {
  baseFontSize: '16px',
  scaleRatio: 2.25,
  blockMarginBottom: 0.75,
  bodyWeight: 400,
  boldWeight: 700,
  headerWeight: 700,
  bodyFontFamily: ['Libre Franklin', 'Century Gothic', 'sans-serif'],
  headerFontFamily: ['Libre Franklin', 'Century Gothic', 'sans-serif'],
  plugins: [
    new CodePlugin(),
  ],
  overrideStyles: ({ rhythm, scale }) => ({
    'h1,h2,h3,h4,h5,h6': {
      lineHeight: 1.1,
      marginTop: rhythm(1),
      marginBottom: rhythm(1 / 2)
    },
    a: {
      color: '#007cb1',
    },
    blockquote: {
      paddingLeft: rhythm(3/4),
      paddingTop: rhythm(1/2),
      paddingBottom: rhythm(1/2),
      marginLeft: 0,
      marginRight: 0,
      borderLeft: `${rhythm(1/4)} solid #797979`,
    },
    'blockquote *:last-child': {
      marginBottom: 0,
    },
    'h2 code': {
      ...scale(3/5),
    },
    'h3 code': {
      ...scale(2/5),
    },
    'h4 code': {
      ...scale(0/5),
    },
    'h5 code': {
      ...scale(-1/5),
    },
    'tt,code': {
      fontFamily: '"Ubuntu Mono", Consolas,"Roboto Mono","Liberation Mono",Menlo,Courier,monospace',
    },
    '.gatsby-resp-image-link': {
      marginLeft: rhythm(-3/4),
      marginRight: rhythm(-3/4),
    },
    'li .gatsby-resp-image-link': {
      marginTop: rhythm(1/2),
      marginLeft: rhythm(-7/4),
    },
    [MOBILE_MEDIA_QUERY]: {
      html: {
        fontSize: 15 / 16 * 100 + '%'
      },
      blockquote: {
        borderLeft: `${rhythm(3 / 16)} solid #797979`,
        marginLeft: rhythm(-3 / 4),
        marginRight: 0,
        paddingLeft: rhythm(9 / 16)
      }
    }
  }),
}

const typography = new Typography(theme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

module.exports = typography
