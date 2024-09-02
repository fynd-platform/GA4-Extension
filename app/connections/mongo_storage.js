const { BaseStorage } = require('fdk-extension-javascript/express/storage');

/**
 * MongoDBStorage extends BaseStorage to provide a MongoDB-backed storage mechanism.
 * It allows storing, retrieving, and managing key-value pairs with optional hash support.
 *
 * @param {Object} model - The Mongoose model to interact with MongoDB.
 * @param {string} prefix - A prefix for all keys to avoid collision.
 */
class MongoDBStorage extends BaseStorage {
  constructor(model, prefix) {
    super(prefix);
    this.model = model;
  }

  getPrefixKey(key) {
    return this.prefixKey + key;
  }

  /**
   * Retrieves the value associated with a key.
   *
   * @param {string} key - The key to retrieve the value for.
   * @returns {Promise<*>} The value associated with the key, or null if not found.
   */

  async get(key) {
    const doc = await this.model.findOne({ key: this.getPrefixKey(key) });
    return doc ? doc.value : null;
  }

  /**
   * Sets a value for a key.
   *
   * @param {string} key - The key to set the value for.
   * @param {*} value - The value to set.
   * @returns {Promise<void>}
   */
  async set(key, value) {
    await this.model.updateOne(
      { key: this.getPrefixKey(key) },
      { value },
      { upsert: true }
    );
  }

  /**
   * Sets a value for a key with an expiration time.
   *
   * @param {string} key - The key to set the value for.
   * @param {*} value - The value to set.
   * @param {number} ttl - Time to live in seconds.
   * @returns {Promise<void>}
   */
  async setex(key, value, ttl) {
    const expiresAt = new Date(Date.now() + ttl * 1000);
    await this.model.updateOne(
      { key: this.getPrefixKey(key) },
      { $set: { value, expiresAt } },
      { upsert: true }
    );
  }

  /**
   * Deletes a key.
   *
   * @param {string} key - The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    await this.model.deleteOne({ key: this.getPrefixKey(key) });
  }

  /**
   * Retrieves a hash value for a given key and hash key.
   *
   * @param {string} key - The key associated with the hash.
   * @param {string} hashKey - The hash key to retrieve the value for.
   * @returns {Promise<*>} The value associated with the hash key, or null if not found.
   */
  async hget(key, hashKey) {
    const doc = await this.model.findOne({ key: this.getPrefixKey(key) });
    return doc && doc.hash ? doc.hash[hashKey] : null;
  }

  /**
   * Sets a hash value for a given key and hash key.
   *
   * @param {string} key - The key associated with the hash.
   * @param {string} hashKey - The hash key to set the value for.
   * @param {*} value - The value to set for the hash key.
   * @returns {Promise<*>} The value that was set.
   */
  async hset(key, hashKey, value) {
    const doc = await this.model.findOneAndUpdate(
      { key: this.getPrefixKey(key) },
      { $set: { [`hash.${hashKey}`]: value } },
      { new: true, upsert: true }
    );
    return doc ? doc.hash[hashKey] : null;
  }

  /**
   * Retrieves all hash values for a given key.
   *
   * @param {string} key - The key to retrieve all hash values for.
   * @returns {Promise<Object|null>} An object containing all hash values, or null if not found.
   */
  async hgetall(key) {
    const doc = await this.model.findOne({ key: this.getPrefixKey(key) });
    return doc ? doc.hash : null;
  }
}

module.exports = {
  MongoDBStorage,
};
