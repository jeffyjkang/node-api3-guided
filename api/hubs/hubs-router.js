const express = require('express');
const {
  checkHubId,
  checkHubPayload,
  checkMessagePayload
} = require('./hubs-middleware');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

router.get('/', (req, res, next) => {
  Hubs.find(req.query)
    .then(hubs => {
      // throw new Error('bad request')
      res.status(200).json(hubs);
    })
    .catch(next);
    // .catch(error => {
    //   // log error to server
    //   console.log(error);
    //   res.status(500).json({
    //     message: 'Error retrieving the hubs',
    //   });
    // });
});

router.get('/:id', checkHubId, (req, res, next) => {
  res.json(req.hub);
  // Hubs.findById(req.params.id)
  //   .then(hub => {
  //     if (hub) {
  //       res.status(200).json(hub);
  //     } else {
  //       res.status(404).json({ message: 'Hub not found' });
  //     }
  //   })
  //   .catch(next);
    // .catch(error => {
    //   // log error to server
    //   console.log(error);
    //   res.status(500).json({
    //     message: 'Error retrieving the hub',
    //   });
    // });
});

router.post('/', checkHubPayload, (req, res, next) => {
  Hubs.add(req.body)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(next);
    // .catch(error => {
    //   // log error to server
    //   console.log(error);
    //   res.status(500).json({
    //     message: 'Error adding the hub',
    //   });
    // });
});

router.delete('/:id', checkHubId, (req, res, next) => {
  Hubs.remove(req.params.id)
    .then(() => {
      // if (count > 0) {
        res.status(200).json({ message: 'The hub has been nuked' });
      // }
      // else {
      //   res.status(404).json({ message: 'The hub could not be found' });
      // }
    })
    .catch(next);
    // .catch(error => {
    //   // log error to server
    //   console.log(error);
    //   res.status(500).json({
    //     message: 'Error removing the hub',
    //   });
    // });
});

router.put('/:id', checkHubId, checkHubPayload, (req, res, next) => {
  Hubs.update(req.params.id, req.body)
    .then(hub => {
      // if (hub) {
        res.status(200).json(hub);
      // }
      // else {
      //   res.status(404).json({ message: 'The hub could not be found' });
      // }
    })
    .catch(next);
    // .catch(error => {
    //   // log error to server
    //   console.log(error);
    //   res.status(500).json({
    //     message: 'Error updating the hub',
    //   });
    // });
});

router.get('/:id/messages', checkHubId, (req, res, next) => {
  Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(next);
    // .catch(error => {
    //   // log error to server
    //   console.log(error);
    //   res.status(500).json({
    //     message: 'Error getting the messages for the hub',
    //   });
    // });
});

router.post(
  '/:id/messages',
  checkHubId,
  checkMessagePayload,
  (req, res, next) => {
    const messageInfo = { ...req.body, hub_id: req.params.id };

    Messages.add(messageInfo)
      .then(message => {
        res.status(210).json(message);
      })
      .catch(next);
      // .catch(error => {
      //   // log error to server
      //   console.log(error);
      //   res.status(500).json({
      //     message: 'Error adding message to the hub',
      //   });
      // });
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    custom: 'something went wrong in the hubs router',
    message: err.message,
    stack: err.stack
  });
});

module.exports = router;
