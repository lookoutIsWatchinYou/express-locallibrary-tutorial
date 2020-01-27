
var Genre = require('../models/genre');
var Book = require('../models/book');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');
const validator = require('express-validator');
var moment=require("moment");
var debug= require('debug')('genre');
debug("Heyyyy genre controller here");
// Display list of all Genre.
exports.genre_list = function(req, res,next) {

    Genre.find()
      .sort([['genre', 'ascending']])
      .exec(function (err, list_genres) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('genre_list', { title: 'Genre List', genre_list: list_genres });
      });
  };

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id)
              .exec(callback);
        },

        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found sorry');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
    });

};
// Display Genre create form on GET.
exports.genre_create_get = function(req, res, next) {     
    res.render('genre_form', { title: 'Create Genre' });
  };

// Handle Genre create on POST.
// Handle Genre create on POST.
exports.genre_create_post =  [
   
    // Validate that the name field is not empty.
    validator.body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (escape) the name field.
    validator.sanitizeBody('name').escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validator.validationResult(req);
  
      // Create a genre object with escaped and trimmed data.
      var genre = new Genre(
        { name: req.body.name }
      );
  
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Genre with same name already exists.
        Genre.findOne({ 'name': req.body.name })
          .exec( function(err, found_genre) {
             if (err) { return next(err); }
  
             if (found_genre) {
               // Genre exists, redirect to its detail page.
               res.redirect(found_genre.url);
             }
             else {
  
               genre.save(function (err) {
                 if (err) { return next(err); }
                 // Genre saved. Redirect to genre detail page.
                 res.redirect(genre.url);
               });
  
             }
  
           });
      }
    }
  ];
// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res, next) {

  async.parallel({
    genre: function(callback) {
        Genre.findById(req.params.id).exec(callback);
    },
    books: function(callback) {
        Book.find({ 'genre': req.params.id }).exec(callback);
      },
}, function(err, results) {
    if (err) { return next(err); }
    if (results.genre==null) { // No results.
        debug("No genre???");

        res.redirect('/catalog/genre');
    }
    debug("should be here???");
    debug("wtf we made it here???" );

    // Successful, so render.
    res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, books: results.books} );


})};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res,next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.body.genreid).exec(callback);
    },
    books: function(callback) {
      Book.find({ 'genre': req.body.genreid }).exec(callback);

    },
}, function(err, results) {
    if (err) { return next(err); }
    // Success
    if (results.books.length > 0) {
        // Genre has books. Render in same way as for GET route.

        res.render('genre_delete', { title: 'Delete Genre', books: results.books, genre: results.genre } );

        return;

    }
    else {

        // genre has no books. Delete object and redirect to the list of Genres.
        Genre.findByIdAndRemove(req.body.genreid, function deleteGenre(err) {
            if (err) {  debug("broken delete"); return next(err); }
            // Success - go to book list
            res.redirect('/catalog/genres/');
            debug("wtf we made it here???");

        ;})
    }
})
;};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
 // Get genres for form.
    //Grabbing Genre Schema and then using the file name eg: Genre as thats what pathed too when we defined the variable at the start
    Genre.findById(req.params.id, function (err, genre) {//gets the current Genre using the id  and displays  the author details in the form
      if (err) { return next(err); }
      if (genre == null) { // No results.
          var err = new Error('Author not found');
          err.status = 404;
          return next(err);
      }
      // Success.
      res.render('genre_form', { title: 'Update Genre', genre: genre });
  
  });};

// Handle Genre update on POST.

exports.genre_update_post = [

  // Validate fields.
  body('name', 'First name must not be empty.').isLength({ min: 1 }).trim(),

  // Sanitize fields.
  sanitizeBody('name').escape(),


  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a Author object with escaped/trimmed data and old id.
      var genre = new Genre(
        { name: req.body.name,
          _id:req.params.id //This is required, or a new ID will be assigned!
         });

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          // Get all genres  for form.
          async.parallel({
              genre: function(callback) {
                  Genre.find(callback);
              },
          }, function(err, results) {
              if (err) { return next(err); }

              res.render('genre_form', { title: 'Update Genre',genre: results.genre,  errors: errors.array() });
          });
          return;
      }
      else {
          // Data from form is valid. Update the record.
          Genre.findByIdAndUpdate(req.params.id, genre,{}, function (err,thegenre) {
              if (err) { return next(err); }
                 // Successful - redirect to genre detail page.
                 res.redirect(thegenre.url);
              });
      }
  }
];