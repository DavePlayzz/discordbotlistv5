const express = require('express');
const r = require('../rethinkdb');
const checkParamsLength = require('../middleware/checkParamsLength');
const categories = require('../data/categories.json');

const router = express.Router();

router
  .get('/bots', (req, res, next) => {
    r.table('bots')
      .merge(bot => r.branch(bot('contents').contains(contents =>
        contents('locale').eq(res.getLocale())
      ), {
        random: bot('random').add(10)
      }, {}))
      .without('token')
      .then((bots) => {
        res.json({
          ok: true,
          data: bots
        });
      })
      .catch((err) => {
        next(err);
      });
  })
  .get('/bots/category/:category', checkParamsLength, (req, res, next) => {
    r.table('bots')
      .filter({
        category: req.params.category
      })
      .merge(bot => r.branch(bot('contents').contains(contents =>
        contents('locale').eq(res.getLocale())
      ), {
        random: bot('random').add(10)
      }, {}))
      .default([])
      .without('token')
      .then((bots) => {
        res.json({
          ok: true,
          data: bots
        });
      })
      .catch((err) => {
        next(err);
      });
  })
  .get('/bots/id/:id', checkParamsLength, (req, res, next) => {
    r.table('bots')
      .get(req.params.id)
      .merge(bot => r.branch(bot('contents').contains(contents =>
        contents('locale').eq(res.getLocale())
      ), {
        random: bot('random').add(10)
      }, {}))
      .merge(bot => ({
        reviews: r.table('reviews')
          .filter({
            bot: bot('id')
          })
          .default([])
          .without('id')
          .coerceTo('array')
      }))
      .default({})
      .without('token')
      .then((bot) => {
        if (!bot.id) res.status(404);
        res.json({
          ok: !!bot.id,
          data: bot
        });
      })
      .catch((err) => {
        next(err);
      });
  })
  .get('/categories', (req, res) => {
    res.json({
      ok: true,
      data: categories
    });
  })
  .get('/oauth', (req, res) => {
    
  })
  .use((req, res) => {
    res.status(404).json({
      ok: false,
      message: res.__('errors.api.404')
    });
  })
  .use((err, req, res, next) => { // eslint-disable-line
    if (err) {
      res.status(500).json({
        ok: false,
        message: res.__('errors.api.500'),
        data: err.stack
      });
    } else {
      res.status(500).json({
        ok: false,
        message: res.__('errors.api.500')
      });
    }
  });

module.exports = router;
