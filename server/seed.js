import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// 🔹 Simple User Schema (adjust if you already have one)
const userSchema = new mongoose.Schema({
  name: String,
    email: String,
      password: String,
        role: {
            type: String,
                enum: ["admin", "worker", "user"],
                    default: "user"
                      }
                      });

                      const User = mongoose.model("User", userSchema);

                      // 🔹 Connect DB
                      const connectDB = async () => {
                        try {
                            await mongoose.connect(process.env.MONGO_URI);
                                console.log("MongoDB Connected");
                                  } catch (error) {
                                      console.error(error);
                                          process.exit(1);
                                            }
                                            };

                                            // 🔹 Seed Function
                                            const seedData = async () => {
                                              try {
                                                  console.log("Seeding data...");

                                                      // Clear old users
                                                          await User.deleteMany();

                                                              // Hash passwords
                                                                  const salt = await bcrypt.genSalt(10);

                                                                      const users = [
                                                                            {
                                                                                    name: "Admin User",
                                                                                            email: "admin@test.com",
                                                                                                    password: await bcrypt.hash("123456", salt),
                                                                                                            role: "admin"
                                                                                                                  },
                                                                                                                        {
                                                                                                                                name: "Worker User",
                                                                                                                                        email: "worker@test.com",
                                                                                                                                                password: await bcrypt.hash("123456", salt),
                                                                                                                                                        role: "worker"
                                                                                                                                                              },
                                                                                                                                                                    {
                                                                                                                                                                            name: "Normal User",
                                                                                                                                                                                    email: "user@test.com",
                                                                                                                                                                                            password: await bcrypt.hash("123456", salt),
                                                                                                                                                                                                    role: "user"
                                                                                                                                                                                                          }
                                                                                                                                                                                                              ];

                                                                                                                                                                                                                  await User.insertMany(users);

                                                                                                                                                                                                                      console.log("✅ Demo users created:");
                                                                                                                                                                                                                          console.log("Admin  → admin@test.com / 123456");
                                                                                                                                                                                                                              console.log("Worker → worker@test.com / 123456");
                                                                                                                                                                                                                                  console.log("User   → user@test.com / 123456");

                                                                                                                                                                                                                                      process.exit();
                                                                                                                                                                                                                                        } catch (error) {
                                                                                                                                                                                                                                            console.error(error);
                                                                                                                                                                                                                                                process.exit(1);
                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                  };

                                                                                                                                                                                                                                                  connectDB().then(seedData);