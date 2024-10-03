const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { PORT, REACT_BASE_URL } = require("./config/envConfig");
const db = require('./db/connection')
const adminRoute = require("./routes/adminRoutes")
const authRoute = require("./routes/authRoutes")
const masterRoute = require("./routes/masterRoutes")
const app = express();

app.use(cors({
    origin: [REACT_BASE_URL],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(adminRoute);
app.use(authRoute);
app.use(masterRoute)
app.use("/uploads", express.static("./uploads"))

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Message: 'We need a token, please provide it.' });
    } else {
        jwt.verify(token, 'our-jsonwebtoken-secret-key', (err, decoded) => {
            if (err) {
                res.clearCookie('token');
                return res.json({ Message: 'Authentication Error.', redirect: '/login' });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

const sessionRoute = (req, res) => {
    res.header('Access-Control-Allow-Origin',   );
    res.header('Access-Control-Allow-Credentials', true);
    res.json({ Status: 'Success', name: req.name });
};


app.get('/session', verifyUser, sessionRoute);

app.listen(PORT, () => {
    console.log(`Server running at Port ${PORT}`);
}) 