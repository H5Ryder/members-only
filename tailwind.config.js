/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.ejs', './views/partials/*.ejs'],
  theme: {
    screens: { 
      'sm': '600px', 
      'md': '1024px', 
      'lg': '1280px', 
      'xl': '1920px', 
    },
    extend: {
      fontFamily: {
        'serif-display': ['"DM Serif Display"', 'serif'],
      },
      colors: {
        main: '#663399', // Define your custom color value here
      }
    },
  },
  plugins: [
  {
  tailwindcss: {},
  autoprefixer: {},
  },
  ],
  };
  
