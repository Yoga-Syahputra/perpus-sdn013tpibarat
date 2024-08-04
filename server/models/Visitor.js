const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  kelas: {
    type: String,
    required: true,
  },
  tanggalKehadiran: {
    type: Date,
    required: true,
  },
  jamKehadiran: {
    type: String,
    required: true,
  },
  keterangan: {
    type: String,
    required: true,
  },
  tandaTangan: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Visitor", visitorSchema);
