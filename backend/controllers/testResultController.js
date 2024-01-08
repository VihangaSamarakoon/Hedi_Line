const TestResult = require('../models/testResultModel')
const Test = require('../models/testModel')
const mongoose = require('mongoose')


getPendingTestResults = async (req,res) => {
    try {
        const testResults = await TestResult.find({status: 'pending'})
            .populate('patient')
            .populate('test')
            .populate('sample')
            .populate('bill')
            .populate('result.category')
            .sort({createdAt: -1})
            .exec();

        res.status(200).json(testResults);    
    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Error retrieving test results', error: err}); 
    }
}

getCompletedTestResults = async (req,res) => {
    try {
        const testResults = await TestResult.find({status: 'completed'})
            .populate('patient')
            .populate('test')
            .populate('sample')
            .populate('bill')
            .populate('result.category')
            .sort({createdAt: -1})
            .exec();

        res.status(200).json(testResults);    
    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Error retrieving test results', error: err}); 
    }
}

//getTestResult
const getTestResult = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such testResult'})
    } // this code checks whether its a valid id

  const testResult = await TestResult.findById(id)
  .populate('patient')
  .populate('test')
  .populate('sample')
  .populate('bill')
  .populate('result.category')
  .sort({createdAt: -1})
  .exec();

  if(!testResult){
      return res.status(404).json({error: 'No such testResult'})
  }

  res.status(200).json(testResult)
}

//create a new test result through api call
const createTestResult = async (req, res) => {
    try {
      const { patientId, testId, sampleId, billId} = req.body;
  
      const testResult = await TestResult.create({
        patient: patientId,
        test: testId,
        sample: sampleId,
        bill: billId,
        result: []
      });
      
      const test = await Test.findById(testId).populate('subCategories');

      const resultCategories = test.subCategories.map(subCategory => ({
        category: subCategory._id,
        value: null,
      }));
  
      testResult.result = resultCategories;
  
      await testResult.save();
      res.status(201).json(testResult);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
//create test result through parameters
const createTestResultParams = async (patientId, testId, sampleId, billId) => {
  try {
    const testResult = new TestResult({
      patient: patientId,
      test: testId,
      sample: sampleId,
      bill: billId,
      result: [],
    });

    const test = await Test.findById(testId).populate('subCategories');

    const resultCategories = test.subCategories.map(subCategory => ({
      category: subCategory._id,
      value: null,
    }));

    testResult.result = resultCategories;

    await testResult.save();

    return testResult;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create test result');
  }
};

//update test result
const updateTestResult = async (req, res) => {
  const { id } = req.params
  const { result } = req.body;

  let emptyFields = []
  for (let i = 0; i < result.length; i++) {
    if (!result[i].value) {
      emptyFields.push(i)
    }
  }

  if(emptyFields.length > 0){
    return res.status(400).json({error: "Please fill in all the fields", emptyFields })
}

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such testResult'})
  }

  const testResult = await TestResult.findOneAndUpdate({_id: id}, {
    ...req.body // spreading the object
  },{ new: true })

  if (!testResult) {
    return res.status(400).json({error: 'No such testResult'})
  }

  if(emptyFields.length ==0){
    res.status(200).json(testResult)
}
}  

//delete a testresult
const deleteTestResult = async (req, res) => {
  const{ id } = req.params

  if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No such testResult'})
    }

  const testResult = await TestResult.findOneAndDelete({_id: id}) 
  //explicitly telling Mongoose to search for a document where the _id 
  //property matches the value of id 

  if(!testResult) {
      return res.status(400).json({error: 'No such testResult'})
    }
  
    res.status(200).json(testResult)
}

//delete a testresult with sampleid
const deleteTestResultWithSample = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid sample ID' });
  }

  try {
    const testResult = await TestResult.findOneAndDelete({ sample: id });
    if (!testResult) {
      return res.status(404).json({ error: 'TestResult not found' });
    }
    return res.status(200).json(testResult);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

  
    
module.exports = {
    createTestResult,
    createTestResultParams,
    getPendingTestResults,
    getCompletedTestResults,
    getTestResult,
    updateTestResult,
    deleteTestResult,
    deleteTestResultWithSample
}