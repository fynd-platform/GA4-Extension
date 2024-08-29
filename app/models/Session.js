const mongoose = require('mongoose');
const mongo = require('../connections/mongo').host;

const SessionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: mongoose.Schema.Types.Mixed, // Allows storing any type of value
    expiresAt: { type: Date, index: { expires: 0 } }, // Optional field for expiration
    hash: { type: Map, of: mongoose.Schema.Types.Mixed }, // Map to store hash-like structures
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

module.exports = {
  SessionModel: mongo.model('session', SessionSchema, 'sessions'),
};
