const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ["Slip and Fall", "Toxic Spill", "Unsafe Storage", "Equipment Failure"], // Add more categories as needed
    required: true
  },
  description: { 
    type: String, 
    required: true 
  },
  creationDate: { 
    type: Date, 
    default: Date.now 
  }
});

const goodCatchSchema = new mongoose.Schema({
  site: { 
    type: String, 
    enum: ["Baldwin Park", "Carpinteria", "Boston", "Shenzhen", "Minnetonka"], 
    required: true 
  },
  department: { 
    type: String,
    enum: ["Warehouse", "Shop Floor", "HR", "Customer Service", "Front Office"],
    required: true 
  },
  area: { 
    type: String // Optional area field, can leave it blank if not applicable
  },
  creationUser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  events: [eventSchema] // Embedded events to capture incident details
});

module.exports = mongoose.model("GoodCatch", goodCatchSchema);