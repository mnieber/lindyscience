var postcss = require('postcss')

module.exports = {
    plugins: [
        require('tailwindcss')('./tailwind.js'),
    ]
}
