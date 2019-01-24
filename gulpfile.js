'use strict';

var gulp = require('gulp'),
    inject = require('gulp-inject'),
    scss = require('gulp-scss'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
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
    autoprefixer = require('gulp-autoprefixer');


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
var injectSrc = gulp.src(['app/css/**/*.css', 'app/js/**/*.js'], {read: false});
var injectOptions = {
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
    return gulp.src('app/img/src/resize/*.jpg')
        .pipe(imageResize({
            width: 50,
            height: 50,
            crop: true,
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
            ]
        }))
        .pipe(gulp.dest('app/img'));
});


gulp.task('sprite', function () {

    var spriteData = gulp.src('app/img/src/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        imgPath: '../img/icons/sprite.png',
        padding: 1
    }));

    var stylStream = spriteData.css
        .pipe(gulp.dest('app/scss/'));


    var imgStream = spriteData.img
        .pipe(gulp.dest('app/img/icons'));
    return spriteData;

});

var svgPath = {
    "input": "./app/img/src/sprite/*.svg",
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
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "sprite.svg"
                }
            }
        }))
        .pipe(gulp.dest(svgPath.output));
});


//css
gulp.task('scss', function () { // Создаем таск scss
    return gulp.src('app/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(autoprefixer(['last 15 versions', '> 0.1%'], {cascade: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}))
});


//js
gulp.task('js-steam', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('watch', gulp.parallel(('browser-sync'), function () {
    gulp.watch('app/scss/**/*.scss', gulp.series('scss'));
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch('app/js/**/*.js', gulp.series('js-steam'));
}));

//build

gulp.task('clean', function (cn) {
    cn();
    del.sync('./dist');
});


gulp.task('html', function (cf) {
    var secinjectSrc = gulp.src(['dist/css/**/*.min.css', 'dist/js/**/*.min.js'], {read: false});
    var secinjectOptions = {
        ignorePath: '/dist',
        addRootSlash: false
    };
    cf();
    gulp.src('./app/*.html')
        .pipe(inject(secinjectSrc, secinjectOptions))
        .pipe(gulp.dest('./dist'));

});

gulp.task('css', function (cf) {
    cf();
    return gulp.src('app/css/**/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: '.min',
            dirname: ""
        }))
        .pipe(gulp.dest('./dist/css'));

});

gulp.task('pre-js', function (cf) {
    cf();
    return gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('js', gulp.series('pre-js', function (cf) {
    cf();
    return gulp.src('app/js/**/*.min.js')
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


gulp.task('build', gulp.series('clean', 'css', 'js', 'img', 'html', function (cn) {
    cn();

}));


