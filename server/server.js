const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("Mongo Connected"));
const UserSchema = new mongoose.Schema({ email: String, password: String, role: String });
const User = mongoose.model('User', UserSchema);
app.post('/api/auth/register', async (req,res)=>{
  const {email,password,role}=req.body;
  const hashed=await bcrypt.hash(password,10);
  const user=await User.create({email,password:hashed,role});
  res.json(user);
});
app.post('/api/auth/login', async (req,res)=>{
  const {email,password,client}=req.body;
  const user=await User.findOne({email});
  if(!user) return res.status(400).json({msg:"User not found"});
  if(user.role!==client) return res.status(403).json({msg:"You are not "+client});
  const isMatch=await bcrypt.compare(password,user.password);
  if(!isMatch) return res.status(400).json({msg:"Wrong password"});
  const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1d"});
  res.json({token,role:user.role,email:user.email});
});
app.get('/api/dashboard', (req,res)=>{
  const token=req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({msg:"No token"});
  try{
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    res.json({msg:"Welcome "+decoded.role,user:decoded});
  }catch(e){res.status(401).json({msg:"Invalid token"})}
});
app.listen(5000,'0.0.0.0',()=>console.log("Server on 5000"));
