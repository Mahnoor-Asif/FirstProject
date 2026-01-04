import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  cnicNumber: { type: String, required: true },
  profilePhoto: { type: String, required: true },
  cnicFront: { type: String, required: true },
  cnicBack: { type: String, required: true },
  criminalClearance: { type: String }
});

const Provider = mongoose.model('Provider', providerSchema);
export default Provider;
