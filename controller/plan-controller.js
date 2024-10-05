import client from '../config/redisClient.js';
import {validateJson, generateETag} from '../utils/schemaValidator.js'

// create a new plan
export const createPlan = async (req, res) => {
    const planData = req.body;

    // Validate JSON schema
    const validationErrors = validateJson(planData);  
    if (validationErrors) {
        return res.status(400).json({ 
            message: 'Missing or Invalid fields in request body', 
            status_code: 400,
            errors: validationErrors.map(error => error.message)  
        });
    }

    const objectId = planData.objectId;

    // Check if the plan with this ID already exists
    const existingPlan = await client.get(`data:${objectId}`);
    // console.log(existingPlan);
    if (existingPlan) {
        return res.status(409).json({ 
            message: 'Plan with this ID already exists', 
            status_code: 409 
        });
    }

    await client.set(`data:${objectId}`, JSON.stringify(planData));
    const eTag = generateETag(planData);
    res.set('ETag', eTag);
    return res.status(201).json({ 
        message: 'Plan created successfully', 
        status_code: 201 
    });
};


// Get a plan by objectId
export const getPlan = async (req, res) => {
    const { id } = req.params;
    const ifNoneMatch = req.headers['if-none-match'];

    
    if (req.method === 'GET' && Object.keys(req.body).length > 0) {
        return res.status(400).json({ message: 'GET requests should not have a body' });
    }

    
    const plan = await client.get(`data:${id}`);
    if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
    }

    const parsedPlan = JSON.parse(plan);
    const eTag = generateETag(parsedPlan);

    // Check if If-None-Match header matches the ETag of the stored data
    if (ifNoneMatch === eTag) {
        return res.status(304).send();  // Not Modified
    }

    res.set('ETag', eTag);
    return res.status(200).json(parsedPlan);
};

// to get all plan
export const getAllPlans = async (req, res) => {
    const ifNoneMatch = req.headers['if-none-match'];

    try {
        
        const keys = await client.keys('data:*'); 
        
        if (keys.length === 0) {
            return res.status(404).json({ message: 'No plans found' });
        }

        // Retrieve all plans for the matched keys
        const plans = await Promise.all(keys.map(async (key) => {
            const plan = await client.get(key);
            return JSON.parse(plan); // Deserialize each plan from Redis
        }));

        const eTag = generateETag(plans);

        if (ifNoneMatch === eTag) {
            return res.status(304).send();  // Not Modified
        }

        res.set('ETag', eTag);
        return res.status(200).json(plans);
    } catch (error) {
        console.error('Error fetching all plans:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Delete a plan by objectId
export const deletePlan = async (req, res) => {
    const { id } = req.params;

    const result = await client.del(`data:${id}`);
    if (result === 0) {
        return res.status(404).json({ message: 'Plan not found' });
    }

    return res.status(204).send();  // No Content
};
