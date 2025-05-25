import mongoose from "mongoose";

// const subjectSchema = new mongoose.Schema({}, {strict: false});
// const Subject = mongoose.model('Subject', subjectSchema, 'subjects');
// export default Subject;

// const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  subject_name: String,
  icon: String
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;

