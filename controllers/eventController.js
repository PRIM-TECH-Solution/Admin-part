import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Event } from "../models/eventSchema.js";
import ErrorHandler from "../middlewares/error.js";

export const getAllEvents = catchAsyncErrors(async (req, res, next) => {
  const events = await Event.find({ expired: false });
  res.status(200).json({
    success: true,
    events,
  });
});

export const postEvent = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Event Organizer") {
    return next(
      new ErrorHandler("Event Organizer not allowed to access this resource.", 400)
    );
    
  }
  if (role === "User") {
    return next(
      new ErrorHandler("User not allowed to access this resource.", 400)
    );
    
  }
  const {
    title,
    description,
    category,
    city,
    location,
    date, 
    time,
  } = req.body;

  if (!title || !description || !category || !city || !location || !date || !time) {
    return next(new ErrorHandler("Please provide full event details.", 400));
  }

  res.status(200).json({
    success: true,
    message: "Event Posted Successfully!",
    postEvent,
  });
});

export const getEvents = catchAsyncErrors(async (req, res, next) => {
    
  const { _id } = req.user;
    const events = await Event.find({ "eventID.user": _id });
    res.status(200).json({
      success: true,
      events,
    });
});

export const updateEvent = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Event Organizer") {
    return next(
      new ErrorHandler("Event Organizer not allowed to access this resource.", 400)
    );
  }
  if (role === "User") {
    return next(
      new ErrorHandler("User not allowed to access this resource.", 400)
    );
  }
  
  const { id } = req.params;
  let event = await Event.findById(id);
  if (!event) {
    return next(new ErrorHandler("OOPS! Event not found.", 404));
  }
  event = await Event.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Event Updated Sucessfully!",
  });
});

export const deleteEvent = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Event Organizer") {
    return next(
      new ErrorHandler("Event Organizer not allowed to access this resource.", 400)
    );
  }
  if (role === "User") {
    return next(
      new ErrorHandler("User not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) {
    return next(new ErrorHandler("OOPS! Event not found.", 404));
  }
  await event.deleteOne();
  res.status(200).json({
    success: true,
    message: "Event Deleted!",
  });
});

export const getSingleEvent = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return next(new ErrorHandler("Event not found.", 404));
    }
    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    return next(new ErrorHandler(`Invalid ID / CastError`, 404));
  }
});
