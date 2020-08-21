const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const path = require('path');

const compressImages = async (source, destination) => {
    await imagemin([source], {
        destination,
        plugins: [
            imageminPngquant({
                quality: [0.05, 0.1]
            })
        ]
    });
}

compressImages('./src/pictures/originalWidgetPics/accuWeather/*.png', './src/pictures/widgetPics/accuWeather')
  .then(() => compressImages('./src/pictures/originalWidgetPics/openWeather/*.png', './src/pictures/widgetPics/openWeather'))
  .then(() => compressImages('./src/pictures/originalWidgetPics/yahooWeather/*.png', './src/pictures/widgetPics/yahooWeather'))
