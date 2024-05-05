import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter the title!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    },
    description: {
      type: String,
      required: [true, "Please enter description of the event!"],
      minLength: [3, "Name must contain at least 3 Characters!"],
      },
      category: {
        type: String,
        required: [true, "Please enter the event category!"],
        minLength: [3, "Name must contain at least 3 Characters!"],
        },
  city: {
    type: String,
    required: [true, "Please enter the city!"],
    
  },
  location: {
    public_id: {
      type: String, 
      required: true,
    },
    url: {
      type: String, 
      required: true,
    },
  },
  date: {
    type: String,
    required: [true, "Please enter the date!"],
    validate: [validator.isDate, "Please provide a valid Date format!"],
  },
  time: {
    type: String,
    required: [true, "Please enter the time!"],
    validate: [validator.isTime, "Please provide a valid Time format!"],
  },
 
  organizerName: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    },
  organizerContactNo: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  organizerMail: {
    type: String,
    required: [true, "Please enter your Address!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  eventFlyer: {
    public_id: {
      type: String, 
      required: true,
    },
    url: {
      type: String, 
      required: true,
    },
  },
  applicantID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Event Organizer"],
      required: true,
    },
  },
  eventOrganizerID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Event Organizer"],
      required: true,
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);
