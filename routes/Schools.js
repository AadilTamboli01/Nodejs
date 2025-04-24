const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { validateSchool } = require("../validators/schoolValidator");
const { calculateDistance } = require("../Utils/helper");

router.post("/addSchool", validateSchool, async (req, res) => {
  try {
    console.log("req.body = == ",req.body)
    const {id, name, address, latitude, longitude } = req.body;
     // Convert latitude and longitude to numbers
     const latitudeNum = parseFloat(latitude);
     const longitudeNum = parseFloat(longitude);
    console.log("the type of latitude = ",typeof latitudeNum,"type of longitude = ",typeof longitudeNum )
    console.log("id = ",id)

    const [result] = await pool.query(
      "INSERT INTO schools (id,name, address, latitude, longitude) VALUES (?, ?, ?, ?,?)",
      [id,name, address, latitudeNum, longitudeNum]
    );
    console.log("this is result , ",result)
    res.status(201).json({
      id: result.insertId,
      message: "School added successfully",
    });   
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/listSchools", async (req, res) => {
  try {
    

    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);
    
    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({ error: "Invalid or missing latitude or longitude parameters" });
    }


    console.log("this is userlat",userLat,"this is type of userlat",typeof userLat)

    const [schools] = await pool.query("SELECT * FROM schools");
       

    const schoolsWithDistance = schools.map((school) => {
      const latitude = parseFloat(school.latitude);
      const longitude = parseFloat(school.longitude);
    
      return {
        ...school,
        distance: calculateDistance(userLat, userLon, latitude, longitude),
      };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
