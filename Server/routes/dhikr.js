var express = require('express');
var router = express.Router();
let mongoose=require('mongoose');
//Telling my router that i have this model

let Dhikr = require("../model/dhikr.js")
let dhikrController = require('../Controllers/dhikr.js')
function requireAuth(req,res,next)
{
    if (!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}
 

router.get('/',async(req,res,next)=>{
try{
    const DhikrList= await Dhikr.find();
    res.render('Dhikr/list', {
        title:'Dhikr List',
        displayName: req.user?req.user.displayName:'',
        DhikrList:DhikrList
    })}
    catch(err){
        console.error(err);
        res.render('Dhikr/list',{
            title: 'Error',
            error:'Error on the server'
        })
    }
    });

router.get('/add',async(req,res,next)=>{
    try{
        res.render('Dhikr/add',{
            title: 'Add Dhikr',
            displayName: req.user?req.user.displayName:'' 
        })

    }
    catch(err)
    {
        console.error(err);
        res.render('Dhikr/list',{
            error:'Error on the server'
        })
    }
});



router.post('/add',async(req,res,next)=>{
    try{
        let newDhikr= new Dhikr ({
            "Name":req.body.Name,
            "content":req.body.content,
            "category":req.body.category,
            "reward":req.body.reward,
            "timesRecited":req.body.timesRecited
        });
        await newDhikr.save()
            res.redirect('/dhikr');
        }
    
    catch(err)
        {
            console.error(err);
            res.render('Dhikr/list',{
                error:'Error on the server'
            })

        }
    })

router.get('/edit/:id',async(req,res,next)=>{
    try{
        const id=req.params.id;
        const dhikrToEdit=await Dhikr.findById(id);
        res.render('Dhikr/edit',
            {
                title:'Edit Dhikr',
                displayName: req.user?req.user.displayName:'',
                Dhikr:dhikrToEdit
            }
        )
    }
    catch(err)
    {
        console.error(err);
        next(err); //passing the error
    }
});
router.post('/edit/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        await Dhikr.findByIdAndUpdate(id, {
            "Name":req.body.Name,
            "content":req.body.content,
            "category":req.body.category,
            "reward":req.body.reward,
            "timesRecited":req.body.timesRecited
        })
        await Dhikr.findByIdAndUpdate (id,updatedDhikr).then(()=>{
            res.redirect('/')
        })
    }
    catch(err){
        console.error(err);
        res.render('Dhikr/list',{
            error:'Error on the server'
        })
    }
});
router.get('/delete/:id',async(req,res,next)=>{
    try{
        let id=req.params.id;
        await Dhikr.deleteOne({_id:id}).then(()=>{
            res.redirect('/')
        })
    }
    catch(error){
        console.error(err);
        res.render('Dhikr/list',{
            error:'Error on the server'
        })
    }
});
module.exports=router;