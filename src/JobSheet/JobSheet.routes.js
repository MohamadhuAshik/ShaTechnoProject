const express = require("express");
const { getProductType, getJobSheet, getProjectDetails, postCompanyMaster } = require("./JobSheetCreation.controller");

const router =express.Router()



router.get('/getProductType/:id',getProductType)

router.get("/getJobSheet",getJobSheet)

router.get("/getProjectDetails",getProjectDetails)

router.post("/postCompanyDetails",postCompanyMaster)

module.exports =router