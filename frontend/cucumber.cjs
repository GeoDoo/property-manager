module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: [
            'src/tests/support/setup.ts',
            'src/tests/support/world.tsx',
            'src/tests/steps/**/*.ts'
        ],
        paths: ['src/tests/features/**/*.feature'],
        format: ['progress-bar', 'html:cucumber-report.html']
    }
} 