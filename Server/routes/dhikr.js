var express = require('express');
var router = express.Router();
let Dhikr = require("../model/dhikr.js");

// GET /dhikr - List all Dhikr
router.get('/', async (req, res, next) => {
    try {
        const DhikrList = await Dhikr.find();
        res.render('Dhikr/list', {
            title: 'Dhikr List', // Title is passed here
            displayName: req.user ? req.user.displayName : '',
            DhikrList: DhikrList
        });
    } catch (err) {
        console.error(err);
        res.render('Dhikr/list', {
            title: 'Error',
            error: 'Error retrieving the Dhikr list.'
        });
    }
});

// GET /dhikr/add - Render the Add page
router.get('/add', async (req, res, next) => {
    try {
        res.render('Dhikr/add', {
            title: 'Add Dhikr', // Title is passed here
            displayName: req.user ? req.user.displayName : ''
        });
    } catch (err) {
        console.error(err);
        res.render('Dhikr/list', {
            title: 'Error',
            error: 'Error loading the Add Dhikr page.'
        });
    }
});

// POST /dhikr/add - Add a new Dhikr
router.post('/add', async (req, res, next) => {
    try {
        let newDhikr = new Dhikr({
            Name: req.body.Name,
            content: req.body.content,
            category: req.body.category,
            reward: req.body.reward,
            timesRecited: req.body.timesRecited
        });
        await newDhikr.save();
        res.redirect('/dhikr');
    } catch (err) {
        console.error(err);
        res.render('Dhikr/add', {
            title: 'Add Dhikr',
            error: 'Error saving the Dhikr.'
        });
    }
});

// GET /dhikr/edit/:id - Render Edit page
router.get('/edit/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const dhikrToEdit = await Dhikr.findById(id);

        if (!dhikrToEdit) {
            return res.render('Dhikr/list', {
                title: 'Dhikr List',
                error: 'Dhikr not found.',
            });
        }

        res.render('Dhikr/edit', {
            title: 'Edit Dhikr',
            displayName: req.user ? req.user.displayName : '',
            Dhikr: dhikrToEdit, // Pass the Dhikr object to the view
        });
    } catch (err) {
        console.error(err);
        res.render('Dhikr/list', {
            title: 'Error',
            error: 'Error loading the Edit Dhikr page.',
        });
    }
});
router.post('/edit/:id', async (req, res, next) => {
    try {
        const id = req.params.id;

        // Update the document in the database
        await Dhikr.findByIdAndUpdate(id, {
            Name: req.body.Name,
            content: req.body.content,
            category: req.body.category,
            reward: req.body.reward,
            timesRecited: req.body.timesRecited
        });

        // Redirect back to the list page after update
        res.redirect('/dhikr');
    } catch (err) {
        console.error(err);
        res.render('Dhikr/edit', {
            title: 'Edit Dhikr',
            error: 'Error updating the Dhikr.',
            Dhikr: req.body // Pass the current form data back to the view
        });
    }
});
// GET /dhikr/delete/:id - Delete a Dhikr
router.get('/delete/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await Dhikr.findByIdAndDelete(id);
        res.redirect('/dhikr');
    } catch (err) {
        console.error(err);
        res.render('Dhikr/list', {
            title: 'Error',
            error: 'Error deleting the Dhikr.'
        });
    }
});

module.exports = router;
