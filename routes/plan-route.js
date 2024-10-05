import express from 'express';
import { createPlan, getAllPlans, getPlan, deletePlan } from '../controller/plan-controller.js';

const planRouter =  express.Router();
// Routes
planRouter.post('/', createPlan);         
planRouter.get('/:id', getPlan);        
planRouter.get('/', getAllPlans); 
planRouter.delete('/:id', deletePlan);   



export default planRouter;