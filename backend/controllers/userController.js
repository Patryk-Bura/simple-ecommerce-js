const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
    const { email, password, username } = req.body;

    try {
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email juz istnieje.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            username,
        });

        return res.status(201).json({ message: 'Rejestracja zakonczona sukcesem', user: newUser });
    } catch (err) {
        return res.status(500).json({ message: 'Bladd serwera', error: err.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Uzytkownik nie znaleziony.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Niepoprawne haslo.' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, isAdmin: user.isAdmin },
            'secretKey',
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'Logowanie zakoñczone sukcesem.',
            token,
            isAdmin: user.isAdmin,
            userId: user.id
        });
    } catch (err) {
        return res.status(500).json({ message: 'Blad serwera', error: err.message });
    }
};

