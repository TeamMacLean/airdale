import cors from "cors";
import express from "express";

require('dotenv').config();

import pinger from './pingworker'
pinger.start();

export default {
  mode: 'spa',
  render: {
    ssr: false
  },
  server: {
    port: process.env.PORT || 3000, // default: 3000
    host: process.env.HOST || 'localhost', // default: localhost
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },
  loading: {color: '#fff'},
  css: [],
  plugins: [],
  buildModules: [],
  modules: [
    'nuxt-buefy',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
  ],
  axios: {
    baseURL: process.env.API_URL
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {url: 'login', method: 'post', propertyName: 'token'},
          user: {url: 'me', method: 'get', propertyName: 'user'},
          logout: false
        }
      }
    }
  },
  serverMiddleware: [
    cors(),
    express.json(),
    express.urlencoded({extended: false}),
    {path: '/api', handler: '~/api/index.js'},
  ],
  // router: {
  //   linkActiveClass: 'is-active',
  // },
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    extend(config, ctx) {
    }
  }
}
