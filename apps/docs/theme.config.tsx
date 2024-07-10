import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  useNextSeoProps() {
    return {
      titleTemplate: '%s - East'
    }
  },
  feedback: {
    content: null
  },
  editLink: {
    component: null
  },
  logo: <span>EAST</span>,
  project: {
    link: 'https://github.com',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com',
  footer: {
    component: null
  }
}

export default config
