import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  farmerId: String,
  title: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  imageURL: String,
  certifiedOrganic: Boolean
});

export default mongoose.model('Product', productSchema);
