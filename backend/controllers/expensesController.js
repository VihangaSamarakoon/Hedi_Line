const Expenses = require('../models/expensesModel')
const mongoose = require('mongoose')


//get all expenses
const getallexpenses = async (req,res) => {
    const expenses = await Expenses.find({}).sort({createdAt: -1})

    res.status(200).json(expenses)
}


//get a single expense
const getAexpense = async (req, res) => {
    const { id } = req.params 

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'no such expense'})
    }

    const expense = await Expenses.findById(id)
    if(!expense){
        return res.status(404).jason({error: "no such expense"})
    }

    res.status(200).json(expense)
}


//create a new expense
const createexpenses = async (req,res) => {
    const { description, amount } = req.body;
    const date = new Date()

    let emptyFields = []

    if(!description){
        emptyFields.push('description')
    }
    if(!amount){
        emptyFields.push('amount')
    }
    if(emptyFields.length > 0){
        return res.status(400).json({error: "please fill all the fields", emptyFields })
    }

//add doc to db
try{
    const expenses = await Expenses.create({date, description, amount})
    res.status(200).json(expenses)
 } catch (error) {
    res.status(400).json({error: error.message})
   
 }

}

//delete a expense
const deleteexpenses = async (req,res) => {
    const { id } = req.params


    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'no such expense'})
    }

    const expenses = await Expenses.findOneAndDelete({_id: id})

    if(!expenses){
        return res.status(400).json({error: 'No such expenses'})
    }

    res.status(200).json(expenses)

}


//update expenses
const updateexpenses = async (req,res) => {
    const{ id } = req.params

    const { description, amount} = req.body;
    

    let emptyFields = []

    if(!description){
        emptyFields.push('description')
    }
    if(!amount){
        emptyFields.push('amount')
    }
    
    if(emptyFields.length > 0){
        return res.status(400).json({error: "Please fill all the fields", emptyFields })
    }


    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'no such expense'})
    }

    const expenses = await Expenses.findOneAndUpdate({_id: id},{
        ...req.body 
    }
    )

    if(!expenses){
        return res.status(400).json({error: 'No such expenses'})
    }

    if(emptyFields.length ==0){
        res.status(200).json(expenses)
    }
    
}


module.exports = {
    getallexpenses,
    getAexpense,
    createexpenses,
    deleteexpenses,
    updateexpenses
}