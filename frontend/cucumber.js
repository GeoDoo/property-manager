module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['src/tests/steps/**/*.ts', 'src/tests/support/**/*.ts'],
        paths: ['src/tests/features/**/*.feature'],
        format: ['progress-bar', 'html:cucumber-report.html'],
        publishQuiet: true
    }
} 