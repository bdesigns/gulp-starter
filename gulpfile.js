const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));  // Compile Sass
const autoprefixer = () => import('gulp-autoprefixer'); // Dynamically import autoprefixer

// Task to compile Sass files
gulp.task('sass', async function() {
    const autoprefixerModule = await autoprefixer(); // Wait for autoprefixer to be loaded

    return gulp.src('src/scss/**/*.scss')
        .pipe(sass({ style: 'compressed' }).on('error', sass.logError))  // Compile SCSS to CSS expanded | compressed
        .pipe(autoprefixerModule.default({  // Add vendor prefixes
            overrideBrowserslist: ['last 1 versions', 'IE 11'],
            cascade: false
        }))
        .pipe(gulp.dest('src/css'))  // Output compiled CSS to the 'dist/css' folder
        .pipe(browserSync.stream());  // Inject CSS changes into the browser without a full reload
});

// Task to serve files with BrowserSync and auto-reload
gulp.task('serve', function() {
    // Start a local server
    browserSync.init({
        server: {
            baseDir: 'src'  // Set the root folder for serving files
        },
        notify: false,  // Disable notifications in the browser
        open: false  // Automatically open the browser when starting the server
    });

    // Watch for changes in SCSS files and recompile
    gulp.watch('src/scss/**/*.scss', gulp.series('sass'));  // Watch SCSS files

    // Watch for changes in HTML, CSS, and JS files and reload the browser
    gulp.watch('src/*.html').on('change', browserSync.reload);  // Watch HTML files
    gulp.watch('src/css/*.css').on('change', browserSync.reload);  // Watch CSS files
    gulp.watch('src/js/*.js').on('change', browserSync.reload);  // Watch JS files
});


// Default task to run when no task is specified
gulp.task('default', gulp.series('sass', 'serve'));
