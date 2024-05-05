import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Event } from "../models/eventSchema.js";
// import cloudinary from "cloudinary";
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dmlw1umyl', 
  api_key: '731262481795942', 
  api_secret: 'yO-yP2qXNbREhARJXzGnKu7jxq8' 
});

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "User") {
    return next(
      new ErrorHandler("User not allowed to access this resource.", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Flyer File Required!", 400));
  }
  
  const { flyer } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(flyer.mimetype)) {
    return next(
      new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
    );
  }
  /////
  // console.log("check0");
  //let cloudinaryResponse;
  // let pid;
  
    const cloudinaryResponse = await cloudinary.uploader.upload(flyer.tempFilePath, { public_id: "malsheeee" });
  
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload Flyer to Cloudinary", 500));
    }
  
    // Log public ID and secure URL to console
    // console.log("Public ID:", cloudinaryResponse.public_id);
    // console.log("Secure URL:", cloudinaryResponse.secure_url);
  


  /////
  // const cloudinaryResponse = await cloudinary.uploader.upload(
  //   resume.tempFilePath
  // );
  

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload Flyer to Cloudinary", 500));
  }
  const { title,
    description,
    category,
    city,
    location,
    date, 
    time,
    eventFlyer,
    ornizerName,
    organizerContactNo,
    organizerMail,
   } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Event Organizer", 
  };  
  if (!eventId) {
    return next(new ErrorHandler("Event not found!", 404));
  }
  const eventDetails = await Event.findById(eventId);
  if (!eventDetails) {
    return next(new ErrorHandler("Event not found!", 404));
  }

  const eventOrganizerID = {
    user: eventDetails.postedBy,
    role: "Event Organizer",
  };
  if (
    !title ||
    !description ||
    !category ||
    !city ||
    !location ||
    !date ||
    !time ||
    !eventFlyer ||
    !ornizerName ||
    ! organizerContactNo ||
    ! organizerMail
  ) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }
  // console.log("id" +cloudinaryResponse.public_id );
  // console.log("id" +cloudinaryResponse.secure_url );

  const application = await Application.create({
    title,
    description,
    category,
    city,
    location,
    date, 
    time,
    eventFlyer,
    ornizerName,
    organizerContactNo,
    organizerMail,
    eventFlyer: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Application Submitted!",
    application,
  });
});

export const eventOrganizerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "User") {
      return next(
        new ErrorHandler("User not allowed to access this resource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "eventOrganizerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const adminGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "User") {
      return next(
        new ErrorHandler("User not allowed to access this resource.", 400)
      );
    }
    if (role === "Event Organizer") {
      return next(
        new ErrorHandler("Event Organizer not allowed to access this resource.", 400)
      );
    }
    
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const DeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "User") {
      return next(
        new ErrorHandler("User not allowed to access this resource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application Deleted!",
    });
  }
);
