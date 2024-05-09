const mysql = require("mysql");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
const { PrismaClient } = require("@prisma/client");
// const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "legacy_marker",
  port: "3306",
});

connection.connect(function (err) {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }

  console.log(
    "Connected to database with connection id: " + connection.threadId
  );
  // Send a success response when the connection is established
  app.set("dbConnected", true);
});

app.post("/register", (req, res) => {
  const { f_name, l_name, u_name, email, password } = req.body;

  // Check if the user email already exists
  const checkExistingEmailQuery = "SELECT * FROM legacy_users WHERE email = ?";
  connection.query(checkExistingEmailQuery, [email], (error, results) => {
    if (error) {
      console.error("Error checking existing email:", error);
      return res.status(500).json({ error: "Failed to register" });
    }

    if (results.length > 0) {
      // If email already exists, return an error response
      return res.status(400).json({ message: "Email address already exists" });
    }

    // If email doesn't exist, proceed with user registration
    const insertUserQuery =
      "INSERT INTO legacy_users (f_name, l_name, u_name, email, password) VALUES (?, ?, ?, ?, ?)";
    const values = [f_name, l_name, u_name, email, password];

    connection.query(insertUserQuery, values, (err, data) => {
      if (err) {
        console.error("Error registering user:", err);
        return res.status(500).json({ error: "Failed to register" });
      }
      // console.log("token-number", uniquetoken);
      return res.json(data);
    });
  });
});
// Login endpoint
app.post("/login", (req, res) => {
  const mysql =
    "SELECT * FROM legacy_users WHERE `email` = ? AND `password` = ?";
  connection.query(mysql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      return res.json("Failed to register");
    }
    if (data.length > 0) {
      return res.json("Successfully Login");
    } else {
      return res.json("Invalid email or password");
    }
  });
});

