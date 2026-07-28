const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');

async function register(req,res){
    const{name,email,password} = req.body;

    const existingUser = await prisma.user.findUnique({where: {email}});
    if(existingUser){
        return res.status(400).json({message: "Email already registered"});
    }

    const hashedPassword = await bcrypt.hash(password,10);
    {/**10 is the salt rounds(cost factor),higher = more secure but slower */}
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    });
}

async function login(req,res){
    const {email,password} = req.body;

    const user = await prisma.user.findUnique({where: {email}});
    if(!user){
        return res.status(401).json({message: "Invalid email or password"});
    }

    {/**You never decrypt the stored hash; you hash-compare the attempt against it. Returns true/false. */}
    const passwordMatches = await bcrypt.compare(password, user.password);
    if(!passwordMatches){
        return res.status(401).json({message: "Invalid email or password"});
    }

    {/** jwt.sign(payload, secret, options) — creates the signed token:
        payload — the data embedded in the token (id, role — enough to identify the user, nothing sensitive)
        secret — your JWT_SECRET, used to produce the signature
        expiresIn: '7d' — tokens don't last forever; after 7 days this one stops being valid, forcing a fresh login. Good default security hygiene.
        */}
    const token = jwt.sign(
        {id: user.id , role:user.role},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );

    {/**Response includes both the token and basic user info
         the frontend needs the token for future requests,
         the user info to display things like "Welcome, [name]" without a separate request.*/}
    res.json({
        token,
        user: {id: user.id, name: user.name,email:user.email,role:user.role},
    });
}

module.exports = {register,login};