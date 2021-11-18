const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const DBService = require('../dbService');
const dotenv = require('dotenv');
dotenv.config();


router.get('/', (req, res) => res.render('welcome'));
router.get('/dashboard', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user_name: req.user.name
    }));

// about us

router.get('/about', (req, res) => { res.render('aboutus') });

router.get('/create', ensureAuthenticated, (req, res) => res.render('create', {
    owner_name: req.user.name
}));
router.post('/insert', (req, res) => {
    const { name, location, menu, price, owner_name } = req.body;

    const DB = DBService.getDBServiceInstance();
    const result = DB.insertNewService(name, location, menu, price, owner_name);

    result
        .then(data => res.json({ success: data }))
        .catch(err => console.log(err));
    // .then(req.flash('success_msg', 'Added Successfully!'));
});

// get by user 

router.get('/getByUser/:name', (request, response) => {
    const { name } = request.params;
    const DB = DBService.getDBServiceInstance();

    const result = DB.getByUser(name);
    result
        .then(data => response.json({ data: data }))
        .catch(err => console.log(err))
});


// Search

router.get('/searchPage', (req, res) => res.render('results'));
router.get('/search/:location', (req, res) => {
    let { location } = req.params;
    const DB = DBService.getDBServiceInstance();

    const result = DB.searchByLocation(location);
    result
        .then(data => res.json({ data: data }))
        .catch(err => console.log(err));
})

//update 
router.patch('/update', (request, response) => {
    const { id, new_name, new_location, new_menu, new_price } = request.body;
    const db = DBService.getDBServiceInstance();

    const result = db.updateServiceById(id, new_name, new_location, new_menu, new_price);

    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err));
});

// delete

router.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const DB = DBService.getDBServiceInstance();

    const result = DB.deleteServiceById(id);
    result
        .then(data => response.json({ success: data }))
        .catch(err => console.log(err))
})

module.exports = router;