import express, { Request, Response } from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

interface Employee {
  id: string;
  firstname: string;
  lastname: string;
  age: number;
  isMarried: boolean;
}

// In-memory DB
let employees: Employee[] = [];

// GET all employees
app.get("/employees", (req: Request, res: Response) => {
  res.json(employees);
});

// GET one employee by ID
app.get("/employees/:id", (req: Request, res: Response) => {
  const employee = employees.find((e) => e.id === req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found" });
  res.json(employee);
});

// POST add employee
app.post("/employees", (req: Request, res: Response) => {
  const { firstname, lastname, age, isMarried } = req.body;
  const newEmployee: Employee = {
    id: uuid(),
    firstname,
    lastname,
    age,
    isMarried,
  };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

// PUT update employee
app.put("/employees/:id", (req: Request, res: Response) => {
  const index = employees.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Employee not found" });

  employees[index] = { ...employees[index], ...req.body };
  res.json(employees[index]);
});

// DELETE employee
app.delete("/employees/:id", (req: Request, res: Response) => {
  employees = employees.filter((e) => e.id !== req.params.id);
  res.json({ message: "Employee deleted" });
});

// SEARCH employees by firstname
app.get("/employees/search", (req: Request, res: Response) => {
  const firstname = req.query.firstname?.toString().toLowerCase();
  const results = employees.filter((e) =>
    e.firstname.toLowerCase().includes(firstname || "")
  );
  res.json(results);
});

const PORT = process.env.PORT || 3500;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
