module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["test/e2e/steps/**/*.ts"],
    format: ["progress", "html:test/e2e/reports/cucumber-report.html"],
    formatOptions: {
      snippetInterface: "async-await",
    },
    publishQuiet: true,
  },
};
