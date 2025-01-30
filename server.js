// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT=5000;
const cors = require('cors');
app.use(express.json());
app.use(cors()); 


//Mongo db connectivity
const mongourl="mongodb://localhost/fruitvegmarke"
mongoose.connect(mongourl)
.then(()=>{
	console.log("Database Connected")
	app.listen(PORT,()=>{
		console.log(
			`Server is running on port ${PORT}`
		);
		});


})





//schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
});


//model
const Product = mongoose.model('products', productSchema);//collection name ,schema


//post

app.post("/api/products",async(req,res)=>{
	const{name,type,description,price,image}=req.body;
	const newProduct=new Product({
		name: name,
        type: type,
        description: description,
        price: price,
        image: image,
	});
	const savedProduct=await newProduct.save();
	res.status(200).json(savedProduct);
})





//get

app.get('/api/products', async (req, res) => {
try {
	// Fetch all products from the database
	const allProducts = await Product.find();


	res.status(200).json(allProducts);
} catch (error) {
	console.error(error);
	res.status(500)
	.json({ error: 'Internal Server Error' });
}
});

//get by id
app.get("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving product", error });
    }
});





//delete by Id

app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully", deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
});

//Delete All
app.delete("/api/products", async (req, res) => {
    try {
        const deletedProducts = await Product.deleteMany({});
        res.status(200).json({ message: "All products deleted successfully", deletedProducts });
    } catch (error) {
        res.status(500).json({ message: "Error deleting products", error });
    }
});



//Update BY iD

app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const { name, type, description, price, image } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, type, description, price, image },
            { new: true }  // to return the updated document
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
});



//Schema
const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: true },
})


//model
const Customer = mongoose.model('Customer', customerSchema);


//post
app.post("/api/customers", async (req, res) => {
    const { name, gender, phone, email, address } = req.body;
    try {
        const newCustomer = new Customer({
            name, gender, phone, email, address
        });
        const savedCustomer = await newCustomer.save();
        res.status(200).json(savedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error saving customer", error });
    }
});

// GET route to fetch all customers
app.get("/api/customers", async (req, res) => {
    try {
        const allCustomers = await Customer.find();
        res.status(200).json(allCustomers);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving customers", error });
    }
});

// GET route to fetch a customer by ID
app.get("/api/customers/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving customer", error });
    }
});

// DELETE route to delete a customer by ID
app.delete("/api/customers/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customer", error });
    }
});


// DELETE 
app.delete("/api/customers", async (req, res) => {
    try {
        const deletedCustomers = await Customer.deleteMany({});
        res.status(200).json({ message: "All customers deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting customers", error });
    }
});


// PUT 
app.put("/api/customers/:id", async (req, res) => {
    const { id } = req.params;
    const { name, gender, phone, email, address } = req.body;
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            { name, gender, phone, email, address },
            { new: true }  // Returns the updated customer
        );
        if (!updatedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ message: "Error updating customer", error });
    }
});


//Order databse

//schema

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    cartItems: [{
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 }
    }],
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
  });


  //model
  const Order = mongoose.model('Order', orderSchema);

 


//post
app.post('/api/orders', async (req, res) => {
  const { name, gender, phone, email, address, cartItems, totalPrice } = req.body;

  try {
    const newOrder = new Order({
      name,
      gender,
      phone,
      email,
      address,
      cartItems,
      totalPrice,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error });
  }
});



// Get Order by ID
app.get('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: 'Error fetching order', error });
    }
  });



  //put

app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Error updating order status', error });
    }
  });


  // Delete Order
app.delete('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedOrder = await Order.findByIdAndDelete(id);
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error);
      res.status(500).json({ message: 'Error deleting order', error });
    }
  });
  

 // GET - Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find(); 
    res.status(200).json(orders); 
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});



app.delete('/api/orders', async (req, res) => {
    try {
      const result = await Order.deleteMany({}); 
      res.status(200).json({ message: 'All orders deleted successfully', result });
    } catch (error) {
      console.error('Error deleting all orders:', error);
      res.status(500).json({ message: 'Error deleting all orders', error });
    }
  });



  
  




