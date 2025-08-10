module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['e2e/steps/**/*.ts'],
    format: ['progress', 'html:e2e/reports/cucumber-report.html'],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true,
  }
}