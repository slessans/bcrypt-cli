#!/usr/bin/env node
'use strict'

const bcrypt = require('bcrypt')

const run = (input, { saltRounds }) =>
  new Promise((resolve, reject) =>
    bcrypt.hash(
      input,
      saltRounds,
      (err, hash) => err ? reject(err) : resolve(hash)
    )
  )


if (require.main === module) {
  const { r: saltRounds, _: [ toHash ] } = require('yargs')
    .usage('Usage: $0 <input>')
    .demand(1, 1, 1)
    .option('r', {
        alias: 'salt-rounds',
        demand: false,
        describe: 'number of rounds used to generate salt',
        type: 'number',
        requiresArg: true,
        nargs: 1,
        array: false,
        default: 10,
    })
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2016')
    .strict()
    .check((argv) => {
      const r = parseInt(argv.r, 10)
      if (isNaN(r) || r !== argv.r) {
        throw new Error('Salt round option must be an integer.')
      }
      if (r < 1) {
        throw new Error('Salt round option must be positive.')
      }
      return true
    })
    .argv  

  run(toHash, { saltRounds })
    .then((hashed) => {
      console.log(hashed)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}

module.exports = run
