import { Router } from "express";
import { registerEmployee,getAllEmployees, loginEmployee,updateEmployee,deleteEmployee, addEmployee } from "../Controllers/employeeController.js";
import { recommendProjectTeam } from "../utils/groq.js";
const router = Router();

// POST /api/employees/register
router.post("/register", registerEmployee);
router.get("/getEmployees", getAllEmployees);
router.post("/projectTeam",recommendProjectTeam);
router.post("/LoginEmployee",loginEmployee);


router.put("/updateEmployees/:id",updateEmployee);
router.delete("/deleteEmployees/:id",deleteEmployee);

router.post("/AddEmployee",addEmployee)
export default router;
