const { z } = require('zod');

// Schema for auth registration
const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    firstName: z.string().min(2, "First name is too short").optional(),
    lastName: z.string().optional(),
    role: z.enum(['customer', 'employee']).default('customer')
  })
});

// Schema for auth login
const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

const riskRequestSchema = z.object({
  body: z.object({
    income: z.number().min(0, 'Income cannot be negative'),
    debtAmount: z.number().min(0, 'Debt cannot be negative'),
    creditScore: z.number().int().min(300).max(900),
    strategyType: z.string().optional()
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  riskRequestSchema
};
