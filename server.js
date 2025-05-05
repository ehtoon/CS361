const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 12345;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true
}));

// In-memory user store
const users = {
    'admin': { password: '1234', favorites: [] }
};

// Sample Marvel Rivals Data with added fields (image, bio, and role)
const characters = [
    {
        id: 1,
        hero: 'Iron Man',
        image: 'https://shared-static-prod.epicgames.com/epic-achievements/eb15454c010f4a748498cd3a62096a52/38e211ced4e448a5a653a8d1e13fef18/icons/759e2c753f325326d54bc27249bb02a9',
        bio: 'Armed with superior intellect and a nanotech battlesuit of his own design, Tony Stark stands alongside gods as the Invincible Iron Man. His state of the art armor turns any battlefield into his personal playground, allowing him to steal the spotlight he so desperately desires.',
        role: 'Duelist'
    },
    {
        id: 2,
        hero: 'Thor',
        image: 'https://static.wikia.nocookie.net/marvel-rivals/images/3/3a/AchIcon_DivineJustice.jpg/revision/latest/scale-to-width-down/256?cb=20250107183732',
        bio: 'The son of Odin taps into his divine power to call forth thunder and lightning, raining down relentless fury upon his enemies. With his mighty hammer Mjolnir in hand, Thor effortlessly asserts his dominance on the field of combat.',
        role: 'Vanguard'
    },
    {
        id: 3,
        hero: 'Spider-Man',
        image: 'https://static.wikia.nocookie.net/marvel-rivals/images/f/f1/AchIcon_SpiderSense.jpg/revision/latest/scale-to-width-down/256?cb=20250107191147',
        bio: 'Swinging around the arena on his signature weblines, your friendly neighborhood Spider-Man, AKA Peter Parker, catches his rivals by surprise with sneaky, sticky bursts of webbing and unexpected attacks from above. Look out… here comes the Spider-Man!',
        role: 'Duelist'
    },
    {
        id: 4,
        hero: 'Hulk',
        image: 'https://static.wikia.nocookie.net/marvel-rivals/images/1/13/AchIcon_SmartSmash.jpg/revision/latest/scale-to-width-down/256?cb=20250107182058',
        bio: 'Brilliant scientist Dr. Bruce Banner has finally found a way to coexist with his monstrous alter ego, the Hulk. By accumulating gamma energy over multiple transformations, he can become a wise and strong Hero Hulk or a fierce and destructive Monster Hulk – a true force of fury on the battlefield!',
        role: 'Vanguard'
    },
    {
        id: 5,
        hero: 'Luna Snow',
        image: 'https://static.wikia.nocookie.net/marvel-rivals/images/3/30/AchIcon_MultiverseTour.jpg/revision/latest/scale-to-width-down/256?cb=20250104204053',
        bio: 'Equal parts pop star and Super Hero, Luna Snow puts on a dazzling show with both her light and dark ice powers. The arena is her stage, where Seol Hee and her team orchestrate spectacular displays that earn her an ever-increasing number of fans and wins.',
        role: 'Specialist'
    }
];



// Routes
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/api/characters', (req, res) => {
    res.json(characters);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === '1234') {
        req.session.user = username;
        res.redirect('/?login=1'); 
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/?logout=1'); // Redirect to home page with
    });
});

app.post('/api/favorite', (req, res) => {
    if (!req.session.user) return res.status(401).send('Login required');

    const { id } = req.body;
    const favorites = users[req.session.user].favorites;
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
    } else {
        favorites.splice(index, 1);
    }
    res.json({ favorites });
});

app.get('/api/favorites', (req, res) => {
    if (!req.session.user) return res.json([]);
    res.json(users[req.session.user].favorites);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
