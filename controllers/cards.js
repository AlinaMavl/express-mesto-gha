const mongoose = require('mongoose');
const Card = require('../models/card');

function readAllCards(req, res) {
  return Card.find()
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
}

const createCard = (req, res) => {
  const cardData = req.body;
  cardData.owner = req.user._id;

  return Card.create(cardData)
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

const likeCard = (req, res) => {
  const cardID = req.params.cardId;
  if (!mongoose.Types.ObjectId.isValid(cardID)) {
    return res.status(400).send({ message: 'Некорректный _id карточки' });
  }
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карта на найдена' });
      }
      res.status(200).send(card);
      return card;
    })
    .catch(() => res.status(500).send({ message: 'Server Error' }));
};

const dislikeCard = (req, res) => {
  const cardID = req.params.cardId;
  if (!mongoose.Types.ObjectId.isValid(cardID)) {
    return res.status(400).send({ message: 'Некорректный _id карточки' });
  }
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карта на найдена' });
      }
      res.status(200).send(card);
      return card;
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

const deleteCard = (req, res) => {
  const cardID = req.params.cardId;
  if (!mongoose.Types.ObjectId.isValid(cardID)) {
    return res.status(400).send({ message: 'Некорректный _id карточки' });
  }
  return Card.findByIdAndDelete(cardID)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(200).send(card);
    })
    .catch(() => res.status(500).send({ message: 'Ошибка по умолчанию' }));
};

module.exports = {
  readAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
