import mongoose from 'mongoose';

import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [isEmail, 'No valid email address provided.'],
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 42,
  },
  twitter: {
    type: String,
    required: false,
  },
  verified: {
    type: Boolean,
    required: false,
  },
  recovered: {
    type: Boolean,
    required: false,
  },
  testStatus: {
    type: String,
    required: false,
  },
  symptoms: {
    type: String,
    required: false,
  },
  symptomsOnset: {
    type: Date,
    required: false
  },
  country: {
    type: String,
    required: false,
  },
  isolated: {
    type: Boolean,
    required: false,
  },
  source: {
    type: String,
    required: false,
  },
  anonymized: {
    type: Boolean,
    required: false,
  },
  role: {
    type: String,
  },
});

userSchema.statics.findByLogin = async function(login) {
  let user = await this.findOne({
    username: login,
  });

  if (!user) {
    user = await this.findOne({ email: login });
  }

  return user;
};

userSchema.pre('remove', function(next) {
  this.model('Message').deleteMany({ userId: this._id }, next);
});

userSchema.pre('save', async function() {
  this.password = await this.generatePasswordHash();
});

userSchema.methods.generatePasswordHash = async function() {
  const saltRounds = 10;
  return await bcrypt.hash(this.password, saltRounds);
};

userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
