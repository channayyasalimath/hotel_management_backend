const express = require("express");
const router = express.Router();

//importing jwt
const { jwtAuthMiddleware, generateToken } = require("../jwt");

//Person Model importing
const Person = require("../models/Person");

//Person Post method
// router.post("/signup", async function (req, res) {
//   try {
//     const data = req.body;
//     const newPerson = new Person(data);

//      //Password hashing is here
//     const response = await newPerson.save();
//     console.log("Data saved");
//     res.status(200).json(response);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ err: "Internal error" });
//   }
// });

router.post("/signup", async function (req, res) {
  try {
    const data = req.body;
    const newPerson = new Person(data);

    //Password hashing is here
    const response = await newPerson.save();
    console.log("Data saved");

    const payload = {
      id: response.id,
      username: response.username,
    };
    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is: ", token);
    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal error" });
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    //Extract username and password from request body
    const { username, password } = req.body;

    //find the user by username
    const user = await Person.findOne({ username: username });
    //if the user doesn't exist
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    //if user exist generate token
    const payload = {
      id: user.id,
      username: user.username,
    };
    const token = generateToken(payload);

    //return token as response
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal error" });
  }
});

//profile
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
  try{

    const userData= req.user;
    console.log("User Data", userData);

    const userId = userData.id;
    const user= await Person.findById(userId);

    res.status(200).json({user})

  }catch(err){
    console.log(err);
    res.status(500).json({err:"Internal server error"})
  }
})

//get All persons data
router.get("/", jwtAuthMiddleware, async function (req, res) {
  try {
    const data = await Person.find();
    console.log("Person Data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Internal error" });
  }
});

//get person workType
router.get("/:workType", async function (req, res) {
  try {
    const workType = req.params.workType;
    if (workType == "chef" || workType == "waiter" || workType == "manager") {
      const response = await Person.find({ work: workType });
      console.log("response fetched");
      res.status(200).json(response);
    } else {
      res.status(404).json("Invalid workType");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Invalid error" });
  }
});

//Update Person
router.put("/:id", async (req, res) => {
  try {
    const personId = req.params.id; //Extract the Id from the URL parameter
    const updatedPersonData = req.body; //Updated data for the person

    console.log(`Updating person with ID: ${personId}`);
    console.log(`Updated data: ${JSON.stringify(updatedPersonData)}`);
    const response = await Person.findByIdAndUpdate(
      personId,
      updatedPersonData,
      {
        new: true, //Return the updated document
        runValidators: true, //Run Mongoose validation
      }
    );

    if (!response) {
      res.status(404).json({ err: "Person not found" });
    }

    console.log("Data Updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Invalid error" });
  }
});

//Delete Person Data
router.delete("/:id", async (req, res) => {
  try {
    const personId = req.params.id;
    const response = await Person.findByIdAndDelete(personId);

    if (!response) {
      res.status(404).json("Person Not Found");
    } else {
      console.log("data Deleted");
      res.status(200).json({ message: "Person Deleted Successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "Invalid Error" });
  }
});

module.exports = router;