// Save address endpoint
app.post("/profile", (req, res) => {
  const {
    city,
    state,
    zip_code,
    apartment,
    s_address,
    email, // Include email in the request body
  } = req.body;
  const mysql =
    "UPDATE legacy_users SET s_address = ?, apartment = ?, city = ?, state = ?, zip_code = ? WHERE email = ?";
  const addressValues = [
    s_address,
    apartment,
    city,
    state,
    zip_code,
    email, // Include email in the values
  ];

  connection.query(mysql, addressValues, (err, data) => {
    if (err) {
      console.error("Failed to update address:", err);
      return res.status(500).json("Failed to update address");
    }
    console.log("Address updated successfully");
    return res.json("Address updated successfully");
  });
});
// Fetch address data
app.get("/fetch-addressData", async (req, res) => {
  try {
    const { email } = req.query;

    // Find the user based on the email address
    const user = await prisma.legacy_users.findFirst({
      where: { email: email },
      select: { user_id: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the retrieved user ID to fetch user details
    const userDetails = await prisma.legacy_users.findUnique({
      where: { user_id: user.user_id },
      select: {
        s_address: true,
        apartment: true,
        state: true,
        city: true,
        zip_code: true,
      },
    });

    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete phone number
app.delete("/delete-address", async (req, res) => {
  try {
    const { localEmail } = req.query;
    // Find phone number by index and email
    console.log(localEmail);
    const Deleteaddress = await prisma.legacy_users.findFirst({
      where: {
        email: localEmail, // Prisma IDs are 1-based, but array indexes are 0-based
      },
      select: {
        user_id: true,
        s_address: true,
        apartment: true,
        city: true,
        state: true,
        zip_code: true,
      },
    });
    console.log(Deleteaddress.user_id);
    // console.log(phoneNumber.email);
    // If phone number not found or email doesn't match, return unauthorized
    if (!Deleteaddress) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete the phone number from the database
    await prisma.legacy_users.update({
      where: {
        user_id: Deleteaddress.user_id,
      },
      data: {
        s_address: ``,
        apartment: ``,
        city: ``,
        state: ``,
        zip_code: ``,
      },
    });

    // Send success response
    return res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting Address:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// update Phone
app.post("/update-phone", (req, res) => {
  const {
    phone_number,
    email, // Include email in the request body
  } = req.body;
  const mysql = "UPDATE legacy_users SET phone_number = ? WHERE email = ?";
  const addressValues = [
    phone_number,
    email, // Include email in the values
  ];

  connection.query(mysql, addressValues, (err, data) => {
    if (err) {
      console.error("Failed to update address:", err);
      return res.status(500).json("Failed to update address");
    }
    console.log("Address updated successfully");
    return res.json("Address updated successfully");
  });
});
// fetch Phone
app.get("/fetch-numbers", async (req, res) => {
  try {
    const { email } = req.query;

    // Find the user based on the email address
    const user = await prisma.legacy_users.findFirst({
      where: { email: email },
      select: { user_id: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the retrieved user ID to fetch user details
    const userDetails = await prisma.legacy_users.findUnique({
      where: { user_id: user.user_id },
      select: {
        phone_number: true,
      },
    });

    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete phone number
app.delete("/delete-number", async (req, res) => {
  try {
    const { localEmail } = req.query;
    // Find phone number by index and email
    console.log(localEmail);
    const phoneNumber = await prisma.legacy_users.findFirst({
      where: {
        email: localEmail, // Prisma IDs are 1-based, but array indexes are 0-based
      },
      select: {
        user_id: true,
        phone_number: true,
      },
    });
    console.log(phoneNumber.user_id);
    // console.log(phoneNumber.email);
    // If phone number not found or email doesn't match, return unauthorized
    if (!phoneNumber.phone_number) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete the phone number from the database
    await prisma.legacy_users.update({
      where: {
        user_id: phoneNumber.user_id,
      },
      data: {
        phone_number: ``,
      },
    });

    // Send success response
    return res.json({ message: "Phone number deleted successfully" });
  } catch (error) {
    console.error("Error deleting phone number:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// update Email
app.post("/update-email", (req, res) => {
  const {
    alt_email,
    email, // Include email in the request body
  } = req.body;
  const mysql = "UPDATE legacy_users SET alt_email = ? WHERE email = ?";
  const addressValues = [
    alt_email,
    email, // Include email in the values
  ];
  connection.query(mysql, addressValues, (err, data) => {
    if (err) {
      console.error("Failed to update address:", err);
      return res.status(500).json("Failed to update address");
    }
    console.log("email updated successfully");
    return res.json("email updated successfully");
  });
});
// fetch emails from database
app.get("/fetch-emails", async (req, res) => {
  try {
    const { email } = req.query;

    // Find the user based on the email address
    const user = await prisma.legacy_users.findFirst({
      where: { email: email },
      select: { user_id: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the retrieved user ID to fetch user details
    const userDetails = await prisma.legacy_users.findUnique({
      where: { user_id: user.user_id },
      select: { alt_email: true },
    });

    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to delete phone number
app.delete("/delete-emails", async (req, res) => {
  try {
    const { localEmail } = req.query;
    // Find phone number by index and email
    console.log(localEmail);
    const fetchEmails = await prisma.legacy_users.findFirst({
      where: {
        email: localEmail, // Prisma IDs are 1-based, but array indexes are 0-based
      },
      select: {
        user_id: true,
        alt_email: true,
      },
    });
    console.log(fetchEmails.user_id);
    // console.log(phoneNumber.email);
    // If phone number not found or email doesn't match, return unauthorized
    if (!fetchEmails.alt_email) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete the phone number from the database
    await prisma.legacy_users.update({
      where: {
        user_id: fetchEmails.user_id,
      },
      data: {
        alt_email: ``,
      },
    });

    // Send success response
    return res.json({ message: "Phone number deleted successfully" });
  } catch (error) {
    console.error("Error deleting phone number:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// udpate new pass
app.post("/update-pass", (req, res) => {
  const { email, newPassword } = req.body;
  const mysql = "UPDATE legacy_users SET password = ? WHERE email = ?";
  const passwordValues = [newPassword, email];
  connection.query(mysql, passwordValues, (err, data) => {
    if (err) {
      console.error("Failed to update password:", err);
      return res.status(500).json("Failed to update password");
    }
    console.log("Request Body:", req.body);
    return res.json("Password updated successfully");
  });
});
// udpate new pass
app.post("/update-names", (req, res) => {
  const { email, name_f_name, name_l_name } = req.body;
  const mysql =
    "UPDATE legacy_users SET f_name = ?, l_name = ? WHERE email = ?";
  const NameValues = [name_f_name, name_l_name, email];
  connection.query(mysql, NameValues, (err, data) => {
    if (err) {
      console.error("Failed to update password:", err);
      return res.status(500).json("Failed to update password");
    }
    console.log("Request Body:", req.body);
    return res.json("Names updated successfully");
  });
});
// fetch Names yeh endpoint haii db se data get ho raha haii yhn mysql
app.get("/FetchNames", async (req, res) => {
  try {
    const { email } = req.query;

    // Find the user based on the email address
    const user = await prisma.legacy_users.findFirst({
      where: { email: email },
      select: { user_id: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the retrieved user ID to fetch user details
    const userDetails = await prisma.legacy_users.findUnique({
      where: { user_id: user.user_id },
      select: { f_name: true, l_name: true, u_name: true },
    });

    res.json(userDetails);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Set up multer for handling profile photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles"); // Specify the directory where uploaded images will be saved
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, "profilePhoto-" + Date.now() + ext); // Generate a unique filename for the uploaded image
  },
});

const uploadProfilePhoto = multer({ storage: storage }).single("profilePhoto");

// Profile photo upload endpoint
app.post("/ChangeProfile", (req, res) => {
  uploadProfilePhoto(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error occurred
      console.error("Multer error:", err);
      return res.status(500).json({ error: "Error uploading profile photo" });
    } else if (err) {
      // Other error occurred
      console.error("Error uploading profile photo:", err);
      return res.status(500).json({ error: "Error uploading profile photo" });
    }

    // Profile photo uploaded successfully
    // Save the file path in the database for the respective user
    const profilePhotoPath = req.file.path;
    const email = req.body.email; // Change this to the actual email of the user

    const sql = "UPDATE legacy_users SET profile_photo_url = ? WHERE email = ?";
    const values = [profilePhotoPath, email];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Failed to update profile photo path in database:", err);
        return res.status(500).json({
          error: "Failed to update profile photo path in database",
        });
      }

      console.log("Profile photo path updated in database");
      return res.json({ profilePhotoPath: profilePhotoPath });
    });
  });
});
// Route for fethcing the profile path of a user
app.get("/profile-photo-url", async (req, res) => {
  try {
    const { email } = req.query;

    // Fetch user details from the database
    const user = await prisma.legacy_users.findFirst({
      where: {
        email: email,
      },
      select: {
        user_id: true,
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the retrieved user ID to fetch user details
    const userDetails = await prisma.legacy_users.findUnique({
      where: { user_id: user.user_id },
      select: { profile_photo_url: true },
    });

    // Read the profile picture from the file system
    const imageData = fs.readFileSync(userDetails.profile_photo_url);

    // Send the image data in the response
    return res.send(imageData);
  } catch (error) {
    console.error("Error fetching profile photo URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch the image of profile photo URL for a user
// Fetch the images of profile photo URL and cover photo URL for a user
app.get("/main-profile-url", async (req, res) => {
  try {
    const { email } = req.query;

    // Fetch user details from the database
    const user = await prisma.legacy_users.findFirst({
      where: {
        email: email,
      },
      select: {
        user_id: true,
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the retrieved user ID to fetch user details
    const userDetails = await prisma.legacy_users.findUnique({
      where: { user_id: user.user_id },
      select: {
        profile_photo_url: true,
        cover_photo_url: true,
        f_name: true,
        l_name: true,
        u_name: true,
        user_id: true,
      },
    });

    const profilePhotoBuffer = fs.readFileSync(userDetails.profile_photo_url);
    const coverPhotoBuffer = fs.readFileSync(userDetails.cover_photo_url);
    const FirstName = userDetails.f_name;
    const LastName = userDetails.l_name;
    const UserName = userDetails.u_name;
    const Userid = userDetails.user_id;
    // Send both images in the response
    return res.json({
      profile_photo_url: profilePhotoBuffer.toString("base64"),
      cover_photo_url: coverPhotoBuffer.toString("base64"),
      f_name: FirstName,
      l_name: LastName,
      u_name: UserName,
      u_id: Userid,
    });
  } catch (error) {
    console.error("Error fetching profile photo URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cover updated in database
// Set up multer for handling profile photo uploads
const coverStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/cover"); // Specify the directory where uploaded images will be saved
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, "coverPhoto-" + Date.now() + ext);
  },
});

const uploadCoverPhoto = multer({ storage: coverStorage }).single("coverphoto");

// Profile photo upload endpoint
app.post("/update-CoverPhoto", (req, res) => {
  uploadCoverPhoto(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error occurred
      console.error("Multer error:", err);
      return res.status(500).json({ error: "Error uploading profile photo" });
    } else if (err) {
      // Other error occurred
      console.error("Error uploading profile photo:", err);
      return res.status(500).json({ error: "Error uploading profile photo" });
    }

    // Cover photo uploaded successfully
    // Save the file path in the database for the respective user
    const CoverPhotoPath = req.file.path;
    const email = req.body.email; // Change this to the actual email of the user

    const sql = "UPDATE legacy_users SET cover_photo_url = ? WHERE email = ?";
    const CoverValues = [CoverPhotoPath, email];

    connection.query(sql, CoverValues, (err, result) => {
      if (err) {
        console.error("Failed to update Cover photo path in database:", err);
        return res.status(500).json({
          error: "Failed to update Cover photo path in database",
        });
      }

      console.log("Cover photo path updated in database");
      return res.json({ CoverPhotoPath: CoverPhotoPath });
    });
  });
});
// Route for fethcing the cover path of a user
app.get("/cover-photo-url", async (req, res) => {
  try {
    const { email } = req.query;

    // Fetch user details from the database
    const user = await prisma.legacy_users.findFirst({
      where: {
        email: email,
      },
      select: {
        user_id: true,
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the retrieved user ID to fetch user details
    const userDetails = await prisma.legacy_users.findUnique({
      where: { user_id: user.user_id },
      select: { cover_photo_url: true },
    });

    // Read the profile picture from the file system
    const imageData = fs.readFileSync(userDetails.cover_photo_url);

    // Send the image data in the response
    return res.send(imageData);
  } catch (error) {
    console.error("Error fetching cover photo URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(8081, () => {
  console.log(`Server is running on port 8081`);
});

// Set up multer for handling profile photo uploads
const marker_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/markers"); // Specify the directory where uploaded images will be saved
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, "markerprofile-" + Date.now() + ext); // Generate a unique filename for the uploaded image
  },
});

const uploadMarker_profile = multer({ storage: marker_storage }).single(
  "marker_profile"
);

// Profile photo upload endpoint
app.post("/update-marker", async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      uploadMarker_profile(req, res, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Profile photo uploaded successfully
    // Save the file path in the database for the respective user
    const marker_profile_path = req.file.path;
    const mark_name = req.body.m_name;

    const { email } = req.query;

    // Fetch user details from the database
    const getUserId = await prisma.legacy_users.findFirst({
      where: {
        email: email,
      },
      select: {
        user_id: true,
      },
    });

    const user = await prisma.lm_marker.create({
      data: {
        user_id: getUserId.user_id,
        m_profile: marker_profile_path,
        m_name: mark_name,
      },
    });

    console.log("Marker Created Sucessfully");
    return res.json({
      m_profile: marker_profile_path,
      m_name: mark_name,
    });
  } catch (err) {
    console.error("Error uploading profile photo:", err);
    return res.status(500).json({ error: "Error uploading profile photo" });
  }
});
// Route for fethcing the profile path of a user
app.get("/update-marker-url", async (req, res) => {
  try {
    const { email } = req.query;

    // Fetch user details from the database
    const user = await prisma.legacy_users.findFirst({
      where: {
        email: email,
      },
      select: {
        user_id: true,
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Use the retrieved user ID to fetch user details
    const marker_id = await prisma.lm_marker.findFirst({
      where: { user_id: user.user_id },
      select: { m_id: true },
    });
    const marker_pictur = await prisma.lm_marker.findUnique({
      where: { m_id: marker_id.m_id },
      select: { m_profile: true, m_name: true, createdAt: true },
    });

    // Read the profile picture from the file system and encode it as Base64
    const imageData = fs.readFileSync(marker_pictur.m_profile, {
      encoding: "base64",
    });

    // Send the image data and other details in the response
    return res.json({
      marker_profile: imageData,
      marker_name: marker_pictur.m_name,
      createdAt: marker_pictur.createdAt,
      marker_id: marker_id.m_id,
    });
  } catch (error) {
    console.error("Error fetching marker photo URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
