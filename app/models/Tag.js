const mongoose = require('mongoose');
const mongo = require('../connections/mongo').host;

const TagSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
    },
    company_id: {
      type: String,
      required: true,
      immutable: true,
    },
    script_id: {
      // tag _id stored in Fynd's system
      type: mongoose.Schema.Types.ObjectId,
    },
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },
    ga_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

TagSchema.index({
  application: 1,
  company_id: 1,
});

TagSchema.statics.removeTagsByCompanyId = async function removeTagsByCompanyId(
  companyId
) {
  try {
    if (!companyId) throw new Error('Company ID is required');
    await this.deleteMany({ company_id: companyId });
  } catch (error) {
    throw new Error(error);
  }
};
module.exports = mongo.model('tag', TagSchema, 'tags');
