const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
	{
		id: { type: String, required: true, unique: true },
		title: { type: String, required: true },
		description: { type: String },
		img: { type: String },
		price: { type: Number, required: true },
		reservation: { type: mongoose.Schema.Types.Mixed, default: null },
	},
	{
		collection: 'rooms',
		_id: false,
	},
);

module.exports = mongoose.model('Room', roomSchema);
