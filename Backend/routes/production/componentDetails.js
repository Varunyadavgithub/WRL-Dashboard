import express from "express";
import { getComponentDetails } from "../../controllers/production/componentDetails.js";

const route = express.Router();

route.get("/component-details", getComponentDetails);

export default route;
