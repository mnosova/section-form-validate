'use strict';

const gulp = require('gulp'),
    inject = require('gulp-inject'),
    scss = require('gulp-scss'),
    browserSync = require('browser-sync'),
    //uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    sourcemaps = require('gulp-sourcemaps'),
    mainBowerFiles = require('main-bower-files'),
    cleanCSS = require('gulp-clean-css'),
    responsive = require('gulp-responsive'),
    imageResize = require('gulp-image-resize'),
    spritesmith = require('gulp.spritesmith'),
    svgSprite = require('gulp-svg-sprite'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio'),
    replace = require('gulp-replace'),
    autoprefixer = require('gulp-autoprefixer'),
    babel = require("gulp-babel"),
    webpack = require('webpack'),
    // webpackStream = require('webpack-stream');
    gulpWebpack = require('gulp-webpack'),
    webpackConfig = require("./webpack.config.js");


//structure
gulp.task('copy', function () {
    return gulp.src(['app/libs/*/*.css', 'app/libs/*/css/*.css'])
        .pipe(gulp.dest('app/css'))
});

gulp.task('copybower', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('./app/js'))

});


//markup
let injectSrc = gulp.src(['app/css/**/*.css', 'app/js/**/*.js'], {read: false});
let injectOptions = {
    ignorePath: '/app',
    addRootSlash: false
};


gulp.task('inject', gulp.series('copy', 'copybower', function () {
    return gulp.src('./app/*.html')
        .pipe(inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./app'));
}));

gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app',
            proxy: "localhost:3000"
        },
        notify: false
    });
});


//images
gulp.task('resize', function () {
    return gulp.src('app/img/src/resize/*.{png,jpg}')
        .pipe(imageResize({
            width: 245,
            height: 482,
            crop: false,
            upscale: false
        }))
        .pipe(gulp.dest('app/img'));
});

gulp.task('responsive', function () {
    return gulp.src('app/img/src/responsive/*.{png,jpg}')
        .pipe(responsive({
            'background-*.jpg': {
                width: 700,
                quality: 50
            },
            'cover.png': {
                width: '50%',
                format: 'jpeg',
                rename: 'cover.jpg'
            },
            'logo.png': [
                {
                    width: 200
                }, {
                    width: 200 * 2,
                    rename: 'logo@2x.png'
                }
            ],
            'logo.png': [
                {
                    width: 200
                }, {
                    width: 200 * 2,
                    rename: 'logo@2x.png'
                }
            ]
        }))
        .pipe(gulp.dest('app/img'));
});


gulp.task('sprite', function () {

    let spriteData = gulp.src('app/img/src/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        imgPath: '../img/icons/sprite.png',
        padding: 1
    }));

    let stylStream = spriteData.css
        .pipe(gulp.dest('app/scss/components'));


    let imgStream = spriteData.img
        .pipe(gulp.dest('app/img/icons'));
    return spriteData;

});

let svgPath = {
    "input": "./app/img/src/icons/*.svg",
    "output": "./app/img/icons/"
};


gulp.task('svg', function () {
    return gulp.src(svgPath.input)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                // $('[fill]').removeAttr('fill');
                // $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        // .pipe(svgSprite({
        //     mode: {
        //         symbol: {
        //             sprite: "sprite.svg"
        //         }
        //     }
        // }))
        .pipe(gulp.dest(svgPath.output));
});


//css
gulp.task('scss', function () { // Создаем таск scss
    return gulp.src('app/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(autoprefixer(['last 5 versions'], {cascade: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});

//webpack

gulp.task('webpack', function () {
    return gulp.src('app/js/src/*')
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest('app/js/'))
        .pipe(browserSync.reload({stream: true}))

});


gulp.task('watch', gulp.parallel(('browser-sync'), function () {
    gulp.watch('app/scss/**/*.scss', gulp.series('scss'));
    gulp.watch('app/js/**/*js', gulp.series('webpack'));
    gulp.watch("app/*.html").on('change', browserSync.reload);
}));

//build

gulp.task('clean', function (cn) {
    cn();
    del.sync('./dist');
});


gulp.task('html', function () {
    let secinjectSrc = gulp.src(['dist/css/**/*.min.css', 'dist/js/**/*.min.js'], {read: false});
    let secinjectOptions = {
        ignorePath: '/dist',
        addRootSlash: false
    };

    return gulp.src('./app/*.html')
        .pipe(inject(secinjectSrc, secinjectOptions))
        .pipe(gulp.dest('./dist'));

});

gulp.task('css', function () {

    return gulp.src('app/css/**/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: '.min',
            dirname: ""
        }))
        .pipe(gulp.dest('./dist/css'));

});


gulp.task('js', gulp.series( function () {

    return gulp.src('app/js/*.min.js')
        .pipe(gulp.dest('./dist/js'));
}));


gulp.task('img', function () {
    return gulp.src(['app/img/**/*', '!app/img/src/*'])
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [
                {
                    removeViewBox: true
                }
            ]

        }))
        //)
        .pipe(gulp.dest('dist/img'));
});


gulp.task('build', gulp.series('clean',  'js', 'css',  'html','img', function (cn) {
    cn();

}));


