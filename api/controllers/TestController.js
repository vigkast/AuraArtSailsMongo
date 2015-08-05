/**
 * TestController
 *
 * @description :: Server-side logic for managing tests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var lwip = require('lwip');

module.exports = {
    resize: function (req, res) {

        function showimage(path) {
            var image = sails.fs.readFileSync(path);
            res.set('Content-Type', 'image/png');
            res.send(image);
        }


        lwip.open('./uploads/demo.png', function (err, image) {

            // check err...
            // manipulate image:
            image.resize(1000, 1000, "lanczos", function (err, image) {

                // check err...
                // manipulate some more:
                image.rotate(45, 'white', function (err, image) {

                    // check err...
                    // encode to jpeg and get a buffer object:
                    image.toBuffer('png', function (err, buffer) {

                        sails.fs.writeFileSync('./uploads/demo2.png', buffer);
                        showimage('./uploads/demo2.png');
                        // check err...
                        // save buffer to disk / send over network / etc.

                    });

                });

            });

        });
    }
};