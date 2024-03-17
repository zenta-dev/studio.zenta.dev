const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const cssnano = require('cssnano');


const config = {
  plugins: [
    //Some plugins, like tailwindcss/nesting, need to run before Tailwind,
    tailwindcss(),
    //But others, like autoprefixer, need to run after,
    autoprefixer,
    //And some, like cssnano, need to run last.
    cssnano,
  ],
};

module.exports = config;
