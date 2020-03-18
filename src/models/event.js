import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    date: {
      type: Date,
      required: true,
    },
    numAttendees: {
      type: Number,
      required: false,
    },
    list: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    foodAndDrinks: {
      type: String,
      required: false,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
