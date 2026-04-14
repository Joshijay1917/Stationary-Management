import Product from "@/models/Product";
import Category from "@/models/Category";
import connectToDatabase from "./dbConnect";
import Transaction from "@/models/Transactions";

// The hardcoded MVP Shop ID
const SHOP_ID = 'shop_001';

// --------------------------------------------------------
// AI Helper Functions
// --------------------------------------------------------

export const checkStock = async (itemName: string) => {
  await connectToDatabase();

  // We use MongoDB $regex to do a case-insensitive search 
  // exactly like your old .includes() logic!
  return await Product.find({
    shop_id: SHOP_ID,
    $or: [
      { name: { $regex: itemName, $options: "i" } },
      // If you added 'shortName' to your Mongoose schema, uncomment the line below:
      // { shortName: { $regex: itemName, $options: "i" } } 
    ]
  });
};

export const getLowStock = async (threshold: number) => {
  await connectToDatabase();

  // $lte means "Less Than or Equal To" in MongoDB
  return await Product.find({
    shop_id: SHOP_ID,
    stock: { $lte: threshold }
  });
};

export const listCategoryItems = async (categoryName: string) => {
  await connectToDatabase();

  // 1. Find the category ignoring uppercase/lowercase
  const cat = await Category.findOne({
    shop_id: SHOP_ID,
    label: { $regex: new RegExp(`^${categoryName}$`, "i") }
  });

  if (!cat) return []; // If the category doesn't exist, return empty array

  // 2. Find all products that belong to this category's label
  return await Product.find({
    shop_id: SHOP_ID,
    category: cat.label
  });
};

export const getTodaySales = async () => {
  await connectToDatabase();

  // 1. Figure out what exactly midnight was this morning
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // 2. Ask MongoDB for all transactions from midnight until right now
  const todaysTxns = await Transaction.find({
    shop_id: SHOP_ID,
    createdAt: { $gte: startOfToday } // $gte means "Greater Than or Equal To"
  });

  // 3. Crunch the numbers using standard JavaScript!
  const revenue = todaysTxns.reduce((sum, txn) => sum + txn.total_amount, 0);
  const count = todaysTxns.length;

  return { revenue, count };
};