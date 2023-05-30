'use strict'

/**
 * Module dependencies
 */

/* eslint-disable no-unused-vars */
// Public node modules.
const _ = require('lodash')
const AWS = require('aws-sdk')

module.exports = {
  init(config) {
    const S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      ...config,
    })

    return {
      upload(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          let prefix = 'unknown/'

          if (
            [
              '.apng',
              '.avif',
              '.gif',
              '.jpg',
              ';jpeg',
              '.png',
              '.svg',
              '.webp',
            ].includes(file.ext)
          ) {
            prefix = config.imgPrefix
          }

          if (['.mp4', '.webm'].includes(file.ext)) {
            prefix = config.vidPrefix
          }

          if (
            ['.pdf', '.doc', '.docx', '.odt', '.txt', '.xls', '.xlsx'].includes(
              file.ext
            )
          ) {
            prefix = config.docPrefix
          }

          // prefix only if not root
          prefix = prefix.trim() === '/' ? '' : prefix.trim()
          const path = file.path ? `${file.path}/` : ''
          const objectPath = `${prefix}${path}${file.hash}${file.ext}`
          // upload file on S3 bucket
          S3.upload(
            {
              Key: objectPath,
              Body: Buffer.from(file.buffer, 'binary'),
              // ACL: 'public-read',
              ContentType: file.mime,
              ...customParams,
            },
            (err, data) => {
              if (err) {
                return reject(err)
              }

              // set the bucket file url
              if (config.baseUrl) {
                file.url = `${config.baseUrl}/${objectPath}`
              } else {
                // if no baseUrl provided, use the endpoint returned from S3
                file.url = data.Location
              }

              resolve()
            }
          )
        })
      },
      delete(file, customParams = {}) {
        return new Promise((resolve, reject) => {
          const path = file.path ? `${file.path}/` : ''
          let prefix = config.prefix || ''
          prefix = prefix.trim() === '/' ? '' : prefix.trim()
          // delete file on S3 bucket
          S3.deleteObject(
            {
              Key: `${prefix}${path}${file.hash}${file.ext}`,
              ...customParams,
            },
            (err) => {
              if (err) {
                return reject(err)
              }

              resolve()
            }
          )
        })
      },
    }
  },
}
